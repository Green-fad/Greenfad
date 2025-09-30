/**
 * Améliorations mobiles pour Greenfad
 * Ce fichier améliore l'expérience mobile sans supprimer le code existant
 */

(function() {
    'use strict';

    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileImprovements);
    } else {
        initMobileImprovements();
    }

    function initMobileImprovements() {
        // Amélioration du menu hamburger
        improveMobileNavigation();
        
        // Amélioration des interactions tactiles
        improveTouchInteractions();
        
        // Amélioration des performances sur mobile
        improveMobilePerformance();
        
        // Amélioration de l'accessibilité mobile
        improveMobileAccessibility();
        
        // Correction des problèmes de redimensionnement
        improveResponsiveLayout();
    }

    function improveMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!hamburger || !navMenu) return;

        // Améliorer le comportement du menu hamburger
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = hamburger.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Fermer le menu en cliquant sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !hamburger.contains(e.target) && 
                !navMenu.contains(e.target) &&
                navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Fermer le menu avec la touche Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
                hamburger.focus();
            }
        });

        function openMenu() {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            
            // Focus sur le premier lien du menu
            const firstLink = navMenu.querySelector('.nav-link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        // Gérer le redimensionnement de la fenêtre
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    function improveTouchInteractions() {
        // Améliorer les interactions tactiles pour les cartes flottantes
        const floatingCards = document.querySelectorAll('.floating-card');
        
        floatingCards.forEach(card => {
            // Ajouter un feedback tactile
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });

            card.addEventListener('touchend', function() {
                this.style.transform = '';
            });

            card.addEventListener('touchcancel', function() {
                this.style.transform = '';
            });
        });

        // Améliorer les boutons pour le tactile
        const buttons = document.querySelectorAll('.btn, .btn-agency-primary, .btn-agency-secondary');
        
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });

            button.addEventListener('touchend', function() {
                this.style.transform = '';
            });

            button.addEventListener('touchcancel', function() {
                this.style.transform = '';
            });
        });

        // Améliorer les statistiques pour le tactile
        const stats = document.querySelectorAll('.agency-stat');
        
        stats.forEach(stat => {
            stat.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });

            stat.addEventListener('touchend', function() {
                this.style.transform = '';
            });

            stat.addEventListener('touchcancel', function() {
                this.style.transform = '';
            });
        });
    }

    function improveMobilePerformance() {
        // Optimiser les animations sur mobile
        if (window.innerWidth <= 768) {
            // Réduire les animations sur les appareils moins performants
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            if (prefersReducedMotion.matches) {
                document.body.classList.add('reduced-motion');
            }

            // Optimiser le défilement
            let ticking = false;
            
            function updateScrollEffects() {
                // Logique de défilement optimisée
                ticking = false;
            }

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    requestAnimationFrame(updateScrollEffects);
                    ticking = true;
                }
            }, { passive: true });
        }

        // Lazy loading amélioré pour mobile
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    function improveMobileAccessibility() {
        // Améliorer l'accessibilité du menu hamburger
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.setAttribute('aria-label', 'Menu de navigation');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('role', 'button');
        }

        // Améliorer l'accessibilité des cartes flottantes
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            const text = card.querySelector('span')?.textContent || `Service ${index + 1}`;
            card.setAttribute('aria-label', `En savoir plus sur ${text}`);
            
            // Ajouter la navigation au clavier
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Améliorer l'accessibilité des statistiques
        const stats = document.querySelectorAll('.agency-stat');
        stats.forEach(stat => {
            const number = stat.querySelector('.agency-stat-number')?.textContent || '';
            const label = stat.querySelector('.agency-stat-label')?.textContent || '';
            stat.setAttribute('aria-label', `${number} ${label}`);
        });

        // Améliorer les contrastes sur mobile
        if (window.innerWidth <= 768) {
            // Vérifier et améliorer les contrastes si nécessaire
            const lowContrastElements = document.querySelectorAll('.text-light, .text-muted');
            lowContrastElements.forEach(element => {
                element.style.color = '#4A5568';
            });
        }
    }

    function improveResponsiveLayout() {
        // Corriger les problèmes de débordement
        function checkOverflow() {
            const body = document.body;
            const html = document.documentElement;
            
            if (body.scrollWidth > window.innerWidth) {
                body.style.overflowX = 'hidden';
                html.style.overflowX = 'hidden';
            }
        }

        // Vérifier au chargement et au redimensionnement
        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        // Améliorer l'affichage des textes longs sur mobile
        function improveTextLayout() {
            if (window.innerWidth <= 768) {
                const longTexts = document.querySelectorAll('.hero-description-agency, .section-subtitle, .expertise-subtitle');
                longTexts.forEach(text => {
                    text.style.textAlign = 'left';
                    text.style.hyphens = 'auto';
                    text.style.wordBreak = 'break-word';
                });
            }
        }

        improveTextLayout();
        window.addEventListener('resize', improveTextLayout);

        // Améliorer l'espacement des éléments sur mobile
        function improveSpacing() {
            if (window.innerWidth <= 768) {
                const sections = document.querySelectorAll('section');
                sections.forEach(section => {
                    section.style.paddingTop = Math.max(48, parseInt(getComputedStyle(section).paddingTop)) + 'px';
                    section.style.paddingBottom = Math.max(48, parseInt(getComputedStyle(section).paddingBottom)) + 'px';
                });
            }
        }

        improveSpacing();
        window.addEventListener('resize', improveSpacing);
    }

    // Utilitaire pour détecter les appareils tactiles
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Ajouter une classe pour les appareils tactiles
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    }

    // Gérer l'orientation de l'écran sur mobile
    function handleOrientationChange() {
        if (window.innerWidth <= 768) {
            // Forcer un recalcul du layout après changement d'orientation
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        }
    }

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

})();
