import { useEffect } from "react";
import Layout from "./Components/Layout/Layout";
import CatalogPage from "./Pages/CatalogPage";
import GameDetailPage from "./Pages/GameDetailPage";
import FavoritesPage from "./Pages/FavoritesPage";
import NotFoundPage from "./Pages/NotFoundPage";
import { LibraryProvider } from "./Context/LibraryContext";
import { matchPath, useLocation } from "./Router/router";

// Tabela de rotas da aplicação.
const ROUTES = [
  { path: "/", render: () => <CatalogPage /> },
  { path: "/favoritos", render: () => <FavoritesPage /> },
  { path: "/jogo/:slug", render: (params) => <GameDetailPage slug={params.slug} /> },
];

function CurrentPage() {
  const { pathname } = useLocation();

  // Ao trocar de página, volta ao topo (comportamento esperado de um site).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  for (const route of ROUTES) {
    const params = matchPath(route.path, pathname);
    if (params) return route.render(params);
  }
  return <NotFoundPage />;
}

export default function App() {
  return (
    <LibraryProvider>
      <Layout>
        <CurrentPage />
      </Layout>
    </LibraryProvider>
  );
}
