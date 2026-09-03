// PT/EN dictionary used to translate text and alt attributes across pages
const translations = {
  pt: {
    // designEditorialTitle: 'DESIGN<br>EDITORIAL',
    // designGraficoTitle: 'DESIGN <br>GRÁFICO',
    // fotografiaTitle: 'FOTOGRAFIA',

    'Imagem do livro Mundo de Sonhos e Fantasia': 'Imagem do livro Mundo de Sonhos e Fantasia',
    'Imagem do livro A Tosquia': 'Imagem do livro A Tosquia',
    'Imagem do livro Memórias e Tradições de Monsanto': 'Imagem do livro Memórias e Tradições de Monsanto',
    'Imagem do livro Caminhos de Excelência': 'Imagem do livro Caminhos de Excelência',
    'Imagem do livro Veredas da Vida': 'Imagem do livro Veredas da Vida',
    'Imagem do livro Para que Conste': 'Imagem do livro Para que Conste',
    'Imagem do livro Pedaços de Mim': 'Imagem do livro Pedaços de Mim',
    'Imagem do livro O Sapo': 'Imagem do livro O Sapo',
    'Imagem do livro Quando um Filho Parte': 'Imagem do livro Quando um Filho Parte',
    'Imagem do livro Chat GPT': 'Imagem do livro Chat GPT',
    'Imagem do livro O Mundo Mágico da Inteligência': 'Imagem do livro O Mundo Mágico da Inteligência',
    'Imagem do livro Inteligência Artificial': 'Imagem do livro Inteligência Artificial'
  
  },

  en: {
    // designEditorialTitle: 'EDITORIAL DESIGN',
    // designGraficoTitle: 'GRAPHIC DESIGN',
    // fotografiaTitle: 'PHOTOGRAPHY',
 
    'Imagem do livro Mundo de Sonhos e Fantasia': 'Image of the book World of Dreams and Fantasy',
    'Imagem do livro A Tosquia': 'Image of the book The Shave',
    'Imagem do livro Memórias e Tradições de Monsanto': 'Image of the book Memories and Traditions of Monsanto',
    'Imagem do livro Caminhos de Excelência': 'Image of the book Paths of Excellence',
    'Imagem do livro Veredas da Vida': 'Image of the book Roads of Life',
    'Imagem do livro Para que Conste': 'Image of the book For the Record',
    'Imagem do livro Pedaços de Mim': 'Image of the book Pieces of Me',
    'Imagem do livro O Sapo': 'Image of the book The Toad',
    'Imagem do livro Quando um Filho Parte': 'Image of the book When a Child Leaves',
    'Imagem do livro Chat GPT': 'Image of the book Chat GPT',
    'Imagem do livro O Mundo Mágico da Inteligência': 'Image of the book The Magic World of Intelligence',
    'Imagem do livro Inteligência Artificial': 'Image of the book Artificial Intelligence'
  }
};

// Swaps visible text, image alt text and aria-labels to the chosen language
function applyLanguage(lang) {
  const root = document.querySelector('[data-i18n-root]') || document.body;
  const dict = translations[lang] || translations.pt;
  const textElements = root.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, span, li');
  const imageElements = root.querySelectorAll('img');
  const buttons = document.querySelectorAll('.lang-btn');

  textElements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const translated = dict[key];
      if (translated) {
        el.textContent = translated;
      }
      return;
    }

    const currentText = el.textContent?.trim();
    if (!currentText) return;
    if (dict[currentText]) {
      el.textContent = dict[currentText];
    }
  });

  imageElements.forEach((img) => {
    const altKey = img.getAttribute('data-i18n-alt');
    if (altKey) {
      const translated = dict[altKey];
      if (translated) {
        img.setAttribute('alt', translated);
      }
      return;
    }

    const currentAlt = img.getAttribute('alt');
    if (currentAlt && dict[currentAlt]) {
      img.setAttribute('alt', dict[currentAlt]);
    }
  });

  root.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (!key) return;
    const translated = dict[key];
    if (translated) {
      el.setAttribute('aria-label', translated);
    }
  });

  buttons.forEach((btn) => {
    const isActive = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });

  document.documentElement.lang = lang === 'en' ? 'en' : 'pt';
  localStorage.setItem('site-language', lang);
}

// Toggles light/dark theme class on <body> and highlights the active theme button
function applyTheme(theme) {
  const body = document.body;
  const themeButtons = document.querySelectorAll('.theme-btn');
  const isLight = theme === 'light';

  body.classList.toggle('light-theme', isLight);
  themeButtons.forEach((btn) => {
    const isActive = btn.getAttribute('data-theme') === theme;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
  localStorage.setItem('site-theme', theme);
}

// Fetches livros.html and fills the home page grid with 6 random book cards
async function showRandomHomeBooks() {
  const editorialSection = document.querySelector('.home-editorial-section');
  if (!editorialSection) return;

  const grid = editorialSection.querySelector('.books-grid[data-random-books-source]');
  if (!grid) return;

  const sourceUrl = grid.getAttribute('data-random-books-source');
  if (!sourceUrl) return;

  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) return;

    const sourceHtml = await response.text();
    const sourceDocument = new DOMParser().parseFromString(sourceHtml, 'text/html');
    const cards = Array.from(sourceDocument.querySelectorAll('.books-grid .book-card'));
    if (!cards.length) return;

    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    const selectedCards = shuffledCards.slice(0, 6).map((card) => document.importNode(card, true));

    grid.replaceChildren(...selectedCards);

    const savedLang = localStorage.getItem('site-language') || 'pt';
    applyLanguage(savedLang);
    initEmindBadges(grid);
    disableBookCardLinks(grid);
  } catch (error) {
    console.error('Não foi possível carregar os livros.', error);
  }
}

// Book cards no longer link anywhere; block clicks so tapping/pressing the anchor does nothing
function disableBookCardLinks(root = document) {
  root.querySelectorAll('.book-card').forEach((card) => {
    if (card.dataset.clickDisabled) return;
    card.dataset.clickDisabled = 'true';
    card.addEventListener('click', (event) => event.preventDefault());
  });
}

// Adds a small clickable EMIND logo (links to the EMIND shop) to cards marked data-emind="true"
function initEmindBadges(root = document) {
  root.querySelectorAll('.book-card[data-emind="true"]').forEach((card) => {
    if (card.querySelector('.emind-badge-wrap')) return;
    const wrap = document.createElement('span');
    wrap.className = 'emind-badge-wrap';
    wrap.setAttribute('data-tooltip', 'Comprar livro ↓');

    const badge = document.createElement('img');
    badge.className = 'emind-badge';
    badge.src = '/livros/Emind.svg';
    badge.alt = 'EMIND';
    wrap.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.open('https://emind.pt/shop', '_blank', 'noopener');
    });

    wrap.appendChild(badge);
    card.appendChild(wrap);
  });
}

// Home page: lets visitors cycle the editorial books grid through 2-5 columns, remembered via localStorage
function initHomeBooksColumnsToggle() {
  const editorialSection = document.querySelector('.home-editorial-section');
  if (!editorialSection) return;

  const grid = editorialSection.querySelector('.books-grid[data-random-books-source]');
  const toggleButton = editorialSection.querySelector('.columns-toggle');
  if (!grid || !toggleButton) return;

  const columnValues = [2, 3, 4, 5];
  const columnScales = {
    2: 1,
    3: 0.9,
    4: 0.81,
    5: 0.73,
  };
  const savedColumns = Number(localStorage.getItem('home-books-columns'));
  const initialColumns = columnValues.includes(savedColumns) ? savedColumns : 2;

  const applyColumns = (columns) => {
    grid.style.setProperty('--home-columns', String(columns));
    grid.style.setProperty('--home-card-scale', String(columnScales[columns] || 1));
    const nextColumns = columnValues[(columnValues.indexOf(columns) + 1) % columnValues.length];
    toggleButton.setAttribute('aria-label', `Alternar grelha para ${nextColumns} colunas`);
    toggleButton.dataset.columns = String(columns);
    localStorage.setItem('home-books-columns', String(columns));
  };

  applyColumns(initialColumns);

  toggleButton.addEventListener('click', () => {
    const currentColumns = Number(grid.style.getPropertyValue('--home-columns')) || initialColumns;
    const nextColumns = columnValues[(columnValues.indexOf(currentColumns) + 1) % columnValues.length];
    applyColumns(nextColumns);
  });
}

// Livros page: same column-count toggle as the home page, but for the full books list
function initLivrosBooksColumnsToggle() {
  const booksSection = document.querySelector('body.books-page section.books');
  if (!booksSection) return;

  const toggleButton = booksSection.querySelector('.columns-toggle');
  if (!toggleButton) return;

  const columnValues = [2, 3, 4, 5];
  const columnScales = {
    2: 1,
    3: 0.9,
    4: 0.81,
    5: 0.73,
  };
  const savedColumns = Number(localStorage.getItem('livros-books-columns'));
  const initialColumns = columnValues.includes(savedColumns) ? savedColumns : 2;

  // Grid is queried on every call because it may be replaced (e.g. by organizeGridByYear).
  const getGrid = () => booksSection.querySelector('.books-grid');

  const applyColumns = (columns) => {
    const grid = getGrid();
    if (!grid) return;
    grid.style.setProperty('--books-columns', String(columns));
    grid.style.setProperty('--books-card-scale', String(columnScales[columns] || 1));
    const nextColumns = columnValues[(columnValues.indexOf(columns) + 1) % columnValues.length];
    toggleButton.setAttribute('aria-label', `Alternar grelha para ${nextColumns} colunas`);
    toggleButton.dataset.columns = String(columns);
    localStorage.setItem('livros-books-columns', String(columns));
  };

  applyColumns(initialColumns);

  toggleButton.addEventListener('click', () => {
    const currentColumns = Number(toggleButton.dataset.columns) || initialColumns;
    const nextColumns = columnValues[(columnValues.indexOf(currentColumns) + 1) % columnValues.length];
    applyColumns(nextColumns);
  });
}

// Wires up the language/theme buttons and kicks off the initial language, theme and home books
function initLanguageSwitcher() {
  const root = document.querySelector('[data-i18n-root]') || document.body;
  const buttons = root.querySelectorAll('.lang-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang) {
        applyLanguage(lang);
      }
    });
  });

  const themeButtons = document.querySelectorAll('.theme-btn');
  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      if (theme) {
        applyTheme(theme);
      }
    });
  });

  const savedLang = localStorage.getItem('site-language') || 'pt';
  applyLanguage(savedLang);
  applyTheme('light');
  showRandomHomeBooks();
}

// --- Organize books by date/year and insert meta date if missing ---
// Parses "dd.mm.yyyy" strings or ISO dates into a Date, falling back to a default
function parseDateString(str) {
  if (!str) return new Date('2026-07-08');
  str = str.trim();
  const m = str.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (m) {
    return new Date(`${m[3]}-${m[2]}-${m[1]}`);
  }
  const iso = new Date(str);
  if (!isNaN(iso)) return iso;
  return new Date('2026-07-08');
}

// Página dos projetos: coloca as secções .design-showcase por ordem do data-date, da mais recente para a mais antiga
function sortDesignShowcaseByDate() {
  const page = document.querySelector('.design-grafico-page');
  if (!page) return;

  const sections = Array.from(page.querySelectorAll(':scope > section.design-showcase'));
  if (sections.length < 2) return;

  sections
    .sort((a, b) => parseDateString(b.dataset.date) - parseDateString(a.dataset.date))
    .forEach((section) => page.appendChild(section));
}

// Livros page: sorts all book cards newest-first and groups them under year-section headers
function organizeGridByYear(grid) {
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.book-card'));
  if (!cards.length) return;

  // ensure each card has a date source: prefer existing data-date attribute, else read .book-date, else set default
  cards.forEach((card) => {
    const existing = card.querySelector('.book-date');

    if (card.dataset.date && card.dataset.date.trim()) {
      // if visible badge is missing, create one from data-date for editing/visibility
      if (!existing) {
        const iso = card.dataset.date.trim();
        const d = new Date(iso);
        let display = '08.07.2026';
        if (!isNaN(d)) {
          const dd = String(d.getDate()).padStart(2,'0');
          const mm = String(d.getMonth()+1).padStart(2,'0');
          const yyyy = d.getFullYear();
          display = `${dd}.${mm}.${yyyy}`;
        }
        const meta = document.createElement('div');
        meta.className = 'book-meta';
        const span = document.createElement('span');
        span.className = 'book-date';
        span.textContent = display;
        meta.appendChild(span);
        card.appendChild(meta);
      }
    } else if (existing) {
      const txt = existing.textContent.trim();
      const m = txt.match(/(\d{2})\.(\d{2})\.(\d{4})/);
      if (m) {
        card.dataset.date = `${m[3]}-${m[2]}-${m[1]}`;
      } else {
        const d = new Date(txt);
        if (!isNaN(d)) card.dataset.date = d.toISOString().slice(0,10);
        else card.dataset.date = '2026-07-08';
      }
    } else {
      // no source present: set default but do not force visible badge (so you can add later)
      card.dataset.date = '2026-07-08';
      const meta = document.createElement('div');
      meta.className = 'book-meta';
      const span = document.createElement('span');
      span.className = 'book-date';
      span.textContent = '08.07.2026';
      meta.appendChild(span);
      card.appendChild(meta);
    }
  });

  // sort descending by date
  cards.sort((a,b) => {
    const da = parseDateString(a.dataset.date);
    const db = parseDateString(b.dataset.date);
    return db - da;
  });

  // group by year
  const groups = new Map();
  cards.forEach(c => {
    const year = parseDateString(c.dataset.date).getFullYear();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(c);
  });

  // create new container
  const newGrid = document.createElement('div');
  newGrid.className = grid.className + ' grouped-books';

  Array.from(groups.keys()).sort((a,b)=>b-a).forEach(year => {
    const sep = document.createElement('div');
    sep.className = 'year-section';
    sep.dataset.year = String(year);
    const label = document.createElement('div'); label.className='year-label'; label.textContent=year;
    const line = document.createElement('div'); line.className='year-line';
    sep.appendChild(label);
    sep.appendChild(line);
    newGrid.appendChild(sep);

    groups.get(year).forEach(card => newGrid.appendChild(card));
  });

  grid.replaceWith(newGrid);
}

// Livros page: floating year label (inside the toolbar) that updates as you scroll past each year group
function initLivrosYearStickyIndicator() {
  const booksSection = document.querySelector('body.books-page section.books');
  if (!booksSection) return;

  const yearSections = Array.from(booksSection.querySelectorAll('.year-section'));
  if (!yearSections.length) return;

  let indicator = booksSection.querySelector('.year-sticky-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'year-sticky-indicator';
    const toolbar = booksSection.querySelector('.books-toolbar');
    if (toolbar) {
      // Shares the toolbar's sticky row so both sit at the same height.
      toolbar.prepend(indicator);
    } else {
      booksSection.querySelector('.container')?.prepend(indicator);
    }
  }

  // Reflects the year of whichever books are currently scrolled past the indicator.
  const updateIndicator = () => {
    const referenceLine = indicator.getBoundingClientRect().bottom;
    let currentYear = yearSections[0].dataset.year;

    yearSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= referenceLine) {
        currentYear = section.dataset.year;
      }
    });

    indicator.textContent = currentYear;
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateIndicator();
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateIndicator();
}

// Página dos projetos: o zoom da imagem ao passar o rato segue a posição do cursor, em vez de ficar sempre no centro
function initDesignImageZoom() {
  document.querySelectorAll('.module--image').forEach((moduleEl) => {
    const img = moduleEl.querySelector('img');
    if (!img) return;

    moduleEl.addEventListener('mousemove', (event) => {
      const rect = moduleEl.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
    });

    moduleEl.addEventListener('mouseleave', () => {
      img.style.transformOrigin = '50% 50%';
    });
  });
}

// Entry point: run all page setup once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initHomeBooksColumnsToggle();

  // organize each books grid by year only on pages inside the /livros/ folder
  if (location.pathname.includes('/livros/')) {
    document.querySelectorAll('section.books .books-grid').forEach(grid => organizeGridByYear(grid));
    initLivrosYearStickyIndicator();
  }

  initEmindBadges();
  disableBookCardLinks();
  initLivrosBooksColumnsToggle();
  sortDesignShowcaseByDate();
  initDesignImageZoom();
});
