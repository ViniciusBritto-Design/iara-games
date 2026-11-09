// As 27 unidades da federação.
// "col" e "row" posicionam cada estado no mapa em grade (tile map) da página
// de Estúdios: cada estado vira um quadrado, mantendo a forma geral do Brasil.
export const STATES = [
  { uf: "RR", name: "Roraima", region: "Norte", col: 1, row: 0 },
  { uf: "AP", name: "Amapá", region: "Norte", col: 3, row: 0 },
  { uf: "AM", name: "Amazonas", region: "Norte", col: 1, row: 1 },
  { uf: "PA", name: "Pará", region: "Norte", col: 2, row: 1 },
  { uf: "MA", name: "Maranhão", region: "Nordeste", col: 3, row: 1 },
  { uf: "CE", name: "Ceará", region: "Nordeste", col: 4, row: 1 },
  { uf: "RN", name: "Rio Grande do Norte", region: "Nordeste", col: 5, row: 1 },
  { uf: "AC", name: "Acre", region: "Norte", col: 0, row: 2 },
  { uf: "RO", name: "Rondônia", region: "Norte", col: 1, row: 2 },
  { uf: "TO", name: "Tocantins", region: "Norte", col: 2, row: 2 },
  { uf: "PI", name: "Piauí", region: "Nordeste", col: 3, row: 2 },
  { uf: "PE", name: "Pernambuco", region: "Nordeste", col: 4, row: 2 },
  { uf: "PB", name: "Paraíba", region: "Nordeste", col: 5, row: 2 },
  { uf: "MT", name: "Mato Grosso", region: "Centro-Oeste", col: 1, row: 3 },
  { uf: "GO", name: "Goiás", region: "Centro-Oeste", col: 2, row: 3 },
  { uf: "BA", name: "Bahia", region: "Nordeste", col: 3, row: 3 },
  { uf: "SE", name: "Sergipe", region: "Nordeste", col: 4, row: 3 },
  { uf: "AL", name: "Alagoas", region: "Nordeste", col: 5, row: 3 },
  { uf: "MS", name: "Mato Grosso do Sul", region: "Centro-Oeste", col: 1, row: 4 },
  { uf: "DF", name: "Distrito Federal", region: "Centro-Oeste", col: 2, row: 4 },
  { uf: "MG", name: "Minas Gerais", region: "Sudeste", col: 3, row: 4 },
  { uf: "ES", name: "Espírito Santo", region: "Sudeste", col: 4, row: 4 },
  { uf: "SP", name: "São Paulo", region: "Sudeste", col: 2, row: 5 },
  { uf: "RJ", name: "Rio de Janeiro", region: "Sudeste", col: 3, row: 5 },
  { uf: "PR", name: "Paraná", region: "Sul", col: 2, row: 6 },
  { uf: "SC", name: "Santa Catarina", region: "Sul", col: 2, row: 7 },
  { uf: "RS", name: "Rio Grande do Sul", region: "Sul", col: 2, row: 8 },
];

export const REGIONS = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

export function getState(uf) {
  return STATES.find((state) => state.uf === uf);
}
