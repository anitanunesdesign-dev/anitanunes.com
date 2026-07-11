

document.addEventListener('DOMContentLoaded', () => {
    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return;

    const headerSrc = placeholder.getAttribute('data-header-src') || 'header/header.html';
    const linkPrefix = placeholder.getAttribute('data-header-prefix') || '';

    fetch(headerSrc)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Não foi possível carregar o header.');
            }
            return response.text();
        })
        .then((html) => {
            placeholder.innerHTML = html;
            if (typeof initLanguageSwitcher === 'function') {
    initLanguageSwitcher();
}
            if (!linkPrefix) return;

            placeholder.querySelectorAll('a[href]').forEach((link) => {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('#') || href.startsWith('/') || href.startsWith('../')) return;
                if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return;

                link.setAttribute('href', `${linkPrefix}${href}`);
            });
        })
        .catch((error) => {
            console.warn(error);
        });
});
