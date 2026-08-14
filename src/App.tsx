import { useEffect } from 'react';
import { audio } from './lib/audio';
import { useLocalStorage } from './lib/useLocalStorage';
import { ModeSwitcher, type ModeId } from './components/ModeSwitcher';
import LineMode from './modes/LineMode';
import Stopwatch from './modes/Stopwatch';
import Countdown from './modes/Countdown';
import Intervals from './modes/Intervals';

export default function App() {
  const [mode, setMode] = useLocalStorage<ModeId>('mt:mode', 'tempo');
  const [soundOn, setSoundOn] = useLocalStorage('mt:sound', true);
  const [dark, setDark] = useLocalStorage<boolean | null>('mt:dark', null);

  // Tema: null = slijedi sustav; true/false = ručni odabir.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const isDark = dark == null ? mq.matches : dark;
      document.documentElement.classList.toggle('dark', isDark);
    };
    apply();
    if (dark == null) {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [dark]);

  useEffect(() => {
    audio.soundOn = soundOn;
  }, [soundOn]);

  const isDark =
    dark == null ? window.matchMedia('(prefers-color-scheme: dark)').matches : dark;

  return (
    <div className="min-h-full bg-bg-light dark:bg-bg-dark text-text-primary dark:text-text-primary-dark">
      <div
        className="mx-auto max-w-xl px-4 pb-10"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <header className="flex items-center justify-between py-3">
          <h1 className="text-lg font-semibold tracking-tight">
            MAP <span className="text-primary dark:text-primary-dark">Tempo</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundOn((v) => !v)}
              aria-label={soundOn ? 'Isključi zvuk' : 'Uključi zvuk'}
              className="h-9 w-9 grid place-items-center rounded-lg border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark"
              title={soundOn ? 'Zvuk uključen' : 'Zvuk isključen'}
            >
              {soundOn ? '🔊' : '🔇'}
            </button>
            <button
              onClick={() => setDark(!isDark)}
              aria-label="Promijeni temu"
              className="h-9 w-9 grid place-items-center rounded-lg border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark"
              title="Svijetlo / tamno"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <div className="my-3">
          <ModeSwitcher mode={mode} onChange={setMode} />
        </div>

        <main className="mt-3">
          {mode === 'tempo' && (
            <LineMode
              storageKey="tempo"
              labels={['Spuštanje', 'Zastoj dolje', 'Dizanje', 'Zastoj gore']}
              counterWord="Ponav."
              defaultTempo="5210"
              defaultReps={8}
            />
          )}
          {mode === 'disanje' && (
            <LineMode
              storageKey="disanje"
              labels={['UDAH', 'ZADRŽI', 'IZDAH', 'ZADRŽI']}
              counterWord="Ciklus"
              defaultTempo="6060"
              defaultReps={10}
              breathing
            />
          )}
          {mode === 'stoperica' && <Stopwatch />}
          {mode === 'odbroj' && <Countdown />}
          {mode === 'intervali' && <Intervals />}
        </main>

        <footer className="mt-8 text-center text-xs text-text-secondary dark:text-text-secondary-dark">
          MAP Tempo · radi offline · dodaj na početni zaslon
        </footer>
      </div>
    </div>
  );
}
