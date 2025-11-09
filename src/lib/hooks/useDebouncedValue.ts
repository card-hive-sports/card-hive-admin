import {useEffect, useState} from "react";

export const useDebouncedValue = <T>(value: T, delay = 400): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutID = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeoutID);
  }, [value, delay]);

  return debouncedValue;
};
