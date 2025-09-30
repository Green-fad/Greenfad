/**
 * Enhanced Responsive JavaScript
 * Gestion avancée de la responsivité et des interactions mobiles
 */

class ResponsiveManager {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupMobileNavigation();
        this.setupResponsiveImages();
        this.setupIntersectionObserver();
        this.setupTouchGestures();
    }

    init() {
        // Configuration des breakpoints
        this.breakpoints = {
            xs: 320,
            sm: 480,
            md: 768,
            lg: 1024,
            xl: 1200,
            xxl: 1400
        };

        // État actuel
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.isMenuOpen = false;
        this.scrollPosition = 0;

        // Cache des éléments DOM
        this.DOM = {
            hamburger: document.querySelector('.hamburger'),
            navMenu: document.querySelector('.nav-menu'),
            navbar: document.querySelector('.navbar'),
            body: document.body,
            html: document.documentElement
        };

        // Initialiser la barre de progression
        this.createScrollProgress();
    }

    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width >= this.breakpoints.xxl) return 'xxl';
        if (width >= this.breakpoints.xl) return 'xl';
        if (width >= this.breakpoints.lg) return 'lg';
        if (width >= this.breakpoints.md) return 'md';
        if (width >= this.breakpoints.sm) return 'sm';
        return 'xs';
    }

    setupEventListeners() {
        // Resize avec debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 100);
        });

        // Scroll avec throttle
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    this.handleScroll();
                    scrollTimeout = null;
                }, 16); // 60fps
            }
        });

        // Orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 100);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    handleResize() {
        const newBreakpoint = this.getCurrentBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.handleBreakpointChange();
        }

        // Fermer le menu mobile si on passe en desktop
        if (this.currentBreakpoint === 'lg' || this.currentBreakpoint === 'xl' || this.currentBreakpoint === 'xxl') {
            this.closeMobileMenu();
        }

        // Recalculer la hauteur du viewport pour mobile
        if (this.isMobile()) {
            this.setViewportHeight();
        }
    }

    handleBreakpointChange() {
        // Émettre un événement personnalisé
        const event = new CustomEvent('breakpointChange', {
            detail: {
                breakpoint: this.currentBreakpoint,
                width: window.innerWidth
            }
        });
        window.dispatchEvent(event);

        // Ajuster les grilles et layouts
        this.adjustGridLayouts();
        
        // Réinitialiser les animations si nécessaire
        this.resetAnimations();
    }

    handleScroll() {
        this.scrollPosition = window.pageYOffset;
        
        // Mettre à jour la barre de progression
        this.updateScrollProgress();
        
        // Navbar sticky behavior
        this.handleNavbarScroll();
        
        // Parallax effects (si activé)
        if (!this.prefersReducedMotion()) {
            this.handleParallax();
        }
    }

    handleKeyboard(e) {
        // Échapper pour fermer le menu
        if (e.key === 'Escape' && this.isMenuOpen) {
            this.closeMobileMenu();
        }

        // Navigation par tabulation
        if (e.key === 'Tab') {
            this.handleTabNavigation(e);
        }
    }

    setupMobileNavigation() {
        if (!this.DOM.hamburger || !this.DOM.navMenu) return;

        // Click sur le hamburger
        this.DOM.hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });

        // Click sur les liens du menu mobile
        const navLinks = this.DOM.navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMobile()) {
                    setTimeout(() => {
                        this.closeMobileMenu();
                    }, 300);
                }
            });
        });

        // Click en dehors du menu pour fermer
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.DOM.navMenu.contains(e.target) && 
                !this.DOM.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        if (this.isMenuOpen) return;

        this.isMenuOpen = true;
        
        // Ajouter les classes d'animation
        this.DOM.hamburger.classList.add('active');
        this.DOM.navMenu.classList.add('active');
        this.DOM.body.classList.add('menu-open');
        
        // Empêcher le scroll du body
        this.DOM.body.style.overflow = 'hidden';
        
        // Focus sur le premier élément du menu
        const firstLink = this.DOM.navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => {
                firstLink.focus();
            }, 300);
        }

        // Animer les éléments du menu
        this.animateMenuItems();
    }

    closeMobileMenu() {
        if (!this.isMenuOpen) return;

        this.isMenuOpen = false;
        
        // Retirer les classes d'animation
        this.DOM.hamburger.classList.remove('active');
        this.DOM.navMenu.classList.remove('active');
        this.DOM.body.classList.remove('menu-open');
        
        // Restaurer le scroll du body
        this.DOM.body.style.overflow = '';
        
        // Remettre le focus sur le hamburger
        setTimeout(() => {
            this.DOM.hamburger.focus();
        }, 300);
    }

    animateMenuItems() {
        const menuItems = this.DOM.navMenu.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.transitionDelay = `${(index + 1) * 0.1}s`;
        });
    }

    setupResponsiveImages() {
        // Lazy loading avec Intersection Observer
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        }

        // Images responsives avec srcset automatique
        this.setupResponsiveImageSources();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    setupResponsiveImageSources() {
        // Générer des sources responsives basées sur le viewport
        const images = document.querySelectorAll('img[data-responsive]');
        
        images.forEach(img => {
            const baseSrc = img.dataset.responsive;
            const currentBreakpoint = this.getCurrentBreakpoint();
            
            // Ajuster la source selon le breakpoint
            let newSrc = baseSrc;
            if (this.isMobile()) {
                newSrc = baseSrc.replace('.jpg', '-mobile.jpg').replace('.png', '-mobile.png');
            } else if (this.isTablet()) {
                newSrc = baseSrc.replace('.jpg', '-tablet.jpg').replace('.png', '-tablet.png');
            }
            
            img.src = newSrc;
        });
    }

    setupIntersectionObserver() {
        // Animation des éléments au scroll
        const animateElements = document.querySelectorAll('[data-animate]');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.dataset.animate;
                    
                    element.classList.add('animate-in');
                    element.classList.add(`animate-${animation}`);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    setupTouchGestures() {
        // Swipe pour fermer le menu mobile
        let startX, startY, distX, distY;
        
        this.DOM.navMenu.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        });
        
        this.DOM.navMenu.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const touch = e.touches[0];
            distX = touch.clientX - startX;
            distY = touch.clientY - startY;
        });
        
        this.DOM.navMenu.addEventListener('touchend', () => {
            // Swipe à gauche pour fermer
            if (distX < -100 && Math.abs(distY) < 100 && this.isMenuOpen) {
                this.closeMobileMenu();
            }
            
            startX = startY = distX = distY = null;
        });

        // Pinch to zoom protection
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });

        document.addEventListener('gesturechange', (e) => {
            e.preventDefault();
        });
    }

    createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.setAttribute('aria-hidden', 'true');
        document.body.appendChild(progressBar);
        this.progressBar = progressBar;
    }

    updateScrollProgress() {
        if (!this.progressBar) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (this.scrollPosition / scrollHeight) * 100;
        
        this.progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    }

    handleNavbarScroll() {
        if (!this.DOM.navbar) return;
        
        const scrollThreshold = 100;
        
        if (this.scrollPosition > scrollThreshold) {
            this.DOM.navbar.classList.add('scrolled');
        } else {
            this.DOM.navbar.classList.remove('scrolled');
        }
    }

    handleParallax() {
        // Parallax simple pour les éléments avec data-parallax
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(this.scrollPosition * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    adjustGridLayouts() {
        // Ajuster les grilles selon le breakpoint
        const autoGrids = document.querySelectorAll('.grid-auto');
        
        autoGrids.forEach(grid => {
            const minWidth = this.isMobile() ? '280px' : 
                           this.isTablet() ? '320px' : '300px';
            
            grid.style.gridTemplateColumns = `repeat(auto-fit, minmax(${minWidth}, 1fr))`;
        });
    }

    resetAnimations() {
        // Réinitialiser les animations si le breakpoint change
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        animatedElements.forEach(element => {
            element.classList.remove('animate-in');
            element.style.transitionDelay = '';
        });
        
        // Re-observer les éléments
        setTimeout(() => {
            this.setupIntersectionObserver();
        }, 100);
    }

    setViewportHeight() {
        // Fix pour la hauteur du viewport sur mobile
        const vh = window.innerHeight * 0.01;
        this.DOM.html.style.setProperty('--vh', `${vh}px`);
    }

    handleTabNavigation(e) {
        // Améliorer la navigation clavier dans le menu mobile
        if (!this.isMenuOpen) return;
        
        const focusableElements = this.DOM.navMenu.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    // Utilitaires
    isMobile() {
        return this.currentBreakpoint === 'xs' || this.currentBreakpoint === 'sm';
    }

    isTablet() {
        return this.currentBreakpoint === 'md';
    }

    isDesktop() {
        return this.currentBreakpoint === 'lg' || 
               this.currentBreakpoint === 'xl' || 
               this.currentBreakpoint === 'xxl';
    }

    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // API publique
    getBreakpoint() {
        return this.currentBreakpoint;
    }

    getScrollPosition() {
        return this.scrollPosition;
    }

    isMenuOpened() {
        return this.isMenuOpen;
    }

    // Méthodes de contrôle du menu
    openMenu() {
        if (this.isMobile()) {
            this.openMobileMenu();
        }
    }

    closeMenu() {
        if (this.isMobile()) {
            this.closeMobileMenu();
        }
    }
}

// Animation utilities
class AnimationUtils {
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            
            element.style.opacity = Math.min(progress / duration, 1);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    static fadeOut(element, duration = 300) {
        let start = null;
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            
            element.style.opacity = initialOpacity - (initialOpacity * progress / duration);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    static slideDown(element, duration = 300) {
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const targetHeight = element.scrollHeight;
        let start = null;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            
            element.style.height = Math.min((targetHeight * progress / duration), targetHeight) + 'px';
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.height = '';
                element.style.overflow = '';
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    static slideUp(element, duration = 300) {
        const initialHeight = element.scrollHeight;
        element.style.height = initialHeight + 'px';
        element.style.overflow = 'hidden';
        
        let start = null;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            
            element.style.height = initialHeight - (initialHeight * progress / duration) + 'px';
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                element.style.height = '';
                element.style.overflow = '';
            }
        }
        
        requestAnimationFrame(animate);
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            memory: 0,
            timing: {}
        };
        
        this.startMonitoring();
    }
    
    startMonitoring() {
        // FPS monitoring
        this.monitorFPS();
        
        // Memory monitoring (si supporté)
        if ('memory' in performance) {
            this.monitorMemory();
        }
        
        // Navigation timing
        this.getNavigationTiming();
    }
    
    monitorFPS() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime >= lastTime + 1000) {
                this.metrics.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                // Émettre un événement si les performances sont faibles
                if (this.metrics.fps < 30) {
                    const event = new CustomEvent('lowPerformance', {
                        detail: { fps: this.metrics.fps }
                    });
                    window.dispatchEvent(event);
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    monitorMemory() {
        setInterval(() => {
            if (performance.memory) {
                this.metrics.memory = {
                    used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                    total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
                };
            }
        }, 5000);
    }
    
    getNavigationTiming() {
        window.addEventListener('load', () => {
            const timing = performance.getEntriesByType('navigation')[0];
            
            this.metrics.timing = {
                dns: timing.domainLookupEnd - timing.domainLookupStart,
                connect: timing.connectEnd - timing.connectStart,
                ttfb: timing.responseStart - timing.requestStart,
                download: timing.responseEnd - timing.responseStart,
                dom: timing.domContentLoadedEventStart - timing.responseEnd,
                load: timing.loadEventStart - timing.domContentLoadedEventStart
            };
        });
    }
    
    getMetrics() {
        return this.metrics;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le gestionnaire de responsivité
    window.responsiveManager = new ResponsiveManager();
    
    // Initialiser le moniteur de performance (en développement uniquement)
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
        window.performanceMonitor = new PerformanceMonitor();
    }
    
    // Exposer les utilitaires globalement
    window.AnimationUtils = AnimationUtils;
    
    // Écouter les changements de breakpoint
    window.addEventListener('breakpointChange', (e) => {
        console.log(`Breakpoint changed to: ${e.detail.breakpoint} (${e.detail.width}px)`);
    });
    
    // Écouter les problèmes de performance
    window.addEventListener('lowPerformance', (e) => {
        console.warn(`Low performance detected: ${e.detail.fps} FPS`);
        
        // Désactiver certaines animations si nécessaire
        document.body.classList.add('reduced-animations');
    });
});

// Gestion du mode hors ligne
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    console.log('Connection lost');
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ResponsiveManager, AnimationUtils, PerformanceMonitor };
}