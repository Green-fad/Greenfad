// Blog Loader - Charge et affiche dynamiquement les articles du blog
class BlogLoader {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.init();
    }

    async init() {
        await this.loadArticles();
        this.setupEventListeners();
        this.displayArticles();
    }

    async loadArticles() {
        // Articles statiques (à remplacer par un appel API ou chargement de fichiers)
        this.articles = [
            {
                id: 1,
                title: "Bienvenue sur le Blog Greenfad",
                description: "Découvrez notre nouveau blog dédié à la transformation numérique et écologique en Afrique. Articles, tutoriels et actualités sur le développement web, le SEO et les technologies vertes.",
                category: "digital",
                author: "Greenfad Team",
                date: "2025-11-10",
                image: "/assets/images/blog/blog-hero.jpg",
                slug: "bienvenue-sur-le-blog-greenfad",
                tags: ["blog", "lancement", "transformation digitale", "Afrique"],
                featured: true,
                readTime: "5 min"
            },
            {
                id: 2,
                title: "Guide SEO 2025 : Optimiser Votre Site pour le Marché Africain",
                description: "Découvrez les meilleures pratiques SEO adaptées au contexte africain. Stratégies, outils et conseils pour améliorer votre référencement naturel.",
                category: "seo",
                author: "Greenfad Team",
                date: "2025-11-09",
                image: "/assets/images/blog/seo-guide.jpg",
                slug: "guide-seo-pour-sites-africains",
                tags: ["SEO", "référencement", "Afrique", "marketing digital"],
                featured: true,
                readTime: "12 min"
            },
            {
                id: 3,
                title: "10 Tendances du Développement Web à Suivre en 2025",
                description: "Découvrez les technologies et pratiques qui façonnent l'avenir du développement web en 2025. De l'IA aux Progressive Web Apps, restez à la pointe de l'innovation.",
                category: "web",
                author: "Greenfad Team",
                date: "2025-11-08",
                image: "/assets/images/blog/web-trends-2025.jpg",
                slug: "tendances-developpement-web-2025",
                tags: ["développement web", "tendances", "technologies", "innovation"],
                featured: false,
                readTime: "15 min"
            }
        ];

        this.filteredArticles = [...this.articles];
    }

    setupEventListeners() {
        // Recherche
        const searchInput = document.getElementById('blog-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterArticles();
            });
        }

        // Filtres de catégorie
        const categoryButtons = document.querySelectorAll('.category-filter');
        categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentCategory = button.dataset.category;
                
                // Mise à jour visuelle des boutons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                this.filterArticles();
            });
        });
    }

    filterArticles() {
        this.filteredArticles = this.articles.filter(article => {
            // Filtre par catégorie
            const categoryMatch = this.currentCategory === 'all' || 
                                  article.category === this.currentCategory;

            // Filtre par recherche
            const searchMatch = this.searchQuery === '' ||
                               article.title.toLowerCase().includes(this.searchQuery) ||
                               article.description.toLowerCase().includes(this.searchQuery) ||
                               article.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));

            return categoryMatch && searchMatch;
        });

        this.displayArticles();
    }

    displayArticles() {
        const container = document.getElementById('blog-articles-container');
        if (!container) return;

        if (this.filteredArticles.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search fa-3x"></i>
                    <h3>Aucun article trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche ou de filtrage.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredArticles.map(article => this.createArticleCard(article)).join('');
    }

    createArticleCard(article) {
        const categoryLabels = {
            'seo': 'SEO',
            'web': 'Développement Web',
            'mobile': 'Mobile',
            'digital': 'Marketing Digital'
        };

        const categoryIcons = {
            'seo': 'fa-search',
            'web': 'fa-code',
            'mobile': 'fa-mobile-alt',
            'digital': 'fa-chart-line'
        };

        return `
            <article class="blog-card ${article.featured ? 'featured' : ''}">
                <div class="blog-card-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                    ${article.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> À la une</span>' : ''}
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span class="category ${article.category}">
                            <i class="fas ${categoryIcons[article.category]}"></i>
                            ${categoryLabels[article.category]}
                        </span>
                        <span class="date">
                            <i class="far fa-calendar"></i>
                            ${this.formatDate(article.date)}
                        </span>
                        <span class="read-time">
                            <i class="far fa-clock"></i>
                            ${article.readTime}
                        </span>
                    </div>
                    <h3 class="blog-card-title">
                        <a href="blog-article.html?slug=${article.slug}">${article.title}</a>
                    </h3>
                    <p class="blog-card-description">${article.description}</p>
                    <div class="blog-card-tags">
                        ${article.tags.slice(0, 3).map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                    <div class="blog-card-footer">
                        <span class="author">
                            <i class="fas fa-user"></i>
                            ${article.author}
                        </span>
                        <a href="blog-article.html?slug=${article.slug}" class="read-more">
                            Lire l'article <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', options);
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    new BlogLoader();
});
