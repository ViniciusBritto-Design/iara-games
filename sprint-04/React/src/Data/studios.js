// Estúdios que já fazem parte da Iara Games: são os criadores dos jogos do catálogo.
// Os estúdios cadastrados pelo formulário (com endereço vindo da API ViaCEP)
// são somados a esta lista e ficam salvos no navegador.
export const TEAM_SIZES = [
  { id: "solo", label: "Desenvolvedor solo" },
  { id: "pequena", label: "2 a 5 pessoas" },
  { id: "media", label: "6 a 15 pessoas" },
  { id: "grande", label: "Mais de 15 pessoas" },
];

export function getTeamSizeLabel(id) {
  return TEAM_SIZES.find((size) => size.id === id)?.label ?? "";
}

export const PARTNER_STUDIOS = [
  { id: "coletivo-boto", name: "Coletivo Boto", city: "Belém", uf: "PA", neighborhood: "Cidade Velha", teamSize: "pequena", game: "lendas-do-rio" },
  { id: "ipe-interativo", name: "Ipê Interativo", city: "Belo Horizonte", uf: "MG", neighborhood: "Savassi", teamSize: "media", game: "mata-viva" },
  { id: "tucuma-studio", name: "Tucumã Studio", city: "Manaus", uf: "AM", neighborhood: "Centro", teamSize: "pequena", game: "origens-do-norte" },
  { id: "pixel-caatinga", name: "Pixel Caatinga", city: "Recife", uf: "PE", neighborhood: "Bairro do Recife", teamSize: "media", game: "selva-neon" },
  { id: "garoa-games", name: "Garoa Games", city: "São Paulo", uf: "SP", neighborhood: "Vila Madalena", teamSize: "grande", game: "estudio-brasil" },
  { id: "mare-narrativas", name: "Maré Narrativas", city: "Salvador", uf: "BA", neighborhood: "Rio Vermelho", teamSize: "solo", game: "entre-aguas" },
  { id: "araucaria-jogos", name: "Araucária Jogos", city: "Curitiba", uf: "PR", neighborhood: "Batel", teamSize: "pequena", game: "raizes-da-serra" },
  { id: "cerrado-digital", name: "Cerrado Digital", city: "Goiânia", uf: "GO", neighborhood: "Setor Bueno", teamSize: "pequena", game: "horizonte-verde" },
];
