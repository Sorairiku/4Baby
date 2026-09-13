document.querySelectorAll('.envelope-link').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        link.classList.add('is-opening');

        window.setTimeout(() => {
            window.location.href = link.href;
        }, 520);
    });
});