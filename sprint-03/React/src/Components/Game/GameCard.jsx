import Link from "../../Router/Link";
import FavoriteButton from "./FavoriteButton";
import { getCategoryLabel } from "../../Data/categories";

/** Card de jogo reutilizado no catálogo, na minha lista e em "jogos parecidos". */
export default function GameCard({ game, from = "" }) {
  // "from" guarda os filtros atuais para o botão "voltar" da página do jogo.
  const to = `/jogo/${game.slug}${from ? `?de=${encodeURIComponent(from)}` : ""}`;

  return (
    <article className="catalog-card game-card-react">
      <div className="catalog-thumb">
        <img src={game.image} alt="" loading="lazy" width="600" height="335" />
        <FavoriteButton game={game} />
      </div>
      <div className="catalog-body">
        <div className="card-meta">
          <span className="pill">{getCategoryLabel(game.category)}</span>
          <span className="card-year">{game.year}</span>
        </div>
        <h3>
          {/* O link cobre o card inteiro (via CSS), mas o texto acessível é o título. */}
          <Link to={to} className="card-stretched-link">
            {game.title}
          </Link>
        </h3>
        <p className="card-studio">{game.studio} · {game.region}</p>
        <p>{game.summary}</p>
        <span className="card-link" aria-hidden="true">
          Ver detalhes →
        </span>
      </div>
    </article>
  );
}
