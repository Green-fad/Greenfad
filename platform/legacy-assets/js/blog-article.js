// Blog Article Script

document.addEventListener('DOMContentLoaded', function() {
    // Initialize article
    initArticle();
    
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
});

function initArticle() {
    const articleContainer = document.getElementById('articleContainer');
    const relatedGrid = document.getElementById('relatedGrid');
    
    // Get article ID from URL
    const params = new URLSearchParams(window.location.search);
    const articleId = parseInt(params.get('id')) || 1;
    
    // Find article
    const article = blogPosts.find(post => post.id === articleId);
    
    if (article) {
        // Update page title and meta tags
        document.title = article.title + ' - Greenfad Blog';
        updateMetaTags(article);
        
        // Render article
        renderArticle(article, articleContainer);
        
        // Render related articles
        const related = blogPosts.filter(post => 
            post.id !== articleId && post.category === article.category
        ).slice(0, 3);
        
        renderRelatedArticles(related, relatedGrid);
    } else {
        articleContainer.innerHTML = '<p>Article non trouvé.</p>';
    }
}

function updateMetaTags(article) {
    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', article.title);
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', article.description);
    
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', article.image);
    
    // Update meta description
    let description = document.querySelector('meta[name="description"]');
    if (description) {
        description.setAttribute('content', article.description);
    }
}

function renderArticle(article, container) {
    const html = `
        <div class="article-header">
            <span class="article-category">${capitalizeCategory(article.category)}</span>
            <h1 class="article-title">${article.title}</h1>
            <p class="article-description">${article.description}</p>
            <div class="article-meta">
                <div class="article-meta-item">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(article.date)}
                </div>
                <div class="article-meta-item">
                    <i class="fas fa-user"></i>
                    ${article.author}
                </div>
                <div class="article-meta-item">
                    <i class="fas fa-clock"></i>
                    5 min de lecture
                </div>
            </div>
        </div>
        
        <img src="${article.image}" alt="${article.title}" class="article-image" loading="lazy">
        
        <div class="article-content">
            ${article.content}
        </div>
        
        <div class="article-tags">
            ${article.tags.map(tag => `<a href="blog.html" class="article-tag">#${tag}</a>`).join('')}
        </div>
        
        <div class="article-footer">
            <div class="article-author">
                <div class="article-author-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="article-author-info">
                    <h4>${article.author}</h4>
                    <p>Expert en développement web et solutions digitales</p>
                </div>
            </div>
            
            <div class="share-buttons">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" 
                   target="_blank" class="share-btn" title="Partager sur Facebook">
                    <i class="fab fa-facebook"></i> Facebook
                </a>
                <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}" 
                   target="_blank" class="share-btn" title="Partager sur Twitter">
                    <i class="fab fa-twitter"></i> Twitter
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" 
                   target="_blank" class="share-btn" title="Partager sur LinkedIn">
                    <i class="fab fa-linkedin"></i> LinkedIn
                </a>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderRelatedArticles(articles, container) {
    if (articles.length === 0) {
        container.innerHTML = '<p>Aucun article connexe trouvé.</p>';
        return;
    }
    
    container.innerHTML = articles.map(article => `
        <a href="blog-article.html?id=${article.id}" class="related-card">
            <div class="related-card-image">
                <img src="${article.image}" alt="${article.title}" loading="lazy">
            </div>
            <div class="related-card-content">
                <h3 class="related-card-title">${article.title}</h3>
                <p class="related-card-date">${formatDate(article.date)}</p>
            </div>
        </a>
    `).join('');
}

function capitalizeCategory(category) {
    const categories = {
        'seo': 'SEO',
        'web': 'Développement Web',
        'mobile': 'Applications Mobiles',
        'digital': 'Transformation Digitale'
    };
    return categories[category] || category;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options);
}
