import { useMemo } from "react";
import SearchBar from "../Components/Catalog/SearchBar";
import CategoryFilter from "../Components/Catalog/CategoryFilter";
import ResultsBar from "../Components/Catalog/ResultsBar";
import EmptyState from "../Components/Catalog/EmptyState";
import RecentlyViewed from "../Components/Catalog/RecentlyViewed";
import GameGrid from "../Components/Game/GameGrid";
import { GAMES } from "../Data/games";
import { useLibrary } from "../Context/LibraryContext";
import { useCatalogFilters } from "../Hooks/useCatalogFilters";
import { useDocumentTitle } from "../Hooks/useDocumentTitle";
import { countByCategory, filterGames, pickRandomGame } from "../Utils/catalog";
import { navigate } from "../Router/router";

export default function CatalogPage() {
  useDocumentTitle("Catálogo");
  const { favorites } = useLibrary();
  const { filters, setFilters, resetFilters, hasActiveFilters, query } = useCatalogFilters();

  // useMemo evita refazer filtro e ordenação quando nada relevante mudou.
  const visibleGames = useMemo(() => filterGames(GAMES, filters, favorites), [filters, favorites]);
  const counts = useMemo(() => countByCategory(GAMES, filters.search), [filters.search]);

  function surpriseMe() {
    const pool = visibleGames.length > 0 ? visibleGames : GAMES;
    const game = pickRandomGame(pool) ?? pool[0];
    navigate(`/jogo/${game.slug}?de=${encodeURIComponent(query)}&surpresa=1`);
  }

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div className="page-hero-content">
            <span className="section-label">Catálogo da plataforma</span>
            <h1>Encontre seu próximo jogo indie</h1>
            <p>
              Explore títulos autorais criados por desenvolvedores independentes de todas as regiões
              do Brasil. Filtre, salve na sua lista e compartilhe suas descobertas.
            </p>
          </div>
          <div className="surprise-card">
            <p>Sem ideia do que jogar?</p>
            <button type="button" className="btn btn-primary" onClick={surpriseMe}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="btn-icon">
                <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="8.5" cy="8.5" r="1.6" fill="currentColor" />
                <circle cx="15.5" cy="15.5" r="1.6" fill="currentColor" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" />
              </svg>
              Me surpreenda
            </button>
            <small>Sorteia um jogo entre os resultados do filtro atual.</small>
          </div>
        </div>
      </section>

      <section className="categories-section" aria-label="Busca e filtros">
        <div className="container catalog-toolbar">
          <SearchBar
            value={filters.search}
            onChange={(search) => setFilters({ search }, { replace: true })}
          />
          <CategoryFilter
            active={filters.category}
            counts={counts}
            onChange={(category) => setFilters({ category })}
          />
        </div>
      </section>

      <section className="catalog-section" aria-labelledby="catalogTitle">
        <div className="container">
          <h2 id="catalogTitle" className="visually-hidden">Jogos disponíveis</h2>
          <ResultsBar
            total={visibleGames.length}
            filters={filters}
            onChange={(changes) => setFilters(changes)}
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
            favoritesCount={favorites.length}
          />

          {visibleGames.length > 0 ? (
            <GameGrid games={visibleGames} from={query} />
          ) : (
            <EmptyState
              title="Nenhum jogo encontrado"
              message={
                filters.onlyFavorites && favorites.length === 0
                  ? "Sua lista ainda está vazia. Toque no coração de um jogo para salvá-lo."
                  : "Tente outro termo de busca ou selecione uma categoria diferente."
              }
              action={
                <button type="button" className="btn btn-secondary" onClick={resetFilters}>
                  Ver todos os jogos
                </button>
              }
            />
          )}
        </div>
      </section>

      <RecentlyViewed />
    </>
  );
}
