# Iara Games — Catálogo em React

Área de **Catálogo de jogos** da plataforma Iara Games, reconstruída em React para a entrega "Hospedando React" (Fase 6 · FIAP).

**Plataforma completa:** https://viniciusbritto-design.github.io/iara-games/  
**Área em React (Catálogo):** https://viniciusbritto-design.github.io/iara-games/catalogo/

## O que a área faz

| Funcionalidade | Como funciona |
| --- | --- |
| Busca inteligente | Procura por nome, estúdio, estado ou tema, ignorando acentos ("estudio" encontra "Estúdio Brasil"). Atalho `/` foca a busca e `Esc` limpa. |
| Filtro por categoria | Chips com a quantidade de jogos em cada categoria, atualizada conforme a busca. |
| Ordenação | Destaques, mais recentes, A–Z e Z–A. |
| Minha lista | Botão de coração em cada jogo. A lista fica salva no navegador (localStorage) e tem página própria. |
| Filtros na URL | Todo filtro vira um link compartilhável (ex.: `#/?categoria=rpg&ordem=recentes`) e o botão "voltar" do navegador desfaz o filtro. |
| Página do jogo | Capa em destaque, ficha técnica, classificação indicativa no padrão ClassInd, temas clicáveis e "Você também pode gostar". |
| Me surpreenda | Sorteia um jogo entre os resultados do filtro atual. |
| Vistos recentemente | Os últimos jogos abertos aparecem no fim do catálogo. |
| Compartilhar | Usa o compartilhamento nativo do celular ou copia o link no computador. |

## Estrutura de pastas

A Sprint 03 segue o mesmo padrão das anteriores. As páginas de Início e Publicar são as da Sprint 02 (HTML, CSS e JS), e o Catálogo foi reconstruído em React dentro da pasta `React`:

```
sprint-03/
├── index.html              # entrada do site: leva para HTML/index.html
├── Assets/  CSS/  HTML/  JS/   # páginas da Sprint 02 (Início e Publicar meu jogo)
└── React/                  # área de Catálogo em React (projeto Vite)
    ├── index.html  ·  package.json  ·  vite.config.js
    ├── public/             # favicon
    └── src/
        ├── main.jsx        # ponto de entrada
        ├── App.jsx         # tabela de rotas
        ├── Assets/         # logos e capas dos jogos (otimizadas)
        ├── CSS/            # base.css (identidade da Sprint 02) + catalog.css
        ├── Components/
        │   ├── Layout/     # Header, Footer, Layout
        │   ├── Catalog/    # SearchBar, CategoryFilter, ResultsBar, EmptyState, RecentlyViewed
        │   └── Game/       # GameCard, GameGrid, FavoriteButton, AgeRating
        ├── Context/        # LibraryContext: minha lista e vistos recentemente
        ├── Data/           # base de jogos, categorias e links das outras páginas
        ├── Hooks/          # useCatalogFilters, useLocalStorage, useDocumentTitle
        ├── Pages/          # CatalogPage, GameDetailPage, FavoritesPage, NotFoundPage
        ├── Router/         # roteador por hash (compatível com hospedagem estática)
        └── Utils/          # filtragem, ordenação e recomendação (funções puras)
```

## Conceitos de React aplicados

- **Componentes reutilizáveis** com props (o mesmo `GameCard` aparece no catálogo, na minha lista e nas recomendações).
- **Hooks**: `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext` e `useSyncExternalStore`.
- **Hooks personalizados** para separar lógica de interface (`useCatalogFilters`, `useLocalStorage`).
- **Context API** para o estado compartilhado da minha lista sem passar props por vários níveis.
- **Renderização condicional e listas** com `key`.
- **Rotas** com parâmetros (`/jogo/:slug`) e página 404.

## Rodando localmente

Requer Node.js 18 ou superior.

```bash
cd sprint-03/React
npm install
npm run dev
```

Para gerar a versão de produção: `npm run build` (o resultado fica em `dist/`).

## Hospedagem

A publicação é automática pelo GitHub Actions (`.github/workflows/deploy-react.yml`). A cada push na branch `main` que altere a `sprint-03`, o fluxo:

1. instala as dependências e gera o build do Catálogo React com o Vite;
2. monta o site completo: páginas da Sprint 02 na raiz e o Catálogo em `/catalogo/`;
3. publica tudo no GitHub Pages.

Os menus de todas as páginas apontam umas para as outras, então a navegação entre Início, Catálogo e Publicar funciona como um único site. As rotas do Catálogo usam hash (`#/jogo/...`) porque o GitHub Pages serve apenas arquivos estáticos; assim, recarregar qualquer página ou abrir um link direto nunca resulta em erro 404.

Observação: ao rodar só o Catálogo com `npm run dev`, os links para Início e Publicar não abrem, porque essas páginas ficam fora da pasta `React`. No site publicado tudo funciona.

## Acessibilidade

Link "pular para o conteúdo", foco visível em todos os controles, botões com `aria-pressed`, contagem de resultados anunciada a leitores de tela (`aria-live`), textos alternativos e respeito à preferência de movimento reduzido.
