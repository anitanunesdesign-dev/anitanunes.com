const translations = {
  pt: {
    designEditorialTitle: 'DESIGN EDITORIAL',
    designGraficoTitle: 'DESIGN GRÁFICO',
    fotografiaTitle: 'FOTOGRAFIA',
    siteBrand: 'Anita',
    langPt: 'PT',
    langEn: 'EN',
    viewMore: 'Ver mais',
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
    designEditorialTitle: 'DESIGN EDITORIAL',
    designGraficoTitle: 'GRAPHIC DESIGN',
    fotografiaTitle: 'PHOTOGRAPHY',
    siteBrand: 'Anita',
    langPt: 'PT',
    langEn: 'EN',
    viewMore: 'See more',
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
  } catch (error) {
    console.error('Não foi possível carregar os livros.', error);
  }
}

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
  const savedTheme = localStorage.getItem('site-theme') || 'dark';
  applyLanguage(savedLang);
  applyTheme(savedTheme);
  showRandomHomeBooks();
}

// --- Organize books by date/year and insert meta date if missing ---
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
    const label = document.createElement('div'); label.className='year-label'; label.textContent=year;
    const line = document.createElement('div'); line.className='year-line';
    sep.appendChild(label);
    sep.appendChild(line);
    newGrid.appendChild(sep);

    groups.get(year).forEach(card => newGrid.appendChild(card));
  });

  grid.replaceWith(newGrid);
}

// --- Human verification (CAPTCHA) ---
function isHumanVerified() {
  return document.cookie.split('; ').indexOf('human_verified=1') !== -1;
}

function setHumanVerified() {
  // 1 year
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `human_verified=1; path=/; max-age=${maxAge}`;
  hideHumanModal();
}

function showHumanModal() {
  const modal = document.getElementById('human-check-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  // prevent interaction with page behind modal
  document.documentElement.style.overflow = 'hidden';
}

function hideHumanModal() {
  const modal = document.getElementById('human-check-modal');
  if (!modal) return;
  modal.style.display = 'none';
  document.documentElement.style.overflow = '';
}

// Callback used by Google reCAPTCHA when verification succeeds
window.onHumanVerified = function (token) {
  if (token) {
    setHumanVerified();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();

  // fallback manual button if reCAPTCHA can't load
  const fallback = document.getElementById('human-fallback');
  if (fallback) {
    fallback.addEventListener('click', () => {
      setHumanVerified();
    });
  }

  if (!isHumanVerified()) {
    // show modal to block bots until human verification
    showHumanModal();
  }
  // organize each books grid by year only on pages inside the /livros/ folder
  if (location.pathname.includes('/livros/')) {
    document.querySelectorAll('section.books .books-grid').forEach(grid => organizeGridByYear(grid));
  }
});
