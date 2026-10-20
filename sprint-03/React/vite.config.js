import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" gera caminhos relativos no build. Assim o app funciona em
// qualquer subpasta do GitHub Pages (ex.: /iara-games/) sem configuração extra.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
