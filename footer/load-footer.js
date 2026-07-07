document.addEventListener('DOMContentLoaded', () => {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    fetch('footer/footer.html')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Não foi possível carregar o footer.');
            }
            return response.text();
        })
        .then((html) => {
            placeholder.innerHTML = html;
        })
        .catch((error) => {
            console.warn(error);
        });
});
