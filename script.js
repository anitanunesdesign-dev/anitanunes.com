const translations = {
  pt: {
    sectionTitle: 'LIVROS',
    siteBrand: 'Anita',
    langPt: 'PT',
    langEn: 'EN',
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
    sectionTitle: 'BOOKS',
    siteBrand: 'Anita',
    langPt: 'PT',
    langEn: 'EN',
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
}

document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
