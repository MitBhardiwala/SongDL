import { useState, useEffect } from "react";

/**
 * Delays updating the returned value until the input hasn't changed
 * for the specified delay (default 300ms). Prevents excessive API calls while typing.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
