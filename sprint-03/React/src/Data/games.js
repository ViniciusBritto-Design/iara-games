// Base de dados local do catálogo.
// Em uma versão com back-end, este arquivo seria substituído por uma
// chamada à API — os componentes não precisariam mudar, pois recebem
// os jogos sempre no mesmo formato.
import lendasDoRio from "../Assets/Lendas do Rio.jpg";
import mataViva from "../Assets/Mata Viva.jpg";
import origensDoNorte from "../Assets/Origens do Norte.jpg";
import selvaNeon from "../Assets/Selva Neon.jpg";
import estudioBrasil from "../Assets/Estúdio Brasil.jpg";
import entreAguas from "../Assets/Entre Águas.jpg";
import raizesDaSerra from "../Assets/Raízes da Serra.jpg";
import horizonteVerde from "../Assets/Horizonte Verde.jpg";

export const GAMES = [
  {
    slug: "lendas-do-rio",
    title: "Lendas do Rio",
    category: "aventura",
    image: lendasDoRio,
    summary:
      "Explore paisagens misteriosas e avance por uma jornada marcada por descoberta e narrativa.",
    description:
      "Explore paisagens misteriosas e avance por uma jornada marcada por descoberta e narrativa. Um título autoral que valoriza a exploração livre e a atmosfera sonora inspirada no folclore brasileiro.",
    studio: "Coletivo Boto",
    region: "Pará",
    year: 2025,
    platforms: ["PC", "Switch"],
    modes: ["Um jogador"],
    rating: "10",
    tags: ["Folclore", "Exploração", "Trilha sonora"],
    featured: 1,
  },
  {
    slug: "mata-viva",
    title: "Mata Viva",
    category: "puzzle",
    image: mataViva,
    summary:
      "Resolva desafios em ambientes naturais e descubra caminhos em uma experiência estratégica.",
    description:
      "Resolva desafios em ambientes naturais e descubra caminhos em uma experiência estratégica. Cada fase propõe um quebra-cabeça inspirado em ecossistemas reais da fauna e flora nacionais.",
    studio: "Ipê Interativo",
    region: "Minas Gerais",
    year: 2024,
    platforms: ["PC", "Mobile"],
    modes: ["Um jogador"],
    rating: "Livre",
    tags: ["Natureza", "Estratégia", "Educativo"],
    featured: 4,
  },
  {
    slug: "origens-do-norte",
    title: "Origens do Norte",
    category: "rpg",
    image: origensDoNorte,
    summary:
      "Evolua habilidades, enfrente perigos e acompanhe uma jornada fantástica em mundo imersivo.",
    description:
      "Evolua habilidades, enfrente perigos e acompanhe uma jornada fantástica em mundo imersivo. O sistema de progressão é construído em torno de escolhas que moldam o destino do protagonista.",
    studio: "Tucumã Studio",
    region: "Amazonas",
    year: 2026,
    platforms: ["PC", "PlayStation"],
    modes: ["Um jogador"],
    rating: "12",
    tags: ["Fantasia", "Escolhas", "Progressão"],
    featured: 2,
  },
  {
    slug: "selva-neon",
    title: "Selva Neon",
    category: "acao",
    image: selvaNeon,
    summary:
      "Combate intenso, ritmo veloz e cenários vibrantes em uma aventura de estética futurista.",
    description:
      "Combate intenso, ritmo veloz e cenários vibrantes em uma aventura de estética futurista. As fases combinam movimentação ágil com um visual neon que remete à selva urbana.",
    studio: "Pixel Caatinga",
    region: "Pernambuco",
    year: 2026,
    platforms: ["PC", "Xbox", "PlayStation"],
    modes: ["Um jogador", "Cooperativo local"],
    rating: "14",
    tags: ["Futurista", "Combate", "Cooperativo"],
    featured: 3,
  },
  {
    slug: "estudio-brasil",
    title: "Estúdio Brasil",
    category: "simulacao",
    image: estudioBrasil,
    summary:
      "Construa sua equipe, organize lançamentos e faça seu estúdio crescer dentro do cenário indie.",
    description:
      "Construa sua equipe, organize lançamentos e faça seu estúdio crescer dentro do cenário indie. Gerencie equipe, orçamento e prazos enquanto constrói sua reputação no mercado.",
    studio: "Garoa Games",
    region: "São Paulo",
    year: 2023,
    platforms: ["PC", "Mobile"],
    modes: ["Um jogador"],
    rating: "Livre",
    tags: ["Gestão", "Indústria", "Estratégia"],
    featured: 6,
  },
  {
    slug: "entre-aguas",
    title: "Entre Águas",
    category: "narrativo",
    image: entreAguas,
    summary:
      "Acompanhe uma história guiada por escolhas, encontros e consequências ao longo da jornada.",
    description:
      "Acompanhe uma história guiada por escolhas, encontros e consequências ao longo da jornada. O ritmo contemplativo é conduzido por diálogos ramificados e paisagens ribeirinhas.",
    studio: "Maré Narrativas",
    region: "Bahia",
    year: 2025,
    platforms: ["PC", "Switch", "Mobile"],
    modes: ["Um jogador"],
    rating: "10",
    tags: ["Escolhas", "Ribeirinho", "Contemplativo"],
    featured: 5,
  },
  {
    slug: "raizes-da-serra",
    title: "Raízes da Serra",
    category: "puzzle",
    image: raizesDaSerra,
    summary:
      "Percorra cenários cheios de desafios visuais e descubra segredos escondidos pelo caminho.",
    description:
      "Percorra cenários cheios de desafios visuais e descubra segredos escondidos pelo caminho. A trilha sonora acústica reforça a atmosfera contemplativa das montanhas.",
    studio: "Araucária Jogos",
    region: "Paraná",
    year: 2024,
    platforms: ["PC", "Switch"],
    modes: ["Um jogador"],
    rating: "Livre",
    tags: ["Montanhas", "Segredos", "Contemplativo"],
    featured: 8,
  },
  {
    slug: "horizonte-verde",
    title: "Horizonte Verde",
    category: "acao",
    image: horizonteVerde,
    summary:
      "Missões dinâmicas, exploração ampla e progressão constante em um universo cheio de energia.",
    description:
      "Missões dinâmicas, exploração ampla e progressão constante em um universo cheio de energia. O mapa aberto incentiva a descoberta de rotas alternativas entre os objetivos.",
    studio: "Cerrado Digital",
    region: "Goiás",
    year: 2025,
    platforms: ["PC", "Xbox"],
    modes: ["Um jogador", "Online"],
    rating: "12",
    tags: ["Mundo aberto", "Missões", "Exploração"],
    featured: 7,
  },
];

export function getGameBySlug(slug) {
  return GAMES.find((game) => game.slug === slug);
}
