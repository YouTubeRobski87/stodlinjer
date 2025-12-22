// ==========================================================================
// Base URL (set by template, defaults to '' for local dev)
// ==========================================================================
const BASE_URL = window.BASE_URL || '';

// ==========================================================================
// Icon System
// ==========================================================================
// Config loaded from /data/icons.json (single source of truth)
// Aliases and paths are shared with Nunjucks templates

let iconConfig = null;

async function loadIconConfig() {
  if (iconConfig) return iconConfig;
  try {
    const res = await fetch(`${BASE_URL}/data/icons.json`, { cache: 'default' });
    if (!res.ok) throw new Error('Could not load icon config');
    iconConfig = await res.json();
  } catch (err) {
    console.warn('Icon config not loaded, using defaults:', err);
    iconConfig = { paths: { line: '/assets/symbols/st-line.svg', solid: '/assets/symbols/st-solid.svg' }, aliases: {} };
  }
  return iconConfig;
}

function resolveIconSymbol(name) {
  const tokens = (name || '').split(' ');
  const raw = tokens.length ? tokens[tokens.length - 1] : name;
  const cleaned = (raw || '').replace(/^fa-/, '');
  // Use loaded config, fall back to cleaned name if no alias
  const aliases = iconConfig?.aliases || {};
  return aliases[cleaned] || cleaned;
}

function renderIcon(name, variant = 'line', className = '') {
  const symbol = resolveIconSymbol(name);
  const paths = iconConfig?.paths || { line: '/assets/symbols/st-line.svg', solid: '/assets/symbols/st-solid.svg' };
  const linePath = `${BASE_URL}${paths.line}`;
  const solidPath = `${BASE_URL}${paths.solid}`;

  // If explicitly requesting solid, return a single solid icon
  if (variant === 'solid') {
    const cls = ['sts', className].filter(Boolean).join(' ');
    return `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="${solidPath}#symbol-${symbol}"></use></svg>`;
  }

  // Default: return dual-icon structure for hover swap effect
  const wrapperCls = ['icon-duo', className].filter(Boolean).join(' ');
  return `<span class="${wrapperCls}"><svg class="stl icon-line" aria-hidden="true" focusable="false"><use href="${linePath}#symbol-${symbol}"></use></svg><svg class="sts icon-solid" aria-hidden="true" focusable="false"><use href="${solidPath}#symbol-${symbol}"></use></svg></span>`;
}

// ==========================================================================
// Motivational Quotes
// ==========================================================================

async function initQuote() {
  const quoteEl = document.querySelector('#dailyQuote p');
  const authorEl = document.getElementById('quoteAuthor');

  if (!quoteEl || !authorEl) return;

  try {
    const res = await fetch(`${BASE_URL}/data/quotes.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Could not load quotes');
    const quotes = await res.json();

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteEl.textContent = quote.text;
    authorEl.textContent = quote.author ? `— ${quote.author}` : '';
  } catch (err) {
    console.error('Error loading quotes:', err);
    // Hide the quote block if loading fails
    const quoteBlock = document.querySelector('.quote-block');
    if (quoteBlock) quoteBlock.style.display = 'none';
  }
}

const state = {
  lines: [],
  currentCategory: 'all',
  currentTag: 'all',
  searchQuery: '',
  isLoading: true
};

let themeTransitionTimer;

// ==========================================================================
// Loading State
// ==========================================================================

function showLoadingState() {
  const grid = document.getElementById('linesGrid');
  const resultsInfo = document.getElementById('resultsInfo');

  if (resultsInfo) {
    resultsInfo.textContent = 'Laddar stödlinjer...';
  }

  if (grid) {
    // Create skeleton cards
    const skeletonCount = 6;
    grid.innerHTML = Array(skeletonCount)
      .fill(0)
      .map(
        () => `
      <article class="support-card skeleton-card" aria-hidden="true">
        <div class="card-top">
          <div class="card-title">
            <span class="skeleton skeleton-icon"></span>
            <div class="skeleton-text-group">
              <span class="skeleton skeleton-title"></span>
              <span class="skeleton skeleton-meta"></span>
            </div>
          </div>
        </div>
        <span class="skeleton skeleton-number"></span>
        <span class="skeleton skeleton-description"></span>
        <span class="skeleton skeleton-description short"></span>
        <div class="flex gap-2 mt-2">
          <span class="skeleton skeleton-tag"></span>
          <span class="skeleton skeleton-tag"></span>
        </div>
      </article>
    `
      )
      .join('');
  }
}

function hideLoadingState() {
  state.isLoading = false;
}

// ==========================================================================
// Data Loading
// ==========================================================================

async function loadSupportLines() {
  showLoadingState();

  try {
    const res = await fetch(`${BASE_URL}/data/supportData.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Kunde inte ladda data (${res.status})`);
    const data = await res.json();
    state.lines = Array.isArray(data) ? data.filter((line) => line.active !== false) : [];
    hideLoadingState();
    renderLines();
  } catch (err) {
    console.error('Fel vid laddning av supportData.json:', err);
    hideLoadingState();

    const info = document.getElementById('resultsInfo');
    const grid = document.getElementById('linesGrid');
    const noResults = document.getElementById('noResults');

    if (info) info.textContent = '';
    if (grid) {
      grid.innerHTML = `
        <div class="surface-card p-6 md:col-span-2 xl:col-span-3 text-center">
          <p class="text-lg font-extrabold mb-2">${renderIcon(
            'under-construction',
            'line',
            'text-amber-500'
          )} Kunde inte ladda stödlinjer</p>
          <p class="muted text-sm mb-4">Försök ladda om sidan eller kontakta oss om problemet kvarstår.</p>
          <button onclick="location.reload()" class="category-btn is-active">
            ${renderIcon('circle-notch')} Ladda om
          </button>
        </div>
      `;
    }
    if (noResults) noResults.classList.add('hidden');
  }
}

// ==========================================================================
// Filtering
// ==========================================================================

function filterLines() {
  let filtered = state.lines.slice();

  if (state.currentCategory !== 'all') {
    filtered = filtered.filter((line) => line.category === state.currentCategory);
  }

  if (state.currentTag !== 'all') {
    filtered = filtered.filter((line) => line.tags && line.tags.includes(state.currentTag));
  }

  const q = state.searchQuery.trim().toLowerCase();
  if (q) {
    filtered = filtered.filter((line) => {
      const haystackParts = [
        line.title,
        line.description,
        line.phone,
        line.category,
        line.availability?.label,
        ...(Array.isArray(line.tags) ? line.tags : [])
      ];
      return haystackParts.some((value) => value && value.toString().toLowerCase().includes(q));
    });
  }

  return filtered;
}

// ==========================================================================
// Rendering
// ==========================================================================

function renderLines() {
  const grid = document.getElementById('linesGrid');
  const resultsInfo = document.getElementById('resultsInfo');
  const noResults = document.getElementById('noResults');
  const clearTagBtn = document.getElementById('clearTag');
  const totalLines = state.lines.length;

  if (!grid || !resultsInfo || !noResults) return;

  const filtered = filterLines();
  grid.innerHTML = '';

  if (!filtered.length) {
    resultsInfo.textContent = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');
  const tagInfo = state.currentTag !== 'all' ? ` | Tagg: #${state.currentTag}` : '';
  resultsInfo.textContent = `Visar ${filtered.length} av ${totalLines} stödlinjer${tagInfo}.`;

  if (clearTagBtn) {
    clearTagBtn.classList.toggle('hidden', state.currentTag === 'all');
    if (state.currentTag !== 'all') {
      clearTagBtn.textContent = `Rensa #${state.currentTag}`;
    }
  }

  const categoryIcon = (category) => {
    const map = {
      'psykisk-halsa': renderIcon('brain'),
      'barn-unga': renderIcon('family-2'),
      vald: renderIcon('bandage'),
      missbruk: renderIcon('wine-glass-2'),
      anhoriga: renderIcon('group'),
      aldre: renderIcon('old-person-walker'),
      ovrigt: renderIcon('asterisk')
    };
    return map[category] || renderIcon('life-ring-2');
  };

  filtered.forEach((line) => {
    const article = document.createElement('article');
    article.className = 'support-card flex flex-col gap-3 text-slate-900 dark:text-slate-100';
    article.setAttribute('itemscope', '');
    article.setAttribute('itemtype', 'https://schema.org/ContactPoint');

    // Urgent badge - only rendered once, positioned in top-right corner
    const urgentBadge = line.urgent
      ? `<span class="badge-urgent badge-urgent-corner" aria-label="Akut">${renderIcon(
          'bolt'
        )}<span>Akut</span></span>`
      : '';

    const phone = (line.phone || '').toString().trim();
    const telHref = phone ? phone.replace(/[^+\d]/g, '') : '';
    const resourceUrl = line.resource?.url;
    const availabilityLabel = line.availability?.label;

    article.innerHTML = `
      ${urgentBadge}
      <div class="card-top">
        <div class="card-title">
          <span class="card-icon">${categoryIcon(line.category)}</span>
          <div>
            <h3 class="text-lg font-extrabold mb-1" itemprop="name">
              ${
                resourceUrl
                  ? `<a href="${resourceUrl}" target="_blank" rel="noopener noreferrer" class="card-title-link">${line.title}</a>`
                  : line.title
              }
            </h3>
            ${
              availabilityLabel
                ? `<div class="card-meta">${renderIcon(
                    'clock'
                  )}<span itemprop="hoursAvailable">${availabilityLabel}</span></div>`
                : ''
            }
          </div>
        </div>
      </div>

      ${
        phone
          ? `<a href="tel:${telHref}"
             class="card-number"
             itemprop="telephone" aria-label="Ring ${line.title} på ${phone}">
            ${renderIcon('phone')}
            <span class="card-phone-number">${phone}</span>
          </a>`
          : ''
      }

      <p class="muted leading-relaxed" itemprop="description">${line.description}</p>

      <div class="flex-1"></div>
      ${
        line.tags && line.tags.length
          ? `<div class="flex flex-wrap gap-2 mt-2">
            ${line.tags
              .map((tag) => {
                const activeClass = state.currentTag === tag ? ' is-active' : '';
                return `<button class="tag tag-btn${activeClass}" data-tag="${tag}" type="button">#${tag}</button>`;
              })
              .join('')}
           </div>`
          : ''
      }
    `;

    grid.appendChild(article);
  });
}

// ==========================================================================
// Filter Controls
// ==========================================================================

function initFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryButtons = Array.from(document.querySelectorAll('.category-btn'));
  const clearTagBtn = document.getElementById('clearTag');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value || '';
      state.currentTag = 'all';
      renderLines();
    });
  }

  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.currentCategory = button.dataset.category || 'all';
      state.currentTag = 'all';

      categoryButtons.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      });

      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');

      renderLines();
    });
  });

  // Delegated event listener for tag buttons (since they're dynamically created)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tag-btn');
    if (!btn) return;
    e.preventDefault();
    state.currentTag = btn.dataset.tag || 'all';
    state.currentCategory = 'all';
    if (searchInput) {
      searchInput.value = '';
      state.searchQuery = '';
    }
    categoryButtons.forEach((btn) => {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-pressed', 'false');
    });
    renderLines();
  });

  if (clearTagBtn) {
    clearTagBtn.addEventListener('click', () => {
      state.currentTag = 'all';
      if (searchInput) {
        searchInput.value = '';
        state.searchQuery = '';
      }
      categoryButtons.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      });
      renderLines();
    });
  }
}

// ==========================================================================
// Article filtering (Samling)
// ==========================================================================

function initArticleFilters() {
  const grid = document.querySelector('[data-article-grid]');
  const filterButtons = Array.from(document.querySelectorAll('[data-samling-filter]'));
  const paginationEl = document.querySelector('[data-pagination]');
  const searchInput = document.getElementById('articleSearchInput');

  if (!grid || (!filterButtons.length && !searchInput)) return;

  // Shuffle cards on each load so the grid and pagination start in a random order
  const shuffleArray = (items) => {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };

  const shuffledElements = shuffleArray(Array.from(grid.querySelectorAll('[data-samling-item]')));

  const cards = shuffledElements.map((el) => ({
    el,
    samling: el.dataset.samlingItem || 'all',
    title: (el.dataset.title || '').toLowerCase(),
    description: (el.dataset.description || '').toLowerCase()
  }));

  const fragment = document.createDocumentFragment();
  shuffledElements.forEach((el) => fragment.appendChild(el));
  grid.innerHTML = '';
  grid.appendChild(fragment);
  const counter = document.getElementById('articleCount');
  const filterState = {
    filter: 'all',
    query: '',
    page: 1,
    pageSize: parseInt(grid.dataset.pageSize, 10) || 9
  };

  const setFilterButtonState = (value) => {
    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.samlingFilter === value;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const getFilteredCards = () =>
    cards.filter(({ samling, title, description }) => {
      const matchesFilter = filterState.filter === 'all' || samling === filterState.filter;
      if (!filterState.query) return matchesFilter;
      const matchesQuery = title.includes(filterState.query) || description.includes(filterState.query);
      return matchesFilter && matchesQuery;
    });

  const renderPaginationControls = (totalPages) => {
    if (!paginationEl) return;

    if (totalPages <= 1) {
      paginationEl.innerHTML = '';
      return;
    }

    const makeLink = (page, label, disabled, rel) => {
      if (disabled) {
        return `<span class="pagination-link is-disabled">${label}</span>`;
      }
      return `<a class="pagination-link" href="#" data-page="${page}"${
        rel ? ` rel="${rel}"` : ''
      }>${label}</a>`;
    };

    const prev = makeLink(
      filterState.page - 1,
      `${renderIcon('arrow-left')} Föregående`,
      filterState.page === 1,
      'prev'
    );
    const next = makeLink(
      filterState.page + 1,
      `Nästa ${renderIcon('arrow-right')}`,
      filterState.page === totalPages,
      'next'
    );
    const info = `<span class="pagination-info">Sida ${filterState.page} av ${totalPages}</span>`;

    paginationEl.innerHTML = `
      <div class="pagination-prev">${prev}</div>
      <div class="pagination-center">${info}</div>
      <div class="pagination-next">${next}</div>
    `;
  };

  const render = () => {
    const filteredCards = getFilteredCards();
    const totalPages = Math.max(1, Math.ceil(filteredCards.length / filterState.pageSize));

    if (filterState.page > totalPages) {
      filterState.page = totalPages;
    }

    cards.forEach(({ el }) => el.classList.add('hidden'));

    const start = (filterState.page - 1) * filterState.pageSize;
    const visible = filteredCards.slice(start, start + filterState.pageSize);
    visible.forEach(({ el }) => el.classList.remove('hidden'));

    if (counter) {
      const startDisplay = filteredCards.length ? start + 1 : 0;
      const endDisplay = filteredCards.length
        ? Math.min(filteredCards.length, start + visible.length)
        : 0;
      counter.textContent = filteredCards.length
        ? `Visar ${startDisplay}-${endDisplay} av ${filteredCards.length} artiklar`
        : 'Inga artiklar matchar sökningen eller filtret';
    }

    renderPaginationControls(totalPages);
  };

  const initial = filterButtons.find((btn) => btn.classList.contains('is-active'));
  filterState.filter = initial ? initial.dataset.samlingFilter || 'all' : 'all';
  if (searchInput) {
    filterState.query = (searchInput.value || '').trim().toLowerCase();
  }
  setFilterButtonState(filterState.filter);
  render();

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const value = btn.dataset.samlingFilter || 'all';
      filterState.filter = value;
      filterState.page = 1;
      setFilterButtonState(value);
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterState.query = (e.target.value || '').trim().toLowerCase();
      filterState.page = 1;
      render();
    });
  }

  if (paginationEl) {
    paginationEl.addEventListener('click', (e) => {
      const link = e.target.closest('[data-page]');
      if (!link) return;
      e.preventDefault();
      const page = parseInt(link.dataset.page, 10);
      if (Number.isNaN(page) || page === filterState.page) return;
      filterState.page = page;
      render();
    });
  }
}

function applyThemeMode(mode) {
  const themeMode = mode === 'dark' ? 'dark' : 'light';
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  // Smooth transition to reduce flicker
  document.documentElement.classList.add('theme-transition');
  if (themeTransitionTimer) clearTimeout(themeTransitionTimer);
  themeTransitionTimer = setTimeout(() => {
    document.documentElement.classList.remove('theme-transition');
  }, 220);

  document.documentElement.dataset.theme = themeMode;
  document.documentElement.classList.toggle('dark', themeMode === 'dark');

  if (themeToggle) themeToggle.setAttribute('aria-pressed', themeMode === 'dark');
  if (themeIcon) themeIcon.classList.toggle('is-dark', themeMode === 'dark');
  if (themeLabel) themeLabel.textContent = themeMode === 'dark' ? 'Mörkt läge' : 'Ljust läge';

  localStorage.setItem('theme-mode', themeMode);
  syncThemeMeta();
}

function syncThemeMeta() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  if (accent) meta.setAttribute('content', accent);
}

function initThemeControls() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const html = document.documentElement;
  const legacyTheme = localStorage.getItem('theme');
  const storedTheme =
    html.dataset.theme || localStorage.getItem('theme-mode') || (legacyTheme === 'dark' && 'dark');

  const startTheme = storedTheme === 'dark' ? 'dark' : 'light';

  applyThemeMode(startTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
      applyThemeMode(next);
    });
  }
}

// ==========================================================================
// URL Search Support (for schema.org SearchAction)
// ==========================================================================

function initUrlSearch() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('q');

  if (searchQuery) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = searchQuery;
      state.searchQuery = searchQuery;
    }
  }
}

// ==========================================================================
// Initialization
// ==========================================================================

async function init() {
  // Load icon config first (needed for renderIcon)
  await loadIconConfig();
  
  initThemeControls();
  initQuote();
  initArticleFilters();

  const hasListings = document.getElementById('linesGrid');
  if (hasListings) {
    initFilters();
    initUrlSearch();
    loadSupportLines();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
