import { Icon, type IconName } from '@/components/ui/icon';

// The five GRATEAPEX destinations, in one place.
//
// Mobile uses these for the floating bottom tab bar; desktop uses the same
// list for the left navigation rail. Keeping one source means the two
// navigations can never drift apart, and the five-tab identity stays fixed.
//
// Order is the product order (owner's choice, 2026-10-03):
// Home, Learn, Social, Explore, Profile.

export type NavItem = {
  /** Expo Router route name used by <Tabs.Screen name="…" />. */
  route: string;
  /** Public label shown to the learner. */
  label: string;
  /** Path used for navigation and for the active-route check. */
  path: string;
  icon: IconName;
  accessibilityLabel: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { route: 'index', label: 'Home', path: '/', icon: 'home', accessibilityLabel: 'Home — your command centre' },
  { route: 'learn/index', label: 'Learn', path: '/learn', icon: 'learn', accessibilityLabel: 'Learn — subjects and lectures' },
  { route: 'social/index', label: 'Social', path: '/social', icon: 'social', accessibilityLabel: 'Social — your study community' },
  { route: 'explore', label: 'Explore', path: '/explore', icon: 'explore', accessibilityLabel: 'Explore — discovery and the GRATEAPEX journey' },
  { route: 'profile', label: 'Profile', path: '/profile', icon: 'profile', accessibilityLabel: 'Profile — your academic identity' },
];

// Which destination owns a path: '/learn/lesson' belongs to Learn,
// '/social/friends' to Social. Settings and Progress belong to none.
export function activeNavPath(pathname: string): string | null {
  if (pathname === '/' || pathname === '') return '/';
  const match = NAV_ITEMS.find((item) => item.path !== '/' && (pathname === item.path || pathname.startsWith(`${item.path}/`)));
  return match ? match.path : null;
}

/** Renders a nav icon at the given size and tint. */
export function NavIconView({
  icon,
  color,
  size,
  active = false,
}: {
  icon: IconName;
  color: string;
  size: number;
  active?: boolean;
}) {
  return <Icon name={icon} color={color} size={size} filled={active} strokeWidth={active ? 2 : 1.8} />;
}
