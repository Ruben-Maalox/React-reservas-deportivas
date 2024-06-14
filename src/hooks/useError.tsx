import { useState, useEffect } from 'react';

export default function useError(time: number) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (error) {
      timer = setTimeout(() => {
        setError(null);
      }, time);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [error]);

  return { error, setError };
}
