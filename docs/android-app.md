# The Android app (APK)

The Android app is a **Trusted Web Activity**: a small Android app that opens
the live site, https://grateapex.vercel.app, full screen in Chrome, with its own
icon, name and splash screen. It uses the same Firebase backend and accounts as
the web app.

**New features reach it automatically.** Every push to `master` deploys the
site, and the installed app shows the new version the next time it opens. A new
APK is only needed to change the app's name, icon, colours or package id.

## Files

* `public/.well-known/assetlinks.json` — the site vouches for the app's signing
  key. Without it Android shows a browser address bar at the top of the app.
  `tests/deploy-wiring.test.mjs` checks it.
* `public/manifest.webmanifest` — the name, colours and icons the app was built from.
* **Not in this repository** (secret): the signing key and its passwords, in
  `C:\Users\User\GRATEAPEX-signing\` on the owner's PC
  (`grateapex-android-signing.keystore`, `grateapex-android-signing-PASSWORDS.txt`).
  Keep a backup. Without them the app can never be updated under the same name.
  The same folder holds the built `GrAte Apex Hub.apk` (to share and install),
  `GrAte Apex Hub.aab` (for the Google Play Store) and the Android source.

## Details

* Package id `com.grateapex.app`, version 1.0.0 (code 1), launcher name "GrAte Apex".
* Built on 2026-10-19 with PWABuilder (https://www.pwabuilder.com, Android →
  Google Play package, which uses Google's Bubblewrap). Signing key alias
  `grateapex`, SHA-256 fingerprint
  `70:FF:0D:A4:82:0B:4E:92:8B:CC:64:A1:1D:E5:40:1E:2A:3E:B7:08:76:40:6B:1A:07:93:4F:C6:B7:A4:F7:F5`.
* Notifications are delegated to the web app, so push alerts work as on the web.

## Making a new APK (only for name, icon or colour changes)

On pwabuilder.com enter the site address, choose Android, raise the version
code, and under signing choose "Use mine" with the keystore and passwords
above. The fingerprint must stay the same, otherwise update `assetlinks.json`.
