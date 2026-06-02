import { useState, useEffect } from 'react';

/**
 * Standard debounce hook to prevent unnecessary requests on rapid input changes.
 * @param {any} value 
 * @param {number} delay 
 * @returns {any}
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
