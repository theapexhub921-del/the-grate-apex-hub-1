// Friends data for Social V1.
//
// This is LOCAL SAMPLE DATA only — there is no backend, account system
// or networking yet. Screens must read friends through the functions
// below, so this module can later be swapped for real data without
// changing the screens.
//
// Kept completely separate from progress.ts and course/lesson data.

export type Friend = {
  id: string; // stable ID, e.g. 'friend-amara'
  name: string;
  detail: string; // short line shown under the name
};

export type FriendRequest = {
  id: string; // stable ID, e.g. 'request-kofi'
  name: string;
  detail: string;
};

const sampleFriends: Friend[] = [
  { id: 'friend-amara', name: 'Amara Okafor', detail: 'Classmate' },
  { id: 'friend-daniel', name: 'Daniel Mensah', detail: 'Classmate' },
  { id: 'friend-priya', name: 'Priya Sharma', detail: 'Study partner' },
  { id: 'friend-lucas', name: 'Lucas Ferreira', detail: 'Classmate' },
];

const sampleRequests: FriendRequest[] = [
  { id: 'request-kofi', name: 'Kofi Asante', detail: 'Wants to connect' },
  { id: 'request-sofia', name: 'Sofia Rossi', detail: 'Wants to connect' },
];

export function getFriends(): Friend[] {
  return sampleFriends;
}

export function getFriendRequests(): FriendRequest[] {
  return sampleRequests;
}

// Initials for the avatar circle, e.g. "Amara Okafor" -> "AO".
export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
