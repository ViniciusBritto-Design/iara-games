import { useRef, useState } from "react";
import { STATES } from "../../Data/states";
import { getErrorMessage, searchCepsByAddress } from "../../Services/viacep";

/**
 * "Não sei meu CEP": usa o segundo endpoint da ViaCEP para listar os CEPs
 * de uma rua. Ao escolher um resultado, o endereço vai direto para o formulário.
 */
export default function AddressSearch({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState({ uf: "", city: "", street: "" });
  const [state, setState] = useState({ status: "idle", results: [], error: "" });
  const controllerRef = useRef(null);

  const update = (field) => (event) => setQuery((current) => ({ ...current, [field]: event.target.value }));

  const handleSearch = async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setState({ status: "loading", results: [], error: "" });
    try {
      const results = await searchCepsByAddress(query, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setState({
        status: results.length ? "success" : "empty",
        results,
        error: results.length ? "" : "Nenhum CEP encontrado. Tente só uma parte do nome da rua.",
      });
    } catch (error) {
      if (controller.signal.aborted) return;
      setState({ status: "error", results: [], error: getErrorMessage(error) });
    }
  };

  // Enter dentro da busca não deve enviar o formulário de cadastro.
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const choose = (address) => {
    onSelect(address);
    setOpen(false);
  };

  return (
    <div className="address-search">
      <button
        type="button"
        className="text-btn"
        aria-expanded={open}
        aria-controls="buscaPorEndereco"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Fechar busca por endereço" : "Não sei meu CEP"}
      </button>

      {open && (
        <div className="address-search-panel" id="buscaPorEndereco">
          <p className="address-search-hint">
            Informe o estado, a cidade e parte do nome da rua. A ViaCEP devolve até 50 CEPs.
          </p>
          <div className="address-search-fields">
            <div className="form-group">
              <label htmlFor="buscaUf">Estado</label>
              <select id="buscaUf" value={query.uf} onChange={update("uf")}>
                <option value="">UF</option>
                {STATES.map((item) => (
                  <option key={item.uf} value={item.uf}>{item.uf}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="buscaCidade">Cidade</label>
              <input id="buscaCidade" value={query.city} onChange={update("city")} onKeyDown={handleKeyDown} placeholder="Ex.: Recife" />
            </div>
            <div className="form-group">
              <label htmlFor="buscaRua">Rua</label>
              <input id="buscaRua" value={query.street} onChange={update("street")} onKeyDown={handleKeyDown} placeholder="Ex.: Boa Vista" />
            </div>
            <button
              type="button"
              className="btn btn-secondary address-search-btn"
              onClick={handleSearch}
              disabled={state.status === "loading"}
            >
              {state.status === "loading" ? "Buscando…" : "Buscar CEPs"}
            </button>
          </div>

          <p className={`cep-status ${state.error ? "is-error" : ""}`} aria-live="polite">
            {state.status === "success" && `${state.results.length} ${state.results.length === 1 ? "resultado" : "resultados"}. Escolha o seu:`}
            {state.error}
          </p>

          {state.results.length > 0 && (
            <ul className="address-results">
              {state.results.map((address, index) => (
                <li key={`${address.cep}-${index}`}>
                  <button type="button" onClick={() => choose(address)}>
                    <strong>{address.street || "Logradouro sem nome"}</strong>
                    <span>
                      {[address.complement, address.neighborhood].filter(Boolean).join(" · ")}
                    </span>
                    <span className="address-result-cep">{address.cep}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
