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
        const navLinks = document.querySelectorAll('.nav-menu a');
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

        // ========== DROPDOWN TOGGLE ==========
        function toggleDropdown(dropdownElement) {
            const isActive = dropdownElement.classList.contains('active');
            
            // Close all other dropdowns
            document.querySelectorAll('.nav-dropdown.active').forEach(dropdown => {
                if (dropdown !== dropdownElement) {
                    dropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            if (isActive) {
                dropdownElement.classList.remove('active');
            } else {
                dropdownElement.classList.add('active');
            }
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
                // Check if this is a dropdown toggle (parent has nav-dropdown class)
                if (this.parentElement.classList.contains('nav-dropdown')) {
                    // Only prevent default on mobile
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        toggleDropdown(this.parentElement);
                    }
                } else {
                    // For regular links, close menu after a short delay
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

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                const isClickInsideMenu = navMenu.contains(e.target);
                const isClickOnHamburger = hamburger.contains(e.target);
                
                if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('active')) {
                    closeMenu();
                }
            }
        });

        // Close menu on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // Close menu if window is resized above mobile breakpoint
                if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                    closeMenu();
                }
            }, 250);
        });

        console.log('✅ Mobile menu initialized successfully');
    });
})();
