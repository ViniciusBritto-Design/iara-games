import { SORT_OPTIONS } from "../../Data/categories";

/** Linha com total de resultados, ordenação e o filtro "só minha lista". */
export default function ResultsBar({ total, filters, onChange, onReset, hasActiveFilters, favoritesCount }) {
  return (
    <div className="results-bar">
      <p className="results-count" aria-live="polite" aria-atomic="true">
        <strong>{total}</strong> {total === 1 ? "jogo encontrado" : "jogos encontrados"}
        {hasActiveFilters && (
          <button type="button" className="text-btn" onClick={onReset}>
            Limpar filtros
          </button>
        )}
      </p>

      <div className="results-controls">
        <label className="toggle">
          <input
            type="checkbox"
            checked={filters.onlyFavorites}
            onChange={(event) => onChange({ onlyFavorites: event.target.checked })}
          />
          <span className="toggle-track" aria-hidden="true" />
          Só minha lista ({favoritesCount})
        </label>

        <label className="sort-select">
          <span>Ordenar por</span>
          <select value={filters.sort} onChange={(event) => onChange({ sort: event.target.value })}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
