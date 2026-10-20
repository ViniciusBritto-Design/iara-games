// Funções puras de filtragem e ordenação do catálogo.
// Ficam separadas dos componentes para serem fáceis de testar e reutilizar.

/** Remove acentos e deixa em minúsculas: "Estúdio" → "estudio". */
export function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** A busca considera título, estúdio, região e tags. */
function matchesSearch(game, search) {
  if (!search) return true;
  const term = normalizeText(search);
  const haystack = normalizeText(
    [game.title, game.studio, game.region, ...game.tags].join(" ")
  );
  return haystack.includes(term);
}

const SORTERS = {
  destaques: (a, b) => a.featured - b.featured,
  recentes: (a, b) => b.year - a.year || a.featured - b.featured,
  az: (a, b) => a.title.localeCompare(b.title, "pt-BR"),
  za: (a, b) => b.title.localeCompare(a.title, "pt-BR"),
};

export function filterGames(games, { search, category, sort, onlyFavorites }, favorites) {
  return games
    .filter((game) => category === "todos" || game.category === category)
    .filter((game) => matchesSearch(game, search))
    .filter((game) => !onlyFavorites || favorites.includes(game.slug))
    .sort(SORTERS[sort] ?? SORTERS.destaques);
}

/** Conta quantos jogos existem em cada categoria (respeitando a busca). */
export function countByCategory(games, search) {
  const counts = { todos: 0 };
  games
    .filter((game) => matchesSearch(game, search))
    .forEach((game) => {
      counts.todos += 1;
      counts[game.category] = (counts[game.category] ?? 0) + 1;
    });
  return counts;
}

/**
 * Jogos parecidos: mesma categoria primeiro, depois quem compartilha tags.
 * Se não houver parecidos suficientes, completa com os destaques do catálogo.
 */
export function getSimilarGames(games, current, limit = 3) {
  return games
    .filter((game) => game.slug !== current.slug)
    .map((game) => {
      const sharedTags = game.tags.filter((tag) => current.tags.includes(tag)).length;
      const score = (game.category === current.category ? 10 : 0) + sharedTags;
      return { game, score };
    })
    .sort((a, b) => b.score - a.score || a.game.featured - b.game.featured)
    .slice(0, limit)
    .map(({ game }) => game);
}

export function pickRandomGame(games, excludeSlug) {
  const pool = games.filter((game) => game.slug !== excludeSlug);
  return pool[Math.floor(Math.random() * pool.length)];
}
