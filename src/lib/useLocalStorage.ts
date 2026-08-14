import { useEffect, useState } from 'react';

/** Trajno spremanje postavki na uređaj (bez baze). */
export function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    try {
      const s = localStorage.getItem(key);
      return s != null ? (JSON.parse(s) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      /* ignore */
    }
  }, [key, val]);

  return [val, setVal] as const;
}
