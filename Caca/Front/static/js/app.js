document.addEventListener('DOMContentLoaded', function() {
    // Gestion de la navigation
    function navigate(event) {
        event.preventDefault();
        const url = event.target.getAttribute('href');
        history.pushState(null, null, url);
        loadPage(url);
    }

    function loadPage(url) {
        // Logique pour charger la page via AJAX
        fetch(url)
            .then(response => response.text())
            .then(html => {
                document.getElementById('app').innerHTML = html;
            });
    }

    // Gestion des liens
    document.querySelectorAll('a.nav-link').forEach(link => {
        link.addEventListener('click', navigate);
    });

    // Charger la page initiale
    loadPage(window.location.pathname);
});