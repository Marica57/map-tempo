import { useCallback, useEffect, useRef } from 'react';

/**
 * Jednostavan requestAnimationFrame runner. `start(step)` pokreće petlju koja
 * poziva `step` svaki frame dok se ne pozove `stop()` ili se ne pokrene novi
 * `start`. Petlja se automatski zaustavlja pri unmountu.
 */
export function useRaf() {
  const raf = useRef<number | null>(null);
  const active = useRef<((t: number) => void) | null>(null);

  const stop = useCallback(() => {
    if (raf.current != null) cancelAnimationFrame(raf.current);
    raf.current = null;
    active.current = null;
  }, []);

  const start = useCallback((step: (t: number) => void) => {
    if (raf.current != null) cancelAnimationFrame(raf.current);
    active.current = step;
    const loop = (t: number) => {
      if (active.current !== step) return;
      step(t);
      if (active.current === step) raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => stop, [stop]);

  return { start, stop };
}
