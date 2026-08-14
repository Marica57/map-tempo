import type { ReactNode } from 'react';

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
