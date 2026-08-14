import { useRef, useState } from 'react';
import { audio } from '../lib/audio';
import { useRaf } from '../lib/useRaf';
import { mmsscc } from '../lib/format';
import { Card, PrimaryButton, GhostButton } from '../components/ui';

export default function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const timeRef = useRef<HTMLDivElement>(null);
  const st = useRef({ off: 0, t0: 0 });
  const { start, stop } = useRaf();

  const render = () => {
    const ms = st.current.off + (running ? performance.now() - st.current.t0 : 0);
    if (timeRef.current) timeRef.current.textContent = mmsscc(ms);
  };

  const step = () => {
    if (timeRef.current)
      timeRef.current.textContent = mmsscc(
        st.current.off + (performance.now() - st.current.t0),
      );
  };

  const toggle = () => {
    if (running) {
      st.current.off += performance.now() - st.current.t0;
      setRunning(false);
      stop();
    } else {
      audio.ensure();
      audio.vibrate(20);
      st.current.t0 = performance.now();
      setRunning(true);
      setStarted(true);
      start(step);
    }
  };

  const reset = () => {
    stop();
    st.current = { off: 0, t0: 0 };
    setRunning(false);
    setStarted(false);
    if (timeRef.current) timeRef.current.textContent = '00:00.00';
  };

  // Osiguraj ispravan prikaz pri prvom renderu.
  if (timeRef.current && !running) render();

  return (
    <Card className="text-center">
      <div
        ref={timeRef}
        className="text-[56px] leading-none font-medium tabular-nums my-6 text-text-primary dark:text-text-primary-dark"
      >
        00:00.00
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        <PrimaryButton onClick={toggle}>
          {running ? '❙❙ Stani' : started ? '▶ Nastavi' : '▶ Kreni'}
        </PrimaryButton>
        <GhostButton onClick={reset}>↺ Reset</GhostButton>
      </div>
    </Card>
  );
}
