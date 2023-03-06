import { useCallback, useEffect } from 'react';

export const useDebounce = (effect, dependencies, delay) => {
  const callback = useCallback(effect, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
};
