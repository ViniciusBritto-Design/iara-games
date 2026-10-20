import Link from "../Router/Link";
import { GAMES } from "../Data/games";
import { useLibrary } from "../Context/LibraryContext";
import { useDocumentTitle } from "../Hooks/useDocumentTitle";
import GameGrid from "../Components/Game/GameGrid";
import EmptyState from "../Components/Catalog/EmptyState";

export default function FavoritesPage() {
  useDocumentTitle("Minha lista");
  const { favorites } = useLibrary();
  // Mantém a ordem em que o jogador salvou os jogos.
  const games = favorites.map((slug) => GAMES.find((game) => game.slug === slug)).filter(Boolean);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <span className="section-label">Minha lista</span>
            <h1>Jogos que você salvou</h1>
            <p>
              Sua lista fica guardada neste navegador, então você pode voltar depois e continuar de
              onde parou.
            </p>
          </div>
        </div>
      </section>

      <section className="catalog-section">
        <div className="container">
          {games.length > 0 ? (
            <>
              <p className="results-count list-count">
                <strong>{games.length}</strong> {games.length === 1 ? "jogo salvo" : "jogos salvos"}
              </p>
              <GameGrid games={games} />
            </>
          ) : (
            <EmptyState
              title="Sua lista está vazia"
              message="Toque no coração de qualquer jogo do catálogo para salvá-lo aqui."
              action={
                <Link to="/" className="btn btn-primary">
                  Explorar o catálogo
                </Link>
              }
            />
          )}
        </div>
      </section>
    </>
  );
}
