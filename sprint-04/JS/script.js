/*
  Iara Games — script.js
*/

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initFavorites();
  initCatalogFilter();
  initFormValidation();
});

/* =====================================================================
   1) MENU MOBILE (HAMBÚRGUER)
   Problema resolvido: em telas pequenas o menu de navegação ficava
   sempre visível e "espremido" ao lado do logo, prejudicando a
   leitura e o toque em telas de celular. Agora o menu fica escondido
   por padrão no mobile e é revelado por um botão de hambúrguer.
===================================================================== */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const navList = document.getElementById('mainNavList');
  if (!toggle || !navList) return;

  toggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('nav-open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute(
      'aria-label',
      isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
    );
  });

  // Fecha o menu automaticamente ao selecionar um link,
  // evitando que o usuário precise fechar manualmente depois de navegar.
  navList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navList.classList.remove('nav-open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* =====================================================================
   2) FAVORITOS ("MINHA LISTA")
   Problema resolvido: só era possível salvar jogos dentro do Catálogo.
   Agora o coração aparece também nos jogos em destaque do Início, e o
   ícone de "Minha lista" no menu mostra quantos jogos estão salvos.
   A lista é a mesma do Catálogo e dos Estúdios (mesma chave no
   localStorage), então um jogo salvo aqui já aparece salvo lá.
===================================================================== */
const FAVORITES_KEY = 'iara:favoritos';

function readFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function saveFavorites(list) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  } catch (error) {
    // Navegação privada pode bloquear o armazenamento; a página segue funcionando.
  }
}

function initFavorites() {
  const buttons = document.querySelectorAll('[data-favorite]');
  const counters = document.querySelectorAll('[data-favorites-count]');

  function render() {
    const favorites = readFavorites();

    buttons.forEach((button) => {
      const saved = favorites.includes(button.dataset.favorite);
      const title = button.closest('.game-card')?.querySelector('h3')?.textContent || 'jogo';
      button.classList.toggle('is-saved', saved);
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute(
        'aria-label',
        saved ? `Remover ${title} da minha lista` : `Salvar ${title} na minha lista`
      );
      button.title = saved ? 'Remover da minha lista' : 'Salvar na minha lista';
      const path = button.querySelector('path');
      if (path) path.setAttribute('fill', saved ? 'currentColor' : 'none');
    });

    counters.forEach((badge) => {
      badge.textContent = favorites.length;
      badge.hidden = favorites.length === 0;
      const link = badge.closest('.nav-favorites');
      if (link) {
        const label = favorites.length === 1 ? '1 jogo salvo' : `${favorites.length} jogos salvos`;
        link.setAttribute('aria-label', favorites.length ? `Minha lista: ${label}` : 'Minha lista');
      }
    });
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const slug = button.dataset.favorite;
      const favorites = readFavorites();
      const next = favorites.includes(slug)
        ? favorites.filter((item) => item !== slug)
        : [...favorites, slug];
      saveFavorites(next);
      render();
    });
  });

  // Atualiza se a lista mudar em outra aba (ex.: Catálogo aberto ao lado).
  window.addEventListener('storage', (event) => {
    if (event.key === FAVORITES_KEY) render();
  });

  render();
}

/* =====================================================================
   3) FILTRO DINÂMICO DO CATÁLOGO POR CATEGORIA + BUSCA POR NOME
   Problema resolvido: no catálogo, os "chips" de categoria eram
   apenas decorativos — o usuário via as categorias mas não conseguia
   usá-las para encontrar jogos mais rápido. Agora, ao clicar em uma
   categoria, a lista de jogos é filtrada instantaneamente. Além disso,
   uma barra de busca permite filtrar pelo nome do jogo em tempo real,
   e os dois filtros (categoria + texto) funcionam em conjunto.
===================================================================== */
function initCatalogFilter() {
  const chips = document.querySelectorAll('.category-chip[data-filter]');
  const cards = document.querySelectorAll('.catalog-card[data-category]');
  const searchInput = document.getElementById('catalogSearch');
  const emptyState = document.getElementById('catalogEmpty');
  if (!chips.length || !cards.length) return;

  let activeFilter = 'todos';

  function applyFilters() {
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let visibleCount = 0;

    cards.forEach((card) => {
      const matchesCategory = activeFilter === 'todos' || card.dataset.category === activeFilter;
      const title = (card.dataset.title || '').toLowerCase();
      const matchesSearch = searchTerm === '' || title.includes(searchTerm);
      const matches = matchesCategory && matchesSearch;

      card.classList.toggle('is-hidden', !matches);
      if (matches) visibleCount += 1;
    });

    // Feedback visual imediato caso nenhum jogo se encaixe nos filtros
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      // Marca visualmente qual chip está ativo no momento
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      activeFilter = chip.dataset.filter;
      applyFilters();
    });
  });

  // Filtra a cada tecla digitada, sem precisar de botão de busca
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
}

/* =====================================================================
   4) VALIDAÇÃO DE FORMULÁRIO EM TEMPO REAL (publicar.html)
   Problema resolvido: o formulário de cadastro de jogos só avisava
   sobre campos inválidos depois do envio (via validação nativa do
   navegador), o que obrigava o desenvolvedor a rolar a página de
   volta ao topo para corrigir erros. Agora cada campo é validado
   enquanto o usuário digita/sai do campo, com mensagens claras, e o
   envio mostra uma confirmação visível sem recarregar a página.
===================================================================== */
function initFormValidation() {
  const form = document.getElementById('developerForm');
  if (!form) return;

  const successBox = document.getElementById('formSuccess');

  const rules = {
    nome: {
      test: (value) => value.trim().length >= 3,
      message: 'Digite seu nome completo (mínimo 3 caracteres).'
    },
    email: {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: 'Digite um e-mail válido, como nome@exemplo.com.'
    },
    jogo: {
      test: (value) => value.trim().length >= 2,
      message: 'Digite o nome do jogo.'
    },
    categoria: {
      test: (value) => value !== '',
      message: 'Selecione uma categoria.'
    },
    descricao: {
      test: (value) => value.trim().length >= 20,
      message: 'Descreva o projeto com pelo menos 20 caracteres.'
    }
  };

  function validateField(field) {
    const rule = rules[field.name];
    if (!rule) return true;

    const group = field.closest('.form-group');
    const errorEl = group.querySelector('.form-error');
    const valid = rule.test(field.value);

    group.classList.toggle('has-error', !valid);
    group.classList.toggle('has-success', valid);
    if (errorEl) errorEl.textContent = valid ? '' : rule.message;

    return valid;
  }

  function validateTermos() {
    const field = form.elements.termos;
    if (!field) return true;

    const group = field.closest('.form-group');
    const errorEl = document.getElementById('erro-termos');
    const valid = field.checked;

    group.classList.toggle('has-error', !valid);
    if (errorEl) {
      errorEl.textContent = valid
        ? ''
        : 'É necessário confirmar a responsabilidade pelas informações.';
    }

    return valid;
  }

  // Validação "ao vivo": cada campo é checado enquanto o usuário digita
  // e também ao sair do campo (blur), cobrindo teclado e mouse/toque.
  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    if (!field) return;
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('blur', () => validateField(field));
  });

  if (form.elements.termos) {
    form.elements.termos.addEventListener('change', validateTermos);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let formValid = true;
    let firstInvalidField = null;

    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      if (!field) return;
      const valid = validateField(field);
      if (!valid) {
        formValid = false;
        if (!firstInvalidField) firstInvalidField = field;
      }
    });

    const termosValid = validateTermos();
    if (!termosValid) {
      formValid = false;
      if (!firstInvalidField) firstInvalidField = form.elements.termos;
    }

    if (!formValid) {
      // Leva o foco direto ao primeiro campo com problema,
      // poupando o desenvolvedor de procurar o erro manualmente.
      firstInvalidField.focus();
      if (successBox) successBox.style.display = 'none';
      return;
    }

    const nomeValue = form.elements.nome.value.trim();
    const jogoValue = form.elements.jogo.value.trim();

    if (successBox) {
      successBox.querySelector('.form-success-text').textContent =
        `${nomeValue}, recebemos o cadastro de "${jogoValue}" com sucesso! ` +
        'Nossa equipe vai analisar as informações em breve.';
      successBox.style.display = 'flex';
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    form.reset();
    form.querySelectorAll('.form-group').forEach((group) => {
      group.classList.remove('has-error', 'has-success');
    });
    form.querySelectorAll('.form-error').forEach((el) => {
      el.textContent = '';
    });
  });
}
