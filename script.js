const translations = {
  pt: {
    'Anita Nunes': 'Anita Nunes',
    'LIVROS': 'LIVROS',
    'Seletor de idioma': 'Seletor de idioma',
    'PT': 'PT',
    'EN': 'EN',
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
    'Anita Nunes': 'Anita Nunes',
    'LIVROS': 'BOOKS',
    'Seletor de idioma': 'Language selector',
    'PT': 'PT',
    'EN': 'EN',
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

const root = document.querySelector('[data-i18n-root]') || document.body;
const buttons = document.querySelectorAll('.lang-btn');
const textElements = root.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, span, li');
const imageElements = root.querySelectorAll('img');

function applyLanguage(lang) {
  const dict = translations[lang] || translations.pt;

  textElements.forEach((el) => {
    const currentText = el.textContent?.trim();
    if (!currentText) return;

    if (el.classList.contains('lang-btn')) {
      if (dict[currentText]) {
        el.textContent = dict[currentText];
      }
      return;
    }

    if (dict[currentText]) {
      el.textContent = dict[currentText];
    }
  });

  imageElements.forEach((img) => {
    const currentAlt = img.getAttribute('alt');
    if (currentAlt && dict[currentAlt]) {
      img.setAttribute('alt', dict[currentAlt]);
    }
  });

  root.querySelectorAll('[aria-label]').forEach((el) => {
    const currentLabel = el.getAttribute('aria-label');
    if (currentLabel && dict[currentLabel]) {
      el.setAttribute('aria-label', dict[currentLabel]);
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

buttons.forEach((btn) => {
  btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')));
});

const savedLang = localStorage.getItem('site-language') || 'pt';
applyLanguage(savedLang);
