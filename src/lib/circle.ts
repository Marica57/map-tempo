// Geometrija kružne vizualizacije (Odbrojavanje, Intervali).
// viewBox 0 0 240 240, središte (120,120), polumjer 90.
export const R = 90;
export const CIRC = 2 * Math.PI * R;

/** stroke-dashoffset za prsten napretka (prog 0..1). */
export function ringOffset(prog: number): number {
  return CIRC * (1 - Math.max(0, Math.min(1, prog)));
}

/** Pozicija točke na kružnici; start s vrha (12h), smjer kazaljke. */
export function dotPos(prog: number): { cx: number; cy: number } {
  const a = ((-90 + 360 * prog) * Math.PI) / 180;
  return { cx: 120 + R * Math.cos(a), cy: 120 + R * Math.sin(a) };
}

/** Postavi prsten + točku na zadani napredak (izravno preko DOM refova). */
export function paintCircle(
  ring: SVGCircleElement | null,
  dot: SVGCircleElement | null,
  prog: number,
) {
  if (ring) ring.style.strokeDashoffset = String(ringOffset(prog));
  if (dot) {
    const p = dotPos(prog);
    dot.setAttribute('cx', String(p.cx));
    dot.setAttribute('cy', String(p.cy));
  }
}

/** Inicijalizacija dasharray-a i početnog stanja (prog 0). */
export function initCircle(
  ring: SVGCircleElement | null,
  dot: SVGCircleElement | null,
) {
  if (ring) {
    ring.style.strokeDasharray = String(CIRC);
    ring.style.strokeDashoffset = String(CIRC);
  }
  paintCircle(ring, dot, 0);
}
