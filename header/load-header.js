

document.addEventListener('DOMContentLoaded', () => {
    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return;

    const headerSrc = placeholder.getAttribute('data-header-src') || 'header/header.html';
    const linkPrefix = placeholder.getAttribute('data-header-prefix') || '';

    const headerDir = headerSrc.includes('/')
        ? headerSrc.slice(0, headerSrc.lastIndexOf('/') + 1)
        : '';
    const headerCssHref = `${headerDir}header.css`;

    if (!document.querySelector('link[data-header-stylesheet]')) {
        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = headerCssHref;
        stylesheet.setAttribute('data-header-stylesheet', 'true');
        document.head.appendChild(stylesheet);
    }

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

            const currentPath = window.location.pathname.replace(/\/$/, '');
            const normalizedPath = currentPath === '' ? '/index.html' : currentPath;

            placeholder.querySelectorAll('.nav-link').forEach((link) => {
                const href = link.getAttribute('href') || '';
                const normalizedHref = href.startsWith('/') ? href : `/${href}`;
                const isCurrent = normalizedHref === normalizedPath || normalizedHref === `${normalizedPath}/`;

                link.classList.toggle('nav-link--highlight', isCurrent);
            });

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
