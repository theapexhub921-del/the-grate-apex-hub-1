-- Profiles for GRATEAPEX learners (display name and avatar).
--
-- The original project created this table outside the repo. This migration
-- recreates it so a new project can be built from the migrations alone,
-- and adds the "profile on sign-up" trigger the app expects (the app only
-- ever UPDATES its own profile row; see src/lib/profiles.ts).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select on table public.profiles to authenticated;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

-- Create a profile row for every new account. The name comes from the
-- sign-up form (display_name) or from Google (full_name / name).
create or replace function public.grateapex_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(
      btrim(
        coalesce(
          new.raw_user_meta_data ->> 'display_name',
          new.raw_user_meta_data ->> 'full_name',
          new.raw_user_meta_data ->> 'name',
          ''
        )
      ),
      ''
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.grateapex_handle_new_user() from public, anon, authenticated;

drop trigger if exists grateapex_on_auth_user_created on auth.users;
create trigger grateapex_on_auth_user_created
  after insert on auth.users
  for each row execute function public.grateapex_handle_new_user();

-- Accounts that already exist get a profile row too.
insert into public.profiles (id, display_name)
select
  u.id,
  nullif(btrim(coalesce(u.raw_user_meta_data ->> 'display_name', u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', '')), '')
from auth.users u
on conflict (id) do nothing;
