/**
 * Gestionnaire d'accessibilité
 * Améliore l'expérience utilisateur pour tous les utilisateurs
 */

class AccessibilityManager {
    constructor() {
        this.preferences = {
            highContrast: false,
            reducedMotion: false,
            largeText: false,
            keyboardNavigation: false
        };
        
        this.focusHistory = [];
        this.announcer = null;
        
        this.init();
    }

    init() {
        // Ajouter le skip link
        this.addSkipLink();
        
        // Détecter la navigation clavier
        this.setupKeyboardNavigation();
        
        // Créer l'annonceur pour les lecteurs d'écran
        this.createScreenReaderAnnouncer();
        
        // Améliorer les formulaires
        this.enhanceForms();
        
        // Gérer les préférences utilisateur
        this.handleUserPreferences();
        
        // Améliorer la navigation
        this.enhanceNavigation();
        
        // Gérer les erreurs de manière accessible
        this.setupErrorHandling();
        
        // Ajouter les raccourcis clavier
        this.setupKeyboardShortcuts();
    }

    /**
     * Ajoute un lien "Aller au contenu principal"
     */
    addSkipLink() {
        if (document.querySelector('.skip-link')) return;
        
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Aller au contenu principal';
        
        // Insérer en premier dans le body
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // S'assurer qu'il y a un élément main avec l'id approprié
        let mainContent = document.getElementById('main-content');
        if (!mainContent) {
            mainContent = document.querySelector('main') || document.querySelector('.main-content');
            if (mainContent) {
                mainContent.id = 'main-content';
            }
        }
    }

    /**
     * Configure la détection de navigation clavier
     */
    setupKeyboardNavigation() {
        let isUsingKeyboard = false;
        
        // Détecter l'utilisation du clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
                isUsingKeyboard = true;
                document.documentElement.classList.add('keyboard-navigation');
                this.preferences.keyboardNavigation = true;
            }
        });
        
        // Détecter l'utilisation de la souris
        document.addEventListener('mousedown', () => {
            isUsingKeyboard = false;
            document.documentElement.classList.remove('keyboard-navigation');
            this.preferences.keyboardNavigation = false;
        });
        
        // Améliorer la navigation avec Tab
        this.enhanceTabNavigation();
    }

    /**
     * Améliore la navigation avec Tab
     */
    enhanceTabNavigation() {
        const focusableElements = 'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            const focusable = Array.from(document.querySelectorAll(focusableElements))
                .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
            
            const currentIndex = focusable.indexOf(document.activeElement);
            
            // Gérer la navigation dans les modales et menus
            const modal = document.activeElement.closest('.modal, .dropdown-menu');
            if (modal) {
                const modalFocusable = Array.from(modal.querySelectorAll(focusableElements))
                    .filter(el => !el.hasAttribute('disabled'));
                
                const modalIndex = modalFocusable.indexOf(document.activeElement);
                
                if (e.shiftKey) {
                    // Tab + Shift
                    if (modalIndex === 0) {
                        e.preventDefault();
                        modalFocusable[modalFocusable.length - 1].focus();
                    }
                } else {
                    // Tab seul
                    if (modalIndex === modalFocusable.length - 1) {
                        e.preventDefault();
                        modalFocusable[0].focus();
                    }
                }
            }
        });
    }

    /**
     * Crée un annonceur pour les lecteurs d'écran
     */
    createScreenReaderAnnouncer() {
        if (document.getElementById('sr-announcer')) return;
        
        this.announcer = document.createElement('div');
        this.announcer.id = 'sr-announcer';
        this.announcer.className = 'sr-only';
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        
        document.body.appendChild(this.announcer);
    }

    /**
     * Annonce un message aux lecteurs d'écran
     */
    announce(message, priority = 'polite') {
        if (!this.announcer) return;
        
        this.announcer.setAttribute('aria-live', priority);
        this.announcer.textContent = message;
        
        // Nettoyer après annonce
        setTimeout(() => {
            this.announcer.textContent = '';
        }, 1000);
    }

    /**
     * Améliore les formulaires pour l'accessibilité
     */
    enhanceForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            this.enhanceForm(form);
        });
    }

    /**
     * Améliore un formulaire spécifique
     */
    enhanceForm(form) {
        // Associer les labels aux inputs
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            this.enhanceInput(input);
        });
        
        // Créer un résumé d'erreur
        this.createErrorSummary(form);
        
        // Validation en temps réel accessible
        this.setupAccessibleValidation(form);
    }

    /**
     * Améliore un input spécifique
     */
    enhanceInput(input) {
        const label = this.findLabelForInput(input);
        
        // S'assurer que l'input a un label
        if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
            console.warn('Input sans label détecté:', input);
        }
        
        // Ajouter des descriptions si nécessaire
        const description = input.parentElement.querySelector('.form-description');
        if (description && !input.getAttribute('aria-describedby')) {
            const descId = 'desc-' + Math.random().toString(36).substr(2, 9);
            description.id = descId;
            input.setAttribute('aria-describedby', descId);
        }
        
        // Marquer les champs requis
        if (input.required && label) {
            label.classList.add('required');
            input.setAttribute('aria-required', 'true');
        }
        
        // Gérer les erreurs en temps réel
        input.addEventListener('blur', () => {
            this.validateInputAccessibly(input);
        });
    }

    /**
     * Trouve le label associé à un input
     */
    findLabelForInput(input) {
        // Label avec for
        if (input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) return label;
        }
        
        // Label parent
        const parentLabel = input.closest('label');
        if (parentLabel) return parentLabel;
        
        return null;
    }

    /**
     * Valide un input de manière accessible
     */
    validateInputAccessibly(input) {
        const isValid = input.checkValidity();
        const errorContainer = this.getOrCreateErrorContainer(input);
        
        if (!isValid) {
            const errorMessage = this.getErrorMessage(input);
            errorContainer.textContent = errorMessage;
            errorContainer.style.display = 'block';
            
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', 
                (input.getAttribute('aria-describedby') || '') + ' ' + errorContainer.id);
            
            input.classList.add('error');
            
            // Annoncer l'erreur
            this.announce(`Erreur: ${errorMessage}`, 'assertive');
        } else {
            errorContainer.style.display = 'none';
            input.removeAttribute('aria-invalid');
            input.classList.remove('error');
            input.classList.add('success');
        }
    }

    /**
     * Obtient ou crée un conteneur d'erreur pour un input
     */
    getOrCreateErrorContainer(input) {
        const errorId = input.id + '-error' || 'error-' + Math.random().toString(36).substr(2, 9);
        let errorContainer = document.getElementById(errorId);
        
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.id = errorId;
            errorContainer.className = 'error-message';
            errorContainer.setAttribute('role', 'alert');
            errorContainer.style.display = 'none';
            
            input.parentElement.appendChild(errorContainer);
        }
        
        return errorContainer;
    }

    /**
     * Génère un message d'erreur approprié
     */
    getErrorMessage(input) {
        const validity = input.validity;
        const fieldName = this.getFieldName(input);
        
        if (validity.valueMissing) {
            return `${fieldName} est requis.`;
        }
        if (validity.typeMismatch) {
            return `Veuillez entrer un ${input.type} valide pour ${fieldName}.`;
        }
        if (validity.tooShort) {
            return `${fieldName} doit contenir au moins ${input.minLength} caractères.`;
        }
        if (validity.tooLong) {
            return `${fieldName} ne peut pas dépasser ${input.maxLength} caractères.`;
        }
        if (validity.rangeUnderflow) {
            return `${fieldName} doit être supérieur ou égal à ${input.min}.`;
        }
        if (validity.rangeOverflow) {
            return `${fieldName} doit être inférieur ou égal à ${input.max}.`;
        }
        if (validity.patternMismatch) {
            return `${fieldName} ne respecte pas le format requis.`;
        }
        
        return `${fieldName} n'est pas valide.`;
    }

    /**
     * Obtient le nom d'un champ pour les messages d'erreur
     */
    getFieldName(input) {
        const label = this.findLabelForInput(input);
        if (label) {
            return label.textContent.replace('*', '').trim();
        }
        
        const ariaLabel = input.getAttribute('aria-label');
        if (ariaLabel) return ariaLabel;
        
        const placeholder = input.getAttribute('placeholder');
        if (placeholder) return placeholder;
        
        return 'Ce champ';
    }

    /**
     * Crée un résumé d'erreur pour un formulaire
     */
    createErrorSummary(form) {
        const existingSummary = form.querySelector('.error-summary');
        if (existingSummary) return;
        
        const errorSummary = document.createElement('div');
        errorSummary.className = 'error-summary';
        errorSummary.style.display = 'none';
        errorSummary.setAttribute('role', 'alert');
        errorSummary.innerHTML = `
            <h2>Il y a des erreurs dans le formulaire</h2>
            <ul class="error-list"></ul>
        `;
        
        form.insertBefore(errorSummary, form.firstChild);
        
        // Écouter la soumission du formulaire
        form.addEventListener('submit', (e) => {
            this.handleFormSubmission(form, e);
        });
    }

    /**
     * Gère la soumission de formulaire avec validation accessible
     */
    handleFormSubmission(form, event) {
        const invalidInputs = form.querySelectorAll(':invalid');
        
        if (invalidInputs.length > 0) {
            event.preventDefault();
            
            const errorSummary = form.querySelector('.error-summary');
            const errorList = errorSummary.querySelector('.error-list');
            
            // Vider la liste d'erreurs précédente
            errorList.innerHTML = '';
            
            // Créer la liste d'erreurs
            invalidInputs.forEach(input => {
                const errorMessage = this.getErrorMessage(input);
                const fieldName = this.getFieldName(input);
                
                const errorItem = document.createElement('li');
                const errorLink = document.createElement('a');
                errorLink.href = '#' + (input.id || '');
                errorLink.textContent = `${fieldName}: ${errorMessage}`;
                errorLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    input.focus();
                });
                
                errorItem.appendChild(errorLink);
                errorList.appendChild(errorItem);
                
                // Valider l'input pour afficher l'erreur
                this.validateInputAccessibly(input);
            });
            
            // Afficher le résumé d'erreur
            errorSummary.style.display = 'block';
            
            // Focus sur le résumé d'erreur
            errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
            errorSummary.focus();
            
            // Annoncer les erreurs
            this.announce(`Le formulaire contient ${invalidInputs.length} erreur${invalidInputs.length > 1 ? 's' : ''}`, 'assertive');
        } else {
            // Cacher le résumé d'erreur si tout est valide
            const errorSummary = form.querySelector('.error-summary');
            if (errorSummary) {
                errorSummary.style.display = 'none';
            }
            
            this.announce('Formulaire envoyé avec succès', 'polite');
        }
    }

    /**
     * Configure la validation accessible
     */
    setupAccessibleValidation(form) {
        // Validation en temps réel mais pas trop agressive
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            let hasBeenBlurred = false;
            
            input.addEventListener('blur', () => {
                hasBeenBlurred = true;
                this.validateInputAccessibly(input);
            });
            
            // Validation en temps réel seulement après le premier blur
            input.addEventListener('input', () => {
                if (hasBeenBlurred) {
                    clearTimeout(input.validationTimeout);
                    input.validationTimeout = setTimeout(() => {
                        this.validateInputAccessibly(input);
                    }, 300);
                }
            });
        });
    }

    /**
     * Gère les préférences utilisateur d'accessibilité
     */
    handleUserPreferences() {
        // Détecter les préférences système
        this.detectSystemPreferences();
        
        // Créer un panneau de préférences d'accessibilité
        this.createAccessibilityPanel();
    }

    /**
     * Détecte les préférences système
     */
    detectSystemPreferences() {
        // Mouvement réduit
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.preferences.reducedMotion = reducedMotion.matches;
        
        reducedMotion.addEventListener('change', (e) => {
            this.preferences.reducedMotion = e.matches;
            this.applyMotionPreferences();
        });
        
        // Contraste élevé
        const highContrast = window.matchMedia('(prefers-contrast: high)');
        this.preferences.highContrast = highContrast.matches;
        
        highContrast.addEventListener('change', (e) => {
            this.preferences.highContrast = e.matches;
            this.applyContrastPreferences();
        });
        
        // Appliquer les préférences initiales
        this.applyMotionPreferences();
        this.applyContrastPreferences();
    }

    /**
     * Applique les préférences de mouvement
     */
    applyMotionPreferences() {
        document.documentElement.classList.toggle('reduce-motion', this.preferences.reducedMotion);
    }

    /**
     * Applique les préférences de contraste
     */
    applyContrastPreferences() {
        document.documentElement.classList.toggle('high-contrast', this.preferences.highContrast);
    }

    /**
     * Crée un panneau de préférences d'accessibilité
     */
    createAccessibilityPanel() {
        if (document.getElementById('accessibility-panel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'accessibility-panel';
        panel.className = 'accessibility-panel';
        panel.innerHTML = `
            <button class="accessibility-toggle" aria-label="Ouvrir les préférences d'accessibilité">
                <i class="fas fa-universal-access" aria-hidden="true"></i>
            </button>
            <div class="accessibility-content" hidden>
                <h3>Préférences d'accessibilité</h3>
                <div class="preference-group">
                    <label>
                        <input type="checkbox" id="high-contrast-toggle">
                        Contraste élevé
                    </label>
                </div>
                <div class="preference-group">
                    <label>
                        <input type="checkbox" id="large-text-toggle">
                        Texte agrandi
                    </label>
                </div>
                <div class="preference-group">
                    <label>
                        <input type="checkbox" id="reduced-motion-toggle">
                        Mouvement réduit
                    </label>
                </div>
            </div>
        `;
        
        // Styles inline pour éviter les dépendances
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            z-index: 10000;
        `;
        
        document.body.appendChild(panel);
        
        // Gérer l'ouverture/fermeture
        this.setupAccessibilityPanel(panel);
    }

    /**
     * Configure le panneau d'accessibilité
     */
    setupAccessibilityPanel(panel) {
        const toggle = panel.querySelector('.accessibility-toggle');
        const content = panel.querySelector('.accessibility-content');
        
        toggle.addEventListener('click', () => {
            const isOpen = !content.hidden;
            content.hidden = isOpen;
            toggle.setAttribute('aria-expanded', !isOpen);
            
            if (!isOpen) {
                content.querySelector('input').focus();
            }
        });
        
        // Gérer les préférences
        const highContrastToggle = panel.querySelector('#high-contrast-toggle');
        const largeTextToggle = panel.querySelector('#large-text-toggle');
        const reducedMotionToggle = panel.querySelector('#reduced-motion-toggle');
        
        highContrastToggle.addEventListener('change', (e) => {
            this.preferences.highContrast = e.target.checked;
            this.applyContrastPreferences();
        });
        
        largeTextToggle.addEventListener('change', (e) => {
            this.preferences.largeText = e.target.checked;
            document.documentElement.classList.toggle('large-text', e.target.checked);
        });
        
        reducedMotionToggle.addEventListener('change', (e) => {
            this.preferences.reducedMotion = e.target.checked;
            this.applyMotionPreferences();
        });
    }

    /**
     * Améliore la navigation
     */
    enhanceNavigation() {
        // Ajouter des repères ARIA
        this.addLandmarks();
        
        // Améliorer les menus déroulants
        this.enhanceDropdowns();
        
        // Gérer la navigation dans les modales
        this.setupModalNavigation();
    }

    /**
     * Ajoute des repères ARIA
     */
    addLandmarks() {
        // Navigation principale
        const nav = document.querySelector('nav');
        if (nav && !nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Navigation principale');
        }
        
        // Contenu principal
        const main = document.querySelector('main');
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }
        
        // Pied de page
        const footer = document.querySelector('footer');
        if (footer && !footer.getAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }
    }

    /**
     * Améliore les menus déroulants
     */
    enhanceDropdowns() {
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.nav-link');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!toggle || !menu) return;
            
            // Attributs ARIA
            toggle.setAttribute('aria-haspopup', 'true');
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('role', 'menu');
            
            // Gestion clavier
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'Enter') {
                    e.preventDefault();
                    this.openDropdown(dropdown);
                    const firstItem = menu.querySelector('a');
                    if (firstItem) firstItem.focus();
                }
            });
            
            // Navigation dans le menu
            menu.addEventListener('keydown', (e) => {
                this.handleDropdownNavigation(e, menu);
            });
        });
    }

    /**
     * Ouvre un menu déroulant
     */
    openDropdown(dropdown) {
        const toggle = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        toggle.setAttribute('aria-expanded', 'true');
        dropdown.classList.add('open');
        
        // Fermer les autres menus
        document.querySelectorAll('.nav-dropdown.open').forEach(other => {
            if (other !== dropdown) {
                this.closeDropdown(other);
            }
        });
    }

    /**
     * Ferme un menu déroulant
     */
    closeDropdown(dropdown) {
        const toggle = dropdown.querySelector('.nav-link');
        
        toggle.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
    }

    /**
     * Gère la navigation clavier dans les menus
     */
    handleDropdownNavigation(event, menu) {
        const items = Array.from(menu.querySelectorAll('a'));
        const currentIndex = items.indexOf(document.activeElement);
        
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                items[nextIndex].focus();
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                const prevIndex = (currentIndex - 1 + items.length) % items.length;
                items[prevIndex].focus();
                break;
                
            case 'Escape':
                event.preventDefault();
                const dropdown = menu.closest('.nav-dropdown');
                this.closeDropdown(dropdown);
                dropdown.querySelector('.nav-link').focus();
                break;
                
            case 'Tab':
                const dropdown = menu.closest('.nav-dropdown');
                this.closeDropdown(dropdown);
                break;
        }
    }

    /**
     * Configure la navigation dans les modales
     */
    setupModalNavigation() {
        // Cette méthode sera étendue si des modales sont ajoutées
    }

    /**
     * Configure la gestion d'erreurs accessible
     */
    setupErrorHandling() {
        // Capturer les erreurs JavaScript
        window.addEventListener('error', (e) => {
            this.announce('Une erreur est survenue. Veuillez réessayer.', 'assertive');
        });
        
        // Gérer les erreurs de réseau
        window.addEventListener('offline', () => {
            this.announce('Connexion internet perdue', 'assertive');
        });
        
        window.addEventListener('online', () => {
            this.announce('Connexion internet rétablie', 'polite');
        });
    }

    /**
     * Configure les raccourcis clavier
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + 1 : Aller au contenu principal
            if (e.altKey && e.key === '1') {
                e.preventDefault();
                const mainContent = document.getElementById('main-content') || document.querySelector('main');
                if (mainContent) {
                    mainContent.focus();
                    mainContent.scrollIntoView();
                }
            }
            
            // Alt + 2 : Aller à la navigation
            if (e.altKey && e.key === '2') {
                e.preventDefault();
                const nav = document.querySelector('nav a');
                if (nav) nav.focus();
            }
            
            // Escape : Fermer les menus/modales
            if (e.key === 'Escape') {
                document.querySelectorAll('.nav-dropdown.open').forEach(dropdown => {
                    this.closeDropdown(dropdown);
                });
            }
        });
    }

    /**
     * API publique pour annoncer des messages
     */
    announceMessage(message, priority = 'polite') {
        this.announce(message, priority);
    }

    /**
     * API publique pour valider un formulaire
     */
    validateForm(form) {
        return this.handleFormSubmission(form, { preventDefault: () => {} });
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityManager = new AccessibilityManager();
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
}