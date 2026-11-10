import { PLATFORM_PAGES } from "../../Data/site";
import { GAMES } from "../../Data/games";
import { getState } from "../../Data/states";
import { getTeamSizeLabel } from "../../Data/studios";

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export default function StudioCard({ studio, highlighted = false, onRemove }) {
  const game = studio.game ? GAMES.find((item) => item.slug === studio.game) : null;
  const state = getState(studio.uf);
  const teamSize = getTeamSizeLabel(studio.teamSize);
  const fullAddress = studio.mine
    ? [
        [studio.street, studio.number].filter(Boolean).join(", "),
        studio.complement,
        studio.neighborhood,
      ]
        .filter(Boolean)
        .join(" · ")
    : studio.neighborhood;

  return (
    <article className={`studio-card ${studio.mine ? "is-mine" : ""} ${highlighted ? "is-highlighted" : ""}`}>
      <div className="studio-avatar" aria-hidden="true">
        {initials(studio.name)}
      </div>

      <div className="studio-body">
        <div className="studio-title-row">
          <h3>{studio.name}</h3>
          <span className={`studio-badge ${studio.mine ? "badge-mine" : ""}`}>
            {studio.mine ? "Cadastrado por você" : "Parceiro"}
          </span>
        </div>

        <p className="studio-location">
          {studio.city} · {state?.name ?? studio.uf}
          {state && <span className="studio-region">{state.region}</span>}
        </p>
        {fullAddress && <p className="studio-address">{fullAddress}</p>}

        <dl className="studio-meta">
          {teamSize && (
            <div>
              <dt>Equipe</dt>
              <dd>{teamSize}</dd>
            </div>
          )}
        </dl>

        <div className="studio-actions">
          {game && (
            <a className="card-link" href={PLATFORM_PAGES.game(game.slug)}>
              Jogar {game.title} →
            </a>
          )}
          {studio.mine && studio.website && (
            <a className="card-link" href={studio.website} target="_blank" rel="noreferrer">
              Visitar site ↗
            </a>
          )}
          {studio.mine && onRemove && (
            <button type="button" className="text-btn studio-remove" onClick={() => onRemove(studio)}>
              Remover
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
