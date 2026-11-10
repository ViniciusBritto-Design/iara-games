import { useEffect, useState } from "react";
import NavItem from "./NavItem";
import { useLocation } from "../../Router/router";
import { useLibrary } from "../../Context/LibraryContext";
import logo from "../../Assets/Logo_IG.svg";
import { PLATFORM_PAGES } from "../../Data/site";
import { HeartIcon } from "../Game/FavoriteButton";

export default function Header({ area }) {
  const inCatalog = area === "catalogo";
  const inStudios = area === "estudios";
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { favorites } = useLibrary();

  // Fecha o menu mobile sempre que o usuário troca de página.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="header">
      <div className="container header-content">
        <a href={PLATFORM_PAGES.home} className="logo" aria-label="Iara Games — página inicial">
          <img src={logo} alt="Iara Games" />
        </a>

        <nav className="nav" aria-label="Navegação principal">
          <button
            type="button"
            className={`nav-toggle ${menuOpen ? "active" : ""}`}
            aria-expanded={menuOpen}
            aria-controls="mainNavList"
            aria-label={menuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <ul className={`nav-list ${menuOpen ? "nav-open" : ""}`} id="mainNavList">
            <li>
              <a href={PLATFORM_PAGES.home}>Início</a>
            </li>
            <li>
              <NavItem internal={inCatalog} to="/" href={PLATFORM_PAGES.catalog}>
                Catálogo
              </NavItem>
            </li>
            <li>
              <NavItem
                internal={inStudios}
                to="/"
                href={PLATFORM_PAGES.studios}
                className={inStudios && pathname.startsWith("/cadastrar") ? "active" : undefined}
              >
                Estúdios
              </NavItem>
            </li>
            <li>
              <a href={PLATFORM_PAGES.publish}>Publicar meu jogo</a>
            </li>
          </ul>

          {/* "Minha lista" fica sempre visível no menu, inclusive no celular. */}
          <NavItem
            internal={inCatalog}
            to="/favoritos"
            href={PLATFORM_PAGES.favorites}
            className="nav-favorites"
            aria-label={
              favorites.length
                ? `Minha lista: ${favorites.length} ${favorites.length === 1 ? "jogo salvo" : "jogos salvos"}`
                : "Minha lista"
            }
            title="Minha lista"
          >
            <HeartIcon />
            {favorites.length > 0 && (
              <span className="nav-badge" aria-hidden="true">
                {favorites.length}
              </span>
            )}
          </NavItem>
        </nav>
      </div>
    </header>
  );
}
