# Iara Games — Catálogo em React

Área de **Catálogo de jogos** da plataforma Iara Games, reconstruída em React para a entrega "Hospedando React" (Fase 6 · FIAP).

**Acesse:** https://viniciusbritto-design.github.io/iara-games/

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

Segue o mesmo padrão das sprints anteriores (pastas `Assets`, `CSS`, ...), adaptado à organização de um projeto React:

```
sprint-03/
├── index.html              # página base em que o React é montado
├── package.json            # dependências e scripts
├── vite.config.js          # configuração do Vite (caminhos relativos para o GitHub Pages)
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx            # ponto de entrada
    ├── App.jsx             # tabela de rotas
    ├── Assets/             # logos e capas dos jogos (otimizadas)
    ├── CSS/                # base.css (identidade da Sprint 02) + catalog.css
    ├── Components/
    │   ├── Layout/         # Header, Footer, Layout
    │   ├── Catalog/        # SearchBar, CategoryFilter, ResultsBar, EmptyState, RecentlyViewed
    │   └── Game/           # GameCard, GameGrid, FavoriteButton, AgeRating
    ├── Context/            # LibraryContext: minha lista e vistos recentemente
    ├── Data/               # base de jogos e categorias
    ├── Hooks/              # useCatalogFilters, useLocalStorage, useDocumentTitle
    ├── Pages/              # CatalogPage, GameDetailPage, FavoritesPage, NotFoundPage
    ├── Router/             # roteador por hash (compatível com hospedagem estática)
    └── Utils/              # filtragem, ordenação e recomendação (funções puras)
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
cd sprint-03
npm install
npm run dev
```

Para gerar a versão de produção: `npm run build` (o resultado fica em `dist/`).

## Hospedagem

A publicação é automática pelo GitHub Actions (`.github/workflows/deploy-react.yml`): a cada push na branch `main` que altere esta pasta, o projeto é compilado e publicado no GitHub Pages.

As rotas usam hash (`#/jogo/...`) porque o GitHub Pages serve apenas arquivos estáticos; assim, recarregar qualquer página ou abrir um link direto nunca resulta em erro 404.

## Acessibilidade

Link "pular para o conteúdo", foco visível em todos os controles, botões com `aria-pressed`, contagem de resultados anunciada a leitores de tela (`aria-live`), textos alternativos e respeito à preferência de movimento reduzido.
