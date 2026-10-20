// Roteador leve baseado em hash (#/rota).
// O GitHub Pages só serve arquivos estáticos: com rotas por hash, o
// navegador sempre carrega o index.html e o React decide qual página mostrar.
// Assim, recarregar /#/jogo/selva-neon nunca resulta em erro 404.
import { useSyncExternalStore } from "react";

const CHANGE_EVENT = "iara:navigate";

function readLocation() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [pathname, query = ""] = raw.split("?");
  return { pathname: pathname || "/", search: query, key: raw };
}

// useSyncExternalStore exige que o "snapshot" seja estável entre leituras.
let cached = readLocation();
function getSnapshot() {
  const next = readLocation();
  if (next.key !== cached.key) cached = next;
  return cached;
}

function subscribe(callback) {
  window.addEventListener("hashchange", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

/** Lê a rota atual direto do navegador (sem depender de re-renderização). */
export function getLocation() {
  return getSnapshot();
}

/** Retorna { pathname, search } e re-renderiza quando a rota muda. */
export function useLocation() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Navega para outra rota.
 * replace: true troca a entrada atual do histórico (usado ao digitar na
 * busca, para o botão "voltar" não percorrer cada letra digitada).
 */
export function navigate(to, { replace = false } = {}) {
  const url = `#${to}`;
  if (replace) {
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } else {
    window.location.hash = to;
  }
}

/**
 * Compara a rota atual com um padrão, ex.: "/jogo/:slug".
 * Retorna os parâmetros encontrados ou null.
 */
export function matchPath(pattern, pathname) {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    const part = patternParts[i];
    if (part.startsWith(":")) {
      params[part.slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (part !== pathParts[i]) {
      return null;
    }
  }
  return params;
}
