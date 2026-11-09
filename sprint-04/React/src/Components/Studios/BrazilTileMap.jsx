import { STATES } from "../../Data/states";

// Cada estado vira um "ladrilho" posicionado em grade, formando o contorno do Brasil.
// A cor indica quantos estúdios há no estado; clicar filtra a lista ao lado.
function levelFor(count) {
  if (count === 0) return "level-0";
  if (count === 1) return "level-1";
  return "level-2";
}

export default function BrazilTileMap({ counts, selectedUf, onSelect }) {
  return (
    <div className="tile-map-wrapper">
      <div className="tile-map" role="group" aria-label="Mapa do Brasil: filtrar estúdios por estado">
        {STATES.map((state) => {
          const count = counts[state.uf] ?? 0;
          const isSelected = selectedUf === state.uf;
          return (
            <button
              key={state.uf}
              type="button"
              className={`tile ${levelFor(count)} ${isSelected ? "is-selected" : ""}`}
              style={{ gridColumn: state.col + 1, gridRow: state.row + 1 }}
              aria-pressed={isSelected}
              aria-label={`${state.name}: ${count} ${count === 1 ? "estúdio" : "estúdios"}`}
              title={`${state.name} · ${count} ${count === 1 ? "estúdio" : "estúdios"}`}
              onClick={() => onSelect(isSelected ? "" : state.uf)}
            >
              <span className="tile-uf">{state.uf}</span>
              {count > 0 && <span className="tile-count">{count}</span>}
            </button>
          );
        })}
      </div>

      <ul className="tile-legend" aria-hidden="true">
        <li><span className="legend-swatch level-0" /> Nenhum ainda</li>
        <li><span className="legend-swatch level-1" /> 1 estúdio</li>
        <li><span className="legend-swatch level-2" /> 2 ou mais</li>
      </ul>
    </div>
  );
}
