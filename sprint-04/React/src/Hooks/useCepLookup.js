import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAddressByCep, getErrorMessage } from "../Services/viacep";

const IDLE = { status: "idle", address: null, error: "", errorCode: "" };

/**
 * Consulta de CEP com estados de carregamento, sucesso e erro.
 * - status: "idle" | "loading" | "success" | "error"
 * - Se o usuário digitar outro CEP antes da resposta chegar, a consulta
 *   anterior é cancelada (AbortController) e nunca sobrescreve a nova.
 */
export function useCepLookup() {
  const [state, setState] = useState(IDLE);
  const controllerRef = useRef(null);

  const lookup = useCallback(async (cep) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState({ ...IDLE, status: "loading" });
    try {
      const address = await fetchAddressByCep(cep, { signal: controller.signal });
      if (controller.signal.aborted) return null;
      setState({ ...IDLE, status: "success", address });
      return address;
    } catch (error) {
      if (controller.signal.aborted) return null;
      setState({ ...IDLE, status: "error", error: getErrorMessage(error), errorCode: error.code });
      return null;
    }
  }, []);

  // Usa um endereço que já veio da API (ex.: escolhido na busca por endereço).
  const applyAddress = useCallback((address) => {
    controllerRef.current?.abort();
    setState({ ...IDLE, status: "success", address });
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setState(IDLE);
  }, []);

  // Cancela qualquer consulta pendente ao sair da página.
  useEffect(() => () => controllerRef.current?.abort(), []);

  return { ...state, lookup, applyAddress, reset };
}
