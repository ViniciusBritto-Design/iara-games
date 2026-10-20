import { useEffect, useState } from "react";
import Link from "../../Router/Link";
import { useLocation } from "../../Router/router";
import { useLibrary } from "../../Context/LibraryContext";
import logo from "../../Assets/Logo_IG.svg";
import { PLATFORM_PAGES } from "../../Data/site";

export default function Header() {
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
              <Link to="/" activeClassName="active">
                Catálogo
              </Link>
            </li>
            <li>
              <a href={PLATFORM_PAGES.publish}>Publicar meu jogo</a>
            </li>
            <li>
              <Link to="/favoritos" activeClassName="active" className="nav-favorites">
                Minha lista
                <span className="nav-badge" aria-label={`${favorites.length} jogos salvos`}>
                  {favorites.length}
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
