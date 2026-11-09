# Iara Games — Áreas em React (Catálogo e Estúdios)

Projeto React da plataforma Iara Games. Reúne duas áreas do portal:

- **Catálogo de jogos** — entrega "Hospedando React" (Fase 06).
- **Estúdios** — entrega final (Fase 07): cadastro de estúdios que consome a **API ViaCEP** e mapa da cena indie brasileira.

**Plataforma completa:** https://viniciusbritto-design.github.io/iara-games/  
**Área de Estúdios (Fase 07):** https://viniciusbritto-design.github.io/iara-games/estudios/  
**Cadastro com ViaCEP:** https://viniciusbritto-design.github.io/iara-games/estudios/#/cadastrar  
**Catálogo (Fase 06):** https://viniciusbritto-design.github.io/iara-games/catalogo/

## Área de Estúdios e a API ViaCEP

A [ViaCEP](https://viacep.com.br) é um serviço público e gratuito que devolve, em JSON, o endereço de qualquer CEP brasileiro a partir da base dos Correios. Não exige chave de acesso e aceita chamadas direto do navegador (CORS liberado).

| Endpoint usado | Para quê |
| --- | --- |
| `GET https://viacep.com.br/ws/{cep}/json/` | Preencher o endereço a partir do CEP digitado |
| `GET https://viacep.com.br/ws/{UF}/{cidade}/{rua}/json/` | "Não sei meu CEP": lista até 50 CEPs de uma rua |

### Como funciona

1. A pessoa digita o CEP. O campo aplica a máscara `00000-000` e, assim que o 8º número entra, o React chama a ViaCEP (também há o botão "Buscar").
2. Enquanto a resposta não chega, um indicador de carregamento aparece e a mensagem "Consultando a ViaCEP…" é anunciada para leitores de tela.
3. Com a resposta, rua, bairro, cidade e UF são preenchidos e travados (são dados oficiais). A interface mostra a região e o DDD que vieram da API, e o cursor pula para o campo "Número".
4. Ao cadastrar, o estúdio é salvo no navegador (localStorage) e aparece na hora no **mapa da cena**: um mapa do Brasil em ladrilhos onde cada estado muda de cor conforme a quantidade de estúdios.

### Tratamento das respostas

| Situação | Resposta da ViaCEP | O que a interface faz |
| --- | --- | --- |
| CEP encontrado | `200` com o endereço | Preenche e trava os campos |
| CEP inexistente | `200` com `{ "erro": "true" }` | "CEP não encontrado" + sugestão de busca por endereço |
| Formato inválido | `400` | Mensagem de formato inválido |
| CEP geral da cidade | `200` sem rua e bairro | Preenche cidade/UF e libera rua e bairro para digitar |
| Sem internet / API fora do ar | falha de rede ou mais de 8 s | Explica o problema e oferece "Preencher endereço manualmente" |

Outros cuidados: se a pessoa digitar outro CEP antes da resposta anterior chegar, a consulta antiga é cancelada com `AbortController` (nunca sobrescreve a nova), e CEPs já consultados ficam em cache na memória, sem nova requisição.

## Estrutura de pastas

A Sprint 04 repete a Sprint 03 (páginas HTML de Início e Publicar + Catálogo em React) e soma a área de Estúdios:

```
sprint-04/
├── index.html                  # entrada do site: leva para HTML/index.html
├── Assets/  CSS/  HTML/  JS/   # páginas da Sprint 02 (agora com o link "Estúdios" no menu)
└── React/                      # projeto Vite com as duas áreas React
    ├── catalogo/index.html     # página de entrada do Catálogo
    ├── estudios/index.html     # página de entrada de Estúdios
    ├── package.json  ·  vite.config.js
    └── src/
        ├── main-catalogo.jsx   ·  CatalogApp.jsx    # Catálogo (Fase 06)
        ├── main-estudios.jsx   ·  StudiosApp.jsx    # Estúdios (Fase 07)
        ├── Services/viacep.js  # toda a comunicação com a API ViaCEP
        ├── Hooks/              # useCepLookup (consulta de CEP), useCatalogFilters, useLocalStorage...
        ├── Context/            # LibraryContext (minha lista) e StudiosContext (estúdios cadastrados)
        ├── Components/
        │   ├── Layout/         # Header, Footer, NavItem (compartilhados pelas duas áreas)
        │   ├── Studios/        # StudioForm, AddressSearch, BrazilTileMap, StudioCard
        │   ├── Catalog/  Game/
        ├── Pages/
        │   ├── Studios/        # StudiosPage, RegisterStudioPage, StudioNotFoundPage
        │   └── ...             # páginas do Catálogo
        ├── Data/               # jogos, categorias, estados (27 UFs), estúdios parceiros, links
        ├── CSS/                # base.css, catalog.css, studios.css
        ├── Router/             # roteador por hash (compatível com hospedagem estática)
        └── Utils/
```

As duas áreas compartilham cabeçalho, rodapé, estilos e a "Minha lista" (o contador do menu funciona nas duas, porque usam o mesmo localStorage).

## Conceitos de React aplicados na Fase 07

- **Consumo de API** com `fetch` e `async/await`, isolado em um serviço (`Services/viacep.js`).
- **Hook personalizado** `useCepLookup` com os estados `idle`, `loading`, `success` e `error`.
- **`AbortController`** para cancelar requisições antigas e aplicar tempo limite.
- **Formulário controlado** com validação em tempo real e foco automático no próximo campo.
- **Context API** para os estúdios cadastrados, persistidos com `useLocalStorage`.
- **Renderização derivada** com `useMemo` (contagem por estado e estatísticas do mapa).
- **Filtro na URL**: `#/?uf=SP` mostra os estúdios de São Paulo e pode ser compartilhado.

## Rodando localmente

Requer Node.js 18 ou superior.

```bash
cd sprint-04/React
npm install
npm run dev
```

O navegador abre em `/estudios/`; o Catálogo fica em `/catalogo/`. Para gerar a versão de produção: `npm run build` (resultado em `dist/`).

Observação: em `npm run dev`, os links para Início e Publicar não abrem, porque essas páginas ficam fora da pasta `React`. No site publicado tudo funciona.

## Hospedagem

A publicação é automática pelo GitHub Actions (`.github/workflows/deploy-react.yml`). A cada push na branch `main` que altere a `sprint-04`, o fluxo:

1. instala as dependências e gera o build das duas áreas React com o Vite;
2. monta o site completo: páginas HTML na raiz, Catálogo em `/catalogo/` e Estúdios em `/estudios/`;
3. publica tudo no GitHub Pages.

## Acessibilidade

Mensagens da consulta de CEP anunciadas com `aria-live`, erros ligados aos campos com `aria-describedby` e `aria-invalid`, foco movido para o primeiro campo inválido ao enviar, mapa de estados com botões `aria-pressed` e rótulos completos ("São Paulo: 2 estúdios"), e respeito à preferência de movimento reduzido.
