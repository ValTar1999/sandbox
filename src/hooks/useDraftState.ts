import { useCallback, useMemo, useState } from 'react';

export function useDraftState<T>(initialValue: T) {
  const [saved, setSaved] = useState(initialValue);
  const [draft, setDraft] = useState(initialValue);

  const hasChanges = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(saved),
    [draft, saved]
  );

  const cancel = useCallback(() => {
    setDraft(saved);
  }, [saved]);

  const save = useCallback(() => {
    setSaved(draft);
  }, [draft]);

  const resetBoth = useCallback((value: T) => {
    setSaved(value);
    setDraft(value);
  }, []);

  return {
    saved,
    draft,
    setDraft,
    hasChanges,
    cancel,
    save,
    resetBoth,
    setSaved,
  };
}
