document.addEventListener('DOMContentLoaded', () => {
    /*
     * Ce script utilise l'Intersection Observer API pour animer les sections
     * du portfolio lorsqu'elles deviennent visibles à l'écran.
     */

    // Sélectionne tous les conteneurs de contenu de projet.
    const projectContents = document.querySelectorAll('.project-content');

    // Configure l'observateur.
    // L'animation se déclenchera quand 40% de l'élément sera visible.
    const options = {
        root: null, // Observe par rapport à la fenêtre du navigateur
        threshold: 0.4,
        rootMargin: '0px'
    };

    // Crée l'observateur.
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si l'élément est maintenant visible à l'écran...
            if (entry.isIntersecting) {
                // ...on ajoute la classe 'visible' pour déclencher l'animation CSS.
                entry.target.classList.add('visible');
            }
        });
    }, options);

    // Demande à l'observateur de surveiller chaque conteneur de contenu.
    projectContents.forEach(content => {
        observer.observe(content);
    });
});