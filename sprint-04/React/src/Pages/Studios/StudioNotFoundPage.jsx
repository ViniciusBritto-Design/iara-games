import Link from "../../Router/Link";
import EmptyState from "../../Components/Catalog/EmptyState";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle";

export default function StudioNotFoundPage() {
  useDocumentTitle("Página não encontrada");
  return (
    <section className="page-hero">
      <div className="container">
        <EmptyState
          title="Essa página não existe"
          message="O endereço que você abriu não faz parte da área de Estúdios da Iara Games."
          action={
            <Link to="/" className="btn btn-primary">
              Ver estúdios
            </Link>
          }
        />
      </div>
    </section>
  );
}
