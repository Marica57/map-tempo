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
};

const QUICK: [string, number][] = [
  ['0:30', 30], ['0:45', 45], ['1:00', 60], ['1:30', 90], ['2:00', 120],
];

export default function Countdown() {
  const [min, setMin] = useLocalStorage('cd:min', 0);
  const [sec, setSec] = useLocalStorage('cd:sec', 30);
  const [running, setRunning] = useState(false);

  const ringRef = useRef<SVGCircleElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const { start, stop } = useRaf();
  const m = useRef<Machine>({ off: 0, t0: 0, T: 30, q: [false, false, false], last: -1, active: false });

  const total = () => Math.max(1, (min | 0) * 60 + (sec | 0));

  const showIdle = () => {
    m.current.T = total();
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
      audio.strong();
      audio.vibrate(120);
      paintCircle(ringRef.current, dotRef.current, 1);
      if (numRef.current) numRef.current.textContent = '0';
    }
  };

  const begin = () => {
    audio.ensure();
    const s = m.current;
    s.T = total();
    s.off = 0;
    s.q = [false, false, false];
    s.last = -1;
    s.active = true;
    s.t0 = performance.now();
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
        <div className="grid gap-3 max-w-[260px] mx-auto" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Field label="Min">
            <NumberField value={min} min={0} max={59} onCommit={setMin} />
          </Field>
          <Field label="Sek">
            <NumberField value={sec} min={0} max={59} onCommit={setSec} />
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
