import { CATEGORIES } from "../../Data/categories";

/** Chips de categoria com a quantidade de jogos em cada uma. */
export default function CategoryFilter({ active, counts, onChange }) {
  return (
    <div className="category-list" role="group" aria-label="Filtrar jogos por categoria">
      {CATEGORIES.map((category) => {
        const count = counts[category.id] ?? 0;
        return (
          <button
            key={category.id}
            type="button"
            className={`category-chip ${active === category.id ? "active" : ""}`}
            aria-pressed={active === category.id}
            onClick={() => onChange(category.id)}
          >
            {category.label}
            <span className="chip-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
