/**
 * Corrections mobiles robustes pour Greenfad
 * Ce fichier corrige définitivement les problèmes d'interaction mobile
 */

(function() {
    'use strict';

    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileFixes);
    } else {
        initMobileFixes();
    }

    function initMobileFixes() {
        // Corrections de navigation mobile
        fixMobileNavigation();
        
        // Corrections des débordements
        fixOverflowIssues();
        
        // Corrections des interactions tactiles
        fixTouchInteractions();
        
        // Corrections de l'accessibilité mobile
        fixMobileAccessibility();
        
        // Corrections du redimensionnement
        fixResponsiveLayout();
        
        // Corrections des performances mobile
        fixMobilePerformance();
    }

    function fixMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const body = document.body;

        if (!hamburger || !navMenu) return;

        // Créer le hamburger s'il n'existe pas
        if (!hamburger.innerHTML.trim()) {
            hamburger.innerHTML = '<span></span><span></span><span></span>';
        }

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
            body.style.overflow = 'hidden';
            
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
            body.style.overflow = '';
        }

        // Gérer le redimensionnement de la fenêtre
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // S'assurer que le hamburger est visible sur mobile
        function ensureHamburgerVisibility() {
            if (window.innerWidth <= 768) {
                hamburger.style.display = 'flex';
                hamburger.style.flexDirection = 'column';
                hamburger.style.justifyContent = 'center';
                hamburger.style.alignItems = 'center';
                hamburger.style.width = '44px';
                hamburger.style.height = '44px';
                hamburger.style.cursor = 'pointer';
                hamburger.style.zIndex = '1001';
            } else {
                hamburger.style.display = 'none';
            }
        }

        ensureHamburgerVisibility();
        window.addEventListener('resize', ensureHamburgerVisibility);
    }

    function fixOverflowIssues() {
        // Corriger les débordements horizontaux
        function preventHorizontalOverflow() {
            const body = document.body;
            const html = document.documentElement;
            
            if (window.innerWidth <= 768) {
                body.style.overflowX = 'hidden';
                html.style.overflowX = 'hidden';
                body.style.width = '100%';
                body.style.maxWidth = '100%';
                html.style.width = '100%';
                html.style.maxWidth = '100%';
            }
        }

        preventHorizontalOverflow();
        window.addEventListener('resize', preventHorizontalOverflow);

        // Corriger les éléments qui débordent
        function fixOverflowingElements() {
            if (window.innerWidth <= 768) {
                const elements = document.querySelectorAll('*');
                elements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    if (rect.right > window.innerWidth) {
                        element.style.maxWidth = '100%';
                        element.style.boxSizing = 'border-box';
                        element.style.wordWrap = 'break-word';
                        element.style.hyphens = 'auto';
                    }
                });
            }
        }

        // Exécuter après le chargement complet
        window.addEventListener('load', fixOverflowingElements);
        window.addEventListener('resize', fixOverflowingElements);
    }

    function fixTouchInteractions() {
        // Améliorer les interactions tactiles pour les cartes flottantes
        const floatingCards = document.querySelectorAll('.floating-card');
        
        floatingCards.forEach(card => {
            // Ajouter un feedback tactile
            card.addEventListener('touchstart', function(e) {
                this.style.transform = 'scale(0.95)';
                this.style.transition = 'transform 0.1s ease';
            }, { passive: true });

            card.addEventListener('touchend', function(e) {
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
            }, { passive: true });

            card.addEventListener('touchcancel', function(e) {
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
            }, { passive: true });
        });

        // Améliorer les boutons pour le tactile
        const buttons = document.querySelectorAll('.btn, .btn-agency-primary, .btn-agency-secondary');
        
        buttons.forEach(button => {
            button.addEventListener('touchstart', function(e) {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
            }, { passive: true });

            button.addEventListener('touchend', function(e) {
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
            }, { passive: true });

            button.addEventListener('touchcancel', function(e) {
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
            }, { passive: true });
        });

        // Améliorer les statistiques pour le tactile
        const stats = document.querySelectorAll('.agency-stat');
        
        stats.forEach(stat => {
            stat.addEventListener('touchstart', function(e) {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
            }, { passive: true });

            stat.addEventListener('touchend', function(e) {
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
            }, { passive: true });

            stat.addEventListener('touchcancel', function(e) {
                this.style.transform = '';
                this.style.transition = 'transform 0.3s ease';
            }, { passive: true });
        });
    }

    function fixMobileAccessibility() {
        // Améliorer l'accessibilité du menu hamburger
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.setAttribute('aria-label', 'Menu de navigation');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('role', 'button');
            hamburger.setAttribute('tabindex', '0');
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

        // S'assurer que tous les éléments interactifs ont une taille minimale de 44px
        function ensureMinimumTouchTargets() {
            if (window.innerWidth <= 768) {
                const interactiveElements = document.querySelectorAll('a, button, .nav-link, .btn, .floating-card, .hamburger');
                interactiveElements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    if (rect.width < 44 || rect.height < 44) {
                        element.style.minWidth = '44px';
                        element.style.minHeight = '44px';
                        element.style.display = 'flex';
                        element.style.alignItems = 'center';
                        element.style.justifyContent = 'center';
                    }
                });
            }
        }

        ensureMinimumTouchTargets();
        window.addEventListener('resize', ensureMinimumTouchTargets);
    }

    function fixResponsiveLayout() {
        // Corriger l'affichage des textes longs sur mobile
        function improveTextLayout() {
            if (window.innerWidth <= 768) {
                const textElements = document.querySelectorAll('.hero-description-agency, .section-subtitle, .expertise-subtitle, .expertise-card-description');
                textElements.forEach(text => {
                    text.style.textAlign = 'center';
                    text.style.hyphens = 'auto';
                    text.style.wordWrap = 'break-word';
                    text.style.overflowWrap = 'break-word';
                    text.style.wordBreak = 'break-word';
                });

                // Corriger les titres
                const titles = document.querySelectorAll('.hero-title-agency, .section-title, .expertise-title');
                titles.forEach(title => {
                    title.style.hyphens = 'auto';
                    title.style.wordWrap = 'break-word';
                    title.style.overflowWrap = 'break-word';
                    title.style.wordBreak = 'break-word';
                    
                    // Supprimer les white-space: nowrap sur mobile
                    const spans = title.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.whiteSpace = 'normal';
                    });
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
                    section.style.paddingTop = '2rem';
                    section.style.paddingBottom = '2rem';
                });

                // Corriger l'espacement du hero
                const heroSection = document.querySelector('.hero-agency');
                if (heroSection) {
                    heroSection.style.paddingTop = '100px';
                    heroSection.style.paddingBottom = '3rem';
                }
            }
        }

        improveSpacing();
        window.addEventListener('resize', improveSpacing);

        // Corriger les grilles sur mobile
        function fixGridLayouts() {
            if (window.innerWidth <= 768) {
                // Corriger la grille des statistiques
                const statsGrid = document.querySelector('.agency-stats');
                if (statsGrid) {
                    statsGrid.style.display = 'grid';
                    statsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                    statsGrid.style.gap = '1rem';
                }

                // Corriger la grille des clients
                const clientsGrid = document.querySelector('.clients-grid');
                if (clientsGrid) {
                    clientsGrid.style.display = 'grid';
                    clientsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                    clientsGrid.style.gap = '1rem';
                }

                // Corriger la grille d'expertise
                const expertiseGrid = document.querySelector('.expertise-grid');
                if (expertiseGrid) {
                    expertiseGrid.style.display = 'grid';
                    expertiseGrid.style.gridTemplateColumns = '1fr';
                    expertiseGrid.style.gap = '2rem';
                }
            }
        }

        fixGridLayouts();
        window.addEventListener('resize', fixGridLayouts);
    }

    function fixMobilePerformance() {
        // Optimiser les animations sur mobile
        if (window.innerWidth <= 768) {
            // Réduire les animations sur les appareils moins performants
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            if (prefersReducedMotion.matches) {
                document.body.classList.add('reduced-motion');
                const style = document.createElement('style');
                style.textContent = `
                    .reduced-motion * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                `;
                document.head.appendChild(style);
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
                
                // Corriger les débordements après changement d'orientation
                const body = document.body;
                const html = document.documentElement;
                body.style.overflowX = 'hidden';
                html.style.overflowX = 'hidden';
            }, 100);
        }
    }

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    // Correction finale pour s'assurer que tout fonctionne
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (window.innerWidth <= 768) {
                // Forcer l'application des styles mobiles
                document.body.classList.add('mobile-device');
                
                // Vérifier et corriger les débordements une dernière fois
                const elements = document.querySelectorAll('*');
                elements.forEach(element => {
                    if (element.scrollWidth > window.innerWidth) {
                        element.style.maxWidth = '100%';
                        element.style.overflowX = 'hidden';
                    }
                });
            }
        }, 500);
    });

})();
