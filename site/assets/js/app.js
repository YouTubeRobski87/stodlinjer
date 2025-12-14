// ==========================================================================
// Base URL (set by template, defaults to '' for local dev)
// ==========================================================================
const BASE_URL = window.BASE_URL || '';

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
    const res = await fetch(`${BASE_URL}/data/support-lines.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Kunde inte ladda data (${res.status})`);
    state.lines = await res.json();
    hideLoadingState();
    renderLines();
  } catch (err) {
    console.error('Fel vid laddning av support-lines.json:', err);
    hideLoadingState();

    const info = document.getElementById('resultsInfo');
    const grid = document.getElementById('linesGrid');
    const noResults = document.getElementById('noResults');

    if (info) info.textContent = '';
    if (grid) {
      grid.innerHTML = `
        <div class="surface-card p-6 md:col-span-2 xl:col-span-3 text-center">
          <p class="text-lg font-bold mb-2"><i class="fas fas-triangle-exclamation text-amber-500"></i> Kunde inte ladda stödlinjer</p>
          <p class="muted text-sm mb-4">Försök ladda om sidan eller kontakta oss om problemet kvarstår.</p>
          <button onclick="location.reload()" class="category-btn is-active">
            <i class="fas fas-rotate-right"></i> Ladda om
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
    filtered = filtered.filter(
      (line) =>
        (line.name && line.name.toLowerCase().includes(q)) ||
        (line.description && line.description.toLowerCase().includes(q)) ||
        (line.number && line.number.toLowerCase().includes(q)) ||
        (line.tags && line.tags.some((tag) => tag.toLowerCase().includes(q)))
    );
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
      psykiskhalsa: '<i class="fas fas-brain"></i>',
      'barn-unga': '<i class="fas fas-children"></i>',
      vald: '<i class="fas fas-shield-halved"></i>',
      missbruk: '<i class="fas fas-wine-bottle"></i>',
      anhöriga: '<i class="fas fas-people-roof"></i>',
      aldre: '<i class="fas fas-person-cane"></i>'
    };
    return map[category] || '<i class="fas fas-life-ring"></i>';
  };

  filtered.forEach((line) => {
    const article = document.createElement('article');
    article.className = 'support-card flex flex-col gap-3 text-slate-900 dark:text-slate-100';
    article.setAttribute('itemscope', '');
    article.setAttribute('itemtype', 'https://schema.org/ContactPoint');

    // Urgent badge - only rendered once, positioned in top-right corner
    const urgentBadge = line.urgent
      ? '<span class="badge-urgent badge-urgent-corner" aria-label="Akut"><i class="fas fas-bolt"></i><span>Akut</span></span>'
      : '';

    const telHref = (line.number || '').toString().replace(/[^+\d]/g, '');

    article.innerHTML = `
      ${urgentBadge}
      <div class="card-top">
        <div class="card-title">
          <span class="card-icon">${categoryIcon(line.category)}</span>
          <div>
            <h3 class="text-lg font-bold mb-1" itemprop="name">
              ${
                line.url
                  ? `<a href="${line.url}" target="_blank" rel="noopener noreferrer" class="card-title-link">${line.name}</a>`
                  : line.name
              }
            </h3>
            <div class="card-meta"><i class="far far-clock"></i><span itemprop="hoursAvailable">${
              line.available
            }</span></div>
          </div>
        </div>
      </div>

      ${
        line.number
          ? `<a href="tel:${telHref}"
             class="card-number"
             itemprop="telephone" aria-label="Ring ${line.name} på ${line.number}">
            <i class="fas fas-phone"></i>
            <span>${line.number}</span>
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

  if (!grid || !filterButtons.length) return;

  const cards = Array.from(grid.querySelectorAll('[data-samling-item]'));
  const counter = document.getElementById('articleCount');
  const state = {
    filter: 'all',
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
    cards.filter(
      (card) => state.filter === 'all' || card.dataset.samlingItem === state.filter
    );

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
      return `<a class="pagination-link" href="#" data-page="${page}"${rel ? ` rel="${rel}"` : ''}>${label}</a>`;
    };

    const prev = makeLink(
      state.page - 1,
      '<i class="fas fas-arrow-left" aria-hidden="true"></i> Föregående',
      state.page === 1,
      'prev'
    );
    const next = makeLink(
      state.page + 1,
      `Nästa <i class="fas fas-arrow-right" aria-hidden="true"></i>`,
      state.page === totalPages,
      'next'
    );
    const info = `<span class="pagination-info">Sida ${state.page} av ${totalPages}</span>`;

    paginationEl.innerHTML = `
      <div class="pagination-prev">${prev}</div>
      <div class="pagination-center">${info}</div>
      <div class="pagination-next">${next}</div>
    `;
  };

  const render = () => {
    const filteredCards = getFilteredCards();
    const totalPages = Math.max(1, Math.ceil(filteredCards.length / state.pageSize));

    if (state.page > totalPages) {
      state.page = totalPages;
    }

    cards.forEach((card) => card.classList.add('hidden'));

    const start = (state.page - 1) * state.pageSize;
    const visible = filteredCards.slice(start, start + state.pageSize);
    visible.forEach((card) => card.classList.remove('hidden'));

    if (counter) {
      const startDisplay = filteredCards.length ? start + 1 : 0;
      const endDisplay = filteredCards.length
        ? Math.min(filteredCards.length, start + visible.length)
        : 0;
      counter.textContent = filteredCards.length
        ? `Visar ${startDisplay}-${endDisplay} av ${filteredCards.length} artiklar`
        : 'Inga artiklar matchar filtret';
    }

    renderPaginationControls(totalPages);
  };

  const initial = filterButtons.find((btn) => btn.classList.contains('is-active'));
  state.filter = initial ? initial.dataset.samlingFilter || 'all' : 'all';
  setFilterButtonState(state.filter);
  render();

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const value = btn.dataset.samlingFilter || 'all';
      state.filter = value;
      state.page = 1;
      setFilterButtonState(value);
      render();
    });
  });

  if (paginationEl) {
    paginationEl.addEventListener('click', (e) => {
      const link = e.target.closest('[data-page]');
      if (!link) return;
      e.preventDefault();
      const page = parseInt(link.dataset.page, 10);
      if (Number.isNaN(page) || page === state.page) return;
      state.page = page;
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

function init() {
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
