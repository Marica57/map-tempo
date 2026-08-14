import { useEffect, useRef, useState } from 'react';
import { audio } from '../lib/audio';
import { useRaf } from '../lib/useRaf';
import { useLocalStorage } from '../lib/useLocalStorage';
import { msFmt } from '../lib/format';
import { initCircle, paintCircle } from '../lib/circle';
import { CircleViz } from '../components/CircleViz';
import { Card, Field, NumberInput, PrimaryButton, GhostButton } from '../components/ui';

type PhaseType = 'priprema' | 'rad' | 'pauza' | 'serija' | 'oporavak';
type Phase = { t: PhaseType; d: number; s?: number; v?: number };
type Machine = {
  seq: Phase[];
  idx: number;
  off: number;
  t0: number;
  done: number; // zbroj trajanja dovršenih faza (s)
  total: number;
  last: number;
  active: boolean;
  sets: number;
  ex: number;
};

const COLOR: Record<PhaseType, string> = {
  rad: '#2B9CAD',
  pauza: '#94A3B8',
  serija: '#94A3B8',
  oporavak: '#10B981',
  priprema: '#F59E0B',
};
const LABEL: Record<PhaseType, string> = {
  rad: 'RAD',
  pauza: 'PAUZA',
  serija: 'IZMEĐU SERIJA',
  oporavak: 'OPORAVAK',
  priprema: 'PRIPREMA',
};

export default function Intervals() {
  const [prep, setPrep] = useLocalStorage('iv:prep', 5);
  const [work, setWork] = useLocalStorage('iv:work', 30);
  const [rest, setRest] = useLocalStorage('iv:rest', 15);
  const [exCount, setExCount] = useLocalStorage('iv:ex', 4);
  const [setsCount, setSetsCount] = useLocalStorage('iv:sets', 3);
  const [setRestV, setSetRestV] = useLocalStorage('iv:setrest', 60);
  const [recov, setRecov] = useLocalStorage('iv:recov', 0);

  const [running, setRunning] = useState(false);
  const [badge, setBadge] = useState<{ text: string; color: string | null }>({
    text: 'SPREMNO',
    color: null,
  });
  const [counts, setCounts] = useState('Serija 0 / 3 · Vježba 0 / 4');

  const ringRef = useRef<SVGCircleElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLParagraphElement>(null);
  const { start, stop } = useRaf();
  const m = useRef<Machine>({
    seq: [], idx: 0, off: 0, t0: 0, done: 0, total: 0, last: -1, active: false, sets: 3, ex: 4,
  });

  const build = (): Machine => {
    const p = Math.max(0, prep | 0);
    const w = Math.max(1, work | 0);
    const r = Math.max(0, rest | 0);
    const ex = Math.max(1, exCount | 0);
    const sets = Math.max(1, setsCount | 0);
    const sr = Math.max(0, setRestV | 0);
    const rc = Math.max(0, recov | 0);
    const seq: Phase[] = [];
    if (p > 0) seq.push({ t: 'priprema', d: p });
    for (let s = 1; s <= sets; s++) {
      for (let v = 1; v <= ex; v++) {
        seq.push({ t: 'rad', d: w, s, v });
        if (v < ex && r > 0) seq.push({ t: 'pauza', d: r, s, v });
      }
      if (s < sets && sr > 0) seq.push({ t: 'serija', d: sr, s });
    }
    if (rc > 0) seq.push({ t: 'oporavak', d: rc });
    const total = seq.reduce((a, b) => a + b.d, 0);
    return { ...m.current, seq, total, sets, ex };
  };

  const countsText = (ph: Phase, sets: number, ex: number) => {
    const cs = ph.s ?? (ph.t === 'oporavak' ? sets : 0);
    const cv = ph.v ?? 0;
    return `Serija ${cs} / ${sets} · Vježba ${cv} / ${ex}`;
  };

  const showIdle = () => {
    const b = build();
    m.current = { ...m.current, seq: b.seq, total: b.total, sets: b.sets, ex: b.ex, idx: 0, off: 0, done: 0, active: false };
    setBadge({ text: 'SPREMNO', color: null });
    setCounts(`Serija 0 / ${b.sets} · Vježba 0 / ${b.ex}`);
    if (ringRef.current) ringRef.current.setAttribute('stroke', '#2B9CAD');
    if (dotRef.current) dotRef.current.setAttribute('fill', '#2B9CAD');
    if (numRef.current) {
      numRef.current.style.color = '';
      numRef.current.textContent = '–';
    }
    initCircle(ringRef.current, dotRef.current);
    if (totalRef.current) totalRef.current.textContent = 'Ukupno: ' + msFmt(b.total);
  };

  useEffect(() => {
    showIdle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prep, work, rest, exCount, setsCount, setRestV, recov]);

  const enterPhase = (ph: Phase) => {
    const c = COLOR[ph.t];
    if (ringRef.current) ringRef.current.setAttribute('stroke', c);
    if (dotRef.current) dotRef.current.setAttribute('fill', c);
    if (numRef.current) numRef.current.style.color = c;
    setBadge({ text: LABEL[ph.t], color: c });
    setCounts(countsText(ph, m.current.sets, m.current.ex));
    if (ph.t === 'rad') audio.work();
    else if (ph.t === 'priprema') audio.soft();
    else audio.rest();
    audio.vibrate(ph.t === 'rad' ? 80 : 50);
  };

  const finish = () => {
    stop();
    m.current.active = false;
    setRunning(false);
    setBadge({ text: 'GOTOVO', color: null });
    if (numRef.current) numRef.current.textContent = '✓';
    audio.strong();
    audio.vibrate(150);
  };

  const step = () => {
    const s = m.current;
    const ph = s.seq[s.idx];
    const el = s.off + (performance.now() - s.t0) / 1000;
    const prog = Math.min(el / ph.d, 1);
    const rem = ph.d - el;
    paintCircle(ringRef.current, dotRef.current, prog);
    if (numRef.current) numRef.current.textContent = String(Math.max(0, Math.ceil(rem)));
    if (totalRef.current)
      totalRef.current.textContent = 'Ukupno preostalo: ' + msFmt(s.total - s.done - el);

    if (rem <= 3) {
      const sr = Math.ceil(rem);
      if (sr >= 1 && sr !== s.last) {
        s.last = sr;
        audio.soft();
      }
    }

    if (el >= ph.d) {
      s.done += ph.d;
      s.idx++;
      s.off = 0;
      s.t0 = performance.now();
      s.last = -1;
      if (s.idx >= s.seq.length) {
        finish();
        return;
      }
      enterPhase(s.seq[s.idx]);
    }
  };

  const begin = () => {
    audio.ensure();
    const b = build();
    if (!b.seq.length) return;
    m.current = { ...m.current, seq: b.seq, total: b.total, sets: b.sets, ex: b.ex, idx: 0, off: 0, done: 0, last: -1, active: true, t0: performance.now() };
    setRunning(true);
    enterPhase(b.seq[0]);
    start(step);
  };

  const resume = () => {
    m.current.t0 = performance.now();
    setRunning(true);
    start(step);
  };

  const pause = () => {
    m.current.off += (performance.now() - m.current.t0) / 1000;
    setRunning(false);
    stop();
  };

  const reset = () => {
    stop();
    setRunning(false);
    showIdle();
  };

  const toggle = () => {
    if (running) pause();
    else if (m.current.active) resume();
    else begin();
  };

  const P: [string, number, (n: number) => void][] = [
    ['Priprema (s)', prep, (n) => setPrep(n)],
    ['Rad (s)', work, (n) => setWork(n)],
    ['Pauza (s)', rest, (n) => setRest(n)],
    ['Broj vježbi', exCount, (n) => setExCount(n)],
    ['Broj serija', setsCount, (n) => setSetsCount(n)],
    ['Pauza serija (s)', setRestV, (n) => setSetRestV(n)],
    ['Oporavak (s)', recov, (n) => setRecov(n)],
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-center mb-2">
          <span
            className="inline-block px-3 py-1 rounded-full text-[13px] font-medium"
            style={
              badge.color
                ? { background: badge.color, color: '#fff' }
                : { background: 'rgba(148,163,184,0.18)', color: 'inherit' }
            }
          >
            {badge.text}
          </span>
        </div>
        <CircleViz ringRef={ringRef} dotRef={dotRef} numRef={numRef} color="#2B9CAD" />
        <p className="text-center text-sm text-text-secondary dark:text-text-secondary-dark mt-2">
          {counts}
        </p>
        <p
          ref={totalRef}
          className="text-center text-sm text-text-secondary dark:text-text-secondary-dark mt-0.5"
        >
          Ukupno: 0:00
        </p>
      </Card>

      <Card>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))' }}>
          {P.map(([label, val, setter]) => (
            <Field key={label} label={label}>
              <NumberInput
                value={val}
                min={label.startsWith('Rad') || label.startsWith('Broj') ? 1 : 0}
                onChange={(e) => setter(Math.max(0, +e.target.value || 0))}
              />
            </Field>
          ))}
        </div>
        <div className="flex gap-2 justify-center mt-4 flex-wrap">
          <PrimaryButton onClick={toggle}>
            {running ? '❙❙ Pauza' : m.current.active ? '▶ Nastavi' : '▶ Pokreni'}
          </PrimaryButton>
          <GhostButton onClick={reset}>↺ Reset</GhostButton>
        </div>
      </Card>
    </div>
  );
}
