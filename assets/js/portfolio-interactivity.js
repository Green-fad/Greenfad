document.addEventListener('DOMContentLoaded', () => {
    // --- SÉLECTION DES ÉLÉMENTS DU DOM ---
    const navItems = document.querySelectorAll('.portfolio-nav-item');
    const projects = document.querySelectorAll('.portfolio-project-content');
    const progressBar = document.querySelector('.portfolio-progress-bar');
    const portfolioContainer = document.querySelector('.portfolio-redesign-container');

    // --- CONFIGURATION ---
    const TEMPS_ROTATION = 5000; // 5 secondes par projet
    let indexActuel = 0;
    let minuteurProjet; // Gère la logique de rotation

    /**
     * Classe pour un minuteur précis qui peut être mis en pause et repris.
     * @param {function} callback - La fonction à appeler à la fin du délai.
     * @param {number} delay - Le délai total en millisecondes.
     */
    function Minuteur(callback, delay) {
        let idMinuteur, debut, tempsRestant = delay;

        // Met le minuteur en pause
        this.pause = function() {
            window.clearTimeout(idMinuteur);
            tempsRestant -= Date.now() - debut; // Calcule le temps restant
            // Met à jour la barre de progression visuellement
            const progres = (1 - tempsRestant / TEMPS_ROTATION) * 100;
            progressBar.style.transition = 'none'; // Stoppe l'animation en cours
            progressBar.style.width = `${progres}%`;
        };

        // Reprend le minuteur
        this.resume = function() {
            debut = Date.now(); // Réinitialise le point de départ
            window.clearTimeout(idMinuteur);
            idMinuteur = window.setTimeout(callback, tempsRestant);
            // Redémarre l'animation de la barre de progression pour le temps restant
            progressBar.style.transition = `width ${tempsRestant / 1000}s linear`;
            progressBar.style.width = '100%';
        };
        
        // Annule complètement le minuteur
        this.cancel = function() {
             window.clearTimeout(idMinuteur);
        }
        
        // Démarre un nouveau cycle complet du minuteur
        this.start = function() {
            tempsRestant = delay;
            debut = Date.now();
            window.clearTimeout(idMinuteur);
            idMinuteur = window.setTimeout(callback, tempsRestant);
            
            // Réinitialise la barre de progression et démarre l'animation
            progressBar.style.transition = 'none'; // Pas d'animation pour la réinitialisation
            progressBar.style.width = '0%';
            // Un petit délai pour s'assurer que le navigateur applique la réinitialisation avant de démarrer la nouvelle animation
            setTimeout(() => {
                progressBar.style.transition = `width ${delay / 1000}s linear`;
                progressBar.style.width = '100%';
            }, 50);
        };
    }

    // --- FONCTIONS PRINCIPALES ---
    
    // Passe au projet suivant dans la liste
    function afficherProjetSuivant() {
        indexActuel = (indexActuel + 1) % projects.length;
        afficherProjet(indexActuel);
    }

    // Affiche un projet spécifique par son index
    function afficherProjet(index) {
        // Annule le minuteur précédent s'il existe
        if (minuteurProjet) minuteurProjet.cancel();
        
        indexActuel = index;

        // Met à jour les classes 'active' pour les boutons et le contenu du projet
        navItems.forEach(nav => nav.classList.remove('active'));
        projects.forEach(proj => proj.classList.remove('active'));
        navItems[index].classList.add('active');
        projects[index].classList.add('active');

        // Crée et démarre un nouveau minuteur pour la rotation automatique
        minuteurProjet = new Minuteur(afficherProjetSuivant, TEMPS_ROTATION);
        minuteurProjet.start();
    }

    // --- GESTIONNAIRES D'ÉVÉNEMENTS ---
    
    // Clic sur les boutons de navigation
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // N'agit que si un projet différent est sélectionné
            if (index !== indexActuel) {
                afficherProjet(index);
            }
        });
    });

    // Vérifie si le conteneur principal a bien été trouvé
    if (portfolioContainer) {
        // La souris entre dans la zone du portfolio -> Pause
        portfolioContainer.addEventListener('mouseenter', () => {
            if (minuteurProjet) minuteurProjet.pause();
        });

        // La souris quitte la zone du portfolio -> Reprise
        portfolioContainer.addEventListener('mouseleave', () => {
            if (minuteurProjet) minuteurProjet.resume();
        });
    }

    // --- INITIALISATION ---
    afficherProjet(0); // Affiche le premier projet au chargement de la page
});