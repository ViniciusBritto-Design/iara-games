import { useState } from "react";
import Link from "../../Router/Link";
import { useStudios } from "../../Context/StudiosContext";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle";
import StudioForm from "../../Components/Studios/StudioForm";
import StudioCard from "../../Components/Studios/StudioCard";

const BENEFITS = [
  { title: "Seja encontrado", text: "Jogadores e outros devs descobrem seu estúdio pelo mapa da cena." },
  { title: "Mostre de onde você cria", text: "Seu estúdio aparece no seu estado, ao lado de quem faz jogos perto de você." },
  { title: "Divulgue seu trabalho", text: "Inclua o site ou portfólio para quem quiser conhecer mais." },
];

export default function RegisterStudioPage() {
  useDocumentTitle("Cadastrar estúdio");
  const { addStudio } = useStudios();
  const [created, setCreated] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = (studio) => {
    setCreated(addStudio(studio));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const registerAnother = () => {
    setCreated(null);
    setFormKey((key) => key + 1); // recria o formulário vazio
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <Link to="/" className="back-link">← Voltar aos estúdios</Link>
            <span className="section-label">Cadastro de estúdio</span>
            <h1>Coloque seu estúdio no mapa da cena indie</h1>
            <p>
              Conte um pouco sobre o seu estúdio e mostre para a comunidade de onde vêm os seus jogos.
              Leva menos de um minuto.
            </p>
          </div>
        </div>
      </section>

      <section className="register-section">
        <div className="container register-layout">
          <div className="register-main">
            {created ? (
              <div className="register-success" role="status">
                <div className="form-success-icon" aria-hidden="true">✓</div>
                <div>
                  <h2>{created.name} está no mapa!</h2>
                  <p>
                    Cadastro concluído em {created.city}/{created.uf}. Veja como o estúdio aparece para
                    a comunidade:
                  </p>
                </div>
                <div className="register-success-card">
                  <StudioCard studio={created} />
                </div>
                <div className="hero-actions">
                  <Link to={`/?uf=${created.uf}&novo=${created.id}`} className="btn btn-primary">
                    Ver no mapa
                  </Link>
                  <button type="button" className="btn btn-secondary" onClick={registerAnother}>
                    Cadastrar outro estúdio
                  </button>
                </div>
              </div>
            ) : (
              <StudioForm key={formKey} onSubmit={handleSubmit} />
            )}
          </div>

          <aside className="register-aside">
            <h2>Por que cadastrar</h2>
            <ol className="register-steps">
              {BENEFITS.map((step, index) => (
                <li key={step.title}>
                  <span className="step-number">{index + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>
    </>
  );
}
