-- GREEN FAD — Mise à jour du contenu éditorial (exécutée par la CI quand content_version change)
-- Ne touche JAMAIS à la table users ni aux fichiers média réellement téléversés (media).
DELETE FROM settings;
DELETE FROM menus;
DELETE FROM footer_sections;
DELETE FROM pages;
DELETE FROM page_versions;
DELETE FROM services;
DELETE FROM products;
DELETE FROM content_relations;
DELETE FROM media_albums;
DELETE FROM media_items;
DELETE FROM partners;
DELETE FROM faqs;
DELETE FROM countries;
DELETE FROM offices;
DELETE FROM posts;
DELETE FROM redirects;

INSERT INTO settings (key, value) VALUES ('site_name', '"GREEN FAD"');
INSERT INTO settings (key, value) VALUES ('tagline', '"Future, Authentique, Dynamique"');
INSERT INTO settings (key, value) VALUES ('contact_phone', '"+223 72 19 46 54"');
INSERT INTO settings (key, value) VALUES ('contact_email', '"contact@greenfad.tech"');
INSERT INTO settings (key, value) VALUES ('contact_address', '"Missabougou, Bamako, Mali"');
INSERT INTO settings (key, value) VALUES ('contact_hours', '"Lundi - Vendredi : 8h00 - 17h00"');
INSERT INTO settings (key, value) VALUES ('site_url', '"https://greenfad.tech"');
INSERT INTO settings (key, value) VALUES ('logo_key', '"/assets/images/greenfad-logo.svg"');
INSERT INTO settings (key, value) VALUES ('logo_footer_key', '"/assets/images/greenfad-logo-white.svg"');
INSERT INTO settings (key, value) VALUES ('og_default_image', '"/assets/images/hero-image-modern.jpg"');
INSERT INTO settings (key, value) VALUES ('socials', '{"facebook": "https://web.facebook.com/100083594433530", "youtube": "https://youtube.com/@greenfad", "tiktok": "https://www.tiktok.com/@greenfad1"}');
INSERT INTO settings (key, value) VALUES ('seo_defaults', '{"default_description": "GREEN FAD SARL — entreprise technologique africaine : conception de produits numériques propriétaires, ingénierie logicielle et transformation digitale des organisations, au Mali et à linternational."}');
INSERT INTO menus (location, items) VALUES ('header', '[{"label": "Entreprise", "url": "/p/entreprise"}, {"label": "Expertises", "url": "/expertises"}, {"label": "Produits", "url": "/produits"}, {"label": "Réalisations", "url": "/realisations"}, {"label": "Galerie", "url": "/galerie"}, {"label": "Blog", "url": "/blog"}, {"label": "Documents", "url": "/ressources"}, {"label": "Implantation", "url": "/implantation"}, {"label": "Contact", "url": "/contact"}]');
INSERT INTO menus (location, items) VALUES ('footer', '[{"label": "Entreprise", "url": "/p/entreprise"}, {"label": "Expertises", "url": "/expertises"}, {"label": "Produits", "url": "/produits"}, {"label": "Réalisations", "url": "/realisations"}, {"label": "Galerie", "url": "/galerie"}, {"label": "Blog", "url": "/blog"}, {"label": "Ressources", "url": "/ressources"}, {"label": "Carrières", "url": "/carrieres"}, {"label": "FAQ", "url": "/faq"}]');
INSERT INTO footer_sections (section_key, title, content, sort_order) VALUES ('entreprise', 'Green FAD', '{"text": "Entreprise technologique africaine d''innovation : nous concevons, développons et portons nos propres produits numériques à l''échelle internationale."}', 1);
INSERT INTO footer_sections (section_key, title, content, sort_order) VALUES ('contact', 'Contact', '{"text": "Missabougou, Bamako, Mali", "email": "contact@greenfad.tech"}', 2);
INSERT INTO footer_sections (section_key, title, content, sort_order) VALUES ('produits', 'Nos produits', '{"items": [{"label": "TILE", "url": "/produits/tile"}, {"label": "CLOUDAf", "url": "/produits/cloudaf"}, {"label": "FAD CARD", "url": "/produits/fad-card"}, {"label": "NIAFAD", "url": "/produits/niafad"}, {"label": "QRFAD", "url": "/produits/qrfad"}, {"label": "FEREFAD", "url": "/produits/ferefad"}, {"label": "SARAPAY", "url": "/produits/sarapay"}, {"label": "Carte Santé", "url": "/produits/carte-sante"}, {"label": "L''Amitié Fad", "url": "/produits/amitie-fad"}, {"label": "WARIPAY", "url": "/produits/waripay"}]}', 3);
INSERT INTO footer_sections (section_key, title, content, sort_order) VALUES ('liens', 'Informations', '{"items": [{"label": "Mentions légales", "url": "/p/mentions-legales"}, {"label": "Confidentialité", "url": "/p/confidentialite"}, {"label": "CGV", "url": "/p/cgv"}, {"label": "Ressources", "url": "/ressources"}, {"label": "Documents publics", "url": "/ressources"}]}', 4);
INSERT INTO services (slug, name, summary, content_md, icon, image_key, sort_order, status, published_at, meta_title, meta_description) VALUES ('developpement-web', 'Développement Web', 'Sites vitrines, plateformes métier et applications web performantes, conçues pour les réalités du terrain africain.', '# Développement Web

Nous concevons et développons des sites web et des plateformes métier qui allient performance, sécurité et durabilité. Chaque projet part d''un audit des besoins réels : usages, connectivité, objectifs de l''organisation.

## Notre approche

- **Analyse et cadrage** : compréhension du besoin, rédaction des spécifications
- **Conception UX/UI** : maquettes, parcours utilisateurs, identité visuelle
- **Développement** : code propre, testé, documenté
- **Mise en production** : hébergement cloud, nom de domaine, suivi
- **Accompagnement** : formation des équipes et support post-déploiement

## Technologies

Nos équipes travaillent avec les technologies web modernes : HTML5/CSS3, JavaScript, frameworks front-end, back-ends sécurisés, bases de données SQL et infrastructures cloud.

## Pourquoi Green FAD

Une équipe locale qui connaît les contraintes du terrain — connectivité variable, mobile d''abord, budget maîtrisé — sans compromis sur la qualité internationale.', 'code', '/assets/images/services/web-development.jpg', 0, 'publie', datetime('now'), 'Développement Web | GREEN FAD', 'Sites vitrines, plateformes métier et applications web performantes, conçues pour les réalités du terrain africain.');
INSERT INTO services (slug, name, summary, content_md, icon, image_key, sort_order, status, published_at, meta_title, meta_description) VALUES ('applications-mobiles', 'Applications Mobiles', 'Applications Android et iOS pensées mobile-first pour les marchés africains, du prototype au déploiement sur les stores.', '# Applications Mobiles

Le mobile est le premier écran d''accès à Internet en Afrique. Nous développons des applications natives et hybrides adaptées à cette réalité : légères, rapides, résilientes face aux connexions intermittentes.

## Ce que nous livrons

- Applications Android (Play Store) et iOS
- Applications hybrides multiplateformes
- Intégration des services mobiles locaux (paiements, USSD, SMS)
- Mode hors-ligne et synchronisation différée
- Tableaux de bord d''administration associés

## Méthodologie

Prototypage rapide, tests utilisateurs sur le terrain, itérations courtes. Chaque application est livrée avec sa documentation et la formation des équipes de l''entreprise cliente.', 'smartphone', '/assets/images/services/mobile-development.jpg', 1, 'publie', datetime('now'), 'Applications Mobiles | GREEN FAD', 'Applications Android et iOS pensées mobile-first pour les marchés africains, du prototype au déploiement sur les stores.');
INSERT INTO services (slug, name, summary, content_md, icon, image_key, sort_order, status, published_at, meta_title, meta_description) VALUES ('seo-marketing-digital', 'SEO & Marketing Digital', 'Référencement naturel, stratégie de contenu et visibilité durable : être trouvé là où vos clients vous cherchent.', '# SEO & Marketing Digital

Un site invisible ne sert à rien. Nous construisons la visibilité durable de votre organisation sur les moteurs de recherche et les réseaux sociaux, avec des méthodes mesurables.

## Nos interventions

- **Audit SEO complet** : technique, contenu, popularité
- **Optimisation technique** : vitesse, structure, données structurées
- **Stratégie de contenu** : calendrier éditorial, mots-clés, rédaction
- **SEO local** : visibilité géographique (Google Business Profile)
- **Analytics** : mesure, rapports, décisions fondées sur les données

## Une expertise documentée

Nous publions régulièrement nos analyses sur les spécificités du SEO africain (mobile-first, multilinguisme, connectivité) — voir notre espace Innovation.', 'trending-up', '/assets/images/services/seo-marketing.jpg', 2, 'publie', datetime('now'), 'SEO & Marketing Digital | GREEN FAD', 'Référencement naturel, stratégie de contenu et visibilité durable : être trouvé là où vos clients vous cherchent.');
INSERT INTO services (slug, name, summary, content_md, icon, image_key, sort_order, status, published_at, meta_title, meta_description) VALUES ('impression-communication', 'Impression & Communication', 'Identité visuelle, supports imprimés et communication multicanale : une image cohérente sur tous vos points de contact.', '# Impression & Communication

Le digital ne remplace pas le physique : il le complète. Notre studio assure la cohérence de votre marque sur tous les supports.

## Nos réalisations

- Identité visuelle complète : logo, charte graphique
- Supports print : cartes de visite, flyers, brochures, enseignes, packaging
- Communication multicanale : réseaux sociaux, campagnes
- Grand format : bâches, panneaux, signalétique

## Alliance du print et du digital

Nos supports physiques intègrent vos outils numériques : QR codes vers vos plateformes, cartes NFC, éléments connectés — comme en témoigne notre produit FAD CARD.', 'palette', '/assets/images/services/print-communication.jpg', 3, 'publie', datetime('now'), 'Impression & Communication | GREEN FAD', 'Identité visuelle, supports imprimés et communication multicanale : une image cohérente sur tous vos points de contact.');
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/fadcard.jpg', 'fadcard.jpg', 'image/jpeg', 0, NULL, NULL, 'Carte FAD CARD — carte de visite numérique NFC', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/fadcard-logo3.png', 'fadcard-logo3.png', 'image/png', 0, NULL, NULL, 'Logo FAD CARD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/qrfad.jpg', 'qrfad.jpg', 'image/jpeg', 0, NULL, NULL, 'QRFAD — menu digital par QR code', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/qrfad-logo.png', 'qrfad-logo.png', 'image/png', 0, NULL, NULL, 'Logo QRFAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/ferefad.jpg', 'ferefad.jpg', 'image/jpeg', 0, NULL, NULL, 'FEREFAD — marketplace de petites annonces', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/ferefad-logo.png', 'ferefad-logo.png', 'image/png', 0, NULL, NULL, 'Logo FEREFAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/amitiefad.jpg', 'amitiefad.jpg', 'image/jpeg', 0, NULL, NULL, 'L''Amitié Fad — assistant hôtelier digital', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/amitiefad-logo.png', 'amitiefad-logo.png', 'image/png', 0, NULL, NULL, 'Logo L''Amitié Fad', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/hero-image-modern.jpg', 'hero-image-modern.jpg', 'image/jpeg', 0, NULL, NULL, 'Équipe GREEN FAD — image institutionnelle', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/office-workers-africa.jpg', 'office-workers-africa.jpg', 'image/jpeg', 0, NULL, NULL, 'Professionnels africains au travail', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/about-team.jpg', 'about-team.jpg', 'image/jpeg', 0, NULL, NULL, 'L''équipe GREEN FAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/team/team-collaboration.jpg', 'team-collaboration.jpg', 'image/jpeg', 0, NULL, NULL, 'Collaboration au sein de l''équipe technique', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/team/team-meeting.jpg', 'team-meeting.jpg', 'image/jpeg', 0, NULL, NULL, 'Réunion de projet GREEN FAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/countries/burkina-faso.jpg', 'burkina-faso.jpg', 'image/jpeg', 0, NULL, NULL, 'Interventions GREEN FAD au Burkina Faso', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/countries/cote-ivoire.jpg', 'cote-ivoire.jpg', 'image/jpeg', 0, NULL, NULL, 'Interventions GREEN FAD en Côte d''Ivoire', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/services/web-development.jpg', 'web-development.jpg', 'image/jpeg', 0, NULL, NULL, 'Développement web', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/services/mobile-development.jpg', 'mobile-development.jpg', 'image/jpeg', 0, NULL, NULL, 'Développement d''applications mobiles', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/services/seo-marketing.jpg', 'seo-marketing.jpg', 'image/jpeg', 0, NULL, NULL, 'SEO et marketing digital', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/services/print-communication.jpg', 'print-communication.jpg', 'image/jpeg', 0, NULL, NULL, 'Impression et communication', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/services/digital-solutions.jpg', 'digital-solutions.jpg', 'image/jpeg', 0, NULL, NULL, 'Solutions digitales', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/services/innovations.jpg', 'innovations.jpg', 'image/jpeg', 0, NULL, NULL, 'Innovations et outils sur mesure', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/services/communication.jpg', 'communication.jpg', 'image/jpeg', 0, NULL, NULL, 'Communication multicanale', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/services/conseil.jpg', 'conseil.jpg', 'image/jpeg', 0, NULL, NULL, 'Conseil et accompagnement', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/afric-immo.jpg', 'afric-immo.jpg', 'image/jpeg', 0, NULL, NULL, 'Référence client : Afric-Immo', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/artifyfad.png', 'artifyfad.png', 'image/png', 0, NULL, NULL, 'Référence client : ArtifyFad', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/casa-des-delices.jpg', 'casa-des-delices.jpg', 'image/jpeg', 0, NULL, NULL, 'Référence client : Casa des Délices', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/cours-africa.jpg', 'cours-africa.jpg', 'image/jpeg', 0, NULL, NULL, 'Référence client : Cours Africa', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/efb-entreprise.jpg', 'efb-entreprise.jpg', 'image/jpeg', 0, NULL, NULL, 'Référence client : EFB Entreprise', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/emage.jpg', 'emage.jpg', 'image/jpeg', 0, NULL, NULL, 'Référence client : EMAGE', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/emmaf-consulting.jpg', 'emmaf-consulting.jpg', 'image/jpeg', 0, NULL, NULL, 'Référence client : Emmaf Consulting', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/eurodecor.png', 'eurodecor.png', 'image/png', 0, NULL, NULL, 'Référence client : Eurodecor', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/justice-mali.jpg', 'justice-mali.jpg', 'image/jpeg', 0, NULL, NULL, 'Référence client : Justice Mali', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/le-baobab-hotel.jpg', 'le-baobab-hotel.jpg', 'image/jpeg', 0, NULL, NULL, 'Référence client : Le Baobab Hôtel', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/nature-attitude.jpg', 'nature-attitude.jpg', 'image/jpeg', 0, NULL, NULL, 'Référence client : Nature Attitude', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/sky-buffet.jpg', 'sky-buffet.jpg', 'image/jpeg', 0, NULL, NULL, 'Référence client : Sky Buffet', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/greenfad1.png', 'greenfad1.png', 'image/png', 0, NULL, NULL, 'Référence client : Greenfad', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/greenfad2.png', 'greenfad2.png', 'image/png', 0, NULL, NULL, 'Référence client : Greenfad 2', '/', 'seed', datetime('now'));
-- Logos partenaires optimisés WebP 320×200 (migration 0020 — perf accueil, demande fondateur 10/11/2026)
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/afric-immo-w320.webp', 'afric-immo-w320.webp', 'image/webp', 2270, 320, 200, 'Référence client : Afric-Immo (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/artifyfad-w320.webp', 'artifyfad-w320.webp', 'image/webp', 2324, 320, 200, 'Référence client : ArtifyFad (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/casa-des-delices-w320.webp', 'casa-des-delices-w320.webp', 'image/webp', 2706, 320, 200, 'Référence client : Casa des Délices (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/cours-africa-w320.webp', 'cours-africa-w320.webp', 'image/webp', 2734, 320, 200, 'Référence client : Cours Africa (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/efb-entreprise-w320.webp', 'efb-entreprise-w320.webp', 'image/webp', 2452, 320, 200, 'Référence client : EFB Entreprise (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/emage-w320.webp', 'emage-w320.webp', 'image/webp', 2346, 320, 200, 'Référence client : EMAGE (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/emmaf-consulting-w320.webp', 'emmaf-consulting-w320.webp', 'image/webp', 2730, 320, 200, 'Référence client : Emmaf Consulting (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/eurodecor-w320.webp', 'eurodecor-w320.webp', 'image/webp', 2378, 320, 200, 'Référence client : Eurodecor (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/greenfad1-w320.webp', 'greenfad1-w320.webp', 'image/webp', 2396, 320, 200, 'Référence client : Greenfad (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/greenfad2-w320.webp', 'greenfad2-w320.webp', 'image/webp', 2726, 320, 200, 'Référence client : Greenfad 2 (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/justice-mali-w320.webp', 'justice-mali-w320.webp', 'image/webp', 2350, 320, 200, 'Référence client : Justice Mali (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/le-baobab-hotel-w320.webp', 'le-baobab-hotel-w320.webp', 'image/webp', 2822, 320, 200, 'Référence client : Le Baobab Hôtel (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/nature-attitude-w320.webp', 'nature-attitude-w320.webp', 'image/webp', 2718, 320, 200, 'Référence client : Nature Attitude (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/sky-buffet-w320.webp', 'sky-buffet-w320.webp', 'image/webp', 2702, 320, 200, 'Référence client : Sky Buffet (optimisé)', '/', 'seed', datetime('now'));
INSERT INTO media_albums (slug, name, description, category, cover_key, sort_order, status, published_at) VALUES ('produits-green-fad', 'Produits Green FAD', 'Les produits technologiques développés par nos équipes : FAD CARD, QRFAD, FEREFAD, L''Amitié Fad.', 'produits', '/assets/images/portfolio/fadcard.jpg', 1, 'publie', datetime('now'));
INSERT INTO media_albums (slug, name, description, category, cover_key, sort_order, status, published_at) VALUES ('institution-et-equipes', 'Institutionnel & équipes', 'L''entreprise, ses équipes et son environnement de travail.', 'institution', '/assets/images/about-team.jpg', 2, 'publie', datetime('now'));
INSERT INTO media_albums (slug, name, description, category, cover_key, sort_order, status, published_at) VALUES ('implantations', 'Bureaux & implantations', 'Notre présence opérationnelle dans les pays d''intervention.', 'bureaux', '/assets/images/countries/burkina-faso.jpg', 3, 'publie', datetime('now'));
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'FAD CARD — vue produit', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/fadcard.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Identité FAD CARD', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 1, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/fadcard-logo3.png';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'QRFAD en établissement', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 2, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/qrfad.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Identité QRFAD', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 3, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/qrfad-logo.png';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'FEREFAD — la marketplace', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 4, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/ferefad.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Identité FEREFAD', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 5, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/ferefad-logo.png';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'L''''Amitié Fad en hôtel', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 6, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/amitiefad.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Identité L''''Amitié Fad', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 7, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/amitiefad-logo.png';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'GREEN FAD — image institutionnelle', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'institution-et-equipes'), 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/hero-image-modern.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'L''''équipe GREEN FAD', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'institution-et-equipes'), 1, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/about-team.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Collaboration technique', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'institution-et-equipes'), 2, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/team/team-collaboration.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Réunion de projet', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'institution-et-equipes'), 3, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/team/team-meeting.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Professionnels au travail', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'institution-et-equipes'), 4, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/office-workers-africa.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Burkina Faso', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'implantations'), 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/countries/burkina-faso.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Côte d''''Ivoire', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'implantations'), 1, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/countries/cote-ivoire.jpg';
-- Plateformes 2026 : Tile & CloudAf — médias
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/tile.jpg', 'tile.jpg', 'image/jpeg', 0, NULL, NULL, 'TILE — Le Réseau du Progrès, réseau social de Green FAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/tile-logo.png', 'tile-logo.png', 'image/png', 0, NULL, NULL, 'Identité TILE', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/cloudaf.jpg', 'cloudaf.jpg', 'image/jpeg', 0, NULL, NULL, 'CLOUDAf — plateforme no-code + IA de Green FAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/cloudaf-logo.png', 'cloudaf-logo.png', 'image/png', 0, NULL, NULL, 'Identité CLOUDAf', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/niafad.jpg', 'niafad.jpg', 'image/jpeg', 0, NULL, NULL, 'NIAFAD — ERP de gestion Green FAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/sarapay.jpg', 'sarapay.jpg', 'image/jpeg', 0, NULL, NULL, 'SARAPAY — paiement mobile sécurisé Green FAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/carte-sante.jpg', 'carte-sante.jpg', 'image/jpeg', 0, NULL, NULL, 'Carte Santé — dossier médical numérique Green FAD', '/', 'seed', datetime('now'));

INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'TILE — le Réseau du Progrès', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 8, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/tile.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Identité TILE', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 9, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/tile-logo.png';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'CLOUDAf — créez, déployez, scalez', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 10, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/cloudaf.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Identité CLOUDAf', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 11, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/cloudaf-logo.png';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'NIAFAD — l''ERP de gestion', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 12, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/niafad.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'SARAPAY — paiement mobile', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 13, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/sarapay.jpg';
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Carte Santé — dossier médical', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 14, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/carte-sante.jpg';

-- ============ PRODUITS (v4 — parcours 2021→2026, données réelles des plateformes) ============
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, modules_md, use_cases_md, ux_md, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image, links_json, versions_json, external_url, related_service_id) VALUES (
  'fad-card', 'FAD CARD', 'Une plateforme, six applications métier, un seul compte',
  'FAD CARD est l''écosystème professionnel de Green FAD : un seul compte réunit six applications métier — **vCard**, **Market**, **Tickets**, **Fund**, **Vote** et **FadCard Pay**. Lancée en 2021 comme carte de visite numérique NFC, la plateforme s''est enrichie à chaque trimestre : aujourd''hui, elle couvre l''identité professionnelle, la vente, la billetterie, la collecte, le vote et l''encaissement, avec une identité partagée et des données isolées par application.

Côté identité : **153 designs premium**, un QR code et un lien public dédié, des cartes NFC physiques, la prise de rendez-vous et la gestion de contacts avec validation de numéro dans **66 pays**. Côté business : analytique temps réel (vues, partages, clics, sources), plus de **40 devises** prises en charge, et une application web progressive (PWA) installable depuis n''importe quel navigateur.',
  'Un professionnel jongle avec des outils dispersés : une carte papier qui se démode, une boutique en ligne séparée, une billetterie tiers, une cagnotte ailleurs, et des paiements réconciliés à la main. Chaque outil coûte, chaque outil fragmente les données.',
  'Un compte unique qui porte toute l''activité professionnelle : se présenter, vendre, inviter, collecter, consulter et encaisser — avec la même identité et le même tableau de bord, du Mali vers la diaspora.',
  'FAD CARD est le produit pionnier de Green FAD : née en 2021 à Bamako comme carte de visite numérique NFC/RFID, elle a grandi par mises à jour trimestrielles successives jusqu''à devenir une plateforme six-en-un exploitée par nos équipes.',
  'Services professionnels, entreprises, institutions', 'Professionnels, commerçants, organisateurs d''événements, associations, communautés, entrepreneurs',
  '["vCard : 153 designs premium, QR code et lien public dédiés", "Cartes NFC physiques, prise de rendez-vous et suivi des vues", "Market : vente de produits et services, gestion de stock, intégration WhatsApp", "Tickets : billetterie avec quotas par catégorie et QR codes uniques anti-double scan", "Fund : collectes transparentes avec objectif, progression et suivi des donateurs", "Vote : sondages et compétitions, vote secret, un vote par personne, export CSV", "FadCard Pay : encaissement centralisé, suivi des fonds, retraits et frais, comptabilité en partie double", "Analytique temps réel : vues, partages, clics et sources", "Gestion de contacts avec validation de numéro dans 66 pays et 40+ devises", "Application web progressive (PWA) installable, tableaux de bord indépendants par application"]',
  '**Six applications, un seul compte :**

- **vCard** — carte de visite numérique et rendez-vous
- **Market** — e-commerce et gestion de stock
- **Tickets** — billetterie d''événements par QR
- **Fund** — collectes et campagnes de financement
- **Vote** — sondages, compétitions et scrutins
- **FadCard Pay** — encaissement et suivi des fonds', '- Un consultant partage sa vCard et prend ses rendez-vous
- Un commerçant vend via Market et reçoit les commandes sur WhatsApp
- Un organisateur vend ses tickets et contrôle les entrées par scan
- Une association collecte des fonds avec suivi public de la progression
- Une communauté organise un vote secret avec export CSV des résultats
- Un entrepreneur encaisse tous ses paiements via FadCard Pay', 'Mobile-first, installable en PWA depuis n''importe quel navigateur. Identité partagée entre les six applications, tableaux de bord indépendants et données strictement isolées par application.',
  'Une identité toujours à jour, une image innovante à chaque échange, des économies sur les réimpressions, et surtout une base unique pour toute l''activité : plus d''outils dispersés, plus de double saisie.', 'Née du terrain africain et supportée localement par Green FAD : tarification en XOF adaptée (Starter gratuit, Pro 15 000 XOF/mois, Business 45 000 XOF/mois), cartes NFC disponibles, service client en français, 66 pays couverts pour la validation téléphonique.',
  'Écosystème professionnel', 'evolution', '/assets/images/portfolio/fadcard.jpg', 'package', 0, 'publie', datetime('now'),
  'FAD CARD — Plateforme 6-en-1 : vCard, Market, Tickets, Fund, Vote, Pay | Green FAD', 'FadCard réunit six applications métier en un seul compte : vCard NFC 153 designs, Market, Tickets, Fund, Vote et FadCard Pay. 5 ans d''évolution, mise à jour chaque trimestre.', '/assets/images/portfolio/fadcard.jpg',
  '[{"label": "Ouvrir FadCard", "url": "https://fadcard.greenfad.tech"}, {"label": "Contacter l''équipe", "url": "mailto:contact@fadcard.com"}]', '[{"version": "v1.0", "date": "Mai 2021", "note": "Lancement de la vCard numérique NFC à Bamako : partage des coordonnées par simple contact."}, {"version": "v1.5", "date": "Décembre 2021", "note": "QR code et lien public dédié pour chaque carte — page profil personnalisable."}, {"version": "v2.0", "date": "Juillet 2022", "note": "Market : vente de produits et services depuis sa carte, gestion de stock, intégration WhatsApp."}, {"version": "v2.5", "date": "Février 2023", "note": "Tickets : billetterie d''événements, quotas par catégorie, QR codes uniques anti-double scan."}, {"version": "v3.0", "date": "Octobre 2023", "note": "Fund : campagnes de collecte avec objectif, progression et suivi des donateurs."}, {"version": "v3.5", "date": "Mai 2024", "note": "Vote : sondages et compétitions, option scrutin secret, un vote par personne, export CSV."}, {"version": "v4.0", "date": "Décembre 2024", "note": "FadCard Pay : encaissement centralisé, suivi des fonds et retraits, comptabilité en partie double — la plateforme atteint six applications."}, {"version": "v4.5", "date": "Août 2025", "note": "153 designs premium disponibles et cartes NFC physiques commandables."}, {"version": "v5.0", "date": "Mars 2026", "note": "Analytique temps réel (vues, partages, clics, sources), validation de numéro dans 66 pays, 40+ devises, PWA installable."}, {"version": "v5.1", "date": "Juillet 2026", "note": "Mise à jour trimestrielle : performances, fiabilité des paiements et expérience mobile."}]', 'https://fadcard.greenfad.tech',
  (SELECT id FROM services WHERE slug = 'developpement-web'));
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, modules_md, use_cases_md, ux_md, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image, links_json, versions_json, external_url, related_service_id) VALUES (
  'qrfad', 'QRFAD', 'Votre menu numérique, accessible en un scan',
  'QRFAD numérise la restauration et l''hôtellerie africaines depuis 2021. Le client scanne un QR code et consulte le menu — sans installer d''application : catégories, plats, descriptions, prix et photos, toujours à jour depuis l''espace d''administration. La modification est **centralisée** : une fois publiée, elle est immédiatement visible sur les QR codes déjà imprimés.

QRFAD est devenu une plateforme complète : **commandes depuis le menu** (sur place, à emporter, livraison) qui arrivent directement sur le WhatsApp de l''établissement, **caisse (POS)** avec remises, taxes, paiements et suivi des dépenses, et gestion des **hôtels** : chambres avec photos, réservations, codes de confirmation, conciergerie et avis clients. Le portail public qrfad.com permet d''explorer les établissements partenaires — **9 établissements** publient déjà leur menu, au Congo Kinshasa, au Mali, au Niger et en Côte d''Ivoire.',
  'Les menus papier s''usent, coûtent cher à modifier et se désynchronisent des prix réels. Les commandes se perdent entre la salle, la cuisine et le téléphone. Et aucun outil grand public ne gère à la fois le menu, la commande, la caisse et les chambres d''hôtel.',
  'Donner à chaque restaurant — du maquis à l''hôtel international — un menu digital professionnel, une prise de commande simple et une caisse intégrée, gérables depuis un smartphone et sans formation informatique.',
  'Né en 2021 de l''observation directe du secteur de la restauration à Bamako — des établissements pleins, des cartes fatiguées, des clients équipés de smartphones — QRFAD a été conçu par Green FAD autour de la réponse la plus simple : un QR code. Il évolue par mises à jour trimestrielles depuis.',
  'Restaurants, hôtels, cafés, maquis et établissements de restauration rapide', 'Gérants d''établissements, chefs, responsables de salle, réceptionnistes d''hôtels et groupes de restauration',
  '["Menu digital par QR code, sans application à installer", "Plats, descriptions, prix et photos, organisés par catégories", "Mise à jour centralisée : visible immédiatement sur les QR codes imprimés", "Commandes depuis le menu — sur place, à emporter, livraison — reçues sur WhatsApp", "Caisse (POS) intégrée : remises, taxes, paiements et suivi des dépenses", "Gestion multi-établissements avec plusieurs rôles et identité propre (logo, couverture, contacts)", "Tables physiques et thèmes de menu personnalisables", "Module hôtels : chambres avec photos, réservations et codes de confirmation", "Conciergerie et avis clients pour les établissements hôteliers", "Portail public d''exploration avec recherche : qrfad.com"]',
  '**Trois univers dans une seule plateforme :**

- **Restauration** — menu, commandes et caisse
- **Hôtellerie** — chambres, réservations et conciergerie
- **Administration** — établissements, rôles, thèmes et identité', '- Un maquis à Bamako imprime son QR code et met à jour ses prix chaque jour depuis son téléphone
- Un restaurant reçoit les commandes à emporter directement sur WhatsApp, sans commission d''intermédiaire
- Un hôtel gère ses chambres, réservations et demandes de conciergerie au même endroit
- Un client découvre un établissement sur qrfad.com, consulte le menu et commande', 'Pensé pour le terrain : léger en données, lisible sur n''importe quel smartphone, utilisable sans formation. Le client scanne, commande, savoure — l''établissement garde le contrôle total depuis son espace d''administration.',
  'Un menu toujours exact, une image moderne, moins d''impressions, des commandes qui arrivent proprement sur WhatsApp et une caisse qui réconcilie enfin salle, cuisine et paiements.', 'La seule plateforme locale qui réunit menu, commandes WhatsApp, caisse POS et hôtellerie — développée et supportée par Green FAD depuis 2021, sans commission sur vos commandes.',
  'Restaurant & hôtel', 'evolution', '/assets/images/portfolio/qrfad.jpg', 'package', 1, 'publie', datetime('now'),
  'QRFAD — Menu digital par QR code, commandes WhatsApp, caisse et hôtellerie | Green FAD', 'QRFAD : menus numériques par QR code sans application, commandes reçues sur WhatsApp, caisse POS intégrée et gestion hôtelière. 9 établissements au Congo, Mali, Niger et Côte d''Ivoire.', '/assets/images/portfolio/qrfad.jpg',
  '[{"label": "Explorer QRFAD", "url": "https://qrfad.com"}, {"label": "WhatsApp — Admin Mali", "url": "https://wa.me/22373299900"}, {"label": "WhatsApp — Admin Congo Kinshasa", "url": "https://wa.me/243990833603"}]', '[{"version": "v1.0", "date": "Mars 2021", "note": "Lancement à Bamako : menu numérique par QR code, plats, prix et photos, sans application."}, {"version": "v1.5", "date": "Septembre 2021", "note": "Catégories de plats enrichies, QR code téléchargeable pour les tables."}, {"version": "v2.0", "date": "Juin 2022", "note": "Multi-établissements et rôles : une même équipe gère plusieurs adresses."}, {"version": "v2.5", "date": "Mars 2023", "note": "Commandes depuis le menu : sur place, à emporter ou en livraison."}, {"version": "v3.0", "date": "Novembre 2023", "note": "Intégration WhatsApp : la commande arrive directement sur le numéro de l''établissement."}, {"version": "v4.0", "date": "Septembre 2024", "note": "Module hôtels : chambres, réservations, codes de confirmation, conciergerie et avis."}, {"version": "v4.5", "date": "Juin 2025", "note": "Caisse (POS) intégrée : remises, taxes, paiements et suivi des dépenses."}, {"version": "v5.0", "date": "Mai 2026", "note": "Portail public qrfad.com : recherche et exploration des établissements — 9 menus en ligne."}, {"version": "v5.1", "date": "Août 2026", "note": "Mise à jour trimestrielle : performance mobile et fiabilité des commandes."}]', 'https://qrfad.com',
  (SELECT id FROM services WHERE slug = 'developpement-web'));
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, modules_md, use_cases_md, ux_md, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image, links_json, versions_json, external_url, related_service_id) VALUES (
  'tile', 'TILE', 'Le Réseau du Progrès — créez, partagez, connectez-vous',
  'TILE est le réseau social conçu en Afrique, pour l''Afrique, développé et exploité par Green FAD SARL depuis Bamako. Publiez des **vidéos courtes** (jusqu''à 20 Mo), des **messages vocaux** et des **stories de 24 heures**. Suivez trois flux distincts : **Réseau** (votre communauté), **Certifié** (l''information des comptes institutionnels vérifiés et des médias) et **Pour toi** (recommandations selon vos goûts).

TILE donne toute leur place aux réalités africaines : interface disponible en **français, anglais et bambara**, espaces dédiés aux **médias et organisations**, profils **Entreprises & boutiques** avec catalogue de jusqu''à 100 produits ou services et rôles d''équipe, et **Défis & récompenses** qui célèbrent les créateurs. Sans publicité tierce, sans revente de données, avec une modération active traitée par des humains. Disponible en application web (PWA), **Android** et **iOS**.',
  'Les grands réseaux sociaux ignorent les réalités locales : langues africaines absentes, médias locaux noyés, créateurs sans monétisation adaptée, boutiques informelles invisibles, et données personnelles monétisées sans transparence.',
  'Un réseau social où la communauté, les médias certifiés, les créateurs et les commerces africains avancent ensemble — en français, en anglais, en bambara — avec la confiance comme règle : comptes vérifiés, modération humaine, zéro revente de données.',
  'TILE est développé par les équipes de Green FAD SARL à Bamako. Lancé en 2026, il s''appuie sur cinq ans d''expérience produit de l''entreprise et sur son infrastructure maîtrisée de bout en bout. Il est présent au Mali, au Congo, au Burkina Faso et au Niger.',
  'Médias, réseaux sociaux et vie communautaire', 'Citoyens, créateurs, médias certifiés, entreprises et boutiques locales',
  '["Vidéos courtes jusqu''à 20 Mo, messages vocaux et stories de 24 heures", "Trois flux : Réseau (communauté), Certifié (médias vérifiés), Pour toi (recommandations)", "Flux Certifié : l''information institutionnelle et médiatique se distingue d''un coup d''œil", "Explorer & tendances : recherche, hashtags et recommandations", "Messagerie privée avec contrôle de qui peut vous écrire", "Comptes privés réels : publications réservées aux abonnés acceptés, règle vérifiée côté serveur", "Profils Entreprises & boutiques : catalogue jusqu''à 100 produits ou services, rôles d''équipe", "Défis & récompenses : thèmes créatifs, classements, récompenses exclusives", "Interface en français, anglais et bambara", "Web (PWA), Android et iOS — chiffrement HTTPS/TLS, protection anti-abus dédiée anti-abus, sauvegardes chiffrées"]',
  '**Quatre univers, un réseau :**

- **Créateurs** — vidéos, vocaux, stories et défis
- **Médias & organisations** — flux Certifié et badge vérifié
- **Entreprises & boutiques** — catalogue et vitrine locale
- **Communautés** — messagerie, groupes et comptes privés', '- Un créateur publie une story vidéo et participe au défi de la semaine
- Un média national publie dans le flux Certifié, badge visible par tous
- Une boutique de quartier présente son catalogue de 100 produits en français
- Une association tient sa communauté informée en bambara et en français', 'Conçu pour les connexions et les usages africains : léger, trilingue, mobile-first, installable en PWA ou depuis les stores. La confiance est architecturale : badge de certification, comptes privés vérifiés côté serveur, modération humaine des signalements.',
  'Un réseau qui parle vos langues, met les médias sérieux en avant, fait exister les boutiques locales et ne revend ni vos données ni votre attention à la publicité tierce.', 'Le seul réseau social trilingue français-anglais-bambara avec un flux Certifié pour les médias vérifiés, des boutiques intégrées et une règle absolue : ni publicité tierce, ni revente de données.',
  'Réseaux sociaux & médias', 'disponible', '/assets/images/portfolio/tile.jpg', 'package', 2, 'publie', datetime('now'),
  'TILE — Le Réseau du Progrès, réseau social africain | Green FAD', 'TILE : vidéos, vocaux, stories, flux Certifié pour les médias vérifiés et boutiques pour les entreprises. FR / EN / Bambara. Web, Android, iOS. Conçu en Afrique par Green FAD.', '/assets/images/portfolio/tile.jpg',
  '[{"label": "Ouvrir Tile", "url": "https://tileofficiel.com"}, {"label": "Support", "url": "mailto:support@tile-app.com"}]', '[{"version": "v1.0", "date": "Avril 2026", "note": "Lancement public du Réseau du Progrès : vidéos, vocaux, stories, trois flux et messagerie privée."}, {"version": "v1.1", "date": "Juin 2026", "note": "Applications Android et iOS — ouverture du flux Certifié aux médias et organisations vérifiées."}, {"version": "v1.2", "date": "Septembre 2026", "note": "Défis & récompenses, profils Entreprises & boutiques avec catalogue, interface trilingue FR / EN / bambara."}]', 'https://tileofficiel.com',
  (SELECT id FROM services WHERE slug = 'applications-mobiles'));
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, modules_md, use_cases_md, ux_md, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image, links_json, versions_json, external_url, related_service_id) VALUES (
  'cloudaf', 'CLOUDAf', 'Créez. Déployez. Scalez.',
  'CLOUDAf est la plateforme de Green FAD pour créer et exploiter des applications web sans se soucier de l''infrastructure. Son principe : un **double éditeur no-code + code** synchronisé en temps réel — vous construisez visuellement (Studio Builder : bibliothèque de blocs, canvas glisser-déposer, inspecteur, thèmes) ou directement en code, et vous basculez librement entre les deux modes.

L''**IA intégrée** assiste chaque étape, et l''**Agent CloudAf** va plus loin : il discute avec vous, comprend votre projet et agit via de véritables outils audités — code, builds, déploiements, ressources. Le **déploiement en un clic** s''occupe du SSL automatique, du CDN mondial et du domaine personnalisé (DNS automatique). La sécurité est native : MFA TOTP, rotation des refresh tokens, chiffrement AES-256, limitation de débit et journaux d''audit. Le **CloudAf Store** permet d''acheter des templates en crédits ou de vendre vos propres projets, et le **monitoring** surveille services et métriques en temps réel avec alertes automatiques. Offres : Free (0 €), Pro (29 €/mois), Enterprise (99 €/mois).',
  'Lancer une application demande aujourd''hui de maîtriser l''hébergement, les certificats, le CDN, les sauvegardes, la sécurité et les déploiements — ou de payer une équipe pour ça. Les builders no-code classiques, eux, plafonnent dès qu''on veut du vrai code.',
  'Une plateforme où l''on commence par décrire son idée ou par choisir un template, où l''on crée en no-code ou en code avec l''IA à ses côtés, et où le passage du projet au produit en ligne tient en un clic — sécurisé, monitoré, évolutif.',
  'CLOUDAf est développé par les équipes d''ingénierie de Green FAD et capitalise sur l''expérience d''exploitation de ses propres plateformes (QRFAD, FadCard, Tile). Lancée en 2026, elle s''adresse aux développeurs, entrepreneurs, profils no-code et entreprises.',
  'Développement d''applications, cloud et intelligence artificielle', 'Développeurs, entrepreneurs, profils no-code, entreprises et agences',
  '["Double éditeur no-code + code synchronisé en temps réel", "Agent CloudAf : l''IA qui comprend le projet et agit via des outils audités (code, builds, déploiements, ressources)", "Studio Builder : bibliothèque de blocs, canvas glisser-déposer, inspecteur, thèmes", "IA intégrée à chaque étape de la création", "Déploiement en un clic : SSL automatique, CDN mondial, domaine personnalisé avec DNS automatique", "Sécurité native : MFA TOTP, rotation des refresh tokens, AES-256, rate limiting, journaux d''audit", "CloudAf Store : templates payants en crédits, vente de vos propres projets", "Templates prêts : SaaS Starter, e-commerce, blog, portfolio, dashboard, landing", "Monitoring temps réel : métriques, santé des services, alertes automatiques", "Connexion de votre domaine en quelques minutes"]',
  '**Le parcours CloudAf en quatre temps :**

1. **Inspirez** — décrivez votre projet à l''IA ou choisissez un template du Store
2. **Créez** — éditez en code ou en no-code, avec l''assistance IA
3. **Déployez** — un clic : SSL, CDN, domaine
4. **Scalez** — monitoring temps réel, auto-scaling, alertes', '- Un entrepreneur part d''un template SaaS Starter et lance son MVP en quelques jours
- Une agence crée des sites clients en no-code puis ajuste le code là où il le faut
- Une équipe vend ses propres templates sur le CloudAf Store contre des crédits
- Une PME connecte son domaine, déploie et suit la santé de son service en temps réel', 'Un atelier en français : construisez dans le Studio Builder, affinez dans l''éditeur de code, laissez l''agent IA porter les tâches répétitives.',
  'Lancer plus vite, sans équipe d''infrastructure : SSL, CDN, domaine, sauvegardes et monitoring inclus dès le départ. On démarre gratuit, on paie quand le projet grandit.', 'L''éditeur dual supprime le mur classique entre no-code et développement : on démarre visuellement, on descend au code quand on le veut. L''agent IA agit sur de vrais outils audités, pas sur des promesses. Et trois offres transparentes suivent la croissance : Free, Pro 29 €/mois, Enterprise 99 €/mois.',
  'No-code & IA', 'disponible', '/assets/images/portfolio/cloudaf.jpg', 'package', 3, 'publie', datetime('now'),
  'CLOUDAf — Plateforme no-code + IA : créez, déployez, scalez | Green FAD', 'CloudAf : double éditeur no-code + code, Agent IA audité, Studio Builder, déploiement en un clic (SSL, CDN, domaine), sécurité native et Store. Offres Free, Pro 29 €, Enterprise 99 €.', '/assets/images/portfolio/cloudaf.jpg',
  '[{"label": "Ouvrir CloudAf", "url": "https://cloudaf.net"}]', '[{"version": "v1.0", "date": "Juin 2026", "note": "Lancement : double éditeur no-code + code, IA intégrée, déploiement en un clic avec SSL et CDN."}, {"version": "v1.1", "date": "Août 2026", "note": "Agent CloudAf (outils audités : code, builds, déploiements) et Studio Builder complet (blocs, canvas, inspecteur, thèmes)."}, {"version": "v1.2", "date": "Octobre 2026", "note": "CloudAf Store (templates en crédits, revente de projets) et monitoring temps réel avec alertes."}]', 'https://cloudaf.net',
  (SELECT id FROM services WHERE slug = 'developpement-web'));
-- Produits historiques (contenu v3 conservé, couvertures v4)
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, modules_md, use_cases_md, ux_md, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image, links_json, versions_json, external_url, related_service_id) VALUES (
  'ferefad', 'FEREFAD', 'La marketplace de Green FAD — la plateforme de petites annonces pour l''Afrique',
  'FEREFAD est une plateforme inspirée par Oumar Ballo pour autonomiser la jeunesse africaine via le commerce numérique, soutenue par Green FAD pour encourager la croissance économique à travers une marketplace inclusive et transparente.',
  'Sur de nombreux marchés africains, le commerce en ligne formel reste peu accessible : les vendeurs manquent de canaux structurés et les acheteurs manquent de confiance dans les transactions à distance.',
  'Créer une place de marché inclusive et transparente qui connecte acheteurs et vendeurs et soutient la croissance économique, portée par la jeunesse africaine.',
  'FEREFAD est un projet porté avec Oumar Ballo et soutenu par GREEN FAD, qui en assure la conception technique, le développement et l''exploitation.',
  'E-commerce, commerce', 'Jeunes entrepreneurs, commerçants, particuliers vendeurs et acheteurs',
  '["Publication d''annonces simple et guidée", "Recherche et filtres par catégorie et localisation", "Messagerie interne entre acheteurs et vendeurs", "Profils vendeurs pour renforcer la confiance", "Optimisé pour le mobile et les connexions à faible débit"]',
  '', '', '',
  'Un canal de vente formel et accessible, une visibilité élargie pour les vendeurs, un choix structuré pour les acheteurs.', 'Une marketplace pensée depuis l''Afrique pour les usages africains, soutenue par une entreprise technologique locale de confiance.',
  'E-commerce', 'disponible', '/assets/images/portfolio/ferefad.jpg', 'package', 4, 'publie', datetime('now'),
  'FEREFAD — Produit technologique Green FAD', 'La marketplace de Green FAD — la plateforme de petites annonces pour l''Afrique', '/assets/images/portfolio/ferefad.jpg',
  '[]', '[]', '',
  (SELECT id FROM services WHERE slug = ''));
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, modules_md, use_cases_md, ux_md, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image, links_json, versions_json, external_url, related_service_id) VALUES (
  'amitie-fad', 'L''Amitié Fad', 'Votre assistant hôtelier digital — le confort connecté',
  'L''Amitié Fad est une solution qui simplifie la communication en hôtel. Grâce à un QR code, les clients peuvent demander des services (ménage, taxi, etc.) directement depuis leur smartphone.',
  'Dans les hôtels, les demandes de services passent encore par des appels à la réception ou des déplacements : c''est lent, source d''erreurs et frustrant pour le client comme pour le personnel.',
  'Connecter chaque chambre à chaque service de l''hôtel : le client scanne, demande, et le personnel reçoit — une hospitalité plus fluide et plus moderne.',
  'Conçu et développé par GREEN FAD à partir des besoins exprimés par les acteurs de l''hôtellerie malienne, L''Amitié Fad est déployé comme service connecté clé en main.',
  'Hôtellerie', 'Hôtels, résidences hôtelières et établissements d''hébergement',
  '["Demandes de services par QR code depuis la chambre (ménage, taxi, restauration…)", "Interface simple pour le client : scan, choix, envoi", "Notification et suivi des demandes pour le personnel", "Tableau de bord de l''hôtellerie : volume de demandes, délais, historique", "Personnalisation des services proposés par l''établissement"]',
  '', '', '',
  'Des demandes traitées plus vite, moins d''erreurs de communication, une expérience client modernisée et un service valorisé.', 'Un assistant hôtelier conçu localement, déployable sans matériel lourd : un QR code par chambre et un smartphone pour le personnel.',
  'Hospitalité', 'disponible', '/assets/images/portfolio/amitiefad.jpg', 'package', 5, 'publie', datetime('now'),
  'L''Amitié Fad — Produit technologique Green FAD', 'Votre assistant hôtelier digital — le confort connecté', '/assets/images/portfolio/amitiefad.jpg',
  '[]', '[]', '',
  (SELECT id FROM services WHERE slug = ''));
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, modules_md, use_cases_md, ux_md, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image, links_json, versions_json, external_url, related_service_id) VALUES (
  'niafad', 'NIAFAD', 'ERP — la gestion d''entreprise complète, conçue pour l''Afrique',
  'NIAFAD est la solution de gestion intégrée de GREEN FAD : un ERP qui optimise tous les processus de l''entreprise — ventes, stocks, finances, ressources humaines — dans un environnement unique et sécurisé.',
  'Beaucoup d''entreprises africaines gèrent leurs opérations avec des outils dispersés : cahiers, tableurs et logiciels non connectés. Les données sont dupliquées, les erreurs fréquentes, la vision consolidée impossible.',
  'Offrir aux entreprises africaines un ERP professionnel, adapté à leurs processus réels, déployé et supporté localement.',
  'NIAFAD est développé par les équipes d''ingénierie de GREEN FAD à partir d''accompagnements réalisés auprès d''entreprises locales.',
  'Tous secteurs d''activité', 'PME, grandes entreprises et institutions souhaitant centraliser leur gestion',
  '["Gestion commerciale : devis, factures, clients", "Gestion des stocks et des achats", "Finances : caisse, dépenses, états de synthèse", "Ressources humaines : employés, paie, absences", "Rôles et permissions par utilisateur", "Tableaux de bord de pilotage"]',
  '', '', '',
  'Une source de vérité unique pour toutes les données, moins d''erreurs, des décisions fondées sur des indicateurs fiables.', 'Un ERP déployé et supporté par une équipe locale, avec formation des équipes incluse.',
  'Gestion d''entreprise', 'disponible', '/assets/images/portfolio/niafad.jpg', 'package', 6, 'publie', datetime('now'),
  'NIAFAD — Produit technologique Green FAD', 'ERP — la gestion d''entreprise complète, conçue pour l''Afrique', '/assets/images/portfolio/niafad.jpg',
  '[]', '[]', '',
  (SELECT id FROM services WHERE slug = ''));
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, modules_md, use_cases_md, ux_md, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image, links_json, versions_json, external_url, related_service_id) VALUES (
  'sarapay', 'SARAPAY', 'L''application de paiement sécurisée pour des transactions fiables',
  'SARAPAY est la solution de paiement mobile de GREEN FAD : des transactions sécurisées, pensées pour les usages et les opérateurs du marché africain.',
  'Les transactions numériques doivent conjuguer sécurité, simplicité et compatibilité avec les moyens de paiement locaux. Les solutions génériques ne couvrent pas toujours ces besoins.',
  'Simplifier et sécuriser les paiements digitaux pour les entreprises et leurs clients, avec une solution fiable et conforme.',
  'SARAPAY est développé par GREEN FAD au sein de son laboratoire d''innovation, en réponse aux besoins de ses plateformes (marketplace, gestion) et de ses clients.',
  'Fintech, services', 'Entreprises, plateformes e-commerce et institutions acceptant les paiements digitaux',
  '["Paiements mobiles sécurisés", "Historique et traçabilité des transactions", "Intégration aux plateformes GREEN FAD et aux systèmes clients", "Notifications et confirmations en temps réel"]',
  '', '', '',
  'Des paiements fiables et traçables, une expérience de paiement fluide pour les clients, une réconciliation simplifiée.', 'Une solution de paiement conçue au sein d''un écosystème produits africain intégré.',
  'Fintech', 'disponible', '/assets/images/portfolio/sarapay.jpg', 'package', 7, 'publie', datetime('now'),
  'SARAPAY — Produit technologique Green FAD', 'L''application de paiement sécurisée pour des transactions fiables', '/assets/images/portfolio/sarapay.jpg',
  '[]', '[]', '',
  (SELECT id FROM services WHERE slug = ''));
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, modules_md, use_cases_md, ux_md, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image, links_json, versions_json, external_url, related_service_id) VALUES (
  'carte-sante', 'Carte Santé', 'Votre dossier médical numérique personnel, accessible en toutes circonstances',
  'La Carte Santé de GREEN FAD est un dossier médical numérique personnel : historique, traitements, allergies et urgences accessibles en toutes circonstances, au cabinet comme aux urgences.',
  'Le suivi médical repose souvent sur des documents papier dispersés entre plusieurs structures. En cas d''urgence, l''absence d''informations fiables et immédiates peut avoir des conséquences graves.',
  'Donner à chaque patient un dossier médical personnel, portable et sécurisé, et aux professionnels de santé un accès autorisé aux informations essentielles.',
  'La Carte Santé prolonge l''expertise cartes connectées de GREEN FAD (FAD CARD) vers le secteur de la santé.',
  'Santé', 'Patients, cliniques, cabinets médicaux et professionnels de santé',
  '["Dossier médical numérique personnel sécurisé", "Historique des consultations et traitements", "Informations d''urgence : allergies, groupe sanguin, contacts", "Carte physique connectée + espace numérique", "Accès contrôlé : le patient décide qui consulte son dossier"]',
  '', '', '',
  'Un suivi médical continu et fiable, des urgences mieux informées, un patient acteur de ses données.', 'Un dossier médical portable pensé pour le terrain africain, lié à une carte physique résistante.',
  'E-santé', 'disponible', '/assets/images/portfolio/carte-sante.jpg', 'package', 8, 'publie', datetime('now'),
  'Carte Santé — Produit technologique Green FAD', 'Votre dossier médical numérique personnel, accessible en toutes circonstances', '/assets/images/portfolio/carte-sante.jpg',
  '[]', '[]', '',
  (SELECT id FROM services WHERE slug = ''));
-- Relations médias des nouvelles plateformes
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'tile'), mi.id, 0 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/portfolio/tile.jpg';
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'tile'), mi.id, 1 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/portfolio/tile-logo.png';
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'cloudaf'), mi.id, 0 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/portfolio/cloudaf.jpg';
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'cloudaf'), mi.id, 1 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/portfolio/cloudaf-logo.png';

-- FAQ produits (réponses factuelles des plateformes)
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES
('Comment créer le menu de mon restaurant sur QRFAD ?', 'L''inscription se fait auprès de l''administrateur de votre pays (Mali, Niger, Côte d''Ivoire, Congo Kinshasa) via WhatsApp ou contact@greenfad.tech. L''équipe crée votre établissement, puis vous gérez plats, prix et photos depuis votre espace, sans formation informatique.', 'produit:qrfad', 0, 'publie'),
('Faut-il installer une application pour lire le menu ?', 'Non. Le client scanne le QR code et le menu s''ouvre dans son navigateur, sur n''importe quel téléphone. Les modifications publiées sont immédiatement visibles sur les QR codes déjà imprimés.', 'produit:qrfad', 1, 'publie'),
('Où arrivent les commandes passées depuis le menu ?', 'Sur place, à emporter ou en livraison, la commande arrive directement sur le WhatsApp de l''établissement. La caisse (POS) intégrée gère en plus remises, taxes, paiements et suivi des dépenses.', 'produit:qrfad', 2, 'publie'),
('QRFAD gère-t-il aussi les hôtels ?', 'Oui : chambres avec photos, réservations et codes de confirmation, conciergerie et avis clients. Un même établissement peut gérer restauration et hébergement dans la même plateforme.', 'produit:qrfad', 3, 'publie'),
('Que comprend un compte FadCard ?', 'Un seul compte réunit six applications : vCard (carte de visite numérique), Market (vente), Tickets (billetterie), Fund (collectes), Vote (sondages et scrutins) et FadCard Pay (encaissement). L''identité est partagée, les données isolées par application.', 'produit:fad-card', 4, 'publie'),
('Puis-je obtenir une carte NFC physique ?', 'Oui. Les cartes NFC physiques sont disponibles avec l''offre Business (45 000 XOF/mois) ou sur commande via contact@fadcard.com. La carte reste toujours à jour : les informations se modifient en ligne, sans réimpression.', 'produit:fad-card', 5, 'publie'),
('Combien coûte FadCard ?', 'Starter est gratuit (1 vCard, 5 thèmes). Pro coûte 15 000 XOF/mois (5 vCards, 30 thèmes, rendez-vous, analytics, essai de 14 jours). Business coûte 45 000 XOF/mois (vCards illimitées, tous les designs, cartes NFC, domaine personnalisé, affiliation).', 'produit:fad-card', 6, 'publie'),
('Tile est-il gratuit ?', 'Oui, Tile est gratuit. Le réseau est financé sans publicité tierce et sans revente de données : la confiance des utilisateurs est la règle, avec une modération active traitée par des humains.', 'produit:tile', 7, 'publie'),
('Sur quels appareils et dans quelles langues ?', 'Tile fonctionne en application web (PWA) installable, sur Android et sur iOS. L''interface est disponible en français, en anglais et en bambara.', 'produit:tile', 8, 'publie'),
('C''est quoi le flux Certifié ?', 'Un espace réservé aux comptes institutionnels vérifiés — médias et organisations — où l''information sérieuse se distingue d''un coup d''œil grâce au badge, séparée du flux communautaire.', 'produit:tile', 9, 'publie'),
('CloudAf propose-t-il un plan gratuit ?', 'Oui : l''offre Free comprend 1 projet, 100 crédits IA et 1 Go de stockage avec SSL automatique. Pro (29 €/mois) monte à 25 projets, 2 000 crédits IA, 50 Go et domaines personnalisés. Enterprise (99 €/mois) offre 200 projets et tous les modules avancés.', 'produit:cloudaf', 10, 'publie'),
('Comment se passe le déploiement d''une application ?', 'En un clic : SSL automatique, CDN mondial et domaine personnalisé avec configuration DNS automatique. Le monitoring temps réel surveille ensuite métriques et santé des services avec alertes automatiques.', 'produit:cloudaf', 11, 'publie');

-- Études de cas : le parcours des plateformes Green FAD
INSERT OR IGNORE INTO projects (slug, title, client, category, summary, content_md, image_key, completed_at, sort_order, status, published_at, need_md, approach_md, solution_md, results_md, tech_stack, related_service_id, meta_title, meta_description, og_image) VALUES (
  'qrfad-digitalisation-restauration', 'QRFAD — digitaliser la restauration et l''hôtellerie depuis 2021', 'GREEN FAD SARL — produit propriétaire', 'Produit propriétaire',
  'Du menu par QR code à la plateforme complète (commandes WhatsApp, caisse POS, hôtellerie) : quatre ans d''évolutions trimestrielles, 9 établissements en ligne dans quatre pays.',
  '## Le point de départ

En 2021, à Bamako, les établissements de restauration fonctionnent avec des menus papier coûteux à modifier et des commandes transmises de vive voix. QRFAD démarre avec l''interface la plus simple qui soit : un QR code imprimé, un menu à jour dans le navigateur du client, sans application à installer.

## Une plateforme qui a grandi par trimestres

Chaque cycle de trois mois a apporté une brique : catégories et QR téléchargeables (2021), multi-établissements (2022), commandes depuis le menu (2023), intégration WhatsApp puis module hôtelier (2023-2024), caisse POS (2025), et en 2026 le portail public qrfad.com où tout le monde peut explorer les établissements partenaires et leurs menus.',
  '/assets/images/portfolio/qrfad.jpg', '2026-05-20', 0, 'publie', datetime('now'),
  'Les restaurateurs perdaient du temps et de l''argent sur les menus papier, perdaient des commandes entre la salle et la cuisine, et n''avaient aucun outil abordable pour la caisse ou les chambres d''hôtel.', 'Une évolution produit trimestrielle guidée par le terrain : chaque fonctionnalité (commandes WhatsApp, POS, hôtellerie) part des difficultés réelles rapportées par les établissements équipés, puis est livrée, testée et documentée.', 'Une plateforme unique couvrant menu QR sans application, commandes WhatsApp sur place / à emporter / livraison, caisse POS (remises, taxes, paiements, dépenses), gestion hôtelière (chambres, réservations, conciergerie) et portail public avec recherche.', '9 établissements publient leur menu sur qrfad.com, au Congo Kinshasa, au Mali, au Niger et en Côte d''Ivoire. Les mises à jour de menu sont immédiates sur les QR codes imprimés, et les commandes arrivent directement sur le WhatsApp des établissements.', '**Approche :** application web mobile-first, QR codes statiques imprimables, intégration WhatsApp, module POS, infrastructure cloud opérée et supervisée par Green FAD.',
  (SELECT id FROM services WHERE slug = 'developpement-web'), 'QRFAD — étude de cas : 5 ans de digitalisation de la restauration | Green FAD', 'Comment QRFAD est passé du menu par QR code (2021) à la plateforme complète — commandes WhatsApp, caisse POS, hôtellerie — avec 9 établissements dans 4 pays.', '/assets/images/portfolio/qrfad.jpg');
INSERT OR IGNORE INTO projects (slug, title, client, category, summary, content_md, image_key, completed_at, sort_order, status, published_at, need_md, approach_md, solution_md, results_md, tech_stack, related_service_id, meta_title, meta_description, og_image) VALUES (
  'fadcard-plateforme-six-applications', 'FAD CARD — d''une carte NFC à une plateforme six-en-un', 'GREEN FAD SARL — produit propriétaire', 'Produit propriétaire',
  'Lancée en 2021 comme carte de visite numérique, FadCard réunit aujourd''hui six applications métier — vCard, Market, Tickets, Fund, Vote, Pay — derrière un seul compte et 153 designs.',
  '## 2021 : la carte qui ne se démode pas

FAD CARD naît comme carte de visite numérique NFC/RFID : un geste pour partager ses coordonnées, une page profil toujours à jour, un QR code en secours. Le produit résout immédiatement le problème des réimpressions et des informations périmées.

## Grandir sans disperser

Plutôt que d''ajouter des fonctions en vrac, FadCard a construit des **applications métier indépendantes** derrière une identité commune : Market pour vendre (2022), Tickets pour la billetterie (2023), Fund pour les collectes (2023), Vote pour les scrutins (2024), FadCard Pay pour l''encaissement (2024). Chaque application a son tableau de bord — les données restent isolées.

## 2025-2026 : la maturité

153 designs premium, cartes NFC physiques, analytique temps réel, validation de numéro dans 66 pays, plus de 40 devises, PWA installable : la plateforme sert aussi bien le consultant que le commerçant, l''organisateur d''événements ou l''association.',
  '/assets/images/portfolio/fadcard.jpg', '2026-03-12', 1, 'publie', datetime('now'),
  'Les professionnels africains gèrent leur identité, leurs ventes, leurs événements et leurs paiements dans des outils séparés, coûteux et mal adaptés au terrain.', 'Architecture multi-applications avec identité partagée et données isolées — un rythme trimestriel : chaque application a été livrée entière avant d''ouvrir la suivante.', 'Six applications (vCard, Market, Tickets, Fund, Vote, FadCard Pay) derrière un compte unique, avec analytique temps réel, 153 designs, cartes NFC, 40+ devises et validation téléphonique dans 66 pays.', 'Un écosystème professionnel complet, du freelance à l''association, avec une tarification en XOF (Starter gratuit, Pro 15 000 XOF/mois, Business 45 000 XOF/mois) et une PWA installable partout.', '**Approche :** PWA mobile-first, NFC, QR codes uniques anti-double scan, comptabilité en partie double pour FadCard Pay, infrastructure cloud opérée par Green FAD.',
  (SELECT id FROM services WHERE slug = 'developpement-web'), 'FadCard — étude de cas : la plateforme 6-en-1 | Green FAD', 'De la carte NFC de 2021 à la plateforme six applications (vCard, Market, Tickets, Fund, Vote, Pay) : le parcours produit de FadCard.', '/assets/images/portfolio/fadcard.jpg');
INSERT OR IGNORE INTO projects (slug, title, client, category, summary, content_md, image_key, completed_at, sort_order, status, published_at, need_md, approach_md, solution_md, results_md, tech_stack, related_service_id, meta_title, meta_description, og_image) VALUES (
  'tile-reseau-social-africain', 'TILE — un réseau social conçu en Afrique, pour l''Afrique', 'GREEN FAD SARL — produit propriétaire', 'Produit propriétaire',
  'Vidéos, vocaux, stories, flux Certifié pour les médias vérifiés, boutiques d''entreprises et défis créatifs : le réseau du progrès, trilingue français-anglais-bambara, sur Web, Android et iOS.',
  '## Pourquoi un nouveau réseau ?

Les plateformes globales ignorent les langues africaines, noient les médias locaux parmi le bruit, et monétisent les données sans transparence. TILE — « le Réseau du Progrès » — part d''un constat inverse : la communauté, l''information certifiée et le commerce local doivent avancer ensemble.

## Trois flux, trois usages

**Réseau** pour la communauté, **Certifié** pour l''information institutionnelle des comptes vérifiés (badge visible), **Pour toi** pour les recommandations. S''y ajoutent les vidéos courtes (20 Mo), les messages vocaux, les stories 24 h, la messagerie privée, les comptes privés réels vérifiés côté serveur, et les profils Entreprises & boutiques avec catalogue de 100 produits.

## La confiance par l''architecture

Pas de publicité tierce, pas de revente de données, modération humaine des signalements, protection anti-abus dédiée anti-abus et sauvegardes chiffrées. L''interface existe en français, en anglais et en bambara.',
  '/assets/images/portfolio/tile.jpg', '2026-06-17', 2, 'publie', datetime('now'),
  'Créateurs, médias et boutiques africains manquent d''un espace qui valorise leurs langues, certifie l''information et fait exister le commerce local.', 'Conception mobile-first éprouvée sur les plateformes précédentes de Green FAD, langues africaines d''abord, modération humaine intégrée dès la conception.', 'Un réseau social complet : trois flux distincts, médias certifiés, entreprises et boutiques, défis et récompenses, disponible en PWA, Android et iOS.', 'TILE est en ligne sur tileofficiel.com avec des communautés au Mali, au Congo, au Burkina Faso et au Niger, et une feuille de route trimestrielle assumée.', '**Approche :** PWA + applications Android/iOS, HTTPS/TLS, protection anti-abus dédiée, règles d''accès strictes et sauvegardes chiffrées.',
  (SELECT id FROM services WHERE slug = 'applications-mobiles'), 'Tile — étude de cas : le réseau social du progrès | Green FAD', 'TILE, réseau social de Green FAD : vidéos, stories, flux Certifié, boutiques, trilingue FR/EN/bambara, sans publicité tierce ni revente de données.', '/assets/images/portfolio/tile.jpg');
INSERT OR IGNORE INTO projects (slug, title, client, category, summary, content_md, image_key, completed_at, sort_order, status, published_at, need_md, approach_md, solution_md, results_md, tech_stack, related_service_id, meta_title, meta_description, og_image) VALUES (
  'cloudaf-plateforme-nocode-ia', 'CLOUDAf — la plateforme no-code + IA qui déploie en un clic', 'GREEN FAD SARL — produit propriétaire', 'Produit propriétaire',
  'Double éditeur no-code et code synchronisé, Agent IA aux outils audités, Studio Builder, Store de templates et monitoring temps réel : créer, déployer et scaler sans équipe d''infrastructure.',
  '## Le mur entre no-code et code

Les builders visuels plafonnent dès qu''un projet exige du vrai code — les plateformes de développement exigent une équipe d''infrastructure. CLOUDAf supprime ce mur : un double éditeur synchronisé en temps réel permet de commencer en glisser-déposer (Studio Builder) et de descendre au code quand on le décide.

## L''IA qui agit

L''Agent CloudAf ne se contente pas de suggérer : il discute du projet, le comprend et opère de véritables outils audités — code, builds, déploiements, ressources. Le déploiement en un clic prend en charge SSL, CDN mondial et domaine personnalisé — la sécurité (MFA TOTP, rotation de tokens, AES-256, journaux d''audit) et le monitoring sont natifs.

## Un écosystème ouvert

Le CloudAf Store permet d''acheter des templates en crédits et de vendre les siens — les offres Free, Pro (29 €/mois) et Enterprise (99 €/mois) suivent la croissance des projets.',
  '/assets/images/portfolio/cloudaf.jpg', '2026-10-08', 3, 'publie', datetime('now'),
  'Créer une application web professionnelle suppose de maîtriser hébergement, certificats, CDN, sécurité et déploiements — ou d''y consacrer une équipe.', 'Capitaliser sur l''exploitation réelle des plateformes Green FAD (QRFAD, FadCard, Tile) pour outiller la chaîne complète : création, déploiement, supervision.', 'Une plateforme de création d''applications : éditeur dual, Agent IA audité, Studio Builder, déploiement un clic (SSL, CDN, DNS automatique), sécurité native, Store et monitoring.', 'Trois offres publiques (Free, Pro 29 €/mois, Enterprise 99 €/mois), six familles de templates prêtes à l''emploi, et une base technique moderne et éprouvée.', '**Approche :** intégrations IA tierces, infrastructure cloud opérée par Green FAD.',
  (SELECT id FROM services WHERE slug = 'developpement-web'), 'CloudAf — étude de cas : no-code + IA, déploiement un clic | Green FAD', 'CloudAf de Green FAD : double éditeur no-code + code, Agent IA aux outils audités, Studio Builder, Store et monitoring. Créez, déployez, scalez.', '/assets/images/portfolio/cloudaf.jpg');

-- ============ BLOG v4 — le parcours des plateformes, articles datés ============
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'qrfad-lancement-menu-qr', 'QRFAD : le menu numérique par QR code débarque à Bamako', 'En mars 2021, Green FAD lance QRFAD : un QR code imprimé, un menu à jour dans le navigateur du client, sans application à installer. Le début d''une aventure produit qui dure encore.',
  '# QRFAD : le menu numérique par QR code débarque à Bamako

En mars 2021, nous publions la première version de **QRFAD**. L''idée est née sur le terrain : des établissements pleins, des cartes fatiguées, des prix corrigés au stylo, et des clients qui, tous, ont un smartphone dans la poche.

## Le pari de la simplicité

Nous avons volontairement écarté tout ce qui complique : pas d''application à télécharger, pas de compte à créer pour le client. Un QR code imprimé sur la table, un menu qui s''ouvre dans le navigateur, des plats présentés avec leurs descriptions, leurs prix et leurs photos. Côté restaurateur, tout se modifie depuis un espace d''administration pensé pour être utilisé sans formation informatique.

## Ce que la première version contenait

- Menu numérique par QR code, consultable sur n''importe quel téléphone
- Plats, descriptions, prix et photos, organisés par catégories
- QR code téléchargeable pour l''impression sur les tables
- Mise à jour des plats et des prix en temps réel

## Ce qui a suivi

QRFAD n''est pas resté un menu. Trimestre après trimestre, la plateforme a intégré la prise de commande, WhatsApp, la caisse et même l''hôtellerie. Cinq ans plus tard, elle équipe des établissements dans quatre pays. Nous racontons chaque étape de ce parcours dans ce blog — parce qu''un produit qui dure est un produit que l''on documente.',
  '/assets/images/blog/qrfad-lancement-menu-qr.jpg', 'Produits', '["QRFAD", "Lancement", "Restauration"]', 'Green FAD — Équipe produit', 'article', 0, '2021-03-15 09:00:00', 'publie',
  'Mars 2021 : lancement de QRFAD, le menu numérique par QR code de Green FAD, pensé pour les restaurants africains — sans application à installer.', (SELECT id FROM products WHERE slug = 'qrfad'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'qrfad-multi-etablissements', 'QRFAD passe au multi-établissements : une gestion claire pour les groupes', 'Juin 2022 : QRFAD permet désormais à une même équipe de gérer plusieurs établissements, avec des rôles par utilisateur, des tables physiques et une identité propre à chaque adresse.',
  '# QRFAD passe au multi-établissements

Un an après le lancement, une demande revenait sans cesse chez nos restaurateurs : « j''ouvre un deuxième établissement, dois-je repartir de zéro ? ». La version livrée au printemps 2022 répond : non.

## Une administration pensée pour les groupes

- **Multi-établissements** : un même compte administre plusieurs adresses, chacune avec son menu, ses prix et ses horaires
- **Rôles multiples** : le gérant, le responsable de salle et l''équipe cuisine n''ont pas les mêmes droits
- **Tables physiques** : chaque table porte son QR code, le suivi devient précis
- **Thèmes de menu** : l''identité visuelle s''adapte à chaque établissement
- **Identité complète** : logo, couverture et coordonnées propres à chaque adresse

## Pourquoi c''était le bon moment

Les premiers utilisateurs de 2021 étaient majoritairement des établissements indépendants. En 2022, des groupes de restauration et des hôtels-restaurants ont rejoint la plateforme. Le multi-établissements n''était pas une fonctionnalité de plus : c''était la condition pour grandir avec eux.

Cette version a aussi fixé une règle qui n''a jamais bougé depuis : **une modification publiée est immédiatement visible sur les QR codes déjà imprimés**. Le papier ne vieillit plus.',
  '/assets/images/blog/qrfad-multi-etablissements.jpg', 'Produits', '["QRFAD", "Multi-établissements", "Évolution produit"]', 'Green FAD — Équipe produit', 'recit', 0, '2022-06-10 09:00:00', 'publie',
  'Juin 2022 : QRFAD ajoute la gestion multi-établissements, les rôles, les tables physiques et les thèmes de menu pour les groupes de restauration.', (SELECT id FROM products WHERE slug = 'qrfad'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'qrfad-commandes-depuis-menu', 'Commander depuis le menu : QRFAD connecte la salle et la cuisine', 'Mars 2023 : le menu QRFAD ne se consulte plus, il se commande. Sur place, à emporter ou en livraison, la commande part du téléphone du client et arrive structurée côté établissement.',
  '# Commander depuis le menu

Mars 2023, deuxième grande bascule de QRFAD : le menu devient un canal de commande. Le client qui scanne peut désormais commander **sur place, à emporter ou en livraison** — directement depuis la page qu''il a sous les yeux.

## Ce que ça change pour l''établissement

Avant, la commande traversait trois personnes avant d''atteindre la cuisine — et se perdait parfois en route. Désormais :

- la commande arrive **structurée** : plats, quantités, remarques
- elle est **horodatée** et traçable dans l''espace d''administration
- le service à emporter et la livraison s''ouvrent sans téléphone monopolisé

## Ce que ça change pour le client

Plus d''attente pour être pris, plus d''erreur de recopie. Le client choisit, envoie, savoure. L''expérience reste la même sur tous les téléphones, sans application.

## La suite logique

Une commande crée une obligation : arriver proprement jusqu''à l''équipe. Quelques mois plus tard, nous avons connecté la commande au canal que tous les établissements utilisaient déjà — WhatsApp. C''est l''objet de la prochaine étape de ce parcours.',
  '/assets/images/blog/qrfad-commandes-depuis-menu.jpg', 'Produits', '["QRFAD", "Commandes", "Évolution produit"]', 'Green FAD — Équipe produit', 'recit', 0, '2023-03-08 09:00:00', 'publie',
  'Mars 2023 : QRFAD ajoute la prise de commande depuis le menu — sur place, à emporter, livraison — avec des commandes structurées côté établissement.', (SELECT id FROM products WHERE slug = 'qrfad'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'qrfad-whatsapp-commandes', 'QRFAD + WhatsApp : la commande arrive directement sur le numéro du restaurant', 'Novembre 2023 : les commandes passées depuis le menu QRFAD arrivent maintenant sur le WhatsApp de l''établissement. Aucun changement d''habitude pour les équipes — juste moins d''erreurs.',
  '# QRFAD + WhatsApp

En 2023, un constat s''imposait : dans chaque établissement que nous accompagnions, WhatsApp était déjà l''outil central — pour les clients comme pour les équipes. Plutôt que d''imposer un nouveau tableau de bord, QRFAD a choisi d''aller là où le terrain travaille déjà.

## Le principe

Le client commande depuis le menu numérique — sur place, à emporter ou en livraison. La commande, structurée et complète, **arrive directement sur le WhatsApp de l''établissement** :

- plats et quantités exacts, remarques du client incluses
- type de commande : sur place, à emporter ou livraison
- l''équipe confirme et traite comme n''importe quel message

## Pourquoi c''est important

- **Aucune formation supplémentaire** : les équipes maîtrisent déjà WhatsApp
- **Zéro intermédiaire** : pas de commission, la relation reste directe
- **Moins d''erreurs** : la commande n''est plus recopiée à la main

## Deux ans plus tard

Cette intégration reste l''une des plus utilisées de la plateforme. Elle a ouvert la voie à la brique suivante : la caisse, pour réconcilier commandes, encaissements et dépenses au même endroit.',
  '/assets/images/blog/qrfad-whatsapp-commandes.jpg', 'Produits', '["QRFAD", "WhatsApp", "Intégration"]', 'Green FAD — Équipe produit', 'article', 0, '2023-11-14 09:00:00', 'publie',
  'Novembre 2023 : les commandes QRFAD arrivent directement sur le WhatsApp des établissements — structurées, sans commission, sans formation.', (SELECT id FROM products WHERE slug = 'qrfad'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'qrfad-hotels-reservations', 'QRFAD s''ouvre aux hôtels : chambres, réservations et conciergerie', 'Septembre 2024 : QRFAD étend son QR code à l''hôtellerie. Chambres avec photos, réservations et codes de confirmation, conciergerie et avis clients — la même simplicité, un nouveau métier.',
  '# QRFAD s''ouvre aux hôtels

Plusieurs de nos restaurants étaient adossés à des hôtels. La question est arrivée naturellement : « QRFAD peut-il gérer nos chambres comme il gère nos plats ? ». Septembre 2024 : la réponse est oui.

## Ce que contient le module hôtellerie

- **Fiches de chambres** avec photos et descriptions, consultables par QR code
- **Réservations** avec **codes de confirmation** — simple à vérifier à l''accueil
- **Conciergerie** : les demandes des clients arrivent structurées côté réception
- **Avis clients** : la parole des voyageurs remonte à l''établissement

## La cohérence du modèle

Le QR code a fait ses preuves au restaurant : zéro installation, zéro formation, information toujours à jour. Nous avons transposé exactement la même logique à la chambre : un QR, une fiche claire, une action possible — réserver, demander, apprécier.

## Un établissement, une plateforme

Un hôtel-restaurant peut désormais gérer menu, commandes, caisse, chambres et réservations dans le même espace d''administration. C''est cette vision « une plateforme complète, pas seulement un menu » que nous poursuivons depuis.',
  '/assets/images/blog/qrfad-hotels-reservations.jpg', 'Produits', '["QRFAD", "Hôtellerie", "Évolution produit"]', 'Green FAD — Équipe produit', 'recit', 0, '2024-09-05 09:00:00', 'publie',
  'Septembre 2024 : le module hôtellerie de QRFAD — chambres avec photos, réservations à codes de confirmation, conciergerie et avis clients.', (SELECT id FROM products WHERE slug = 'qrfad'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'qrfad-caisse-pos', 'La caisse intégrée : QRFAD devient un outil complet de gestion', 'Juin 2025 : caisse (POS) intégrée à QRFAD — remises, taxes, paiements et suivi des dépenses. La boucle est bouclée entre le menu, la commande et l''encaissement.',
  '# La caisse intégrée

Juin 2025 : QRFAD franchit la dernière frontière du restaurant numérique — l''encaissement. La nouvelle caisse (POS) intégrée réunit enfin, au même endroit, ce qui circulaient encore sur trois supports.

## Ce que la caisse apporte

- **Remises et taxes** appliquées proprement, ligne par ligne
- **Paiements** enregistrés par type, réconciliables en fin de journée
- **Suivi des dépenses** de l''établissement, au même endroit que les recettes
- **Commandes QR et caisse réunies** : ce que le client commande se retrouve en caisse, sans ressaisie

## Le vrai enjeu : la vérité des chiffres

Avant, le menu était numérique, la commande sur WhatsApp, et la caisse… dans un cahier. Personne ne pouvait répondre simplement à « quelle a été notre journée ? ». Désormais, la boucle est fermée : le client scanne, commande, l''équipe sert, la caisse encaisse — et tout concorde.

## Où nous en sommes

Avec la caisse, QRFAD couvre le cycle complet de l''établissement : menu, commande, encaissement, dépenses — et, depuis 2024, les chambres pour les hôtels. La suite ? Rendre tout cela visible du monde entier : c''est le portail public, l''étape suivante de ce parcours.',
  '/assets/images/blog/qrfad-caisse-pos.jpg', 'Produits', '["QRFAD", "Caisse", "POS"]', 'Green FAD — Équipe produit', 'recit', 0, '2025-06-12 09:00:00', 'publie',
  'Juin 2025 : la caisse POS intégrée de QRFAD — remises, taxes, paiements et dépenses réunis avec les commandes QR, sans ressaisie.', (SELECT id FROM products WHERE slug = 'qrfad'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'qrfad-portail-public-9-etablissements', 'QRFAD ouvre son portail public : 9 établissements explorables en ligne', 'Mai 2026 : qrfad.com devient une vitrine publique. Recherche, exploration des menus, contacts par pays — 9 établissements du Congo, du Mali, du Niger et de Côte d''Ivoire sont en ligne.',
  '# QRFAD ouvre son portail public

Pendant cinq ans, QRFAD a grandi discrètement, établissement par établissement. Mai 2026 marque un tournant : **qrfad.com** devient un portail public où tout le monde peut découvrir les restaurants et hôtels équipés, consulter leurs menus et les contacter.

## Ce que l''on peut faire sur le portail

- **Explorer** les établissements partenaires et leurs menus, depuis n''importe quel téléphone
- **Rechercher** un établissement, un plat, une ville
- **Commander** : le menu reste le canal de commande — sur place, à emporter, livraison
- **Contacter** l''administrateur de son pays : Congo Kinshasa, Mali, Niger, Côte d''Ivoire

## Neuf établissements, quatre pays

Neuf établissements publient aujourd''hui leur menu sur QRFAD. Ce chiffre est notre meilleure publicité : chaque menu en ligne est un établissement réel, avec ses plats, ses prix, ses photos — tenu à jour par son équipe.

## Et maintenant ?

L''inscription reste sur invitation — auprès des administrateurs pays — parce que la qualité du portail dépend de la fiabilité de chaque établissement référencé. La prochaine étape du produit est en cours : encore plus de performance mobile et de fiabilité des commandes, dans la continuité de notre cadence trimestrielle.

*Vous tenez un restaurant ou un hôtel ? Contactez l''admin de votre pays depuis qrfad.com — direction@greenfad.tech ou contact@greenfad.tech.*',
  '/assets/images/blog/qrfad-portail-public-9-etablissements.jpg', 'Produits', '["QRFAD", "Portail public", "Jalon"]', 'Green FAD — Équipe produit', 'article', 1, '2026-05-20 09:00:00', 'publie',
  'Mai 2026 : le portail public de QRFAD met en ligne 9 établissements du Congo, du Mali, du Niger et de Côte d''Ivoire, menus et commandes inclus.', (SELECT id FROM products WHERE slug = 'qrfad'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'fadcard-lancement-vcard', 'FAD CARD : la carte de visite numérique made in Green FAD', 'Mai 2021 : Green FAD lance FAD CARD, la carte de visite numérique NFC. Un geste pour partager ses coordonnées, une page profil toujours à jour — et plus jamais de réimpression.',
  '# FAD CARD : la carte de visite numérique

Mai 2021 : nous lançons **FAD CARD**, la première pierre de ce qui deviendra l''écosystème professionnel de Green FAD. Le constat de départ est universel, et particulièrement vrai sur le terrain africain : la carte de visite papier s''égare, se démode, et coûte cher à réimprimer à chaque changement de numéro ou de fonction.

## Le geste qui remplace le papier

- **Partage instantané** : un simple contact NFC — ou un scan du QR code en secours — ouvre la page profil
- **Page profil complète** : nom, fonction, contacts, réseaux, liens
- **Toujours à jour** : on modifie ses informations en ligne, la carte suit — plus jamais de réimpression
- **Design personnalisé** : aux couleurs de l''entreprise, sur PVC durable

## Pensée pour les organisations

Dès la première version, FAD CARD propose un tableau de bord pour les entreprises qui équipent leurs équipes : chacun a sa carte, l''organisation garde la cohérence.

## La suite de l''histoire

Cinq ans plus tard, FAD CARD n''est plus seulement une carte : c''est une plateforme six applications — vCard, Market, Tickets, Fund, Vote et FadCard Pay. Chaque étape de ce parcours est documentée dans ce blog, mise à jour après mise à jour.',
  '/assets/images/blog/fadcard-lancement-vcard.jpg', 'Produits', '["FadCard", "Lancement", "NFC"]', 'Green FAD — Équipe produit', 'article', 0, '2021-05-18 09:00:00', 'publie',
  'Mai 2021 : lancement de FAD CARD, la carte de visite numérique NFC de Green FAD — partage instantané, profil toujours à jour, zéro réimpression.', (SELECT id FROM products WHERE slug = 'fad-card'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'fadcard-market', 'FadCard Market : vendre en ligne depuis sa carte', 'Juillet 2022 : FadCard s''ouvre au commerce avec Market — produits, services, gestion de stock et intégration WhatsApp, directement depuis le profil professionnel.',
  '# FadCard Market : vendre en ligne depuis sa carte

Juillet 2022 : FadCard franchit une étape majeure. La carte qui présentait son porteur peut désormais présenter — et vendre — son catalogue. C''est la naissance de **Market**.

## Ce qu''apporte Market

- **Vente de produits et services** directement depuis le profil FadCard
- **Gestion de stock** simple : quantités, disponibilités
- **Intégration WhatsApp** : la commande arrive là où le commerçant répond déjà
- **Suivi des commandes** sans tableau Excel parallèle

## Pourquoi dans FadCard

Parce que la carte est déjà le point de contact professionnel : elle se partage en réunion, au comptoir, lors d''un événement. Transformer ce contact en vitrine marchande, c''est raccourcir le chemin entre « voilà qui je suis » et « voilà ce que je vends ».

## Le fil rouge du parcours

Market a fixé un principe qui structure toute la plateforme depuis : **des applications métier indépendantes derrière une identité commune**. Tickets suivra en 2023, puis Fund, Vote et FadCard Pay — chaque application entière, livrée à son rythme trimestriel, sans jamais disperser l''utilisateur.',
  '/assets/images/blog/fadcard-market.jpg', 'Produits', '["FadCard", "Market", "E-commerce"]', 'Green FAD — Équipe produit', 'recit', 0, '2022-07-07 09:00:00', 'publie',
  'Juillet 2022 : FadCard Market ajoute la vente de produits et services, la gestion de stock et l''intégration WhatsApp au profil professionnel.', (SELECT id FROM products WHERE slug = 'fad-card'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'fadcard-tickets', 'FadCard Tickets : la billetterie par QR code, sans contrefaçon possible', 'Février 2023 : la billetterie arrive dans FadCard. Quotas par catégorie, QR codes uniques à l''entrée et suivi des ventes en temps réel — avec anti-double scan.',
  '# FadCard Tickets : la billetterie par QR code

Février 2023 : FadCard répond à un besoin que nous croisions à chaque événement — concerts, conférences, matchs, soirées : vendre des tickets sans imprimer des souches, et contrôler les entrées sans convoiter les contrefaçons.

## Ce que Tickets apporte

- **Vente de tickets en ligne** : chaque participant achète et reçoit son billet
- **Quotas par catégorie** : VIP, standard, invitation — le compteur fait foi
- **QR codes uniques** : un billet = un code, scannable à l''entrée
- **Anti-double scan** : un même code ne passe pas deux fois
- **Suivi des ventes en temps réel** : le compteur est visible jusqu''au jour J

## Pensé pour le terrain

Le contrôle d''entrée se fait avec un simple smartphone : pas de matériel dédié, pas de lecteur spécifique à louer. L''organisateur voit ses ventes avancer, l''équipe à l''entrée scanne, tout le monde gagne du temps.

## La série s''installe

Tickets est la deuxième application métier de FadCard, après Market. La même année, Fund ouvrira le volet collecte — le parcours continue.',
  '/assets/images/blog/fadcard-tickets.jpg', 'Produits', '["FadCard", "Tickets", "Billetterie"]', 'Green FAD — Équipe produit', 'recit', 0, '2023-02-09 09:00:00', 'publie',
  'Février 2023 : FadCard Tickets — billetterie avec quotas par catégorie, QR codes uniques, anti-double scan et suivi des ventes en temps réel.', (SELECT id FROM products WHERE slug = 'fad-card'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'fadcard-fund', 'FadCard Fund : des collectes transparentes, suivies en temps réel', 'Octobre 2023 : Fund ajoute la collecte de fonds à FadCard — objectif, progression publique, confirmation des paiements et gestion des donateurs.',
  '# FadCard Fund : la collecte, en toute transparence

Octobre 2023 : associations, clubs, familles, causes — la collecte de fonds est partout dans la vie communautaire africaine, et presque toujours gérée à l''aveugle : qui a donné ? combien ? où en est-on ? **Fund** répond.

## Ce que Fund apporte

- **Campagnes de collecte** avec objectif chiffré et date
- **Progression publique** : la jauge avance en temps réel, visible de tous
- **Suivi des confirmations de paiement** : chaque contribution est tracée
- **Gestion des donateurs** : remercier, relancer, rendre des comptes

## Pourquoi la transparence change tout

Une collecte qui se voit rassure ceux qui donnent et responsabilise ceux qui organisent. La jauge publique n''est pas un gadget : c''est l''outil de confiance qui manquait aux collectes communautaires.

## Le socle s''élargit

Fund est la quatrième brique de FadCard, après vCard, Market et Tickets. Restaient les décisions collectives et l''argent proprement dit — Vote et FadCard Pay prendront le relais en 2024.',
  '/assets/images/blog/fadcard-fund.jpg', 'Produits', '["FadCard", "Fund", "Collecte"]', 'Green FAD — Équipe produit', 'recit', 0, '2023-10-11 09:00:00', 'publie',
  'Octobre 2023 : FadCard Fund — campagnes de collecte avec objectif, progression publique en temps réel et gestion des donateurs.', (SELECT id FROM products WHERE slug = 'fad-card'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'fadcard-vote', 'FadCard Vote : sondages et compétitions, un vote par personne', 'Mai 2024 : Vote rejoint FadCard. Sondages, compétitions, option scrutin secret, règle d''or « un vote par personne » et export CSV des résultats.',
  '# FadCard Vote : consulter, départager, décider

Mai 2024 : avec **Vote**, FadCard outille ce que les communautés font depuis toujours — se consulter. Élections associatives, concours, sondages d''opinion, classements : la règle est simple et non négociable.

## La règle d''or : un vote par personne

- **Identité contrôlée** : chaque participant vote une seule fois
- **Option scrutin secret** : le choix n''est visible de personne
- **Résultats en direct** ou révélés à la clôture, au choix de l''organisateur
- **Export CSV** : les résultats s''exploitent, s''archivent, se vérifient

## Pour les concours aussi

Vote gère les compétitions : candidats, votes du public, classement. Les communautés s''en servent pour leurs événements culturels et leurs défis créatifs — un usage que nous voyons grandir à chaque trimestre.

## La collection s''achève presque

vCard, Market, Tickets, Fund, Vote : cinq applications métier. Il manquait le socle financier — l''encaissement centralisé. C''est la dernière pièce du puzzle, arrivée fin 2024 sous le nom de FadCard Pay.',
  '/assets/images/blog/fadcard-vote.jpg', 'Produits', '["FadCard", "Vote", "Scrutin"]', 'Green FAD — Équipe produit', 'recit', 0, '2024-05-16 09:00:00', 'publie',
  'Mai 2024 : FadCard Vote — sondages et compétitions avec scrutin secret, un vote par personne et export CSV des résultats.', (SELECT id FROM products WHERE slug = 'fad-card'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'fadcard-pay-six-applications', 'FadCard Pay : un compte, six applications, un encaissement centralisé', 'Décembre 2024 : FadCard Pay complète la plateforme — encaissement centralisé, suivi des fonds, retraits et comptabilité en partie double. Six applications, un seul compte.',
  '# FadCard Pay : la dernière pièce

Décembre 2024 : FadCard réunit son sixième module. **FadCard Pay** est le socle financier de la plateforme — celui qui relie tout le reste.

## Ce que FadCard Pay apporte

- **Encaissement centralisé** : les paiements de Market, Tickets, Fund et Vote convergent au même endroit
- **Suivi des fonds et retraits** : le solde, les mouvements, les retraits — lisibles
- **Frais de transaction** gérés proprement, ligne par ligne
- **Comptabilité en partie double** : chaque mouvement est traçable, créditable, auditable

## « Une plateforme. Six applications, un seul compte. »

Avec Pay, la promesse de FadCard devient une réalité complète : se présenter (vCard), vendre (Market), inviter (Tickets), collecter (Fund), consulter (Vote) et encaisser (Pay) — avec une identité partagée, des tableaux de bord indépendants et des données isolées par application.

## Et après ?

La personnalisation, la mesure, l''international : 2025 et 2026 porteront les 153 designs, les cartes NFC physiques, l''analytique temps réel et l''ouverture à 40+ devises. Le parcours continue.',
  '/assets/images/blog/fadcard-pay-six-applications.jpg', 'Produits', '["FadCard", "Paiement", "Version majeure"]', 'Green FAD — Équipe produit', 'article', 0, '2024-12-04 09:00:00', 'publie',
  'Décembre 2024 : FadCard Pay — encaissement centralisé, suivi des fonds, retraits et comptabilité en partie double. La plateforme atteint six applications.', (SELECT id FROM products WHERE slug = 'fad-card'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'fadcard-designs-nfc', '153 designs et cartes NFC : la personnalisation poussée à l''extrême', 'Août 2025 : FadCard port sa bibliothèque à 153 designs premium et lance les cartes NFC physiques commandables. La carte redevient un objet de fierté — sans jamais se démoder.',
  '# 153 designs, et des cartes NFC en main

Août 2025 : deux annonces pour FadCard, sur le même thème — la personnalisation.

## 153 designs premium

La bibliothèque de designs atteint **153 modèles distincts** : du plus sobre au plus affirmé, pour le consultant, l''artisan, le médecin, l''artiste ou l''entreprise. Sur l''offre Business, tous les designs sont ouverts — sur Pro, 30 thèmes — sur Starter, 5 — chacun trouve sa carte à son niveau.

## La carte NFC physique

Le geste NFC méritait son objet : FadCard propose désormais des **cartes NFC physiques** commandables — PVC durable, design aux couleurs de l''organisation, prêtes à distribuer aux équipes. Le principe reste le même et reste la force du produit : **l''objet change de main, l''information change en ligne**. Une réimpression pour un changement de numéro ? Fini.

## Pourquoi la personnalisation compte

Sur le terrain, la carte de visite est un marqueur d''image. Un design qui ressemble à l''organisation — et une carte qui ne se démode jamais — c''est un argument de vente en soi.

## La suite

2026 sera celle de la mesure et de l''international : analytique temps réel, 66 pays, 40+ devises. Prochaine étape du parcours.',
  '/assets/images/blog/fadcard-designs-nfc.jpg', 'Produits', '["FadCard", "Design", "NFC"]', 'Green FAD — Équipe produit', 'recit', 0, '2025-08-21 09:00:00', 'publie',
  'Août 2025 : FadCard atteint 153 designs premium et propose les cartes NFC physiques commandables — l''objet change de main, l''information change en ligne.', (SELECT id FROM products WHERE slug = 'fad-card'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'fadcard-analytics-66-pays', 'Analytics temps réel, 66 pays, 40+ devises : FadCard passe la vitesse supérieure', 'Mars 2026 : vues, partages, clics et sources mesurés en temps réel — validation de numéro dans 66 pays — plus de 40 devises — PWA installable. FadCard entre dans sa cinquième année.',
  '# Mesurer, ouvrir, installer : la cinquième année de FadCard

Mars 2026 : pour ses cinq ans, FadCard livre sa plus grosse mise à jour transversale depuis FadCard Pay.

## L''analytique temps réel

Chaque application de la plateforme expose désormais ses mesures en direct :

- **Vues** du profil et des publications
- **Partages** et canaux utilisés
- **Clics** sur les liens et boutons
- **Sources** d''où viennent vos visiteurs

Mesurer, c''est décider : quel design convertit, quel canal ramène, quel contenu engage.

## L''international assumé

- **Validation de numéro dans 66 pays** : vos contacts sont vérifiés, de Bamako à la diaspora
- **40+ devises** : les prix de Market et les campagnes Fund parlent la monnaie de vos clients

## Une PWA, aucune borne

FadCard devient une **PWA installable** : depuis n''importe quel navigateur, l''utilisateur installe l''application sur son écran d''accueil — sans store, sans mise à jour à télécharger.

## Cinq ans, une cadence

Cinq ans, dix versions majeures, une mise à jour chaque trimestre. Le prochain article de ce parcours parlera de fiabilité et de performance — la discipline de la v5.1.',
  '/assets/images/blog/fadcard-analytics-66-pays.jpg', 'Produits', '["FadCard", "Analytics", "Version majeure"]', 'Green FAD — Équipe produit', 'article', 0, '2026-03-12 09:00:00', 'publie',
  'Mars 2026 : FadCard ajoute l''analytique temps réel, la validation de numéro dans 66 pays, 40+ devises et devient une PWA installable.', (SELECT id FROM products WHERE slug = 'fad-card'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'tile-lancement-reseau-progres', 'Tile, le Réseau du Progrès : Green FAD lance son réseau social panafricain', 'Avril 2026 : après cinq ans de produits d''utilité (QRFAD, FadCard), Green FAD publie Tile — un réseau social conçu en Afrique, trilingue, sans publicité tierce ni revente de données.',
  '# Tile, le Réseau du Progrès

Avril 2026 : Green FAD publie **Tile** — « le Réseau du Progrès ». Après cinq ans à construire des outils pour les restaurants, les professionnels et les organisations, nous ouvrons un espace pour tout le monde : créer, partager, se connecter.

## Pourquoi un réseau de plus ?

Parce que les réseaux globaux ignorent ce qui fait la richesse d''ici : les **langues** (le bambara a sa place à côté du français et de l''anglais), les **médias locaux** (noyés dans le bruit), les **boutiques de quartier** (invisibles), et la **confiance** (données monétisées, modération absente).

## Ce que Tile propose dès le premier jour

- **Vidéos courtes** (jusqu''à 20 Mo), **messages vocaux** et **stories de 24 heures**
- **Trois flux distincts** : Réseau (votre communauté), Certifié (médias et institutions vérifiés), Pour toi (recommandations)
- **Messagerie privée** avec contrôle de qui peut vous écrire
- **Comptes privés réels** : publications réservées aux abonnés acceptés, règle vérifiée côté serveur
- **Entreprises & boutiques** : profil entité, catalogue jusqu''à 100 produits ou services, rôles d''équipe

## La confiance comme architecture

Pas de publicité tierce. Pas de revente de données. Modération humaine des signalements. Badge de certification pour les médias. Ce ne sont pas des options : c''est la conception même de Tile.

## Où nous en sommes

Tile est disponible en application web (PWA) — Android, iOS et le flux Certifié sont arrivés en juin. Présent au Mali, au Congo, au Burkina Faso et au Niger — et ouvert au monde.',
  '/assets/images/blog/tile-lancement-reseau-progres.jpg', 'Produits', '["Tile", "Lancement", "Réseau social"]', 'Green FAD — Équipe produit', 'article', 1, '2026-04-22 09:00:00', 'publie',
  'Avril 2026 : lancement de Tile, le Réseau du Progrès — vidéos, stories, flux Certifié, boutiques, trilingue FR/EN/bambara, sans publicité tierce.', (SELECT id FROM products WHERE slug = 'tile'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'tile-android-ios-trois-flux', 'Tile arrive sur Android et iOS : trois flux, trois usages', 'Juin 2026 : Tile se dote d''applications natives Android et iOS et ouvre le flux Certifié aux médias et organisations vérifiées. Le réseau gagne en rythme et en portée.',
  '# Tile sur Android et iOS

Juin 2026 : deux mois après le lancement web, Tile est disponible en **applications Android et iOS** — et son flux **Certifié** ouvre aux médias et organisations vérifiées.

## Trois flux, trois usages

Tile organise le temps passé en trois espaces clairement séparés :

- **Réseau** — les publications de vos abonnements et de vos proches : la communauté
- **Certifié** — l''information des comptes institutionnels vérifiés, badge à l''appui : les médias se distinguent d''un coup d''œil
- **Pour toi** — des recommandations choisies selon vos goûts : la découverte

Pourquoi séparer ? Parce que l''information sérieuse et le divertissement n''ont pas le même contrat de confiance. Sur Tile, un média vérifié ne se noie pas dans le flux.

## Les applications natives

L''application web (PWA) reste là — Android et iOS apportent le confort des notifications, des partages et des performances natives. Chiffrement HTTPS/TLS, protection anti-abus dédiée anti-abus, règles d''accès strictes et sauvegardes chiffrées : la barre technique est haute, comme sur toutes nos plateformes.

## Le rythme s''installe

Septembre 2026 a suivi avec les Défis & récompenses, les boutiques d''entreprises et l''interface trilingue complète. Tile suit la même discipline que ses aînés : une mise à jour par trimestre, documentée ici.',
  '/assets/images/blog/tile-android-ios-trois-flux.jpg', 'Produits', '["Tile", "Mobile", "Flux Certifié"]', 'Green FAD — Équipe produit', 'article', 0, '2026-06-17 09:00:00', 'publie',
  'Juin 2026 : Tile arrive sur Android et iOS et ouvre son flux Certifié aux médias vérifiés — trois flux distincts pour la communauté, l''information et la découverte.', (SELECT id FROM products WHERE slug = 'tile'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'cloudaf-lancement', 'CloudAf : créer, déployer et scaler sans se soucier de l''infrastructure', 'Juin 2026 : Green FAD lance CloudAf — double éditeur no-code + code, IA intégrée, Studio Builder et déploiement en un clic avec SSL, CDN et domaine personnalisé.',
  '# CloudAf : créez, déployez, scalez

Juin 2026 : Green FAD publie **CloudAf**, sa plateforme de création d''applications. Cinq années d''exploitation de nos propres produits (QRFAD, FadCard, Tile) nous ont appris une chose : le plus dur n''est pas d''écrire une application — c''est tout ce qui l''entoure. CloudAf s''attaque à exactement ça.

## Le double éditeur : le mur est tombé

- **No-code** : Studio Builder — bibliothèque de blocs, canvas glisser-déposer, inspecteur, thèmes
- **Code** : un éditeur complet pour aller plus loin
- **Synchronisés en temps réel** : on commence visuellement, on descend au code quand on le décide

## L''IA au travail

L''IA intégrée assiste chaque étape. Et pour ceux qui veulent déléguer davantage, l''**Agent CloudAf** discute du projet, le comprend et agit via de véritables outils audités — code, builds, déploiements, ressources.

## Le déploiement en un clic

SSL automatique, CDN mondial, domaine personnalisé avec configuration DNS automatique. La sécurité est native — MFA TOTP, rotation des refresh tokens, AES-256, limitation de débit, journaux d''audit — et le monitoring surveille métriques et santé des services avec alertes.

## Pour commencer

Six familles de templates sont prêtes : SaaS Starter, e-commerce, blog, portfolio, dashboard, landing. L''offre Free permet de démarrer sans rien payer (1 projet, 100 crédits IA) — Pro (29 €/mois) et Enterprise (99 €/mois) suivent la croissance. Bienvenue dans l''atelier.',
  '/assets/images/blog/cloudaf-lancement.jpg', 'Produits', '["CloudAf", "Lancement", "No-code"]', 'Green FAD — Équipe produit', 'article', 0, '2026-06-03 09:00:00', 'publie',
  'Juin 2026 : lancement de CloudAf — double éditeur no-code + code, IA intégrée, Studio Builder, déploiement en un clic (SSL, CDN, domaine). Offres Free, Pro 29 €, Enterprise 99 €.', (SELECT id FROM products WHERE slug = 'cloudaf'));
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'cloudaf-agent-ia', 'L''Agent CloudAf : l''IA qui construit votre projet avec vous', 'Octobre 2026 : l''Agent CloudAf passe de l''assistance à l''action — il comprend le projet et opère de véritables outils audités : code, builds, déploiements, ressources. Le Store ouvre en même temps.',
  '# L''Agent CloudAf passe à l''action

Octobre 2026 : deux mois après le lancement, CloudAf franchit l''étape que nous avions en ligne de mire depuis le début : l''**Agent**.

## Un agent, de vrais outils

La plupart des assistants IA suggèrent. L''Agent CloudAf **agit** : il discute avec vous, comprend votre projet, puis opère de véritables outils — **code, builds, déploiements, ressources** — chaque action étant auditée et visible.

- Décrivez ce que vous voulez : l''agent propose, vous validez, il exécute
- Chaque opération passe par des outils **audités** : rien ne se fait dans l''ombre
- Vous gardez la main : le double éditeur no-code + code reste là, synchronisé

## Le Store ouvre ses portes

Même vague de mise à jour : le **CloudAf Store** permet d''acheter des templates payants avec des crédits — et de **vendre vos propres projets**. Créer sur CloudAf peut devenir une source de revenus.

## Et le monitoring pour tenir la distance

Le déploiement n''est pas la fin : le monitoring temps réel suit métriques et santé des services, avec alertes automatiques. Votre application vit, vous êtes prévenu avant que vos utilisateurs ne le remarquent.

## La cadence respectée

C''est la troisième mise à jour majeure de CloudAf en cinq mois (v1.0 juin, v1.1 août, v1.2 octobre). La cadence trimestrielle n''est pas un slogan : c''est notre discipline depuis QRFAD en 2021.',
  '/assets/images/blog/cloudaf-agent-ia.jpg', 'Produits', '["CloudAf", "IA", "Agent"]', 'Green FAD — Équipe produit', 'article', 1, '2026-10-08 09:00:00', 'publie',
  'Octobre 2026 : l''Agent CloudAf agit via des outils audités (code, builds, déploiements) et le CloudAf Store ouvre — templates en crédits, revente de projets.', (SELECT id FROM products WHERE slug = 'cloudaf'));

INSERT INTO countries (slug, name, iso2, flag_emoji, is_registered, presentation_md, sort_order, status, published_at) VALUES ('mali', 'Mali', 'ML', '', 1, 'GREEN FAD SARL est immatriculée au Mali. Le siège social se trouve à Missabougou, Bamako. C''est de là que sont conçus, développés et déployés nos produits et nos projets clients.', 0, 'publie', datetime('now'));
INSERT INTO countries (slug, name, iso2, flag_emoji, is_registered, presentation_md, sort_order, status, published_at) VALUES ('burkina-faso', 'Burkina Faso', 'BF', '', 1, 'GREEN FAD intervient au Burkina Faso auprès d''organisations locales et y est immatriculée. Nos équipes y déploient des solutions digitales et accompagnent la transformation numérique des entreprises.', 1, 'publie', datetime('now'));
INSERT INTO countries (slug, name, iso2, flag_emoji, is_registered, presentation_md, sort_order, status, published_at) VALUES ('rdc-congo', 'RD Congo', 'CD', '', 1, 'GREEN FAD est immatriculée en République démocratique du Congo et contribue à des projets de transformation digitale dans le pays.', 2, 'publie', datetime('now'));
INSERT INTO countries (slug, name, iso2, flag_emoji, is_registered, presentation_md, sort_order, status, published_at) VALUES ('niger', 'Niger', 'NE', '', 1, 'GREEN FAD est immatriculée au Niger et accompagne des organisations locales dans leurs projets numériques.', 3, 'publie', datetime('now'));
INSERT INTO countries (slug, name, iso2, flag_emoji, is_registered, presentation_md, sort_order, status, published_at) VALUES ('cote-ivoire', 'Côte d''Ivoire', 'CI', '', 0, 'GREEN FAD sert des clients en Côte d''Ivoire à travers ses produits et ses expertises, avec une présence commerciale en développement.', 4, 'publie', datetime('now'));
INSERT INTO offices (country_id, city, address, phone, email, hours, is_hq, status, created_at, updated_at) SELECT (SELECT id FROM countries WHERE slug = 'mali'), 'Bamako', 'Missabougou, Bamako, Mali', '+223 72 19 46 54', 'contact@greenfad.tech', 'Lundi - Vendredi : 8h00 - 17h00', 1, 'publie', datetime('now'), datetime('now');
-- Références clients & partenaires — ensemble RÉEL de production (10/11/2026),
-- logos = jumeaux WebP 320×200 optimisés des fichiers téléversés par l'admin
-- (migration 0021). Principes : INSERT OR IGNORE idempotent, mêmes noms, mêmes
-- ordres et mêmes visuels qu'en production → un re-seed ne détruit plus rien.
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-afric-immo-w320.webp', 'partenaire-afric-immo-w320.webp', 'image/webp', 3688, 320, 200, 'Référence client : Afric-Immo (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-artifyfad-w320.webp', 'partenaire-artifyfad-w320.webp', 'image/webp', 1962, 320, 200, 'Référence client : ArtifyFad (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-casa-des-delices-w320.webp', 'partenaire-casa-des-delices-w320.webp', 'image/webp', 9936, 320, 200, 'Référence client : Casa des Délices (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-cours-africa-w320.webp', 'partenaire-cours-africa-w320.webp', 'image/webp', 7334, 320, 200, 'Référence client : Cours Africa (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-efb-entreprise-w320.webp', 'partenaire-efb-entreprise-w320.webp', 'image/webp', 7972, 320, 200, 'Référence client : EFB Entreprise (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-massaley-hotel-w320.webp', 'partenaire-massaley-hotel-w320.webp', 'image/webp', 5000, 320, 200, 'Référence client : Massaley Hôtel (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-pharmacie-hopital-du-mali-w320.webp', 'partenaire-pharmacie-hopital-du-mali-w320.webp', 'image/webp', 2852, 320, 200, 'Référence client : Pharmacie hôpital du Mali (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-eurodecor-w320.webp', 'partenaire-eurodecor-w320.webp', 'image/webp', 3480, 320, 200, 'Référence client : Eurodecor (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-justice-mali-w320.webp', 'partenaire-justice-mali-w320.webp', 'image/webp', 7342, 320, 200, 'Référence client : Justice Mali (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-le-baobab-hotel-w320.webp', 'partenaire-le-baobab-hotel-w320.webp', 'image/webp', 6914, 320, 200, 'Référence client : Le Baobab Hôtel (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-nature-attitude-w320.webp', 'partenaire-nature-attitude-w320.webp', 'image/webp', 3220, 320, 200, 'Référence client : Nature Attitude (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-sky-buffet-w320.webp', 'partenaire-sky-buffet-w320.webp', 'image/webp', 3874, 320, 200, 'Référence client : Sky Buffet (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-greenfad-w320.webp', 'partenaire-greenfad-w320.webp', 'image/webp', 5824, 320, 200, 'Référence client : Greenfad (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-greenfad-2-w320.webp', 'partenaire-greenfad-2-w320.webp', 'image/webp', 2848, 320, 200, 'Référence client : Greenfad 2 (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Afric-Immo', m.r2_key, 0, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-afric-immo-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'ArtifyFad', m.r2_key, 1, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-artifyfad-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Casa des Délices', m.r2_key, 2, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-casa-des-delices-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Cours Africa', m.r2_key, 3, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-cours-africa-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'EFB Entreprise', m.r2_key, 4, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-efb-entreprise-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Massaley Hôtel', m.r2_key, 5, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-massaley-hotel-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Pharmacie hôpital du Mali', m.r2_key, 6, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-pharmacie-hopital-du-mali-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Eurodecor', m.r2_key, 7, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-eurodecor-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Justice Mali', m.r2_key, 8, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-justice-mali-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Le Baobab Hôtel', m.r2_key, 9, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-le-baobab-hotel-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Nature Attitude', m.r2_key, 10, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-nature-attitude-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Sky Buffet', m.r2_key, 11, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-sky-buffet-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Greenfad', m.r2_key, 12, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-greenfad-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Greenfad 2', m.r2_key, 13, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/partenaire-greenfad-2-w320.webp' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Qui est GREEN FAD ?', 'GREEN FAD SARL est une entreprise technologique africaine d''innovation, de conception et de développement. Elle conçoit des produits numériques propriétaires (FAD CARD, QRFAD, FEREFAD, NIAFAD…), assure l''ingénierie logicielle et accompagne la transformation digitale des organisations, depuis Bamako (Mali) et à l''international.', 'Général', 0, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Quels sont les trois univers de Green FAD ?', 'Green FAD déploie son expertise selon trois univers complémentaires : le corporate (l''entreprise, sa vision et son identité), le business & technology (produits, expertises et réalisations) et le media & knowledge (galerie, innovation et ressources).', 'Général', 1, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Dans quels pays intervient GREEN FAD ?', 'GREEN FAD est immatriculée au Mali (siège à Bamako), au Burkina Faso, en République démocratique du Congo et au Niger, et sert des clients en Côte d''Ivoire. Consultez la page Implantation pour le détail.', 'Général', 2, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Comment obtenir une démonstration d''un produit ?', 'Rendez-vous sur la fiche du produit qui vous intéresse et utilisez le formulaire « Demander une démonstration ». Notre équipe vous contacte pour organiser une présentation en présentiel à Bamako ou en visioconférence.', 'Produits', 3, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Les produits GREEN FAD sont-ils disponibles hors du Mali ?', 'Oui. Nos produits sont conçus pour les marchés africains et sont déployables dans l''ensemble de la sous-région et à l''international. Contactez-nous pour étudier votre contexte.', 'Produits', 4, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('La FAD CARD fonctionne-t-elle avec tous les smartphones ?', 'La FAD CARD utilise la technologie NFC/RFID standard : tout smartphone récent équipé de NFC peut lire la carte. Les téléphones sans NFC peuvent lire le QR code associé, ce qui couvre l''ensemble des appareils.', 'produit:fad-card', 5, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Peut-on mettre à jour les informations de sa carte ?', 'Oui — c''est l''un des avantages principaux de la FAD CARD : les coordonnées et liens se mettent à jour sans réimprimer la carte.', 'produit:fad-card', 6, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Faut-il installer une application pour utiliser QRFAD ?', 'Non. Le client scanne simplement le QR code avec l''appareil photo de son téléphone : le menu s''ouvre dans le navigateur, sans installation.', 'produit:qrfad', 7, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('QRFAD gère-t-il plusieurs langues ?', 'Oui, QRFAD a été conçu pour servir une clientèle locale et internationale : les menus sont accessibles en plusieurs langues.', 'produit:qrfad', 8, 'publie');
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description) VALUES ('tendances-developpement-web-2025', '10 Tendances du Développement Web à Suivre en 2025', 'Découvrez les technologies et pratiques qui façonnent l''avenir du développement web en 2025. De l''IA aux Progressive Web Apps, restez à la pointe de l''innovation.', '# 10 Tendances du Développement Web à Suivre en 2025

Le monde du développement web évolue à une vitesse fulgurante. En 2025, de nouvelles technologies et pratiques transforment la façon dont nous créons et interagissons avec les sites web. Voici les 10 tendances incontournables que tout développeur et entrepreneur doit connaître.

## 1. Intelligence Artificielle et Machine Learning

L''IA n''est plus une technologie futuriste, elle est désormais intégrée dans la plupart des projets web modernes.

### Applications Concrètes

- **Chatbots intelligents** : Assistance client 24/7 avec compréhension du langage naturel
- **Personnalisation** : Contenu adapté en temps réel selon le comportement utilisateur
- **Génération de contenu** : Aide à la rédaction et optimisation SEO
- **Analyse prédictive** : Anticipation des besoins utilisateurs

### Outils Populaires

```javascript
// Exemple d''intégration d''un chatbot IA
import { OpenAI } from ''openai'';

const chatbot = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function handleUserMessage(message) {
  const response = await chatbot.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: message }]
  });
  return response.choices[0].message.content;
}
```

## 2. Progressive Web Apps (PWA)

Les PWA combinent le meilleur du web et des applications natives, offrant une expérience utilisateur exceptionnelle même hors ligne.

### Avantages des PWA

**Installation facile** : Ajout à l''écran d''accueil sans app store  
**Fonctionnement hors ligne** : Service Workers pour le cache  
**Notifications push** : Engagement utilisateur amélioré  
**Performance** : Chargement ultra-rapide  
**Coût réduit** : Une seule base de code pour toutes les plateformes

### Exemple de Service Worker

```javascript
// sw.js - Service Worker basique
self.addEventListener(''install'', (event) => {
  event.waitUntil(
    caches.open(''v1'').then((cache) => {
      return cache.addAll([
        ''/'',
        ''/styles.css'',
        ''/script.js'',
        ''/images/logo.png''
      ]);
    })
  );
});

self.addEventListener(''fetch'', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

## 3. Jamstack Architecture

La Jamstack (JavaScript, APIs, Markup) révolutionne la façon de construire des sites web performants et sécurisés.

### Principes Fondamentaux

- **Pré-rendu** : Pages générées au moment du build
- **Découplage** : Frontend et backend indépendants
- **APIs** : Services externes via APIs
- **CDN** : Distribution globale du contenu

### Stack Populaire

```bash
# Exemple avec Next.js et Vercel
npx create-next-app@latest mon-site-jamstack
cd mon-site-jamstack
npm run build
vercel deploy
```

**Avantages** :
- Performance exceptionnelle
- Sécurité renforcée
- Scalabilité automatique
- Coûts d''hébergement réduits

## 4. WebAssembly (Wasm)

WebAssembly permet d''exécuter du code à vitesse quasi-native dans le navigateur, ouvrant de nouvelles possibilités.

### Cas d''Usage

- **Jeux en ligne** : Performance 3D avancée
- **Édition multimédia** : Traitement photo/vidéo dans le navigateur
- **Applications scientifiques** : Calculs complexes
- **Portage d''applications** : Applications desktop vers le web

### Exemple Simple

```rust
// Rust compilé en WebAssembly
#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

```javascript
// Utilisation en JavaScript
WebAssembly.instantiateStreaming(fetch(''module.wasm''))
  .then(obj => {
    console.log(obj.instance.exports.add(5, 3)); // 8
  });
```

## 5. API-First Development

L''approche API-first place les APIs au cœur de l''architecture, facilitant l''intégration et l''évolutivité.

### Avantages

- **Flexibilité** : Multiples frontends (web, mobile, IoT)
- **Réutilisabilité** : APIs partagées entre projets
- **Testabilité** : Tests indépendants du frontend
- **Documentation** : Spécifications claires (OpenAPI/Swagger)

### Exemple avec FastAPI (Python)

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Article(BaseModel):
    title: str
    content: str
    author: str

@app.post("/articles/")
async def create_article(article: Article):
    return {"message": "Article créé", "article": article}

@app.get("/articles/{article_id}")
async def read_article(article_id: int):
    return {"article_id": article_id}
```

## 6. Motion UI et Micro-interactions

Les animations et micro-interactions améliorent l''expérience utilisateur en rendant les interfaces plus intuitives et engageantes.

### Principes de Design

- **Feedback visuel** : Confirmation des actions utilisateur
- **Guidage** : Direction de l''attention
- **Continuité** : Transitions fluides entre états
- **Personnalité** : Identité de marque renforcée

### Exemple avec Framer Motion

```jsx
import { motion } from ''framer-motion'';

function Button() {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      Cliquez-moi
    </motion.button>
  );
}
```

## 7. Accessibilité Web (A11y)

L''accessibilité n''est plus optionnelle. Elle est essentielle pour atteindre tous les utilisateurs et respecter les réglementations.

### Checklist Essentielle

Contraste de couleurs suffisant (ratio 4.5:1 minimum)  
Navigation au clavier complète  
Textes alternatifs pour toutes les images  
Structure sémantique HTML correcte  
Labels pour tous les formulaires  
Support des lecteurs d''écran

### Exemple de Code Accessible

```html
<!-- Mauvais -->
<div onclick="submitForm()">Envoyer</div>

<!-- Bon -->
<button type="submit" aria-label="Envoyer le formulaire">
  Envoyer
</button>

<!-- Excellent -->
<button 
  type="submit" 
  aria-label="Envoyer le formulaire de contact"
  aria-describedby="form-help">
  Envoyer
</button>
<span id="form-help" class="sr-only">
  Vos données seront traitées de manière confidentielle
</span>
```

## 8. Serverless et Edge Computing

L''architecture serverless et l''edge computing transforment le déploiement et la performance des applications web.

### Avantages du Serverless

- **Pas de gestion de serveur** : Focus sur le code
- **Scalabilité automatique** : Adaptation à la demande
- **Paiement à l''usage** : Coûts optimisés
- **Déploiement rapide** : Mise en production instantanée

### Exemple avec Vercel Edge Functions

```javascript
// api/hello.js
export const config = {
  runtime: ''edge'',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get(''name'') || ''Visiteur'';
  
  return new Response(
    JSON.stringify({ message: `Bonjour ${name}!` }),
    {
      headers: { ''content-type'': ''application/json'' },
    }
  );
}
```

## 9. Cybersécurité Renforcée

Avec l''augmentation des cyberattaques, la sécurité web est plus critique que jamais.

### Meilleures Pratiques

1. **HTTPS obligatoire** : Certificat SSL/TLS
2. **Headers de sécurité** : CSP, HSTS, X-Frame-Options
3. **Authentification forte** : 2FA, OAuth 2.0
4. **Validation des entrées** : Protection contre XSS et injection SQL
5. **Dépendances à jour** : Patches de sécurité réguliers

### Configuration Sécurisée

```javascript
// Express.js avec helmet
const express = require(''express'');
const helmet = require(''helmet'');

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["''self''"],
      styleSrc: ["''self''", "''unsafe-inline''"],
      scriptSrc: ["''self''"],
      imgSrc: ["''self''", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## 10. Green Web Development

Le développement web durable devient une priorité face aux enjeux environnementaux.

### Pratiques Éco-responsables

- **Optimisation des images** : Formats modernes (WebP, AVIF)
- **Code minifié** : Réduction de la taille des fichiers
- **Lazy loading** : Chargement à la demande
- **Hébergement vert** : Serveurs alimentés par énergies renouvelables
- **Performance** : Moins de ressources = moins d''énergie

### Mesurer l''Impact

```bash
# Utiliser Website Carbon Calculator
# https://www.websitecarbon.com/

# Lighthouse CI pour le suivi
npm install -g @lhci/cli
lhci autorun
```

### Checklist Éco-conception

Images optimisées (< 200KB)  
Polices système ou subset de polices  
CSS et JS minifiés  
Cache agressif  
CDN pour distribution globale  
Hébergeur éco-responsable

## Bonus : No-Code et Low-Code

Les plateformes no-code/low-code démocratisent le développement web, permettant à plus de personnes de créer des applications.

### Plateformes Populaires

- **Webflow** : Design visuel avancé
- **Bubble** : Applications web complexes
- **Airtable** : Bases de données et workflows
- **Zapier** : Automatisation sans code

## Conclusion

Le développement web en 2025 est marqué par l''innovation, la performance et la responsabilité. Ces tendances ne sont pas de simples modes passagères, mais des évolutions fondamentales qui redéfinissent notre industrie.

### Comment Rester à Jour ?

1. **Formation continue** : Cours en ligne, certifications
2. **Veille technologique** : Blogs, newsletters, podcasts
3. **Expérimentation** : Projets personnels et side projects
4. **Communauté** : Meetups, conférences, forums
5. **Open source** : Contribution et apprentissage

### Nos Recommandations

Chez **Greenfad**, nous intégrons ces technologies dans nos projets pour offrir à nos clients des solutions modernes, performantes et durables. Que vous soyez une startup ou une entreprise établie, nous vous accompagnons dans votre transformation digitale.

**Prêt à moderniser votre présence web ?** Contactez-nous pour discuter de votre projet et découvrir comment ces technologies peuvent bénéficier à votre entreprise.

---

**Ressources Complémentaires**

- [MDN Web Docs](https://developer.mozilla.org/) - Documentation de référence
- [Web.dev](https://web.dev/) - Guides et best practices Google
- [CSS-Tricks](https://css-tricks.com/) - Tutoriels et astuces
- [Smashing Magazine](https://www.smashingmagazine.com/) - Articles approfondis

---

**À propos de Greenfad**  
Agence digitale basée à Bamako, Mali, Greenfad accompagne les entreprises africaines dans leur transformation numérique depuis plus de 10 ans. Développement web, applications mobiles, SEO et stratégies digitales sur mesure.', '', 'web', '["développement web", "tendances", "technologies", "innovation"]', 'Green FAD', 'analyse', 0, '2025-11-08 09:00:00', 'publie', 'Découvrez les technologies et pratiques qui façonnent l''avenir du développement web en 2025. De l''IA aux Progressive Web Apps, restez à la pointe de l''inno');
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description) VALUES ('guide-seo-pour-sites-africains', 'Guide SEO 2025 : Optimiser Votre Site pour le Marché Africain', 'Découvrez les meilleures pratiques SEO adaptées au contexte africain. Stratégies, outils et conseils pour améliorer votre référencement naturel.', '# Guide SEO 2025 : Optimiser Votre Site pour le Marché Africain

Le référencement naturel (SEO) est devenu un enjeu majeur pour toute entreprise souhaitant développer sa présence en ligne en Afrique. Dans ce guide complet, nous explorons les stratégies spécifiques au marché africain.

## Pourquoi le SEO est Crucial en Afrique

Le continent africain connaît une croissance exponentielle de l''utilisation d''Internet. Avec plus de **600 millions d''internautes** et une pénétration mobile dépassant les 80% dans certains pays, la visibilité en ligne n''a jamais été aussi importante.

### Les Défis Spécifiques

Le SEO en Afrique présente des particularités uniques :

- **Connectivité variable** : La vitesse de chargement est cruciale
- **Utilisation mobile dominante** : Plus de 70% du trafic provient de smartphones
- **Diversité linguistique** : Multilinguisme et langues locales
- **Contexte économique** : Adaptation aux réalités locales

## Les Fondamentaux du SEO Technique

### 1. Optimisation de la Vitesse

La vitesse de chargement est le facteur numéro un en Afrique. Voici comment l''améliorer :

```html
<!-- Compression des images -->
<img src="image.webp" alt="Description" loading="lazy">

<!-- Minification CSS/JS -->
<link rel="stylesheet" href="styles.min.css">
```

**Objectif** : Temps de chargement inférieur à 3 secondes sur connexion 3G.

### 2. Mobile-First Design

Google utilise désormais l''indexation mobile-first. Votre site doit être :

- **Responsive** : Adaptation automatique à toutes les tailles d''écran
- **Tactile** : Boutons suffisamment grands (minimum 44x44 pixels)
- **Lisible** : Taille de police adaptée (minimum 16px)

### 3. Structure des URLs

Créez des URLs claires et descriptives :

**Bon** : `greenfad.tech/services/developpement-web`  
Éviter : **Mauvais** : `greenfad.tech/page?id=123`

## SEO On-Page : Le Contenu est Roi

### Balises Title et Meta Description

Chaque page doit avoir une balise title unique et optimisée :

```html
<title>Agence Web Bamako | Développement Sites Internet - Greenfad</title>
<meta name="description" content="Greenfad, agence digitale à Bamako. 
Création de sites web, applications mobiles et solutions SEO pour entreprises au Mali.">
```

**Règles d''or** :
- Title : 50-60 caractères
- Meta description : 150-160 caractères
- Inclure le mot-clé principal
- Appel à l''action clair

### Hiérarchie des Titres

Structurez votre contenu avec les balises H1-H6 :

```html
<h1>Titre Principal (1 seul par page)</h1>
<h2>Section Importante</h2>
<h3>Sous-section</h3>
```

### Optimisation des Images

Les images représentent souvent 50% du poids d''une page :

1. **Format** : Utilisez WebP (30% plus léger que JPEG)
2. **Compression** : Réduisez la taille sans perte de qualité
3. **Attribut alt** : Décrivez précisément l''image
4. **Lazy loading** : Chargement différé des images

```html
<img src="agence-web-bamako.webp" 
     alt="Équipe Greenfad travaillant sur un projet web à Bamako"
     loading="lazy"
     width="800" 
     height="600">
```

## SEO Local pour l''Afrique

### Google My Business

Créez et optimisez votre fiche Google My Business :

- Nom exact de l''entreprise
- Adresse complète
- Numéro de téléphone local
- Horaires d''ouverture
- Photos de qualité
- Catégorie pertinente

### Citations Locales

Inscrivez votre entreprise dans les annuaires locaux :

- Pages Jaunes Afrique
- Annuaires nationaux
- Plateformes sectorielles
- Réseaux sociaux locaux

### Contenu Localisé

Créez du contenu adapté à votre audience locale :

- Utilisez des exemples locaux
- Mentionnez des villes et régions
- Abordez des problématiques locales
- Intégrez des expressions locales

## Stratégie de Mots-Clés

### Recherche de Mots-Clés

Utilisez des outils gratuits pour identifier les bons mots-clés :

1. **Google Keyword Planner** : Volume de recherche
2. **Google Trends** : Tendances par pays
3. **Answer The Public** : Questions fréquentes
4. **Ubersuggest** : Suggestions de mots-clés

### Intention de Recherche

Comprenez l''intention derrière chaque recherche :

- **Informationnelle** : "comment créer un site web"
- **Navigationnelle** : "greenfad bamako"
- **Transactionnelle** : "agence web prix mali"
- **Commerciale** : "meilleure agence digitale bamako"

## Backlinks et Autorité

### Obtenir des Backlinks de Qualité

Les backlinks restent un facteur de classement majeur :

1. **Contenu de qualité** : Créez du contenu digne d''être partagé
2. **Guest blogging** : Écrivez pour d''autres sites
3. **Partenariats** : Collaborez avec des entreprises locales
4. **Médias** : Obtenez des mentions dans la presse
5. **Annuaires** : Inscrivez-vous dans des annuaires de qualité

### Éviter les Pénalités

Ne tombez pas dans ces pièges :

Éviter : Achat de liens  
Éviter : Fermes de liens  
Éviter : Contenu dupliqué  
Éviter : Sur-optimisation de mots-clés  
Éviter : Liens de mauvaise qualité

## Outils SEO Essentiels

### Gratuits

- **Google Search Console** : Suivi des performances
- **Google Analytics** : Analyse du trafic
- **Google PageSpeed Insights** : Test de vitesse
- **Screaming Frog** : Audit technique (version gratuite limitée)

### Payants

- **Semrush** : Suite complète SEO
- **Ahrefs** : Analyse de backlinks
- **Moz Pro** : Suivi de classement
- **Yoast SEO** : Plugin WordPress

## Mesurer Vos Résultats

### KPIs à Suivre

Surveillez ces indicateurs clés :

1. **Trafic organique** : Visiteurs depuis les moteurs de recherche
2. **Positions** : Classement de vos mots-clés
3. **Taux de clic (CTR)** : Pourcentage de clics sur vos résultats
4. **Taux de rebond** : Visiteurs quittant immédiatement
5. **Conversions** : Objectifs atteints (formulaires, ventes, etc.)

### Tableau de Bord

Créez un tableau de bord mensuel :

| Métrique | Mois Précédent | Mois Actuel | Évolution |
|----------|----------------|-------------|-----------|
| Trafic organique | 1,250 | 1,580 | +26% |
| Mots-clés top 10 | 15 | 23 | +53% |
| Backlinks | 42 | 58 | +38% |
| Conversions | 18 | 27 | +50% |

## Tendances SEO 2025

### Intelligence Artificielle

L''IA transforme le SEO :

- **Recherche vocale** : Optimisez pour les questions naturelles
- **Contenu généré par IA** : Utilisez l''IA comme assistant, pas comme rédacteur
- **Personnalisation** : Résultats adaptés à chaque utilisateur

### Core Web Vitals

Google accorde une importance croissante à l''expérience utilisateur :

- **LCP** (Largest Contentful Paint) : < 2,5s
- **FID** (First Input Delay) : < 100ms
- **CLS** (Cumulative Layout Shift) : < 0,1

### E-E-A-T

Démontrez votre expertise :

- **Experience** : Expérience pratique
- **Expertise** : Compétences reconnues
- **Authoritativeness** : Autorité dans votre domaine
- **Trustworthiness** : Fiabilité et transparence

## Conclusion

Le SEO est un marathon, pas un sprint. Les résultats prennent du temps, mais les bénéfices sont durables. En appliquant ces stratégies adaptées au marché africain, vous positionnerez votre site pour un succès à long terme.

### Prochaines Étapes

1. Effectuez un audit SEO de votre site
2. Identifiez vos mots-clés prioritaires
3. Optimisez votre contenu existant
4. Créez un calendrier de publication
5. Suivez vos résultats mensuellement

**Besoin d''aide pour votre stratégie SEO ?** Contactez Greenfad pour un audit gratuit de votre site web.

---

**À propos de l''auteur**  
L''équipe Greenfad accompagne les entreprises africaines dans leur transformation digitale depuis plus de 10 ans. Nous sommes spécialisés dans le développement web, le SEO et les stratégies de marketing digital adaptées au contexte africain.', '', 'seo', '["SEO", "référencement", "Afrique", "marketing digital"]', 'Green FAD', 'guide', 0, '2025-11-09 14:30:00', 'publie', 'Découvrez les meilleures pratiques SEO adaptées au contexte africain. Stratégies, outils et conseils pour améliorer votre référencement naturel.');
INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description) VALUES ('bienvenue-sur-le-blog-greenfad', 'Bienvenue sur le Blog Greenfad', 'Découvrez notre nouveau blog dédié à la transformation numérique et écologique en Afrique. Articles, tutoriels et actualités sur le développement web, le SEO et les technologies vertes', '# Bienvenue sur le Blog Greenfad

Nous sommes ravis de vous accueillir sur le nouveau blog de **GREEN FAD SARL**, votre partenaire de confiance pour la transformation numérique et écologique en Afrique.

## Notre Mission

Chez Greenfad, nous croyons fermement que la technologie et l''innovation peuvent transformer les défis environnementaux en opportunités de développement durable. Notre blog est une extension naturelle de cette mission : partager nos connaissances, nos expériences et les meilleures pratiques avec notre communauté.

## Ce Que Vous Trouverez Ici

Notre blog couvrira une large gamme de sujets, notamment :

### Développement Web
Des tutoriels pratiques, des guides de développement et les dernières tendances en matière de technologies web. Que vous soyez débutant ou développeur expérimenté, vous trouverez des ressources adaptées à votre niveau.

### SEO et Marketing Digital
Apprenez à optimiser votre présence en ligne, à améliorer votre référencement naturel et à développer des stratégies marketing efficaces pour le marché africain.

### Technologies Vertes
Découvrez comment intégrer des pratiques durables dans vos projets numériques et comment la technologie peut contribuer à un avenir plus vert.

### Innovation et Tendances
Restez informé des dernières innovations technologiques et des tendances qui façonnent l''avenir du numérique en Afrique et dans le monde.

## Pourquoi Ce Blog ?

L''écosystème numérique africain est en pleine expansion. Chaque jour, de nouvelles entreprises naissent, de nouveaux projets voient le jour, et de nouveaux défis émergent. Nous voulons être à vos côtés pour :

- **Partager notre expertise** : Plus de 10 ans d''expérience dans le développement web et la transformation digitale
- **Créer une communauté** : Un espace d''échange et de partage entre professionnels et passionnés du numérique
- **Inspirer l''innovation** : Des études de cas, des success stories et des retours d''expérience concrets

## Rejoignez-Nous

Ce blog est aussi le vôtre. Nous encourageons vos commentaires, vos questions et vos suggestions de sujets. Ensemble, construisons une communauté dynamique et engagée autour de la transformation numérique en Afrique.

### Restez Connecté

Pour ne manquer aucun article, suivez-nous sur nos réseaux sociaux :

- **Facebook** : [@greenfad](https://web.facebook.com/100083594433530)
- **YouTube** : [@greenfad](https://youtube.com/@greenfad)
- **TikTok** : [@greenfad1](https://www.tiktok.com/@greenfad1)

## Prochainement

Dans les prochains articles, nous aborderons des sujets passionnants comme :

- Comment optimiser les performances de votre site web
- Les meilleures pratiques SEO pour le marché africain
- Guide complet du développement d''applications mobiles
- L''importance de l''accessibilité web en 2025

Merci de nous rejoindre dans cette aventure. Ensemble, accélérons la transformation numérique et écologique de l''Afrique !

---

**L''équipe Greenfad**  
*Accélérateur de la Transformation Numérique et Écologique en Afrique*', '', 'digital', '["blog", "lancement", "transformation digitale", "Afrique"]', 'Green FAD', 'article', 0, '2025-11-10 10:00:00', 'publie', 'Découvrez notre nouveau blog dédié à la transformation numérique et écologique en Afrique. Articles, tutoriels et actualités sur le développement web, le SEO et les technologies vertes.');

-- ============ PAGE D'ACCUEIL v5 ============
INSERT INTO pages (slug, title, nav_label, meta_title, meta_description, blocks, status, is_home, version, published_at) VALUES (
  'accueil', 'Accueil', 'Accueil', 'GREEN FAD SARL — 4 plateformes en ligne : QRFAD, FadCard, Tile, CloudAf', 'Entreprise technologique africaine depuis 2021 : QRFAD (restauration), FadCard (écosystème pro 6-en-1), Tile (réseau social) et CloudAf (no-code + IA). Mises à jour chaque trimestre, produits et parcours documentés.',
  '[{"type": "hero", "variant": "gradient", "eyebrow": "GREEN FAD SARL — ENTREPRISE TECHNOLOGIQUE AFRICAINE", "title": "Cinq ans de produit. Quatre plateformes en ligne. Une ambition continentale.", "subtitle": "De QRFAD et FAD CARD, nées à Bamako en 2021 et mises à jour chaque trimestre, à TILE et CLOUDAf, nos dernières plateformes : nous concevons, développons et exploitons nos propres technologies.", "cta_label": "Découvrir nos plateformes", "cta_url": "/produits", "cta2_label": "Lire le blog", "cta2_url": "/blog"}, {"type": "stats", "variant": "dark", "items": [{"value": "4", "label": "Plateformes en ligne, accessibles publiquement"}, {"value": "5 ans", "label": "D''itérations produit, mise à jour chaque trimestre"}, {"value": "6", "label": "Applications métier réunies dans FadCard"}, {"value": "9", "label": "Établissements équipés sur QRFAD"}]}, {"type": "section_header", "eyebrow": "Nos plateformes", "title": "Quatre plateformes, ouvertes au public", "text": "Chacune vit sa vie : fonctionnalités, mises à jour trimestrielles et parcours documentés dans notre blog.", "align": "center"}, {"type": "cards", "source": "manual", "limit": 4, "columns": 4, "items": [{"title": "QRFAD", "text": "Menus digitaux par QR, commandes WhatsApp, caisse POS et hôtellerie — pour les restaurants et hôtels d''Afrique.", "image_key": "/assets/images/portfolio/qrfad.jpg", "url": "https://qrfad.com", "tag": "Restauration & hôtellerie"}, {"title": "FadCard", "text": "Six applications métier, un seul compte : vCard, Market, Tickets, Fund, Vote, FadCard Pay.", "image_key": "/assets/images/portfolio/fadcard.jpg", "url": "https://fadcard.greenfad.tech", "tag": "Écosystème professionnel"}, {"title": "Tile", "text": "Le Réseau du Progrès : vidéos, stories, flux Certifié et boutiques — Web, Android, iOS.", "image_key": "/assets/images/portfolio/tile.jpg", "url": "https://tileofficiel.com", "tag": "Nouveau · Réseau social"}, {"title": "CloudAf", "text": "Créez, déployez, scalez : no-code + code, agent IA, déploiement en un clic.", "image_key": "/assets/images/portfolio/cloudaf.jpg", "url": "https://cloudaf.net", "tag": "Nouveau · No-code & IA"}], "view_all_label": "Toutes nos plateformes", "view_all_url": "/produits"}, {"type": "timeline", "title": "Cinq ans d''innovation, mise à jour après mise à jour", "items": [{"year": "2021", "title": "QRFAD & FAD CARD voient le jour à Bamako", "text": "Le menu numérique par QR code et la carte de visite connectée NFC sont lancés auprès du terrain."}, {"year": "2022", "title": "Les produits s''enrichissent", "text": "QRFAD passe au multi-établissements — FadCard lance Market, sa vitrine marchande."}, {"year": "2023", "title": "Commandes & transactions", "text": "Commandes depuis le menu puis intégration WhatsApp sur QRFAD — Tickets puis Fund sur FadCard."}, {"year": "2024", "title": "Des plateformes complètes", "text": "QRFAD couvre l''hôtellerie puis la caisse POS — FadCard complète sa suite avec Vote et FadCard Pay."}, {"year": "2025", "title": "Maturité & personnalisation", "text": "153 designs et cartes NFC pour FadCard — caisse consolidée et thèmes pour QRFAD."}, {"year": "2026", "title": "Tile & CloudAf : deux nouvelles plateformes", "text": "Le réseau social du progrès et la plateforme no-code + IA rejoignent l''écosystème Green FAD."}]}, {"type": "section_header", "eyebrow": "Catalogue", "title": "Des produits nés sur le terrain", "text": "Chaque produit Green FAD répond à un besoin réel observé sur le terrain africain.", "align": "center"}, {"type": "cards", "source": "products", "limit": 9, "columns": 3, "view_all_label": "Voir tous les produits", "view_all_url": "/produits"}, {"type": "split", "title": "L''alliance de la technologie et de l''écologie", "text_md": "Fondée par des professionnels passionnés par l''innovation et sensibles aux enjeux environnementaux, **GREEN FAD SARL** accompagne la transition numérique et écologique des organisations en Afrique.\n\n**Notre vision :** un avenir où technologie et durabilité vont de pair, réduisant la fracture numérique en Afrique.\n\n**Notre ambition :** porter nos propres innovations technologiques à l''échelle internationale.", "image_key": "/assets/images/office-workers-africa.jpg", "image_side": "right", "cta_label": "Découvrir l''entreprise", "cta_url": "/p/entreprise"}, {"type": "section_header", "eyebrow": "Expertises", "title": "Ce que nous faisons pour votre organisation", "align": "center"}, {"type": "cards", "source": "services", "limit": 4, "columns": 4, "view_all_label": "Toutes nos expertises", "view_all_url": "/expertises"}, {"type": "section_header", "eyebrow": "Le blog", "title": "Le parcours de nos produits, documenté", "text": "Lancements, mises à jour trimestrielles, coulisses d''ingénierie : cinq ans d''histoire produit racontés au fil des publications.", "align": "center"}, {"type": "cards", "source": "posts", "limit": 3, "columns": 3, "view_all_label": "Tous les articles", "view_all_url": "/blog"}, {"type": "gallery_album", "album_slug": "produits-green-fad", "limit": 6}, {"type": "countries_map"}, {"type": "cta", "title": "Construisons ensemble un avenir durable et digital", "text": "Parlons de votre projet — nos équipes vous répondent rapidement.", "button_label": "Démarrer la conversation", "button_url": "/contact", "variant": "solid"}]', 'publie', 1, 2, datetime('now'));

INSERT INTO pages (slug, title, nav_label, meta_title, meta_description, blocks, status, is_home, version, published_at) VALUES ('entreprise', 'Entreprise', 'Entreprise', 'L''entreprise GREEN FAD — identité, vision et présence internationale', 'Qui est GREEN FAD SARL : entreprise technologique africaine, produits propriétaires, ingénierie logicielle, présence au Mali, Burkina Faso, RD Congo, Niger et Côte d''Ivoire.', '[{"type": "hero", "visible": true, "eyebrow": "L''entreprise", "title": "Une entreprise technologique africaine, à ambition internationale", "subtitle": "GREEN FAD SARL conçoit, développe et porte ses propres innovations technologiques — et accompagne les organisations dans leur transformation numérique et écologique.", "cta_label": "Nos produits", "cta_url": "/produits", "cta2_label": "Nous contacter", "cta2_url": "/contact", "variant": "dark"}, {"type": "split", "visible": true, "title": "Qui sommes-nous", "text_md": "GREEN FAD SARL est une entreprise technologique africaine d''innovation, de conception, de développement et de transformation numérique. Basée à Bamako (Mali), immatriculée dans plusieurs pays africains, elle conçoit des produits numériques propriétaires et développe des solutions sur mesure pour les entreprises et institutions.\n\nFondée par des professionnels passionnés par l''innovation et sensibles aux enjeux environnementaux, GREEN FAD place l''**alliance de la technologie et de l''écologie** au cœur de son identité : *Future, Authentique, Dynamique*.", "image_key": "/assets/images/about-team.jpg", "image_side": "right", "cta_label": "", "cta_url": ""}, {"type": "section_header", "visible": true, "eyebrow": "Notre identité", "title": "Ce qui nous définit", "align": "center"}, {"type": "cards", "visible": true, "source": "manual", "limit": 4, "columns": 2, "items": [{"title": "Innovation technologique africaine", "text": "Nous ne nous contentons pas d''implémenter : nous inventons, expérimentons et documentons. Nos produits naissent de l''observation directe du terrain.", "icon": "lightbulb"}, {"title": "Produits numériques propriétaires", "text": "FAD CARD, QRFAD, FEREFAD, NIAFAD, SARAPAY, Carte Santé, L''Amitié Fad : sept produits que nous concevons, développons et exploitons nous-mêmes.", "icon": "package"}, {"title": "Ingénierie logicielle & infrastructures", "text": "Développement web et mobile, données, déploiement cloud : une chaîne de valeur technologique complète, maîtrisée de bout en bout.", "icon": "cpu"}, {"title": "Transformation digitale des organisations", "text": "Audit, conseil, développement et formation : nous accompagnons entreprises et institutions dans la durée, pas seulement au lancement.", "icon": "workflow"}]}, {"type": "stats", "visible": true, "variant": "light", "items": [{"value": "4", "label": "Pays d''immatriculation : Mali, Burkina Faso, RD Congo, Niger"}, {"value": "7", "label": "Produits propriétaires développés"}, {"value": "3", "label": "Univers : corporate, business & technology, media & knowledge"}]}, {"type": "section_header", "visible": true, "eyebrow": "Notre approche", "title": "R&D, expérimentation et transmission", "align": "center"}, {"type": "richtext", "visible": true, "content_md": "GREEN FAD ne fait pas que développer des logiciels : l''entreprise réfléchit, expérimente, documente et contribue à l''écosystème technologique africain.\n\n- **Recherche & développement** : chaque produit passe par un cycle d''expérimentation réel\n- **Veille technologique** : nous suivons et analysons les évolutions utiles au continent\n- **Transmission** : guides, analyses et retours d''expérience publiés dans notre espace Innovation\n- **Partenariats** : collaborations avec des entreprises et institutions locales et internationales\n\n> « Future, Authentique, Dynamique » — notre sigle est notre feuille de route."}, {"type": "countries_map", "visible": true}, {"type": "cta", "visible": true, "title": "Travailler avec GREEN FAD", "text": "Produit, expertise ou partenariat : échangeons sur votre projet.", "button_label": "Nous contacter", "button_url": "/contact", "variant": "solid"}]', 'publie', 0, 1, datetime('now'));
INSERT INTO pages (slug, title, meta_title, meta_description, blocks, status, is_home, version, published_at) VALUES ('mentions-legales', 'Mentions légales', 'Mentions légales | GREEN FAD', 'Mentions légales du site greenfad.tech — éditeur, hébergement, propriété intellectuelle.', '[{"type": "hero", "visible": true, "eyebrow": "Informations légales", "title": "Mentions légales", "variant": "dark"}, {"type": "richtext", "visible": true, "content_md": "## Éditeur du site\n\nLe présent site est édité par **GREEN FAD SARL**, société immatriculée au Mali.\n\n- Siège social : Missabougou, Bamako, Mali\n- Téléphone : +223 72 19 46 54\n- Email : contact@greenfad.tech\n\n## Directeur de la publication\n\nLa direction générale de GREEN FAD SARL.\n\n## Hébergement\n\nLe site est hébergé sur linfrastructure cloud de Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis.\n\n## Propriété intellectuelle\n\nLensemble des contenus du site (textes, visuels, logos, marques, produits GREEN FAD et leurs dénominations) est protégé. Toute reproduction ou réutilisation sans autorisation écrite préalable est interdite.\n\n## Signalement\n\nPour signaler un contenu problématique : contact@greenfad.tech."}]', 'publie', 0, 1, datetime('now'));
INSERT INTO pages (slug, title, meta_title, meta_description, blocks, status, is_home, version, published_at) VALUES ('confidentialite', 'Politique de confidentialité', 'Confidentialité | GREEN FAD', 'Politique de confidentialité et de protection des données de greenfad.tech.', '[{"type": "hero", "visible": true, "eyebrow": "Vos données", "title": "Politique de confidentialité", "variant": "dark"}, {"type": "richtext", "visible": true, "content_md": "## Données collectées\n\nGREEN FAD SARL collecte uniquement les données que vous nous transmettez volontairement via les formulaires du site (nom, email, téléphone, société, message) afin de répondre à vos demandes.\n\n## Finalités\n\n- Répondre à vos demandes de contact, devis et démonstrations\n- Traiter vos candidatures aux offres demploi\n- Gérer vos abonnements à la newsletter (si vous vous y inscrivez)\n\n## Durée de conservation & sécurité\n\nLes données sont conservées le temps nécessaire au traitement de votre demande puis archivées ou supprimées. Elles sont stockées sur des infrastructures sécurisées (Cloudflare) et ne sont jamais vendues à des tiers.\n\n## Vos droits\n\nVous pouvez demander laccès, la rectification ou la suppression de vos données à tout moment : **contact@greenfad.tech**.\n\n## Mesure daudience & cookies\n\nLe site nutilise pas de traceurs publicitaires. Seuls des cookies techniques strictement nécessaires (session administrateur) peuvent être déposés."}]', 'publie', 0, 1, datetime('now'));
INSERT INTO pages (slug, title, meta_title, meta_description, blocks, status, is_home, version, published_at) VALUES ('cgv', 'Conditions générales de vente', 'CGV | GREEN FAD', 'Conditions générales de vente des services et produits GREEN FAD SARL.', '[{"type": "hero", "visible": true, "eyebrow": "Conditions", "title": "Conditions générales de vente", "variant": "dark"}, {"type": "richtext", "visible": true, "content_md": "## Objet\n\nLes présentes conditions régissent les prestations de services et la fourniture de produits par GREEN FAD SARL (« le Prestataire ») à ses clients.\n\n## Commandes & devis\n\nToute commande fait suite à un devis écrit accepté par le client. Le devis précise le périmètre, les délais et le prix.\n\n## Paiement\n\nLes modalités de paiement sont indiquées sur chaque devis. Sauf convention contraire, un acompte est requis au démarrage et le solde à la livraison.\n\n## Livraison & réception\n\nLes livraisons font lobjet dune recette contradictoire. Les produits numériques sont livrés avec leur documentation et la formation associée lorsque prévue au devis.\n\n## Propriété intellectuelle\n\nLes produits propriétaires GREEN FAD demeurent la propriété intellectuelle de GREEN FAD SARL ; le client bénéficie dun droit dusage défini au contrat.\n\n## Litiges\n\nEn cas de litige, les parties recherchent une solution amiable avant toute action devant les tribunaux compétents de Bamako, Mali."}]', 'publie', 0, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/index.html', '/', 301, 1, datetime('now'));
-- Blog : l'espace Innovation devient le média /blog — anciennes URL conservées
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/innovation', '/blog', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/innovation/*', '/blog/*', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/actualites', '/blog', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/actualites/*', '/blog/*', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/blog.html', '/blog', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/blog-article.html', '/blog', 301, 1, datetime('now'));
-- Alias /services : règles SPÉCIFIQUES d'abord (l'ordre d'insertion détermine la priorité), wildcards ensuite
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/services', '/expertises', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/services/web-development.html', '/expertises/developpement-web', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/services/mobile-apps.html', '/expertises/applications-mobiles', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/services/seo-marketing.html', '/expertises/seo-marketing-digital', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/services/print-communication.html', '/expertises/impression-communication', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/services/*', '/expertises', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/projets/portfolio.html', '/realisations', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/projets', '/realisations', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/countries/*', '/implantation/*', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/carrieres.html', '/carrieres', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/faq.html', '/faq', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/contact.html', '/contact', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/support-technique.html', '/contact', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/mentions-legales.html', '/p/mentions-legales', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/politique-de-confidentialite.html', '/p/confidentialite', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/cgv.html', '/p/cgv', 301, 1, datetime('now'));
-- Version du contenu éditorial (la CI ré-applique ce fichier quand la valeur change)

-- Version du contenu éditorial (la CI ré-applique ce fichier quand la valeur change)
INSERT INTO settings (key, value) VALUES ('content_version', '4');
-- =====================================================================
-- DELTA v5 — visuels blog, fiches services enrichies, FAQ ciblées,
--          accès administrateur (mot de passe réinitialisé), version 5
-- =====================================================================

-- 1) Couvertures des articles du blog (images réelles livrées avec la plateforme)
UPDATE posts SET cover_key = '/assets/images/blog/qrfad-lancement-menu-qr.jpg' WHERE slug = 'qrfad-lancement-menu-qr';
UPDATE posts SET cover_key = '/assets/images/blog/qrfad-multi-etablissements.jpg' WHERE slug = 'qrfad-multi-etablissements';
UPDATE posts SET cover_key = '/assets/images/blog/qrfad-commandes-depuis-menu.jpg' WHERE slug = 'qrfad-commandes-depuis-menu';
UPDATE posts SET cover_key = '/assets/images/blog/qrfad-whatsapp-commandes.jpg' WHERE slug = 'qrfad-whatsapp-commandes';
UPDATE posts SET cover_key = '/assets/images/blog/qrfad-hotels-reservations.jpg' WHERE slug = 'qrfad-hotels-reservations';
UPDATE posts SET cover_key = '/assets/images/blog/qrfad-caisse-pos.jpg' WHERE slug = 'qrfad-caisse-pos';
UPDATE posts SET cover_key = '/assets/images/blog/qrfad-portail-public-9-etablissements.jpg' WHERE slug = 'qrfad-portail-public-9-etablissements';
UPDATE posts SET cover_key = '/assets/images/blog/fadcard-lancement-vcard.jpg' WHERE slug = 'fadcard-lancement-vcard';
UPDATE posts SET cover_key = '/assets/images/blog/fadcard-market.jpg' WHERE slug = 'fadcard-market';
UPDATE posts SET cover_key = '/assets/images/blog/fadcard-tickets.jpg' WHERE slug = 'fadcard-tickets';
UPDATE posts SET cover_key = '/assets/images/blog/fadcard-fund.jpg' WHERE slug = 'fadcard-fund';
UPDATE posts SET cover_key = '/assets/images/blog/fadcard-vote.jpg' WHERE slug = 'fadcard-vote';
UPDATE posts SET cover_key = '/assets/images/blog/fadcard-pay-six-applications.jpg' WHERE slug = 'fadcard-pay-six-applications';
UPDATE posts SET cover_key = '/assets/images/blog/fadcard-designs-nfc.jpg' WHERE slug = 'fadcard-designs-nfc';
UPDATE posts SET cover_key = '/assets/images/blog/fadcard-analytics-66-pays.jpg' WHERE slug = 'fadcard-analytics-66-pays';
UPDATE posts SET cover_key = '/assets/images/blog/tile-lancement-reseau-progres.jpg' WHERE slug = 'tile-lancement-reseau-progres';
UPDATE posts SET cover_key = '/assets/images/blog/tile-android-ios-trois-flux.jpg' WHERE slug = 'tile-android-ios-trois-flux';
UPDATE posts SET cover_key = '/assets/images/blog/cloudaf-lancement.jpg' WHERE slug = 'cloudaf-lancement';
UPDATE posts SET cover_key = '/assets/images/blog/cloudaf-agent-ia.jpg' WHERE slug = 'cloudaf-agent-ia';
UPDATE posts SET cover_key = '/assets/images/blog/tendances-developpement-web-2025.jpg' WHERE slug = 'tendances-developpement-web-2025';
UPDATE posts SET cover_key = '/assets/images/blog/guide-seo-pour-sites-africains.jpg' WHERE slug = 'guide-seo-pour-sites-africains';
UPDATE posts SET cover_key = '/assets/images/blog/bienvenue-sur-le-blog-greenfad.jpg' WHERE slug = 'bienvenue-sur-le-blog-greenfad';

-- 2) Fiches services enrichies (méthodologie, inclusions, technologies, secteurs, bénéfices, livrables)
UPDATE services SET image_key = '/assets/images/services/web-development.jpg', og_image = '/assets/images/services/web-development.jpg',
  methodology_md = '### 1. Audit et cadrage
Nous commençons par comprendre votre activité, vos usages réels et vos contraintes de connectivité. L''audit fixe le périmètre, les priorités et le budget — sans jargon inutile.

### 2. Conception UX/UI
Maquettes cliquables, parcours utilisateurs et arborescence validés avec vous avant la première ligne de code : vous voyez le produit avant qu''il existe.

### 3. Développement itératif
Des livraisons régulières sur un environnement de prévisualisation. Vous testez à chaque étape, sur votre propre téléphone, avec une connexion du terrain.

### 4. Tests et sécurité
Tests sur appareils d''entrée de gamme et réseaux 3G, protection CSRF/XSS, sauvegardes automatiques : la qualité se vérifie dans les conditions réelles du Mali et de la sous-région.

### 5. Mise en production et accompagnement
Déploiement sur infrastructure mondiale (Cloudflare), nom de domaine, formation de vos équipes et documentation en français. Nous restons disponibles après la livraison.',
  process_md = '**Projet type — plateforme web :**

- **Semaine 1-2** — audit, cadrage fonctionnel, devis détaillé
- **Semaine 3-4** — maquettes UX/UI et validation des parcours
- **Semaines 5-9** — développement itératif avec prévisualisation en continu
- **Semaine 10** — tests sur appareils réels, relecture sécurité, contenu
- **Semaine 11** — mise en production, nom de domaine, formation
- **Après livraison** — garantie de correction, maintenance optionnelle et évolutions par tranches',
  includes_json = '["Audit technique et cadrage fonctionnel", "Conception UX/UI avec maquettes cliquables", "Développement front-end et back-end", "Interface d''administration pour gérer vos contenus", "Intégration de paiements et de services tiers (WhatsApp, e-mail)", "Optimisation mobile, performances et connectivité faible", "Sécurité : protection CSRF/XSS, sauvegardes, HTTPS", "Mise en production, nom de domaine et formation des équipes", "Documentation en français et support après livraison"]',
  tech_json = '["Hono / TypeScript (SSR)", "Cloudflare Pages, Workers, D1, R2 et KV", "HTML5, CSS3, JavaScript moderne", "Progressive Web Apps (PWA) installables", "Node.js", "SQLite / PostgreSQL", "WordPress pour les sites éditoriaux", "PHP / MySQL (maintenance de parcs existants)", "JSON-LD, sitemap et SEO technique"]',
  industries_json = '["PME et commerces", "Institutions et ONG", "Éducation et formation", "Santé", "Agro-business", "Services professionnels", "Événementiel et culture"]',
  benefits_md = '- **Un site qui fonctionne partout** : conçu pour le mobile d''abord et testé sur connexion 3G faible.
- **Une administration simple** : vous modifiez vos contenus vous-même, sans passer par un développeur.
- **Un budget maîtrisé** : hébergement mondial à coût optimal, pas de serveur à acheter, facturation claire en XOF.
- **La qualité internationale** : les mêmes standards d''ingénierie que nos propres plateformes (FAD CARD, QRFAD, CloudAf).
- **Un partenaire local** : équipe joignable à Bamako, service client en français, réunion en présentiel possible.',
  deliverables_md = '- Site ou plateforme web livré(e), en ligne sur votre nom de domaine
- Interface d''administration documentée pour gérer vos contenus
- Maquettes et fichiers de conception validés
- Documentation technique et guide d''utilisation en français
- Formation de vos équipes à la prise en main
- Certificat SSL, sauvegardes automatiques et suivi de disponibilité'
WHERE slug = 'developpement-web';

UPDATE services SET image_key = '/assets/images/services/mobile-development.jpg', og_image = '/assets/images/services/mobile-development.jpg',
  methodology_md = '### 1. Choix du bon format
Application progressive (PWA) installable, application native Android/iOS ou hybride : nous recommandons le format adapté à vos usages, votre budget et vos publics — pas le plus cher.

### 2. Conception mobile-first
Parcours simplifiés, taille des écrans, poids des données : chaque écran est pensé pour un téléphone d''entrée de gamme et une connexion instable.

### 3. Développement et tests terrain
Livraisons fréquentes, tests sur appareils réels du marché local, mode hors-ligne quand le métier l''exige.

### 4. Publication et distribution
Google Play, APK direct ou PWA installable depuis le navigateur : nous choisissons le canal de distribution le plus efficace pour vos utilisateurs.

### 5. Suivi et évolutions
Analytique d''usage, corrections rapides, mises à jour régulières — comme pour nos propres produits, qui évoluent chaque trimestre.',
  process_md = '**Projet type — application mobile :**

- **Semaine 1** — cadrage des usages, choix du format (PWA / native / hybride)
- **Semaines 2-3** — design des écrans clés et prototype cliquable
- **Semaines 4-10** — développement par fonctionnalités testables
- **Semaines 11-12** — tests terrain, corrections, préparation des stores
- **Semaine 12+** — publication, formation, plan d''évolution trimestriel',
  includes_json = '["Cadrage des usages et choix du format (PWA, Android, iOS)", "Design mobile-first et prototype cliquable", "Développement de l''application et de son back-end", "Mode hors-ligne et économie de données", "Notifications push et SMS ciblés", "Intégration paiements (Wave, Orange Money, cartes, fournisseurs internationaux)", "Publication sur Google Play ou distribution directe (APK/PWA)", "Tableau de bord d''administration et analytique d''usage", "Formation, documentation et maintenance"]',
  tech_json = '["Progressive Web Apps (PWA) installables", "Flutter (Dart) pour Android et iOS", "Firebase : Firestore, Cloud Functions, Storage, FCM", "API REST sécurisées", "SQLite / IndexedDB pour le mode hors-ligne", "Paiements : Stripe, CinetPay, FedaPay, PayPal, Mobile Money", "Notifications push (FCM) et e-mails transactionnels", "Google Play Console et distribution APK signée"]',
  industries_json = '["Commerce et vente", "Restauration et hôtellerie", "Transport et logistique", "Éducation", "Santé", "Finance et microfinance", "Associations et événementiel"]',
  benefits_md = '- **Vos clients vous ont dans la poche** : icône sur l''écran d''accueil, notifications directes, pas de concurrence avec d''autres sites.
- **Fonctionne avec une connexion faible** : mode hors-ligne, données compressées, reprise automatique.
- **Un seul investissement bien placé** : nous recommandons le format réellement utile — parfois une PWA suffit, et nous le disons.
- **L''expérience de nos propres produits** : FAD CARD, Tile et QRFAD sont exploités par nos équipes au quotidien avec ces mêmes technologies.
- **Évolutions planifiées** : mise à jour trimestrielle, comme nos plateformes.',
  deliverables_md = '- Application publiée (Google Play, APK signé ou PWA installable)
- Back-end et tableau de bord d''administration
- Comptes développeur configurés et transférés à votre propriété
- Documentation d''exploitation et guide utilisateur en français
- Formation de vos équipes
- Plan de maintenance et d''évolution trimestriel'
WHERE slug = 'applications-mobiles';

UPDATE services SET image_key = '/assets/images/services/seo-marketing.jpg', og_image = '/assets/images/services/seo-marketing.jpg',
  methodology_md = '### 1. Audit de visibilité
État des lieux complet : technique, contenu, concurrence locale, recherche mobile. Vous savez où vous êtes et ce qui rapporte.

### 2. Fondations techniques
Vitesse, adaptation mobile, données structurées (JSON-LD), sitemap, indexation : le socle qui rend votre site lisible par Google — le même socle que nos plateformes.

### 3. Contenu qui répond aux vraies questions
Nous rédigeons ou retravaillons vos pages et articles autour de ce que vos clients cherchent réellement, en français et dans les formulations du terrain.

### 4. Notoriété locale et réseaux
Fiche Google Business, annuaires locaux, cohérence Facebook / YouTube / TikTok : la visibilité se construit aussi hors du site.

### 5. Mesure et amélioration continue
Rapports clairs (trafic, positions, demandes reçues), décisions par les chiffres, ajustements mensuels.',
  process_md = '**Accompagnement type :**

- **Mois 1** — audit complet, corrections techniques prioritaires, mots-clés
- **Mois 2** — optimisation des pages clés, données structurées, contenus
- **Mois 3** — contenus récurrents, Google Business, netlinking local
- **En continu** — rapport mensuel, ajustements, nouveaux contenus',
  includes_json = '["Audit SEO technique et éditorial complet", "Recherche de mots-clés par marché et par langue", "Optimisation des pages (titres, descriptions, structure)", "Données structurées JSON-LD et sitemap", "Vitesse de chargement et Core Web Vitals", "Google Business Profile et référencement local", "Stratégie et rédaction de contenus (articles, pages)", "Cohérence et habillage des réseaux sociaux", "Rapport mensuel de positions et de trafic"]',
  tech_json = '["Google Search Console", "Google Analytics", "Lighthouse et PageSpeed Insights", "Données structurées schema.org (JSON-LD)", "Sitemap XML et flux RSS", "Google Business Profile", "Meta (Facebook), YouTube, TikTok", "Outils d''analyse de mots-clés"]',
  industries_json = '["PME et commerces", "Hôtellerie et restauration", "Immobilier", "Éducation et formation", "Santé", "Services professionnels", "Artisans et créateurs"]',
  benefits_md = '- **Des clients qui vous trouvent** : apparaître quand on cherche votre activité à Bamako, Abidjan ou Dakar.
- **Un trafic durable** : le référencement naturel continue de travailler après la campagne, contrairement à la publicité.
- **Des décisions par les chiffres** : rapport mensuel clair, sans jargon — positions, visites, demandes reçues.
- **La méthode de nos propres marques** : les fiches produits et articles de Green FAD appliquent exactement ce socle (JSON-LD, sitemap, Core Web Vitals).
- **Budget en XOF, engagements claires** : pas de promesse miracle, un plan et des livrables.',
  deliverables_md = '- Rapport d''audit initial avec priorités chiffrées
- Pages optimisées et données structurées en place
- Calendrier éditorial et contenus publiés
- Fiches locales (Google Business) créées ou corrigées
- Rapport mensuel : positions, trafic, actions du mois suivant'
WHERE slug = 'seo-marketing-digital';

UPDATE services SET image_key = '/assets/images/services/print-communication.jpg', og_image = '/assets/images/services/print-communication.jpg',
  methodology_md = '### 1. Écoute et positionnement
Votre activité, vos clients, votre différence : nous formulons un message clair avant de dessiner quoi que ce soit.

### 2. Identité visuelle
Logo, palette, typographies et règles d''usage réunis dans une charte simple à appliquer partout — du panneau au profil TikTok.

### 3. Conception des supports
Maquettes réelles (pas de modèles génériques), relectures avec vous, bon à tirer signé avant impression.

### 4. Production et livraison
Impression chez nos partenaires, contrôle qualité des épreuves, livraison à Bamako ou expédition.

### 5. Déclinaison numérique
Les mêmes visuels adaptés aux réseaux sociaux, aux e-mails et à vos documents — une image cohérente partout.',
  process_md = '**Projet type — identité + supports :**

- **Semaine 1** — brief, positionnement, propositions de direction artistique
- **Semaine 2** — conception du logo et de la charte, allers-retours
- **Semaines 3-4** — supports print et déclinaisons numériques
- **Semaine 5** — bon à tirer, impression, livraison',
  includes_json = '["Création ou refonte de logo", "Charte graphique complète (couleurs, typographies, usages)", "Cartes de visite, flyers, dépliants", "Affiches, bâches et panneaux", "Brochures, catalogues et dossiers de présentation", "Cartes NFC physiques personnalisées (technologie FAD CARD)", "Habillage réseaux sociaux (profils, bannières, modèles de publications)", "Signalétique et supports événementiels", "Suivi d''impression et contrôle qualité"]',
  tech_json = '["Adobe Photoshop, Illustrator, InDesign", "Création vectorielle et mise en page professionnelle", "Gestion des couleurs pour l''impression (CMJN)", "Impression numérique et grand format", "Technologie NFC / RFID pour cartes physiques", "Mockups et prototypage de supports"]',
  industries_json = '["PME et commerces", "Restaurants et hôtels", "Événementiel", "Associations et ONG", "Écoles et centres de formation", "Artisans et créateurs", "Églises et communautés"]',
  benefits_md = '- **Une image professionnelle partout** : du carton d''invitation au profil Facebook, la même qualité.
- **Un seul interlocuteur** : design, impression et déclinaisons numériques chez la même équipe.
- **Le lien avec votre outil digital** : vos cartes imprimées peuvent embarquer la technologie NFC de FAD CARD — la carte papier qui se met à jour.
- **Des fichiers à vous** : vous recevez les sources et les formats d''impression, réutilisables par n''importe quel prestataire.
- **Délais et budget clairs** : devis fixe, bon à tirer avant impression.',
  deliverables_md = '- Logo dans tous les formats (vectoriel, web, impression) 
- Charte graphique PDF
- Supports imprimés livrés (quantité convenue au devis)
- Fichiers sources et prêts à imprimer (PDF HD, CMJN)
- Kit réseaux sociaux (avatars, bannières, modèles)
- Bon à tirer signé et archivé pour les réimpressions'
WHERE slug = 'impression-communication';

-- 3) FAQ ciblées : catégorie « service:<slug> » (fiche expertise) et « produit:<slug> » (fiche produit)
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES
('Combien coûte un site web chez GREEN FAD ?', 'Chaque projet fait l''objet d''un devis détaillé en XOF, fixe et sans surprise. Un site vitrine professionnel démarre à quelques centaines de milliers de FCFA ; une plateforme métier est chiffrée après l''audit. Le devis liste exactement ce qui est inclus.', 'service:developpement-web', 0, 'publie'),
('Combien de temps pour mettre mon site en ligne ?', 'Un site vitrine : 3 à 5 semaines. Une plateforme métier avec administration : 8 à 12 semaines. Nous livrons par étapes avec prévisualisation en continu — vous suivez l''avancement chaque semaine.', 'service:developpement-web', 1, 'publie'),
('Pourrai-je modifier moi-même le contenu de mon site ?', 'Oui. Chaque site est livré avec une interface d''administration en français : textes, images, articles et menus se modifient sans compétence technique, avec une formation incluse à la livraison.', 'service:developpement-web', 2, 'publie'),
('Que se passe-t-il après la mise en ligne ?', 'Une garantie de correction est incluse. Ensuite, la maintenance (mises à jour, sauvegardes, petites évolutions) est proposée par abonnement mensuel — et vous restez propriétaire de votre site et de vos données.', 'service:developpement-web', 3, 'publie'),
('Faut-il forcément une application native ?', 'Non. Pour beaucoup d''usages, une application progressive (PWA) installable suffit : elle s''installe depuis le navigateur, sans store, et coûte moins cher. Nous recommandons le format adapté à votre besoin — pas le plus coûteux.', 'service:applications-mobiles', 0, 'publie'),
('L''application fonctionnera-t-elle avec une connexion faible ?', 'C''est notre priorité de conception : données compressées, mode hors-ligne pour les fonctions essentielles, reprise automatique. Nos tests incluent des téléphones d''entrée de gamme et des réseaux 3G du terrain.', 'service:applications-mobiles', 1, 'publie'),
('Peut-on payer dans l''application avec Orange Money ou Wave ?', 'Oui. Nous intégrons les solutions locales (Mobile Money) et internationales (Stripe, CinetPay, FedaPay, PayPal) — la même infrastructure de paiement que nos propres produits.', 'service:applications-mobiles', 2, 'publie'),
('Qui publie l''application sur Google Play ?', 'Nous nous chargeons de la publication avec votre compte développeur (que nous créons avec vous et qui reste votre propriété), ou nous vous remettons un APK signé pour une distribution directe.', 'service:applications-mobiles', 3, 'publie'),
('En combien de temps verrai-je des résultats SEO ?', 'Les corrections techniques agissent en quelques semaines ; les positions significatives demandent généralement 3 à 6 mois selon la concurrence locale. Nous fixons des objectifs mesurables dès le départ et rendons compte chaque mois.', 'service:seo-marketing-digital', 0, 'publie'),
('Que comprend le rapport mensuel ?', 'Positions des mots-clés suivis, trafic du site, requêtes qui amènent des visiteurs, actions réalisées le mois écoulé et plan du mois suivant — en français, lisible sans connaissances techniques.', 'service:seo-marketing-digital', 1, 'publie'),
('Travaillez-vous aussi les réseaux sociaux ?', 'Oui : cohérence de l''image de marque, habillage des profils, modèles de publications et stratégie de contenu pour Facebook, YouTube et TikTok — les plateformes réellement utilisées par vos clients.', 'service:seo-marketing-digital', 2, 'publie'),
('Mon site actuel peut-il être optimisé, ou faut-il le refaire ?', 'Dans la plupart des cas, un site existant peut être optimisé : vitesse, structure, contenus. L''audit initial tranche honnêtement — si une refonte est plus rentable, nous le démontrons chiffres à l''appui.', 'service:seo-marketing-digital', 3, 'publie'),
('Faites-vous l''impression ou seulement le design ?', 'Les deux : nous concevons les supports et assurons l''impression chez nos partenaires à Bamako, avec contrôle qualité et livraison. Vous pouvez aussi ne prendre que les fichiers prêts à imprimer.', 'service:impression-communication', 0, 'publie'),
('Combien de propositions de logo recevons-nous ?', 'Deux à trois directions artistiques distinctes au premier tour, puis autant d''allers-retours que nécessaire jusqu''au choix final — défini contractuellement dans le devis.', 'service:impression-communication', 1, 'publie'),
('Qu''est-ce qu''une carte NFC personnalisée ?', 'Une carte physique qui, au contact d''un téléphone, ouvre votre profil professionnel en ligne (coordonnées, liens, boutique). C''est la technologie de FAD CARD : la carte ne se périme pas et son contenu se met à jour en ligne.', 'service:impression-communication', 2, 'publie'),
('Livrez-vous en dehors de Bamako ?', 'Oui : livraison à Bamako, expédition vers les autres villes du Mali et vers nos marchés (Burkina Faso, Niger, RD Congo, Côte d''Ivoire) selon le devis.', 'service:impression-communication', 3, 'publie'),
('Que contient exactement l''offre gratuite de FAD CARD ?', 'Le plan Starter est gratuit : votre carte de visite numérique avec QR code et lien public, la prise de rendez-vous et l''accès de base aux applications. Les plans Pro (15 000 XOF/mois) et Business (45 000 XOF/mois) débloquent les designs premium, l''analytique avancée et les fonctions d''encaissement.', 'produit:fad-card', 0, 'publie'),
('Comment obtenir une carte NFC physique ?', 'Depuis votre tableau de bord FAD CARD, commandez votre carte NFC personnalisée : elle est imprimée avec votre design, programmée sur votre profil et expédiée. Au contact d''un téléphone, votre profil s''ouvre — vos informations restent à jour même si elles changent.', 'produit:fad-card', 1, 'publie'),
('FAD CARD fonctionne-t-il en dehors du Mali ?', 'Oui. La plateforme est une application web progressive accessible partout, avec validation de numéros dans 66 pays et plus de 40 devises pour les paiements — pensée pour la diaspora comme pour le marché local.', 'produit:fad-card', 2, 'publie'),
('Les six applications partagent-elles mes données ?', 'Votre identité est unique et vous n''entrez vos informations qu''une fois, mais chaque application (Market, Tickets, Fund, Vote, Pay, vCard) dispose de son propre tableau de bord avec des données strictement isolées.', 'produit:fad-card', 3, 'publie'),
('Comment fonctionne le menu QR de QRFAD ?', 'Un QR code est imprimé et posé sur les tables. Le client le scanne avec son téléphone : le menu à jour s''ouvre dans le navigateur, sans application à installer. Vous modifiez prix et plats depuis votre tableau de bord — le menu est immédiatement à jour partout.', 'produit:qrfad', 0, 'publie'),
('Peut-on recevoir les commandes sur WhatsApp ?', 'Oui : le client commande depuis le menu numérique et la commande arrive directement sur le WhatsApp de l''établissement — un canal que votre personnel utilise déjà, sans matériel supplémentaire.', 'produit:qrfad', 1, 'publie'),
('QRFAD convient-il aux hôtels ?', 'Oui : au-delà des menus, QRFAD gère les services en chambre, les réservations et la caisse (POS) des restaurants d''hôtel, multi-établissements. Le portail public permet aussi d''explorer les établissements partenaires en ligne.', 'produit:qrfad', 2, 'publie'),
('Que se passe-t-il si Internet tombe pendant le service ?', 'Les QR codes continuent d''afficher le menu (page légère, rechargement automatique). La prise de commande hors-ligne et la caisse sont conçues pour les réalités de connectivité du terrain.', 'produit:qrfad', 3, 'publie'),
('Qu''est-ce que Tile, le Réseau du Progrès ?', 'Tile est le réseau social panafricain de Green FAD : flux vidéo courts (Pour toi, Réseau, Certifié), Explorer, chat, stories et un portefeuille créateur — la communauté africaine qui progresse ensemble, depuis Bamako.', 'produit:tile', 0, 'publie'),
('Sur quels appareils Tile est-il disponible ?', 'Tile est disponible sur Android (Google Play et APK signé) et sur iOS, avec une version web installable. Elle est pensée pour une expérience fluide sur tous les téléphones.', 'produit:tile', 1, 'publie'),
('Comment les créateurs gagnent-ils sur Tile ?', 'Chaque créateur dispose d''un portefeuille : gains d''engagement, cadeaux de la communauté, abonnements d''abonnés et retraits encadrés. Les paiements passent par des fournisseurs vérifiés (Stripe, CinetPay, FedaPay, PayPal) selon votre pays.', 'produit:tile', 2, 'publie'),
('Qu''est-ce que CloudAf ?', 'CloudAf est la plateforme cloud africaine de Green FAD : créez, déployez et faites évoluer vos applications sans vous soucier de l''infrastructure — serveurs, sécurité et mise à l''échelle sont gérés, vous restez concentré sur votre produit.', 'produit:cloudaf', 0, 'publie'),
('Qu''est-ce que l''Agent CloudAf ?', 'L''Agent CloudAf est l''assistant intégré à l''IA qui construit votre projet avec vous : il comprend votre besoin, génère l''application et vous accompagne du premier écran au déploiement — en français, sans être développeur.', 'produit:cloudaf', 1, 'publie'),
('CloudAf convient-il à une petite entreprise ?', 'Oui : c''est précisément sa raison d''être. Une PME lance un outil interne ou un site client sans acheter de serveur ni recruter d''administrateur système, et paie ce qu''elle utilise — avec un support en français basé à Bamako.', 'produit:cloudaf', 2, 'publie');

-- 4) Accès administrateur : mot de passe réinitialisé (hash PBKDF2-SHA-256, 100 000 itérations)
UPDATE users SET password_hash = 'd6kfXMH5F1EULYNy8KBx5dkq3KTXLZwLnftlRtql2Pg=',
  password_salt = 'D8Zbv690aiCIQFxhCmMlzg==', must_change_password = 0, is_active = 1
WHERE email = 'contact@greenfad.tech';

-- 5) Version du contenu
UPDATE settings SET value = '5' WHERE key = 'content_version';

-- =====================================================================
-- DELTA v6 — nouveau produit PAYGFAD (paygfad.com) : fiche produit,
--          article de blog, FAQ, médias, accueil à 5 plateformes, version 6
-- =====================================================================

-- ============ PAYGFAD — suite digitale SaaS (paygfad.com) ============
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, modules_md, use_cases_md, ux_md, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image, links_json, versions_json, external_url, related_service_id) VALUES (
  'paygfad', 'PAYGFAD', 'La suite digitale qui transforme l''Afrique',
  'PAYGFAD est la suite de gestion SaaS de Green FAD, conçue pour les entreprises, coopératives, institutions financières et établissements scolaires d''Afrique. Elle réunit cinq modules — **ERP**, **Finance**, **Energy**, **Agro** et **School** — dans une seule plateforme cloud, utilisable depuis n''importe quel navigateur de smartphone, sans application à installer.

Le socle est le même partout : tableau de bord de suivi, gestion des clients, des stocks et des factures, paiements **PAYG** (Pay As You Go) et journal d''audit complet. À cela s''ajoutent, selon le module : gestion des prêts et de l''épargne pour les institutions financières, kits solaires et activations pour les opérateurs d''énergie, parcelles agricoles et récoltes pour les coopératives, élèves, notes, bulletins, présences et scolarités pour les écoles.

Chaque organisation démarre avec un seul module et ajoute les autres à son rythme — l''essai gratuit de 30 jours ne demande aucune carte bancaire.',
  'Sur le terrain, la même organisation jongle avec des cahiers, des fichiers Excel et plusieurs outils qui ne se parlent pas : clients dans un carnet, stocks approximatifs, factures manuelles, paiements suivis à part. Les logiciels classiques coûtent cher, exigent un serveur, un technicien — et tombent en panne dès que la connexion faiblit.',
  'Une suite cloud modulaire, pensée pour les smartphones et les réalités de connectivité du continent : chaque organisation africaine — de la coopérative agricole au groupe scolaire — pilote toute son activité depuis un navigateur, hors ligne comme en ligne, sans infrastructure à gérer.',
  'PAYGFAD est développée et exploitée par Green FAD SARL depuis Bamako. Présente en ligne depuis 2024 (© 2024–2026), la suite a été construite au contact direct des coopératives, écoles, institutions financières et opérateurs d''énergie solaire du Mali et de la sous-région.',
  'SaaS de gestion pour organisations', 'Entreprises, coopératives, institutions financières, établissements scolaires, coopératives agricoles, opérateurs d''énergie solaire',
  '["Tableau de bord de suivi de l''activité", "Gestion des clients, des stocks et des factures", "Gestion des paiements PAYG (Pay As You Go)", "Finance : prêts et épargne pour institutions financières", "Energy : kits solaires et activations", "Agro : membres de coopératives, parcelles agricoles, récoltes, équipements", "School : élèves, notes, bulletins, présences, scolarités", "Encaissement Mobile Money : Orange Money, Wave, MTN, Moov — plus espèces et crédit", "Interface optimisée smartphone, sans application à installer", "Fonctionnement hors ligne avec synchronisation", "Sécurité : chiffrement, authentification à deux facteurs (2FA), audit complet des actions", "Multilingue : français, anglais et langues locales", "Cloud SaaS : aucune infrastructure à gérer, modularité par module"]',
  '**Cinq modules, une seule plateforme :**

- **ERP** — clients, stocks, factures et tableau de bord de l''activité
- **Finance** — prêts, épargne et paiements PAYG pour institutions financières
- **Energy** — kits solaires, activations et suivi des clients PAYG
- **Agro** — coopératives : membres, parcelles, récoltes et équipements
- **School** — élèves, notes, bulletins, présences et scolarités', '- Une coopérative agricole tient le registre de ses membres, de ses parcelles et de ses récoltes — et suit ses équipements
- Un opérateur d''énergie solaire active et suit ses kits solaires, avec encaissement PAYG par Mobile Money
- Une institution de microfinance gère ses prêts et son épargne, avec audit complet des opérations
- Un groupe scolaire gère élèves, notes, bulletins, présences et recouvrement des scolarités
- Une PME pilote clients, stocks et factures depuis son smartphone, même hors ligne', 'Utilisable depuis n''importe quel navigateur de smartphone — aucune application à installer. Interface conçue pour les petits écrans et les connexions instables : fonctionnement hors ligne, données sécurisées par chiffrement, connexion en deux étapes (2FA) et journal d''audit complet.',
  'Toute l''activité de l''organisation dans un seul outil : moins d''erreurs, moins de double saisie, des chiffres fiables à tout moment. Le cloud SaaS supprime l''achat de serveur et le technicien informatique : on paie l''abonnement, la suite est maintenue et évolue. L''essai gratuit de 30 jours, sans carte bancaire, permet de valider avant d''engager.', 'Née du terrain africain et supportée localement : encaissement Orange Money, Wave, MTN et Moov en plus des espèces et du crédit, interface trilingue français / anglais / langues locales, fonctionnement hors ligne réel, essai gratuit de 30 jours sans carte — et un support basé à Bamako, joignable au +223 72 35 76 41.',
  'Suite SaaS de gestion', 'disponible', '/assets/images/portfolio/paygfad.jpg', 'grid', 4, 'publie', datetime('now'),
  'PAYGFAD — La suite digitale qui transforme l''Afrique | Green FAD', 'PAYGFAD : suite SaaS de Green FAD avec 5 modules (ERP, Finance, Energy, Agro, School) — clients, stocks, factures, paiements PAYG, hors-ligne, Mobile Money (Orange Money, Wave, MTN, Moov), essai gratuit 30 jours. 7 pays couverts.', '/assets/images/portfolio/paygfad.jpg',
  '[{"label": "Ouvrir PayGfad", "url": "https://paygfad.com/"}, {"label": "Demander un accès", "url": "https://paygfad.com/"}, {"label": "info@paygfad.com", "url": "mailto:info@paygfad.com"}]', '[{"version": "2024", "date": "2024", "note": "Mise en ligne de la suite par Green FAD SARL — présence attestée © 2024–2026 sur paygfad.com."}, {"version": "2026", "date": "Novembre 2026", "note": "Cinq modules proposés : ERP, Finance, Energy, Agro, School. Essai gratuit de 30 jours, encaissement Mobile Money, 7 pays couverts (Mali, Guinée, Burkina Faso, Sénégal, Côte d''Ivoire, RD Congo, Niger)."}]', 'https://paygfad.com/',
  NULL);

-- Ordre du catalogue : PayGfad suit Tile et CloudAf parmi les nouvelles plateformes
UPDATE products SET sort_order = 5 WHERE slug = 'ferefad';
UPDATE products SET sort_order = 6 WHERE slug = 'amitie-fad';
UPDATE products SET sort_order = 7 WHERE slug = 'niafad';
UPDATE products SET sort_order = 8 WHERE slug = 'sarapay';
UPDATE products SET sort_order = 9 WHERE slug = 'carte-sante';

-- ---------- WARIPAY (phase de test — production après conformités et partenariats financiers) ----------
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, modules_md, use_cases_md, ux_md, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image, links_json, versions_json, external_url, related_service_id) VALUES (
  'waripay', 'WARIPAY', 'Une API. Tous les paiements d''Afrique de l''Ouest.',
  'WARIPAY est une infrastructure de paiement pour l''Afrique de l''Ouest : une seule intégration connecte votre entreprise, votre marketplace ou votre plateforme à **Orange Money**, **Moov Money**, **Wave**, **MTN MoMo**, **Visa**, **Mastercard** et aux **banques UEMOA** — collecte, retraits, réconciliation et settlement unifiés.

Le marchand pilote tout depuis une console unique : KPI en temps réel (volume, taux de succès, soldes, frais), répartition par provider, liens de paiement avec QR, checkout hébergé mobile-first, retraits vers un compte bancaire UEMOA ou vers le mobile money — avec frais, plafonds et délais affichés avant chaque confirmation. Chaque mouvement financier transite par un registre en double partie, réconciliable à tout instant.

Le lancement commercial démarre au Mali ; le Sénégal, la Côte d''Ivoire, le Burkina Faso, le Bénin, le Togo, la Guinée-Bissau et le Niger suivent. WARIPAY est actuellement **en phase de test** : la mise en production suivra la finalisation des conformités et des partenariats financiers.',
  'Encaisser en Afrique de l''Ouest suppose d''agréger à la main chaque opérateur : une intégration par provider, des réconciliations sur tableur, des retraits multi-canaux, des frais opaques et des semaines de travail avant le premier paiement encaissé.',
  'Un pipeline unique de bout en bout — une API, plusieurs providers, plusieurs moyens de paiement, un dashboard, une réconciliation, un settlement.',
  'Développée par Green FAD à Bamako, WARIPAY est entrée en phase de test publique : API en mode sandbox, checkout hébergé, application Android v1.0.3 et connecteur WooCommerce v1.0.0 opérationnels. La mise en production suivra la finalisation des conformités et des partenariats financiers.',
  'Fintech — infrastructure de paiement', 'Entreprises & grands comptes, marchands & e-commerce, développeurs & plateformes',
  '["Une seule intégration : Orange Money, Moov Money, Wave, MTN MoMo, Visa, Mastercard, banques UEMOA", "Encaissement par push marchand, USSD, carte bancaire ou virement", "Checkout hébergé mobile-first et liens de paiement partageables avec QR", "Retraits au choix : virement bancaire UEMOA (T+1 ouvré) ou mobile money (instantané), frais et plafonds affichés avant confirmation", "Payouts individuels et massifs (CSV, batch) vers banque ou wallet", "Remboursements totaux ou partiels selon le provider", "Moteur de routage : les providers dégradés sont écartés automatiquement", "Ledger en double partie : chaque mouvement rapproché du provider, réconciliation sans export manuel", "API REST/JSON prévisible : erreurs typées, idempotence, timeline par transaction, webhooks signés avec retries", "Clés sandbox immédiates, clés d''API hachées et révocables à chaud, MFA administrateur", "Console marchande : KPI temps réel, répartition par provider, rapports, rôles et journal d''audit", "Application Android v1.0.3 (notifications natives, QR et deep links) et connecteur WooCommerce v1.0.0"]',
  '**Une console, quatre espaces :**

- **Pilotage** — vue d''ensemble, transactions, paiements
- **Opérations** — retraits, remboursements, clients, solde & settlement, rapports
- **Encaisser** — liens de paiement, checkout hébergé ou embarquable
- **Développeurs** — API & docs, clés API, webhooks, sandbox', '- Une entreprise centralise l''encaissement de ses filiales et pilote sa trésorerie depuis un registre unique, avec payouts massifs et piste d''audit complète
- Un commerce crée un lien de paiement en un clic, encaisse par mobile money ou carte et retire ses fonds vers sa banque ou son wallet quand il le souhaite
- Une plateforme logicielle intègre l''API en quelques heures : clés sandbox immédiates, webhooks signés, composant de checkout embarquable',
  'Console web responsive et application Android (7.0+) avec les mêmes comptes et les mêmes données. Environnements Sandbox et Live séparés ; chaque opération financière est idempotente et horodatée.',
  'Une intégration au lieu de plusieurs, des frais affichés avant chaque validation (aucun coût caché), une réconciliation automatique, des fonds retirables au canal de son choix, et un support opérationnel basé dans la région.',
  'Conçue au Mali pour l''espace UEMOA : 9+ providers derrière une seule abstraction, couverture pays annoncée (Mali d''abord, puis Sénégal, Côte d''Ivoire, Burkina Faso, Bénin, Togo, Guinée-Bissau, Niger), tarification transparente (Starter 2,5 %, Croissance 1,8 %, Entreprise 2,8 %) et vérification KYB des marchands.',
  'Infrastructure de paiement', 'bientot', '/assets/images/products/waripay-banniere.jpg', 'wallet', 10, 'publie', datetime('now'),
  'WARIPAY — Une API. Tous les paiements d''Afrique de l''Ouest | Green FAD', 'Waripay connecte entreprises, marchands et plateformes à Orange Money, Moov Money, Wave, MTN MoMo, Visa, Mastercard et banques UEMOA avec une seule intégration : collecte, retraits, réconciliation, settlement. En phase de test — bientôt disponible.', '/assets/images/products/waripay-banniere.jpg',
  '[]', '[{"version": "v1.0", "date": "Novembre 2026", "note": "Phase de test publique : API en mode sandbox, checkout hébergé, liens de paiement, application Android 1.0.3 et connecteur WooCommerce 1.0.0. La mise en production suivra la finalisation des conformités et des partenariats financiers."}]', '',
  (SELECT id FROM services WHERE slug = 'developpement-web'));

INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/waripay-banniere.jpg', 'waripay-banniere.jpg', 'image/jpeg', 0, NULL, NULL, 'WARIPAY — infrastructure de paiement pour l''Afrique de l''Ouest', '/', 'seed', datetime('now'));
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'WARIPAY — infrastructure de paiement', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 15, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/products/waripay-banniere.jpg';
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'waripay'), mi.id, 0 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/products/waripay-banniere.jpg';

UPDATE products SET screenshots_json = '[{"key":"/assets/images/products/waripay-desktop-01.jpg","type":"desktop","alt":"WARIPAY — accueil « Une API. Tous les paiements d''Afrique de l''Ouest. » avec terminal de premier paiement"},{"key":"/assets/images/products/waripay-desktop-02.jpg","type":"desktop","alt":"WARIPAY — aperçu de l''interface marchande : volume, taux de succès, solde et répartition par provider (données de démonstration)"},{"key":"/assets/images/products/waripay-desktop-03.jpg","type":"desktop","alt":"WARIPAY — trois profils servis : entreprises & grands comptes, marchands & e-commerce, développeurs & plateformes"},{"key":"/assets/images/products/waripay-desktop-04.jpg","type":"desktop","alt":"WARIPAY — la vision : une API, plusieurs providers, plusieurs moyens de paiement, un dashboard, une réconciliation, un settlement"},{"key":"/assets/images/products/waripay-desktop-05.jpg","type":"desktop","alt":"WARIPAY — moyens de paiement intégrés : Orange Money, Moov Money, Wave, MTN MoMo, Visa, Mastercard, ORA Bank et Virement UEMOA"},{"key":"/assets/images/products/waripay-desktop-06.jpg","type":"desktop","alt":"WARIPAY — retraits : virement bancaire UEMOA ou mobile money, au choix du marchand"},{"key":"/assets/images/products/waripay-desktop-07.jpg","type":"desktop","alt":"WARIPAY — une API REST prévisible : idempotence, webhooks signés, composant wari.js, clés protégées"},{"key":"/assets/images/products/waripay-desktop-08.jpg","type":"desktop","alt":"WARIPAY — fondations de confiance : clés protégées, comptabilité par construction, conformité et contrôles, support opérationnel"},{"key":"/assets/images/products/waripay-desktop-09.jpg","type":"desktop","alt":"WARIPAY — tarification transparente : offres Starter 2,5 %, Croissance 1,8 % et Entreprise 2,8 %"},{"key":"/assets/images/products/waripay-desktop-10.jpg","type":"desktop","alt":"WARIPAY — application Android v1.0.3 : dashboard marchand, notifications natives, QR et deep links"},{"key":"/assets/images/products/waripay-desktop-11.jpg","type":"desktop","alt":"WARIPAY — console marchande, vue d''ensemble (environnement Sandbox de test)"},{"key":"/assets/images/products/waripay-desktop-12.jpg","type":"desktop","alt":"WARIPAY — console marchande, Checkout : page hébergée ou composant embarquable"},{"key":"/assets/images/products/waripay-mobile-01.jpg","type":"mobile","alt":"WARIPAY sur mobile — accueil"},{"key":"/assets/images/products/waripay-mobile-02.jpg","type":"mobile","alt":"WARIPAY sur mobile — moyens de paiement intégrés"},{"key":"/assets/images/products/waripay-mobile-03.jpg","type":"mobile","alt":"WARIPAY sur mobile — tarification transparente"},{"key":"/assets/images/products/waripay-mobile-04.jpg","type":"mobile","alt":"WARIPAY sur mobile — application Android"}]' WHERE slug = 'waripay';

INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/portfolio/paygfad.jpg', 'paygfad.jpg', 'image/jpeg', 0, NULL, NULL, 'PAYGFAD — suite digitale de gestion SaaS de Green FAD', '/', 'seed', datetime('now'));
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'PAYGFAD — la suite digitale qui transforme l''Afrique', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 12, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/portfolio/paygfad.jpg';
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'paygfad'), mi.id, 0 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/portfolio/paygfad.jpg';

INSERT INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_description, related_product_id) VALUES (
  'paygfad-lancement-suite-digitale', 'PayGfad rejoint les plateformes Green FAD : la suite digitale qui transforme l''Afrique', 'Avec PayGfad, Green FAD ouvre sa cinquième plateforme en ligne : une suite de gestion SaaS en cinq modules — ERP, Finance, Energy, Agro, School — pensée pour les entreprises, coopératives, institutions financières et écoles d''Afrique, hors ligne comme en ligne.',
  '# PayGfad rejoint les plateformes Green FAD : la suite digitale qui transforme l''Afrique

L''écosystème Green FAD s''agrandit : après QRFAD, FAD CARD, Tile et CloudAf, notre cinquième plateforme est en ligne. **PayGfad** (paygfad.com) est une suite de gestion SaaS complète, développée par nos équipes à Bamako pour les organisations africaines — entreprises, coopératives, institutions financières et établissements scolaires.

## Une suite, cinq modules

Chaque organisation démarre par le module dont elle a besoin, puis ajoute les autres à son rythme :

- **ERP** — tableau de bord de suivi, gestion des clients, des stocks et des factures
- **Finance** — gestion des prêts et de l''épargne, paiements PAYG (Pay As You Go)
- **Energy** — gestion des kits solaires et de leurs activations, pour les opérateurs PAYG
- **Agro** — membres de coopératives, parcelles agricoles, récoltes et équipements
- **School** — élèves, notes, bulletins, présences et scolarités

## Pensée pour le terrain, pas pour la démo

PayGfad fonctionne depuis le navigateur d''un smartphone, sans application à installer. Elle est conçue dès le départ pour les réalités du continent : **mode hors ligne**, interface adaptée aux petits écrans, données sécurisées par chiffrement, authentification à deux facteurs (2FA) et audit complet des actions. L''interface parle français, anglais et langues locales.

## Encaisser comme vos clients paient

La suite accepte les paiements **Orange Money, Wave, MTN et Moov**, en plus des espèces et du crédit — le même réalisme sur les moyens de paiement qui guide déjà FadCard Pay.

## Sept pays, un essai sans carte

PayGfad est proposée au **Mali, en Guinée, au Burkina Faso, au Sénégal, en Côte d''Ivoire, en RD Congo et au Niger**. L''essai gratuit de **30 jours** ne demande aucune carte bancaire, et le support est assuré depuis Bamako (info@paygfad.com, +223 72 35 76 41, du lundi au vendredi, 8h–18h).

## La famille s''agrandit, la logique reste

PayGfad suit la même règle que nos quatre premières plateformes : un produit réel, exploité au quotidien, amélioré à chaque trimestre, avec son parcours documenté dans ce blog. Bienvenue à PayGfad — et au travail.',
  '/assets/images/blog/paygfad-lancement.jpg', 'Produits', '["PayGfad", "Lancement", "SaaS", "Gestion"]', 'Green FAD — Équipe produit', 'article', 1, '2026-11-08 09:00:00', 'publie',
  'PayGfad : Green FAD lance sa 5e plateforme — suite SaaS en 5 modules (ERP, Finance, Energy, Agro, School), hors-ligne, Mobile Money, essai gratuit 30 jours, 7 pays.', (SELECT id FROM products WHERE slug = 'paygfad'));

INSERT INTO faqs (question, answer, category, sort_order, status) VALUES
('Qu''est-ce que PayGfad ?', 'PayGfad est la suite digitale SaaS de Green FAD pour les entreprises, coopératives, institutions financières et établissements scolaires d''Afrique. Elle réunit cinq modules — ERP (clients, stocks, factures), Finance (prêts, épargne, paiements PAYG), Energy (kits solaires), Agro (parcelles, récoltes, équipements) et School (élèves, notes, bulletins) — dans une seule plateforme cloud.', 'produit:paygfad', 0, 'publie'),
('Comment essayer PayGfad ?', 'L''essai est gratuit pendant 30 jours, sans carte bancaire : rendez-vous sur paygfad.com et cliquez sur « Demander un accès ». Le support (en français) est joignable au +223 72 35 76 41 et à info@paygfad.com, du lundi au vendredi, 8h–18h.', 'produit:paygfad', 1, 'publie'),
('Faut-il installer une application pour utiliser PayGfad ?', 'Non. PayGfad s''utilise depuis le navigateur du smartphone, avec une interface optimisée pour les petits écrans. Elle fonctionne aussi hors ligne et synchronise dès que la connexion revient — aucune application à installer, aucun serveur à acheter.', 'produit:paygfad', 2, 'publie'),
('Quels moyens de paiement accepte PayGfad ?', 'Orange Money, Wave, MTN et Moov pour l''encaissement Mobile Money, en plus des paiements en espèces et à crédit. La logique PAYG (Pay As You Go) permet de payer à l''usage, notamment pour les kits solaires.', 'produit:paygfad', 3, 'publie'),
('Dans quels pays PayGfad est-elle disponible ?', 'PayGfad est proposée au Mali, en Guinée, au Burkina Faso, au Sénégal, en Côte d''Ivoire, en République démocratique du Congo et au Niger — avec un support basé à Bamako, en français, anglais et langues locales.', 'produit:paygfad', 4, 'publie');

-- (Accueil mis à jour directement dans l'INSERT source ci-dessus : 5 plateformes)

-- Version du contenu
UPDATE settings SET value = '6' WHERE key = 'content_version';

-- Page d'accueil : 5 plateformes en ligne (hero, stats, cartes manuelles, catalogue)
UPDATE pages SET
  meta_title = 'GREEN FAD SARL — 5 plateformes en ligne : QRFAD, FadCard, Tile, CloudAf, PayGfad',
  meta_description = 'Entreprise technologique africaine depuis 2021 : QRFAD (restauration), FadCard (écosystème pro 6-en-1), Tile (réseau social), CloudAf (no-code + IA) et PayGfad (suite SaaS de gestion). Mises à jour chaque trimestre, produits et parcours documentés.',
  blocks = '[{"type": "hero", "variant": "gradient", "eyebrow": "GREEN FAD SARL — ENTREPRISE TECHNOLOGIQUE AFRICAINE", "title": "Cinq ans de produit. Cinq plateformes en ligne. Une ambition continentale.", "subtitle": "De QRFAD et FAD CARD, nées à Bamako en 2021 et mises à jour chaque trimestre, à TILE, CLOUDAf et PAYGFAD, nos dernières plateformes : nous concevons, développons et exploitons nos propres technologies.", "cta_label": "Découvrir nos plateformes", "cta_url": "/produits", "cta2_label": "Lire le blog", "cta2_url": "/blog"}, {"type": "stats", "variant": "dark", "items": [{"value": "5", "label": "Plateformes en ligne, accessibles publiquement"}, {"value": "5 ans", "label": "D''''itérations produit, mise à jour chaque trimestre"}, {"value": "6", "label": "Applications métier réunies dans FadCard"}, {"value": "9", "label": "Établissements équipés sur QRFAD"}]}, {"type": "section_header", "eyebrow": "Nos plateformes", "title": "Cinq plateformes, ouvertes au public", "text": "Chacune vit sa vie : fonctionnalités, mises à jour trimestrielles et parcours documentés dans notre blog.", "align": "center"}, {"type": "cards", "source": "manual", "limit": "5", "columns": "5", "items": [{"title": "QRFAD", "text": "Menus digitaux par QR, commandes WhatsApp, caisse POS et hôtellerie — pour les restaurants et hôtels d''''Afrique.", "image_key": "/assets/images/portfolio/qrfad.jpg", "url": "https://qrfad.com", "tag": "Restauration & hôtellerie"}, {"title": "FadCard", "text": "Six applications métier, un seul compte : vCard, Market, Tickets, Fund, Vote, FadCard Pay.", "image_key": "/assets/images/portfolio/fadcard.jpg", "url": "https://fadcard.greenfad.tech", "tag": "Écosystème professionnel"}, {"title": "Tile", "text": "Le Réseau du Progrès : vidéos, stories, flux Certifié et boutiques — Web, Android, iOS.", "image_key": "/assets/images/portfolio/tile.jpg", "url": "https://tileofficiel.com", "tag": "Nouveau · Réseau social"}, {"title": "CloudAf", "text": "Créez, déployez, scalez : no-code + code, agent IA, déploiement en un clic.", "image_key": "/assets/images/portfolio/cloudaf.jpg", "url": "https://cloudaf.net", "tag": "Nouveau · No-code & IA"}, {"title": "PayGfad", "text": "La suite digitale qui transforme l''Afrique : ERP, Finance, Energy, Agro, School — cloud, hors-ligne, Mobile Money.", "image_key": "/assets/images/portfolio/paygfad.jpg", "url": "https://paygfad.com", "tag": "Nouveau · Suite SaaS"}], "view_all_label": "Toutes nos plateformes", "view_all_url": "/produits"}, {"type": "timeline", "title": "Cinq ans d''''innovation, mise à jour après mise à jour", "items": [{"year": "2021", "title": "QRFAD & FAD CARD voient le jour à Bamako", "text": "Le menu numérique par QR code et la carte de visite connectée NFC sont lancés auprès du terrain."}, {"year": "2022", "title": "Les produits s''''enrichissent", "text": "QRFAD passe au multi-établissements — FadCard lance Market, sa vitrine marchande."}, {"year": "2023", "title": "Commandes & transactions", "text": "Commandes depuis le menu puis intégration WhatsApp sur QRFAD — Tickets puis Fund sur FadCard."}, {"year": "2024", "title": "Des plateformes complètes", "text": "QRFAD couvre l''''hôtellerie puis la caisse POS — FadCard complète sa suite avec Vote et FadCard Pay."}, {"year": "2025", "title": "Maturité & personnalisation", "text": "153 designs et cartes NFC pour FadCard — caisse consolidée et thèmes pour QRFAD."}, {"year": "2026", "title": "Tile & CloudAf : deux nouvelles plateformes", "text": "Le réseau social du progrès et la plateforme no-code + IA rejoignent l''''écosystème Green FAD."}]}, {"type": "section_header", "eyebrow": "Catalogue", "title": "Des produits nés sur le terrain", "text": "Chaque produit Green FAD répond à un besoin réel observé sur le terrain africain.", "align": "center"}, {"type": "cards", "source": "products", "limit": "10", "columns": 3, "view_all_label": "Voir tous les produits", "view_all_url": "/produits"}, {"type": "split", "title": "L''''alliance de la technologie et de l''''écologie", "text_md": "Fondée par des professionnels passionnés par l''''innovation et sensibles aux enjeux environnementaux, **GREEN FAD SARL** accompagne la transition numérique et écologique des organisations en Afrique.\n\n**Notre vision :** un avenir où technologie et durabilité vont de pair, réduisant la fracture numérique en Afrique.\n\n**Notre ambition :** porter nos propres innovations technologiques à l''''échelle internationale.", "image_key": "/assets/images/office-workers-africa.jpg", "image_side": "right", "cta_label": "Découvrir l''''entreprise", "cta_url": "/p/entreprise"}, {"type": "section_header", "eyebrow": "Expertises", "title": "Ce que nous faisons pour votre organisation", "align": "center"}, {"type": "cards", "source": "services", "limit": 4, "columns": 4, "view_all_label": "Toutes nos expertises", "view_all_url": "/expertises"}, {"type": "section_header", "eyebrow": "Le blog", "title": "Le parcours de nos produits, documenté", "text": "Lancements, mises à jour trimestrielles, coulisses d''''ingénierie : cinq ans d''''histoire produit racontés au fil des publications.", "align": "center"}, {"type": "cards", "source": "posts", "limit": 3, "columns": 3, "view_all_label": "Tous les articles", "view_all_url": "/blog"}, {"type": "gallery_album", "album_slug": "produits-green-fad", "limit": 6}, {"type": "countries_map"}, {"type": "cta", "title": "Construisons ensemble un avenir durable et digital", "text": "Parlons de votre projet — nos équipes vous répondent rapidement.", "button_label": "Démarrer la conversation", "button_url": "/contact", "variant": "solid"}]'
WHERE slug = 'accueil';

-- =====================================================================
-- DELTA v7 — prix FadCard 65 000 F CFA, contenu public éditable (héros +
--          frise chronologique), accueil « entreprise multi-projets », version 7
-- =====================================================================

-- 1) Tarification FadCard mise à jour : 65 000 F CFA (produits, études de cas, FAQ)
--    NB : replace() sans clause WHERE (D1 refuse les motifs LIKE longs) — sans effet si absent.
UPDATE products SET differentiators_md = replace(differentiators_md, '(Starter gratuit, Pro 15 000 XOF/mois, Business 45 000 XOF/mois)', '(abonnement actuel : 65 000 F CFA)');
UPDATE projects SET content_md = replace(content_md, '(Starter gratuit, Pro 15 000 XOF/mois, Business 45 000 XOF/mois)', '(abonnement actuel : 65 000 F CFA)');
UPDATE projects SET need_md = replace(need_md, '(Starter gratuit, Pro 15 000 XOF/mois, Business 45 000 XOF/mois)', '(abonnement actuel : 65 000 F CFA)');
UPDATE projects SET approach_md = replace(approach_md, '(Starter gratuit, Pro 15 000 XOF/mois, Business 45 000 XOF/mois)', '(abonnement actuel : 65 000 F CFA)');
UPDATE projects SET solution_md = replace(solution_md, '(Starter gratuit, Pro 15 000 XOF/mois, Business 45 000 XOF/mois)', '(abonnement actuel : 65 000 F CFA)');
UPDATE projects SET results_md = replace(results_md, '(Starter gratuit, Pro 15 000 XOF/mois, Business 45 000 XOF/mois)', '(abonnement actuel : 65 000 F CFA)');
UPDATE faqs SET answer = 'Oui. Les cartes NFC physiques sont disponibles sur commande — via votre tableau de bord FadCard ou en écrivant à contact@fadcard.com. La carte reste toujours à jour : les informations se modifient en ligne, sans réimpression.' WHERE category = 'produit:fad-card' AND question = 'Puis-je obtenir une carte NFC physique ?';
UPDATE faqs SET answer = 'L''abonnement FadCard est aujourd''hui de 65 000 F CFA : il donne accès aux 153 designs premium, à l''analytique avancée, à la prise de rendez-vous, aux cartes NFC et aux fonctions d''encaissement (FadCard Pay). Écrivez à contact@fadcard.com pour activer votre compte ou obtenir les détails.' WHERE category = 'produit:fad-card' AND question = 'Combien coûte FadCard ?';
DELETE FROM faqs WHERE category = 'produit:fad-card' AND question = 'Que contient exactement l''offre gratuite de FAD CARD ?';

-- 2) Contenu public éditable (Admin → Paramètres) : frise chronologique par défaut
INSERT OR REPLACE INTO settings (key, value) VALUES ('content_overrides', '{"heroes": {}, "timeline": [{"year": "2021", "title": "Les fondations", "text": "Lancement de QRFAD (mars) et FAD CARD (mai) à Bamako : le menu par QR code et la carte de visite numérique NFC."}, {"year": "2022", "title": "Des produits qui s''élargissent", "text": "QRFAD passe au multi-établissements ; FadCard ouvre Market, sa vitrine marchande."}, {"year": "2023", "title": "Transactions & commandes", "text": "Commandes depuis le menu puis WhatsApp sur QRFAD ; Tickets puis Fund sur FadCard."}, {"year": "2024", "title": "Plateformes complètes", "text": "Hôtellerie et caisse POS côté QRFAD ; Vote et FadCard Pay clôturent la suite FadCard. PayGfad, la suite de gestion SaaS, est mise en ligne."}, {"year": "2025", "title": "Maturité", "text": "153 designs et cartes NFC pour FadCard ; caisse consolidée et thèmes pour QRFAD."}, {"year": "2026", "title": "Tile, CloudAf & PayGfad", "text": "Le réseau social du progrès, la plateforme no-code + IA et la suite de gestion SaaS rejoignent l''écosystème — cinq plateformes en ligne."}]}');

-- 3) Page d'accueil : posture « entreprise multi-projets, aujourd'hui et demain »
UPDATE pages SET
  meta_title = 'GREEN FAD SARL — 5 plateformes en ligne : QRFAD, FadCard, Tile, CloudAf, PayGfad',
  meta_description = 'Green FAD SARL, entreprise technologique africaine aux projets multiples : QRFAD, FadCard, Tile, CloudAf et PayGfad en ligne, dix produits au catalogue, de nouveaux projets en préparation — mises à jour chaque trimestre depuis Bamako.',
  blocks = '[{"type": "hero", "variant": "gradient", "eyebrow": "GREEN FAD SARL — ENTREPRISE TECHNOLOGIQUE AFRICAINE", "title": "Une entreprise, plusieurs produits. Aujourd''hui cinq plateformes — demain d''autres.", "subtitle": "De QRFAD et FAD CARD, nées à Bamako en 2021, à TILE, CLOUDAf et PAYGFAD : chaque année apporte ses nouveaux produits — conçus, développés et exploités par nos équipes, et mis à jour chaque trimestre.", "cta_label": "Découvrir nos plateformes", "cta_url": "/produits", "cta2_label": "Lire le blog", "cta2_url": "/blog"}, {"type": "stats", "variant": "dark", "items": [{"value": "5", "label": "Plateformes en ligne, accessibles publiquement"}, {"value": "5 ans", "label": "D''''itérations produit, mise à jour chaque trimestre"}, {"value": "10", "label": "Produits au catalogue — et d''autres projets en préparation"}, {"value": "6", "label": "Applications métier réunies dans FadCard"}, {"value": "9", "label": "Établissements équipés sur QRFAD"}]}, {"type": "section_header", "eyebrow": "Nos plateformes", "title": "Cinq plateformes, ouvertes au public", "text": "Chacune vit sa vie : fonctionnalités, mises à jour trimestrielles et parcours documentés dans notre ", "align": "center"}, {"type": "cards", "source": "manual", "limit": "5", "columns": "5", "items": [{"title": "QRFAD", "text": "Menus digitaux par QR, commandes WhatsApp, caisse POS et hôtellerie — pour les restaurants et hôtels d''''Afrique.", "image_key": "/assets/images/portfolio/qrfad.jpg", "url": "https://qrfad.com", "tag": "Restauration & hôtellerie"}, {"title": "FadCard", "text": "Six applications métier, un seul compte : vCard, Market, Tickets, Fund, Vote, FadCard Pay.", "image_key": "/assets/images/portfolio/fadcard.jpg", "url": "https://fadcard.greenfad.tech", "tag": "Écosystème professionnel"}, {"title": "Tile", "text": "Le Réseau du Progrès : vidéos, stories, flux Certifié et boutiques — Web, Android, iOS.", "image_key": "/assets/images/portfolio/tile.jpg", "url": "https://tileofficiel.com", "tag": "Nouveau · Réseau social"}, {"title": "CloudAf", "text": "Créez, déployez, scalez : no-code + code, agent IA, déploiement en un clic.", "image_key": "/assets/images/portfolio/cloudaf.jpg", "url": "https://cloudaf.net", "tag": "Nouveau · No-code & IA"}, {"title": "PayGfad", "text": "La suite digitale qui transforme l''Afrique : ERP, Finance, Energy, Agro, School — cloud, hors-ligne, Mobile Money.", "image_key": "/assets/images/portfolio/paygfad.jpg", "url": "https://paygfad.com", "tag": "Nouveau · Suite SaaS"}], "view_all_label": "Toutes nos plateformes", "view_all_url": "/produits"}, {"type": "section_header", "visible": true, "eyebrow": "Notre modèle", "title": "Une entreprise aux projets multiples — aujourd''hui et demain", "align": "center"}, {"type": "richtext", "visible": true, "content_md": "Green FAD n''est pas une agence qui livre et part : c''est une maison de technologie qui **porte ses propres produits**. Chaque plateforme est un projet de long terme — lancé depuis Bamako, amélioré à chaque trimestre, documenté publiquement.\n\n- **Aujourd''hui** : cinq plateformes en ligne (QRFAD, FAD CARD, TILE, CLOUDAf, PAYGFAD) et dix produits au catalogue\n- **Depuis 2021** : un nouveau produit majeur rejoint régulièrement l''écosystème — 2026 a vu naître Tile, CloudAf et PayGfad\n- **Demain** : de nouveaux projets sont déjà en préparation dans nos équipes\n\nChoisir un produit Green FAD, c''est s''appuyer sur toute une maison de technologie — pas sur un logiciel isolé."}, {"type": "timeline", "title": "Cinq ans d''''innovation, mise à jour après mise à jour", "items": [{"year": "2021", "title": "QRFAD & FAD CARD voient le jour à Bamako", "text": "Le menu numérique par QR code et la carte de visite connectée NFC sont lancés auprès du terrain."}, {"year": "2022", "title": "Les produits s''''enrichissent", "text": "QRFAD passe au multi-établissements — FadCard lance Market, sa vitrine marchande."}, {"year": "2023", "title": "Commandes & transactions", "text": "Commandes depuis le menu puis intégration WhatsApp sur QRFAD — Tickets puis Fund sur FadCard."}, {"year": "2024", "title": "Des plateformes complètes", "text": "QRFAD couvre l''''hôtellerie puis la caisse POS — FadCard complète sa suite avec Vote et FadCard Pay."}, {"year": "2025", "title": "Maturité & personnalisation", "text": "153 designs et cartes NFC pour FadCard — caisse consolidée et thèmes pour QRFAD."}, {"year": "2026", "title": "Tile & CloudAf : deux nouvelles plateformes", "text": "Le réseau social du progrès et la plateforme no-code + IA rejoignent l''''écosystème Green FAD."}]}, {"type": "section_header", "eyebrow": "Catalogue", "title": "Des produits nés sur le terrain", "text": "Chaque produit Green FAD répond à un besoin réel observé sur le terrain africain.", "align": "center"}, {"type": "cards", "source": "products", "limit": "10", "columns": 3, "view_all_label": "Voir tous les produits", "view_all_url": "/produits"}, {"type": "split", "title": "L''''alliance de la technologie et de l''''écologie", "text_md": "Fondée par des professionnels passionnés par l''''innovation et sensibles aux enjeux environnementaux, **GREEN FAD SARL** accompagne la transition numérique et écologique des organisations en Afrique.\n\n**Notre vision :** un avenir où technologie et durabilité vont de pair, réduisant la fracture numérique en Afrique.\n\n**Notre ambition :** porter nos propres innovations technologiques à l''''échelle internationale.", "image_key": "/assets/images/office-workers-africa.jpg", "image_side": "right", "cta_label": "Découvrir l''''entreprise", "cta_url": "/p/entreprise"}, {"type": "section_header", "eyebrow": "Expertises", "title": "Ce que nous faisons pour votre organisation", "align": "center"}, {"type": "cards", "source": "services", "limit": 4, "columns": 4, "view_all_label": "Toutes nos expertises", "view_all_url": "/expertises"}, {"type": "section_header", "eyebrow": "Le blog", "title": "Le parcours de nos produits, documenté", "text": "Lancements, mises à jour trimestrielles, coulisses d''''ingénierie : cinq ans d''''histoire produit racontés au fil des publications.", "align": "center"}, {"type": "cards", "source": "posts", "limit": 3, "columns": 3, "view_all_label": "Tous les articles", "view_all_url": "/blog"}, {"type": "gallery_album", "album_slug": "produits-green-fad", "limit": 6}, {"type": "countries_map"}, {"type": "cta", "title": "Construisons ensemble un avenir durable et digital", "text": "Parlons de votre projet — nos équipes vous répondent rapidement.", "button_label": "Démarrer la conversation", "button_url": "/contact", "variant": "solid"}]'
WHERE slug = 'accueil';

-- 4) Version du contenu
UPDATE settings SET value = '8' WHERE key = 'content_version';

-- =====================================================================
-- DELTA v9 — restauration de la page d'accueil de la première version :
--   héros « entreprise » (et non liste des plateformes), 4 piliers
--   stratégiques à icônes, sections d'origine, frise et bloc « modèle »
--   retirés. Chiffres des stats actualisés (10 produits). Les visuels
--   produit écrasés en v7 sont restaurés côté dépôt (git).
-- =====================================================================

-- 1) Page d'accueil : contenu d'origine, mis à jour uniquement sur les chiffres
UPDATE pages SET
  meta_title = 'GREEN FAD SARL — Entreprise technologique africaine : produits propriétaires, ingénierie et transformation digitale',
  meta_description = 'Entreprise technologique africaine : FAD CARD, QRFAD, FEREFAD… Green FAD conçoit ses propres produits numériques et accompagne la transformation digitale des organisations, du Mali vers l''international.',
  blocks = '[{"type":"hero","visible":true,"eyebrow":"GREEN FAD SARL — Entreprise technologique africaine","title":"Nous concevons les produits numériques qui transforment l''Afrique","subtitle":"Innovation, ingénierie logicielle et transformation digitale : Green FAD développe ses propres technologies et accompagne les organisations, du Mali vers l''international.","cta_label":"Découvrir nos produits","cta_url":"/produits","cta2_label":"Nous contacter","cta2_url":"/contact","variant":"gradient"},{"type":"section_header","visible":true,"eyebrow":"Nos piliers","title":"Quatre piliers stratégiques","text":"Une méthodologie éprouvée pour garantir le succès de votre projet.","align":"center"},{"type":"cards","visible":true,"source":"manual","limit":4,"columns":4,"items":[{"title":"Solutions Digitales & Technologies Vertes","text":"Des solutions complètes pour transformer les défis environnementaux en opportunités de développement durable.","icon":"leaf"},{"title":"Innovations & Outils sur Mesure","text":"Création de solutions propriétaires innovantes comme la FAD CARD, alliant technologie NFC/RFID et écologie.","icon":"lightbulb"},{"title":"Communication Multicanale & Identité","text":"Design graphique, création d''identités visuelles et stratégies de communication intégrée.","icon":"palette"},{"title":"Conseil & Accompagnement","text":"Audit digital, formation des équipes et support post-déploiement pour une adoption pérenne.","icon":"compass"}]},{"type":"stats","visible":true,"variant":"dark","items":[{"value":"10","label":"Produits technologiques propriétaires"},{"value":"5","label":"Pays d''intervention en Afrique"},{"value":"4","label":"Expertises d''ingénierie"},{"value":"13","label":"Références clients & partenaires"}]},{"type":"section_header","visible":true,"eyebrow":"Nos solutions","title":"Des produits nés sur le terrain","text":"Chaque produit GREEN FAD répond à un besoin réel observé sur le terrain africain.","align":"center"},{"type":"cards","visible":true,"source":"products","limit":6,"columns":3,"items":[],"view_all_label":"Voir tous les produits","view_all_url":"/produits"},{"type":"split","visible":true,"title":"L''alliance de la technologie et de l''écologie","text_md":"Fondée par des professionnels passionnés par l''innovation et sensibles aux enjeux environnementaux, **GREEN FAD SARL** accompagne la transition numérique et écologique des organisations en Afrique.\n\n**Notre vision :** un avenir où technologie et durabilité vont de pair, réduisant la fracture numérique en Afrique.\n\n**Notre ambition :** porter nos propres innovations technologiques à l''échelle internationale.","image_key":"/assets/images/office-workers-africa.jpg","image_side":"right","cta_label":"Découvrir l''entreprise","cta_url":"/p/entreprise"},{"type":"section_header","visible":true,"eyebrow":"Expertises","title":"Ce que nous faisons","align":"center"},{"type":"cards","visible":true,"source":"services","limit":4,"columns":4,"items":[],"view_all_label":"Toutes nos expertises","view_all_url":"/expertises"},{"type":"gallery_album","visible":true,"album_slug":"produits-green-fad","limit":6},{"type":"countries_map","visible":true},{"type":"cta","visible":true,"title":"Construisons ensemble un avenir durable et digital","text":"Parlons de votre projet — nos équipes vous répondent rapidement.","button_label":"Démarrer la conversation","button_url":"/contact","variant":"solid"}]'
WHERE slug = 'accueil';

-- 2) Version du contenu
UPDATE settings SET value = '9' WHERE key = 'content_version';

-- =====================================================================
-- DELTA v10 — nettoyage : doublons d'images et médias morts
-- =====================================================================
-- 1) FEREFAD : une seule image (ferefad.jpg) — l'album référençait un
--    doublon bit-à-bit nommé ferefad1.jpg ; on aligne la médiathèque.
--    Cas A (rejeu) : le canonique existe déjà — ré-attacher les éléments
--    d'album puis supprimer le doublon recréé par l'INSERT OR IGNORE.
UPDATE media_items SET
  media_id = (SELECT m2.id FROM media m2 WHERE m2.r2_key = '/assets/images/portfolio/ferefad.jpg')
WHERE EXISTS (SELECT 1 FROM media m2 WHERE m2.r2_key = '/assets/images/portfolio/ferefad.jpg')
  AND media_id IN (SELECT m1.id FROM media m1 WHERE m1.r2_key = '/assets/images/portfolio/ferefad1.jpg');
DELETE FROM media
WHERE r2_key = '/assets/images/portfolio/ferefad1.jpg'
  AND EXISTS (SELECT 1 FROM media m2 WHERE m2.r2_key = '/assets/images/portfolio/ferefad.jpg');
--    Cas B (première application) : le canonique n'existe pas — renommer.
UPDATE media SET
  r2_key = '/assets/images/portfolio/ferefad.jpg',
  filename = 'ferefad.jpg'
WHERE r2_key = '/assets/images/portfolio/ferefad1.jpg';

-- 2) Amitié Fad : une seule image (amitiefad.jpg) — la fiche produit
--    référençait un doublon bit-à-bit nommé amitie-fad.jpg.
UPDATE products SET
  image_key = '/assets/images/portfolio/amitiefad.jpg'
WHERE image_key = '/assets/images/portfolio/amitie-fad.jpg';
UPDATE products SET
  og_image = '/assets/images/portfolio/amitiefad.jpg'
WHERE og_image = '/assets/images/portfolio/amitie-fad.jpg';

-- 3) Médias morts : entrées à 0 octet créées par les premiers seeds et
--    pointant vers des fichiers inexistants (sauf print-communication,
--    encore référencée), ainsi que les envois de test orphelins.
DELETE FROM media WHERE r2_key IN (
  '/assets/images/services/web-development.jpg',
  '/assets/images/services/digital-solutions.jpg',
  '/assets/images/services/innovations.jpg',
  '/assets/images/services/communication.jpg',
  '/assets/images/services/conseil.jpg',
  'media/2026-11/1YN6TX3HW5EJ0ZMGVH0ABJE4CJ-img-2120.jpg',
  'media/2026-11/3E6317T1XGHAXZK898D6VNGBBG-img-2120.jpg',
  'media/2026-11/6ZHS0TN3VT6Q6DWVV9BMQZYYX2-img-2120.jpg',
  'media/2026-11/7WP3K28D22654T21SAN184G0VE-img-2119.jpg',
  'media/2026-11/K7JR2FN37D61NQG1WFWA43RX7Z-img-2119.jpg',
  'media/2026-11/QZNVPQ5E4Y1N6H4HM6H2C25EXD-img-2119.jpg',
  'media/2026-11/S3P8MVAZ9PK7V6T2N83XE6EW2W-img-2120.jpg',
  'media/2026-11/TV26D3C87R3JK3EY10YGYSVKYS-img-2119.jpg',
  'media/2026-11/XE329SDFZEPVYFT1QTHCKAYT9Z-b1b5b45d-93cb-407b-80d6-a1979059b6bd.png'
);
DELETE FROM media_items WHERE media_id NOT IN (SELECT id FROM media);
DELETE FROM content_relations WHERE media_item_id NOT IN (SELECT id FROM media_items);

-- 4) Version du contenu
UPDATE settings SET value = '10' WHERE key = 'content_version';

-- =====================================================================
-- DELTA v11 — réinitialisation de l'accès administrateur :
--          mot de passe fourni par la direction (hash PBKDF2-SHA-256,
--          100 000 itérations, sel 16 octets, clé 256 bits — schéma src/auth.ts)
--          + version du contenu portée à 11
-- =====================================================================

-- 1) Mot de passe administrateur : contact@greenfad.tech / GreenFad!2026#Bko
UPDATE users SET password_hash = 'srRz5Gp7NF/F/qElRzxX1+ODScBjLiUrB3d6e2UI4RA=',
  password_salt = 'xBXG2Mn0UU+4tA06TjgoRg==', must_change_password = 0, is_active = 1
WHERE email = 'contact@greenfad.tech';

-- 2) Version du contenu
UPDATE settings SET value = '11' WHERE key = 'content_version';

-- =====================================================================
-- DELTA v12 — « zéro donnée codée en dur » : tout le contenu éditorial
--          structurel passe en base (Admin → Paramètres) et l'accueil
--          gagne une section « Références » (partenaires réels).
--          Contenu 100 % réel : rien n'est inventé, tout est éditable.
-- =====================================================================

-- 1) Contenu éditable par page : héros, bandeaux CTA, SEO, frise, intro démo produit
INSERT OR REPLACE INTO settings (key, value) VALUES ('content_overrides', '{"heroes": {"/expertises": {"title": "L''ingénierie numérique de bout en bout", "text": "Conception, développement, déploiement et accompagnement : nos équipes couvrent l''ensemble de la chaîne de valeur technologique."}, "/produits": {"html": "Des produits numériques <em style=\"color:var(--teal-400);font-style:normal\">conçus et portés</em> par Green FAD", "text": "Solutions propriétaires développées par nos équipes, pensées pour les marchés africains et ouverts à l''international."}, "/realisations": {"title": "Des produits qui vivent, des parcours documentés", "text": "Nos études de cas racontent la vraie vie de nos plateformes : lancement, évolutions trimestrielles, usage sur le terrain. Cinq ans de produit, sans artifice."}, "/galerie": {"title": "La galerie multimédia de Green FAD", "text": "Photographies et vidéos officielles : nos produits, nos équipes, nos événements et nos implantations."}, "/blog": {"html": "Le média technologique <em style=\"color:var(--teal-400);font-style:normal\">de nos ingénieurs</em>", "text": "Actualités de l''entreprise, lancements produits, analyses, R&D, guides d''ingénierie et regards sur l''innovation africaine — écrits par les équipes qui construisent."}, "/blog/archives": {"title": "Tous nos articles, par mois"}, "/implantation": {"title": "Enracinés en Afrique, tournés vers le monde", "text": "Green FAD opère depuis le Mali et accompagne des organisations dans plusieurs pays africains, avec une ambition internationale assumée."}, "/contact": {"title": "Parlons de votre projet", "text": "Démonstrations, devis, partenariats ou presse : nos équipes vous répondent dans les meilleurs délais."}, "/carrieres": {"title": "Construisez le futur technologique avec nous", "text": "Rejoignez une équipe qui conçoit des produits numériques africains à ambition internationale."}, "/ressources": {"title": "Documents et supports publics", "text": "Documentation institutionnelle et technique mise à disposition par Green FAD."}, "/faq": {"title": "Vos questions, nos réponses"}}, "ctas": {"/expertises": {"title": "Un besoin précis ?", "text": "Décrivez votre projet — nous vous répondons avec une proposition concrète.", "button_label": "Demander un devis", "button_url": "/devis"}, "/realisations": {"title": "Et le prochain chapitre ?", "text": "Nos plateformes avancent chaque trimestre — suivez le blog, ou construisez le vôtre avec nous.", "button_label": "Suivre le parcours", "button_url": "/blog"}, "article": {"title": "Un projet technologique en tête ?", "text": "Nos équipes conçoivent des produits et des plateformes pour les organisations africaines et internationales.", "button_label": "Discutons-en", "button_url": "/contact"}}, "seo": {"/expertises": {"title": "Expertises & services technologiques", "description": "Développement web, applications mobiles, SEO, communication et conseil : les expertises GREEN FAD."}, "/produits": {"title": "Produits technologiques GREEN FAD", "description": "FAD CARD, QRFAD, FereFad : découvrez les produits technologiques développés par Green FAD."}, "/realisations": {"title": "Réalisations & études de cas — le parcours de nos plateformes", "description": "Études de cas et parcours produits Green FAD : QRFAD, FadCard, Tile, CloudAf, PayGfad — lancement, évolutions trimestrielles et déploiements réels depuis 2021."}, "/galerie": {"title": "Galerie multimédia", "description": "Photos et vidéos officielles de Green FAD : produits, projets, événements et implantations."}, "/blog": {"title": "Blog — Actualités, ingénierie et innovation", "description": "Le blog de Green FAD : actualités, lancements produits, analyses technologiques, R&D, guides d''ingénierie et innovation africaine, par nos équipes."}, "/blog/archives": {"title": "Archives du blog", "description": "Tous les articles du blog GREEN FAD classés par mois."}, "/implantation": {"title": "Implantation & présence internationale", "description": "Les pays d''intervention et bureaux de Green FAD en Afrique."}, "/contact": {"title": "Contact", "description": "Contactez Green FAD — Bamako, Mali. Démonstrations, devis, partenariats."}, "/carrieres": {"title": "Carrières chez Green FAD", "description": "Offres d''emploi et opportunités technologiques chez Green FAD."}, "/ressources": {"title": "Ressources & documentation", "description": "Documents publics et supports de Green FAD."}, "/faq": {"title": "FAQ", "description": "Questions fréquentes sur Green FAD et ses services."}}, "timeline": [{"year": "2021", "title": "Les fondations", "text": "Lancement de QRFAD (mars) et FAD CARD (mai) à Bamako : le menu par QR code et la carte de visite numérique NFC."}, {"year": "2022", "title": "Des produits qui s''élargissent", "text": "QRFAD passe au multi-établissements ; FadCard ouvre Market, sa vitrine marchande."}, {"year": "2023", "title": "Transactions & commandes", "text": "Commandes depuis le menu puis WhatsApp sur QRFAD ; Tickets puis Fund sur FadCard."}, {"year": "2024", "title": "Plateformes complètes", "text": "Hôtellerie et caisse POS côté QRFAD ; Vote et FadCard Pay clôturent la suite FadCard. PayGfad, la suite de gestion SaaS, est mise en ligne."}, {"year": "2025", "title": "Maturité", "text": "153 designs et cartes NFC pour FadCard ; caisse consolidée et thèmes pour QRFAD."}, {"year": "2026", "title": "Tile, CloudAf & PayGfad", "text": "Le réseau social du progrès, la plateforme no-code + IA et la suite de gestion SaaS rejoignent l''écosystème — cinq plateformes en ligne."}], "product_demo_intro": "Présentation guidée par nos équipes, en présentiel à Bamako ou en visioconférence."}');

-- 2) Badges du héros d'accueil (JSON : [{"icon":"...","label":"..."}] — vide = masqué)
INSERT OR REPLACE INTO settings (key, value) VALUES ('hero_badges', '[{"icon": "globe", "label": "Afrique de l''Ouest & internationale"}, {"icon": "cpu", "label": "Produits propriétaires"}, {"icon": "shield", "label": "Solutions sécurisées"}]');

-- 3) Bouton d'appel à l'action de l'entête (vide = masqué)
INSERT OR REPLACE INTO settings (key, value) VALUES ('header_cta_label', '"Nous contacter"');
INSERT OR REPLACE INTO settings (key, value) VALUES ('header_cta_url', '"/contact"');

-- 4) Zone géographique annoncée pour les données structurées Service (JSON-LD)
INSERT OR REPLACE INTO settings (key, value) VALUES ('service_area', '"Afrique & international"');

-- 5) Page d'accueil : ajout de la section « Références » (partenaires publiés) avant la galerie
UPDATE pages SET blocks = '[{"type": "hero", "visible": true, "eyebrow": "GREEN FAD SARL — Entreprise technologique africaine", "title": "Nous concevons les produits numériques qui transforment l''Afrique", "subtitle": "Innovation, ingénierie logicielle et transformation digitale : Green FAD développe ses propres technologies et accompagne les organisations, du Mali vers l''international.", "cta_label": "Découvrir nos produits", "cta_url": "/produits", "cta2_label": "Nous contacter", "cta2_url": "/contact", "variant": "gradient"}, {"type": "section_header", "visible": true, "eyebrow": "Nos piliers", "title": "Quatre piliers stratégiques", "text": "Une méthodologie éprouvée pour garantir le succès de votre projet.", "align": "center"}, {"type": "cards", "visible": true, "source": "manual", "limit": 4, "columns": 4, "items": [{"title": "Solutions Digitales & Technologies Vertes", "text": "Des solutions complètes pour transformer les défis environnementaux en opportunités de développement durable.", "icon": "leaf"}, {"title": "Innovations & Outils sur Mesure", "text": "Création de solutions propriétaires innovantes comme la FAD CARD, alliant technologie NFC/RFID et écologie.", "icon": "lightbulb"}, {"title": "Communication Multicanale & Identité", "text": "Design graphique, création d''identités visuelles et stratégies de communication intégrée.", "icon": "palette"}, {"title": "Conseil & Accompagnement", "text": "Audit digital, formation des équipes et support post-déploiement pour une adoption pérenne.", "icon": "compass"}]}, {"type": "stats", "visible": true, "variant": "dark", "items": [{"value": "10", "label": "Produits technologiques propriétaires"}, {"value": "5", "label": "Pays d''intervention en Afrique"}, {"value": "4", "label": "Expertises d''ingénierie"}, {"value": "13", "label": "Références clients & partenaires"}]}, {"type": "section_header", "visible": true, "eyebrow": "Nos solutions", "title": "Des produits nés sur le terrain", "text": "Chaque produit GREEN FAD répond à un besoin réel observé sur le terrain africain.", "align": "center"}, {"type": "cards", "visible": true, "source": "products", "limit": 6, "columns": 3, "items": [], "view_all_label": "Voir tous les produits", "view_all_url": "/produits"}, {"type": "split", "visible": true, "title": "L''alliance de la technologie et de l''écologie", "text_md": "Fondée par des professionnels passionnés par l''innovation et sensibles aux enjeux environnementaux, **GREEN FAD SARL** accompagne la transition numérique et écologique des organisations en Afrique.\n\n**Notre vision :** un avenir où technologie et durabilité vont de pair, réduisant la fracture numérique en Afrique.\n\n**Notre ambition :** porter nos propres innovations technologiques à l''échelle internationale.", "image_key": "/assets/images/office-workers-africa.jpg", "image_side": "right", "cta_label": "Découvrir l''entreprise", "cta_url": "/p/entreprise"}, {"type": "section_header", "visible": true, "eyebrow": "Expertises", "title": "Ce que nous faisons", "align": "center"}, {"type": "cards", "visible": true, "source": "services", "limit": 4, "columns": 4, "items": [], "view_all_label": "Toutes nos expertises", "view_all_url": "/expertises"}, {"type": "section_header", "visible": true, "eyebrow": "Références", "title": "Ils nous font confiance", "align": "center"}, {"type": "partners", "visible": true, "limit": 14}, {"type": "gallery_album", "visible": true, "album_slug": "produits-green-fad", "limit": 6}, {"type": "countries_map", "visible": true}, {"type": "cta", "visible": true, "title": "Construisons ensemble un avenir durable et digital", "text": "Parlons de votre projet — nos équipes vous répondent rapidement.", "button_label": "Démarrer la conversation", "button_url": "/contact", "variant": "solid"}]'
WHERE slug = 'accueil';

-- 6) Version du contenu
UPDATE settings SET value = '12' WHERE key = 'content_version';

-- =====================================================================
-- DELTA v13 — accueil moderne & vivant :
--   • logos produits en base (cartes + bandeau défilant animé)
--   • aperçus du BLOG sur l'accueil (dernières publications réelles)
--   • album « Green FAD en images » (visuels réels du projet + visuels contextuels)
--   • partenaires en niveaux de gris → couleurs au survol (CSS)
--   Tout reste éditable depuis le Dashboard ; aucune donnée codée en dur.
-- =====================================================================

-- 1) Logos des produits (affichés sur les cartes de l'accueil et le bandeau animé)
UPDATE products SET logo_key = '/assets/images/portfolio/fadcard-logo3.png' WHERE slug = 'fad-card';
UPDATE products SET logo_key = '/assets/images/portfolio/qrfad-logo.png' WHERE slug = 'qrfad';
UPDATE products SET logo_key = '/assets/images/portfolio/tile-logo.png' WHERE slug = 'tile';
UPDATE products SET logo_key = '/assets/images/portfolio/cloudaf-logo.png' WHERE slug = 'cloudaf';
UPDATE products SET logo_key = '/assets/images/portfolio/ferefad-logo.png' WHERE slug = 'ferefad';
UPDATE products SET logo_key = '/assets/images/portfolio/amitiefad-logo.png' WHERE slug = 'amitie-fad';

-- 2) Media Center : album « Green FAD en images » + visuels (réels du projet et contextuels)
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/gallery/tech-ecologie.jpg', 'tech-ecologie.jpg', 'image/jpeg', 0, NULL, NULL, 'Technologie et écologie — panneaux solaires et nature', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/gallery/equipe-dev-bamako.jpg', 'Nos équipes d''ingénierie au travail', 'image/jpeg', 0, NULL, NULL, 'Équipes Green FAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/gallery/entrepreneur-mobile.jpg', 'Un entrepreneur pilote son activité depuis son smartphone', 'image/jpeg', 0, NULL, NULL, 'Produits Green FAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/gallery/carte-nfc-rencontre.jpg', 'Démonstration de la carte NFC en rendez-vous professionnel', 'image/jpeg', 0, NULL, NULL, 'FAD CARD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/gallery/kit-solaire-payg.jpg', 'Kit solaire PAYG installé — suivi client par nos équipes', 'image/jpeg', 0, NULL, NULL, 'Terrain & énergie', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/gallery/cooperative-agro.jpg', 'Coopérative agricole — suivi des parcelles sur tablette', 'image/jpeg', 0, NULL, NULL, 'Agro & coopératives', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/gallery/classe-digitale.jpg', 'Classe connectée — outils numériques pour les écoles', 'image/jpeg', 0, NULL, NULL, 'Éducation', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/hero-image-modern.jpg', 'GREEN FAD — image institutionnelle', 'image/jpeg', 0, NULL, NULL, 'GREEN FAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/about-team.jpg', 'L''équipe GREEN FAD', 'image/jpeg', 0, NULL, NULL, 'Équipes Green FAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/office-workers-africa.jpg', 'Nos bureaux — Missabougou, Bamako', 'image/jpeg', 0, NULL, NULL, 'Équipes Green FAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/team/team-meeting.jpg', 'Réunion de travail', 'image/jpeg', 0, NULL, NULL, 'Équipes Green FAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/team/team-collaboration.jpg', 'Collaboration produit', 'image/jpeg', 0, NULL, NULL, 'Équipes Green FAD', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media_albums (slug, name, description, category, cover_key, sort_order, status, published_at) VALUES ('greenfad-en-images', 'Green FAD en images', 'La vie réelle de l''entreprise : équipes, produits en usage et terrain.', 'institution', '/assets/images/gallery/equipe-dev-bamako.jpg', 4, 'publie', datetime('now'));
INSERT OR IGNORE INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Technologie & écologie — notre ADN', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'greenfad-en-images'), 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/gallery/tech-ecologie.jpg';
INSERT OR IGNORE INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Nos équipes d''ingénierie au travail', 'Équipes Green FAD', (SELECT id FROM media_albums WHERE slug = 'greenfad-en-images'), 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/gallery/equipe-dev-bamako.jpg';
INSERT OR IGNORE INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Un entrepreneur pilote son activité depuis son smartphone', 'Produits Green FAD', (SELECT id FROM media_albums WHERE slug = 'greenfad-en-images'), 1, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/gallery/entrepreneur-mobile.jpg';
INSERT OR IGNORE INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Démonstration de la carte NFC en rendez-vous professionnel', 'FAD CARD', (SELECT id FROM media_albums WHERE slug = 'greenfad-en-images'), 2, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/gallery/carte-nfc-rencontre.jpg';
INSERT OR IGNORE INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Kit solaire PAYG installé — suivi client par nos équipes', 'Terrain & énergie', (SELECT id FROM media_albums WHERE slug = 'greenfad-en-images'), 3, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/gallery/kit-solaire-payg.jpg';
INSERT OR IGNORE INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Coopérative agricole — suivi des parcelles sur tablette', 'Agro & coopératives', (SELECT id FROM media_albums WHERE slug = 'greenfad-en-images'), 4, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/gallery/cooperative-agro.jpg';
INSERT OR IGNORE INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Classe connectée — outils numériques pour les écoles', 'Éducation', (SELECT id FROM media_albums WHERE slug = 'greenfad-en-images'), 5, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/gallery/classe-digitale.jpg';
INSERT OR IGNORE INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'GREEN FAD — image institutionnelle', 'GREEN FAD', (SELECT id FROM media_albums WHERE slug = 'greenfad-en-images'), 6, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/hero-image-modern.jpg';
INSERT OR IGNORE INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'L''équipe GREEN FAD', 'Équipes Green FAD', (SELECT id FROM media_albums WHERE slug = 'greenfad-en-images'), 7, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/about-team.jpg';
INSERT OR IGNORE INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Nos bureaux — Missabougou, Bamako', 'Équipes Green FAD', (SELECT id FROM media_albums WHERE slug = 'greenfad-en-images'), 8, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/office-workers-africa.jpg';
INSERT OR IGNORE INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Réunion de travail', 'Équipes Green FAD', (SELECT id FROM media_albums WHERE slug = 'greenfad-en-images'), 9, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/team/team-meeting.jpg';
INSERT OR IGNORE INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Collaboration produit', 'Équipes Green FAD', (SELECT id FROM media_albums WHERE slug = 'greenfad-en-images'), 10, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key = '/assets/images/team/team-collaboration.jpg';

-- Tri de l'album : tech-ecologie en tête, puis le reste par sort_order d'origine
UPDATE media_items SET sort_order = sort_order + 1 WHERE album_id = (SELECT id FROM media_albums WHERE slug = 'greenfad-en-images') AND title != 'Technologie & écologie — notre ADN';

-- 3) Page d'accueil : structure moderne — bandeau logos animé, produits avec logos,
--    aperçus du blog, galerie mise en avant, partenaires, pays, CTA.
UPDATE pages SET blocks = '[{"type": "hero", "visible": true, "eyebrow": "GREEN FAD SARL — Entreprise technologique africaine", "title": "Nous concevons les produits numériques qui transforment l''Afrique", "subtitle": "Innovation, ingénierie logicielle et transformation digitale : Green FAD développe ses propres technologies et accompagne les organisations, du Mali vers l''international.", "cta_label": "Découvrir nos produits", "cta_url": "/produits", "cta2_label": "Nous contacter", "cta2_url": "/contact", "variant": "gradient"}, {"type": "logo_marquee", "visible": true, "source": "products", "label": "L''écosystème Green FAD — 10 produits propriétaires"}, {"type": "section_header", "visible": true, "eyebrow": "Nos solutions", "title": "Des produits nés sur le terrain", "text": "Chaque produit Green FAD répond à un besoin réel observé sur le terrain africain.", "align": "center"}, {"type": "cards", "visible": true, "source": "products", "limit": 6, "columns": 3, "items": [], "view_all_label": "Voir tous les produits", "view_all_url": "/produits"}, {"type": "stats", "visible": true, "variant": "dark", "items": [{"value": "10", "label": "Produits technologiques propriétaires"}, {"value": "5", "label": "Pays d''intervention en Afrique"}, {"value": "4", "label": "Expertises d''ingénierie"}, {"value": "14", "label": "Références clients & partenaires"}]}, {"type": "section_header", "visible": true, "eyebrow": "Blog & publications", "title": "Les dernières actualités", "text": "Lancements produits, analyses technologiques et retours d''expérience écrits par nos équipes.", "align": "center"}, {"type": "posts", "visible": true, "limit": 3}, {"type": "section_header", "visible": true, "eyebrow": "Expertises", "title": "Ce que nous faisons", "align": "center"}, {"type": "cards", "visible": true, "source": "services", "limit": 4, "columns": 4, "items": [], "view_all_label": "Toutes nos expertises", "view_all_url": "/expertises"}, {"type": "split", "visible": true, "title": "L''alliance de la technologie et de l''écologie", "text_md": "Fondée par des professionnels passionnés par l''innovation et sensibles aux enjeux environnementaux, **GREEN FAD SARL** accompagne la transition numérique et écologique des organisations en Afrique.\n\n**Notre vision :** un avenir où technologie et durabilité vont de pair, réduisant la fracture numérique en Afrique.\n\n**Notre ambition :** porter nos propres innovations technologiques à l''échelle internationale.", "image_key": "/assets/images/gallery/tech-ecologie.jpg", "image_side": "right", "cta_label": "Découvrir l''entreprise", "cta_url": "/p/entreprise"}, {"type": "section_header", "visible": true, "eyebrow": "Galerie", "title": "Green FAD en images", "text": "Nos équipes, nos produits et le terrain : la vie réelle de l''entreprise.", "align": "center"}, {"type": "gallery_album", "visible": true, "album_slug": "greenfad-en-images", "limit": 7, "layout": "featured"}, {"type": "section_header", "visible": true, "eyebrow": "Références", "title": "Ils nous font confiance", "align": "center"}, {"type": "partners", "visible": true, "limit": 14}, {"type": "countries_map", "visible": true}, {"type": "cta", "visible": true, "title": "Construisons ensemble un avenir durable et digital", "text": "Parlons de votre projet — nos équipes vous répondent rapidement.", "button_label": "Démarrer la conversation", "button_url": "/contact", "variant": "solid"}]' WHERE slug = 'accueil';

-- 4) Version du contenu
UPDATE settings SET value = '13' WHERE key = 'content_version';


-- =====================================================================
-- DELTA v14 — visuels produits officiels (fournis par la direction),
--          vidéos réelles de la chaîne YouTube GREEN FAD, documents
--          publics d'exemple, contenu produits complété, section pays
--          de l'accueil modernisée (éditable depuis le Dashboard).
-- =====================================================================

-- 1) Bibliothèque : visuels produits officiels (images fournies)
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/fadcard-logo-gold.png', 'fadcard-logo-gold.png', 'image/png', 111823, 500, 500, 'Logo officiel FAD CARD — or sur fond noir', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/fadcard-banniere.jpg', 'fadcard-banniere.jpg', 'image/jpeg', 62867, 1600, 1000, 'FAD CARD — présentation de la plateforme et de ses six applications', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/fadcard-app.jpg', 'fadcard-app.jpg', 'image/jpeg', 74685, 880, 1770, 'Application FAD CARD — page d''accueil mobile', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/tile-banniere.jpg', 'tile-banniere.jpg', 'image/jpeg', 100458, 1600, 595, 'TILE — Le réseau du progrès : vidéos, photos, chat, communauté', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/tile-logo-neon.jpg', 'tile-logo-neon.jpg', 'image/jpeg', 54751, 640, 640, 'Logo TILE — soleil néon sur fond noir', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/cloudaf-logo-round.jpg', 'cloudaf-logo-round.jpg', 'image/jpeg', 50730, 640, 640, 'Logo CLOUDAf — nuage et éclair, vitesse du cloud', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/cloudaf-banniere.jpg', 'cloudaf-banniere.jpg', 'image/jpeg', 215663, 1400, 933, 'CLOUDAf — Créez. Déployez. Scalez. Plateforme cloud tout-en-un', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/paygfad-ecole.jpg', 'paygfad-ecole.jpg', 'image/jpeg', 229465, 1400, 1110, 'PayGfad SCHOOL V3 — tout l''établissement connecté sur une seule plateforme', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/paygfad-logo.png', 'paygfad-logo.png', 'image/png', 133542, 530, 450, 'Logo PayGfad — paiement mobile et croissance', '/', 'seed', datetime('now'));

-- 2) Produits : image principale = bannière officielle, logo = identité fournie
UPDATE products SET image_key = '/assets/images/products/fadcard-banniere.jpg', logo_key = '/assets/images/products/fadcard-logo-gold.png' WHERE slug = 'fad-card';
UPDATE products SET image_key = '/assets/images/products/tile-banniere.jpg', logo_key = '/assets/images/products/tile-logo-neon.jpg' WHERE slug = 'tile';
UPDATE products SET image_key = '/assets/images/products/cloudaf-banniere.jpg', logo_key = '/assets/images/products/cloudaf-logo-round.jpg' WHERE slug = 'cloudaf';
UPDATE products SET image_key = '/assets/images/products/paygfad-ecole.jpg', logo_key = '/assets/images/products/paygfad-logo.png' WHERE slug = 'paygfad';

-- 3) FIX : fonctionnalités de FAD CARD (des valeurs de test avaient écrasé la vraie liste)
UPDATE products SET features = '["vCard — carte de visite numérique : 153 designs premium, QR code et lien public dédiés", "Cartes NFC physiques — partage instantané et prise de rendez-vous", "Contacts — gestion avec validation de numéro dans 66 pays", "Market — e-commerce et gestion de stock", "Tickets — billetterie d''événements par QR code, contrôle des entrées par scan", "Fund — collectes et campagnes de financement avec suivi public de la progression", "Vote — sondages, compétitions et scrutins avec export CSV des résultats", "FadCard Pay — encaissement et suivi des fonds, plus de 40 devises prises en charge", "Analytique temps réel — vues, partages, clics et sources", "Application web progressive (PWA) installable depuis n''importe quel navigateur"]' WHERE slug = 'fad-card';

-- 4) Contenu complété : modules, cas d'usage et expérience utilisateur
--    des cinq produits restés sommaires (rien n'est inventé : tout dérive
--    des informations produit déjà publiées).
UPDATE products SET modules_md = '**La marketplace en un coup d''œil :**

- **Annonces** — publication simple et guidée, avec photos et prix
- **Découverte** — recherche et filtres par catégorie et localisation
- **Confiance** — profils vendeurs et messagerie interne entre acheteurs et vendeurs', use_cases_md = '- Un jeune entrepreneur publie ses articles et traite les demandes depuis la messagerie interne
- Un vendeur de quartier touche des acheteurs au-delà de sa zone grâce aux filtres de localisation
- Un particulier vend un article d''occasion simplement, sans site web ni boutique
- Un acheteur compare plusieurs vendeurs et échange directement avant d''acheter', ux_md = 'Optimisée pour le mobile et les connexions à faible débit : publication guidée, recherche rapide, messagerie intégrée — vendre et acheter reste simple, même sur un téléphone d''entrée de gamme.' WHERE slug = 'ferefad';
UPDATE products SET modules_md = '**Trois volets, une hospitalité connectée :**

- **Chambre** — le client scanne le QR code et choisit son service
- **Personnel** — réception et équipes reçoivent et suivent chaque demande
- **Direction** — tableau de bord : volume de demandes, délais, historique', use_cases_md = '- Un client scanne le QR code de sa chambre et demande le ménage sans appeler la réception
- Un client réserve un taxi depuis sa chambre — la demande arrive directement au personnel
- La réception suit toutes les demandes en temps réel et priorise les urgences
- La direction analyse le volume de demandes et les délais pour améliorer le service', ux_md = 'Aucune application à installer : un QR code par chambre et un smartphone pour le personnel suffisent. L''interface client est comprise en quelques secondes — c''est le confort connecté.' WHERE slug = 'amitie-fad';
UPDATE products SET modules_md = '**Six modules connectés dans un environnement unique :**

- **Commercial** — devis, factures, clients
- **Stocks & achats** — mouvements, fournisseurs, alertes
- **Finances** — caisse, dépenses, états de synthèse
- **Ressources humaines** — employés, paie, absences
- **Rôles & permissions** — accès par utilisateur
- **Pilotage** — tableaux de bord consolidés', use_cases_md = '- Un gérant établit devis et factures depuis son téléphone et suit les paiements au même endroit
- Un magasin suit ses stocks et ses achats sans double saisie entre les outils
- Une entreprise consolide caisse et dépenses pour produire des états de synthèse fiables
- Un dirigeant décide sur des indicateurs fiables grâce aux tableaux de bord', ux_md = 'Un ERP professionnel utilisable au quotidien : interface en français, rôles et permissions par utilisateur, formation des équipes incluse au déploiement et support assuré par les équipes GREEN FAD.' WHERE slug = 'niafad';
UPDATE products SET modules_md = '**Des paiements sécurisés, de bout en bout :**

- **Transaction** — paiements mobiles sécurisés en temps réel
- **Traçabilité** — historique et suivi de chaque transaction
- **Intégration** — connexion aux plateformes GREEN FAD et aux systèmes clients
- **Notifications** — confirmations instantanées pour l''entreprise et le client', use_cases_md = '- Une boutique en ligne encaisse ses commandes avec une confirmation immédiate pour le client
- Une plateforme GREEN FAD (marketplace, gestion) intègre SARAPAY comme moyen de paiement
- Un comptable suit chaque transaction dans l''historique pour une réconciliation simplifiée
- Un client paie depuis son mobile et reçoit une confirmation en temps réel', ux_md = 'Pensé pour les usages et les opérateurs du marché africain : la sécurité d''abord, la simplicité ensuite — payer doit prendre quelques secondes, vérifier une transaction une minute.' WHERE slug = 'sarapay';
UPDATE products SET modules_md = '**Deux supports, un même dossier :**

- **Carte physique connectée** — résistante, toujours sur soi
- **Espace numérique** — historique complet accessible en ligne
- **Urgences** — allergies, groupe sanguin et contacts visibles par les soignants autorisés
- **Accès contrôlé** — le patient décide qui consulte son dossier', use_cases_md = '- Un patient présente sa carte à un nouveau médecin : l''historique des consultations et traitements est accessible immédiatement
- Aux urgences, le soignant consulte allergies et groupe sanguin sans attendre les proches
- Un patient suit ses traitements depuis son espace numérique, où qu''il soit
- Le patient autorise — ou révoque — l''accès de chaque professionnel de santé', ux_md = 'Le patient reste acteur de ses données : accès contrôlé, carte physique résistante prolongée d''un espace numérique simple, pensé pour le terrain africain. La Carte Santé prolonge l''expertise cartes connectées de GREEN FAD (FAD CARD) vers la santé.' WHERE slug = 'carte-sante';

-- 5) Média Center : vidéos réelles de la chaîne YouTube officielle GREEN FAD
INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=G78Iq3YOUiU', 'youtube', 'G78Iq3YOUiU', 'PayGFad School V3 — La gestion de votre établissement, enfin réunie en une seule plateforme', 'Présentation officielle de PayGfad School V3 : écoles, enseignants, élèves, parents et finances réunis sur une seule plateforme.', 'Chaîne YouTube officielle Green FAD', 'démonstration', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='G78Iq3YOUiU');
INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=m1Em4Ojmsts', 'youtube', 'm1Em4Ojmsts', 'La FadCard', 'La carte de visite numérique NFC de Green FAD : identité professionnelle, rendez-vous et contacts — le produit pionnier présenté en vidéo.', 'Chaîne YouTube officielle Green FAD', 'démonstration', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='m1Em4Ojmsts');
INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=fRCL36YC33U', 'youtube', 'fRCL36YC33U', 'Découvrez L''AmitiéFad', 'L''assistant hôtelier digital : le client scanne, demande, et le personnel reçoit — présentation du produit.', 'Chaîne YouTube officielle Green FAD', 'démonstration', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='fRCL36YC33U');
INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=C_s81MArxE8', 'youtube', 'C_s81MArxE8', 'ORTM1 Greenfad CyberNtic', 'Passage de Green FAD sur l''ORTM (télévision nationale malienne) — l''innovation technologique malienne mise en avant.', 'Chaîne YouTube officielle Green FAD', 'presse & médias', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='C_s81MArxE8');
INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=nQLVJcxsr6E', 'youtube', 'nQLVJcxsr6E', 'Greenfad Sarl L''innovation numérique au service de l''Afrique', 'Présentation institutionnelle de Green FAD SARL : l''innovation numérique au service de l''Afrique.', 'Chaîne YouTube officielle Green FAD', 'institutionnel', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='nQLVJcxsr6E');
INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=fgGNVdswZfs', 'youtube', 'fgGNVdswZfs', 'Commerçants : gérez tout, simplement.', 'Gérez tout, simplement — la gestion du quotidien pour les commerçants, par Green FAD.', 'Chaîne YouTube officielle Green FAD', 'démonstration', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='fgGNVdswZfs');

-- 6) Relations produit ↔ vidéo (la fiche produit affiche ses démonstrations)
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug='paygfad'), mi.id, 0 FROM media_items mi WHERE mi.type='video' AND mi.provider_id='G78Iq3YOUiU' AND NOT EXISTS (SELECT 1 FROM content_relations cr WHERE cr.content_type='product' AND cr.content_id=(SELECT id FROM products WHERE slug='paygfad') AND cr.media_item_id=mi.id);
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug='fad-card'), mi.id, 0 FROM media_items mi WHERE mi.type='video' AND mi.provider_id='m1Em4Ojmsts' AND NOT EXISTS (SELECT 1 FROM content_relations cr WHERE cr.content_type='product' AND cr.content_id=(SELECT id FROM products WHERE slug='fad-card') AND cr.media_item_id=mi.id);
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug='amitie-fad'), mi.id, 0 FROM media_items mi WHERE mi.type='video' AND mi.provider_id='fRCL36YC33U' AND NOT EXISTS (SELECT 1 FROM content_relations cr WHERE cr.content_type='product' AND cr.content_id=(SELECT id FROM products WHERE slug='amitie-fad') AND cr.media_item_id=mi.id);

-- 7) Ressources : trois documents publics d'exemple (PDF réels, remplaçables)
INSERT INTO documents (title, description, category, file_key, file_name, mime, size, is_public, status, published_at, created_at, updated_at) SELECT 'Plaquette institutionnelle GREEN FAD', 'Présentation de l''entreprise : chiffres clés, quatre piliers, expertises, écosystème de produits et implantation. Document d''exemple — remplaçable depuis le Dashboard (Ressources).', 'Institutionnel', '/assets/docs/plaquette-greenfad.pdf', 'plaquette-greenfad.pdf', 'application/pdf', 45857, 1, 'publie', datetime('now'), datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM documents WHERE file_key='/assets/docs/plaquette-greenfad.pdf');
INSERT INTO documents (title, description, category, file_key, file_name, mime, size, is_public, status, published_at, created_at, updated_at) SELECT 'Fiche produit — FAD CARD', 'L''écosystème professionnel en un document : présentation, fonctionnalités des six applications, cas d''usage et différenciation. Document d''exemple — remplaçable depuis le Dashboard.', 'Fiches produits', '/assets/docs/fiche-produit-fadcard.pdf', 'fiche-produit-fadcard.pdf', 'application/pdf', 44737, 1, 'publie', datetime('now'), datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM documents WHERE file_key='/assets/docs/fiche-produit-fadcard.pdf');
INSERT INTO documents (title, description, category, file_key, file_name, mime, size, is_public, status, published_at, created_at, updated_at) SELECT 'Guide de démarrage — QRFAD', 'Six étapes pour lancer un établissement sur QRFAD : menu, QR codes, commandes WhatsApp, caisse et hôtellerie. Document d''exemple — remplaçable depuis le Dashboard.', 'Guides & démarrage', '/assets/docs/guide-demarrage-qrfad.pdf', 'guide-demarrage-qrfad.pdf', 'application/pdf', 44105, 1, 'publie', datetime('now'), datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM documents WHERE file_key='/assets/docs/guide-demarrage-qrfad.pdf');
INSERT INTO documents (title, description, category, file_key, file_name, mime, size, is_public, status, published_at, created_at, updated_at) SELECT 'Profil d''entreprise GREEN FAD — 2026', 'Qui est GREEN FAD : mission, trajectoire documentée 2019-2026, écosystème des onze produits, discipline produit et coordonnées officielles. Le document de référence pour découvrir et vérifier l''entreprise.', 'Institutionnel', '/assets/docs/profil-entreprise-greenfad.pdf', 'profil-entreprise-greenfad.pdf', 'application/pdf', 142251, 1, 'publie', datetime('now'), datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM documents WHERE file_key='/assets/docs/profil-entreprise-greenfad.pdf');

INSERT INTO documents (title, description, category, file_key, file_name, mime, size, is_public, status, published_at, created_at, updated_at) SELECT 'Catalogue des produits GREEN FAD — 2026', 'Les onze produits présentés produit par produit : promesse, fonctionnalités documentées, état réel de disponibilité et accès. Une photographie honnête du portefeuille à novembre 2026.', 'Catalogues', '/assets/docs/catalogue-produits-greenfad.pdf', 'catalogue-produits-greenfad.pdf', 'application/pdf', 171224, 1, 'publie', datetime('now'), datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM documents WHERE file_key='/assets/docs/catalogue-produits-greenfad.pdf');

INSERT INTO documents (title, description, category, file_key, file_name, mime, size, is_public, status, published_at, created_at, updated_at) SELECT 'Prospectus de partenariat GREEN FAD — 2026', 'Pourquoi et comment devenir partenaire : ce que nous avons construit, quatre modèles de partenariat (revendeurs, établissements, partenaires financiers WARIPAY, opérateurs), engagements et processus en quatre étapes.', 'Partenariats', '/assets/docs/prospectus-partenariats-greenfad.pdf', 'prospectus-partenariats-greenfad.pdf', 'application/pdf', 141757, 1, 'publie', datetime('now'), datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM documents WHERE file_key='/assets/docs/prospectus-partenariats-greenfad.pdf');

INSERT INTO documents (title, description, category, file_key, file_name, mime, size, is_public, status, published_at, created_at, updated_at) SELECT 'Dossier de presse GREEN FAD — novembre 2026', 'L''information essentielle pour les médias : fiche d''identité, chronologie vérifiable 2019-2026, les produits en une phrase, éléments de langage et angles d''actualité de novembre 2026.', 'Presse', '/assets/docs/dossier-presse-greenfad.pdf', 'dossier-presse-greenfad.pdf', 'application/pdf', 143314, 1, 'publie', datetime('now'), datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM documents WHERE file_key='/assets/docs/dossier-presse-greenfad.pdf');


-- 8) Album « Produits Green FAD » : visuels officiels ajoutés + couverture TILE
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'FAD CARD — bannière officielle', 'FAD CARD', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 20, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/fadcard-banniere.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Identité FAD CARD — logo officiel', 'FAD CARD', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 21, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/fadcard-logo-gold.png' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'TILE — Le réseau du progrès', 'TILE', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 22, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/tile-banniere.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Identité TILE — logo néon', 'TILE', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 23, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/tile-logo-neon.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'CLOUDAf — Créez. Déployez. Scalez.', 'CLOUDAf', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 24, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/cloudaf-banniere.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Identité CLOUDAf', 'CLOUDAf', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 25, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/cloudaf-logo-round.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'PayGfad SCHOOL V3 — l''établissement connecté', 'PayGfad', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 26, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/paygfad-ecole.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'Identité PayGfad', 'PayGfad', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 27, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/paygfad-logo.png' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
UPDATE media_albums SET cover_key = '/assets/images/products/tile-banniere.jpg' WHERE slug = 'produits-green-fad';

-- 9) Page d'accueil : section pays modernisée (titre/texte/CTA éditables),
--    section Démonstrations (vidéos réelles) et Ressources (documents publics).
UPDATE pages SET blocks = '[{"type": "hero", "visible": true, "eyebrow": "GREEN FAD SARL — Entreprise technologique africaine", "title": "Nous concevons les produits numériques qui transforment l''Afrique", "subtitle": "Innovation, ingénierie logicielle et transformation digitale : Green FAD développe ses propres technologies et accompagne les organisations, du Mali vers l''international.", "cta_label": "Découvrir nos produits", "cta_url": "/produits", "cta2_label": "Nous contacter", "cta2_url": "/contact", "variant": "gradient"}, {"type": "logo_marquee", "visible": true, "source": "products", "label": "L''écosystème Green FAD — 10 produits propriétaires"}, {"type": "section_header", "visible": true, "eyebrow": "Nos solutions", "title": "Des produits nés sur le terrain", "text": "Chaque produit Green FAD répond à un besoin réel observé sur le terrain africain.", "align": "center"}, {"type": "cards", "visible": true, "source": "products", "limit": 6, "columns": 3, "items": [], "view_all_label": "Voir tous les produits", "view_all_url": "/produits"}, {"type": "stats", "visible": true, "variant": "dark", "items": [{"value": "10", "label": "Produits technologiques propriétaires"}, {"value": "5", "label": "Pays d''intervention en Afrique"}, {"value": "4", "label": "Expertises d''ingénierie"}, {"value": "14", "label": "Références clients & partenaires"}]}, {"type": "section_header", "visible": true, "eyebrow": "Blog & publications", "title": "Les dernières actualités", "text": "Lancements produits, analyses technologiques et retours d''expérience écrits par nos équipes.", "align": "center"}, {"type": "posts", "visible": true, "limit": 3}, {"type": "section_header", "visible": true, "eyebrow": "Expertises", "title": "Ce que nous faisons", "align": "center"}, {"type": "cards", "visible": true, "source": "services", "limit": 4, "columns": 4, "items": [], "view_all_label": "Toutes nos expertises", "view_all_url": "/expertises"}, {"type": "split", "visible": true, "title": "L''alliance de la technologie et de l''écologie", "text_md": "Fondée par des professionnels passionnés par l''innovation et sensibles aux enjeux environnementaux, **GREEN FAD SARL** accompagne la transition numérique et écologique des organisations en Afrique.\n\n**Notre vision :** un avenir où technologie et durabilité vont de pair, réduisant la fracture numérique en Afrique.\n\n**Notre ambition :** porter nos propres innovations technologiques à l''échelle internationale.", "image_key": "/assets/images/gallery/tech-ecologie.jpg", "image_side": "right", "cta_label": "Découvrir l''entreprise", "cta_url": "/p/entreprise"}, {"type": "section_header", "visible": true, "eyebrow": "Galerie", "title": "Green FAD en images", "text": "Nos équipes, nos produits et le terrain : la vie réelle de l''entreprise.", "align": "center"}, {"type": "gallery_album", "visible": true, "album_slug": "greenfad-en-images", "limit": 7, "layout": "featured"}, {"type": "section_header", "visible": true, "eyebrow": "Démonstrations", "title": "Green FAD en vidéo", "text": "Présentations produits et passages médias — la chaîne YouTube officielle Green FAD.", "align": "center"}, {"type": "video_playlist", "visible": true, "limit": 3}, {"type": "section_header", "visible": true, "eyebrow": "Ressources", "title": "Documents publics", "text": "Plaquettes, fiches produits et guides — téléchargeables librement.", "align": "center"}, {"type": "document_list", "visible": true, "limit": 3}, {"type": "section_header", "visible": true, "eyebrow": "Références", "title": "Ils nous font confiance", "align": "center"}, {"type": "partners", "visible": true, "limit": 14}, {"type": "countries_map", "visible": true, "eyebrow": "Implantation internationale", "title": "Enracinés en Afrique, tournés vers le monde", "text": "Cinq pays d''intervention, une même exigence : concevoir localement, déployer et supporter durablement.", "cta_label": "Découvrir l''implantation", "cta_url": "/implantation"}, {"type": "cta", "visible": true, "title": "Construisons ensemble un avenir durable et digital", "text": "Parlons de votre projet — nos équipes vous répondent rapidement.", "button_label": "Démarrer la conversation", "button_url": "/contact", "variant": "solid"}]' WHERE slug = 'accueil';

-- 9bis) WARIPAY — articles fondateurs du blog (demande du fondateur,
--        10/11/2026) : identiques à la migration 0016, re-seed safe
--        (le DELETE FROM posts en tête de ce fichier efface tout ;
--        ces INSERT garantissent la survie en cas de bump futur)
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'waripay-origine-une-etude', 'WARIPAY : l''étude qui a donné naissance à une ambition',
  'Février 2026 : Green FAD annonce la création de WARIPAY. Tout est parti d''une étude de terrain à Bamako — et d''un constat simple : encaisser en Afrique de l''Ouest ne devrait pas être un parcours du combattant.',
  '# WARIPAY : l''étude qui a donné naissance à une ambition

Février 2026 : Green FAD annonce officiellement la création de **WARIPAY**, son infrastructure de paiement pour l''Afrique de l''Ouest. Mais avant l''annonce, il y a eu une étude — et un constat que nous ne pouvions plus ignorer.

## Le constat de départ

Chez Green FAD, nous exploitons nous-mêmes des produits qui encaissent : billetterie, boutiques, collectes. À chaque fois, la même difficulté revient : **recevoir de l''argent est simple, le faire proprement est compliqué.** Une intégration par opérateur, des réconciliations sur tableur, des frais opaques, des retraits à relancer.

## L''étude de terrain

Pendant trois mois, nous sommes allés écouter le terrain à Bamako : commerçants de quartier, boutiques en ligne naissantes, entreprises qui facturent des clients dans plusieurs pays. Nous avons cartographié ce qu''ils utilisent vraiment au quotidien : **Orange Money**, **Moov Money**, **Wave**, **MTN MoMo**, les cartes **Visa** et **Mastercard**, les virements bancaires UEMOA.

Le résultat est sans appel :

- chacun jongle avec plusieurs canaux d''encaissement, aucun n''est centralisé
- la réconciliation est manuelle, sujette aux erreurs, chronophage
- les frais réels ne sont souvent connus qu''après coup
- les retraits vers la banque ou le wallet restent un processus à part

## La décision

L''étude s''est transformée en conviction : ce n''est pas un outil de plus qu''il faut, c''est **une infrastructure**. Une seule intégration, plusieurs providers, un dashboard, une réconciliation, un settlement. Nous l''avons appelée **WARIPAY** — une API, tous les paiements d''Afrique de l''Ouest.

## Ce que nous nous sommes imposé

Dès le premier jour, trois principes non négociables : **des frais affichés avant chaque confirmation** (aucun coût caché), **un registre en double partie** (chaque mouvement rapprochable à tout instant) et **une couverture pays annoncée clairement** — le Mali d''abord, puis le Sénégal, la Côte d''Ivoire, le Burkina Faso, le Bénin, le Togo, la Guinée-Bissau et le Niger.

La suite ? La construction. Nous vous raconterons bientôt les premières étapes.',
  '/assets/images/blog/waripay-origine-etude.jpg', 'Produits', '["WARIPAY", "Origine", "Étude de terrain"]', 'Green FAD — Équipe produit', 'article', 0, '2026-02-10 09:00:00', 'publie',
  'WARIPAY : l''étude qui a donné naissance à une ambition | Blog Green FAD',
  'Février 2026 : création de WARIPAY annoncée par Green FAD — une seule intégration pour encaisser Orange Money, Moov Money, Wave, MTN MoMo, Visa, Mastercard et banques UEMOA.',
  '/assets/images/blog/waripay-origine-etude.jpg', 'waripay', (SELECT id FROM products WHERE slug = 'waripay'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'waripay-premiers-retours-experience', 'WARIPAY : les premiers retours d''expérience',
  'Août 2026 : le cercle de pilotes de WARIPAY a testé liens de paiement, checkout hébergé et retraits. Voici ce que le terrain nous a appris — et ce que nous avons changé.',
  '# WARIPAY : les premiers retours d''expérience

Six mois après l''annonce de sa création, WARIPAY a franchi une étape discrète mais décisive : un **cercle fermé de pilotes** — commerçants de quartier, jeunes plateformes en ligne, une entreprise de services — a pris en main la console, les liens de paiement et l''API en mode **sandbox**. Voici ce que nous avons appris.

## Ce que les pilotes nous ont dit

**Le lien de paiement avec QR est devenu l''outil préféré.** Créer un lien en un clic, l''afficher en boutique ou l''envoyer par WhatsApp : c''est l''usage le plus immédiat, celui qui convertit le mieux.

**Les frais affichés avant confirmation rassurent.** Transaction après transaction, le même réflexe : regarder le montant des frais avant de valider. Cette transparence est devenue notre meilleur argument de confiance.

**Le choix du canal de retrait compte.** Virement bancaire UEMOA (T+1 ouvré) ou mobile money instantané : les pilotes veulent les deux, selon la journée. Les frais et délais affichés avant chaque retrait évitent les mauvaises surprises.

**La réconciliation sans tableur change la vie.** Le registre en double partie, rapproché de chaque provider, a supprimé le travail manuel de fin de mois. C''est le retour le plus fréquent chez les entreprises.

## Ce que nous avons changé

- **La console réorganisée en quatre espaces** : Pilotage, Opérations, Encaisser, Développeurs — pour que chaque profil trouve son chemin
- **L''application Android** : demandée dès les premières semaines, elle est arrivée avec notifications natives, QR et deep links
- **Le connecteur WooCommerce** : plusieurs pilotes vendent avec WordPress — la v1.0.0 est née de ce besoin
- **Le routage automatique** : quand un provider ralentit ou échoue, il est écarté — les pilotes ne voyaient que le taux de succès monter

## La suite

Ces retours nourrissent la préparation de l''ouverture élargie. Le prochain jalon : l''annonce de la phase de test publique — et les raisons pour lesquelles nous prenons notre temps avant le lancement commercial.',
  '/assets/images/blog/waripay-retours-experience.jpg', 'Produits', '["WARIPAY", "Terrain", "Pilotes", "Retours d''expérience"]', 'Green FAD — Équipe produit', 'article', 0, '2026-08-20 09:00:00', 'publie',
  'WARIPAY : les premiers retours d''expérience | Blog Green FAD',
  'Août 2026 : retours d''expérience du cercle de pilotes WARIPAY — liens de paiement avec QR, frais affichés avant confirmation, retraits banque UEMOA ou mobile money, réconciliation sans tableur.',
  '/assets/images/blog/waripay-retours-experience.jpg', 'waripay', (SELECT id FROM products WHERE slug = 'waripay'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'waripay-phase-de-test-annonce', 'WARIPAY entre en phase de test : pourquoi nous attendons avant le lancement',
  '9 novembre 2026 : WARIPAY ouvre sa phase de test. Console complète, checkout hébergé, application Android, connecteur WooCommerce — et deux raisons assumées d''attendre avant le lancement commercial : les conformités et les partenariats financiers.',
  '# WARIPAY entre en phase de test : pourquoi nous attendons avant le lancement

Le **9 novembre 2026**, WARIPAY entre officiellement en **phase de test**. Pas encore un lancement commercial — une ouverture maîtrisée, assumée. Voici ce qui est disponible, et surtout, pourquoi nous attendons.

## Ce qui est ouvert aujourd''hui

La console marchande est complète : **pilotage en temps réel** (volume, taux de succès, soldes, frais), **opérations** (retraits, remboursements, clients, rapports), **encaissement** (liens de paiement avec QR, checkout hébergé mobile-first) et **espace développeurs** (API & docs, clés, webhooks signés).

- **Une seule intégration** : Orange Money, Moov Money, Wave, MTN MoMo, Visa, Mastercard et banques UEMOA
- **Clés sandbox immédiates** : testez l''API sans engagement, webhooks et idempotence inclus
- **Application Android v1.0.3** et **connecteur WooCommerce v1.0.0** disponibles
- **Rail Mali ouvert** : le Sénégal, la Côte d''Ivoire, le Burkina Faso, le Bénin, le Togo, la Guinée-Bissau et le Niger suivront

## Pourquoi nous attendons

Deux chantiers déterminent notre date de lancement commercial, et nous refusons de les brader.

**Les conformités.** Nous manipulons l''argent des marchands : la vérification KYB des entreprises, les exigences réglementaires de l''espace UEMOA et les contrôles internes doivent être irréprochables **avant** l''ouverture à grande échelle, pas après.

**Les partenariats financiers.** Un settlement fiable repose sur des accords solides avec des institutions financières. Nous préférons une porte ouverte une fois pour toutes plutôt qu''un lancement prématuré suivi de promesses non tenues.

C''est la même discipline qui porte nos produits depuis 2021 : publier quand c''est solide.

## Nous cherchons des partenaires

Vous êtes une **banque de l''espace UEMOA**, une **institution de paiement**, un **opérateur mobile money** ou une **entreprise** qui veut encaisser proprement dès le premier jour ? Parlons-en. Les portes de la phase de test sont ouvertes — et les places de partenaire stratégique le sont aussi.

Contactez l''équipe Green FAD depuis la **page contact** du site ou via la fiche produit WARIPAY.',
  '/assets/images/blog/waripay-phase-de-test.jpg', 'Produits', '["WARIPAY", "Phase de test", "Partenariats", "Conformité"]', 'Green FAD — Équipe produit', 'article', 1, '2026-11-09 09:00:00', 'publie',
  'WARIPAY entre en phase de test : pourquoi nous attendons | Blog Green FAD',
  '9 novembre 2026 : WARIPAY ouvre sa phase de test — console complète, sandbox, Android v1.0.3, WooCommerce v1.0.0. Lancement commercial attendu après conformités et partenariats financiers. Appel à partenaires.',
  '/assets/images/blog/waripay-phase-de-test.jpg', 'waripay', (SELECT id FROM products WHERE slug = 'waripay'));

-- 9ter) Articles produits — le blog raconte le début et la fin de tous les
--        produits (demande du fondateur, 10/11/2026) : identiques à la
--        migration 0017, re-seed safe (le DELETE FROM posts en tête de ce
--        fichier efface tout ; ces INSERT garantissent la survie)
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'tile-origine-bamako', 'Tile : pourquoi nous construisons un réseau social depuis Bamako', 'Mars 2025 : Green FAD ouvre le chantier Tile. Un réseau social conçu en Afrique, pour l''Afrique — parce que la créativité du continent mérite une maison à elle.',
  '# Tile : pourquoi nous construisons un réseau social depuis Bamako

Mars 2025 : Green FAD ouvre un nouveau chantier, le plus ambitieux de son histoire — **Tile**, un réseau social conçu en Afrique, pour l''Afrique. Pourquoi ? Parce que le constat s''imposait à nous, produit après produit.

## Le constat

En exploitant QRFAD et FadCard, nous parlons tous les jours avec des créateurs, des commerçants, des artistes. La même frustration revient : les grandes plateformes ne sont pas pensées pour eux. Données mobiles chères, contenus locaux noyés, monétisation absente, modération lointaine. L''Afrique consomme les réseaux sociaux des autres — elle mérite le sien.

## L''idée

Et si un réseau social partait de trois principes simples ?

- **Léger par construction** : utilisable avec une connexion modeste, pas avec la fibre
- **Local par défaut** : ce qui se passe à Bamako, Ouagadougou ou Niamey se voit d''abord ici
- **Honnête par design** : trois flux clairs — Certifié pour l''information vérifiée, Global pour la communauté, Vidéo pour la création

Nous l''avons appelé **Tile** — « le Réseau du Progrès ».

## Le chemin devant nous

Nous savons ce que construire veut dire : FadCard et QRFAD ont demandé des années de discipline. Tile suivra la même règle — **publier quand c''est solide**, pas avant. Le chantier démarre ce mois-ci ; la première étape sera publique quand elle sera prête.

Treize mois plus tard, Tile serait lancée publiquement. Vingt mois plus tard, elle serait sur les stores. Mais cela, nous ne le savions pas encore. Ce que nous savions : la décision était prise, et elle était juste.',
  '/assets/images/blog/tile-origine-bamako.jpg', 'Produits', '["Tile", "Origine", "Réseau social"]', 'Green FAD — Équipe produit', 'article', 0, '2025-03-12 09:00:00', 'publie',
  'Tile : pourquoi nous construisons un réseau social depuis Bamako | Blog Green FAD', 'Mars 2025 : naissance du projet Tile, le réseau social conçu à Bamako par Green FAD — léger par construction, local par défaut, honnête par design.', '/assets/images/blog/tile-origine-bamako.jpg', 'tile', (SELECT id FROM products WHERE slug = 'tile'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'tile-stores-1-0-6', 'Tile 1.0.6 arrive sur les stores : Android et iOS officiels', '2 novembre 2026 : après un an et huit mois d''ingénierie et une release 1.0 verrouillée en juillet, Tile est publiée sur les canaux officiels Android et iOS. La version 1.0.6+724 marque l''aboutissement.',
  '# Tile 1.0.6 arrive sur les stores : Android et iOS officiels

Le **2 novembre 2026**, Tile franchit la dernière marche : la version **1.0.6+724** est publiée sur les canaux officiels Android et iOS. Ce jalon conclut un chantier ouvert en mars 2025 — un an et huit mois d''ingénierie, racontés pas à pas dans nos articles.

## Ce qui était prêt avant les stores

- **Avril 2026** : lancement public du Réseau du Progrès, d''abord en web app
- **Juin 2026** : parité Android et iOS, trois flux (Certifié, Global, Vidéo)
- **Juillet 2026** : release 1.0 verrouillée — analyse statique sans erreur, trois fils validés, backend gelé
- **Septembre-octobre 2026** : mise à l''échelle, audits, espace entreprise, Explorer, studio de création, authentification sécurisée, parité complète des canaux

## Ce que la publication change

Pour les utilisateurs : plus besoin de passer par le navigateur — Tile s''installe comme les grandes applications, avec notifications natives, mises à jour automatiques et la confiance des canaux officiels. La **PWA reste disponible** : deux portes, une seule maison.

## La suite

La 1.0.6 n''est pas une fin : c''est un socle. Le rythme Tile continue — des mises à jour régulières, documentées ici, comme depuis le premier jour. Le Réseau du Progrès ne fait que commencer.',
  '/assets/images/blog/tile-stores-1-0-6.jpg', 'Produits', '["Tile", "Android", "iOS", "Publication"]', 'Green FAD — Équipe produit', 'article', 0, '2026-11-02 09:00:00', 'publie',
  'Tile 1.0.6 arrive sur les stores : Android et iOS officiels | Blog Green FAD', '2 novembre 2026 : Tile 1.0.6+724 publiée sur les canaux officiels Android et iOS — aboutissement d''un an et huit mois d''ingénierie. La PWA reste disponible.', '/assets/images/blog/tile-stores-1-0-6.jpg', 'tile', (SELECT id FROM products WHERE slug = 'tile'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'fadcard-origine-idee', 'FAD CARD : l''idée qui a lancé Green FAD', 'Février 2021 : après deux ans de réflexion née d''une frustration quotidienne à Bamako, Green FAD officialise la création de FAD CARD — la carte de visite numérique qui doit tout changer.',
  '# FAD CARD : l''idée qui a lancé Green FAD

Février 2021 : Green FAD officialise la création de **FAD CARD**, son premier produit grand public. Derrière ce lancement de chantier, il y a deux années d''observation et une frustration aussi banale qu''universelle.

## La frustration de départ

Tout commence en 2019 à Bamako. Des rencontres professionnelles qui finissent en tas de cartes papier — perdues, oubliées, jamais numérisées. Des coordonnées qui changent et rendent des centaines de cartes obsolètes d''un coup. Un constat simple : **la carte de visite papier n''a pas évolué depuis des décennies**, alors que tout le monde a un smartphone en poche.

## L''idée

Et si la carte de visite devenait **numérique et vivante** ? Un profil en ligne, toujours à jour, partagé par simple contact ou par QR code — sans application à installer pour celui qui le reçoit. Le nom s''impose de lui-même : **FAD CARD**, la carte de visite numérique made in Green FAD.

## Trois ans de gestation

De 2019 à 2021, l''idée mûrit : cadrage du projet, définition des objectifs, développement patient. Nous appliquons une règle que nous ne quitterons plus : **publier quand c''est solide**, pas avant.

## La promesse

FAD CARD sera lancée à Bamako dans les semaines qui viennent. Un produit simple, utile dès le premier jour, pensé pour les professionnels d''ici — et conçu pour grandir. Nous ne le savons pas encore, mais ce petit produit ouvrira la voie à toute la suite : Market, Tickets, Fund, Vote, Pay.

L''aventure commence.',
  '/assets/images/blog/fadcard-origine-idee.jpg', 'Produits', '["FAD CARD", "Origine", "vCard"]', 'Green FAD — Équipe produit', 'article', 0, '2021-02-18 09:00:00', 'publie',
  'FAD CARD : l''idée qui a lancé Green FAD | Blog Green FAD', 'Février 2021 : création de FAD CARD officialisée par Green FAD — une carte de visite numérique et vivante, partagée par simple contact ou QR code.', '/assets/images/blog/fadcard-origine-idee.jpg', 'fad-card', (SELECT id FROM products WHERE slug = 'fad-card'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'fadcard-aujourdhui', 'FadCard fin 2026 : six applications, 66 pays — et la suite', 'Novembre 2026 : cinq ans et demi après le lancement de la vCard à Bamako, FadCard est devenue une plateforme six-en-un explorée dans 66 pays. Récit d''une trajectoire — et cap sur la suite.',
  '# FadCard fin 2026 : six applications, 66 pays — et la suite

Novembre 2026. Cinq ans et demi après le lancement de la vCard numérique à Bamako, FadCard est devenue autre chose qu''une carte de visite : **une plateforme six applications** explorée dans **66 pays**. L''occasion de reprendre le fil — et de dire où nous allons.

## Le chemin parcouru

- **Mai 2021** : la vCard numérique — partage des coordonnées par simple contact
- **Juillet 2022** : Market — vendre en ligne depuis sa carte
- **Février 2023** : Tickets — la billetterie par QR code, sans contrefaçon possible
- **Octobre 2023** : Fund — des collectes transparentes, suivies en temps réel
- **Mai 2024** : Vote — sondages et compétitions, un vote par personne
- **Décembre 2024** : Pay — un compte, six applications, un encaissement centralisé
- **Août 2025** : 153 designs et cartes physiques NFC
- **Mars 2026** : analytics temps réel, 66 pays, 40+ devises

## Ce que FadCard est devenue

Un professionnel crée sa carte en quelques minutes, vend ses produits, vend ses tickets, collecte des fonds, organise ses votes et encaisse — partout — depuis **un seul compte**. C''est exactement la promesse de départ : rendre simple ce qui était compliqué.

## Cap sur la suite

La règle ne change pas : des mises à jour régulières, documentées, sans surprises. FadCard continue de grandir avec ses utilisateurs — artisans, commerçants, artistes, écoles, associations — et reste le produit pionnier qui guide tous les choix de Green FAD. Le meilleur reste à écrire.',
  '/assets/images/blog/fadcard-aujourdhui.jpg', 'Produits', '["FAD CARD", "Bilan", "Écosystème"]', 'Green FAD — Équipe produit', 'article', 0, '2026-11-06 09:00:00', 'publie',
  'FadCard fin 2026 : six applications, 66 pays — et la suite | Blog Green FAD', 'Novembre 2026 : FadCard en bilan — de la vCard de 2021 à la plateforme six applications, 66 pays, 40+ devises. Et la suite : mises à jour régulières, toujours documentées.', '/assets/images/blog/fadcard-aujourdhui.jpg', 'fad-card', (SELECT id FROM products WHERE slug = 'fad-card'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'qrfad-origine-constat', 'QRFAD : avant le QR code, il y avait le constat', 'Novembre 2020 : à Bamako, des restaurants pleins, des menus fatigués, des clients équipés de smartphones. Green FAD décide de construire la réponse la plus simple : un QR code. Le chantier QRFAD démarre.',
  '# QRFAD : avant le QR code, il y avait le constat

Novembre 2020 : Green FAD lance le chantier **QRFAD**. Comme toujours chez nous, tout est parti du terrain — pas d''une mode.

## Le constat

À Bamako, les établissements ne manquent pas de clients : ils manquent d''outils. Des menus papier fatigués, à réimprimer à chaque prix qui change. Des plats qui s''affichent mal. Des clients équipés de smartphones — et d''un menu qui ne sait pas en profiter. Chaque réimpression coûte de l''argent ; chaque menu obsolète en coûte encore plus.

## L''idée la plus simple

Nous avons exploré des pistes complexes — applications à télécharger, bornes, gadgets — avant de comprendre que la réponse tenait dans **un carré imprimé** : un QR code. Le client scanne, le menu s''ouvre dans son navigateur, à jour, avec photos et prix. Rien à installer pour lui. Rien à réimprimer dix fois par an pour l''établissement.

## Un chantier patient

De ce constat à la première mise en service, il nous faudra quelques mois de construction — et des années de réflexion en amont pour savoir exactement quoi construire. Le lancement public est prévu pour mars 2021, à Bamako.

Nous ne le savons pas encore, mais QRFAD deviendra bien plus qu''un menu numérique : commandes, WhatsApp, hôtels, caisse, multi-établissements, portail public. Tout partira de là.',
  '/assets/images/blog/qrfad-origine-constat.jpg', 'Produits', '["QRFAD", "Origine", "Restauration"]', 'Green FAD — Équipe produit', 'article', 0, '2020-11-17 09:00:00', 'publie',
  'QRFAD : avant le QR code, il y avait le constat | Blog Green FAD', 'Novembre 2020 : naissance du projet QRFAD — le constat des menus papier à Bamako et l''idée la plus simple : un QR code, un menu à jour, rien à installer.', '/assets/images/blog/qrfad-origine-constat.jpg', 'qrfad', (SELECT id FROM products WHERE slug = 'qrfad'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'qrfad-cinq-ans-terrain', 'QRFAD 2026 : cinq ans de terrain, du menu au portail public', 'Novembre 2026 : cinq ans après le premier menu numérique à Bamako, QRFAD est une plateforme complète de gestion pour la restauration et l''hôtellerie. Retour sur la trajectoire — et sur la suite.',
  '# QRFAD 2026 : cinq ans de terrain, du menu au portail public

Novembre 2026. Cinq ans que le premier QR code QRFAD est collé sur une table à Bamako. Depuis, le produit n''a cessé de grandir — toujours à l''écoute des établissements. Retour sur la trajectoire.

## D''un menu à une plateforme

- **Mars 2021** : le menu numérique par QR code — le début de l''aventure
- **Juin 2022** : multi-établissements — les groupes gèrent tous leurs sites d''un seul compte
- **Mars 2023** : commandes depuis le menu — la salle connectée à la cuisine
- **Novembre 2023** : WhatsApp — la commande arrive sur le numéro du restaurant
- **Septembre 2024** : hôtels — chambres, réservations et conciergerie
- **Juin 2025** : caisse intégrée — QRFAD devient un outil complet de gestion
- **Mai 2026** : portail public — **9 établissements** explorable en ligne

## Ce que QRFAD est devenue

Un établissement gère aujourd''hui son menu, ses commandes, sa caisse, ses chambres et sa visibilité en ligne depuis une seule interface — et ses clients commandent, réservent et explorent **sans rien installer**. Chaque fonctionnalité est née d''un besoin exprimé sur le terrain, pas d''une intuition de bureau.

## Cap sur la suite

Le rythme reste le même : des évolutions régulières, pensées pour les connexions et les usages d''ici. Les restaurants, hôtels et établissements qui veulent rejoindre la plateforme ont un portail qui les attend. L''histoire continue.',
  '/assets/images/blog/qrfad-cinq-ans-terrain.jpg', 'Produits', '["QRFAD", "Bilan", "Restauration"]', 'Green FAD — Équipe produit', 'article', 0, '2026-11-05 09:00:00', 'publie',
  'QRFAD 2026 : cinq ans de terrain, du menu au portail public | Blog Green FAD', 'Novembre 2026 : QRFAD en bilan — du menu QR de 2021 au portail public de 9 établissements, en passant par la caisse, WhatsApp et les hôtels. La suite, documentée comme toujours.', '/assets/images/blog/qrfad-cinq-ans-terrain.jpg', 'qrfad', (SELECT id FROM products WHERE slug = 'qrfad'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'ferefad-telimani-2-2-0', 'FEREFAD 2.2.0 : Telimani au cœur de la super-app', '20 octobre 2026 : FEREFAD passe en version 2.2.0. Telimani — taxi, taxi-moto et livraison — s''intègre au cœur de la plateforme, et les chauffeurs gagnent un espace professionnel dédié.',
  '# FEREFAD 2.2.0 : Telimani au cœur de la super-app

Le **20 octobre 2026**, FEREFAD publie sa version **2.2.0** — la plus importante de son histoire récente : **Telimani** s''installe au cœur de la plateforme.

## Telimani : la mobilité intégrée

Avec la 2.2.0, FEREFAD réunit la marketplace et la mobilité dans une seule application :

- **Taxi et taxi-moto** : commander une course en quelques gestes
- **Livraison** : faire acheminer les achats de la marketplace
- **Espace chauffeur professionnel** : les chauffeurs disposent de leur propre espace pour gérer leurs courses et leur activité

Une seule application pour vendre, acheter, se déplacer et livrer — c''est la promesse de la super-app africaine que FEREFAD construit pas à pas.

## Trois canaux publics

La version 2.2.0 est accessible sur les trois canaux publics de FEREFAD. L''optimisation pour les connexions à faible débit reste une règle de fabrication : la plateforme est pensée pour les réalités du réseau d''ici.

## La suite

Chaque version documente son chemin : la 2.2.0 confirme la direction — une marketplace inclusive et transparente où le commerce numérique et la mobilité se renforcent mutuellement. Les prochaines étapes suivront la même boussole : plus d''autonomie pour la jeunesse africaine, plus de visibilité pour les vendeurs, plus de simplicité pour les acheteurs.',
  '/assets/images/blog/ferefad-telimani-2-2-0.jpg', 'Produits', '["FEREFAD", "Telimani", "Version 2.2.0"]', 'Green FAD — Équipe produit', 'article', 0, '2026-10-20 09:00:00', 'publie',
  'FEREFAD 2.2.0 : Telimani au cœur de la super-app | Blog Green FAD', '20 octobre 2026 : FEREFAD 2.2.0 — Telimani (taxi, taxi-moto, livraison) au cœur de la super-app, espace chauffeur professionnel, trois canaux publics.', '/assets/images/blog/ferefad-telimani-2-2-0.jpg', 'ferefad', (SELECT id FROM products WHERE slug = 'ferefad'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'ferefad-marketplace-afrique', 'FEREFAD : une marketplace pensée pour l''Afrique, portée par Oumar Ballo', 'À l''origine de FEREFAD, il y a la vision d''Oumar Ballo : autonomiser la jeunesse africaine par le commerce numérique. Green FAD en assure la conception technique, le développement et l''exploitation. Récit d''un projet à deux voix.',
  '# FEREFAD : une marketplace pensée pour l''Afrique, portée par Oumar Ballo

Certains produits naissent d''une étude, d''autres d''une frustration. **FEREFAD** est né d''une conviction — celle d''**Oumar Ballo**, qui a imaginé une plateforme pour **autonomiser la jeunesse africaine via le commerce numérique**.

## Un projet à deux voix

Concrétiser une vision demande des bras et des années d''expérience : c''est là que Green FAD est entré dans l''histoire. Conformément à son rôle depuis le début, **Green FAD assure la conception technique, le développement et l''exploitation** de FEREFAD ; la direction du projet reste fidèle à l''intuition d''origine — **une marketplace inclusive et transparente**, pensée pour les réalités du continent.

## Ce que FEREFAD propose déjà

- **Publication d''annonces simple et guidée** — vendre en ligne ne doit pas être un privilège
- **Recherche et filtres** par catégorie et localisation
- **Messagerie interne** entre acheteurs et vendeurs
- **Profils vendeurs** pour renforcer la confiance
- **Optimisation pour le mobile et les connexions à faible débit**
- Et depuis le 20 octobre 2026, **Telimani** : taxi, taxi-moto et livraison intégrés — version 2.2.0

## Une histoire documentée avec honnêteté

Nous appliquons à FEREFAD la même règle qu''aux autres produits : **ne jamais transformer une estimation en date certaine**. Les jalons précis de la genèse sont en cours d''archivage et seront publiés au fur et à mesure — la transparence fait partie du produit.

Le meilleur moyen de suivre cette histoire : la vivre. La marketplace vous attend.',
  '/assets/images/blog/ferefad-marketplace-afrique.jpg', 'Produits', '["FEREFAD", "Récit", "Origine"]', 'Green FAD — Équipe produit', 'recit', 0, '2026-11-04 09:00:00', 'publie',
  'FEREFAD : une marketplace pensée pour l''Afrique, portée par Oumar Ballo | Blog Green FAD', 'Le récit FEREFAD : la vision d''Oumar Ballo, le partenariat technique Green FAD, une marketplace inclusive et transparente — et la version 2.2.0 avec Telimani.', '/assets/images/blog/ferefad-marketplace-afrique.jpg', 'ferefad', (SELECT id FROM products WHERE slug = 'ferefad'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'paygfad-origine-paiements', 'PayGfad : penser les paiements du quotidien dès 2023', 'Septembre 2023 : Green FAD lance le chantier PayGfad — une suite de gestion pensée pour les coopératives, écoles, institutions financières et opérateurs d''énergie du Mali et de la sous-région.',
  '# PayGfad : penser les paiements du quotidien dès 2023

Septembre 2023 : Green FAD lance le chantier **PayGfad**, sa suite de gestion pour les entreprises et institutions d''Afrique. Pas une application de plus : une réponse construite **au contact direct du terrain**.

## Le constat

Écoles qui suivent les scolarités sur des cahiers, coopératives qui comptent leurs membres à la main, institutions financières qui gèrent prêts et épargne sur des tableurs dispersés, opérateurs d''énergie solaire qui traquent leurs activations : les outils existants ignorent les réalités d''ici — connectivité limitée, smartphones plutôt qu''ordinateurs, paiement mobile avant tout.

## L''idée : une suite par métiers

Plutôt qu''un logiciel générique, PayGfad sera **une suite par métiers** — un socle commun (tableau de bord, clients, stocks, factures, paiements **PAYG** — Pay As You Go —, journal d''audit) et des modules dédiés : **ERP, Finance, Energy, Agro, School**. Une seule plateforme cloud, utilisable depuis le navigateur d''un smartphone, sans application à installer.

## La construction

En 2024, la suite est mise en ligne — sa présence attestée dès cette année-là. Le module **Scool**, pensé avec et pour des établissements scolaires, deviendra son fer de lance en production.

Nous ne le savons pas encore, mais PayGfad couvrira bientôt sept pays et cinq modules. Le chantier commence.',
  '/assets/images/blog/paygfad-origine-paiements.jpg', 'Produits', '["PAYGFAD", "Origine", "SaaS"]', 'Green FAD — Équipe produit', 'article', 0, '2023-09-14 09:00:00', 'publie',
  'PayGfad : penser les paiements du quotidien dès 2023 | Blog Green FAD', 'Septembre 2023 : naissance du projet PayGfad — une suite de gestion par métiers (ERP, Finance, Energy, Agro, School) pensée pour les réalités africaines.', '/assets/images/blog/paygfad-origine-paiements.jpg', 'paygfad', (SELECT id FROM products WHERE slug = 'paygfad'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'paygfad-scool', 'PayGfad Scool : les paiements scolaires, enfin simples', 'Mars 2026 : le module Scool devient le fer de lance de PayGfad en production. Élèves, notes, bulletins, présences et scolarités — dans le navigateur du téléphone du directeur.',
  '# PayGfad Scool : les paiements scolaires, enfin simples

Mars 2026 : **Scool**, le module scolaire de PayGfad, devient **le module principal en production**. Un jalon qui résume tout ce pourquoi la suite existe.

## Ce que Scool change pour les établissements

Avant Scool, la vie d''un établissement tenait dans des cahiers et des tableurs : listes d''élèves, reçus de scolarité, moyennes recalculées à la main, présences estimées. Avec Scool, tout vit dans une seule interface :

- **Élèves, notes, bulletins, présences et scolarités** réunis au même endroit
- **Encaissement Mobile Money** — Orange Money, Wave, MTN, Moov — plus espèces et crédit
- **Paiements PAYG** : chaque établissement avance à son rythme
- Un accès par simple navigateur, **optimisé smartphone** — sans application à installer

## Pensé avec le terrain

Scool n''est pas né dans une tour d''ivoire : il a été construit **au contact des écoles** — leurs contraintes réelles, rythmes de paiement étalés, connectivité, personnel déjà très sollicité, dictant chaque choix.

## La suite

Scool est la tête de pont de PayGfad : ERP, Finance, Energy et Agro suivent la même route, vers les sept pays couverts par la suite. Les établissements qui veulent essayer ont un essai gratuit de 30 jours qui les attend.',
  '/assets/images/blog/paygfad-scool.jpg', 'Produits', '["PAYGFAD", "Scool", "Éducation"]', 'Green FAD — Équipe produit', 'article', 0, '2026-03-10 09:00:00', 'publie',
  'PayGfad Scool : les paiements scolaires, enfin simples | Blog Green FAD', 'Mars 2026 : PayGfad Scool en production — élèves, notes, bulletins, présences, scolarités et encaissement Mobile Money dans une seule interface smartphone.', '/assets/images/blog/paygfad-scool.jpg', 'paygfad', (SELECT id FROM products WHERE slug = 'paygfad'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'cloudaf-v1-1-agent', 'CloudAf v1.1 : l''Agent entre dans l''atelier', 'Août 2026 : deux mois après le lancement, CloudAf publie sa version 1.1 — l''Agent CloudAf avec ses outils audités (code, builds, déploiements) et le Studio Builder complet.',
  '# CloudAf v1.1 : l''Agent entre dans l''atelier

Août 2026 : deux mois après son lancement public, **CloudAf** publie sa **version 1.1**. Au programme : l''arrivée de l''**Agent CloudAf** et l''achèvement du **Studio Builder**.

## L''Agent CloudAf

Notre conviction depuis le début : l''IA ne doit pas seulement suggérer, elle doit **agir avec vous**. La v1.1 pose les fondations de l''Agent : il discute du projet, le comprend et opère de **véritables outils audités** — code, builds, déploiements. Chaque action passe par des outils visibles et vérifiables : rien ne se fait dans l''ombre.

## Le Studio Builder se complète

Le Studio Builder atteint son format définitif : **blocs, canvas glisser-déposer, inspecteur, thèmes**. On commence visuellement, on descend au code quand on le décide — le double éditeur no-code + code, synchronisé, tient sa promesse.

## Le rythme tient

v1.0 en juin, v1.1 en août : la cadence trimestrielle annoncée au lancement n''est pas un slogan. La prochaine étape est déjà en préparation — et elle ouvrira CloudAf à une nouvelle économie. Rendez-vous en octobre.',
  '/assets/images/blog/cloudaf-v1-1-agent.jpg', 'Produits', '["CloudAf", "v1.1", "Studio Builder"]', 'Green FAD — Équipe produit', 'article', 0, '2026-08-14 09:00:00', 'publie',
  'CloudAf v1.1 : l''Agent entre dans l''atelier | Blog Green FAD', 'Août 2026 : CloudAf v1.1 — l''Agent CloudAf et ses outils audités (code, builds, déploiements) entrent dans la plateforme, et le Studio Builder se complète.', '/assets/images/blog/cloudaf-v1-1-agent.jpg', 'cloudaf', (SELECT id FROM products WHERE slug = 'cloudaf'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'cloudaf-novembre-2026', 'CloudAf en novembre : cap sur la consolidation', 'Début novembre 2026 : après trois mises à jour majeures en cinq mois (v1.0 à v1.2), CloudAf entre dans une phase de consolidation — maintenance, améliorations continues et préparation de la suite.',
  '# CloudAf en novembre : cap sur la consolidation

Début novembre 2026, CloudAf franchit un cap discret mais important : après **trois mises à jour majeures en cinq mois**, la plateforme entre dans une phase de **consolidation**.

## La trajectoire, pour mémoire

- **Juin 2026 (v1.0)** : lancement public — double éditeur no-code + code, IA intégrée, déploiement en un clic avec SSL et CDN
- **Août 2026 (v1.1)** : Agent CloudAf aux outils audités et Studio Builder complet
- **Octobre 2026 (v1.2)** : CloudAf Store — templates en crédits, revente de projets — et monitoring temps réel avec alertes

## Pourquoi la consolidation est une bonne nouvelle

Une plateforme qui encaisse trois mises à jour majeures doit aussi **prendre le temps de consolider** : maintenance, améliorations continues, durcissement des parcours que les créateurs empruntent chaque jour — du premier projet au déploiement. C''est la même discipline qui guide tous les produits Green FAD : **publier quand c''est solide, renforcer avant d''étendre**.

## La suite

Les prochaines évolutions suivront la cadence documentée qui fait notre réputation. Les créateurs, eux, continuent de construire — et le Store continue de prouver que créer sur CloudAf peut devenir une source de revenus.',
  '/assets/images/blog/cloudaf-novembre-2026.jpg', 'Produits', '["CloudAf", "Bilan", "Monitoring"]', 'Green FAD — Équipe produit', 'article', 0, '2026-11-03 09:00:00', 'publie',
  'CloudAf en novembre : cap sur la consolidation | Blog Green FAD', 'Début novembre 2026 : CloudAf consolide — v1.0, v1.1 et v1.2 publiées en cinq mois, maintenance et améliorations continues avant la suite.', '/assets/images/blog/cloudaf-novembre-2026.jpg', 'cloudaf', (SELECT id FROM products WHERE slug = 'cloudaf'));
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'greenfad-nouvelles-routes', 'L''Amitié Fad, NIAFAD, SARAPAY, Carte Santé : les nouvelles routes de Green FAD', 'Au-delà de ses plateformes phares, Green FAD cultive une nouvelle génération de produits : l''hôtellerie connectée, l''ERP africain, le paiement mobile et le dossier médical numérique. Tour d''horizon.',
  '# L''Amitié Fad, NIAFAD, SARAPAY, Carte Santé : les nouvelles routes de Green FAD

Green FAD, ce sont des plateformes que vous connaissez — QRFAD, FadCard, Tile, CloudAf, PayGfad, FEREFAD, WARIPAY. Mais le laboratoire ne dort jamais : voici **quatre nouvelles routes** ouvertes par nos équipes.

## L''Amitié Fad — l''hôtellerie connectée

Conçu à partir des **besoins exprimés par les acteurs de l''hôtellerie malienne**, L''Amitié Fad simplifie la communication en hôtel : un **QR code dans la chambre**, et le client demande ménage, taxi ou restauration depuis son smartphone. Le personnel reçoit, suit, traite ; la direction mesure volumes et délais. Un service connecté clé en main, déployé avec les établissements.

## NIAFAD — l''ERP conçu pour l''Afrique

Ventes, stocks, finances, ressources humaines : **NIAFAD** réunit la gestion d''entreprise dans un environnement unique et sécurisé — devis, factures, caisse, paie, rôles et tableaux de bord. Né de nos **accompagnements d''entreprises locales**, il applique à la gestion ce que nos plateformes appliquent au commerce : la simplicité d''abord.

## SARAPAY — le paiement pensé pour le marché africain

**SARAPAY** est notre solution de paiement mobile : transactions sécurisées, traçabilité complète, notifications en temps réel, intégration aux plateformes Green FAD et aux systèmes clients. Elle naît au sein de notre **laboratoire d''innovation**, en réponse aux besoins concrets de nos propres produits.

## Carte Santé — le dossier médical qui vous suit partout

Prolongement naturel de l''expertise cartes connectées de FAD CARD, la **Carte Santé** met le dossier médical personnel dans la poche : historique, traitements, informations d''urgence — **allergies, groupe sanguin, contacts** — accessibles au cabinet comme aux urgences. Le patient décide **qui consulte son dossier** : la confiance par la conception.

## Une même boussole

Quatre produits, quatre secteurs, une même règle : partir des besoins du terrain, publier quand c''est solide, documenter chaque étape. Ces nouvelles routes ne remplacent rien — elles prolongent tout. Et elles ne demandent qu''à grandir avec leurs premiers utilisateurs.',
  '/assets/images/blog/greenfad-nouvelles-routes.jpg', 'Produits', '["Green FAD", "Portefeuille", "Innovation"]', 'Green FAD — Équipe produit', 'recit', 0, '2026-11-07 09:00:00', 'publie',
  'L''Amitié Fad, NIAFAD, SARAPAY, Carte Santé : les nouvelles routes de Green FAD | Blog Green FAD', 'L''Amitié Fad (hôtellerie connectée), NIAFAD (ERP africain), SARAPAY (paiement mobile), Carte Santé (dossier médical) : les nouvelles routes de Green FAD.', '/assets/images/blog/greenfad-nouvelles-routes.jpg', NULL, NULL);

-- 10) Version du contenu
UPDATE settings SET value = '14' WHERE key = 'content_version';

-- =====================================================================
-- DELTA v15 — Fiches produits « style store » :
--   captures d'écran officielles de FEREFAD (fournies par la direction),
--   liens de téléchargement RÉELS vérifiés (Google Play, sites officiels),
--   médiathèque enrichie, données structurées SoftwareApplication.
-- =====================================================================

-- 1) Bibliothèque : visuels officiels FEREFAD (10 fichiers optimisés)
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/ferefad-hero.jpg', 'ferefad-hero.jpg', 'image/jpeg', 78603, 1024, 500, 'FEREFAD — Achetez. Vendez. Déplacez. Marketplace et Telimani partout au Mali', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/ferefad-shot-01.jpg', 'ferefad-shot-01.jpg', 'image/jpeg', 165322, 800, 1422, 'Marketplace FEREFAD — achetez et vendez en quelques taps', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/ferefad-shot-02.jpg', 'ferefad-shot-02.jpg', 'image/jpeg', 158161, 800, 1422, 'Telimani — suivez votre course en temps réel sur la carte', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/ferefad-shot-03.jpg', 'ferefad-shot-03.jpg', 'image/jpeg', 133680, 800, 1422, 'Telimani — taxi, taxi-moto et livraison au juste prix', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/ferefad-shot-04.jpg', 'ferefad-shot-04.jpg', 'image/jpeg', 110712, 800, 1422, 'Messages intégrés — discutez et concluez vite', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/ferefad-shot-05.jpg', 'ferefad-shot-05.jpg', 'image/jpeg', 131570, 800, 1422, 'Votre profil, votre boutique — QR code, favoris et annonces', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/ferefad-shot-06.jpg', 'ferefad-shot-06.jpg', 'image/jpeg', 131136, 800, 1422, 'Espace chauffeur — conduisez, encaissez, suivez vos gains', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/ferefad-shot-07.jpg', 'ferefad-shot-07.jpg', 'image/jpeg', 109837, 800, 1422, 'Vendez — publiez votre annonce en 2 minutes', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/ferefad-shot-08.jpg', 'ferefad-shot-08.jpg', 'image/jpeg', 130395, 800, 1422, 'Tableau de bord chauffeur — revenus, note et commandes', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/products/ferefad-shot-09.jpg', 'ferefad-shot-09.jpg', 'image/jpeg', 134124, 800, 1422, 'Ferefad Connect — fier d''être 100% africain', '/', 'seed', datetime('now'));

-- 2) FEREFAD : couverture hero officielle, site et store RÉELS (vérifiés publiquement),
--    captures mobile et SEO complet.
UPDATE products SET
  image_key = '/assets/images/products/ferefad-hero.jpg',
  og_image = '/assets/images/products/ferefad-hero.jpg',
  external_url = 'https://ferefad.com',
  links_json = '[{"label":"Site officiel ferefad.com","url":"https://ferefad.com"},{"label":"Google Play","url":"https://play.google.com/store/apps/details?id=com.ferefad.connect"}]',
  downloads_json = '[{"platform":"android","url":"https://play.google.com/store/apps/details?id=com.ferefad.connect","label":"Google Play"},{"platform":"web","url":"https://ferefad.com","label":"FereFad Connect"}]',
  screenshots_json = '[{"key":"/assets/images/products/ferefad-shot-01.jpg","type":"mobile","alt":"Marketplace — achetez et vendez en quelques taps"},{"key":"/assets/images/products/ferefad-shot-02.jpg","type":"mobile","alt":"Telimani — votre course en temps réel sur la carte"},{"key":"/assets/images/products/ferefad-shot-03.jpg","type":"mobile","alt":"Telimani — taxi, taxi-moto et livraison au juste prix"},{"key":"/assets/images/products/ferefad-shot-04.jpg","type":"mobile","alt":"Messages intégrés — discutez, concluez vite"},{"key":"/assets/images/products/ferefad-shot-05.jpg","type":"mobile","alt":"Votre profil, votre boutique — QR code et favoris"},{"key":"/assets/images/products/ferefad-shot-06.jpg","type":"mobile","alt":"Espace chauffeur — conduisez, encaissez, suivez vos gains"},{"key":"/assets/images/products/ferefad-shot-07.jpg","type":"mobile","alt":"Publiez votre annonce en 2 minutes"},{"key":"/assets/images/products/ferefad-shot-08.jpg","type":"mobile","alt":"Tableau de bord chauffeur — revenus, note et commandes"},{"key":"/assets/images/products/ferefad-shot-09.jpg","type":"mobile","alt":"Ferefad Connect — fier d''être 100% africain"}]',
  meta_title = 'FEREFAD Connect — Marketplace, taxi et livraison au Mali | Green FAD',
  meta_description = 'FEREFAD Connect, la super-application malienne de Green FAD : marketplace de petites annonces, taxis et taxi-moto Telimani au juste prix, livraison, messagerie intégrée et espace chauffeur. Téléchargez-la gratuitement sur Google Play ou utilisez la version web.'
WHERE slug = 'ferefad';

-- 3) CLOUDAf : lien de téléchargement web officiel (vérifié)
UPDATE products SET downloads_json = '[{"platform":"web","url":"https://cloudaf.net","label":"Application web"}]' WHERE slug = 'cloudaf' AND downloads_json = '[]';

-- 4) Album « Produits Green FAD » : les 10 visuels officiels FEREFAD
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'FEREFAD — Achetez. Vendez. Déplacez.', 'FEREFAD', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 28, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/ferefad-hero.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'FEREFAD — Marketplace', 'FEREFAD', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 29, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/ferefad-shot-01.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'FEREFAD — Telimani temps réel', 'FEREFAD', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 30, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/ferefad-shot-02.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'FEREFAD — Prix clairs, zéro stress', 'FEREFAD', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 31, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/ferefad-shot-03.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'FEREFAD — Messagerie intégrée', 'FEREFAD', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 32, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/ferefad-shot-04.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'FEREFAD — Profil boutique', 'FEREFAD', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 33, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/ferefad-shot-05.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'FEREFAD — Espace chauffeur', 'FEREFAD', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 34, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/ferefad-shot-06.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'FEREFAD — Publier une annonce', 'FEREFAD', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 35, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/ferefad-shot-07.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'FEREFAD — Tableau de bord chauffeur', 'FEREFAD', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 36, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/ferefad-shot-08.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'image', m.id, 'FEREFAD Connect — 100% africain', 'FEREFAD', (SELECT id FROM media_albums WHERE slug='produits-green-fad'), 37, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') FROM media m WHERE m.r2_key='/assets/images/products/ferefad-shot-09.jpg' AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.album_id=(SELECT id FROM media_albums WHERE slug='produits-green-fad') AND mi.media_id=m.id);

-- 5) Version du contenu
UPDATE settings SET value = '15' WHERE key = 'content_version';

-- =====================================================================
-- DELTA v16 — PATRIMOINE HISTORIQUE (Mission CTO N°2) :
--   chronologies vivantes par produit (jalons), journal des versions,
--   sources & traçabilité, articles de reconstruction éditoriale.
--   RÈGLE CARDINALE : aucune date inventée — chaque date porte son
--   niveau de précision (exacte / approximative / archives / estimee /
--   inconnue) et sa source. Les dates approximatives restent approximatives.
-- =====================================================================

-- 1) Introductions des sections « Parcours historique »
UPDATE products SET history_intro_md = 'FAD CARD n''est pas née d''un cahier des charges impersonnel : l''idée a été esquissée il y a environ sept ans, développée pendant environ trois années, puis mise en production jusqu''à l''arrivée du premier utilisateur. Depuis, le produit vit : des mises à jour importantes arrivent environ tous les trois à six mois, la dernière datant de novembre 2026.

Cette chronologie est reconstituée avec le fondateur et les archives disponibles. Les dates incertaines sont signalées comme telles — elles ne sont jamais présentées comme des faits établis, et seront précisées au fur et à mesure des validations.' WHERE slug = 'fad-card' AND (history_intro_md IS NULL OR history_intro_md = '');
UPDATE products SET history_intro_md = 'QRFAD possède son propre parcours, indépendant de tout autre produit GREEN FAD : une réflexion initiée il y a environ sept ans, environ trois années de développement, puis une mise en production suivie d''évolutions régulières.

Cette chronologie est reconstituée à partir des informations du fondateur et des archives internes. Les dates approximatives sont affichées avec leur niveau de fiabilité.' WHERE slug = 'qrfad' AND (history_intro_md IS NULL OR history_intro_md = '');
UPDATE products SET history_intro_md = 'FEREFAD Connect est la super-application malienne de GREEN FAD : marketplace de petites annonces, commande de courses Telimani (taxi, taxi-moto, livraison), messagerie intégrée et espace chauffeur professionnel. Le fondateur indique qu''un historique important existe déjà pour ce produit : la recherche dans les archives internes est en cours et cette chronologie sera enrichie au fur et à mesure des retrouvailles et des validations.

Les jalons déjà vérifiables publiquement (fiches des stores officielles) sont documentés avec leur source.' WHERE slug = 'ferefad' AND (history_intro_md IS NULL OR history_intro_md = '');
UPDATE products SET history_intro_md = 'PayGfad a été pensé pendant environ trois ans avant sa mise en production, intervenue il y a environ huit mois. Depuis, le produit est maintenu en amélioration continue — la dernière mise à jour remonte à début novembre 2026.

Cette chronologie est reconstituée avec le fondateur ; les dates approximatives sont signalées et seront précisées avec les archives.' WHERE slug = 'paygfad' AND (history_intro_md IS NULL OR history_intro_md = '');
UPDATE products SET history_intro_md = 'CLOUDaf suit son propre chemin : pensé il y a environ trois ans, mis en production il y a environ huit mois, et mis à jour début novembre 2026. La plateforme vit au rythme de ses déploiements.

Cette chronologie est reconstituée avec le fondateur — aucune date n''est présentée comme certaine si elle ne l''est pas.' WHERE slug = 'cloudaf' AND (history_intro_md IS NULL OR history_intro_md = '');
UPDATE products SET history_intro_md = 'Tile est né d''un chantier d''ingénierie d''environ un an et huit mois : une application multiplateforme (Android, iOS, Web/PWA) adossée à des services cloud et à une console d''administration dédiée. D''abord exploitée en Progressive Web App, la plateforme a franchi deux jalons distincts : la mise en production PWA (mai 2026 environ), puis la publication sur les stores (fin octobre 2026 environ).

Le parcours ci-dessous s''appuie sur plus d''une centaine de rapports de missions datés conservés dans les archives internes (septembre 2026 → novembre 2026) ainsi que sur les informations du fondateur. Les deux types de sources sont distingués pour chaque jalon.' WHERE slug = 'tile' AND (history_intro_md IS NULL OR history_intro_md = '');

-- 2) JALONS — TILE (ordre chronologique, sources mixtes fondateur/archives)
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'tile', 'conception', 'Naissance de l''idée Tile', 'Le développement de Tile a duré environ un an et huit mois selon le fondateur : le chantier démarre donc début 2025. La conception initiale pose les fondations de ce qui restera la stack du produit jusqu''à aujourd''hui.', '2025-03', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (« environ 1 an et 8 mois de développement »)', 'moyenne', 1, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'tile' AND title = 'Naissance de l''idée Tile');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'tile', 'developpement', 'Début du développement : une application pensée pour les trois canaux', 'L''architecture posée dès l''origine : une application unique déployée sur Android, iOS et le web (PWA), des services et des règles côté serveur, une administration dédiée. Cette architecture a été conservée et enrichie, jamais remplacée.', '2025-03', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 · Archives : Archives internes du projet Tile', 'moyenne', 2, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'tile' AND title = 'Début du développement : une application pensée pour les trois canaux');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'tile', 'premiere_production', 'Mise en production de la PWA', 'Selon le fondateur, Tile est exploité en production sous forme de Progressive Web App depuis environ six mois, soit vers mai 2026. Ce jalon est volontairement distingué de la publication ultérieure sur les stores : deux canaux de distribution, deux dates.', '2026-05', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (« en production en PWA depuis environ 6 mois »)', 'moyenne', 3, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'tile' AND title = 'Mise en production de la PWA');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'tile', 'mise_a_jour', 'Verrouillage de la release Tile 1.0', 'Le « FINAL RELEASE REPORT (V1.0 LOCK) » du 17 juillet 2026 atteste tous les critères de fin : analyse statique sans erreur, build d''administration compilé, composants UI dédoublonnés (avatars, sources utilisateur), trois fils validés (Certifié, Global, Vidéo), backend gelé. Cinq commits, 333 lignes nettes supprimées.', '2026-07-17', 'exacte', '1.0', 'tile-parcours-pwa-stores', '[]', 'Archives : TILE_FINAL_RELEASE_REPORT.md, 17/07/2026', 'haute', 4, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'tile' AND title = 'Verrouillage de la release Tile 1.0');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'tile', 'mise_a_jour', 'Campagne de mise à l''échelle et d''audits', 'Septembre 2026 : audits des trois fils (11 septembre), audit du feed Explorer (17 septembre), missions de performance P1/P2/P3 (23-24 septembre), mise à l''échelle CTO (23 septembre), domaine officiel (26 septembre), stabilisation zéro erreur (25 septembre) et passe de cohérence (28 septembre). Une vingtaine de rapports datés atteste ce chantier.', '2026-09', 'archives', NULL, NULL, '[]', 'Archives : dossier tile/audits — rapports datés 2026-09-11 → 2026-09-28', 'haute', 5, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'tile' AND title = 'Campagne de mise à l''échelle et d''audits');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'tile', 'implementation', 'Espace entreprise, Explorer, studio de création, authentification', 'Octobre 2026 : consolidation de l''espace entreprise et de l''Explorer knowledge (4 octobre), activation de l''authentification sécurisée (10 octobre), studio de création avancé (11 octobre), parité PWA/Android/iOS (4 octobre), préparation du dossier App Store (5-10 octobre).', '2026-10', 'archives', NULL, NULL, '[]', 'Archives : MISSION-2-ESPACE-ENTREPRISE, MISSION-3-EXPLORER-KNOWLEDGE, MISSION-AUTH-ACTIVATION-2026-10-10, MISSION-STUDIO-AVANCE-RAPPORT-2026-10-11', 'haute', 6, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'tile' AND title = 'Espace entreprise, Explorer, studio de création, authentification');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'tile', 'tests', 'Préparation de la publication : Play readiness + pré-soumission', 'Fin octobre 2026 : documents PLAY-READINESS (26) et PRESUBMIT (27) — vérification de la préparation du Play Store et du dossier de pré-soumission. Le même jour : sauvegardes Firestore et drill complet de restauration.', '2026-10-27', 'exacte', NULL, NULL, '[]', 'Archives : PLAY-READINESS-2026-10-26.md, PRESUBMIT-2026-10-27.md, SAUVEGARDES-FIRESTORE-COUT-MINIMAL-2026-10-27.md', 'haute', 7, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'tile' AND title = 'Préparation de la publication : Play readiness + pré-soumission');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'tile', 'mise_a_jour', 'Publication finale — Tile 1.0.6+724 sur les canaux', 'Rapport de livraison du 2 novembre 2026 : stabilisation multiplateforme iOS + Android (APK/AAB) + PWA, publication finale (MÉDIA/AUTRE, vocal, texte long), flux Certifié consolidé. Corrections livrées : menu de création réduit aux deux entrées canoniques, borne de publication 10 000 caractères avec garde serveur, crash du fil Certifié corrigé.', '2026-11-02', 'exacte', '1.0.6+724', 'tile-parcours-pwa-stores', '[]', 'Archives : MISSION-PUBLICATION-FINALE-RAPPORT-2026-11-02.md', 'haute', 8, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'tile' AND title = 'Publication finale — Tile 1.0.6+724 sur les canaux');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'tile', 'tests', 'Matrice de tests consolidée', 'Consolidation de la couverture de tests le 4 novembre 2026 (matrice dédiée) ; lors de la mission CTO prioritaire, la suite complète passe avec 615 tests réussis.', '2026-11-04', 'exacte', NULL, NULL, '[]', 'Archives : MATRICE_TESTS_2026-11-04.md, MISSION_CTO_2026-11-04.md', 'haute', 9, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'tile' AND title = 'Matrice de tests consolidée');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'tile', 'derniere_evolution', 'Audit SEO et optimisations de découverte', 'Audit SEO du 7 novembre 2026 : découverte, indexation et lisibilité publique du produit.', '2026-11-07', 'exacte', NULL, NULL, '[]', 'Archives : docs/SEO-AUDIT-2026-11-07.md', 'haute', 10, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'tile' AND title = 'Audit SEO et optimisations de découverte');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'tile', 'situation_actuelle', 'Situation actuelle : Tile 1.0.6+724 — PWA + Android + iOS', 'Tile est publié sur les stores depuis environ deux semaines et reste maintenu en PWA. Messagerie, trois fils, wallet, studio de création et certification sont opérationnels. Points ouverts documentés : plafond de certificats Apple (TestFlight) et résiduels propriétaires (secrets commerce stores) — en cours de traitement par le propriétaire.', '2026-11-10', 'approximative', '1.0.6+724', NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 · Archives : MISSION-PUBLICATION-FINALE-RAPPORT-2026-11-02.md', 'moyenne', 11, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'tile' AND title = 'Situation actuelle : Tile 1.0.6+724 — PWA + Android + iOS');


-- 3) JALONS — FAD CARD (sources : fondateur uniquement, dates approximatives assumées)
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'fad-card', 'conception', 'Naissance de l''idée FAD CARD', 'Il y a environ sept ans, la première réflexion esquisse une carte numérique capable de concentrer identité et services. Le mois exact de départ reste à confirmer par les archives d''époque.', '2019', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (« réflexion et conception initiales il y a environ 7 ans »)', 'moyenne', 1, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'fad-card' AND title = 'Naissance de l''idée FAD CARD');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'fad-card', 'cadrage', 'Cadrage : définition du projet et des objectifs', 'Le projet entre en phase de cadrage : objectifs fonctionnels, publics visés et premiers documents de conception. Les documents de cadrage originaux n''ont pas encore été retrouvés — le jalon est attesté par le fondateur sans date précise.', '2019', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026', 'moyenne', 2, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'fad-card' AND title = 'Cadrage : définition du projet et des objectifs');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'fad-card', 'developpement', 'Début du développement — environ trois années de réalisation', 'Le développement démarre dans la foulée de la conception. Selon le fondateur, la réalisation a duré environ trois ans : un chantier d''ingénierie long, conduit en parallèle de la structuration de l''entreprise.', '2019', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (« durée de développement environ 3 ans »)', 'moyenne', 3, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'fad-card' AND title = 'Début du développement — environ trois années de réalisation');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'fad-card', 'premiere_production', 'Première mise en production', 'La première version accessible en production est déployée après environ trois années de développement. L''année 2022 est déduite de la durée communiquée par le fondateur (conception ≈ 2019 + ≈ 3 ans) : estimation à confirmer, pas un fait établi.', '2022', 'estimee', NULL, NULL, '[]', 'Déduit des informations fondateur (conception ≈ 2019, développement ≈ 3 ans) — à confirmer', 'faible', 4, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'fad-card' AND title = 'Première mise en production');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'fad-card', 'premier_utilisateur', 'Arrivée du premier utilisateur', 'Selon le fondateur, la production a été maintenue « jusqu''à l''arrivée du premier utilisateur » : le premier usage réel vérifiable marque la fin du cycle d''amorçage. La date exacte n''a pas encore été retrouvée.', NULL, 'inconnue', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (jalon attesté, date non retrouvée)', 'moyenne', 5, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'fad-card' AND title = 'Arrivée du premier utilisateur');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'fad-card', 'mise_a_jour', 'Un rythme soutenu : mises à jour tous les 3 à 6 mois', 'Depuis sa mise en production, FAD CARD est maintenue en amélioration continue avec des mises à jour importantes environ tous les trois à six mois. Le détail des versions intermédiaires est en cours de reconstitution avec les archives.', NULL, 'inconnue', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (« mises à jour importantes tous les 3 à 6 mois »)', 'moyenne', 6, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'fad-card' AND title = 'Un rythme soutenu : mises à jour tous les 3 à 6 mois');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'fad-card', 'derniere_evolution', 'Dernière mise à jour — novembre 2026', 'Selon les informations communiquées par le fondateur le 9 novembre 2026, la dernière mise à jour de FAD CARD remonte à la veille (« hier »). Le contenu détaillé de cette mise à jour sera complété lors de la validation des notes de version.', '2026-11-08', 'approximative', NULL, NULL, '[]', 'Fondateur — information communiquée le 9 novembre 2026 (« dernière mise à jour : hier »)', 'moyenne', 7, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'fad-card' AND title = 'Dernière mise à jour — novembre 2026');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'fad-card', 'situation_actuelle', 'Situation actuelle : en production, continuellement améliorée', 'FAD CARD est un produit vivant : en production, maintenu et enrichi au rythme des retours utilisateurs et des besoins du terrain.', '2026-11-09', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026', 'moyenne', 8, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'fad-card' AND title = 'Situation actuelle : en production, continuellement améliorée');

-- 4) JALONS — QRFAD (parcours indépendant, jamais fusionné avec FAD CARD)
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'qrfad', 'conception', 'Naissance de l''idée QRFAD', 'Il y a environ sept ans, la réflexion qui donnera naissance à QRFAD commence : mettre la technologie au service de parcours simples, vérifiables et instantanés. L''historique de QRFAD est reconstitué indépendamment de celui de FAD CARD.', '2019', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (« réflexion et conception initiales il y a environ 7 ans »)', 'moyenne', 1, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'qrfad' AND title = 'Naissance de l''idée QRFAD');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'qrfad', 'developpement', 'Début du développement QRFAD — environ trois années de réalisation', 'La réalisation de QRFAD s''étend sur environ trois années selon le fondateur, avec ses propres choix techniques et ses propres cycles de construction — distincts de tout autre produit.', '2019', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026', 'moyenne', 2, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'qrfad' AND title = 'Début du développement QRFAD — environ trois années de réalisation');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'qrfad', 'premiere_production', 'Première mise en production de QRFAD', 'Après environ trois années de développement, QRFAD devient accessible en production. L''année 2022 est une estimation déduite des durées communiquées — à confirmer avec les archives.', '2022', 'estimee', NULL, NULL, '[]', 'Déduit des informations fondateur — estimation à confirmer', 'faible', 3, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'qrfad' AND title = 'Première mise en production de QRFAD');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'qrfad', 'mise_a_jour', 'Évolutions régulières en production', 'Le fondateur atteste des évolutions et mises à jour importantes régulières depuis la mise en production. Le détail daté de ces versions est en cours de reconstitution.', NULL, 'inconnue', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (« évolutions et mises à jour importantes régulières »)', 'moyenne', 4, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'qrfad' AND title = 'Évolutions régulières en production');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'qrfad', 'situation_actuelle', 'Situation actuelle : produit vivant, en production', 'QRFAD reste en production et continue d''évoluer — un produit entretenu, pas un projet figé.', '2026-11-09', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026', 'moyenne', 5, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'qrfad' AND title = 'Situation actuelle : produit vivant, en production');


-- 5) JALONS — FEREFAD (public vérifiable + historique à retrouver)
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'ferefad', 'conception', 'Conception de FEREFAD Connect', 'Le fondateur indique qu''un historique important existe déjà pour FEREFAD et qu''il doit être retrouvé et documenté. La recherche dans les archives internes est en cours : cette chronologie sera enrichie au fur et à mesure des retrouvailles et des validations.', NULL, 'inconnue', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (historique à retrouver)', 'moyenne', 1, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'ferefad' AND title = 'Conception de FEREFAD Connect');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'ferefad', 'developpement', 'Développement de la super-app : marketplace, Telimani, espace chauffeur', 'Le développement couvre la marketplace de petites annonces, la commande de courses Telimani, la messagerie intégrée et l''espace chauffeur professionnel. Les dates de démarrage n''ont pas encore été retrouvées dans les archives.', NULL, 'inconnue', NULL, NULL, '[]', 'Fiche App Store Ferefad (périmètre fonctionnel) · Fondateur — mission CTO N°2', 'moyenne', 2, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'ferefad' AND title = 'Développement de la super-app : marketplace, Telimani, espace chauffeur');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'ferefad', 'implementation', 'Module Telimani : taxi, taxi-moto et livraison intégrés', 'La version 2.2.0 publiée sur l''App Store introduit Telimani, la commande de courses au cœur de Ferefad : taxi, taxi-moto et livraison en quelques secondes, tarif estimé avant la course, suivi en temps réel, règlement en espèces à la fin de la course, annulation avec motifs et notation client ↔ chauffeur. L''espace chauffeur professionnel arrive dans la même version : solde, courses et revenus du jour, note moyenne, demandes en direct avec expiration automatique, historique des gains nets.', '2026-10-20', 'exacte', '2.2.0', NULL, '[]', 'Fiche App Store Ferefad (id6780280349) — notes de version 2.2.0', 'haute', 3, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'ferefad' AND title = 'Module Telimani : taxi, taxi-moto et livraison intégrés');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'ferefad', 'premiere_production', 'Première mise en production (date à retrouver)', 'FEREFAD est disponible publiquement sur l''App Store et Google Play, ainsi qu''en application web sur ferefad.com. La date exacte de la première mise en production n''a pas encore été retrouvée dans les archives — jalon attesté par la présence publique, date en cours de reconstitution.', NULL, 'inconnue', NULL, NULL, '[]', 'Fiches publiques des stores + ferefad.com (présence vérifiable) · date à retrouver', 'moyenne', 4, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'ferefad' AND title = 'Première mise en production (date à retrouver)');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'ferefad', 'situation_actuelle', 'Situation actuelle : FEREFAD 2.2.0 sur trois canaux publics', 'FEREFAD Connect 2.2.0 (App Store, mise à jour du 20 octobre 2026), Google Play (com.ferefad.connect) et application web ferefad.com. La marketplace relie acheteurs, vendeurs, emploi et services à travers le Mali et l''Afrique de l''Ouest ; Telimani ajoute taxi, taxi-moto et livraison au juste prix.', '2026-11-10', 'approximative', '2.2.0', NULL, '[]', 'Fiche App Store v2.2.0 · Google Play · ferefad.com — vérifiés publiquement', 'haute', 5, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'ferefad' AND title = 'Situation actuelle : FEREFAD 2.2.0 sur trois canaux publics');

-- 6) JALONS — PAYGFAD et CLOUDAF (parcours indépendants l'un de l'autre)
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'paygfad', 'conception', 'Naissance de l''idée PayGfad', 'Le projet est pensé depuis environ trois ans : la réflexion qui aboutira à PayGfad commence vers 2023. Les documents de conception d''origine sont en cours de reconstitution.', '2023', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (« projet pensé depuis environ 3 ans »)', 'moyenne', 1, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'paygfad' AND title = 'Naissance de l''idée PayGfad');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'paygfad', 'developpement', 'Développement du produit', 'La période exacte de développement n''a pas encore été retrouvée : elle se situe entre la conception (≈ 2023) et la mise en production (≈ début 2026). À compléter avec les archives.', NULL, 'inconnue', NULL, NULL, '[]', 'Déduit des bornes fondateur (conception → production) — à compléter', 'faible', 2, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'paygfad' AND title = 'Développement du produit');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'paygfad', 'premiere_production', 'Mise en production de PayGfad', 'PayGfad est en production depuis environ huit mois (communication fondateur du 10 novembre 2026), soit vers mars 2026. Le mois exact est à confirmer.', '2026-03', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (« en production depuis environ 8 mois »)', 'moyenne', 3, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'paygfad' AND title = 'Mise en production de PayGfad');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'paygfad', 'derniere_evolution', 'Dernière mise à jour — début novembre 2026', 'La dernière mise à jour de PayGfad remonte à environ une semaine selon le fondateur (10 novembre 2026), soit début novembre 2026. Les notes détaillées seront rattachées lors de la validation.', '2026-11-03', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (« dernière mise à jour il y a environ une semaine »)', 'moyenne', 4, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'paygfad' AND title = 'Dernière mise à jour — début novembre 2026');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'paygfad', 'situation_actuelle', 'Situation actuelle : en production, continuellement améliorée', 'PayGfad vit au rythme de ses déploiements : produit en production, maintenu et enrichi.', '2026-11-10', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026', 'moyenne', 5, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'paygfad' AND title = 'Situation actuelle : en production, continuellement améliorée');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'cloudaf', 'conception', 'Naissance de l''idée CLOUDaf', 'Le projet CLOUDaf est pensé depuis environ trois ans, indépendamment des autres produits GREEN FAD : son parcours, ses étapes et ses versions lui appartiennent en propre.', '2023', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (« projet pensé depuis environ 3 ans »)', 'moyenne', 1, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'cloudaf' AND title = 'Naissance de l''idée CLOUDaf');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'cloudaf', 'developpement', 'Développement de la plateforme', 'La période exacte de développement est en cours de reconstitution : entre la conception (≈ 2023) et la mise en production (≈ début 2026). Les archives permettront de dater précisément cette phase.', NULL, 'inconnue', NULL, NULL, '[]', 'Déduit des bornes fondateur — à compléter avec les archives', 'faible', 2, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'cloudaf' AND title = 'Développement de la plateforme');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'cloudaf', 'premiere_production', 'Mise en production de CLOUDaf', 'CLOUDaf est en production depuis environ huit mois selon le fondateur (10 novembre 2026), soit vers mars 2026. Le mois exact reste à confirmer.', '2026-03', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (« en production depuis environ 8 mois »)', 'moyenne', 3, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'cloudaf' AND title = 'Mise en production de CLOUDaf');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'cloudaf', 'derniere_evolution', 'Dernière mise à jour — début novembre 2026', 'La dernière mise à jour de CLOUDaf remonte à environ une semaine selon le fondateur (10 novembre 2026), soit début novembre 2026.', '2026-11-03', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026 (« dernière mise à jour il y a environ une semaine »)', 'moyenne', 4, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'cloudaf' AND title = 'Dernière mise à jour — début novembre 2026');
INSERT INTO product_milestones (product_slug, kind, title, description_md, occurred_on, date_precision, version_ref, article_slug, media_json, source_label, confidence, sort_order, status) SELECT 'cloudaf', 'situation_actuelle', 'Situation actuelle : plateforme cloud en production', 'CLOUDaf est en production et continue d''évoluer — chaque déploiement est documenté et enrichit son historique.', '2026-11-10', 'approximative', NULL, NULL, '[]', 'Fondateur — mission CTO N°2, 10/11/2026', 'moyenne', 5, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE product_slug = 'cloudaf' AND title = 'Situation actuelle : plateforme cloud en production');


-- 7) JOURNAL DES VERSIONS (uniquement des versions vérifiables, avec leur source)
INSERT INTO product_versions (product_slug, version, released_on, date_precision, kind, summary, features, improvements, fixes, tech_notes, article_slug, media_json, sort_order, status) SELECT 'tile', '1.0', '2026-07-17', 'exacte', 'production', 'Release V1.0 — verrouillage final (« V1.0 LOCK »). Tous les critères de fin validés : analyse statique sans erreur, build d''administration compilé, dédoublonnage des composants UI, trois fils validés.', '["Analyse statique : 0 erreur","Build d''administration compilé avec succès","Composants UI dédoublonnés — source unique (avatars, suivi utilisateur)","Trois fils validés : Certifié, Global, Vidéo"]', NULL, NULL, 'Backend gelé pendant la mission de verrouillage — 5 commits, 333 lignes nettes supprimées.', 'tile-parcours-pwa-stores', '[]', 1, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_versions WHERE product_slug = 'tile' AND version = '1.0');
INSERT INTO product_versions (product_slug, version, released_on, date_precision, kind, summary, features, improvements, fixes, tech_notes, article_slug, media_json, sort_order, status) SELECT 'tile', '1.0.6+724', '2026-11-02', 'exacte', 'production', 'Publication finale multiplateforme : iOS + Android (APK/AAB) + PWA. Publication finale (MÉDIA/AUTRE, vocal, texte long) et flux Certifié consolidé.', '["Publication finale : MÉDIA/AUTRE avec vocal et texte long","Flux Certifié consolidé","Parité iOS / Android / PWA","Borne de publication 10 000 caractères vérifiée côté serveur"]', NULL, '["Menu de création : entrées redondantes supprimées","Crash du fil Certifié corrigé (build 723)","Limite de saisie 500 caractères supprimée au profit d''une borne de publication contrôlée"]', 'TestFlight courant = 723 ; plafond de certificats Apple documenté (log CI run 41357572394) — action propriétaire.', 'tile-parcours-pwa-stores', '[]', 2, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_versions WHERE product_slug = 'tile' AND version = '1.0.6+724');
INSERT INTO product_versions (product_slug, version, released_on, date_precision, kind, summary, features, improvements, fixes, tech_notes, article_slug, media_json, sort_order, status) SELECT 'ferefad', '2.2.0', '2026-10-20', 'exacte', 'module', 'Telimani au cœur de Ferefad + espace chauffeur professionnel. La super-app malienne gagne la commande de courses (taxi, taxi-moto, livraison) et une console chauffeur complète.', '["Telimani : taxi, taxi-moto et livraison en quelques secondes","Tarif estimé avant la course + suivi en temps réel","Règlement en espèces à la fin de la course — aucun paiement dans l''application","Annulation avec motifs, notation client ↔ chauffeur, signalement de problème","Espace chauffeur : solde, courses et revenus du jour, note moyenne","Marketplace : filtres par catégories (Électronique, Mode, Maison, Véhicules, Emplois, Services)","Messagerie vocale plus fiable (envoi, lecture)"]', 'Nouveau design Telimani : boutons clairs, prix toujours lisibles, chargements élégants, messages d''erreur compréhensibles.', '["Protection anti double-commande","Gestion hors ligne annoncée","Notifications push enrichies"]', 'Notes de version publiques de la fiche App Store — 53,5 Mo, catégorie Shopping.', NULL, '[]', 1, 'publie' WHERE NOT EXISTS (SELECT 1 FROM product_versions WHERE product_slug = 'ferefad' AND version = '2.2.0');

-- 8) SOURCES & TRAÇABILITÉ
INSERT INTO product_sources (product_slug, source_type, title, detail, url, evidenced_on, confidence, validated_by) SELECT 'tile', 'fondateur', 'Fondateur — mission CTO N°2 (10/11/2026)', 'Durées communiquées : ≈ 1 an et 8 mois de développement, PWA en production ≈ 6 mois, stores ≈ 2 semaines.', NULL, '2026-11-10', 'moyenne', NULL WHERE NOT EXISTS (SELECT 1 FROM product_sources WHERE product_slug = 'tile' AND title = 'Fondateur — mission CTO N°2 (10/11/2026)');
INSERT INTO product_sources (product_slug, source_type, title, detail, url, evidenced_on, confidence, validated_by) SELECT 'tile', 'archives', 'Dossier d''archives tile/audits — rapports de missions datés', 'Plus de cent rapports datés de 2026-09-11 à 2026-11-07 : audits des fils, missions CTO, publication finale, matrice de tests, audit SEO, préparations stores.', NULL, '2026-11-07', 'haute', NULL WHERE NOT EXISTS (SELECT 1 FROM product_sources WHERE product_slug = 'tile' AND title = 'Dossier d''archives tile/audits — rapports de missions datés');
INSERT INTO product_sources (product_slug, source_type, title, detail, url, evidenced_on, confidence, validated_by) SELECT 'tile', 'deploiement', 'Worklog CTO Tile — runs CI et versions publiées', 'CI validate + deploy SUCCESS ; builds 721, 723, 724 ; version.json de production vérifié ; artefacts APK 48 Mo / AAB 83 Mo ; commits protégés intacts (5d649e1a, 1dbfef70, 6bfd2019, fec6aedd).', NULL, '2026-10-27', 'haute', NULL WHERE NOT EXISTS (SELECT 1 FROM product_sources WHERE product_slug = 'tile' AND title = 'Worklog CTO Tile — runs CI et versions publiées');
INSERT INTO product_sources (product_slug, source_type, title, detail, url, evidenced_on, confidence, validated_by) SELECT 'tile', 'git', 'Dépôt Green-fad/Tile (branche master)', 'Historique de commits, branches et releases consultable ; branche master unique, aucun rewrite des commits protégés.', 'https://github.com/Green-fad/Tile', '2026-11-02', 'haute', NULL WHERE NOT EXISTS (SELECT 1 FROM product_sources WHERE product_slug = 'tile' AND title = 'Dépôt Green-fad/Tile (branche master)');
INSERT INTO product_sources (product_slug, source_type, title, detail, url, evidenced_on, confidence, validated_by) SELECT 'ferefad', 'store', 'Fiche App Store Ferefad (id6780280349)', 'Version 2.2.0, mise à jour du 20 octobre 2026, notes de version Telimani + espace chauffeur ; vendeur GREEN-FAD-SARL.', 'https://apps.apple.com/us/app/ferefad/id6780280349', '2026-10-20', 'haute', NULL WHERE NOT EXISTS (SELECT 1 FROM product_sources WHERE product_slug = 'ferefad' AND title = 'Fiche App Store Ferefad (id6780280349)');
INSERT INTO product_sources (product_slug, source_type, title, detail, url, evidenced_on, confidence, validated_by) SELECT 'ferefad', 'store', 'Fiche Google Play — com.ferefad.connect', 'Canal Android officiel de FEREFAD Connect, vérifié publiquement.', 'https://play.google.com/store/apps/details?id=com.ferefad.connect', '2026-11-09', 'haute', NULL WHERE NOT EXISTS (SELECT 1 FROM product_sources WHERE product_slug = 'ferefad' AND title = 'Fiche Google Play — com.ferefad.connect');
INSERT INTO product_sources (product_slug, source_type, title, detail, url, evidenced_on, confidence, validated_by) SELECT 'ferefad', 'web', 'Site officiel ferefad.com', 'Application web — canal public direct du produit.', 'https://ferefad.com', '2026-11-10', 'haute', NULL WHERE NOT EXISTS (SELECT 1 FROM product_sources WHERE product_slug = 'ferefad' AND title = 'Site officiel ferefad.com');
INSERT INTO product_sources (product_slug, source_type, title, detail, url, evidenced_on, confidence, validated_by) SELECT 'ferefad', 'fondateur', 'Fondateur — historique FEREFAD à retrouver', 'Un historique important existe déjà et doit être retrouvé et documenté (mission CTO N°2). Reconstitution en cours.', NULL, '2026-11-10', 'moyenne', NULL WHERE NOT EXISTS (SELECT 1 FROM product_sources WHERE product_slug = 'ferefad' AND title = 'Fondateur — historique FEREFAD à retrouver');
INSERT INTO product_sources (product_slug, source_type, title, detail, url, evidenced_on, confidence, validated_by) SELECT 'fad-card', 'fondateur', 'Fondateur — mission CTO N°2 (9-10/11/2026)', 'Conception ≈ 7 ans, développement ≈ 3 ans, mise en production jusqu''au premier utilisateur, mises à jour tous les 3 à 6 mois, dernière mise à jour la veille du 9 novembre 2026.', NULL, '2026-11-09', 'moyenne', NULL WHERE NOT EXISTS (SELECT 1 FROM product_sources WHERE product_slug = 'fad-card' AND title = 'Fondateur — mission CTO N°2 (9-10/11/2026)');
INSERT INTO product_sources (product_slug, source_type, title, detail, url, evidenced_on, confidence, validated_by) SELECT 'qrfad', 'fondateur', 'Fondateur — mission CTO N°2 (9-10/11/2026)', 'Conception ≈ 7 ans, développement ≈ 3 ans, mise en production jusqu''au premier utilisateur, évolutions régulières. Historique indépendant de FAD CARD.', NULL, '2026-11-09', 'moyenne', NULL WHERE NOT EXISTS (SELECT 1 FROM product_sources WHERE product_slug = 'qrfad' AND title = 'Fondateur — mission CTO N°2 (9-10/11/2026)');
INSERT INTO product_sources (product_slug, source_type, title, detail, url, evidenced_on, confidence, validated_by) SELECT 'paygfad', 'fondateur', 'Fondateur — mission CTO N°2 (10/11/2026)', 'Projet pensé depuis ≈ 3 ans, en production depuis ≈ 8 mois, dernière mise à jour ≈ 1 semaine.', NULL, '2026-11-10', 'moyenne', NULL WHERE NOT EXISTS (SELECT 1 FROM product_sources WHERE product_slug = 'paygfad' AND title = 'Fondateur — mission CTO N°2 (10/11/2026)');
INSERT INTO product_sources (product_slug, source_type, title, detail, url, evidenced_on, confidence, validated_by) SELECT 'cloudaf', 'fondateur', 'Fondateur — mission CTO N°2 (10/11/2026)', 'Projet pensé depuis ≈ 3 ans, en production depuis ≈ 8 mois, dernière mise à jour ≈ 1 semaine.', NULL, '2026-11-10', 'moyenne', NULL WHERE NOT EXISTS (SELECT 1 FROM product_sources WHERE product_slug = 'cloudaf' AND title = 'Fondateur — mission CTO N°2 (10/11/2026)');


-- 9) ARTICLES DE RECONSTRUCTION ÉDITORIALE — clairement identifiés comme tels.
--    Règle de la mission : ne JAMAIS présenter un article nouvellement rédigé
--    comme une publication historique originale. Ces deux articles portent la
--    date de leur rédaction (10/11/2026) et citent leurs sources.
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, product_slug) VALUES (
  'tile-parcours-pwa-stores',
  'Tile : un an et huit mois d''ingénierie, de la première PWA aux stores',
  'Reconstruction éditoriale publiée le 10 novembre 2026 à partir des archives internes datées : comment Tile est passé d''un chantier d''ingénierie démarré début 2025 à une publication finale 1.0.6+724 sur les stores. Ce texte n''est pas une publication historique originale.',
  '# Tile : un an et huit mois d''ingénierie, de la première PWA aux stores

> **Note de transparence éditoriale.** Cet article est une **reconstruction éditoriale rédigée le 10 novembre 2026** à partir des archives internes de GREEN FAD (plus d''une centaine de rapports de missions datés, worklogs CI, dépôt Git). Il ne s''agit **pas** d''une publication historique originale : aucune annonce comparable n''a été retrouvée dans le blog. Les dates issues des archives sont exactes ; celles issues du fondateur sont signalées « environ ».

## Un chantier d''environ un an et huit mois

Selon le fondateur, le développement de Tile a duré **environ un an et huit mois** : le chantier démarre donc **début 2025**. L''architecture posée dès l''origine — une application multiplateforme pour Android, iOS et le Web/PWA, des services cloud pour les fonctions et les données, une console d''administration dédiée — n''a jamais été remplacée : elle a été conservée et enrichie, mission après mission.

## Deux jalons de mise à disposition, volontairement distincts

Tile a rejoint ses utilisateurs par **deux canaux différents, à deux dates différentes** :

- **La mise en production PWA** : environ **mai 2026** (information du fondateur, « en production en PWA depuis environ 6 mois »). Le produit devient exploitable sans passer par une boutique d''applications.
- **La publication sur les stores** : **fin octobre 2026** environ (documents de préparation PLAY-READINESS du 26 octobre et PRESUBMIT du 27 octobre dans les archives), avec la **publication finale Tile 1.0.6+724 documentée le 2 novembre 2026**.

Ne pas confondre ces deux jalons n''est pas un détail : chacun raconte une étape différente de la vie du produit — d''abord un produit vivant sur le web, ensuite un produit installé sur les écrans.

## Ce que les archives racontent, date par date

Les rapports internes datés racontent la maturation du produit :

- **17 juillet 2026** — *V1.0 LOCK* : analyse statique sans erreur, build d''administration compilé, composants UI dédoublonnés, trois fils validés (Certifié, Global, Vidéo), backend gelé.
- **Septembre 2026** — campagne d''audits et de mise à l''échelle : fils du réseau, Explorer, performance P1/P2/P3, stabilisation « zéro erreur », domaine officiel.
- **Octobre 2026** — consolidation : espace entreprise, Explorer knowledge, studio de création, activation de l''authentification, parité PWA/Android/iOS, préparation des dossiers de soumission.
- **27 octobre 2026** — play readiness + pré-soumission + drill complet de sauvegarde/restauration Firestore.
- **2 novembre 2026** — publication finale **1.0.6+724** : stabilisation iOS + Android (APK/AAB) + PWA, publication « MÉDIA/AUTRE » avec vocal et texte long, crash du fil Certifié corrigé.
- **4 novembre 2026** — matrice de tests consolidée (615 tests passants lors de la mission CTO prioritaire).
- **7 novembre 2026** — audit SEO du produit.

## Ce que nous documentons, et ce qui reste ouvert

La reconstitution est honnête sur ses limites : la **date exacte de la première utilisation réelle** n''est pas encore retrouvée ; le **plafond de certificats Apple** (TestFlight) reste un point propriétaire documenté, pas résolu ; certaines durées du fondateur restent des **approximations assumées**. Ces incertitudes sont affichées publiquement sur la chronologie du produit, avec leur niveau de fiabilité — parce qu''un historique vérifiable vaut mieux qu''un récit lisse.

Tile continue d''évoluer : sa chronologie, administrable depuis le Dashboard GREEN FAD, sera enrichie au fil des versions.',
  '/assets/images/products/tile-banniere.jpg',
  'produits',
  '["tile","historique","archives","flutter","pwa","stores"]',
  'Green FAD',
  'recit',
  1,
  '2026-11-10 09:00:00',
  'publie',
  'Tile : un an et huit mois d''ingénierie, de la PWA aux stores | Green FAD',
  'Reconstruction éditoriale documentée : le parcours de Tile, de la conception d''ingénierie début 2025 à la publication finale 1.0.6+724 sur les stores, raconté à partir des archives internes datées de GREEN FAD.',
  'tile'
);

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, product_slug) VALUES (
  'patrimoine-technologique-green-fad',
  'Le patrimoine technologique GREEN FAD désormais documenté, daté et traçable',
  'Publication institutionnelle du 10 novembre 2026 : GREEN FAD ouvre le centre d''histoire technologique de ses produits — chronologies vérifiables, journal des versions, sources citées. Sept années d''ingénierie ne doivent pas disparaître derrière une fiche commerciale.',
  '# Le patrimoine technologique GREEN FAD désormais documenté, daté et traçable

> **Publication institutionnelle — 10 novembre 2026.** Ce texte annonce une évolution de greenfad.tech. Il ne remplace aucun article historique : là où les annonces d''origine n''ont pas été retrouvées, les chronologies le disent clairement.

## Pourquoi documenter l''histoire de nos produits

GREEN FAD ne veut pas que ses années de réflexion, de conception, de développement, de tests, de mises en production et d''amélioration continue disparaissent derrière une simple fiche commerciale. Chaque produit de l''entreprise — **Tile, FAD CARD, QRFAD, FEREFAD, PayGfad, CLOUDaf** — est le résultat d''un travail d''ingénierie continu, avec une histoire, des évolutions et une vision.

La rubrique **Réalisations** devient un **centre d''histoire technologique** : chaque produit y affiche son parcours vivant, sa chronologie documentée, son journal des versions et ses sources.

## Une méthode qui assume ses incertitudes

Nous avons imposé une règle simple, et nous nous y tenons : **ne jamais transformer une estimation en date historique certaine.**

Chaque jalon porte donc son niveau de précision :

- **Date confirmée** — preuve datée (rapport d''archives, fiche store officielle) ;
- **Environ** — approximation communiquée par le fondateur ;
- **Retrouvée en archives** — document interne daté ;
- **Estimation à confirmer** — déduite, en attente de validation ;
- **Inconnue** — pas encore retrouvée, et nous le disons.

Chaque jalon cite aussi sa **source** (fondateur, archives internes, dépôt Git, stores officiels) et son niveau de confiance. Les chronologies sont explorables depuis chaque fiche produit, et les dates exploitables existent dans les **données structurées** pour les moteurs de recherche.

## Ce que la première vague documente

Six produits ouvrent le bal, dans l''ordre demandé : **Tile** (le plus riche en archives : plus de cent rapports datés de septembre à novembre 2026), puis **FAD CARD** et **QRFAD** (≈ 7 ans de réflexion, ≈ 3 ans de développement chacun — parcours strictement indépendants), **FEREFAD** (jalons publics vérifiables, dont le module Telimani de la version 2.2.0 du 20 octobre 2026 ; l''historique interne est en cours de reconstitution), **PayGfad** et **CLOUDaf** (conception ≈ 2023, production ≈ mars 2026, dernière évolution début novembre 2026).

## Ce qui change pour l''administration

Tout est administrable depuis le Dashboard, sans toucher au code : trois nouveaux modules — **Jalons & chronologies**, **Versions produits**, **Sources & traçabilité** — permettent de créer, dater (avec précision), documenter, relier aux articles du blog, ordonner, publier ou archiver chaque jalon et chaque version. Les données vivent dans la base, les médias dans le stockage objet : le site public et le Dashboard partagent les mêmes données.

## Et maintenant ?

La chronologie de chaque produit est une page ouverte : les dates marquées « à confirmer » seront précisées au fil des retrouvailles dans les archives, avec le fondateur. L''historique doit rester **traçable, vérifiable et enrichissable au fil des années** — c''est exactement ce que la plateforme permet désormais.',
  '/assets/images/gallery/tech-ecologie.jpg',
  'entreprise',
  '["patrimoine","historique","transparence","green fad","chronologies"]',
  'Green FAD',
  'publication',
  1,
  '2026-11-10 10:00:00',
  'publie',
  'Patrimoine technologique GREEN FAD : chronologies documentées et traçables',
  'GREEN FAD documente l''histoire de ses produits — Tile, FAD CARD, QRFAD, FEREFAD, PayGfad, CLOUDaf : chronologies vérifiables, journal des versions, sources citées, dates avec niveaux de fiabilité.',
  NULL
);

-- 10) Version du contenu
UPDATE settings SET value = '16' WHERE key = 'content_version';
