import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useWindowDimensions } from 'react-native';

import { setTabBarLocked } from '@/components/tab-bar-visibility';
import { recordAtlasQuiz } from '@/data/atlas-quiz';
import { parseAtlasQuizMessage } from '@/data/learning/atlas-quiz-rules';
import { ATLAS_PAGE, atlasFresh, atlasHash, atlasThemeVars } from '@/lib/atlas-theme';
import { useTheme } from '@/hooks/use-theme';

// The 3D anatomy atlas (web): the standalone viewer in public/atlas/anatomy.html, shown
// inside the page and painted with the app's current theme. When the theme changes the
// viewer is re-coloured in place, so what the learner is looking at is not reloaded.
//
// Full screen: the bar above the viewer has a Full screen button. It asks the browser for real
// full screen and, where the browser won't (iPhone Safari), falls back to covering the whole
// page. Esc, or the same button, comes back. The viewer is never reloaded when switching.
export function SkeletonAtlas() {
  const colors = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const frame = useRef<HTMLIFrameElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const [full, setFull] = useState(false);
  const vars = useMemo(() => atlasThemeVars(colors), [colors]);

  // The address is fixed on first render: changing it later would reload the viewer.
  const [src] = useState(() => `${ATLAS_PAGE}${atlasFresh()}${atlasHash(vars)}`);

  // Send the current colours to the viewer (when it has loaded, and whenever the theme changes).
  const send = useCallback(() => {
    frame.current?.contentWindow?.postMessage({ type: 'grateapex-theme', vars }, window.location.origin);
  }, [vars]);

  useEffect(() => {
    send();
  }, [send]);

  // A finished atlas quiz round: save it (XP once a day + the streak) and tell the viewer how much XP it earned,
  // so it can show that on its score card. Only this viewer, on this same site, is listened to.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== frame.current?.contentWindow) return;
      const result = parseAtlasQuizMessage(event.data);
      if (!result) return;
      void recordAtlasQuiz(result)
        .then((amount) => {
          frame.current?.contentWindow?.postMessage(JSON.stringify({ type: 'quizXp', amount }), window.location.origin);
        })
        .catch(() => undefined); // not saved (e.g. offline): the quiz itself is unaffected
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const enterFull = () => {
    setFull(true);
    void shell.current?.requestFullscreen?.()?.catch(() => {});
  };
  const exitFull = useCallback(() => {
    setFull(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  }, []);

  // While full screen: Esc leaves, the page behind stops scrolling, and leaving real full
  // screen some other way (the browser's own Esc) is noticed.
  useEffect(() => {
    if (!full) return;
    setTabBarLocked(true); // the app's bottom bar sits above the page content, so it is taken away while full screen
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') exitFull();
    };
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setFull(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      setTabBarLocked(false);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [full, exitFull]);

  const height = Math.max(520, Math.min(windowHeight - 180, 860));

  const shellStyle: CSSProperties = full
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        background: colors.background,
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        height,
        borderRadius: 20,
        overflow: 'hidden',
        border: `1px solid ${colors.border}`,
        background: colors.background,
      };

  const bar: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '6px 10px 6px 14px',
    background: colors.surface,
    borderBottom: `1px solid ${colors.border}`,
    flex: 'none',
  };

  const button: CSSProperties = {
    minHeight: 36,
    padding: '0 14px',
    borderRadius: 10,
    border: `1px solid ${colors.border}`,
    background: colors.surfaceElevated,
    color: colors.text,
    font: 'inherit',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  };

  return (
    <div ref={shell} style={shellStyle}>
      <div style={bar}>
        <span style={{ color: colors.text, fontSize: 14, fontWeight: 700 }}>Anatomy atlas</span>
        <button
          type="button"
          style={button}
          onClick={full ? exitFull : enterFull}
          aria-label={full ? 'Exit full screen' : 'View atlas full screen'}
        >
          {full ? 'Exit full screen' : 'Full screen'}
        </button>
      </div>
      <iframe
        ref={frame}
        src={src}
        title="3D anatomy atlas"
        onLoad={send}
        allow="fullscreen"
        style={{ flex: 1, minHeight: 0, width: '100%', border: 0, display: 'block' }}
      />
    </div>
  );
}
