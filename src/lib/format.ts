const z = (n: number) => (n < 10 ? '0' : '') + n;

/** Štoperica: MM:SS.cc (minute:sekunde:stotinke). */
export function mmsscc(ms: number): string {
  const cs = Math.floor(ms / 10) % 100;
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000);
  if (m >= 60) {
    const h = Math.floor(m / 60);
    return `${h}:${z(m % 60)}:${z(s)}.${z(cs)}`;
  }
  return `${z(m)}:${z(s)}.${z(cs)}`;
}

/** M:SS iz ukupnih sekundi (za trajanja i ukupno vrijeme). */
export function msFmt(totalSec: number): string {
  const t = Math.max(0, Math.round(totalSec));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/** Veliki prikaz preostalih sekundi: cijele sekunde, M:SS za ≥ 60 s. */
export function bigSec(sec: number): string {
  const s = Math.max(0, Math.ceil(sec));
  return s >= 60 ? msFmt(s) : String(s);
}
