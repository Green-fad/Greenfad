/**
 * GREENFAD - MOBILE MENU HANDLER
 * Responsive navigation functionality
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function() {
        console.log('🍔 Initializing Mobile Menu...');

        // ========== ELEMENTS ==========
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const dropdownToggles = document.querySelectorAll('.nav-dropdown > .nav-link');
        const body = document.body;

        if (!hamburger || !navMenu) {
            console.warn('⚠️ Mobile menu elements not found');
            return;
        }

        // ========== TOGGLE MENU ==========
        function toggleMenu() {
            const isActive = hamburger.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        function openMenu() {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            body.classList.add('menu-open');
            hamburger.setAttribute('aria-expanded', 'true');
            
            // Prevent body scroll
            const scrollY = window.scrollY;
            body.style.position = 'fixed';
            body.style.top = `-${scrollY}px`;
            body.style.width = '100%';
            
            console.log('✅ Mobile menu opened');
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
            
            // Restore body scroll
            const scrollY = body.style.top;
            body.style.position = '';
            body.style.top = '';
            body.style.width = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
            
            // Close all dropdowns
            document.querySelectorAll('.nav-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            
            console.log('✅ Mobile menu closed');
        }

        // ========== EVENT LISTENERS ==========
        
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Don't close if it's a dropdown toggle
                if (this.parentElement.classList.contains('nav-dropdown')) {
                    e.preventDefault();
                    toggleDropdown(this.parentElement);
                } else {
                    // Close menu for regular links
                    setTimeout(() => {
                        closeMenu();
                    }, 300);
                }
            });
        });

        // Toggle dropdown in mobile
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    toggleDropdown(this.parentElement);
                }
            });
        });

        function toggleDropdown(dropdown) {
            const isActive = dropdown.classList.contains('active');
            
            // Close all other dropdowns
            document.querySelectorAll('.nav-dropdown.active').forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            if (isActive) {
                dropdown.classList.remove('active');
            } else {
                dropdown.classList.add('active');
            }
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
                hamburger.focus();
            }
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // Close menu if resizing to desktop
                if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                    closeMenu();
                }
            }, 250);
        });

        // ========== DROPDOWN HOVER FOR DESKTOP ==========
        if (window.innerWidth > 768) {
            const dropdowns = document.querySelectorAll('.nav-dropdown');
            
            dropdowns.forEach(dropdown => {
                let timeoutId;
                
                dropdown.addEventListener('mouseenter', function() {
                    clearTimeout(timeoutId);
                    this.classList.add('active');
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    timeoutId = setTimeout(() => {
                        this.classList.remove('active');
                    }, 200);
                });
            });
        }

        // ========== ACCESSIBILITY ==========
        
        // Trap focus in mobile menu when open
        const focusableElements = 'a[href], button:not([disabled]), input:not([disabled])';
        
        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                const focusables = Array.from(navMenu.querySelectorAll(focusableElements));
                const firstFocusable = focusables[0];
                const lastFocusable = focusables[focusables.length - 1];
                
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });

        // ========== TOUCH GESTURES ==========
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        navMenu.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        navMenu.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            // Swipe left to close
            if (diff > swipeThreshold && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }

        // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's just "#" or empty
                if (href === '#' || href === '') return;
                
                // Skip if it's a dropdown toggle
                if (this.parentElement.classList.contains('nav-dropdown') && 
                    window.innerWidth <= 768) {
                    return;
                }
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu
                    if (window.innerWidth <= 768) {
                        setTimeout(() => {
                            closeMenu();
                        }, 300);
                    }
                }
            });
        });

        console.log('✅ Mobile Menu Initialized Successfully!');
    });

})();
