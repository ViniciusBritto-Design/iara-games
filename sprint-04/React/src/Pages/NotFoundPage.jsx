import Link from "../Router/Link";
import EmptyState from "../Components/Catalog/EmptyState";
import { useDocumentTitle } from "../Hooks/useDocumentTitle";

export default function NotFoundPage() {
  useDocumentTitle("Página não encontrada");
  return (
    <section className="page-hero">
      <div className="container">
        <EmptyState
          title="Essa página não existe"
          message="O jogo ou endereço que você procurou não está no catálogo da Iara Games."
          action={
            <Link to="/" className="btn btn-primary">
              Voltar ao catálogo
            </Link>
          }
        />
      </div>
    </section>
  );
}
