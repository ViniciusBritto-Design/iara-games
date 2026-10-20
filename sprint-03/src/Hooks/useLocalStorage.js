import { useEffect, useState } from "react";

/**
 * Funciona como useState, mas guarda o valor no localStorage.
 * Se o navegador bloquear o armazenamento (aba anônima, por exemplo),
 * o app continua funcionando normalmente, só sem lembrar o valor.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // armazenamento indisponível: ignora silenciosamente
    }
  }, [key, value]);

  return [value, setValue];
}
