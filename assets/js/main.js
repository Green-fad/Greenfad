/**
 * Greenfad Website - Modern JavaScript
 * Efficient, accessible, and performant interactions
 */

'use strict';

// ========== UTILITY FUNCTIONS ==========
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const throttle = (func, limit) => {
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
};

// ========== NAVIGATION CLASS ==========
class Navigation {
    constructor() {
        this.header = $('.header');
        this.hamburger = $('.hamburger');
        this.navMenu = $('.nav-menu');
        this.navLinks = $$('.nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleSmoothScroll();
        this.handleDropdowns();
        
        window.addEventListener('scroll', throttle(() => this.handleScroll(), 10));
        window.addEventListener('resize', debounce(() => this.handleResize(), 250));
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        
        if (scrolled > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
    
    handleMobileMenu() {
        if (!this.hamburger) return;
        
        this.hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen && window.innerWidth < 768) {
                    this.toggleMobileMenu();
                }
            });
        });
        
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.hamburger.contains(e.target) && 
                !this.navMenu.contains(e.target)) {
                this.toggleMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        const spans = this.hamburger.querySelectorAll('span');
        if (this.isMenuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            document.body.style.overflow = 'hidden';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            document.body.style.overflow = '';
        }
    }
    
    handleSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = $(href);
                    if (target) {
                        const headerHeight = this.header.offsetHeight;
                        const targetPosition = target.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    handleDropdowns() {
        const dropdowns = $$('.nav-dropdown');
        
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            
            if (link) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth < 768) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });
    }
    
    handleResize() {
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.toggleMobileMenu();
        }
    }
}

// ========== FORM HANDLING ==========
class FormHandler {
    constructor() {
        this.form = $('.contact-form');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(e);
        });
        
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    validateField(field) {
        let isValid = true;
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            this.showError(field, 'Ce champ est requis');
            isValid = false;
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, 'Veuillez entrer une adresse email valide');
                isValid = false;
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                this.showError(field, 'Veuillez entrer un numéro valide');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    showError(field, message) {
        this.clearError(field);
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#F56565';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.5rem';
        
        field.parentNode.appendChild(errorDiv);
    }
    
    clearError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.form-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    async handleSubmit(e) {
        const formData = new FormData(this.form);
        let isValid = true;
        
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) return;
        
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showSuccessMessage();
            this.form.reset();
        } catch (error) {
            this.showErrorMessage();
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }
    
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'form-message success';
        message.innerHTML = '<i class="fas fa-check-circle"></i> Merci ! Votre message a été envoyé avec succès.';
        message.style.cssText = 'background: #48BB78; color: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; text-align: center;';
        
        this.form.appendChild(message);
        setTimeout(() => message.remove(), 5000);
    }
    
    showErrorMessage() {
        const message = document.createElement('div');
        message.className = 'form-message error';
        message.innerHTML = '<i class="fas fa-exclamation-circle"></i> Une erreur est survenue. Veuillez réessayer.';
        message.style.cssText = 'background: #F56565; color: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; text-align: center;';
        
        this.form.appendChild(message);
        setTimeout(() => message.remove(), 5000);
    }
}

// ========== SCROLL ANIMATIONS ==========
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersect(entries),
                this.observerOptions
            );
            
            const animatedElements = $$('.service-card, .portfolio-item, .testimonial-card, .process-step, .value-item');
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                this.observer.observe(el);
            });
        }
    }
    
    handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ========== BACK TO TOP BUTTON ==========
class BackToTop {
    constructor() {
        this.button = $('.back-to-top');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        window.addEventListener('scroll', throttle(() => {
            if (window.pageYOffset > 300) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, 100));
        
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========== LAZY LOADING IMAGES ==========
class LazyLoader {
    constructor() {
        this.init();
    }
    
    init() {
        if ('loading' in HTMLImageElement.prototype) {
            const images = $$('img[loading="lazy"]');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        } else {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
            document.body.appendChild(script);
        }
    }
}

// ========== PERFORMANCE MONITORING ==========
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'largest-contentful-paint') {
                            console.log('LCP:', entry.renderTime || entry.loadTime);
                        }
                    }
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('Performance observer not supported');
            }
        }
        
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page Load Time:', pageLoadTime + 'ms');
        });
    }
}

// ========== THEME HANDLER (Optional) ==========
class ThemeHandler {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme(this.theme);
        
        const themeToggle = $('#theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        localStorage.setItem('theme', this.theme);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// ========== ACCESSIBILITY ENHANCEMENTS ==========
class AccessibilityEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.handleFocusVisible();
        this.handleKeyboardNavigation();
        this.enhanceARIA();
    }
    
    handleFocusVisible() {
        document.addEventListener('mousedown', () => {
            document.body.classList.add('using-mouse');
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.remove('using-mouse');
            }
        });
    }
    
    handleKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openDropdowns = $$('.nav-dropdown.active');
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }
    
    enhanceARIA() {
        const buttons = $$('button:not([aria-label])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                console.warn('Button without aria-label:', button);
            }
        });
    }
}

// ========== INITIALIZE ALL ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Navigation();
    new FormHandler();
    new ScrollAnimations();
    new BackToTop();
    new LazyLoader();
    new AccessibilityEnhancements();
    
    // Optional: Performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        new PerformanceMonitor();
    }
});

// ========== SERVICE WORKER (Optional PWA) ==========
if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.warn('Service Worker registration failed:', err));
    });
}

// ========== EXPORT FOR TESTING ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        FormHandler,
        ScrollAnimations,
        BackToTop,
        LazyLoader
    };
}
