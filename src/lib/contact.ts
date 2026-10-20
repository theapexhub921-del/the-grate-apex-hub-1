import { Linking, Platform } from 'react-native';

import { EXPLORE_CONTACT } from '@/data/explore';

// "Contact us": opens the learner's email app with the team's address.
//
// On the web, react-native-web opens links with window.open(url, '_blank'),
// which for a mailto: link often shows a blank tab or nothing at all
// (installed web app, or no default mail app). Navigating the page itself is
// the reliable way to hand a mailto: link to the browser. Nothing is sent by
// the app — the address is also shown on screen so it can always be copied.

export const CONTACT_EMAIL = EXPLORE_CONTACT.email;

/** WhatsApp help groups, shown beside the email in Explore → Contact us. */
export const WHATSAPP_HELP_GROUPS = [
  { label: 'WhatsApp help group 1', url: 'https://chat.whatsapp.com/H42YpFvUdI10At4ocTl40g' },
  { label: 'WhatsApp help group 2', url: 'https://chat.whatsapp.com/LtkiajX8snQ7SD2kYC46Xe' },
] as const;

/** Opens a WhatsApp group invite (the WhatsApp app if installed, otherwise the browser). */
export async function openWhatsAppGroup(url: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener');
    return;
  }
  try {
    await Linking.openURL(url);
  } catch {
    // Nothing else to do: the link is also shown on screen.
  }
}

export const CONTACT_MAILTO = `mailto:${EXPLORE_CONTACT.email}?subject=${encodeURIComponent(EXPLORE_CONTACT.subject)}`;

/** Opens the email app. Resolves false when no email app could be opened. */
export async function openContactEmail(): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') return false;
    window.location.href = CONTACT_MAILTO;
    return true;
  }
  try {
    await Linking.openURL(CONTACT_MAILTO);
    return true;
  } catch {
    return false;
  }
}
