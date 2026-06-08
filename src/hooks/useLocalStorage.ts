import { useState, useCallback } from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;
type RemoveValue = () => void;


function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, SetValue<T>, RemoveValue] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue: SetValue<T> = useCallback(
    (value) => {
      setStoredValue(prev => {
        const next = typeof value === 'function'
          ? (value as (prev: T) => T)(prev)
          : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [key],
  );

  const removeValue: RemoveValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {}
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
