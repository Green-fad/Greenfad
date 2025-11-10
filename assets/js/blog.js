// Blog Management Script

document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog
    initBlog();
    
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
});

function initBlog() {
    const postsGrid = document.getElementById('postsGrid');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('noResults');
    
    let currentCategory = 'all';
    let currentSearch = '';
    
    // Render initial posts
    renderPosts(blogPosts, postsGrid, noResults);
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearch = e.target.value.toLowerCase();
            filterAndRenderPosts();
        });
    }
    
    // Category filter
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update category
            currentCategory = this.dataset.category;
            filterAndRenderPosts();
        });
    });
    
    function filterAndRenderPosts() {
        let filtered = blogPosts;
        
        // Filter by category
        if (currentCategory !== 'all') {
            filtered = filtered.filter(post => post.category === currentCategory);
        }
        
        // Filter by search
        if (currentSearch) {
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(currentSearch) ||
                post.description.toLowerCase().includes(currentSearch) ||
                post.tags.some(tag => tag.toLowerCase().includes(currentSearch))
            );
        }
        
        renderPosts(filtered, postsGrid, noResults);
    }
}

function renderPosts(posts, container, noResultsElement) {
    container.innerHTML = '';
    
    if (posts.length === 0) {
        noResultsElement.style.display = 'block';
        return;
    }
    
    noResultsElement.style.display = 'none';
    
    posts.forEach(post => {
        const card = createBlogCard(post);
        container.appendChild(card);
    });
}

function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.innerHTML = `
        <div class="blog-card-image">
            <img src="${post.image}" alt="${post.title}" loading="lazy">
        </div>
        <div class="blog-card-content">
            <span class="blog-card-category">${capitalizeCategory(post.category)}</span>
            <h3 class="blog-card-title">${post.title}</h3>
            <p class="blog-card-description">${post.description}</p>
            
            <div class="blog-card-tags">
                ${post.tags.map(tag => `<span class="blog-tag">#${tag}</span>`).join('')}
            </div>
            
            <div class="blog-card-meta">
                <div class="blog-card-date">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(post.date)}
                </div>
                <div class="blog-card-author">
                    <i class="fas fa-user"></i>
                    ${post.author}
                </div>
            </div>
            
            <a href="blog-article.html?id=${post.id}" class="blog-card-link">
                Lire l'article <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
    
    return card;
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

function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simulate newsletter subscription
    alert(`Merci de votre inscription ! Un email de confirmation a été envoyé à ${email}`);
    e.target.reset();
}
