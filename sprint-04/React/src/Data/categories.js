// Categorias exibidas nos filtros do catálogo.
// O "id" é usado na URL (?categoria=rpg) e o "label" é o texto visível.
export const CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "aventura", label: "Aventura" },
  { id: "acao", label: "Ação" },
  { id: "rpg", label: "RPG" },
  { id: "puzzle", label: "Puzzle" },
  { id: "narrativo", label: "Narrativo" },
  { id: "simulacao", label: "Simulação" },
];

export const SORT_OPTIONS = [
  { id: "destaques", label: "Destaques" },
  { id: "recentes", label: "Mais recentes" },
  { id: "az", label: "Nome (A–Z)" },
  { id: "za", label: "Nome (Z–A)" },
];

export function getCategoryLabel(id) {
  return CATEGORIES.find((category) => category.id === id)?.label ?? id;
}
