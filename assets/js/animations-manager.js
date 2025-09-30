/**
 * Gestionnaire d'animations responsives
 * Gère les animations avec optimisations pour mobile et accessibilité
 */

class AnimationsManager {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.settings = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            reduceMotion: false
        };
        
        this.init();
    }

    init() {
        // Détecter les préférences de mouvement réduit
        this.detectMotionPreferences();
        
        // Configurer l'Intersection Observer pour les animations au scroll
        this.setupScrollAnimations();
        
        // Configurer les animations de parallax
        this.setupParallaxAnimations();
        
        // Configurer les micro-interactions
        this.setupMicroInteractions();
        
        // Gérer les animations de chargement
        this.setupLoadingAnimations();
        
        // Optimiser pour mobile
        this.optimizeForMobile();
    }

    /**
     * Détecte les préférences de mouvement de l'utilisateur
     */
    detectMotionPreferences() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.settings.reduceMotion = mediaQuery.matches;
        
        mediaQuery.addEventListener('change', (e) => {
            this.settings.reduceMotion = e.matches;
            this.toggleReducedMotion(e.matches);
        });
        
        // Détecter les connexions lentes
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.settings.reduceMotion = true;
            }
        }
    }

    /**
     * Active/désactive le mode mouvement réduit
     */
    toggleReducedMotion(reduce) {
        document.documentElement.classList.toggle('reduce-motion', reduce);
        
        if (reduce) {
            // Arrêter toutes les animations en cours
            this.pauseAllAnimations();
        } else {
            // Relancer les animations
            this.resumeAllAnimations();
        }
    }

    /**
     * Configure les animations au scroll
     */
    setupScrollAnimations() {
        if (this.settings.reduceMotion) return;
        
        const options = {
            threshold: this.settings.threshold,
            rootMargin: this.settings.rootMargin
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                
                if (entry.isIntersecting) {
                    this.animateElement(element, 'enter');
                } else {
                    // Optionnel: animer en sortie
                    if (element.dataset.animateExit === 'true') {
                        this.animateElement(element, 'exit');
                    }
                }
            });
        }, options);

        // Observer tous les éléments avec animation au scroll
        const animateElements = document.querySelectorAll('[data-animate], .animate-on-scroll');
        animateElements.forEach(el => {
            scrollObserver.observe(el);
        });

        this.observers.set('scroll', scrollObserver);
    }

    /**
     * Anime un élément selon le type spécifié
     */
    animateElement(element, direction = 'enter') {
        if (this.settings.reduceMotion) {
            element.classList.add('animated', 'no-animation');
            return;
        }

        const animationType = element.dataset.animate || 'fade-in-up';
        const delay = element.dataset.animateDelay || 0;
        const duration = element.dataset.animateDuration || null;
        
        // Appliquer le délai
        if (delay > 0) {
            setTimeout(() => {
                this.applyAnimation(element, animationType, direction);
            }, delay);
        } else {
            this.applyAnimation(element, animationType, direction);
        }

        // Appliquer la durée personnalisée
        if (duration) {
            element.style.animationDuration = duration + 'ms';
        }

        this.animatedElements.add(element);
    }

    /**
     * Applique une animation spécifique à un élément
     */
    applyAnimation(element, type, direction) {
        // Nettoyer les classes d'animation précédentes
        this.clearAnimationClasses(element);
        
        if (direction === 'enter') {
            element.classList.add('animated', `animate-${type}`);
            
            // Gestion en cascade pour les éléments frères
            if (element.classList.contains('animate-cascade')) {
                this.applyCascadeAnimation(element);
            }
        } else if (direction === 'exit') {
            element.classList.remove('animated', `animate-${type}`);
            element.classList.add('animate-on-scroll');
        }
    }

    /**
     * Applique une animation en cascade
     */
    applyCascadeAnimation(element) {
        const siblings = element.parentElement.querySelectorAll('.animate-cascade');
        siblings.forEach((sibling, index) => {
            if (sibling === element) return;
            
            setTimeout(() => {
                if (!this.settings.reduceMotion) {
                    const animationType = sibling.dataset.animate || 'fade-in-up';
                    this.applyAnimation(sibling, animationType, 'enter');
                }
            }, (index + 1) * 100);
        });
    }

    /**
     * Nettoie les classes d'animation d'un élément
     */
    clearAnimationClasses(element) {
        const animationClasses = Array.from(element.classList)
            .filter(className => className.startsWith('animate-'));
        
        animationClasses.forEach(className => {
            element.classList.remove(className);
        });
    }

    /**
     * Configure les animations de parallax
     */
    setupParallaxAnimations() {
        if (this.settings.reduceMotion) return;
        
        // Ne pas utiliser de parallax sur mobile pour les performances
        if (this.isMobile()) return;
        
        const parallaxElements = document.querySelectorAll('.parallax-element, [data-parallax]');
        
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    parallaxElements.forEach(element => {
                        this.updateParallaxElement(element);
                    });
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        // Utiliser un throttle pour les performances
        window.addEventListener('scroll', updateParallax, { passive: true });
    }

    /**
     * Met à jour un élément de parallax
     */
    updateParallaxElement(element) {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const rect = element.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        
        // Calculer le décalage de parallax
        const yPos = -(scrolled * speed);
        
        // Appliquer la transformation seulement si l'élément est visible
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
            element.style.transform = `translateY(${yPos}px) translateZ(0)`;
        }
    }

    /**
     * Configure les micro-interactions
     */
    setupMicroInteractions() {
        // Hover effects avec debounce
        this.setupHoverEffects();
        
        // Click effects
        this.setupClickEffects();
        
        // Focus effects pour l'accessibilité
        this.setupFocusEffects();
        
        // Animations de formulaires
        this.setupFormAnimations();
    }

    /**
     * Configure les effets de hover
     */
    setupHoverEffects() {
        const hoverElements = document.querySelectorAll(
            '.hover-lift, .hover-scale, .hover-rotate, .hover-tilt, .hover-glow'
        );
        
        hoverElements.forEach(element => {
            let hoverTimeout;
            
            element.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                if (!this.settings.reduceMotion) {
                    element.classList.add('is-hovered');
                }
            });
            
            element.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    element.classList.remove('is-hovered');
                }, 150);
            });
        });
    }

    /**
     * Configure les effets de clic
     */
    setupClickEffects() {
        const clickElements = document.querySelectorAll('.btn, .card, .gallery-item');
        
        clickElements.forEach(element => {
            element.addEventListener('click', (e) => {
                if (this.settings.reduceMotion) return;
                
                // Effet ripple
                this.createRippleEffect(element, e);
            });
        });
    }

    /**
     * Crée un effet ripple au clic
     */
    createRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // S'assurer que l'élément parent a position relative
        const computedStyle = getComputedStyle(element);
        if (computedStyle.position === 'static') {
            element.style.position = 'relative';
        }
        
        element.appendChild(ripple);
        
        // Supprimer l'effet après l'animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    /**
     * Configure les effets de focus pour l'accessibilité
     */
    setupFocusEffects() {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                if (!this.settings.reduceMotion) {
                    element.classList.add('focus-animated');
                }
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('focus-animated');
            });
        });
    }

    /**
     * Configure les animations de formulaires
     */
    setupFormAnimations() {
        const formInputs = document.querySelectorAll('input, textarea, select');
        
        formInputs.forEach(input => {
            // Animation des labels flottants
            if (input.nextElementSibling && input.nextElementSibling.classList.contains('floating-label')) {
                this.setupFloatingLabel(input);
            }
            
            // Validation en temps réel avec animations
            input.addEventListener('blur', () => {
                this.animateValidation(input);
            });
        });
    }

    /**
     * Configure un label flottant
     */
    setupFloatingLabel(input) {
        const label = input.nextElementSibling;
        
        const checkValue = () => {
            if (input.value !== '') {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        };
        
        input.addEventListener('focus', () => {
            label.classList.add('active');
        });
        
        input.addEventListener('blur', checkValue);
        input.addEventListener('input', checkValue);
        
        // Vérifier la valeur initiale
        checkValue();
    }

    /**
     * Anime la validation de formulaire
     */
    animateValidation(input) {
        if (this.settings.reduceMotion) return;
        
        const isValid = input.checkValidity();
        
        input.classList.remove('invalid-shake', 'valid-bounce');
        
        if (!isValid) {
            setTimeout(() => {
                input.classList.add('invalid-shake');
            }, 10);
        } else {
            setTimeout(() => {
                input.classList.add('valid-bounce');
            }, 10);
        }
    }

    /**
     * Configure les animations de chargement
     */
    setupLoadingAnimations() {
        // Spinner global
        this.createGlobalLoader();
        
        // Animations de chargement de contenu
        this.setupContentLoading();
        
        // Progress bars animées
        this.setupProgressBars();
    }

    /**
     * Crée un loader global
     */
    createGlobalLoader() {
        if (document.getElementById('global-loader')) return;
        
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.className = 'global-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner"></div>
                <p class="loader-text">Chargement...</p>
            </div>
        `;
        
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        `;
        
        document.body.appendChild(loader);
    }

    /**
     * Affiche/cache le loader global
     */
    toggleGlobalLoader(show) {
        const loader = document.getElementById('global-loader');
        if (!loader) return;
        
        if (show) {
            loader.style.opacity = '1';
            loader.style.visibility = 'visible';
        } else {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
    }

    /**
     * Configure le chargement de contenu
     */
    setupContentLoading() {
        // Observer pour les éléments de contenu qui se chargent
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    this.loadContent(element);
                    contentObserver.unobserve(element);
                }
            });
        });
        
        const lazyContent = document.querySelectorAll('[data-lazy-content]');
        lazyContent.forEach(el => {
            contentObserver.observe(el);
        });
        
        this.observers.set('content', contentObserver);
    }

    /**
     * Charge le contenu de manière animée
     */
    loadContent(element) {
        const url = element.dataset.lazyContent;
        if (!url) return;
        
        element.classList.add('loading');
        
        fetch(url)
            .then(response => response.text())
            .then(html => {
                element.innerHTML = html;
                element.classList.remove('loading');
                element.classList.add('loaded');
                
                // Animer le nouveau contenu
                if (!this.settings.reduceMotion) {
                    this.animateElement(element, 'enter');
                }
            })
            .catch(error => {
                console.error('Erreur de chargement:', error);
                element.classList.remove('loading');
                element.classList.add('error');
            });
    }

    /**
     * Configure les barres de progression
     */
    setupProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const targetValue = parseFloat(bar.dataset.value) || 0;
            this.animateProgressBar(bar, targetValue);
        });
    }

    /**
     * Anime une barre de progression
     */
    animateProgressBar(bar, targetValue) {
        if (this.settings.reduceMotion) {
            bar.style.width = targetValue + '%';
            return;
        }
        
        let currentValue = 0;
        const increment = targetValue / 100;
        const duration = 2000;
        const stepTime = duration / 100;
        
        const animate = () => {
            currentValue += increment;
            bar.style.width = Math.min(currentValue, targetValue) + '%';
            
            if (currentValue < targetValue) {
                setTimeout(animate, stepTime);
            }
        };
        
        animate();
    }

    /**
     * Optimise les animations pour mobile
     */
    optimizeForMobile() {
        if (!this.isMobile()) return;
        
        // Réduire la complexité des animations
        document.documentElement.classList.add('mobile-optimized');
        
        // Désactiver certaines animations lourdes
        const heavyAnimations = document.querySelectorAll(
            '.gradient-animation, .parallax-element, [data-parallax]'
        );
        
        heavyAnimations.forEach(element => {
            element.classList.add('no-animation');
        });
    }

    /**
     * Utilitaires
     */
    isMobile() {
        return window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
    }

    /**
     * Pause toutes les animations
     */
    pauseAllAnimations() {
        document.documentElement.classList.add('animations-paused');
        
        this.animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }

    /**
     * Reprend toutes les animations
     */
    resumeAllAnimations() {
        document.documentElement.classList.remove('animations-paused');
        
        this.animatedElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }

    /**
     * Nettoie les observers
     */
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.animatedElements.clear();
    }

    /**
     * API publique pour déclencher des animations manuellement
     */
    animate(selector, type = 'fade-in-up', options = {}) {
        const elements = typeof selector === 'string' ? 
            document.querySelectorAll(selector) : [selector];
        
        elements.forEach((element, index) => {
            const delay = options.delay || 0;
            const stagger = options.stagger || 0;
            
            setTimeout(() => {
                this.animateElement(element, 'enter');
            }, delay + (index * stagger));
        });
    }
}

// Styles CSS pour les animations de validation et ripple
const animationStyles = `
<style>
.invalid-shake {
    animation: shake 0.5s ease-in-out;
}

.valid-bounce {
    animation: validBounce 0.6s ease-out;
}

@keyframes validBounce {
    0% { transform: scale(1); }
    30% { transform: scale(1.05); }
    60% { transform: scale(0.98); }
    100% { transform: scale(1); }
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.focus-animated {
    box-shadow: 0 0 0 2px rgba(0, 212, 170, 0.3) !important;
    transition: box-shadow 0.2s ease-out;
}

.floating-label {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    background: white;
    padding: 0 4px;
    color: #666;
    transition: all 0.3s ease;
    pointer-events: none;
}

.floating-label.active {
    top: 0;
    font-size: 12px;
    color: var(--primary-color);
}

.mobile-optimized .gradient-animation,
.mobile-optimized .parallax-element {
    animation: none !important;
    transform: none !important;
}

.animations-paused * {
    animation-play-state: paused !important;
}
</style>
`;

// Injecter les styles
document.head.insertAdjacentHTML('beforeend', animationStyles);

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.animationsManager = new AnimationsManager();
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationsManager;
}