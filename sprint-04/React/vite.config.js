import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// O projeto React tem duas áreas da plataforma, cada uma com sua página de entrada:
//   catalogo/index.html -> Catálogo de jogos (Fase 06)
//   estudios/index.html -> Estúdios: cadastro com consulta de CEP pela API ViaCEP (Fase 07)
// As duas compartilham componentes, estilos e a "Minha lista" (mesmo localStorage).
//
// base "./" gera caminhos relativos no build. Assim o app funciona em
// qualquer subpasta do GitHub Pages (ex.: /iara-games/) sem configuração extra.
const page = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    // Nome diferente de "Assets" (pasta das páginas HTML) para não confundir no site final.
    assetsDir: "react-assets",
    rollupOptions: {
      input: {
        catalogo: page("./catalogo/index.html"),
        estudios: page("./estudios/index.html"),
      },
    },
  },
  server: {
    open: "/estudios/",
  },
});
