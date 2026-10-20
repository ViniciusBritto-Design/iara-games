import { useLibrary } from "../../Context/LibraryContext";

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="heart-icon">
      <path
        d="M12 20.5s-7.5-4.6-9.3-9.4C1.5 7.9 3.6 4.5 7 4.5c2 0 3.6 1.1 5 2.9 1.4-1.8 3-2.9 5-2.9 3.4 0 5.5 3.4 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * variant="icon": botão redondo sobre a capa do card.
 * variant="full": botão com texto, usado na página do jogo.
 */
export default function FavoriteButton({ game, variant = "icon" }) {
  const { isFavorite, toggleFavorite } = useLibrary();
  const saved = isFavorite(game.slug);
  const label = saved ? `Remover ${game.title} da minha lista` : `Salvar ${game.title} na minha lista`;

  return (
    <button
      type="button"
      className={`favorite-btn favorite-btn--${variant} ${saved ? "is-saved" : ""}`}
      aria-pressed={saved}
      aria-label={variant === "icon" ? label : undefined}
      title={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(game.slug);
      }}
    >
      <HeartIcon filled={saved} />
      {variant === "full" && <span>{saved ? "Na minha lista" : "Salvar na minha lista"}</span>}
    </button>
  );
}
