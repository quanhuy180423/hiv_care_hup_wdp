import { useEffect, useState } from "react";

/**
 * Hook dùng để debounce một giá trị.
 * @param value - Giá trị cần debounce (string, number, v.v.)
 * @param delay - Thời gian delay (ms), mặc định 500ms
 * @returns Giá trị đã debounce
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Dọn dẹp timeout nếu value thay đổi trước khi delay xong
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
