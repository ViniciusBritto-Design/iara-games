import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "../Hooks/useLocalStorage";
import { PARTNER_STUDIOS } from "../Data/studios";

// Estúdios exibidos no mapa: os parceiros da plataforma + os cadastrados
// neste navegador pelo formulário (endereços vindos da API ViaCEP).
const StudiosContext = createContext(null);

export function StudiosProvider({ children }) {
  const [registered, setRegistered] = useLocalStorage("iara:estudios", []);

  const addStudio = useCallback(
    (studio) => {
      const entry = { ...studio, id: `meu-${Date.now()}`, createdAt: new Date().toISOString(), mine: true };
      setRegistered((current) => [entry, ...current]);
      return entry;
    },
    [setRegistered]
  );

  const removeStudio = useCallback(
    (id) => setRegistered((current) => current.filter((studio) => studio.id !== id)),
    [setRegistered]
  );

  const studios = useMemo(() => [...registered, ...PARTNER_STUDIOS], [registered]);

  const value = useMemo(
    () => ({ studios, registered, addStudio, removeStudio }),
    [studios, registered, addStudio, removeStudio]
  );

  return <StudiosContext.Provider value={value}>{children}</StudiosContext.Provider>;
}

export function useStudios() {
  const context = useContext(StudiosContext);
  if (!context) throw new Error("useStudios precisa estar dentro de <StudiosProvider>");
  return context;
}
