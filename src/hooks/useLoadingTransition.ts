import { useCallback, useEffect, useState } from 'react';
import { LOADING_DURATION_MS } from '../constants/animations';

export function useLoadingTransition(duration = LOADING_DURATION_MS) {
  const [isLoading, setIsLoading] = useState(false);

  const runWithLoading = useCallback(
    (callback: () => void) => {
      setIsLoading(true);
      const timeout = setTimeout(() => {
        callback();
        setIsLoading(false);
      }, duration);
      return () => clearTimeout(timeout);
    },
    [duration]
  );

  return { isLoading, setIsLoading, runWithLoading };
}

export function useDelayedValue<T>(
  value: T,
  pending: T | null,
  isLoading: boolean,
  duration = LOADING_DURATION_MS
) {
  const [resolved, setResolved] = useState(value);

  useEffect(() => {
    setResolved(value);
  }, [value]);

  useEffect(() => {
    if (!isLoading || pending === null) return;

    const timeout = setTimeout(() => {
      setResolved(pending);
    }, duration);

    return () => clearTimeout(timeout);
  }, [isLoading, pending, duration]);

  return resolved;
}
