/**
 * Greenfad Modern Enhanced JavaScript
 * Performance-optimized, accessible, and modern interactions
 * Version: 2.0.0
 */

// ===== MODERN UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Enhanced debounce with immediate execution option
const debounce = (func, wait, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
};

// Enhanced throttle with trailing execution
const throttle = (func, limit, trailing = true) => {
    let inThrottle;
    let lastFunc;
    let lastRan;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            lastRan = Date.now();
            inThrottle = true;
        } else if (trailing) {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

// Intersection Observer utility
const createObserver = (callback, options = {}) => {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Performance monitoring
const performanceMonitor = {
    marks: new Map(),
    
    mark(name) {
        this.marks.set(name, performance.now());
    },
    
    measure(name, startMark) {
        const start = this.marks.get(startMark);
        const end = performance.now();
        const duration = end - start;
        console.log(`${name}: ${duration.toFixed(2)}ms`);
        return duration;
    }
};

// ===== MODERN NAVIGATION CLASS =====
class ModernNavigation {
    constructor() {
        this.header = $('.header');
        this.navbar = $('.navbar');
        this.hamburger = $('.hamburger');
        this.navMenu = $('.nav-menu');
        this.navLinks = $$('.nav-link');
        this.isMenuOpen = false;
        this.scrollThreshold = 50;
        this.lastScrollY = 0;
        this.isScrollingDown = false;
        
        this.init();
    }
    
    init() {
        performanceMonitor.mark('nav-init-start');
        
        this.setupEventListeners();
        this.handleActiveLink();
        this.setupAccessibility();
        
        performanceMonitor.measure('Navigation Init', 'nav-init-start');
    }
    
    setupEventListeners() {
        // Optimized scroll handler
        window.addEventListener('scroll', 
            throttle(() => this.handleScroll(), 16), // 60fps
            { passive: true }
        );
        
        // Resize handler
        window.addEventListener('resize', 
            debounce(() => this.handleResize(), 250)
        );
        
        // Mobile menu
        if (this.hamburger) {
            this.hamburger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }
        
        // Close menu on nav link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.toggleMobileMenu();
                }
            });
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.toggleMobileMenu();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.toggleMobileMenu();
            }
        });
    }
    
    handleScroll() {
        const currentScrollY = window.pageYOffset;
        this.isScrollingDown = currentScrollY > this.lastScrollY;
        this.lastScrollY = currentScrollY;
        
        // Header background and shadow
        const shouldAddScrolledClass = currentScrollY > this.scrollThreshold;
        
        if (shouldAddScrolledClass && !this.header.classList.contains('scrolled')) {
            this.header.classList.add('scrolled');
        } else if (!shouldAddScrolledClass && this.header.classList.contains('scrolled')) {
            this.header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (optional)
        if (currentScrollY > 200) {
            if (this.isScrollingDown && !this.isMenuOpen) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }
        } else {
            this.header.style.transform = 'translateY(0)';
        }
    }
    
    handleActiveLink() {
        const sections = $$('section[id]');
        const observer = createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.setActiveLink(id);
                }
            });
        }, { threshold: 0.3 });
        
        sections.forEach(section => observer.observe(section));
    }
    
    setActiveLink(activeId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        // Toggle classes
        this.hamburger?.classList.toggle('active');
        this.navMenu?.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Accessibility
        this.hamburger?.setAttribute('aria-expanded', this.isMenuOpen);
        this.navMenu?.setAttribute('aria-hidden', !this.isMenuOpen);
        
        // Focus management
        if (this.isMenuOpen) {
            this.navMenu?.focus();
        } else {
            this.hamburger?.focus();
        }
    }
    
    setupAccessibility() {
        // ARIA attributes
        this.hamburger?.setAttribute('aria-label', 'Toggle navigation menu');
        this.hamburger?.setAttribute('aria-expanded', 'false');
        this.navMenu?.setAttribute('role', 'navigation');
        this.navMenu?.setAttribute('aria-label', 'Main navigation');
    }
    
    handleResize() {
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.toggleMobileMenu();
        }
    }
}

// ===== MODERN ANIMATION SYSTEM =====
class AnimationManager {
    constructor() {
        this.animatedElements = new Set();
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadAnimations();
    }
    
    setupScrollAnimations() {
        const animateElements = $$('[data-animate]');
        
        const observer = createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(el => observer.observe(el));
    }
    
    animateElement(element) {
        const animationType = element.dataset.animate;
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
            element.classList.add(`animate-${animationType}`);
        }, delay);
    }
    
    setupHoverAnimations() {
        const hoverElements = $$('[data-hover]');
        
        hoverElements.forEach(element => {
            const hoverType = element.dataset.hover;
            
            element.addEventListener('mouseenter', () => {
                element.classList.add(`hover-${hoverType}`);
            });
            
            element.addEventListener('mouseleave', () => {
                element.classList.remove(`hover-${hoverType}`);
            });
        });
    }
    
    setupLoadAnimations() {
        // Animate elements on page load
        const loadElements = $$('[data-load-animate]');
        
        window.addEventListener('load', () => {
            loadElements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('animate-fade-in-up');
                }, index * 100);
            });
        });
    }
}

// ===== MODERN FORM HANDLER =====
class FormHandler {
    constructor() {
        this.forms = $$('form[data-form]');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => this.setupForm(form));
    }
    
    setupForm(form) {
        const submitButton = form.querySelector('[type="submit"]');
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', debounce(() => this.validateField(input), 300));
        });
        
        // Form submission
        form.addEventListener('submit', (e) => this.handleSubmit(e, form));
        
        // Accessibility improvements
        this.setupFormAccessibility(form);
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        let isValid = true;
        let message = '';
        
        // Required validation
        if (required && !value) {
            isValid = false;
            message = 'Ce champ est requis';
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Veuillez entrer une adresse email valide';
            }
        }
        
        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[+]?[0-9\s\-\(\)]{8,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = 'Veuillez entrer un numéro de téléphone valide';
            }
        }
        
        this.showFieldValidation(field, isValid, message);
        return isValid;
    }
    
    showFieldValidation(field, isValid, message) {
        const errorElement = field.parentNode.querySelector('.field-error');
        
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
            if (errorElement) errorElement.remove();
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
            
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'field-error';
                error.textContent = message;
                field.parentNode.appendChild(error);
            } else {
                errorElement.textContent = message;
            }
        }
    }
    
    async handleSubmit(e, form) {
        e.preventDefault();
        
        const submitButton = form.querySelector('[type="submit"]');
        const formData = new FormData(form);
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea, select');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showFormMessage(form, 'Veuillez corriger les erreurs ci-dessus', 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState(submitButton, true);
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await this.submitForm(formData);
            this.showFormMessage(form, 'Message envoyé avec succès !', 'success');
            form.reset();
        } catch (error) {
            this.showFormMessage(form, 'Une erreur est survenue. Veuillez réessayer.', 'error');
        } finally {
            this.setLoadingState(submitButton, false);
        }
    }
    
    async submitForm(formData) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                Math.random() > 0.1 ? resolve() : reject();
            }, 2000);
        });
    }
    
    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        } else {
            button.disabled = false;
            button.innerHTML = 'Envoyer le message';
        }
    }
    
    showFormMessage(form, message, type) {
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        form.appendChild(messageElement);
        
        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => messageElement.remove(), 5000);
        }
    }
    
    setupFormAccessibility(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add ARIA attributes
            input.setAttribute('aria-describedby', `${input.name}-help`);
            
            // Create help text if needed
            if (input.hasAttribute('required')) {
                input.setAttribute('aria-required', 'true');
            }
        });
    }
}

// ===== MODERN PERFORMANCE OPTIMIZER =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupPrefetching();
        this.monitorPerformance();
    }
    
    setupLazyLoading() {
        const lazyImages = $$('img[data-src], img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = createObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        }
    }
    
    setupImageOptimization() {
        const images = $$('img');
        
        images.forEach(img => {
            // Add loading attribute if not present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decode attribute for better performance
            img.setAttribute('decoding', 'async');
        });
    }
    
    setupPrefetching() {
        const importantLinks = $$('a[data-prefetch]');
        
        importantLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.prefetchPage(link.href);
            }, { once: true });
        });
    }
    
    prefetchPage(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }
    
    monitorPerformance() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            // This would integrate with web-vitals library if available
            console.log('Performance monitoring active');
        }
        
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 50) {
                        console.warn(`Long task detected: ${entry.duration}ms`);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['longtask'] });
        }
    }
}

// ===== MODERN ACCESSIBILITY MANAGER =====
class AccessibilityManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIA();
        this.setupReducedMotion();
    }
    
    setupKeyboardNavigation() {
        // Skip to main content link
        this.createSkipLink();
        
        // Keyboard navigation for interactive elements
        const interactiveElements = $$('button, a, input, textarea, select, [tabindex]');
        
        interactiveElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
                        e.preventDefault();
                        element.click();
                    }
                }
            });
        });
    }
    
    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Aller au contenu principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--greenfad-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    setupFocusManagement() {
        // Focus visible indicator
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    setupARIA() {
        // Add ARIA labels to elements that need them
        const buttons = $$('button:not([aria-label]):not([aria-labelledby])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                button.setAttribute('aria-label', 'Button');
            }
        });
        
        // Add ARIA roles where needed
        const navigation = $('nav:not([role])');
        if (navigation) {
            navigation.setAttribute('role', 'navigation');
        }
    }
    
    setupReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduced-motion');
        }
        
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        });
    }
}

// ===== MODERN THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeToggle();
        this.setupSystemThemeDetection();
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }
    
    setupThemeToggle() {
        const themeToggle = $('#theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
                this.applyTheme(newTheme);
            });
        }
    }
    
    setupSystemThemeDetection() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// ===== INITIALIZATION =====
class GreenfadApp {
    constructor() {
        this.modules = new Map();
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }
    
    initializeModules() {
        performanceMonitor.mark('app-init-start');
        
        try {
            // Initialize core modules
            this.modules.set('navigation', new ModernNavigation());
            this.modules.set('animations', new AnimationManager());
            this.modules.set('forms', new FormHandler());
            this.modules.set('performance', new PerformanceOptimizer());
            this.modules.set('accessibility', new AccessibilityManager());
            this.modules.set('theme', new ThemeManager());
            
            // Custom initialization
            this.setupCustomFeatures();
            
            performanceMonitor.measure('App Initialization', 'app-init-start');
            console.log('✅ Greenfad App initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing Greenfad App:', error);
        }
    }
    
    setupCustomFeatures() {
        // Add any custom features here
        this.setupSmoothScrolling();
        this.setupBackToTop();
        this.setupTooltips();
    }
    
    setupSmoothScrolling() {
        const smoothLinks = $$('a[href^="#"]');
        
        smoothLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = $(`#${targetId}`);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    setupBackToTop() {
        const backToTop = $('#back-to-top');
        if (!backToTop) return;
        
        const observer = createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    backToTop.style.opacity = '0';
                    backToTop.style.pointerEvents = 'none';
                } else {
                    backToTop.style.opacity = '1';
                    backToTop.style.pointerEvents = 'auto';
                }
            });
        });
        
        const heroSection = $('#home');
        if (heroSection) {
            observer.observe(heroSection);
        }
        
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    setupTooltips() {
        const tooltipElements = $$('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            element.addEventListener('mouseenter', (e) => {
                const rect = element.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - 40}px`;
                tooltip.classList.add('visible');
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
        });
    }
    
    getModule(name) {
        return this.modules.get(name);
    }
}

// ===== GLOBAL INITIALIZATION =====
window.GreenfadApp = new GreenfadApp();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GreenfadApp;
}
