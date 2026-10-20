import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "../Hooks/useLocalStorage";

// Contexto da "biblioteca" do jogador: jogos favoritos e vistos recentemente.
// Fica disponível para qualquer componente (cards, cabeçalho, páginas)
// sem precisar passar props por vários níveis.
const LibraryContext = createContext(null);

const MAX_RECENT = 4;

export function LibraryProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage("iara:favoritos", []);
  const [recent, setRecent] = useLocalStorage("iara:recentes", []);

  const isFavorite = useCallback((slug) => favorites.includes(slug), [favorites]);

  const toggleFavorite = useCallback(
    (slug) =>
      setFavorites((current) =>
        current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
      ),
    [setFavorites]
  );

  const registerView = useCallback(
    (slug) =>
      setRecent((current) => [slug, ...current.filter((item) => item !== slug)].slice(0, MAX_RECENT)),
    [setRecent]
  );

  const clearRecent = useCallback(() => setRecent([]), [setRecent]);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, recent, registerView, clearRecent }),
    [favorites, isFavorite, toggleFavorite, recent, registerView, clearRecent]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error("useLibrary precisa estar dentro de <LibraryProvider>");
  return context;
}
