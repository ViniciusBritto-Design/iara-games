// Comunicação com a API pública ViaCEP (https://viacep.com.br).
// Endpoints usados:
//   GET /ws/{cep}/json/                       -> endereço completo de um CEP
//   GET /ws/{UF}/{cidade}/{logradouro}/json/  -> lista de CEPs de um endereço (até 50)
//
// Todo o resto da aplicação usa apenas as funções deste arquivo; os componentes
// recebem o endereço já "traduzido" para o formato da Iara Games.
import { getState } from "../Data/states";

const BASE_URL = "https://viacep.com.br/ws";
const TIMEOUT_MS = 8000;

/** Erro com um código para a interface escolher a mensagem certa. */
export class ViaCepError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ViaCepError";
    this.code = code; // "invalid" | "not_found" | "network" | "timeout" | "server"
  }
}

/** Mantém só os números (máximo de 8). */
export function cleanCep(value) {
  return String(value ?? "").replace(/\D/g, "").slice(0, 8);
}

/** Aplica a máscara 00000-000 enquanto o usuário digita. */
export function formatCep(value) {
  const digits = cleanCep(value);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export function isCompleteCep(value) {
  return cleanCep(value).length === 8;
}

// Converte a resposta da ViaCEP (campos em português, alguns opcionais)
// para o formato usado pelos componentes.
function normalizeAddress(data) {
  const state = getState(data.uf);
  return {
    cep: formatCep(data.cep),
    street: data.logradouro || "",
    complement: data.complemento || "",
    neighborhood: data.bairro || "",
    city: data.localidade || "",
    uf: data.uf || "",
    state: data.estado || state?.name || "",
    region: data.regiao || state?.region || "",
    ibge: data.ibge || "",
    ddd: data.ddd || "",
  };
}

// fetch com tempo limite e suporte a cancelamento externo (AbortController).
async function requestJson(url, signal) {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);
  const abortFromOutside = () => controller.abort();
  signal?.addEventListener("abort", abortFromOutside);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (response.status === 400) {
      throw new ViaCepError("invalid", "A ViaCEP recusou o formato da consulta.");
    }
    if (!response.ok) {
      throw new ViaCepError("server", `A ViaCEP respondeu com erro ${response.status}.`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof ViaCepError) throw error;
    if (timedOut) throw new ViaCepError("timeout", "A ViaCEP demorou demais para responder.");
    if (signal?.aborted) throw error; // consulta substituída por outra: ninguém precisa ver
    throw new ViaCepError("network", "Não foi possível conectar à ViaCEP.");
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abortFromOutside);
  }
}

// Cache em memória: consultar o mesmo CEP de novo não gera outra requisição.
const cepCache = new Map();

/** Busca o endereço completo de um CEP. */
export async function fetchAddressByCep(cep, { signal } = {}) {
  const digits = cleanCep(cep);
  if (digits.length !== 8) {
    throw new ViaCepError("invalid", "O CEP precisa ter 8 números.");
  }
  if (cepCache.has(digits)) return cepCache.get(digits);

  const data = await requestJson(`${BASE_URL}/${digits}/json/`, signal);
  // CEP com formato certo mas inexistente: a ViaCEP responde 200 com { "erro": "true" }.
  if (!data || data.erro) {
    throw new ViaCepError("not_found", "Esse CEP não existe na base dos Correios.");
  }

  const address = normalizeAddress(data);
  cepCache.set(digits, address);
  return address;
}

/** Descobre CEPs a partir de UF, cidade e parte do nome da rua. */
export async function searchCepsByAddress({ uf, city, street }, { signal } = {}) {
  const cityName = city.trim();
  const streetName = street.trim();
  if (!uf || cityName.length < 3 || streetName.length < 3) {
    throw new ViaCepError("invalid", "Informe o estado, a cidade e a rua (mínimo de 3 letras).");
  }

  const path = [uf, cityName, streetName].map(encodeURIComponent).join("/");
  const data = await requestJson(`${BASE_URL}/${path}/json/`, signal);
  if (!Array.isArray(data)) {
    throw new ViaCepError("server", "Resposta inesperada da ViaCEP.");
  }
  return data.map(normalizeAddress);
}

/** Texto amigável para cada tipo de erro. */
export function getErrorMessage(error) {
  switch (error?.code) {
    case "not_found":
      return "CEP não encontrado. Confira os números ou use a busca por endereço.";
    case "invalid":
      return error.message;
    case "timeout":
      return "A consulta demorou demais. Tente novamente ou preencha o endereço manualmente.";
    case "network":
      return "Sem conexão com a ViaCEP no momento. Você pode preencher o endereço manualmente.";
    default:
      return "A ViaCEP está instável agora. Tente de novo em instantes.";
  }
}
