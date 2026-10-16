import { useEffect, useRef, useState } from 'react';

// Seconds of simulated time, for animated drawings. Runs at about 30
// frames a second, `slowdown` times slower than real time, and stands
// still (keeping its place) when `running` is false — paused, or reduced
// motion.
export function useSimClock(running: boolean, slowdown = 4): number {
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = 0;
    let start: number | null = null;
    const offset = timeRef.current;
    const tick = (now: number) => {
      if (start === null) start = now;
      if (now - last > 32) {
        last = now;
        timeRef.current = offset + (now - start) / 1000 / slowdown;
        setTime(timeRef.current);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, slowdown]);
  return time;
}
