import Link from "../../Router/Link";
import { CATEGORIES } from "../../Data/categories";
import logoFooter from "../../Assets/LogoFooter_IG.svg";

export default function Footer() {
  const categories = CATEGORIES.filter((category) => category.id !== "todos").slice(0, 4);

  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-branding">
          <Link to="/" className="logo">
            <img src={logoFooter} alt="Iara Games" />
          </Link>
          <p>
            Descubra jogos independentes, acompanhe novos projetos e conecte-se com o cenário
            criativo brasileiro.
          </p>
        </div>

        <div className="footer-column">
          <h4>Plataforma</h4>
          <ul className="footer-links">
            <li><Link to="/">Catálogo</Link></li>
            <li><Link to="/favoritos">Minha lista</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Categorias</h4>
          <ul className="footer-links">
            {categories.map((category) => (
              <li key={category.id}>
                <Link to={`/?categoria=${category.id}`}>{category.label}</Link>
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
