import NavItem from "./NavItem";
import { CATEGORIES } from "../../Data/categories";
import logoFooter from "../../Assets/LogoFooter_IG.svg";
import { PLATFORM_PAGES } from "../../Data/site";

export default function Footer({ area }) {
  const inCatalog = area === "catalogo";
  const inStudios = area === "estudios";
  const categories = CATEGORIES.filter((category) => category.id !== "todos").slice(0, 4);

  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-branding">
          <a href={PLATFORM_PAGES.home} className="logo">
            <img src={logoFooter} alt="Iara Games" />
          </a>
          <p>
            Descubra jogos independentes, acompanhe novos projetos e conecte-se com o cenário
            criativo brasileiro.
          </p>
        </div>

        <div className="footer-column">
          <h4>Plataforma</h4>
          <ul className="footer-links">
            <li><a href={PLATFORM_PAGES.home}>Início</a></li>
            <li><NavItem internal={inCatalog} to="/" href={PLATFORM_PAGES.catalog}>Catálogo</NavItem></li>
            <li><NavItem internal={inStudios} to="/" href={PLATFORM_PAGES.studios}>Estúdios</NavItem></li>
            <li><NavItem internal={inStudios} to="/cadastrar" href={`${PLATFORM_PAGES.studios}#/cadastrar`}>Cadastrar estúdio</NavItem></li>
            <li><a href={PLATFORM_PAGES.publish}>Publicar meu jogo</a></li>
            <li><NavItem internal={inCatalog} to="/favoritos" href={PLATFORM_PAGES.favorites}>Minha lista</NavItem></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Categorias</h4>
          <ul className="footer-links">
            {categories.map((category) => (
              <li key={category.id}>
                <NavItem
                  internal={inCatalog}
                  to={`/?categoria=${category.id}`}
                  href={`${PLATFORM_PAGES.catalog}#/?categoria=${category.id}`}
                >
                  {category.label}
                </NavItem>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>Iara Games · Projeto acadêmico FIAP · 2026</p>
      </div>
    </footer>
  );
}
