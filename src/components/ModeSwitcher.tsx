export type ModeId = 'tempo' | 'disanje' | 'stoperica' | 'odbroj' | 'intervali';

const MODES: { id: ModeId; label: string }[] = [
  { id: 'tempo', label: 'Tempo' },
  { id: 'disanje', label: 'Disanje' },
  { id: 'stoperica', label: 'Štoperica' },
  { id: 'odbroj', label: 'Odbrojavanje' },
  { id: 'intervali', label: 'Intervali' },
];

export function ModeSwitcher({
  mode,
  onChange,
}: {
  mode: ModeId;
  onChange: (m: ModeId) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1" role="tablist">
      {MODES.map((mm) => {
        const on = mm.id === mode;
        return (
          <button
            key={mm.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(mm.id)}
            className={
              'shrink-0 px-3.5 py-2 rounded-lg text-sm transition ' +
              (on
                ? 'bg-primary dark:bg-primary-dark text-white'
                : 'border border-border-light dark:border-border-dark text-text-primary dark:text-text-primary-dark hover:bg-surface-light dark:hover:bg-surface-dark')
            }
          >
            {mm.label}
          </button>
        );
      })}
    </div>
  );
}
