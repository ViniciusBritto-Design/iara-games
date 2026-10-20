import { useEffect, useMemo, useState } from "react";
import Link from "../Router/Link";
import { navigate, useLocation } from "../Router/router";
import { GAMES, getGameBySlug } from "../Data/games";
import { getCategoryLabel } from "../Data/categories";
import { useLibrary } from "../Context/LibraryContext";
import { useDocumentTitle } from "../Hooks/useDocumentTitle";
import { getSimilarGames, pickRandomGame } from "../Utils/catalog";
import FavoriteButton from "../Components/Game/FavoriteButton";
import AgeRating from "../Components/Game/AgeRating";
import GameGrid from "../Components/Game/GameGrid";
import NotFoundPage from "./NotFoundPage";

export default function GameDetailPage({ slug }) {
  const game = getGameBySlug(slug);
  const { search } = useLocation();
  const { registerView } = useLibrary();
  const [copied, setCopied] = useState(false);

  const params = new URLSearchParams(search);
  const backQuery = params.get("de") ?? "";
  const cameFromSurprise = params.get("surpresa") === "1";

  useDocumentTitle(game?.title);

  // Registra a visita para a faixa "Vistos recentemente".
  useEffect(() => {
    if (game) registerView(game.slug);
  }, [game, registerView]);

  useEffect(() => setCopied(false), [slug]);

  const similar = useMemo(() => (game ? getSimilarGames(GAMES, game) : []), [game]);

  if (!game) return <NotFoundPage />;

  async function shareGame() {
    const url = `${window.location.origin}${window.location.pathname}#/jogo/${game.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${game.title} na Iara Games`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // usuário cancelou o compartilhamento: nada a fazer
    }
  }

  function anotherOne() {
    const next = pickRandomGame(GAMES, game.slug);
    navigate(`/jogo/${next.slug}?de=${encodeURIComponent(backQuery)}&surpresa=1`);
  }

  return (
    <article className="game-detail">
      <div className="game-hero">
        <img src={game.image} alt={`Arte do jogo ${game.title}`} className="game-hero-img" />
        <div className="game-hero-overlay" />
        <div className="container game-hero-content">
          <Link to={`/${backQuery ? `?${backQuery}` : ""}`} className="back-link">
            ← Voltar ao catálogo
          </Link>
          {cameFromSurprise && <span className="surprise-tag">🎲 Sorteado para você</span>}
          <div className="game-hero-pills">
            <Link to={`/?categoria=${game.category}`} className="pill pill-link">
              {getCategoryLabel(game.category)}
            </Link>
            <AgeRating rating={game.rating} />
          </div>
          <h1>{game.title}</h1>
          <p className="game-hero-studio">
            por <strong>{game.studio}</strong> · {game.region}
          </p>
          <div className="game-hero-actions">
            <FavoriteButton game={game} variant="full" />
            <button type="button" className="btn btn-secondary" onClick={shareGame}>
              {copied ? "Link copiado!" : "Compartilhar"}
            </button>
            {cameFromSurprise && (
              <button type="button" className="btn btn-secondary" onClick={anotherOne}>
                Sortear outro
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container game-body">
        <section className="game-about" aria-labelledby="aboutTitle">
          <h2 id="aboutTitle">Sobre o jogo</h2>
          <p>{game.description}</p>
          <h3>Temas</h3>
          <ul className="tag-list" role="list">
            {game.tags.map((tag) => (
              <li key={tag}>
                <Link to={`/?busca=${encodeURIComponent(tag)}`} className="tag">
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <aside className="game-facts" aria-label="Ficha técnica">
          <h2>Ficha técnica</h2>
          <dl>
            <div><dt>Estúdio</dt><dd>{game.studio}</dd></div>
            <div><dt>Origem</dt><dd>{game.region}</dd></div>
            <div><dt>Lançamento</dt><dd>{game.year}</dd></div>
            <div><dt>Plataformas</dt><dd>{game.platforms.join(", ")}</dd></div>
            <div><dt>Modos</dt><dd>{game.modes.join(", ")}</dd></div>
            <div>
              <dt>Classificação</dt>
              <dd>{game.rating === "Livre" ? "Livre para todos" : `${game.rating} anos`}</dd>
            </div>
          </dl>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="similar-section" aria-labelledby="similarTitle">
          <div className="container">
            <div className="section-heading">
              <h2 id="similarTitle">Você também pode gostar</h2>
              <p>Selecionados pela mesma categoria e por temas em comum.</p>
            </div>
            <GameGrid games={similar} from={backQuery} />
          </div>
        </section>
      )}
    </article>
  );
}
