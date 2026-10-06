import { useEffect } from 'react';

import { ScrollViewStyleReset } from 'expo-router/html';

// Web metadata for every page. Expo Router renders this into the exported
// HTML shell, so the browser tab / window title shows the product name
// ("GrAteApex Hub") instead of falling back to the development URL.
//
// `ScrollViewStyleReset` is kept so scrolling behaves like the app.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* No static <title> here on purpose: Expo Router's static export
            emits its own empty <title> first, and browsers use the FIRST one
            they find, which is what caused the tab to show "localhost:8081".
            The correct title is applied on the client by <TitleSync /> below,
            and the social/preview metadata lives in the head. */}
        <meta
          name="description"
          content="GrAteApex Hub — a focused learning app for medical students. Work through lectures, test your understanding and track your progression."
        />

        {/* Open Graph / social preview */}
        <meta property="og:title" content="GrAteApex Hub" />
        <meta
          property="og:description"
          content="A focused learning app for medical students."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="GrAteApex Hub" />

        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="GrAteApex Hub" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Keep the theme colour in sync with the splash screen */}
        <meta name="theme-color" content="#1436B8" />

        {/* The display font (Manrope) is added after start-up by
            lib/web-fonts.ts, so it can never block the first paint. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>
        {/* Expo Router injects its own empty <title> ahead of anything in
            this file when statically exporting, so the browser would fall
            back to showing the URL. Setting it here guarantees the tab reads
            "GrAteApex Hub" in both development and the exported build. */}
        <TitleSync />
        {children}
      </body>
    </html>
  );
}

// Keeps document.title pinned to the product name on the client.
function TitleSync() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = 'GrAteApex Hub';
    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      (window as Window & { grateapexInstallPrompt?: Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> } }).grateapexInstallPrompt = event as Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
      window.dispatchEvent(new Event('grateapex-install-prompt'));
    };
    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }
  }, []);

  return null;
}

// Shown for a split second before the app paints (and behind the intro).
// Matches the Apex field so there is no flash of a different colour.
const responsiveBackground = `
body {
  background-color: #1436B8;
}
`;
