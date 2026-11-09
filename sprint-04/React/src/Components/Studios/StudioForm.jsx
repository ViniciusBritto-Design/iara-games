import { useEffect, useRef, useState } from "react";
import { STATES } from "../../Data/states";
import { TEAM_SIZES } from "../../Data/studios";
import { useCepLookup } from "../../Hooks/useCepLookup";
import { cleanCep, formatCep, isCompleteCep } from "../../Services/viacep";
import AddressSearch from "./AddressSearch";

const EMPTY = {
  name: "",
  owner: "",
  email: "",
  teamSize: "",
  website: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  uf: "",
};

const ADDRESS_FIELDS = ["street", "neighborhood", "city", "uf"];

// Regras de validação. Cada função devolve a mensagem de erro ou "".
function validate(values, addressSource) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = "Informe o nome do estúdio.";
  if (values.owner.trim().length < 3) errors.owner = "Informe o nome da pessoa responsável.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = "Digite um e-mail válido.";
  if (!values.teamSize) errors.teamSize = "Escolha o tamanho da equipe.";
  if (values.website.trim() && !/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(values.website.trim())) {
    errors.website = "Use um endereço completo, começando com https://";
  }

  if (!isCompleteCep(values.cep)) errors.cep = "O CEP precisa ter 8 números.";
  else if (!addressSource) errors.cep = "Busque um CEP válido para preencher o endereço.";

  if (addressSource) {
    if (!values.street.trim()) errors.street = "Informe a rua.";
    if (!values.neighborhood.trim()) errors.neighborhood = "Informe o bairro.";
    if (!values.city.trim()) errors.city = "Informe a cidade.";
    if (!values.uf) errors.uf = "Escolha o estado.";
  }
  if (!values.number.trim()) errors.number = "Informe o número (ou s/n).";
  return errors;
}

export default function StudioForm({ onSubmit }) {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  // De onde veio o endereço: "api" (ViaCEP), "manual" (API fora do ar) ou null.
  const [addressSource, setAddressSource] = useState(null);
  // Campos que a API preencheu ficam travados (dados oficiais dos Correios).
  const [lockedFields, setLockedFields] = useState([]);
  const [focusTarget, setFocusTarget] = useState(null);
  const cep = useCepLookup();
  const lastLookup = useRef("");
  const numberRef = useRef(null);
  const streetRef = useRef(null);

  const errors = validate(values, addressSource);
  const showError = (field) => (touched[field] || submitted) && errors[field];

  const setField = (field, value) => setValues((current) => ({ ...current, [field]: value }));

  // Preenche o endereço com a resposta da API.
  const fillAddress = (address) => {
    setValues((current) => ({
      ...current,
      cep: address.cep,
      street: address.street,
      neighborhood: address.neighborhood,
      city: address.city,
      uf: address.uf,
      // O "complemento" da ViaCEP é a faixa de numeração da rua (ex.: "lado par"),
      // não o complemento do estúdio; por isso ele aparece só como dica.
    }));
    setLockedFields(ADDRESS_FIELDS.filter((field) => Boolean(address[field])));
    setAddressSource("api");
    lastLookup.current = cleanCep(address.cep);
    // Leva o cursor para o próximo campo que a pessoa precisa preencher.
    setFocusTarget(address.street ? "number" : "street");
  };

  const clearAddress = () => {
    setValues((current) => ({ ...current, street: "", neighborhood: "", city: "", uf: "" }));
    setLockedFields([]);
    setAddressSource(null);
  };

  const runLookup = async (value) => {
    const digits = cleanCep(value);
    lastLookup.current = digits;
    const address = await cep.lookup(digits);
    if (address) fillAddress(address);
    else clearAddress();
  };

  const handleCepChange = (event) => {
    const formatted = formatCep(event.target.value);
    setField("cep", formatted);
    const digits = cleanCep(formatted);
    if (digits.length === 8 && digits !== lastLookup.current) {
      runLookup(digits); // busca automática assim que o 8º número é digitado
    } else if (digits.length < 8 && (addressSource || cep.status !== "idle")) {
      lastLookup.current = "";
      cep.reset();
      clearAddress();
    }
  };

  const handleSelectFromSearch = (address) => {
    cep.applyAddress(address);
    fillAddress(address);
    setTouched((current) => ({ ...current, cep: true }));
  };

  const enableManual = () => {
    cep.reset();
    setLockedFields([]);
    setAddressSource("manual");
    setFocusTarget("street");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) {
      const firstInvalid = event.currentTarget.querySelector("[aria-invalid='true']");
      firstInvalid?.focus();
      return;
    }
    const address = cep.address ?? {};
    onSubmit({
      ...Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()])),
      cep: formatCep(values.cep),
      ddd: addressSource === "api" ? address.ddd : "",
      ibge: addressSource === "api" ? address.ibge : "",
      addressSource,
    });
  };

  // O foco só muda depois que os campos de endereço já foram habilitados na tela.
  useEffect(() => {
    if (!focusTarget) return;
    (focusTarget === "number" ? numberRef : streetRef).current?.focus();
    setFocusTarget(null);
  }, [focusTarget]);

  const fieldProps = (field) => ({
    id: field,
    name: field,
    value: values[field],
    onChange: (event) => setField(field, event.target.value),
    onBlur: () => setTouched((current) => ({ ...current, [field]: true })),
    "aria-invalid": showError(field) ? "true" : "false",
    "aria-describedby": `${field}-erro`,
  });

  const groupClass = (field, extra = "") =>
    ["form-group", extra, showError(field) ? "has-error" : "", touched[field] && !errors[field] && values[field] ? "has-success" : ""]
      .filter(Boolean)
      .join(" ");

  const addressDisabled = !addressSource;
  const canGoManual = cep.status === "error" && ["network", "timeout", "server"].includes(cep.errorCode);

  return (
    <form className="developer-form studio-form" noValidate onSubmit={handleSubmit}>
      <fieldset>
        <legend>Sobre o estúdio</legend>
        <div className="form-grid">
          <div className={groupClass("name")}>
            <label htmlFor="name">Nome do estúdio *</label>
            <input {...fieldProps("name")} placeholder="Ex.: Jabuti Interativo" autoComplete="organization" />
            <span className="form-error" id="name-erro">{showError("name")}</span>
          </div>
          <div className={groupClass("owner")}>
            <label htmlFor="owner">Responsável *</label>
            <input {...fieldProps("owner")} placeholder="Nome e sobrenome" autoComplete="name" />
            <span className="form-error" id="owner-erro">{showError("owner")}</span>
          </div>
          <div className={groupClass("email")}>
            <label htmlFor="email">E-mail de contato *</label>
            <input {...fieldProps("email")} type="email" placeholder="contato@estudio.com" autoComplete="email" />
            <span className="form-error" id="email-erro">{showError("email")}</span>
          </div>
          <div className={groupClass("teamSize")}>
            <label htmlFor="teamSize">Tamanho da equipe *</label>
            <select {...fieldProps("teamSize")}>
              <option value="">Selecione</option>
              {TEAM_SIZES.map((size) => (
                <option key={size.id} value={size.id}>{size.label}</option>
              ))}
            </select>
            <span className="form-error" id="teamSize-erro">{showError("teamSize")}</span>
          </div>
          <div className={groupClass("website", "full-width")}>
            <label htmlFor="website">Site ou portfólio (opcional)</label>
            <input {...fieldProps("website")} type="url" placeholder="https://" autoComplete="url" />
            <span className="form-error" id="website-erro">{showError("website")}</span>
          </div>
        </div>
      </fieldset>

      <fieldset className="address-fieldset">
        <legend>Onde fica o estúdio</legend>

        <div className="cep-row">
          <div className={`${groupClass("cep")} cep-group ${cep.status === "success" ? "has-success" : ""}`}>
            <label htmlFor="cep">CEP *</label>
            <div className="cep-input-wrapper">
              <input
                {...fieldProps("cep")}
                onChange={handleCepChange}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                maxLength={9}
                aria-describedby="cep-erro cep-status"
              />
              {cep.status === "loading" && <span className="cep-spinner" aria-hidden="true" />}
            </div>
            <span className="form-error" id="cep-erro">{cep.status !== "error" && showError("cep")}</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary cep-btn"
            onClick={() => runLookup(values.cep)}
            disabled={!isCompleteCep(values.cep) || cep.status === "loading"}
          >
            Buscar
          </button>
        </div>

        <div className={`cep-status ${cep.status === "error" ? "is-error" : ""} ${cep.status === "success" ? "is-success" : ""}`} id="cep-status" aria-live="polite">
          {cep.status === "idle" && !addressSource && "Digite o CEP: o endereço é preenchido automaticamente pela ViaCEP."}
          {cep.status === "loading" && "Consultando a ViaCEP…"}
          {cep.status === "success" && cep.address && (
            <>
              Endereço encontrado: {cep.address.city}/{cep.address.uf} · Região {cep.address.region}
              {cep.address.ddd && ` · DDD ${cep.address.ddd}`}
              {cep.address.complement && (
                <span className="cep-range">Faixa deste CEP: {cep.address.complement}</span>
              )}
              {!cep.address.street && (
                <span className="cep-range">CEP geral da cidade: informe a rua e o bairro.</span>
              )}
            </>
          )}
          {cep.status === "error" && cep.error}
          {addressSource === "manual" && "Preenchimento manual ativado."}
        </div>

        <div className="cep-helpers">
          <AddressSearch onSelect={handleSelectFromSearch} />
          {canGoManual && addressSource !== "manual" && (
            <button type="button" className="text-btn" onClick={enableManual}>
              Preencher endereço manualmente
            </button>
          )}
        </div>

        <div className={`form-grid address-grid ${addressDisabled ? "is-waiting" : ""}`}>
          <div className={groupClass("street", "full-width")}>
            <label htmlFor="street">Rua</label>
            <input {...fieldProps("street")} ref={streetRef} disabled={addressDisabled} readOnly={lockedFields.includes("street")} autoComplete="address-line1" />
            <span className="form-error" id="street-erro">{showError("street")}</span>
          </div>
          <div className={groupClass("number")}>
            <label htmlFor="number">Número *</label>
            <input {...fieldProps("number")} ref={numberRef} placeholder="Ex.: 120" autoComplete="address-line2" />
            <span className="form-error" id="number-erro">{showError("number")}</span>
          </div>
          <div className="form-group">
            <label htmlFor="complement">Complemento</label>
            <input {...fieldProps("complement")} placeholder="Sala, andar…" />
            <span className="form-error" id="complement-erro" />
          </div>
          <div className={groupClass("neighborhood")}>
            <label htmlFor="neighborhood">Bairro</label>
            <input {...fieldProps("neighborhood")} disabled={addressDisabled} readOnly={lockedFields.includes("neighborhood")} />
            <span className="form-error" id="neighborhood-erro">{showError("neighborhood")}</span>
          </div>
          <div className="form-grid city-uf">
            <div className={groupClass("city")}>
              <label htmlFor="city">Cidade</label>
              <input {...fieldProps("city")} disabled={addressDisabled} readOnly={lockedFields.includes("city")} autoComplete="address-level2" />
              <span className="form-error" id="city-erro">{showError("city")}</span>
            </div>
            <div className={groupClass("uf")}>
              <label htmlFor="uf">UF</label>
              <select {...fieldProps("uf")} disabled={addressDisabled || lockedFields.includes("uf")}>
                <option value="">--</option>
                {STATES.map((item) => (
                  <option key={item.uf} value={item.uf}>{item.uf}</option>
                ))}
              </select>
              <span className="form-error" id="uf-erro">{showError("uf")}</span>
            </div>
          </div>
        </div>
      </fieldset>

      <button type="submit" className="btn btn-primary submit-btn">
        Cadastrar estúdio
      </button>
    </form>
  );
}
