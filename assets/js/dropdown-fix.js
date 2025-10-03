(function () {
    'use strict';
    document.addEventListener('DOMContentLoaded', function () {
        function isDesktop() { return window.innerWidth >= 992; }

        const navDropdowns = document.querySelectorAll('.nav-dropdown');
        if (!navDropdowns.length) return;

        navDropdowns.forEach(dd => {
            const menu = dd.querySelector('.dropdown-menu');
            if (!menu) return;

            // store original position
            if (!menu.__orig) menu.__orig = { parent: menu.parentNode, next: menu.nextSibling };

            let rafId = null;
            function positionMenu() {
                if (!isDesktop()) return;
                const rect = dd.getBoundingClientRect();
                // attach to body if not already
                if (menu.parentNode !== document.body) document.body.appendChild(menu);
                // fixed uses viewport coords
                menu.style.position = 'fixed';
                menu.style.left = Math.max(0, Math.round(rect.left)) + 'px';
                menu.style.top = Math.max(0, Math.round(rect.bottom)) + 'px';
                menu.style.minWidth = Math.max(rect.width, 250) + 'px';
                menu.style.zIndex = '9999999';
                menu.classList.add('js-dropdown-fixed');
            }

            function startPositionLoop() {
                if (rafId) cancelAnimationFrame(rafId);
                function loop() {
                    positionMenu();
                    rafId = requestAnimationFrame(loop);
                }
                loop();
                window.addEventListener('resize', positionMenu);
                window.addEventListener('scroll', positionMenu, { passive: true });
            }

            function stopPositionLoopAndRestore() {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
                window.removeEventListener('resize', positionMenu);
                window.removeEventListener('scroll', positionMenu);
                // restore DOM
                if (menu.__orig && menu.parentNode !== menu.__orig.parent) {
                    menu.__orig.parent.insertBefore(menu, menu.__orig.next);
                }
                // clear inline styles set by script
                menu.classList.remove('js-dropdown-fixed');
                menu.style.position = '';
                menu.style.left = '';
                menu.style.top = '';
                menu.style.minWidth = '';
                menu.style.zIndex = '';
            }

            dd.addEventListener('mouseenter', (e) => {
                if (!isDesktop()) return;
                positionMenu();
                startPositionLoop();
            });

            dd.addEventListener('mouseleave', (e) => {
                // small delay to allow focus events to move into menu
                setTimeout(stopPositionLoopAndRestore, 50);
            });

            // Close/restore when focus leaves both toggle and menu
            const toggle = dd.querySelector('.nav-link');
            menu.addEventListener('focusout', (ev) => {
                const related = ev.relatedTarget;
                if (!menu.contains(related) && !dd.contains(related)) {
                    stopPositionLoopAndRestore();
                }
            });

            // also restore if page is hidden/navigated
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) stopPositionLoopAndRestore();
            });
        });
    });
})();