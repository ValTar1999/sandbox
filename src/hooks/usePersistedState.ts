import { useEffect, useState } from 'react';

const readStored = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

/** Persist React state in localStorage so it survives refresh. */
export function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() =>
    readStored(key, defaultValue)
  );

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn('[persist] could not save', key, error);
    }
  }, [key, state]);

  return [state, setState] as const;
}
