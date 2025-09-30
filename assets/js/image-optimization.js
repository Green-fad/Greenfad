/**
 * Gestionnaire d'optimisation des images et lazy loading
 * Améliore les performances en chargeant les images à la demande
 */

class ImageOptimizer {
    constructor() {
        this.observers = new Map();
        this.loadedImages = new Set();
        this.failedImages = new Set();
        
        this.init();
    }

    init() {
        // Détecter le support WebP
        this.detectWebPSupport();
        
        // Initialiser le lazy loading
        this.setupLazyLoading();
        
        // Initialiser la galerie lightbox
        this.setupLightbox();
        
        // Optimiser les images existantes
        this.optimizeExistingImages();
        
        // Gérer le redimensionnement
        this.setupResizeHandler();
    }

    /**
     * Détecte le support WebP du navigateur
     */
    detectWebPSupport() {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            const hasWebPSupport = webP.height === 2;
            document.documentElement.classList.toggle('webp', hasWebPSupport);
            document.documentElement.classList.toggle('no-webp', !hasWebPSupport);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }

    /**
     * Configure le lazy loading avec Intersection Observer
     */
    setupLazyLoading() {
        // Options pour l'Intersection Observer
        const options = {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.1
        };

        // Observer pour les images lazy
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    imageObserver.unobserve(entry.target);
                }
            });
        }, options);

        // Observer toutes les images lazy
        const lazyImages = document.querySelectorAll('.img-lazy, img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });

        this.observers.set('images', imageObserver);
    }

    /**
     * Charge une image de manière optimisée
     */
    loadImage(img) {
        return new Promise((resolve, reject) => {
            const imageUrl = img.dataset.src || img.src;
            const highResUrl = img.dataset.srcset;
            
            // Créer une nouvelle image pour le préchargement
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                // L'image est chargée, on peut l'afficher
                this.displayImage(img, imageLoader.src);
                this.loadedImages.add(imageUrl);
                resolve(imageLoader);
            };
            
            imageLoader.onerror = () => {
                // Erreur de chargement
                this.handleImageError(img);
                this.failedImages.add(imageUrl);
                reject(new Error(`Failed to load image: ${imageUrl}`));
            };
            
            // Choisir la meilleure source selon la résolution
            const bestSource = this.getBestImageSource(img);
            imageLoader.src = bestSource;
        });
    }

    /**
     * Détermine la meilleure source d'image selon l'écran
     */
    getBestImageSource(img) {
        const dataSrc = img.dataset.src;
        const dataSrcset = img.dataset.srcset;
        
        if (!dataSrcset) {
            return dataSrc || img.src;
        }

        // Parser le srcset
        const sources = dataSrcset.split(',').map(src => {
            const [url, descriptor] = src.trim().split(' ');
            return {
                url: url.trim(),
                density: descriptor ? parseFloat(descriptor.replace('x', '')) : 1,
                width: descriptor && descriptor.includes('w') ? parseInt(descriptor.replace('w', '')) : null
            };
        });

        // Obtenir la densité de pixels de l'écran
        const devicePixelRatio = window.devicePixelRatio || 1;
        const viewportWidth = window.innerWidth;

        // Trouver la meilleure source
        let bestSource = sources[0];
        
        for (const source of sources) {
            if (source.width) {
                // Basé sur la largeur
                if (source.width >= viewportWidth * devicePixelRatio) {
                    bestSource = source;
                    break;
                }
            } else if (source.density) {
                // Basé sur la densité
                if (source.density >= devicePixelRatio) {
                    bestSource = source;
                    break;
                }
            }
        }

        return bestSource.url;
    }

    /**
     * Affiche l'image une fois chargée
     */
    displayImage(img, src) {
        // Mettre à jour la source
        if (img.tagName.toLowerCase() === 'img') {
            img.src = src;
        } else {
            img.style.backgroundImage = `url(${src})`;
        }

        // Ajouter la classe loaded avec animation
        requestAnimationFrame(() => {
            img.classList.add('loaded');
            img.classList.remove('img-lazy');
        });

        // Émettre un événement personnalisé
        const event = new CustomEvent('imageLoaded', {
            detail: { element: img, src: src }
        });
        img.dispatchEvent(event);
    }

    /**
     * Gère les erreurs de chargement d'images
     */
    handleImageError(img) {
        img.classList.add('error');
        img.classList.remove('img-lazy');
        
        // Ajouter une image de fallback si spécifiée
        const fallbackSrc = img.dataset.fallback;
        if (fallbackSrc && !this.failedImages.has(fallbackSrc)) {
            setTimeout(() => {
                img.src = fallbackSrc;
            }, 1000);
        }

        // Émettre un événement d'erreur
        const event = new CustomEvent('imageError', {
            detail: { element: img }
        });
        img.dispatchEvent(event);
    }

    /**
     * Configure le lightbox pour les galeries
     */
    setupLightbox() {
        // Créer le lightbox s'il n'existe pas
        if (!document.getElementById('lightbox')) {
            this.createLightbox();
        }

        // Écouter les clics sur les images de galerie
        document.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                e.preventDefault();
                const img = galleryItem.querySelector('img');
                if (img && img.src) {
                    this.openLightbox(img.src, img.alt);
                }
            }
        });
    }

    /**
     * Crée le HTML du lightbox
     */
    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="" id="lightbox-img">
                <button class="lightbox-close" id="lightbox-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(lightbox);

        // Écouter les événements de fermeture
        const closeBtn = lightbox.querySelector('#lightbox-close');
        closeBtn.addEventListener('click', () => this.closeLightbox());
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox();
            }
        });

        // Fermer avec Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                this.closeLightbox();
            }
        });
    }

    /**
     * Ouvre le lightbox avec une image
     */
    openLightbox(src, alt = '') {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('active');
        
        // Empêcher le scroll du body
        document.body.style.overflow = 'hidden';
    }

    /**
     * Ferme le lightbox
     */
    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        
        // Restaurer le scroll du body
        document.body.style.overflow = '';
    }

    /**
     * Optimise les images existantes
     */
    optimizeExistingImages() {
        // Ajouter des attributs d'optimisation aux images existantes
        const images = document.querySelectorAll('img:not(.img-lazy)');
        images.forEach(img => {
            // Ajouter loading="lazy" pour les navigateurs qui le supportent
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
            
            // Ajouter decoding="async" pour de meilleures performances
            img.decoding = 'async';
        });
    }

    /**
     * Gère le redimensionnement pour les images responsives
     */
    setupResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    /**
     * Gère le redimensionnement de la fenêtre
     */
    handleResize() {
        // Recharger les images si nécessaire selon le nouveau breakpoint
        const responsiveImages = document.querySelectorAll('[data-responsive="true"]');
        responsiveImages.forEach(img => {
            const newSrc = this.getBestImageSource(img);
            if (newSrc !== img.src && !this.failedImages.has(newSrc)) {
                this.loadImage(img);
            }
        });
    }

    /**
     * Précharge des images critiques
     */
    preloadCriticalImages(urls) {
        urls.forEach(url => {
            if (!this.loadedImages.has(url)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = url;
                document.head.appendChild(link);
            }
        });
    }

    /**
     * Convertit les images en WebP si supporté
     */
    convertToWebP(img) {
        if (!document.documentElement.classList.contains('webp')) {
            return false;
        }

        const src = img.dataset.src || img.src;
        if (src && !src.includes('.webp')) {
            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            
            // Vérifier si le fichier WebP existe
            fetch(webpSrc, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        img.dataset.src = webpSrc;
                        if (img.classList.contains('loaded')) {
                            this.loadImage(img);
                        }
                    }
                })
                .catch(() => {
                    // Le fichier WebP n'existe pas, garder l'original
                });
        }
    }

    /**
     * Obtient les métriques de performance des images
     */
    getPerformanceMetrics() {
        return {
            loadedImages: this.loadedImages.size,
            failedImages: this.failedImages.size,
            totalObserved: document.querySelectorAll('.img-lazy, img[data-src]').length,
            webpSupported: document.documentElement.classList.contains('webp')
        };
    }

    /**
     * Nettoie les observers (pour éviter les fuites mémoire)
     */
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.loadedImages.clear();
        this.failedImages.clear();
    }
}

/**
 * Utilitaires pour la génération d'images responsive
 */
class ResponsiveImageGenerator {
    static generateSrcSet(basePath, breakpoints = [320, 640, 768, 1024, 1280, 1920]) {
        return breakpoints.map(width => {
            const extension = basePath.split('.').pop();
            const nameWithoutExt = basePath.replace(`.${extension}`, '');
            return `${nameWithoutExt}-${width}w.${extension} ${width}w`;
        }).join(', ');
    }

    static generatePictureElement(basePath, alt = '', className = '') {
        const picture = document.createElement('picture');
        
        // Ajouter les sources WebP
        const webpSource = document.createElement('source');
        webpSource.type = 'image/webp';
        webpSource.srcset = this.generateSrcSet(basePath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
        picture.appendChild(webpSource);
        
        // Ajouter la source de fallback
        const img = document.createElement('img');
        img.src = basePath;
        img.srcset = this.generateSrcSet(basePath);
        img.alt = alt;
        img.className = className;
        img.loading = 'lazy';
        img.decoding = 'async';
        picture.appendChild(img);
        
        return picture;
    }
}

/**
 * Gestionnaire de galerie d'images
 */
class ImageGallery {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? 
            document.querySelector(container) : container;
        
        this.options = {
            itemSelector: '.gallery-item',
            lightbox: true,
            lazy: true,
            ...options
        };
        
        this.init();
    }

    init() {
        if (!this.container) return;
        
        this.setupGalleryItems();
        
        if (this.options.lightbox) {
            this.setupGalleryLightbox();
        }
    }

    setupGalleryItems() {
        const items = this.container.querySelectorAll(this.options.itemSelector);
        
        items.forEach((item, index) => {
            item.setAttribute('data-index', index);
            
            if (this.options.lazy) {
                const img = item.querySelector('img');
                if (img && !img.classList.contains('img-lazy')) {
                    img.classList.add('img-lazy');
                    if (img.src) {
                        img.dataset.src = img.src;
                        img.src = '';
                    }
                }
            }
        });
    }

    setupGalleryLightbox() {
        this.container.addEventListener('click', (e) => {
            const item = e.target.closest(this.options.itemSelector);
            if (item) {
                e.preventDefault();
                const index = parseInt(item.dataset.index);
                this.openGalleryLightbox(index);
            }
        });
    }

    openGalleryLightbox(startIndex = 0) {
        const items = Array.from(this.container.querySelectorAll(this.options.itemSelector));
        const images = items.map(item => {
            const img = item.querySelector('img');
            return {
                src: img.dataset.src || img.src,
                alt: img.alt || '',
                caption: item.dataset.caption || ''
            };
        });
        
        // Ici, vous pourriez intégrer une librairie de lightbox plus avancée
        // Pour l'instant, on utilise le lightbox simple
        if (window.imageOptimizer) {
            window.imageOptimizer.openLightbox(images[startIndex].src, images[startIndex].alt);
        }
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser l'optimiseur d'images
    window.imageOptimizer = new ImageOptimizer();
    
    // Initialiser les galeries
    const galleries = document.querySelectorAll('.image-gallery');
    galleries.forEach(gallery => {
        new ImageGallery(gallery);
    });
    
    // Précharger les images critiques (logos, hero images, etc.)
    const criticalImages = [
        '/assets/images/greenfad-logo-new.svg'
        // Ajouter d'autres images critiques ici
    ];
    
    if (window.imageOptimizer) {
        window.imageOptimizer.preloadCriticalImages(criticalImages);
    }
});

// Exposer les classes globalement
window.ImageOptimizer = ImageOptimizer;
window.ResponsiveImageGenerator = ResponsiveImageGenerator;
window.ImageGallery = ImageGallery;