import { useState, useEffect } from "react";

export default function useError(time: number) {
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (showError) {
      timer = setTimeout(() => {
        setShowError(false);
      }, time); // Cambia esto al número de milisegundos que quieras
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showError]);

  return { showError, setShowError };
}
