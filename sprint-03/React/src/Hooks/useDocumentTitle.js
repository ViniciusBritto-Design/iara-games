import { useEffect } from "react";

/** Atualiza o título da aba conforme a página exibida. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Iara Games` : "Iara Games | Catálogo";
  }, [title]);
}
