/**
 * Greenfad Website - Main JavaScript
 * Modern, efficient, and accessible interactions
 */

// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
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

// ===== NAVIGATION =====
class Navigation {
    constructor() {
        this.header = $('.header');
        this.navbar = $('.navbar');
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
        this.handleActiveLink();
        
        // Event listeners
        window.addEventListener('scroll', throttle(() => this.handleScroll(), 10));
        window.addEventListener('resize', debounce(() => this.handleResize(), 250));
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        const shouldAddClass = scrolled > 50;
        
        if (shouldAddClass && !this.header.classList.contains('scrolled')) {
            this.header.classList.add('scrolled');
            this.header.style.background = 'rgba(255, 255, 255, 0.98)';
            this.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else if (!shouldAddClass && this.header.classList.contains('scrolled')) {
            this.header.classList.remove('scrolled');
            this.header.style.background = 'rgba(255, 255, 255, 0.95)';
            this.header.style.boxShadow = 'none';
        }
    }
    
    handleMobileMenu() {
        if (!this.hamburger) return;
        
        this.hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.toggleMobileMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.toggleMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = this.hamburger.querySelectorAll('span');
        if (this.isMenuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }
    
    handleSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = $(href);
                    if (target) {
                        const headerHeight = this.header.offsetHeight;
                        const targetPosition = target.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        // Close mobile menu after click
                        if (this.isMenuOpen) {
                            this.toggleMobileMenu();
                        }
                    }
                }
            });
        });
    }
    
    handleActiveLink() {
        const sections = $$('section[id]');
        
        const updateActiveLink = () => {
            const scrollPos = window.pageYOffset + this.header.offsetHeight + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };
        
        window.addEventListener('scroll', throttle(updateActiveLink, 100));
    }
    
    handleResize() {
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.toggleMobileMenu();
        }
    }
}

// ===== FORM HANDLING =====
class FormHandler {
    constructor() {
        this.contactForm = $('#contactForm');
        this.init();
    }
    
    init() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupFormValidation();
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!this.validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (replace with actual endpoint)
            await this.simulateFormSubmission(data);
            
            // Show success message
            this.showMessage('Merci ! Votre message a été envoyé avec succès. Nous vous recontacterons sous 24h.', 'success');
            this.contactForm.reset();
            
        } catch (error) {
            // Show error message
            this.showMessage('Une erreur s\'est produite. Veuillez réessayer ou nous contacter directement.', 'error');
            console.error('Form submission error:', error);
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Le nom est requis (minimum 2 caractères)');
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Une adresse email valide est requise');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Le message est requis (minimum 10 caractères)');
        }
        
        if (!data.consent) {
            errors.push('Vous devez accepter le traitement de vos données');
        }
        
        if (errors.length > 0) {
            this.showMessage(errors.join('<br>'), 'error');
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = $('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message--${type}`;
        messageElement.innerHTML = `
            <div class="form-message__content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
            <button class="form-message__close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Insert message
        this.contactForm.insertBefore(messageElement, this.contactForm.firstChild);
        
        // Auto-remove after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentElement) {
                    messageElement.remove();
                }
            }, 5000);
        }
        
        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    setupFormValidation() {
        const inputs = this.contactForm.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        
        // Remove previous error state
        this.clearFieldError(field);
        
        switch (field.type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    message = 'Format d\'email invalide';
                }
                break;
            case 'tel':
                if (value && !/^[\d\s\+\-\(\)]+$/.test(value)) {
                    isValid = false;
                    message = 'Format de téléphone invalide';
                }
                break;
        }
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'Ce champ est requis';
        }
        
        if (!isValid) {
            this.showFieldError(field, message);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    async simulateFormSubmission(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) { // 90% success rate
            return { success: true, message: 'Form submitted successfully' };
        } else {
            throw new Error('Network error');
        }
    }
}

// ===== ANIMATIONS =====
class AnimationController {
    constructor() {
        this.animatedElements = $$('.animate-on-scroll, .service-card, .portfolio-item, .testimonial, .step');
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.animateCounters();
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Add staggered animation for grid items
                    if (entry.target.parentElement.classList.contains('services-grid') ||
                        entry.target.parentElement.classList.contains('portfolio-grid') ||
                        entry.target.parentElement.classList.contains('testimonials-grid')) {
                        const siblings = Array.from(entry.target.parentElement.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        this.animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    animateCounters() {
        const counters = $$('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current) + (counter.textContent.includes('%') ? '%' : '+');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = counter.textContent.replace(/[0-9]+/, target);
                }
            };
            
            updateCounter();
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
}

// ===== INITIALIZATION =====
class App {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initComponents());
        } else {
            this.initComponents();
        }
    }
    
    initComponents() {
        try {
            // Initialize all components
            this.components.navigation = new Navigation();
            this.components.animations = new AnimationController();
            this.components.formHandler = new FormHandler();
            
            // Add loading complete class
            document.body.classList.add('loaded');
            
            console.log('🚀 Greenfad website initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing website:', error);
        }
    }
    
    // Public API for external interactions
    getComponent(name) {
        return this.components[name];
    }
}

// ===== START APPLICATION =====
const app = new App();

// Make app globally accessible for debugging
window.GreenfadApp = app;