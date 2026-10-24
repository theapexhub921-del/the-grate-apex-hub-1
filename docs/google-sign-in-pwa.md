# Google sign-in in installed PWAs

The website uses Firebase popup sign-in. An installed PWA uses Firebase redirect sign-in with a helper proxied through the app's own domain, so the return can stay inside the hosted app.

## One-time Google and Firebase setup

Before the installed-PWA flow can finish, configure the existing Google OAuth web client:

1. In Firebase Console, open **Authentication → Settings → Authorized domains** and add `grateapex.vercel.app` if it is not already listed.
2. In Google Cloud Console, open the OAuth 2.0 web client used by Firebase Authentication and add this **Authorized redirect URI**:
   `https://grateapex.vercel.app/__/auth/handler`
3. Keep the existing `https://grate-apex.firebaseapp.com/__/auth/handler` URI too; the regular website continues to use it.

The web app's PWA flow uses `grateapex.vercel.app` as its Firebase auth domain. If the production app domain changes, update `EXPO_PUBLIC_PWA_AUTH_DOMAIN` in Vercel and the authorized URI above.

## Updates

Front-end and service-worker changes are delivered by deploying the website to Vercel. A new Microsoft Store package is only needed when the web app manifest changes (for example, the app name or icon).
