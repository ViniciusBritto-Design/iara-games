/*
  Iara Games — script.js
*/

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initGameModal();
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
   2) MODAL "VER MAIS / VER DETALHES"
   Problema resolvido: antes, para saber mais sobre um jogo o usuário
   precisava sair da página (ou nem havia essa opção no catálogo).
   Agora um clique no botão abre uma janela modal com mais detalhes,
   sem tirar o usuário do contexto em que ele estava navegando.
===================================================================== */
function initGameModal() {
  const overlay = document.getElementById('gameModal');
  if (!overlay) return;

  const closeBtn = overlay.querySelector('.modal-close');
  const modalThumb = overlay.querySelector('.modal-thumb');
  const modalPill = overlay.querySelector('.modal-pill');
  const modalTitle = overlay.querySelector('.modal-title');
  const modalDesc = overlay.querySelector('.modal-desc');
  const triggers = document.querySelectorAll('[data-modal-trigger]');

  let lastFocusedElement = null;

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-category]');
      if (!card) return;

      // Lê as informações do próprio card clicado (data-attributes)
      // e usa esses dados para preencher o conteúdo da modal.
      // Se o card tiver imagem de capa, a modal reaproveita a mesma imagem;
      // caso contrário, volta para o fundo colorido definido em data-thumb.
      const cardImage = card.querySelector('.game-thumb img, .catalog-thumb img');
      modalThumb.innerHTML = '';

      if (cardImage) {
        const modalImage = document.createElement('img');
        modalImage.src = cardImage.getAttribute('src');
        modalImage.alt = cardImage.getAttribute('alt') || '';
        modalThumb.className = 'modal-thumb';
        modalThumb.appendChild(modalImage);
      } else {
        modalThumb.className = 'modal-thumb ' + (card.dataset.thumb || '');
      }

      modalPill.textContent = card.dataset.pill || '';
      modalTitle.textContent = card.dataset.title || '';
      modalDesc.textContent = card.dataset.desc || '';

      lastFocusedElement = btn;
      overlay.classList.add('modal-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    });
  });

  function closeModal() {
    overlay.classList.remove('modal-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  closeBtn.addEventListener('click', closeModal);

  // Fecha ao clicar fora da caixa (na área escurecida)
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });

  // Fecha com a tecla Esc, para quem navega pelo teclado
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('modal-open')) {
      closeModal();
    }
  });
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
