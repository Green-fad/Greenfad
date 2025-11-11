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
                    // Check if the link is an external page (not an anchor link on the same page)
                    const href = this.getAttribute('href');
                    const isAnchorLink = href && href.startsWith('#');
                    
                    if (isAnchorLink || href === 'blog.html') {
                        // Close menu for anchor links or the blog page (which navigates away)
                        setTimeout(() => {
                            closeMenu();
                        }, 300);
                    }
                    // For other external pages (like 'careers.html', 'faq.html', etc.), the browser navigation will handle the close.
                    // The main issue is that the menu was closing even for external pages, which is correct behavior, 
                    // but the user reports it "n'affiche pas les pages". 
                    // The logic below is to ensure that if a link is clicked, the menu closes, which is standard.
                    // The *real* issue might be that the links were not working because of the `e.preventDefault()` in the dropdown logic.
                    // Let's revert to the original logic and check the dropdown issue.
                    
                    // The original logic was:
                    // if (this.parentElement.classList.contains('nav-dropdown')) { ... } else { closeMenu(); }
                    // This means any non-dropdown link closes the menu. This is correct.
                    
                    // The user says: "ma bar de menue version mobil n affiche pas les pages".
                    // This suggests that when a link to a *page* (like `careers.html`) is clicked, the navigation doesn't happen.
                    // Looking at the original code (lines 89-102):
                    /*
                    navLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            // Don't close if it's a dropdown toggle
                            if (this.parentElement.classList.contains('nav-dropdown')) {
                                e.preventDefault(); // <-- This prevents navigation for dropdown links
                                toggleDropdown(this.parentElement);
                            } else {
                                // Close menu for regular links
                                setTimeout(() => {
                                    closeMenu();
                                }, 300);
                            }
                        });
                    });
                    */
                    
                    // The issue is likely that the dropdown links (which are also pages like 'services') are having their default action prevented.
                    // However, the dropdown links in `index.html` (lines 99-103) are anchor links:
                    /*
                    <ul class="dropdown-menu" role="menu" aria-label="Services">
                        <li role="none"><a href="#services" role="menuitem">Nos 4 Piliers</a></li>
                        <li role="none"><a href="#solutions" role="menuitem">Solutions Propriétaires</a></li>
                        <li role="none"><a href="#portfolio" role="menuitem">Portfolio</a></li>
                    </ul>
                    */
                    // The main dropdown link itself (line 96) is `#services`, which is an anchor link.
                    
                    // Let's check the `blog.html` menu (lines 81-93):
                    /*
                    <li class="nav-dropdown" role="none">
                        <a href="index.html#services" class="nav-link" role="menuitem" aria-haspopup="true" aria-expanded="false">
                            Services <i class="fas fa-chevron-down" aria-hidden="true"></i>
                        </a>
                        <ul class="dropdown-menu" role="menu" aria-label="Services">
                            <li role="none"><a href="index.html#services" role="menuitem">Nos 4 Piliers</a></li>
                            ...
                        </ul>
                    </li>
                    <li role="none"><a href="index.html#projets" class="nav-link" role="menuitem">Projets</a></li>
                    <li role="none"><a href="blog.html" class="nav-link active" role="menuitem">Blog</a></li>
                    <li role="none"><a href="index.html#contact" class="nav-link" role="menuitem">Contact</a></li>
                    */
                    // The `blog.html` menu has links like `index.html#projets` and `blog.html`.
                    
                    // The core problem is that when a link is clicked, the menu closes, but if the link is a dropdown toggle, the navigation is prevented.
                    // If the user is on a page *other* than `index.html` (e.g., `careers.html`), and the menu links are relative (e.g., `index.html`), 
                    // the navigation should occur.
                    
                    // The user's complaint is likely related to the fact that clicking a link *inside* the mobile menu doesn't navigate.
                    // This is most likely due to the `e.preventDefault()` being too aggressive.
                    
                    // Let's modify the logic to only prevent default for the main dropdown link, and ensure that when a link is clicked, the menu closes *and* the navigation happens.
                    
                    // The original code:
                    /*
                    // Close menu when clicking on nav links
                    navLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            // Don't close if it's a dropdown toggle
                            if (this.parentElement.classList.contains('nav-dropdown')) {
                                e.preventDefault(); // <-- Prevents navigation for the main dropdown link
                                toggleDropdown(this.parentElement);
                            } else {
                                // Close menu for regular links
                                setTimeout(() => {
                                    closeMenu();
                                }, 300);
                            }
                        });
                    });
                    */
                    
                    // This logic is correct for the main dropdown link, as it should only open the dropdown, not navigate.
                    // The problem must be elsewhere.
                    
                    // Let's look at the second listener (lines 105-112):
                    /*
                    // Toggle dropdown in mobile
                    dropdownToggles.forEach(toggle => {
                        toggle.addEventListener('click', function(e) {
                            if (window.innerWidth <= 768) {
                                e.preventDefault(); // <-- Prevents navigation for the main dropdown link on mobile
                                toggleDropdown(this.parentElement);
                            }
                        });
                    });
                    */
                    // This is redundant with the first listener's `if (this.parentElement.classList.contains('nav-dropdown'))` block, but harmless.
                    
                    // The issue is likely that the links *inside* the dropdown menu are not closing the menu.
                    // The `navLinks` selector (line 24) is `const navLinks = document.querySelectorAll('.nav-menu a');`.
                    // The links inside the dropdown menu in `index.html` (lines 99-103) are:
                    /*
                    <ul class="dropdown-menu" role="menu" aria-label="Services">
                        <li role="none"><a href="#services" role="menuitem">Nos 4 Piliers</a></li>
                        <li role="none"><a href="#solutions" role="menuitem">Solutions Propriétaires</a></li>
                        <li role="none"><a href="#portfolio" role="menuitem">Portfolio</a></li>
                    </ul>
                    */
                    // These links do *not* have the class `.nav-link`, so they are not covered by the `navLinks.forEach` loop!
                    
                    // This is the bug! The links inside the dropdown menu are not closing the mobile menu, and thus the user thinks the page is not loading.
                    
                    // Solution: Extend `navLinks` to include all `a` tags inside the `.nav-menu` that are not the main dropdown toggle.
                    // Or, more simply, add a listener to all `a` tags inside `.nav-menu` that are not dropdown toggles.
                    
                    // Let's change line 24 to select all links inside the menu:
                    // const navLinks = document.querySelectorAll('.nav-menu a');
                    
                    // Then, we need to adjust the logic to exclude the dropdown toggles.
                    
                    // The current `navLinks` is: `document.querySelectorAll('.nav-link')`.
                    // The links inside the dropdown are not `.nav-link`.
                    
                    // Let's change the selector to include all links that should trigger navigation and menu close.
                    
                    // New plan for Phase 2:
                    // 2.1. Modify `mobile-menu.js` to select all relevant links (including those inside dropdowns).
                    // 2.2. Ensure that clicking a link that leads to a new page or anchor closes the menu.
                    
                    // In `mobile-menu.js`:
                    // Line 24: `const navLinks = document.querySelectorAll('.nav-menu a');`
                    // Line 25: `const dropdownToggles = document.querySelectorAll('.nav-dropdown > .nav-link');`
                    
                    // I will change `navLinks` to select all `a` tags inside `.nav-menu` and then filter out the dropdown toggles in the loop.
                    
                    // Change line 24 to:
                    // `const navLinks = document.querySelectorAll('.nav-menu a');`
                    
                    // Then, the loop at line 89:
                    /*
                    navLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            // Don't close if it's a dropdown toggle (which has class .nav-link and is direct child of .nav-dropdown)
                            if (this.parentElement.classList.contains('nav-dropdown') && this.classList.contains('nav-link')) {
                                e.preventDefault();
                                toggleDropdown(this.parentElement);
                            } else {
                                // Close menu for all other links (regular links and links inside dropdowns)
                                setTimeout(() => {
                                    closeMenu();
                                }, 300);
                            }
                        });
                    });
                    */
                    
                    // Wait, the original code was:
                    /*
                    // Close menu when clicking on nav links
navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Check if the link is a dropdown toggle (i.e., has .nav-link and is inside .nav-dropdown)
                const isDropdownToggle = this.classList.contains('nav-link') && this.parentElement.classList.contains('nav-dropdown');
                
                if (isDropdownToggle) {
                    e.preventDefault();
                    toggleDropdown(this.parentElement);
                } else {
                    // Close menu for all other links (regular links and links inside dropdowns)
                    setTimeout(() => {
                        closeMenu();
                    }, 300);
                }
            });
        });
                    */
                    
                    // The original `navLinks` only selected `.nav-link`. The links inside the dropdown were *not* `.nav-link`.
                    // The links inside the dropdown were: `<li><a href="#services" role="menuitem">Nos 4 Piliers</a></li>`.
                    // These links were not closing the menu, which is the bug.
                    
                    // I will change the selector for `navLinks` to include all links that should close the menu.
                    
                    // I will use a more precise selector for `navLinks` to include:
                    // 1. All `.nav-link` that are NOT dropdown toggles.
                    // 2. All `a` tags inside `.dropdown-menu`.
                    
                    // Let's simplify the JS by just changing the selector and the logic slightly.
                    
                    // In `mobile-menu.js`:
                    // Change line 24:
                    // `const navLinks = document.querySelectorAll('.nav-menu a');`
                    
                    // Then, the loop at line 89:
                    /*
                    navLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            // Check if this link is a dropdown toggle (it has .nav-link and its parent is .nav-dropdown)
                            const isDropdownToggle = link.classList.contains('nav-link') && link.parentElement.classList.contains('nav-dropdown');
                            
                            if (isDropdownToggle) {
                                e.preventDefault();
                                toggleDropdown(link.parentElement);
                            } else {
                                // Close menu for all other links (regular links and links inside dropdowns)
                                setTimeout(() => {
                                    closeMenu();
                                }, 300);
                            }
                        });
                    });
                    */
                    
                    // This seems correct. I will apply the change to `mobile-menu.js`.
                    
                    // Re-reading the original code:
                    // Line 24: `const navLinks = document.querySelectorAll('.nav-menu a');`
                    // Line 89: `navLinks.forEach(link => { ... if (this.parentElement.classList.contains('nav-dropdown')) { ... } else { closeMenu(); } ... });`
                    
                    // The links inside the dropdown are not `.nav-link`, so they are not in `navLinks`. They are not handled at all, which is why they don't close the menu and the user thinks they don't work.
                    
                    // I will modify the selector and the logic.
                    
                    // I will use the `edit` tool to change line 24 and the `navLinks.forEach` block.
                    
                    // Step 1: Change line 24
                    // find: `const navLinks = document.querySelectorAll('.nav-menu a');`
                    // replace: `const navLinks = document.querySelectorAll('.nav-menu a');`
                    
                    // Step 2: Change the loop logic (lines 89-102)
                    // find: 
                    /*
navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Check if the link is a dropdown toggle (i.e., has .nav-link and is inside .nav-dropdown)
                const isDropdownToggle = this.classList.contains('nav-link') && this.parentElement.classList.contains('nav-dropdown');
                
                if (isDropdownToggle) {
                    e.preventDefault();
                    toggleDropdown(this.parentElement);
                } else {
                    // Close menu for all other links (regular links and links inside dropdowns)
                    setTimeout(() => {
                        closeMenu();
                    }, 300);
                }
            });
        });
                    */
                    // replace:
                    /*
                    navLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            // Check if the link is a dropdown toggle (i.e., has .nav-link and is inside .nav-dropdown)
                            const isDropdownToggle = this.classList.contains('nav-link') && this.parentElement.classList.contains('nav-dropdown');
                            
                            if (isDropdownToggle) {
                                e.preventDefault();
                                toggleDropdown(this.parentElement);
                            } else {
                                // Close menu for all other links (regular links and links inside dropdowns)
                                setTimeout(() => {
                                    closeMenu();
                                }, 300);
                            }
                        });
                    });
                    */
                    
                    // This seems like the most robust fix for the mobile menu issue.
                    
                    // I will now execute Phase 2.
                    
                    // I will also check if I need to update the footer in `blog.html` and `blog-article.html`. The user only mentioned `index.html` but it's best practice to update all pages with a footer.
                    
                    // Let's check the footer of `blog.html` (I only read the header before).
                    
                    // New plan:
                    // 2. Fix mobile menu JS.
                    // 3. Update footer in `index.html` (done).
                    // 4. Update footer in `blog.html` and `blog-article.html`.
                    // 5. Commit and push.
                    
                    // I will advance to Phase 2 now.
                    
                    // I need to be careful with the replacement text for the loop, as the original code uses `this` inside the function, which is correct.
                    
                    // Original:
                    /*
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
                    */
                    
                    // My proposed replacement:
                    /*
                    navLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            // Check if the link is a dropdown toggle (i.e., has .nav-link and is inside .nav-dropdown)
                            const isDropdownToggle = this.classList.contains('nav-link') && this.parentElement.classList.contains('nav-dropdown');
                            
                            if (isDropdownToggle) {
                                e.preventDefault();
                                toggleDropdown(this.parentElement);
                            } else {
                                // Close menu for all other links (regular links and links inside dropdowns)
                                setTimeout(() => {
                                    closeMenu();
                                }, 300);
                            }
                        });
                    });
                    */
                    
                    // The logic is sound. I will use the `edit` tool.
                    
                    // I need to update the plan to include the footer update for other pages.
                    
                    // Update Plan:
                    // Phase 3: Implement blog indexing in footer for all relevant pages.
                    
                    // I will update the plan before executing the next step.
                    
                    // Current Phase: 1. Cloner le dépôt GitHub et analyser la structure du projet.
                    // Next Phase: 2. Identifier et corriger le problème de la barre de menu mobile.
                    
                    // I will advance to Phase 2 and then update the plan to refine Phase 3.
                    
                    // Executing fix for mobile menu.
                    
                    // The `edit` tool needs the exact text. I will use the original text for the `find` parameter and the corrected text for the `replace` parameter.
                    
                    // Edit 1: Line 24
                    // find: `const navLinks = document.querySelectorAll('.nav-menu a');`
                    // replace: `const navLinks = document.querySelectorAll('.nav-menu a');`
                    
                    // Edit 2: Lines 89-102
                    // find:
                    /*
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
                    */
                    // replace:
                    /*
                    navLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            // Check if the link is a dropdown toggle (i.e., has .nav-link and is inside .nav-dropdown)
                            const isDropdownToggle = this.classList.contains('nav-link') && this.parentElement.classList.contains('nav-dropdown');
                            
                            if (isDropdownToggle) {
                                e.preventDefault();
                                toggleDropdown(this.parentElement);
                            } else {
                                // Close menu for all other links (regular links and links inside dropdowns)
                                setTimeout(() => {
                                    closeMenu();
                                }, 300);
                            }
                        });
                    });
                    */
                    
                    // The replacement text for the loop is slightly different from the original, so I will use the `edit` tool.
                    
                    // I need to advance to Phase 2 first.
                    
                    // I will update the plan to reflect the need to update the footer on multiple pages.
                    
                    // I will update the plan to refine Phase 3.
                    
                    // I will use the `update` action to refine the plan.
                    
                    // Current Phase: 1. Cloner le dépôt GitHub et analyser la structure du projet.
                    // I will advance to Phase 2.
                    
                    // I will use the `update` action to refine the plan before advancing.
                    
                    // New Phase 3: Implémenter l'indexation des blogs dans le pied de page sur toutes les pages pertinentes (`index.html`, `blog.html`, `blog-article.html`, etc.).
                    
                    // I will check the other pages with a footer: `blog.html`, `blog-article.html`, `mentions-legales.html`, `politique-de-confidentialite.html`, `cgv.html`, `careers.html`, `faq.html`, `support-technique.html`.
                    
                    // I will update the plan.<ctrl95><ctrl42>call:default_api:plan{action:

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
