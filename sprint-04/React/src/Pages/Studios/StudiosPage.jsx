import { useEffect, useMemo } from "react";
import Link from "../../Router/Link";
import { navigate, useLocation } from "../../Router/router";
import { useStudios } from "../../Context/StudiosContext";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle";
import { getState, REGIONS } from "../../Data/states";
import BrazilTileMap from "../../Components/Studios/BrazilTileMap";
import StudioCard from "../../Components/Studios/StudioCard";
import EmptyState from "../../Components/Catalog/EmptyState";

export default function StudiosPage() {
  useDocumentTitle("Estúdios");
  const { studios, removeStudio } = useStudios();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const selectedUf = getState(params.get("uf")) ? params.get("uf") : "";
  const highlightId = params.get("novo") ?? "";

  // Quantos estúdios há em cada estado (alimenta as cores do mapa).
  const counts = useMemo(
    () => studios.reduce((acc, studio) => ({ ...acc, [studio.uf]: (acc[studio.uf] ?? 0) + 1 }), {}),
    [studios]
  );

  const stats = useMemo(() => {
    const ufs = new Set(studios.map((studio) => studio.uf));
    const regions = new Set([...ufs].map((uf) => getState(uf)?.region).filter(Boolean));
    return { total: studios.length, states: ufs.size, regions: regions.size };
  }, [studios]);

  const visible = selectedUf ? studios.filter((studio) => studio.uf === selectedUf) : studios;
  const selectedState = getState(selectedUf);

  // Depois do cadastro, rola até o card recém-criado.
  useEffect(() => {
    if (!highlightId) return;
    document.getElementById(`estudio-${highlightId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightId]);

  const selectUf = (uf) => navigate(uf ? `/?uf=${uf}` : "/", { replace: true });

  const handleRemove = (studio) => {
    if (window.confirm(`Remover "${studio.name}" do mapa?`)) removeStudio(studio.id);
  };

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-grid studios-hero">
          <div className="page-hero-content">
            <span className="section-label">Estúdios brasileiros</span>
            <h1>A cena indie do Brasil, estado por estado</h1>
            <p>
              Conheça quem cria os jogos da Iara Games e coloque o seu estúdio no mapa da cena
              independente brasileira.
            </p>
            <div className="hero-actions">
              <Link to="/cadastrar" className="btn btn-primary">
                Cadastrar meu estúdio
              </Link>
              <a href="#lista-estudios" className="btn btn-secondary" onClick={(event) => {
                event.preventDefault();
                document.getElementById("lista-estudios")?.scrollIntoView({ behavior: "smooth" });
              }}>
                Ver estúdios
              </a>
            </div>
          </div>

          <dl className="studio-stats">
            <div>
              <dt>Estúdios</dt>
              <dd>{stats.total}</dd>
            </div>
            <div>
              <dt>Estados</dt>
              <dd>{stats.states}<small>/27</small></dd>
            </div>
            <div>
              <dt>Regiões</dt>
              <dd>{stats.regions}<small>/{REGIONS.length}</small></dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="studios-section" id="lista-estudios">
        <div className="container studios-layout">
          <aside className="studios-map-panel">
            <h2>Mapa da cena</h2>
            <p>Toque em um estado para ver os estúdios de lá.</p>
            <BrazilTileMap counts={counts} selectedUf={selectedUf} onSelect={selectUf} />
          </aside>

          <div className="studios-list-panel">
            <div className="results-bar">
              <p className="results-count" aria-live="polite">
                <strong>{visible.length}</strong> {visible.length === 1 ? "estúdio" : "estúdios"}
                {selectedState ? ` em ${selectedState.name}` : " na plataforma"}
              </p>
              {selectedState && (
                <button type="button" className="text-btn" onClick={() => selectUf("")}>
                  Ver todos os estados
                </button>
              )}
            </div>

            {visible.length > 0 ? (
              <ul className="studio-list">
                {visible.map((studio) => (
                  <li key={studio.id} id={`estudio-${studio.id}`}>
                    <StudioCard
                      studio={studio}
                      highlighted={studio.id === highlightId}
                      onRemove={handleRemove}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title={`Nenhum estúdio em ${selectedState?.name ?? "este estado"} ainda`}
                message="Que tal ser o primeiro? O cadastro leva menos de um minuto."
                action={
                  <Link to="/cadastrar" className="btn btn-primary">
                    Cadastrar meu estúdio
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
