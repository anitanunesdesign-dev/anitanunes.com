document.addEventListener('DOMContentLoaded', () => {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    const footerSrc = placeholder.getAttribute('data-footer-src') || 'footer/footer.html';
    const linkPrefix = placeholder.getAttribute('data-footer-prefix') || '';

    fetch(footerSrc)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Não foi possível carregar o footer.');
            }
            return response.text();
        })
        .then((html) => {
            placeholder.innerHTML = html;
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
