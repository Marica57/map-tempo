import { useEffect, useState, type ReactNode } from 'react';

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        'rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-card dark:shadow-card-dark p-5 ' +
        className
      }
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block mb-1 text-[13px] text-text-secondary dark:text-text-secondary-dark">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full h-11 px-3 rounded-lg text-center bg-bg-light dark:bg-bg-dark ' +
  'border border-border-light dark:border-border-dark ' +
  'text-text-primary dark:text-text-primary-dark ' +
  'outline-none focus:border-primary dark:focus:border-primary-dark ' +
  'focus:ring-2 focus:ring-primary/20';

export function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="number" inputMode="numeric" {...props} className={inputCls} />;
}

/**
 * "Pametno" brojčano polje: dok tipkaš pušta te na miru (može biti i prazno),
 * a vrijednost provjeri/potvrdi tek kad izađeš iz polja (onBlur / Enter).
 * Prazno ili neispravno → vrati prethodnu vrijednost. Izvan raspona → svede
 * na min/max. `onCommit` se poziva samo kad se vrijednost stvarno promijeni.
 */
export function NumberField({
  value,
  min,
  max,
  onCommit,
}: {
  value: number;
  min?: number;
  max?: number;
  onCommit: (n: number) => void;
}) {
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(String(value));
  }, [value, focused]);

  const commit = () => {
    const raw = text.trim();
    if (raw === '' || Number.isNaN(Number(raw))) {
      setText(String(value)); // vrati prethodnu vrijednost
      return;
    }
    let n = Math.floor(Number(raw));
    if (min != null) n = Math.max(min, n);
    if (max != null) n = Math.min(max, n);
    setText(String(n));
    if (n !== value) onCommit(n);
  };

  return (
    <input
      type="number"
      inputMode="numeric"
      value={text}
      onFocus={() => setFocused(true)}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        setFocused(false);
        commit();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
      }}
      className={inputCls}
    />
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="text" {...props} className={inputCls} />;
}

export function PrimaryButton({
  children,
  className = '',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={
        'inline-flex items-center justify-center gap-2 h-11 min-w-[130px] px-5 rounded-lg ' +
        'bg-primary hover:bg-primary-hover dark:bg-primary-dark text-white font-medium ' +
        'active:scale-[0.98] transition disabled:opacity-50 ' +
        className
      }
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = '',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={
        'inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg ' +
        'border border-border-light dark:border-border-dark ' +
        'text-text-primary dark:text-text-primary-dark ' +
        'hover:bg-bg-light dark:hover:bg-bg-dark active:scale-[0.98] transition ' +
        className
      }
    >
      {children}
    </button>
  );
}
