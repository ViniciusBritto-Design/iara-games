import Link from "../../Router/Link";
import { useLibrary } from "../../Context/LibraryContext";
import { getGameBySlug } from "../../Data/games";

/** Faixa "Vistos recentemente", alimentada pelas páginas de jogo abertas. */
export default function RecentlyViewed() {
  const { recent, clearRecent } = useLibrary();
  const games = recent.map(getGameBySlug).filter(Boolean);

  if (games.length === 0) return null;

  return (
    <section className="recent-section" aria-labelledby="recentTitle">
      <div className="container">
        <div className="recent-header">
          <h2 id="recentTitle">Vistos recentemente</h2>
          <button type="button" className="text-btn" onClick={clearRecent}>
            Limpar histórico
          </button>
        </div>
        <ul className="recent-list" role="list">
          {games.map((game) => (
            <li key={game.slug}>
              <Link to={`/jogo/${game.slug}`} className="recent-item">
                <img src={game.image} alt="" loading="lazy" />
                <span>{game.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
