/**
 * GREENFAD - Main JavaScript 2025
 * Gestion des interactions et animations
 */

(function() {
  'use strict';

  // ========================================
  // 1. MOBILE MENU
  // ========================================
  
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fermer le menu au clic sur un lien
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Fermer le menu au clic en dehors
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // ========================================
  // 2. HEADER SCROLL EFFECT
  // ========================================
  
  const header = document.querySelector('.header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Ajouter classe scrolled
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // ========================================
  // 3. SMOOTH SCROLL
  // ========================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Ignorer les liens vides ou #
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ========================================
  // 4. SCROLL REVEAL ANIMATIONS
  // ========================================
  
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('active');
      }
    });
  };
  
  if (revealElements.length > 0) {
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
  }
  
  // ========================================
  // 5. INTERSECTION OBSERVER (Alternative moderne)
  // ========================================
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optionnel: arrêter d'observer après l'animation
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    revealElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // ========================================
  // 6. FORM VALIDATION
  // ========================================
  
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Récupérer les données du formulaire
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Validation basique
      if (!data.name || !data.email || !data.message) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
      }
      
      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showNotification('Veuillez entrer une adresse email valide', 'error');
        return;
      }
      
      // Désactiver le bouton pendant l'envoi
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';
      
      try {
        // Simuler l'envoi (à remplacer par votre endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showNotification('Message envoyé avec succès! Nous vous répondrons bientôt.', 'success');
        contactForm.reset();
      } catch (error) {
        showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
  
  // ========================================
  // 7. NOTIFICATIONS
  // ========================================
  
  function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles inline pour la notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      borderRadius: '8px',
      backgroundColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3',
      color: 'white',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: '9999',
      animation: 'slideInRight 0.3s ease-out',
      maxWidth: '400px'
    });
    
    document.body.appendChild(notification);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
  
  // Ajouter les keyframes pour les animations de notification
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // ========================================
  // 8. LAZY LOADING IMAGES
  // ========================================
  
  if ('loading' in HTMLImageElement.prototype) {
    // Le navigateur supporte le lazy loading natif
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback avec Intersection Observer
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
  }
  
  // ========================================
  // 9. COUNTER ANIMATION (pour les statistiques)
  // ========================================
  
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }
  
  // Observer pour les compteurs
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          const target = parseInt(entry.target.dataset.target);
          animateCounter(entry.target, target);
          entry.target.classList.add('counted');
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
  }
  
  // ========================================
  // 10. ACTIVE NAV LINK ON SCROLL
  // ========================================
  
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNavOnScroll() {
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  if (sections.length > 0) {
    window.addEventListener('scroll', highlightNavOnScroll);
  }
  
  // ========================================
  // 11. DROPDOWN MOBILE BEHAVIOR
  // ========================================
  
  const dropdownToggles = document.querySelectorAll('.nav-dropdown > .nav-link');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        const dropdown = toggle.nextElementSibling;
        const isOpen = dropdown.style.display === 'block';
        
        // Fermer tous les autres dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.style.display = 'none';
        });
        
        // Toggle le dropdown actuel
        dropdown.style.display = isOpen ? 'none' : 'block';
      }
    });
  });
  
  // ========================================
  // 12. PERFORMANCE MONITORING
  // ========================================
  
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          console.log('🚀 Greenfad Performance:');
          console.log(`   DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms`);
          console.log(`   Page Load Complete: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
        }
      }, 0);
    });
  }
  
  // ========================================
  // 13. ACCESSIBILITY - KEYBOARD NAVIGATION
  // ========================================
  
  // Trap focus dans le menu mobile quand il est ouvert
  if (navMenu) {
    const focusableElements = navMenu.querySelectorAll('a, button');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    navMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && navMenu.classList.contains('active')) {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
      
      // Fermer avec Escape
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }
  
  // ========================================
  // 14. INIT MESSAGE
  // ========================================
  
  console.log('%c🌿 Greenfad Website Loaded', 'color: #2D5F3F; font-size: 16px; font-weight: bold;');
  console.log('%cTransformation Digitale Durable en Afrique', 'color: #4A9D6F; font-size: 12px;');
  
})();
