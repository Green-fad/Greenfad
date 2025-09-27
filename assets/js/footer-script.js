/*
 * Met à jour automatiquement l'année du copyright dans le footer.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Trouve l'élément par son ID
    const yearSpan = document.getElementById('copyright-year');
    
    // S'assure que l'élément existe avant de continuer
    if (yearSpan) {
        // Remplace le contenu par l'année actuelle
        yearSpan.textContent = new Date().getFullYear();
    }
});