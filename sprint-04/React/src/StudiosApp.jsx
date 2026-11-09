import { useEffect } from "react";
import Layout from "./Components/Layout/Layout";
import StudiosPage from "./Pages/Studios/StudiosPage";
import RegisterStudioPage from "./Pages/Studios/RegisterStudioPage";
import StudioNotFoundPage from "./Pages/Studios/StudioNotFoundPage";
import { LibraryProvider } from "./Context/LibraryContext";
import { StudiosProvider } from "./Context/StudiosContext";
import { matchPath, useLocation } from "./Router/router";

// Área de Estúdios (Fase 07): mapa da cena indie + cadastro com a API ViaCEP.
const ROUTES = [
  { path: "/", render: () => <StudiosPage /> },
  { path: "/cadastrar", render: () => <RegisterStudioPage /> },
];

function CurrentPage() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  for (const route of ROUTES) {
    const params = matchPath(route.path, pathname);
    if (params) return route.render(params);
  }
  return <StudioNotFoundPage />;
}

export default function StudiosApp() {
  return (
    <LibraryProvider>
      <StudiosProvider>
        <Layout area="estudios">
          <CurrentPage />
        </Layout>
      </StudiosProvider>
    </LibraryProvider>
  );
}
