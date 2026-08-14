import { useEffect, useRef, useState } from 'react';
import { audio } from '../lib/audio';
import { useRaf } from '../lib/useRaf';
import { useLocalStorage } from '../lib/useLocalStorage';
import { Card, Field, NumberInput, TextInput, PrimaryButton, GhostButton } from '../components/ui';

type Phase = { d: number; from: number; to: number; name: string };
type Machine = {
  phases: Phase[];
  idx: number;
  off: number; // sekunde protekle u fazi prije trenutnog "chunk"-a
  t0: number; // performance.now() na početku chunk-a
  reps: number;
  total: number;
  prep: number;
  inPrep: boolean;
  active: boolean; // pokrenut (može biti pauziran)
  lastTick: number;
  lastPrep: number;
};

export type LineModeProps = {
  storageKey: string;
  labels: [string, string, string, string];
  counterWord: string; // "Ponav." | "Ciklus"
  defaultTempo: string;
  defaultReps: number;
  breathing?: boolean; // prikaz oznake faze veći + presetovi
};

const PRESETS_DISANJE = ['6060', '4444', '4780', '5050'];

export default function LineMode({
  storageKey,
  labels,
  counterWord,
  defaultTempo,
  defaultReps,
  breathing = false,
}: LineModeProps) {
  const [tempo, setTempo] = useLocalStorage(storageKey + ':tempo', defaultTempo);
  const [reps, setReps] = useLocalStorage(storageKey + ':reps', defaultReps);
  const [prep, setPrep] = useLocalStorage(storageKey + ':prep', 5);
  const [running, setRunning] = useState(false);
  const [phaseLabel, setPhaseLabel] = useState('Spremno');
  const [repText, setRepText] = useState(`${counterWord} 0 / ${defaultReps}`);

  const dotRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const { start, stop } = useRaf();

  const m = useRef<Machine>({
    phases: [], idx: 0, off: 0, t0: 0, reps: 0, total: defaultReps,
    prep: 5, inPrep: false, active: false, lastTick: -1, lastPrep: -1,
  });

  const trackW = () => (lineRef.current?.clientWidth ?? 300) - 48;
  const setDot = (f: number) => {
    if (dotRef.current) dotRef.current.style.left = 24 + f * trackW() + 'px';
  };

  const digits = (v: string) => (v.replace(/\D/g, '') + '0000').slice(0, 4);

  const buildPhases = (): Phase[] => {
    const d = digits(tempo);
    return [
      { d: +d[0], from: 0, to: 1, name: labels[0] },
      { d: +d[1], from: 1, to: 1, name: labels[1] },
      { d: +d[2], from: 1, to: 0, name: labels[2] },
      { d: +d[3], from: 0, to: 0, name: labels[3] },
    ].filter((p) => p.d > 0);
  };

  const setRep = (n: number) => setRepText(`${counterWord} ${n} / ${m.current.total}`);

  useEffect(() => {
    setDot(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = () => {
    const s = m.current;
    const el = s.off + (performance.now() - s.t0) / 1000;

    if (s.inPrep) {
      const rem = Math.ceil(s.prep - el);
      if (countRef.current) countRef.current.textContent = String(Math.max(0, rem));
      setDot(0);
      if (rem <= 3 && rem >= 1 && rem !== s.lastPrep) {
        s.lastPrep = rem;
        audio.soft();
      }
      if (el >= s.prep) {
        audio.strong();
        audio.vibrate(60);
        s.inPrep = false;
        s.reps = 1;
        s.idx = 0;
        s.off = 0;
        s.t0 = performance.now();
        s.lastTick = -1;
        setPhaseLabel(s.phases[0].name);
        setRep(1);
      }
      return;
    }

    const ph = s.phases[s.idx];
    const f = ph.d ? Math.min(el / ph.d, 1) : 1;
    setDot(ph.from + (ph.to - ph.from) * f);
    if (countRef.current)
      countRef.current.textContent = String(Math.max(0, Math.ceil(ph.d - el)));

    const sec = Math.floor(el);
    if (sec > s.lastTick && sec > 0 && sec < ph.d) {
      s.lastTick = sec;
      audio.soft();
    }

    if (el >= ph.d) {
      audio.strong();
      audio.vibrate(40);
      s.lastTick = -1;
      s.idx++;
      s.off = 0;
      s.t0 = performance.now();
      if (s.idx >= s.phases.length) {
        s.idx = 0;
        s.reps++;
        if (s.reps > s.total) {
          finish();
          return;
        }
      }
      setPhaseLabel(s.phases[s.idx].name);
      setRep(s.reps);
    }
  };

  const finish = () => {
    stop();
    m.current.active = false;
    setRunning(false);
    setPhaseLabel('Gotovo');
    if (countRef.current) countRef.current.textContent = '✓';
    setRep(m.current.total);
  };

  const begin = () => {
    audio.ensure();
    const phases = buildPhases();
    if (!phases.length) return;
    const p = Math.max(0, prep | 0);
    m.current = {
      phases, idx: 0, off: 0, t0: performance.now(),
      reps: p > 0 ? 0 : 1, total: Math.max(1, reps | 0), prep: p,
      inPrep: p > 0, active: true, lastTick: -1, lastPrep: -1,
    };
    setRunning(true);
    setPhaseLabel(p > 0 ? 'Priprema' : phases[0].name);
    setRepText(`${counterWord} ${p > 0 ? 0 : 1} / ${m.current.total}`);
    start(step);
  };

  const pause = () => {
    const s = m.current;
    s.off = s.off + (performance.now() - s.t0) / 1000;
    setRunning(false);
    stop();
  };

  const resume = () => {
    m.current.t0 = performance.now();
    setRunning(true);
    start(step);
  };

  const reset = () => {
    stop();
    m.current.active = false;
    setRunning(false);
    setDot(0);
    if (countRef.current) countRef.current.textContent = '–';
    setPhaseLabel('Spremno');
    setRepText(`${counterWord} 0 / ${Math.max(1, reps | 0)}`);
  };

  const toggle = () => {
    if (running) pause();
    else if (m.current.active) resume();
    else begin();
  };

  return (
    <div className="space-y-4">
      <Card>
        <div ref={lineRef} className="relative h-28 mb-2">
          <div className="absolute left-6 right-6 top-[55px] h-1 rounded bg-border-light dark:bg-border-dark" />
          <div className="absolute left-5 top-[41px] w-0.5 h-8 bg-border-light dark:bg-border-dark" />
          <div className="absolute right-5 top-[41px] w-0.5 h-8 bg-border-light dark:bg-border-dark" />
          <div className="absolute left-3 top-[80px] text-xs text-text-secondary dark:text-text-secondary-dark">
            gore
          </div>
          <div className="absolute right-2 top-[80px] text-xs text-text-secondary dark:text-text-secondary-dark">
            dolje
          </div>
          <div
            ref={dotRef}
            className="absolute top-[46px] h-[22px] w-[22px] rounded-full -translate-x-1/2"
            style={{ left: 24, background: 'var(--accent)' }}
          />
        </div>
        <div
          className={
            'text-center text-text-secondary dark:text-text-secondary-dark ' +
            (breathing ? 'text-xl !text-text-primary dark:!text-text-primary-dark' : 'text-base')
          }
        >
          {phaseLabel}
        </div>
        <div
          ref={countRef}
          className="text-center text-[44px] leading-tight font-medium tabular-nums text-text-primary dark:text-text-primary-dark"
        >
          –
        </div>
        <div className="text-center text-sm text-text-secondary dark:text-text-secondary-dark">
          {repText}
        </div>
      </Card>

      <Card>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))' }}>
          <Field label={breathing ? 'Udah / Zadrži / Izdah / Zadrži' : 'Tempo (4 znam.)'}>
            <TextInput
              value={tempo}
              maxLength={4}
              onChange={(e) => setTempo(e.target.value.replace(/\D/g, ''))}
              onBlur={() => { setTempo(digits(tempo)); reset(); }}
              style={{ fontSize: 18, letterSpacing: 5, fontFamily: 'ui-monospace, monospace' }}
            />
          </Field>
          <Field label={breathing ? 'Ciklusi' : 'Ponavljanja'}>
            <NumberInput
              value={reps}
              min={1}
              max={99}
              onChange={(e) => { setReps(Math.max(1, +e.target.value || 1)); reset(); }}
            />
          </Field>
          <Field label="Priprema (s)">
            <NumberInput
              value={prep}
              min={0}
              max={60}
              onChange={(e) => { setPrep(Math.max(0, +e.target.value || 0)); reset(); }}
            />
          </Field>
          {breathing && (
            <Field label="Primjeri">
              <select
                className="w-full h-11 px-3 rounded-lg text-center bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark text-text-primary dark:text-text-primary-dark outline-none"
                value=""
                onChange={(e) => {
                  if (e.target.value) { setTempo(e.target.value); reset(); }
                }}
              >
                <option value="">—</option>
                {PRESETS_DISANJE.map((p) => (
                  <option key={p} value={p}>
                    {p.split('').join('-')}
                  </option>
                ))}
              </select>
            </Field>
          )}
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
