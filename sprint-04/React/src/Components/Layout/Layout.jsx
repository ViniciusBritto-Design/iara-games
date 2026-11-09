import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ area, children }) {
  return (
    <>
      <a href="#conteudo" className="skip-link" onClick={(event) => {
        // O "#conteudo" seria interpretado como rota; então movemos o foco manualmente.
        event.preventDefault();
        document.getElementById("conteudo")?.focus();
      }}>
        Pular para o conteúdo
      </a>
      <Header area={area} />
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
      <Footer area={area} />
    </>
  );
}
