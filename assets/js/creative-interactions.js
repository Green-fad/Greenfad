/**
 * GREENFAD - CREATIVE INTERACTIONS
 * Advanced animations and micro-interactions
 */

(function() {
    'use strict';

    // ========== UTILITY FUNCTIONS ==========
    
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

    // ========== MORPHING BACKGROUND ==========
    
    function createMorphingBackground() {
        const sections = document.querySelectorAll('.hero, .section');
        
        sections.forEach(section => {
            if (section.classList.contains('hero') || section.querySelector('.section-header')) {
                const morphingBg = document.createElement('div');
                morphingBg.className = 'morphing-bg';
                morphingBg.innerHTML = `
                    <div class="blob blob-1"></div>
                    <div class="blob blob-2"></div>
                    <div class="blob blob-3"></div>
                `;
                section.style.position = 'relative';
                section.insertBefore(morphingBg, section.firstChild);
            }
        });
    }

    // ========== PARALLAX SCROLL EFFECT ==========
    
    function initParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.hero-image, .about-image');
        
        function handleParallax() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }
        
        window.addEventListener('scroll', throttle(handleParallax, 10));
    }

    // ========== 3D TILT EFFECT ==========
    
    function init3DTilt() {
        const tiltCards = document.querySelectorAll('.service-card, .testimonial-card');
        
        tiltCards.forEach(card => {
            card.classList.add('tilt-card');
            
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.setProperty('--tilt-x', `${rotateX}deg`);
                card.style.setProperty('--tilt-y', `${rotateY}deg`);
            });
            
            card.addEventListener('mouseleave', function() {
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
            });
        });
    }

    // ========== MAGNETIC BUTTON EFFECT ==========
    
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        
        buttons.forEach(button => {
            button.classList.add('btn-magnetic');
            
            button.addEventListener('mousemove', function(e) {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.3;
                const moveY = y * 0.3;
                
                button.style.setProperty('--mouse-x', `${moveX}px`);
                button.style.setProperty('--mouse-y', `${moveY}px`);
            });
            
            button.addEventListener('mouseleave', function() {
                button.style.setProperty('--mouse-x', '0');
                button.style.setProperty('--mouse-y', '0');
            });
        });
    }

    // ========== ANIMATED COUNTER WITH INTERSECTION OBSERVER ==========
    
    function initAnimatedCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted', 'counting');
                    animateCounter(entry.target);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    function animateCounter(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const target = parseInt(text.replace(/\D/g, ''));
        
        let current = 0;
        const increment = target / 60;
        const duration = 2000;
        const stepTime = duration / 60;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                let finalText = target.toString();
                if (hasPlus) finalText += '+';
                if (hasPercent) finalText += '%';
                element.textContent = finalText;
                clearInterval(timer);
                element.classList.remove('counting');
            } else {
                let displayText = Math.floor(current).toString();
                if (hasPlus) displayText += '+';
                if (hasPercent) displayText += '%';
                element.textContent = displayText;
            }
        }, stepTime);
    }

    // ========== STAGGER ANIMATION FOR CARDS ==========
    
    function initStaggerAnimation() {
        const sections = document.querySelectorAll('.services-grid, .portfolio-grid, .testimonials-grid');
        
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };
        
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('stagger-animated')) {
                    entry.target.classList.add('stagger-animated');
                    const items = entry.target.children;
                    
                    Array.from(items).forEach((item, index) => {
                        item.classList.add('stagger-item');
                        item.style.animationDelay = `${index * 0.1}s`;
                    });
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            staggerObserver.observe(section);
        });
    }

    // ========== RIPPLE EFFECT ON CLICK ==========
    
    function initRippleEffect() {
        const buttons = document.querySelectorAll('.btn, .nav-link');
        
        buttons.forEach(button => {
            button.classList.add('ripple');
        });
    }

    // ========== IMAGE LAZY LOADING WITH BLUR EFFECT ==========
    
    function initLazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add blur effect while loading
                    img.style.filter = 'blur(10px)';
                    img.style.transition = 'filter 0.5s ease';
                    
                    img.addEventListener('load', () => {
                        img.style.filter = 'blur(0)';
                    });
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ========== SMOOTH REVEAL ON SCROLL ==========
    
    function initSmoothReveal() {
        const elements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .process-step');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal', 'active');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        });
        
        elements.forEach(element => {
            element.classList.add('reveal');
            revealObserver.observe(element);
        });
    }

    // ========== GRADIENT BORDER ANIMATION ==========
    
    function addGradientBorders() {
        const cards = document.querySelectorAll('.service-card');
        
        cards.forEach(card => {
            const wrapper = document.createElement('div');
            wrapper.className = 'gradient-border';
            card.parentNode.insertBefore(wrapper, card);
            wrapper.appendChild(card);
        });
    }

    // ========== CURSOR TRAIL EFFECT (DESKTOP ONLY) ==========
    
    function initCursorTrail() {
        if (window.innerWidth < 768) return; // Skip on mobile
        
        const trail = [];
        const trailLength = 20;
        
        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.style.position = 'fixed';
            dot.style.width = '4px';
            dot.style.height = '4px';
            dot.style.background = `rgba(0, 212, 170, ${1 - i / trailLength})`;
            dot.style.borderRadius = '50%';
            dot.style.pointerEvents = 'none';
            dot.style.zIndex = '9999';
            dot.style.transition = 'all 0.1s ease';
            document.body.appendChild(dot);
            trail.push(dot);
        }
        
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateTrail() {
            let x = mouseX;
            let y = mouseY;
            
            trail.forEach((dot, index) => {
                const nextDot = trail[index + 1] || trail[0];
                
                dot.style.left = x - 2 + 'px';
                dot.style.top = y - 2 + 'px';
                
                x += (parseFloat(nextDot.style.left) - x) * 0.3;
                y += (parseFloat(nextDot.style.top) - y) * 0.3;
            });
            
            requestAnimationFrame(animateTrail);
        }
        
        animateTrail();
    }

    // ========== TEXT TYPING EFFECT ==========
    
    function initTypingEffect() {
        const typingElements = document.querySelectorAll('.hero h1, .hero-description');
        
        typingElements.forEach((element, index) => {
            const text = element.textContent;
            element.textContent = '';
            element.style.opacity = '1';
            
            let charIndex = 0;
            const typingSpeed = 30;
            const delay = index * 1000;
            
            setTimeout(() => {
                const typeInterval = setInterval(() => {
                    if (charIndex < text.length) {
                        element.textContent += text.charAt(charIndex);
                        charIndex++;
                    } else {
                        clearInterval(typeInterval);
                    }
                }, typingSpeed);
            }, delay);
        });
    }

    // ========== FLOATING ELEMENTS ==========
    
    function initFloatingElements() {
        const icons = document.querySelectorAll('.service-icon');
        
        icons.forEach((icon, index) => {
            icon.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
        });
    }

    // ========== PARTICLES BACKGROUND ==========
    
    function createParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
            particlesContainer.appendChild(particle);
        }
        
        hero.appendChild(particlesContainer);
    }

    // ========== INITIALIZE ALL EFFECTS ==========
    
    function init() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            createMorphingBackground();
            createParticles();
            initParallaxEffect();
            init3DTilt();
            initFloatingElements();
            // initTypingEffect(); // Disabled by default, can be enabled
            // initCursorTrail(); // Disabled by default, can be enabled
        }
        
        // Always enable these
        initMagneticButtons();
        initAnimatedCounters();
        initStaggerAnimation();
        initRippleEffect();
        initLazyLoadImages();
        initSmoothReveal();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
