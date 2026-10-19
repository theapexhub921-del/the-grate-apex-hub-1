// The live web app's address, kept in one place. Phones have no web address
// of their own, so they reach the server functions (api/), lecture pictures,
// the atlas and shared links here; the web app uses its own address.
import { Platform } from 'react-native';

export const LIVE_SITE = 'https://grateapex.vercel.app';

/** Shown to learners (no https://). */
export const LIVE_SITE_LABEL = LIVE_SITE.replace(/^https:\/\//, '');

/** Where files on the live site are fetched from: the page's own address on the web, the live site on phones. */
export const SITE_BASE = Platform.OS === 'web' ? '' : LIVE_SITE;

/** Where api/ calls go: like SITE_BASE, unless EXPO_PUBLIC_API_BASE points a local preview somewhere else. */
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || SITE_BASE;
