/**
 * Amélioration majeure de l'interactivité de la page d'accueil Greenfad
 * Ce fichier transforme significativement l'expérience utilisateur
 */

(function() {
    'use strict';

    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHomepageEnhancements);
    } else {
        initHomepageEnhancements();
    }

    function initHomepageEnhancements() {
        // Améliorer la navigation avec effet de défilement
        enhanceNavigation();
        
        // Améliorer les animations d'entrée
        enhanceEntryAnimations();
        
        // Améliorer les interactions des cartes flottantes
        enhanceFloatingCards();
        
        // Améliorer les statistiques avec animation de compteur
        enhanceStatistics();
        
        // Améliorer les boutons avec effets visuels
        enhanceButtons();
        
        // Améliorer les cartes d'expertise
        enhanceExpertiseCards();
        
        // Améliorer la section clients
        enhanceClientsSection();
        
        // Ajouter des effets de parallaxe subtils
        addParallaxEffects();
        
        // Améliorer l'accessibilité
        enhanceAccessibility();
        
        // Ajouter des micro-interactions
        addMicroInteractions();
    }

    function enhanceNavigation() {
        const header = document.querySelector('.header');
        const navLinks = document.querySelectorAll('.nav-link');
        let lastScrollY = window.scrollY;

        // Effet de défilement sur le header
        function handleScroll() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Masquer/afficher le header selon la direction de défilement
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        }

        window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });

        // Améliorer la navigation avec défilement fluide
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = header.offsetHeight;
                        const targetPosition = target.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Mettre à jour l'état actif
                        navLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                    }
                }
            });
        });

        // Mise à jour automatique de la navigation active
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    function enhanceEntryAnimations() {
        // Animation d'entrée pour les éléments
        const animatedElements = document.querySelectorAll('.hero-text, .hero-visual, .agency-stat, .expertise-card, .client-item');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px) scale(0.95)';
            element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            animationObserver.observe(element);
        });
    }

    function enhanceFloatingCards() {
        const floatingCards = document.querySelectorAll('.floating-card');
        
        floatingCards.forEach((card, index) => {
            // Animation de flottement personnalisée
            card.style.animationDelay = `${index * 0.5}s`;
            
            // Effet de survol amélioré
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-12px) scale(1.1) rotate(5deg)';
                this.style.zIndex = '10';
                
                // Effet de particules
                createParticleEffect(this);
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.zIndex = '';
            });
            
            // Interaction tactile améliorée
            card.addEventListener('touchstart', function(e) {
                e.preventDefault();
                this.style.transform = 'scale(0.95)';
                this.style.transition = 'transform 0.1s ease';
            }, { passive: false });
            
            card.addEventListener('touchend', function() {
                this.style.transform = '';
                this.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                
                // Simuler un clic
                setTimeout(() => {
                    this.click();
                }, 100);
            });
            
            // Action au clic
            card.addEventListener('click', function() {
                const service = this.querySelector('span').textContent;
                showServiceModal(service);
            });
        });
    }

    function enhanceStatistics() {
        const stats = document.querySelectorAll('.agency-stat-number');
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => statsObserver.observe(stat));
    }

    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const suffix = element.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 60; // Animation sur 1 seconde à 60fps
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
        
        // Effet de pulsation
        element.style.animation = 'pulse 0.6s ease-out';
    }

    function enhanceButtons() {
        const buttons = document.querySelectorAll('.btn-agency-primary, .btn-agency-secondary, .nav-cta .btn');
        
        buttons.forEach(button => {
            // Effet de ripple au clic
            button.addEventListener('click', function(e) {
                createRippleEffect(e, this);
            });
            
            // Effet magnétique
            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    function enhanceExpertiseCards() {
        const expertiseCards = document.querySelectorAll('.expertise-card');
        
        expertiseCards.forEach(card => {
            // Effet de tilt 3D
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) / (rect.width / 2);
                const deltaY = (e.clientY - centerY) / (rect.height / 2);
                
                this.style.transform = `
                    perspective(1000px) 
                    rotateY(${deltaX * 10}deg) 
                    rotateX(${-deltaY * 10}deg) 
                    translateY(-12px) 
                    scale(1.02)
                `;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
            
            // Animation de l'icône
            const icon = card.querySelector('.expertise-icon');
            if (icon) {
                card.addEventListener('mouseenter', function() {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.boxShadow = '0 8px 32px rgba(0, 212, 170, 0.3)';
                });
                
                card.addEventListener('mouseleave', function() {
                    icon.style.transform = '';
                    icon.style.boxShadow = '';
                });
            }
        });
    }

    function enhanceClientsSection() {
        const clientItems = document.querySelectorAll('.client-item');
        
        clientItems.forEach((item, index) => {
            // Animation d'entrée décalée
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
            
            // Effet de survol amélioré
            item.addEventListener('mouseenter', function() {
                const logo = this.querySelector('.client-logo');
                const label = this.querySelector('.client-label');
                
                if (logo) {
                    logo.style.transform = 'translateY(-6px) scale(1.05) rotate(2deg)';
                    logo.style.boxShadow = '0 16px 48px rgba(0, 212, 170, 0.15)';
                }
                
                if (label) {
                    label.style.color = '#00B894';
                    label.style.fontWeight = '600';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                const logo = this.querySelector('.client-logo');
                const label = this.querySelector('.client-label');
                
                if (logo) {
                    logo.style.transform = '';
                    logo.style.boxShadow = '';
                }
                
                if (label) {
                    label.style.color = '';
                    label.style.fontWeight = '';
                }
            });
            
            // Initialiser l'état
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    }

    function addParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.floating-card, .expertise-icon');
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform += ` translateY(${rate * speed}px)`;
            });
        }
        
        window.addEventListener('scroll', throttle(updateParallax, 16), { passive: true });
    }

    function enhanceAccessibility() {
        // Améliorer l'accessibilité des cartes flottantes
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            const service = card.querySelector('span')?.textContent || `Service ${index + 1}`;
            card.setAttribute('aria-label', `En savoir plus sur ${service}`);
            
            // Navigation au clavier
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            // Focus visible
            card.addEventListener('focus', function() {
                this.style.outline = '3px solid #00D4AA';
                this.style.outlineOffset = '2px';
            });
            
            card.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
        
        // Améliorer l'accessibilité des boutons
        const buttons = document.querySelectorAll('.btn-agency-primary, .btn-agency-secondary');
        buttons.forEach(button => {
            button.addEventListener('focus', function() {
                this.style.boxShadow = '0 0 0 3px rgba(0, 212, 170, 0.3)';
            });
            
            button.addEventListener('blur', function() {
                this.style.boxShadow = '';
            });
        });
    }

    function addMicroInteractions() {
        // Effet de survol sur les éléments de texte
        const textElements = document.querySelectorAll('.hero-title-agency, .section-title, .expertise-title');
        textElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.textShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                this.style.transform = 'translateY(-2px)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.textShadow = '';
                this.style.transform = '';
            });
        });
        
        // Effet de pulsation sur les badges
        const badges = document.querySelectorAll('.agency-badge, .expertise-badge');
        badges.forEach(badge => {
            badge.addEventListener('mouseenter', function() {
                this.style.animation = 'pulse 1s infinite';
            });
            
            badge.addEventListener('mouseleave', function() {
                this.style.animation = '';
            });
        });
    }

    // Fonctions utilitaires
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
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
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    function createParticleEffect(element) {
        const particles = [];
        const particleCount = 6;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #00D4AA;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const rect = element.getBoundingClientRect();
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            // Animation des particules
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let x = 0, y = 0, opacity = 1;
            
            function animateParticle() {
                x += vx * 0.02;
                y += vy * 0.02;
                opacity -= 0.02;
                
                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            }
            
            requestAnimationFrame(animateParticle);
        }
    }

    function showServiceModal(service) {
        // Créer une modal simple pour afficher les détails du service
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 3rem;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        modalContent.innerHTML = `
            <h3 style="color: #2d3748; margin-bottom: 1rem; font-size: 1.5rem;">Service: ${service}</h3>
            <p style="color: #4a5568; margin-bottom: 2rem; line-height: 1.6;">
                Découvrez notre expertise en ${service.toLowerCase()}. 
                Nous créons des solutions sur mesure qui répondent parfaitement à vos besoins.
            </p>
            <button style="
                background: linear-gradient(135deg, #00D4AA 0%, #00B894 100%);
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.3s ease;
            ">Contactez-nous</button>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Animation d'entrée
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        });
        
        // Fermer la modal
        function closeModal() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => modal.remove(), 300);
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
        
        const closeButton = modalContent.querySelector('button');
        closeButton.addEventListener('click', closeModal);
        
        // Fermer avec Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    // Ajouter les styles CSS pour les animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        .floating-card {
            will-change: transform;
        }
        
        .expertise-card {
            will-change: transform;
        }
        
        .btn-agency-primary,
        .btn-agency-secondary {
            will-change: transform;
        }
    `;
    document.head.appendChild(style);

    // Initialisation finale
    console.log('🚀 Améliorations de la page d\'accueil Greenfad chargées avec succès!');

})();
