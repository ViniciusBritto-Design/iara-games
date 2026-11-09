// Endereços das áreas da plataforma.
// No site publicado, cada área fica em uma pasta própria:
//   /HTML/      -> Início e Publicar (HTML, CSS e JS da Sprint 02)
//   /catalogo/  -> Catálogo em React (Fase 06)
//   /estudios/  -> Estúdios em React com a API ViaCEP (Fase 07)
// Como as áreas React estão uma pasta abaixo da raiz, os caminhos sobem com "../".
export const PLATFORM_PAGES = {
  home: "../HTML/index.html",
  publish: "../HTML/publicar.html",
  catalog: "../catalogo/",
  studios: "../estudios/",
  favorites: "../catalogo/#/favoritos",
  game: (slug) => `../catalogo/#/jogo/${slug}`,
};
