/**
 * GREENFAD - PREMIUM ENHANCEMENTS
 * Advanced Interactions & Animations
 */

(function() {
    'use strict';

    // ========== UTILITY FUNCTIONS ==========
    
    /**
     * Debounce function to limit function calls
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Check if element is in viewport
     */
    function isInViewport(element, offset = 100) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= offset
        );
    }

    // ========== SCROLL REVEAL ANIMATION ==========
    
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.service-card, .about-grid, .testimonial-card, .portfolio-item, .process-step');
        
        function checkReveal() {
            revealElements.forEach((element, index) => {
                if (isInViewport(element) && !element.classList.contains('revealed')) {
                    setTimeout(() => {
                        element.style.animation = `fadeInUp 0.8s ease ${index * 0.1}s both`;
                        element.classList.add('revealed');
                    }, 100);
                }
            });
        }
        
        // Initial check
        checkReveal();
        
        // Check on scroll
        window.addEventListener('scroll', debounce(checkReveal, 100));
    }

    // ========== ANIMATED COUNTER ==========
    
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        let animated = false;
        
        function animateCounters() {
            if (animated) return;
            
            counters.forEach(counter => {
                if (isInViewport(counter)) {
                    animated = true;
                    const target = parseInt(counter.textContent.replace(/\D/g, ''));
                    const suffix = counter.textContent.replace(/[0-9]/g, '');
                    let current = 0;
                    const increment = target / 50;
                    const duration = 2000;
                    const stepTime = duration / 50;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target + suffix;
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current) + suffix;
                        }
                    }, stepTime);
                }
            });
        }
        
        window.addEventListener('scroll', debounce(animateCounters, 100));
        animateCounters();
    }

    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========== NAVBAR SCROLL EFFECT ==========
    
    function initNavbarScroll() {
        const header = document.querySelector('.header');
        let lastScroll = 0;
        
        window.addEventListener('scroll', debounce(function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide navbar on scroll down, show on scroll up
            if (currentScroll > lastScroll && currentScroll > 300) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }, 100));
    }

    // ========== ACTIVE MENU HIGHLIGHT ==========
    
    function initActiveMenu() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', debounce(function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }, 100));
    }

    // ========== FORM VALIDATION & ENHANCEMENT ==========
    
    function initFormEnhancements() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                // Add floating label effect
                if (!input.placeholder) {
                    input.placeholder = ' ';
                }
                
                // Real-time validation
                input.addEventListener('blur', function() {
                    if (this.value.trim() !== '') {
                        if (this.checkValidity()) {
                            this.classList.add('valid');
                            this.classList.remove('invalid');
                        } else {
                            this.classList.add('invalid');
                            this.classList.remove('valid');
                        }
                    }
                });
                
                // Clear validation on focus
                input.addEventListener('focus', function() {
                    this.classList.remove('invalid');
                });
            });
            
            // Form submission
            form.addEventListener('submit', function(e) {
                let isValid = true;
                
                inputs.forEach(input => {
                    if (input.hasAttribute('required') && !input.checkValidity()) {
                        isValid = false;
                        input.classList.add('invalid');
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    // Scroll to first invalid field
                    const firstInvalid = form.querySelector('.invalid');
                    if (firstInvalid) {
                        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        firstInvalid.focus();
                    }
                }
            });
        });
    }

    // ========== PARALLAX EFFECT ==========
    
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', debounce(function() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 10));
    }

    // ========== LAZY LOADING IMAGES ==========
    
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // ========== MOBILE MENU TOGGLE ==========
    
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
            
            // Close menu when clicking on a link
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }
    }

    // ========== TESTIMONIAL SLIDER ==========
    
    function initTestimonialSlider() {
        const slider = document.querySelector('.testimonials-grid');
        if (!slider) return;
        
        let isDown = false;
        let startX;
        let scrollLeft;
        
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('dragging');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('dragging');
        });
        
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('dragging');
        });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    // ========== COPY TO CLIPBOARD ==========
    
    function initCopyButtons() {
        const copyButtons = document.querySelectorAll('[data-copy]');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const text = this.dataset.copy;
                navigator.clipboard.writeText(text).then(() => {
                    // Show feedback
                    const originalText = this.textContent;
                    this.textContent = '✓ Copié!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                });
            });
        });
    }

    // ========== BACK TO TOP BUTTON ==========
    
    function initBackToTop() {
        // Create back to top button
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Retour en haut');
        document.body.appendChild(backToTop);
        
        // Show/hide button on scroll
        window.addEventListener('scroll', debounce(function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, 100));
        
        // Scroll to top on click
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== INITIALIZE ALL ==========
    
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        console.log('🚀 Initializing GREENFAD Premium Enhancements...');
        
        try {
            initScrollReveal();
            initCounters();
            initSmoothScroll();
            initNavbarScroll();
            initActiveMenu();
            initFormEnhancements();
            initParallax();
            initLazyLoading();
            initMobileMenu();
            initTestimonialSlider();
            initCopyButtons();
            initBackToTop();
            
            console.log('✅ GREENFAD Enhancements Loaded Successfully!');
        } catch (error) {
            console.error('❌ Error initializing enhancements:', error);
        }
    }
    
    // Start initialization
    init();
    
})();
