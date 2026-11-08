-- ============================================================
-- GREEN FAD — Seed v2 : contenu réel migré de l'ancien site greenfad.tech
-- Identité technologique (logo officiel), Media Center, portfolio produits,
-- espace innovation, redirections SEO. Aucune donnée fictive, aucun emoji.
-- Idempotence : la CI n'exécute ce fichier que si aucun utilisateur n'existe.
-- ============================================================

-- ---------- IDENTITÉ & PARAMÈTRES ----------
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

-- ---------- MENUS ----------
INSERT INTO menus (location, items) VALUES ('header', '[{"label": "Entreprise", "url": "/p/entreprise"}, {"label": "Expertises", "url": "/expertises"}, {"label": "Produits", "url": "/produits"}, {"label": "Réalisations", "url": "/realisations"}, {"label": "Galerie", "url": "/galerie"}, {"label": "Blog", "url": "/blog"}, {"label": "Implantation", "url": "/implantation"}, {"label": "Contact", "url": "/contact"}]');
INSERT INTO menus (location, items) VALUES ('footer', '[{"label": "Entreprise", "url": "/p/entreprise"}, {"label": "Expertises", "url": "/expertises"}, {"label": "Produits", "url": "/produits"}, {"label": "Réalisations", "url": "/realisations"}, {"label": "Galerie", "url": "/galerie"}, {"label": "Blog", "url": "/blog"}, {"label": "Ressources", "url": "/ressources"}, {"label": "Carrières", "url": "/carrieres"}, {"label": "FAQ", "url": "/faq"}]');

-- ---------- PIED DE PAGE ----------
INSERT INTO footer_sections (section_key, title, content, sort_order) VALUES ('entreprise', 'Green FAD', '{"text": "Entreprise technologique africaine d''innovation : nous concevons, développons et portons nos propres produits numériques à l''échelle internationale."}', 1);
INSERT INTO footer_sections (section_key, title, content, sort_order) VALUES ('contact', 'Contact', '{"text": "Missabougou, Bamako, Mali", "email": "contact@greenfad.tech"}', 2);
INSERT INTO footer_sections (section_key, title, content, sort_order) VALUES ('produits', 'Nos produits', '{"items": [{"label": "FAD CARD", "url": "/produits/fad-card"}, {"label": "NIAFAD", "url": "/produits/niafad"}, {"label": "QRFAD", "url": "/produits/qrfad"}, {"label": "FEREFAD", "url": "/produits/ferefad"}, {"label": "SARAPAY", "url": "/produits/sarapay"}, {"label": "Carte Santé", "url": "/produits/carte-sante"}, {"label": "L''Amitié Fad", "url": "/produits/amitie-fad"}]}', 3);
INSERT INTO footer_sections (section_key, title, content, sort_order) VALUES ('liens', 'Informations', '{"items": [{"label": "Mentions légales", "url": "/p/mentions-legales"}, {"label": "Confidentialité", "url": "/p/confidentialite"}, {"label": "CGV", "url": "/p/cgv"}, {"label": "Ressources", "url": "/ressources"}]}', 4);

-- ---------- UTILISATEUR ADMIN (identifiants inchangés) ----------
INSERT INTO users (email, password_hash, password_salt, name, role, is_active, must_change_password) VALUES ('contact@greenfad.tech', 'RL4kxmn2//ztCJr+CZyEo37TDev0hmT05cn0OskJnhE=', 'ARp1F0daYtjeL/Z5cq9oZQ==', 'Administrateur GREEN FAD', 'super_admin', 1, 1);

-- ---------- EXPERTISES (contenu réel de l'ancien site) ----------
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

-- ---------- BIBLIOTHÈQUE MÉDIAS (fichiers réels servis depuis /assets) ----------
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

-- ---------- MEDIA CENTER : ALBUMS ----------
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

-- ---------- PRODUITS TECHNOLOGIQUES (portfolio complet) ----------
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image) VALUES (
  'fad-card', 'FAD CARD', 'La carte de visite numérique NFC/RFID — votre identité professionnelle, digitale',
  'La FAD CARD de Green FAD est une carte de visite digitale NFC/RFID. En un simple geste, elle permet de partager vos coordonnées de façon moderne, sécurisée et mémorable, révolutionnant la manière de réseauter.',
  'Les cartes de visite papier s''égarrent, se démodent et coûtent cher à réimprimer à chaque changement de numéro ou de fonction. Dans un environnement professionnel où le réseautage est décisif, l''information partagée doit rester à jour et toujours accessible.',
  'Faire de chaque professionnel et chaque entreprise un acteur du numérique : une carte unique, réinscriptible, sans papier, qui porte l''identité complète de son porteur et reflète l''image innovante de son organisation.',
  'FAD CARD est le produit emblématique de GREEN FAD : né de l''expérience terrain de ses fondateurs dans le réseautage professionnel à Bamako, il incarne l''alliance revendiquée par l''entreprise entre technologie et écologie.',
  'Services professionnels, entreprises, institutions',
  'Dirigeants, commerciaux, consultants, institutions et entreprises souhaitant moderniser leur identité professionnelle',
  '["Partage instantané des coordonnées par simple contact NFC", "Compatibilité universelle : lecture par smartphone via NFC ou QR code", "Page profil personnalisée (nom, fonction, contacts, réseaux, liens)", "Mise à jour des informations sans réimprimer la carte", "Cartes en PVC durable, design personnalisé aux couleurs de l''entreprise", "Tableau de bord pour les entreprises qui équipent leurs équipes"]',
  'Une identité toujours à jour, une image innovante lors de chaque échange, des économies sur les réimpressions et une démarche écoresponsable concrète.',
  'Produit conçu et supporté localement par GREEN FAD : personnalisation complète, service client en français, livraison et accompagnement au Mali et dans la sous-région.',
  'Cartes connectées', 'disponible', '/assets/images/portfolio/fadcard.jpg', 'package', 0, 'publie', datetime('now'),
  'FAD CARD — Produit technologique Green FAD', 'La carte de visite numérique NFC/RFID — votre identité professionnelle, digitale', '/assets/images/portfolio/fadcard.jpg');
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'fad-card'), mi.id, 0 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/portfolio/fadcard.jpg';
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'fad-card'), mi.id, 1 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/portfolio/fadcard-logo3.png';
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image) VALUES (
  'qrfad', 'QRFAD', 'Le menu digital pensé pour l''Afrique — scannez, commandez, savourez',
  'QRFAD est une solution numérique locale qui permet aux restaurants et hôtels africains de créer des menus digitaux via QR code, simples à gérer, accessibles en plusieurs langues et adaptés aux réalités du terrain.',
  'Les menus papier s''usent, sont coûteux à modifier et compliquent la gestion des prix et des disponibilités. Les clients attendent aujourd''hui une expérience moderne, hygiénique et rapide, y compris dans les établissements de petite taille.',
  'Donner à chaque restaurant africain — du petit maquis à l''hôtel international — un menu digital professionnel, sans investissement technique et gérable depuis un simple smartphone.',
  'QRFAD est né de l''observation directe du secteur de la restauration à Bamako : des établissements pleins, des cartes fatiguées, et des clients équipés de smartphones. GREEN FAD a conçu la réponse la plus simple : un QR code.',
  'Restauration, hôtellerie',
  'Restaurants, hôtels, cafés, salons de thé et établissements de restauration rapide',
  '["Menus digitaux accessibles par QR code, sans application à installer", "Plusieurs langues pour servir une clientèle locale et internationale", "Mise à jour des plats, prix et disponibilités en temps réel", "Photos et descriptions des plats pour une expérience appétissante", "Gestion multi-établissements pour les groupes d''hôtels-restaurants", "Tableau de bord simple, utilisable sans formation informatique"]',
  'Un menu toujours exact, une image moderne de l''établissement, moins d''impressions, et une expérience client fluidifiée.',
  'Une solution conçue pour le terrain africain : légère en données, multi-langues, avec un accompagnement local par l''équipe GREEN FAD.',
  'Hospitalité', 'disponible', '/assets/images/portfolio/qrfad.jpg', 'package', 1, 'publie', datetime('now'),
  'QRFAD — Produit technologique Green FAD', 'Le menu digital pensé pour l''Afrique — scannez, commandez, savourez', '/assets/images/portfolio/qrfad.jpg');
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'qrfad'), mi.id, 0 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/portfolio/qrfad.jpg';
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'qrfad'), mi.id, 1 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/portfolio/qrfad-logo.png';
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image) VALUES (
  'ferefad', 'FEREFAD', 'La marketplace de Green FAD — la plateforme de petites annonces pour l''Afrique',
  'FEREFAD est une plateforme inspirée par Oumar Ballo pour autonomiser la jeunesse africaine via le commerce numérique, soutenue par Green FAD pour encourager la croissance économique à travers une marketplace inclusive et transparente.',
  'Sur de nombreux marchés africains, le commerce en ligne formel reste peu accessible : les vendeurs manquent de canaux structurés et les acheteurs manquent de confiance dans les transactions à distance.',
  'Créer une place de marché inclusive et transparente qui connecte acheteurs et vendeurs et soutient la croissance économique, portée par la jeunesse africaine.',
  'FEREFAD est un projet porté avec Oumar Ballo et soutenu par GREEN FAD, qui en assure la conception technique, le développement et l''exploitation.',
  'E-commerce, commerce',
  'Jeunes entrepreneurs, commerçants, particuliers vendeurs et acheteurs',
  '["Publication d''annonces simple et guidée", "Recherche et filtres par catégorie et localisation", "Messagerie interne entre acheteurs et vendeurs", "Profils vendeurs pour renforcer la confiance", "Optimisé pour le mobile et les connexions à faible débit"]',
  'Un canal de vente formel et accessible, une visibilité élargie pour les vendeurs, un choix structuré pour les acheteurs.',
  'Une marketplace pensée depuis l''Afrique pour les usages africains, soutenue par une entreprise technologique locale de confiance.',
  'E-commerce', 'disponible', '/assets/images/portfolio/ferefad.jpg', 'package', 2, 'publie', datetime('now'),
  'FEREFAD — Produit technologique Green FAD', 'La marketplace de Green FAD — la plateforme de petites annonces pour l''Afrique', '/assets/images/portfolio/ferefad.jpg');
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'ferefad'), mi.id, 0 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/portfolio/ferefad.jpg';
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'ferefad'), mi.id, 1 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/portfolio/ferefad-logo.png';
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image) VALUES (
  'amitie-fad', 'L''Amitié Fad', 'Votre assistant hôtelier digital — le confort connecté',
  'L''Amitié Fad est une solution qui simplifie la communication en hôtel. Grâce à un QR code, les clients peuvent demander des services (ménage, taxi, etc.) directement depuis leur smartphone.',
  'Dans les hôtels, les demandes de services passent encore par des appels à la réception ou des déplacements : c''est lent, source d''erreurs et frustrant pour le client comme pour le personnel.',
  'Connecter chaque chambre à chaque service de l''hôtel : le client scanne, demande, et le personnel reçoit — une hospitalité plus fluide et plus moderne.',
  'Conçu et développé par GREEN FAD à partir des besoins exprimés par les acteurs de l''hôtellerie malienne, L''Amitié Fad est déployé comme service connecté clé en main.',
  'Hôtellerie',
  'Hôtels, résidences hôtelières et établissements d''hébergement',
  '["Demandes de services par QR code depuis la chambre (ménage, taxi, restauration…)", "Interface simple pour le client : scan, choix, envoi", "Notification et suivi des demandes pour le personnel", "Tableau de bord de l''hôtellerie : volume de demandes, délais, historique", "Personnalisation des services proposés par l''établissement"]',
  'Des demandes traitées plus vite, moins d''erreurs de communication, une expérience client modernisée et un service valorisé.',
  'Un assistant hôtelier conçu localement, déployable sans matériel lourd : un QR code par chambre et un smartphone pour le personnel.',
  'Hospitalité', 'disponible', '/assets/images/portfolio/amitiefad.jpg', 'package', 3, 'publie', datetime('now'),
  'L''Amitié Fad — Produit technologique Green FAD', 'Votre assistant hôtelier digital — le confort connecté', '/assets/images/portfolio/amitiefad.jpg');
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'amitie-fad'), mi.id, 0 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/portfolio/amitiefad.jpg';
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug = 'amitie-fad'), mi.id, 1 FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE m.r2_key = '/assets/images/portfolio/amitiefad-logo.png';
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image) VALUES (
  'niafad', 'NIAFAD', 'ERP — la gestion d''entreprise complète, conçue pour l''Afrique',
  'NIAFAD est la solution de gestion intégrée de GREEN FAD : un ERP qui optimise tous les processus de l''entreprise — ventes, stocks, finances, ressources humaines — dans un environnement unique et sécurisé.',
  'Beaucoup d''entreprises africaines gèrent leurs opérations avec des outils dispersés : cahiers, tableurs et logiciels non connectés. Les données sont dupliquées, les erreurs fréquentes, la vision consolidée impossible.',
  'Offrir aux entreprises africaines un ERP professionnel, adapté à leurs processus réels, déployé et supporté localement.',
  'NIAFAD est développé par les équipes d''ingénierie de GREEN FAD à partir d''accompagnements réalisés auprès d''entreprises locales.',
  'Tous secteurs d''activité',
  'PME, grandes entreprises et institutions souhaitant centraliser leur gestion',
  '["Gestion commerciale : devis, factures, clients", "Gestion des stocks et des achats", "Finances : caisse, dépenses, états de synthèse", "Ressources humaines : employés, paie, absences", "Rôles et permissions par utilisateur", "Tableaux de bord de pilotage"]',
  'Une source de vérité unique pour toutes les données, moins d''erreurs, des décisions fondées sur des indicateurs fiables.',
  'Un ERP déployé et supporté par une équipe locale, avec formation des équipes incluse.',
  'Gestion d''entreprise', 'disponible', '', 'package', 4, 'publie', datetime('now'),
  'NIAFAD — Produit technologique Green FAD', 'ERP — la gestion d''entreprise complète, conçue pour l''Afrique', '');
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image) VALUES (
  'sarapay', 'SARAPAY', 'L''application de paiement sécurisée pour des transactions fiables',
  'SARAPAY est la solution de paiement mobile de GREEN FAD : des transactions sécurisées, pensées pour les usages et les opérateurs du marché africain.',
  'Les transactions numériques doivent conjuguer sécurité, simplicité et compatibilité avec les moyens de paiement locaux. Les solutions génériques ne couvrent pas toujours ces besoins.',
  'Simplifier et sécuriser les paiements digitaux pour les entreprises et leurs clients, avec une solution fiable et conforme.',
  'SARAPAY est développé par GREEN FAD au sein de son laboratoire d''innovation, en réponse aux besoins de ses plateformes (marketplace, gestion) et de ses clients.',
  'Fintech, services',
  'Entreprises, plateformes e-commerce et institutions acceptant les paiements digitaux',
  '["Paiements mobiles sécurisés", "Historique et traçabilité des transactions", "Intégration aux plateformes GREEN FAD et aux systèmes clients", "Notifications et confirmations en temps réel"]',
  'Des paiements fiables et traçables, une expérience de paiement fluide pour les clients, une réconciliation simplifiée.',
  'Une solution de paiement conçue au sein d''un écosystème produits africain intégré.',
  'Fintech', 'disponible', '', 'package', 5, 'publie', datetime('now'),
  'SARAPAY — Produit technologique Green FAD', 'L''application de paiement sécurisée pour des transactions fiables', '');
INSERT INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image) VALUES (
  'carte-sante', 'Carte Santé', 'Votre dossier médical numérique personnel, accessible en toutes circonstances',
  'La Carte Santé de GREEN FAD est un dossier médical numérique personnel : historique, traitements, allergies et urgences accessibles en toutes circonstances, au cabinet comme aux urgences.',
  'Le suivi médical repose souvent sur des documents papier dispersés entre plusieurs structures. En cas d''urgence, l''absence d''informations fiables et immédiates peut avoir des conséquences graves.',
  'Donner à chaque patient un dossier médical personnel, portable et sécurisé, et aux professionnels de santé un accès autorisé aux informations essentielles.',
  'La Carte Santé prolonge l''expertise cartes connectées de GREEN FAD (FAD CARD) vers le secteur de la santé.',
  'Santé',
  'Patients, cliniques, cabinets médicaux et professionnels de santé',
  '["Dossier médical numérique personnel sécurisé", "Historique des consultations et traitements", "Informations d''urgence : allergies, groupe sanguin, contacts", "Carte physique connectée + espace numérique", "Accès contrôlé : le patient décide qui consulte son dossier"]',
  'Un suivi médical continu et fiable, des urgences mieux informées, un patient acteur de ses données.',
  'Un dossier médical portable pensé pour le terrain africain, lié à une carte physique résistante.',
  'E-santé', 'disponible', '', 'package', 6, 'publie', datetime('now'),
  'Carte Santé — Produit technologique Green FAD', 'Votre dossier médical numérique personnel, accessible en toutes circonstances', '');

-- ---------- PRÉSENCE INTERNATIONALE (données réelles) ----------
INSERT INTO countries (slug, name, iso2, flag_emoji, is_registered, presentation_md, sort_order, status, published_at) VALUES ('mali', 'Mali', 'ML', '', 1, 'GREEN FAD SARL est immatriculée au Mali. Le siège social se trouve à Missabougou, Bamako. C''est de là que sont conçus, développés et déployés nos produits et nos projets clients.', 0, 'publie', datetime('now'));
INSERT INTO countries (slug, name, iso2, flag_emoji, is_registered, presentation_md, sort_order, status, published_at) VALUES ('burkina-faso', 'Burkina Faso', 'BF', '', 1, 'GREEN FAD intervient au Burkina Faso auprès d''organisations locales et y est immatriculée. Nos équipes y déploient des solutions digitales et accompagnent la transformation numérique des entreprises.', 1, 'publie', datetime('now'));
INSERT INTO countries (slug, name, iso2, flag_emoji, is_registered, presentation_md, sort_order, status, published_at) VALUES ('rdc-congo', 'RD Congo', 'CD', '', 1, 'GREEN FAD est immatriculée en République démocratique du Congo et contribue à des projets de transformation digitale dans le pays.', 2, 'publie', datetime('now'));
INSERT INTO countries (slug, name, iso2, flag_emoji, is_registered, presentation_md, sort_order, status, published_at) VALUES ('niger', 'Niger', 'NE', '', 1, 'GREEN FAD est immatriculée au Niger et accompagne des organisations locales dans leurs projets numériques.', 3, 'publie', datetime('now'));
INSERT INTO countries (slug, name, iso2, flag_emoji, is_registered, presentation_md, sort_order, status, published_at) VALUES ('cote-ivoire', 'Côte d''Ivoire', 'CI', '', 0, 'GREEN FAD sert des clients en Côte d''Ivoire à travers ses produits et ses expertises, avec une présence commerciale en développement.', 4, 'publie', datetime('now'));
INSERT INTO offices (country_id, city, address, phone, email, hours, is_hq, status, created_at, updated_at) SELECT (SELECT id FROM countries WHERE slug = 'mali'), 'Bamako', 'Missabougou, Bamako, Mali', '+223 72 19 46 54', 'contact@greenfad.tech', 'Lundi - Vendredi : 8h00 - 17h00', 1, 'publie', datetime('now'), datetime('now');

-- ---------- PARTENAIRES & RÉFÉRENCES (logos réels de l'ancien site) ----------
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Afric-Immo', m.r2_key, 0, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/afric-immo.jpg' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'ArtifyFad', m.r2_key, 1, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/artifyfad.png' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Casa des Délices', m.r2_key, 2, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/casa-des-delices.jpg' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Cours Africa', m.r2_key, 3, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/cours-africa.jpg' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'EFB Entreprise', m.r2_key, 4, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/efb-entreprise.jpg' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'EMAGE', m.r2_key, 5, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/emage.jpg' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Emmaf Consulting', m.r2_key, 6, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/emmaf-consulting.jpg' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Eurodecor', m.r2_key, 7, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/eurodecor.png' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Justice Mali', m.r2_key, 8, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/justice-mali.jpg' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Le Baobab Hôtel', m.r2_key, 9, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/le-baobab-hotel.jpg' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Nature Attitude', m.r2_key, 10, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/nature-attitude.jpg' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Sky Buffet', m.r2_key, 11, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/sky-buffet.jpg' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Greenfad', m.r2_key, 12, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/greenfad1.png' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);
INSERT INTO partners (name, logo_key, sort_order, status) SELECT 'Greenfad 2', m.r2_key, 13, 'publie' FROM media m WHERE m.r2_key = '/assets/images/clients/greenfad2.png' AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.logo_key = m.r2_key);

-- ---------- FAQ ----------
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Qui est GREEN FAD ?', 'GREEN FAD SARL est une entreprise technologique africaine d''innovation, de conception et de développement. Elle conçoit des produits numériques propriétaires (FAD CARD, QRFAD, FEREFAD, NIAFAD…), assure l''ingénierie logicielle et accompagne la transformation digitale des organisations, depuis Bamako (Mali) et à l''international.', 'Général', 0, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Quels sont les trois univers de Green FAD ?', 'Green FAD déploie son expertise selon trois univers complémentaires : le corporate (l''entreprise, sa vision et son identité), le business & technology (produits, expertises et réalisations) et le media & knowledge (galerie, innovation et ressources).', 'Général', 1, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Dans quels pays intervient GREEN FAD ?', 'GREEN FAD est immatriculée au Mali (siège à Bamako), au Burkina Faso, en République démocratique du Congo et au Niger, et sert des clients en Côte d''Ivoire. Consultez la page Implantation pour le détail.', 'Général', 2, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Comment obtenir une démonstration d''un produit ?', 'Rendez-vous sur la fiche du produit qui vous intéresse et utilisez le formulaire « Demander une démonstration ». Notre équipe vous contacte pour organiser une présentation en présentiel à Bamako ou en visioconférence.', 'Produits', 3, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Les produits GREEN FAD sont-ils disponibles hors du Mali ?', 'Oui. Nos produits sont conçus pour les marchés africains et sont déployables dans l''ensemble de la sous-région et à l''international. Contactez-nous pour étudier votre contexte.', 'Produits', 4, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('La FAD CARD fonctionne-t-elle avec tous les smartphones ?', 'La FAD CARD utilise la technologie NFC/RFID standard : tout smartphone récent équipé de NFC peut lire la carte. Les téléphones sans NFC peuvent lire le QR code associé, ce qui couvre l''ensemble des appareils.', 'produit:fad-card', 5, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Peut-on mettre à jour les informations de sa carte ?', 'Oui — c''est l''un des avantages principaux de la FAD CARD : les coordonnées et liens se mettent à jour sans réimprimer la carte.', 'produit:fad-card', 6, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('Faut-il installer une application pour utiliser QRFAD ?', 'Non. Le client scanne simplement le QR code avec l''appareil photo de son téléphone : le menu s''ouvre dans le navigateur, sans installation.', 'produit:qrfad', 7, 'publie');
INSERT INTO faqs (question, answer, category, sort_order, status) VALUES ('QRFAD gère-t-il plusieurs langues ?', 'Oui, QRFAD a été conçu pour servir une clientèle locale et internationale : les menus sont accessibles en plusieurs langues.', 'produit:qrfad', 8, 'publie');

-- ---------- INNOVATION & PUBLICATIONS ----------
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
*Accélérateur de la Transformation Numérique et Écologique en Afrique*', '', 'digital', '["blog", "lancement", "transformation digitale", "Afrique"]', 'Green FAD', 'article', 0, '2025-11-10 10:00:00', 'publie', 'Découvrez notre nouveau blog dédié à la transformation numérique et écologique en Afrique. Articles, tutoriels et actualités sur le développement web, le S');

INSERT INTO pages (slug, title, nav_label, meta_title, meta_description, blocks, status, is_home, version, published_at) VALUES ('accueil', 'Accueil', 'Accueil', 'GREEN FAD SARL — Entreprise technologique africaine : produits propriétaires, ingénierie et transformation digitale', 'Entreprise technologique africaine : FAD CARD, QRFAD, FEREFAD… Green FAD conçoit ses propres produits numériques et accompagne la transformation digitale des organisations, du Mali vers l''international.', '[{"type": "hero", "visible": true, "eyebrow": "GREEN FAD SARL — Entreprise technologique africaine", "title": "Nous concevons les produits numériques qui transforment l''Afrique", "subtitle": "Innovation, ingénierie logicielle et transformation digitale : Green FAD développe ses propres technologies et accompagne les organisations, du Mali vers l''international.", "cta_label": "Découvrir nos produits", "cta_url": "/produits", "cta2_label": "Nous contacter", "cta2_url": "/contact", "variant": "gradient"}, {"type": "section_header", "visible": true, "eyebrow": "Nos piliers", "title": "Quatre piliers stratégiques", "text": "Une méthodologie éprouvée pour garantir le succès de votre projet.", "align": "center"}, {"type": "cards", "visible": true, "source": "manual", "limit": 4, "columns": 4, "items": [{"title": "Solutions Digitales & Technologies Vertes", "text": "Des solutions complètes pour transformer les défis environnementaux en opportunités de développement durable.", "icon": "leaf"}, {"title": "Innovations & Outils sur Mesure", "text": "Création de solutions propriétaires innovantes comme la FAD CARD, alliant technologie NFC/RFID et écologie.", "icon": "lightbulb"}, {"title": "Communication Multicanale & Identité", "text": "Design graphique, création d''identités visuelles et stratégies de communication intégrée.", "icon": "palette"}, {"title": "Conseil & Accompagnement", "text": "Audit digital, formation des équipes et support post-déploiement pour une adoption pérenne.", "icon": "compass"}]}, {"type": "stats", "visible": true, "variant": "dark", "items": [{"value": "7", "label": "Produits technologiques propriétaires"}, {"value": "5", "label": "Pays d''intervention en Afrique"}, {"value": "4", "label": "Expertises d''ingénierie"}, {"value": "13", "label": "Références clients & partenaires"}]}, {"type": "section_header", "visible": true, "eyebrow": "Nos solutions", "title": "Des produits nés sur le terrain", "text": "Chaque produit GREEN FAD répond à un besoin réel observé sur le terrain africain.", "align": "center"}, {"type": "cards", "visible": true, "source": "products", "limit": 6, "columns": 3, "items": [], "view_all_label": "Voir tous les produits", "view_all_url": "/produits"}, {"type": "split", "visible": true, "title": "L''alliance de la technologie et de l''écologie", "text_md": "Fondée par des professionnels passionnés par l''innovation et sensibles aux enjeux environnementaux, **GREEN FAD SARL** accompagne la transition numérique et écologique des organisations en Afrique.\n\n**Notre vision :** un avenir où technologie et durabilité vont de pair, réduisant la fracture numérique en Afrique.\n\n**Notre ambition :** porter nos propres innovations technologiques à l''échelle internationale.", "image_key": "/assets/images/office-workers-africa.jpg", "image_side": "right", "cta_label": "Découvrir l''entreprise", "cta_url": "/p/entreprise"}, {"type": "section_header", "visible": true, "eyebrow": "Expertises", "title": "Ce que nous faisons", "align": "center"}, {"type": "cards", "visible": true, "source": "services", "limit": 4, "columns": 4, "items": [], "view_all_label": "Toutes nos expertises", "view_all_url": "/expertises"}, {"type": "gallery_album", "visible": true, "album_slug": "produits-green-fad", "limit": 6}, {"type": "countries_map", "visible": true}, {"type": "cta", "visible": true, "title": "Construisons ensemble un avenir durable et digital", "text": "Parlons de votre projet — nos équipes vous répondent rapidement.", "button_label": "Démarrer la conversation", "button_url": "/contact", "variant": "solid"}]', 'publie', 1, 1, datetime('now'));

INSERT INTO pages (slug, title, nav_label, meta_title, meta_description, blocks, status, is_home, version, published_at) VALUES ('entreprise', 'Entreprise', 'Entreprise', 'L''entreprise GREEN FAD — identité, vision et présence internationale', 'Qui est GREEN FAD SARL : entreprise technologique africaine, produits propriétaires, ingénierie logicielle, présence au Mali, Burkina Faso, RD Congo, Niger et Côte d''Ivoire.', '[{"type": "hero", "visible": true, "eyebrow": "L''entreprise", "title": "Une entreprise technologique africaine, à ambition internationale", "subtitle": "GREEN FAD SARL conçoit, développe et porte ses propres innovations technologiques — et accompagne les organisations dans leur transformation numérique et écologique.", "cta_label": "Nos produits", "cta_url": "/produits", "cta2_label": "Nous contacter", "cta2_url": "/contact", "variant": "dark"}, {"type": "split", "visible": true, "title": "Qui sommes-nous", "text_md": "GREEN FAD SARL est une entreprise technologique africaine d''innovation, de conception, de développement et de transformation numérique. Basée à Bamako (Mali), immatriculée dans plusieurs pays africains, elle conçoit des produits numériques propriétaires et développe des solutions sur mesure pour les entreprises et institutions.\n\nFondée par des professionnels passionnés par l''innovation et sensibles aux enjeux environnementaux, GREEN FAD place l''**alliance de la technologie et de l''écologie** au cœur de son identité : *Future, Authentique, Dynamique*.", "image_key": "/assets/images/about-team.jpg", "image_side": "right", "cta_label": "", "cta_url": ""}, {"type": "section_header", "visible": true, "eyebrow": "Notre identité", "title": "Ce qui nous définit", "align": "center"}, {"type": "cards", "visible": true, "source": "manual", "limit": 4, "columns": 2, "items": [{"title": "Innovation technologique africaine", "text": "Nous ne nous contentons pas d''implémenter : nous inventons, expérimentons et documentons. Nos produits naissent de l''observation directe du terrain.", "icon": "lightbulb"}, {"title": "Produits numériques propriétaires", "text": "FAD CARD, QRFAD, FEREFAD, NIAFAD, SARAPAY, Carte Santé, L''Amitié Fad : sept produits que nous concevons, développons et exploitons nous-mêmes.", "icon": "package"}, {"title": "Ingénierie logicielle & infrastructures", "text": "Développement web et mobile, données, déploiement cloud : une chaîne de valeur technologique complète, maîtrisée de bout en bout.", "icon": "cpu"}, {"title": "Transformation digitale des organisations", "text": "Audit, conseil, développement et formation : nous accompagnons entreprises et institutions dans la durée, pas seulement au lancement.", "icon": "workflow"}]}, {"type": "stats", "visible": true, "variant": "light", "items": [{"value": "4", "label": "Pays d''immatriculation : Mali, Burkina Faso, RD Congo, Niger"}, {"value": "7", "label": "Produits propriétaires développés"}, {"value": "3", "label": "Univers : corporate, business & technology, media & knowledge"}]}, {"type": "section_header", "visible": true, "eyebrow": "Notre approche", "title": "R&D, expérimentation et transmission", "align": "center"}, {"type": "richtext", "visible": true, "content_md": "GREEN FAD ne fait pas que développer des logiciels : l''entreprise réfléchit, expérimente, documente et contribue à l''écosystème technologique africain.\n\n- **Recherche & développement** : chaque produit passe par un cycle d''expérimentation réel\n- **Veille technologique** : nous suivons et analysons les évolutions utiles au continent\n- **Transmission** : guides, analyses et retours d''expérience publiés dans notre espace Innovation\n- **Partenariats** : collaborations avec des entreprises et institutions locales et internationales\n\n> « Future, Authentique, Dynamique » — notre sigle est notre feuille de route."}, {"type": "countries_map", "visible": true}, {"type": "cta", "visible": true, "title": "Travailler avec GREEN FAD", "text": "Produit, expertise ou partenariat : échangeons sur votre projet.", "button_label": "Nous contacter", "button_url": "/contact", "variant": "solid"}]', 'publie', 0, 1, datetime('now'));

-- ---------- PAGES LÉGALES ----------
INSERT INTO pages (slug, title, meta_title, meta_description, blocks, status, is_home, version, published_at) VALUES ('mentions-legales', 'Mentions légales', 'Mentions légales | GREEN FAD', 'Mentions légales du site greenfad.tech — éditeur, hébergement, propriété intellectuelle.', '[{"type": "hero", "visible": true, "eyebrow": "Informations légales", "title": "Mentions légales", "variant": "dark"}, {"type": "richtext", "visible": true, "content_md": "## Éditeur du site\n\nLe présent site est édité par **GREEN FAD SARL**, société immatriculée au Mali.\n\n- Siège social : Missabougou, Bamako, Mali\n- Téléphone : +223 72 19 46 54\n- Email : contact@greenfad.tech\n\n## Directeur de la publication\n\nLa direction générale de GREEN FAD SARL.\n\n## Hébergement\n\nLe site est hébergé sur linfrastructure cloud de Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis.\n\n## Propriété intellectuelle\n\nLensemble des contenus du site (textes, visuels, logos, marques, produits GREEN FAD et leurs dénominations) est protégé. Toute reproduction ou réutilisation sans autorisation écrite préalable est interdite.\n\n## Signalement\n\nPour signaler un contenu problématique : contact@greenfad.tech."}]', 'publie', 0, 1, datetime('now'));
INSERT INTO pages (slug, title, meta_title, meta_description, blocks, status, is_home, version, published_at) VALUES ('confidentialite', 'Politique de confidentialité', 'Confidentialité | GREEN FAD', 'Politique de confidentialité et de protection des données de greenfad.tech.', '[{"type": "hero", "visible": true, "eyebrow": "Vos données", "title": "Politique de confidentialité", "variant": "dark"}, {"type": "richtext", "visible": true, "content_md": "## Données collectées\n\nGREEN FAD SARL collecte uniquement les données que vous nous transmettez volontairement via les formulaires du site (nom, email, téléphone, société, message) afin de répondre à vos demandes.\n\n## Finalités\n\n- Répondre à vos demandes de contact, devis et démonstrations\n- Traiter vos candidatures aux offres demploi\n- Gérer vos abonnements à la newsletter (si vous vous y inscrivez)\n\n## Durée de conservation & sécurité\n\nLes données sont conservées le temps nécessaire au traitement de votre demande puis archivées ou supprimées. Elles sont stockées sur des infrastructures sécurisées (Cloudflare) et ne sont jamais vendues à des tiers.\n\n## Vos droits\n\nVous pouvez demander laccès, la rectification ou la suppression de vos données à tout moment : **contact@greenfad.tech**.\n\n## Mesure daudience & cookies\n\nLe site nutilise pas de traceurs publicitaires. Seuls des cookies techniques strictement nécessaires (session administrateur) peuvent être déposés."}]', 'publie', 0, 1, datetime('now'));
INSERT INTO pages (slug, title, meta_title, meta_description, blocks, status, is_home, version, published_at) VALUES ('cgv', 'Conditions générales de vente', 'CGV | GREEN FAD', 'Conditions générales de vente des services et produits GREEN FAD SARL.', '[{"type": "hero", "visible": true, "eyebrow": "Conditions", "title": "Conditions générales de vente", "variant": "dark"}, {"type": "richtext", "visible": true, "content_md": "## Objet\n\nLes présentes conditions régissent les prestations de services et la fourniture de produits par GREEN FAD SARL (« le Prestataire ») à ses clients.\n\n## Commandes & devis\n\nToute commande fait suite à un devis écrit accepté par le client. Le devis précise le périmètre, les délais et le prix.\n\n## Paiement\n\nLes modalités de paiement sont indiquées sur chaque devis. Sauf convention contraire, un acompte est requis au démarrage et le solde à la livraison.\n\n## Livraison & réception\n\nLes livraisons font lobjet dune recette contradictoire. Les produits numériques sont livrés avec leur documentation et la formation associée lorsque prévue au devis.\n\n## Propriété intellectuelle\n\nLes produits propriétaires GREEN FAD demeurent la propriété intellectuelle de GREEN FAD SARL ; le client bénéficie dun droit dusage défini au contrat.\n\n## Litiges\n\nEn cas de litige, les parties recherchent une solution amiable avant toute action devant les tribunaux compétents de Bamako, Mali."}]', 'publie', 0, 1, datetime('now'));

-- ---------- REDIRECTIONS SEO ----------
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/index.html', '/', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/innovation', '/blog', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/innovation/*', '/blog/*', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/actualites', '/blog', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/actualites/*', '/blog/*', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/blog.html', '/blog', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/blog-article.html', '/blog', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/services', '/expertises', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/projets/portfolio.html', '/realisations', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/projets', '/realisations', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/services/web-development.html', '/expertises/developpement-web', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/services/mobile-apps.html', '/expertises/applications-mobiles', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/services/seo-marketing.html', '/expertises/seo-marketing-digital', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/services/print-communication.html', '/expertises/impression-communication', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/services/*', '/expertises', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/countries/*', '/implantation/*', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/carrieres.html', '/carrieres', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/faq.html', '/faq', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/contact.html', '/contact', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/support-technique.html', '/contact', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/mentions-legales.html', '/p/mentions-legales', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/politique-de-confidentialite.html', '/p/confidentialite', 301, 1, datetime('now'));
INSERT OR IGNORE INTO redirects (from_path, to_path, code, is_active, created_at) VALUES ('/cgv.html', '/p/cgv', 301, 1, datetime('now'));

-- Fin du seed v3
