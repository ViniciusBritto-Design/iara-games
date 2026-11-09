import { useEffect, useRef } from "react";

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  // Atalho de teclado: "/" foca a busca (padrão de sites como GitHub e YouTube).
  useEffect(() => {
    function handleKey(event) {
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
      if (event.key === "/" && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <label className="search-bar" htmlFor="catalogSearch">
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="visually-hidden">Buscar jogos</span>
      <input
        ref={inputRef}
        type="search"
        id="catalogSearch"
        className="search-input"
        placeholder="Buscar jogo, estúdio ou tema"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onChange("");
        }}
      />
      <kbd className="search-shortcut" aria-hidden="true">/</kbd>
    </label>
  );
}
