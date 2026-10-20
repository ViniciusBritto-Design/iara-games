import { useCallback, useMemo } from "react";
import { getLocation, navigate, useLocation } from "../Router/router";
import { CATEGORIES, SORT_OPTIONS } from "../Data/categories";

const DEFAULTS = { search: "", category: "todos", sort: "destaques", onlyFavorites: false };

/** Converte a parte "?busca=...&categoria=..." da URL em um objeto de filtros. */
function parseFilters(search) {
  const params = new URLSearchParams(search);
  const category = params.get("categoria");
  const sort = params.get("ordem");
  return {
    search: params.get("busca") ?? DEFAULTS.search,
    category: CATEGORIES.some((c) => c.id === category) ? category : DEFAULTS.category,
    sort: SORT_OPTIONS.some((s) => s.id === sort) ? sort : DEFAULTS.sort,
    onlyFavorites: params.get("favoritos") === "1",
  };
}

/**
 * Os filtros do catálogo vivem na URL (ex.: #/?categoria=rpg&ordem=recentes).
 * Vantagens: o link pode ser compartilhado, o botão "voltar" do navegador
 * desfaz um filtro e a seleção não se perde ao recarregar a página.
 */
export function useCatalogFilters() {
  const { pathname, search } = useLocation();

  const filters = useMemo(() => parseFilters(search), [search]);

  const setFilters = useCallback(
    (changes, options) => {
      // Lê os filtros da URL no momento da mudança: assim duas ações seguidas
      // (ex.: trocar a categoria e digitar logo depois) nunca se sobrescrevem.
      const current = getLocation();
      const next = { ...parseFilters(current.search), ...changes };
      const params = new URLSearchParams();
      if (next.search) params.set("busca", next.search);
      if (next.category !== DEFAULTS.category) params.set("categoria", next.category);
      if (next.sort !== DEFAULTS.sort) params.set("ordem", next.sort);
      if (next.onlyFavorites) params.set("favoritos", "1");
      const query = params.toString();
      navigate(`${current.pathname}${query ? `?${query}` : ""}`, options);
    },
    []
  );

  const resetFilters = useCallback(() => navigate(pathname), [pathname]);

  const hasActiveFilters =
    filters.search !== DEFAULTS.search ||
    filters.category !== DEFAULTS.category ||
    filters.sort !== DEFAULTS.sort ||
    filters.onlyFavorites;

  return { filters, setFilters, resetFilters, hasActiveFilters, query: search };
}
