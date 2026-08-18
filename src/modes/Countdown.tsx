import { useEffect, useRef, useState } from 'react';
import { audio } from '../lib/audio';
import { useRaf } from '../lib/useRaf';
import { useLocalStorage } from '../lib/useLocalStorage';
import { bigSec, msFmt } from '../lib/format';
import { initCircle, paintCircle } from '../lib/circle';
import { CircleViz } from '../components/CircleViz';
import { Card, Field, NumberField, PrimaryButton, GhostButton } from '../components/ui';

type Machine = {
  off: number;
  t0: number;
  T: number;
  q: boolean[]; // četvrtine [.25,.5,.75]
  last: number;
  active: boolean;
  prep: number;
  inPrep: boolean;
  lastPrep: number;
};

const QUICK: [string, number][] = [
  ['0:30', 30], ['0:45', 45], ['1:00', 60], ['1:30', 90], ['2:00', 120],
];

export default function Countdown() {
  const [min, setMin] = useLocalStorage('cd:min', 0);
  const [sec, setSec] = useLocalStorage('cd:sec', 30);
  const [prep, setPrep] = useLocalStorage('cd:prep', 5);
  const [running, setRunning] = useState(false);
  const [phaseLabel, setPhaseLabel] = useState('');

  const ringRef = useRef<SVGCircleElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const { start, stop } = useRaf();
  const m = useRef<Machine>({
    off: 0, t0: 0, T: 30, q: [false, false, false], last: -1, active: false,
    prep: 5, inPrep: false, lastPrep: -1,
  });

  const total = () => Math.max(1, (min | 0) * 60 + (sec | 0));

  const showIdle = () => {
    m.current.T = total();
    m.current.inPrep = false;
    setPhaseLabel('');
    initCircle(ringRef.current, dotRef.current);
    if (numRef.current) numRef.current.textContent = bigSec(m.current.T);
  };

  useEffect(() => {
    showIdle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, sec]);

  const step = () => {
    const s = m.current;
    const el = s.off + (performance.now() - s.t0) / 1000;

    if (s.inPrep) {
      const rem = Math.ceil(s.prep - el);
      if (numRef.current) numRef.current.textContent = String(Math.max(0, rem));
      paintCircle(ringRef.current, dotRef.current, 0);
      if (rem <= 3 && rem >= 1 && rem !== s.lastPrep) {
        s.lastPrep = rem;
        audio.soft();
      }
      if (el >= s.prep) {
        audio.strong();
        audio.vibrate(60);
        s.inPrep = false;
        s.off = 0;
        s.t0 = performance.now();
        s.q = [false, false, false];
        s.last = -1;
        setPhaseLabel('');
      }
      return;
    }

    const prog = Math.min(el / s.T, 1);
    const rem = s.T - el;
    paintCircle(ringRef.current, dotRef.current, prog);
    if (numRef.current) numRef.current.textContent = bigSec(rem);

    const marks: [number, () => void][] = [
      [0.25, () => audio.soft()],
      [0.5, () => audio.mid()],
      [0.75, () => audio.soft()],
    ];
    marks.forEach(([p, fn], i) => {
      if (!s.q[i] && prog >= p) {
        s.q[i] = true;
        fn();
      }
    });

    if (rem <= 3) {
      const sr = Math.ceil(rem);
      if (sr >= 1 && sr !== s.last) {
        s.last = sr;
        audio.soft();
      }
    }

    if (el >= s.T) {
      stop();
      s.active = false;
      setRunning(false);
      audio.finish();
      audio.vibrate([80, 50, 160]);
      paintCircle(ringRef.current, dotRef.current, 1);
      if (numRef.current) numRef.current.textContent = '0';
    }
  };

  const begin = () => {
    audio.ensure();
    const s = m.current;
    s.T = total();
    s.prep = Math.max(0, prep | 0);
    s.off = 0;
    s.q = [false, false, false];
    s.last = -1;
    s.active = true;
    s.t0 = performance.now();
    if (s.prep > 0) {
      s.inPrep = true;
      s.lastPrep = -1;
      setPhaseLabel('Priprema');
      initCircle(ringRef.current, dotRef.current);
      if (numRef.current) numRef.current.textContent = String(s.prep);
    } else {
      s.inPrep = false;
      setPhaseLabel('');
    }
    setRunning(true);
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
    m.current.active = false;
    m.current.off = 0;
    setRunning(false);
    showIdle();
  };

  const toggle = () => {
    if (running) pause();
    else if (m.current.active) resume();
    else begin();
  };

  const setQuick = (v: number) => {
    setMin(Math.floor(v / 60));
    setSec(v % 60);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-center text-sm text-warning min-h-[20px] mb-1 font-medium">
          {phaseLabel}
        </div>
        <CircleViz ringRef={ringRef} dotRef={dotRef} numRef={numRef} color="#2B9CAD" />
      </Card>
      <Card>
        <div className="flex gap-2 justify-center flex-wrap mb-3">
          {QUICK.map(([lbl, v]) => (
            <GhostButton key={lbl} onClick={() => setQuick(v)} className="!min-w-0 !px-3 !h-9">
              {lbl}
            </GhostButton>
          ))}
        </div>
        <div className="grid gap-3 max-w-[360px] mx-auto" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <Field label="Min">
            <NumberField value={min} min={0} max={59} onCommit={setMin} />
          </Field>
          <Field label="Sek">
            <NumberField value={sec} min={0} max={59} onCommit={setSec} />
          </Field>
          <Field label="Priprema (s)">
            <NumberField value={prep} min={0} max={60} onCommit={setPrep} />
          </Field>
        </div>
        <div className="flex gap-2 justify-center mt-4 flex-wrap">
          <PrimaryButton onClick={toggle}>
            {running ? '❙❙ Pauza' : m.current.active ? '▶ Nastavi' : '▶ Pokreni'}
          </PrimaryButton>
          <GhostButton onClick={reset}>↺ Reset</GhostButton>
        </div>
        <p className="text-center text-xs text-text-secondary dark:text-text-secondary-dark mt-3">
          Ukupno: {msFmt(total())}
        </p>
      </Card>
    </div>
  );
}
