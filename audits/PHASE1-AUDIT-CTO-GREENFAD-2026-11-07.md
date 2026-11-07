# Audit Technique de la Plateforme greenfad.tech — Phase 1 (Audit et diagnostic)

> **Ordre de mission CTO v1.0 — 7 novembre 2026 · Version 1.0 · Statut : Phase 1 TERMINÉE — aucun développement engagé**
> 
> Référentiel audité : `Green-fad/Greenfad`, branche `main`, commit de tête `46bd28e` · Production mesurée : https://greenfad.tech (Cloudflare → Hostinger) et https://green-fad.github.io/Greenfad/ (GitHub Pages).
> 
> Archivage du rapport : dossier `audits/`, commit (commit à venir lors de l'archivage) · Preuves : `audits/proofs-phase1-2026-11-07/`


## 1. Synthèse exécutive

Conformément à l'ordre de mission CTO v1.0 du 7 novembre 2026, le présent rapport constitue la Phase 1 (Audit et diagnostic) de la transformation de la plateforme greenfad.tech. Aucun développement n'a été engagé : le périmètre de cette intervention est strictement limité à l'audit, la collecte de preuves et la proposition d'une architecture cible. Toutes les affirmations contenues dans ce rapport sont appuyées par des preuves vérifiables : chemins de fichiers, numéros de commits, codes HTTP mesurés le jour de l'audit, extraits de code et captures d'écran reproduites en annexe.

Le constat central est le suivant : le site officiel GREEN FAD est aujourd'hui un site statique HTML/CSS/JavaScript déployé manuellement sur un hébergement mutualisé Hostinger derrière Cloudflare, tandis que le dépôt GitHub Green-fad/Greenfad — dont la branche main est la seule source versionnée — alimente en parallèle un déploiement GitHub Pages jamais référencé publiquement. La production n'est pas synchronisée avec le dépôt : les développements de novembre 2025 (plateforme de blog, back-office Decap CMS) sont absents du site réellement servi à greenfad.tech. Aucun élément de la stack de référence imposée par l'ordre de mission (Cloudflare Pages, backend Hono, Cloudflare D1, Cloudflare R2, Workers, TypeScript, validation serveur) n'existe à ce jour dans le projet.

L'audit relève en outre des défauts graves directement visibles par les visiteurs et les moteurs de recherche : 76 références vers des fichiers absents du dépôt (13 pages secondaires servies sans leur feuille de style principale), un interstitiel reCAPTCHA Enterprise en dépassement de quota sur le domaine principal, des formulaires de contact et de candidature qui simulent l'envoi sans transmettre aucune donnée, un blog triplement incohérent dont la page est en erreur 404 en production, un sitemap en ligne obsolète à cinq URL, et une image Open Graph référencée mais inexistante.

Ces constats ne remettent pas en cause la valeur des fondations existantes : l'identité GREEN FAD SARL, les coordonnées de contact, le référencement de base et une quarantaine de pages de contenu réutilisables constituent un patrimoine exploitable. Le rapport conclut par une architecture cible conforme à l'ordre de mission (modèle de données D1, contrats API Hono, RBAC, Page Builder), un plan de migration en sept phases avec procédure de retour arrière, un découpage en six missions d'agents et des estimations indicatives par phase.

**Tableau 1 — Verdict global par domaine audité**

| Domaine | État constaté | Statut |
|---|---|---|
| Dépôt Git (Green-fad/Greenfad) | Branche main unique, 101 commits du 10/09/2025 au 11/11/2025, aucune activité depuis | Fonctionnel, figé |
| Site en production (greenfad.tech) | Hostinger derrière Cloudflare, contenu en retard sur le dépôt, interstitiel reCAPTCHA en dépassement de quota | Dégradé |
| GitHub Pages (green-fad.github.io) | Déploiement automatique actif de main, jamais utilisé publiquement, canonical dupliqué | À retraiter |
| Frontend | 23 pages HTML statiques, 2 systèmes de design mélangés, 76 références cassées | À reconstruire |
| Backend Hono / API | Aucun backend, aucune API, aucune validation serveur | Absent |
| Base de données D1 | Aucune base, aucun schéma, aucune migration | Absent |
| Stockage R2 | Aucun bucket ; médias en directory assets/images (33 Mo non optimisés) | Absent |
| Dashboard / back-office | Decap CMS dont l'authentification pointe vers /api/auth inexistant ; absent de la production | Non fonctionnel |
| Authentification / RBAC | Aucune authentification, aucune gestion d'utilisateurs | Absent |
| Blog | Quatre sources de données divergentes ; page 404 en production ; images absentes | Cassé |
| Formulaires (contact, carrières, newsletter) | Envoi simulé côté client, aucune donnée transmise ni stockée | Simulé |
| SEO | Sitemap production obsolète (5 URL), og:image 404, pages secondaires hors sitemap | À corriger |
| CI/CD | Deux workflows GitHub Pages concurrents ; aucune pipeline vers la production réelle | À remplacer |
| Sécurité applicative | Aucun secret exposé ; en-têtes HTTP corrects ; aucune surface privée réelle à ce jour | À construire |

*Statuts : « Absent » = aucun artefact correspondant trouvé dans le dépôt ou en ligne ; « Simulé » = interface visible mais fonction non réalisée ; « Dégradé » = fonction visible mais en erreur pour l'utilisateur.*


## 2. Périmètre, méthode et preuves


### 2.1 Objets audités

L'audit couvre les dix-sept points demandés par l'ordre de mission : dépôt Git et branche active ; historique des commits ; site réellement déployé ; frontend et son architecture ; backend Hono ; routes et contrats API ; tables Cloudflare D1 ; migrations et relations ; buckets Cloudflare R2 ; variables d'environnement et bindings ; authentification et permissions ; Dashboard existant ; pages publiques ; fonctionnalités opérationnelles ; SEO et redirections ; pipeline CI/CD ; configuration de production. Le périmètre exclut volontairement l'application mobile TILE et la vitrine tileofficiel.com, qui relèvent d'un autre référentiel (dépôt Green-fad/Tile) et d'une mission déjà clôturée.


### 2.2 Méthode

Quatre moyens de preuve ont été employés le 7 novembre 2026. Premièrement, l'analyse statique complète du dépôt cloné à partir de https://github.com/Green-fad/Greenfad.git (branche main, commit de tête 46bd28e) : inventaire de fichiers, analyse des 23 pages HTML, extraction et résolution de chaque référence locale (src et href), lecture intégrale des six scripts JavaScript et des deux workflows GitHub Actions. Deuxièmement, la sonde HTTP du site en production (https://greenfad.tech) et du déploiement GitHub Pages (https://green-fad.github.io/Greenfad/) : codes de statut, en-têtes, hachages MD5 de contenu, comparaison avec le dépôt. Troisièmement, le rendu navigué du dépôt avec un navigateur automatisé (accueil 1366×900, accueil mobile 390×844, page pays, page blog), dont les captures illustrent le chapitre UX. Quatrièmement, un balayage de sécurité par motifs (clés d'API, secrets, mots de passe) sur l'ensemble des fichiers texte du dépôt.

L'outil de vérification de références, développé pour cet audit, a résolu 1 104 références locales issues des 23 pages HTML : toute référence ne correspondant pas à un fichier existant du dépôt est comptabilisée comme cassée et classée par type. Les résultats bruts sont conservés dans les scripts d'audit livrés avec ce rapport et réexécutables (scripts/audit_greenfad_links.py).


### 2.3 Convention de statuts et de confirmation

Conformément aux règles permanentes de gestion des contenus de GREEN FAD, aucune donnée d'identité non vérifiable n'est présentée comme acquise : les éléments factuels relevant de la responsabilité de l'entreprise (témoignages clients, chiffres d'activité, offres d'emploi ouvertes) sont marqués « À confirmer par Greenfad-SARL » dans le tableau 9. De même, aucune estimation de charge n'est présentée comme un engagement : les durées du chapitre 20 sont des fourchettes indicatives à affiner après validation de l'architecture cible.


## 3. Dépôt Git, historique et site réellement déployé


### 3.1 Le dépôt Green-fad/Greenfad

Le dépôt public Green-fad/Greenfad contient une branche unique (main), sans branches de développement ni étiquettes de version. L'historique compte 101 commits couvrant la période du 10 septembre 2025 au 11 novembre 2025, puis plus aucun commit : le dépôt est figé depuis environ un an au moment de l'audit. Cinq identités d'auteurs apparaissent (Greenfad 56 commits, unconditional22 20, Green-fad 15, « Greenfad agent » 9, Manus 1), ce qui confirme un historique produit par plusieurs intervenants et agents automatisés sans convention de nommage unifiée. Le dépôt pèse 38,33 MiB en objets compressés, dont 33 Mo d'images.

**Tableau 2 — Synthèse du dépôt Git (preuves : git log, git count-objects)**

| Propriété | Valeur mesurée le 07/11/2026 |
|---|---|
| Remote | https://github.com/Green-fad/Greenfad.git |
| Branche par défaut | main (aucune autre branche, aucun tag) |
| Nombre de commits | 101 |
| Premier commit | bd48be0 — 10/09/2025 — « Initial commit: Nouveau site Greenfad moderne et professionnel » |
| Dernier commit | 46bd28e — 10/11/2025 20:49 UTC−5 — « Fix: Correction redirection blog et réduction effets de transition » |
| Activité depuis | Aucun commit entre le 11/11/2025 et le 07/11/2026 (12 mois d'inactivité) |
| Auteurs | 5 identités : Greenfad (56), unconditional22 (20), Green-fad (15), Greenfad agent (9), Manus (1) |
| Taille du pack | 38,33 MiB (dont assets/images : 33 Mo) |
| Fichiers racine notables | index.html (59,4 Ko), 11 autres pages racine, 5 pages pays, 4 pages services, portfolio, admin/, _posts/ (3 .md), CNAME, .htaccess, robots.txt, sitemap.xml, 404.html, .nojekyll |
| .gitignore | Une seule règle (*.pptx) |
| Secrets exposés | Aucun détecté par balayage de motifs sur les fichiers texte |


### 3.2 Production réelle : Hostinger derrière Cloudflare — et non GitHub Pages

La découverte structurante de l'audit est la dissociation entre le dépôt et la production. Les en-têtes de https://greenfad.tech renvoient server: cloudflare (proxy) puis platform: hostinger, panel: hpanel et x-turbo-charged-by: LiteSpeed : le domaine est servi par un hébergement mutualisé Hostinger, pas par GitHub Pages. Le dépôt contient bien un fichier .htaccess Apache (compression, cache, en-têtes de sécurité, URLs proprement dites, ErrorDocument) qui est ignoré par GitHub Pages mais appliqué par LiteSpeed sur Hostinger : les en-têtes de sécurité mesurés en production (Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Referrer-Policy) correspondent très exactement au contenu de ce fichier.

La production n'est pas synchronisée avec la branche main. L'en-tête Last-Modified de la page d'accueil production est le 10 novembre 2025 à 06:37 UTC, alors que le dernier commit est daté du 11 novembre 2025 à 01:49 UTC : les déploiements manuels vers Hostinger (probablement par FTP ou le gestionnaire de fichiers hPanel) se sont arrêtés avant les derniers travaux. Les preuves directes de cette divergence sont sans ambiguïté : la page blog.html renvoie 404 en production alors qu'elle existe dans le dépôt ; le sitemap en ligne n'annonce que 5 URL contre 9 dans le dépôt ; le back-office /admin/ renvoie 404 en production ; et le hachage MD5 de l'index en ligne diffère de celui du dépôt. En conséquence, tout travail sur le dépôt GitHub n'améliore pas le site réel tant que la chaîne de publication vers Hostinger n'est pas industrialisée — c'est le premier risque identifié du projet.


### 3.3 Déploiement GitHub Pages parallèle

Le dépôt embarque deux workflows GitHub Actions concurrents déclenchés sur le même événement (push sur main) : jekyll-gh-pages.yml (construction Jekyll) et static.yml (publication statique). Les deux jobs alimentent le même environnement github-pages. L'audit établit que c'est le workflow static.yml qui gagne la course : le fichier brut _posts/2025-11-10-bienvenue-sur-le-blog-greenfad.md est servi tel quel sur https://green-fad.github.io/Greenfad/ (HTTP 200) alors qu'aucune page d'article générée par Jekyll n'existe (HTTP 404). Ce double déploiement est non déterministe : à chaque push, l'un des deux artefacts peut remplacer l'autre. Par ailleurs, chaque page servie depuis green-fad.github.io porte un lien canonical pointant vers greenfad.tech : le sous-domaine GitHub constitue un doublon de contenu indexable que les moteurs peuvent explorer via des liens externes.


### 3.4 Incident en cours : interstitiel reCAPTCHA Enterprise en dépassement de quota

Lors de la visite naviguée de l'accueil en production, le navigateur automatisé a été bloqué par un interstitiel « Verifying that you are not a robot… » intégrant un widget reCAPTCHA affichant le message « This site is exceeding reCAPTCHA Enterprise free quota ». La case de vérification est incluse dans un iframe interdomaine non automatisable et, le quota étant dépassé, la vérification ne peut aboutir : pour les visiteurs auxquels ce challenge est présenté, le site est simplement inaccessible. Les requêtes curl simples obtiennent au contraire un 200 direct, ce qui montre que la protection ne s'applique qu'à certaines empreintes de client. Cet incident, documenté par la capture d'écran de l'annexe B, exige une action immédiate côté hébergement : revoir la configuration de protection bot (Cloudflare ou hPanel Hostinger) afin qu'aucun visiteur légitime ni crawler officiel ne soit pris dans un challenge non solvable. Cette correction est indépendante de la refonte et peut être traitée dès maintenant par le titulaire du compte.

![Preuve](audits/proofs-phase1-2026-11-07/capture-1-production-recaptcha-quota.png)

*Capture 1 — greenfad.tech en production : interstitiel reCAPTCHA Enterprise avec dépassement de quota (le 07/11/2026)*


## 4. Inventaire des pages publiques et des fonctionnalités

Le site compte 23 fichiers HTML : 12 à la racine, 5 pages pays (countries/), 4 pages services (services/), 1 portfolio (projets/) et 1 back-office admin/. Le tableau 3 recense chaque page avec son statut dans le dépôt et sa disponibilité mesurée en production. Trois observations majeures en ressortent. D'abord, 13 pages sur 23 chargent des feuilles de style et des scripts qui n'existent pas dans le dépôt : elles s'affichent sans mise en page complète (preuve visuelle au chapitre 11). Ensuite, la page d'accueil ne référence aucune des 10 pages profondes (pays, services, portfolio) : ces pages sont orphelines dans la navigation principale, accessibles seulement depuis quelques liens de pied de page. Enfin, deux pages de test (test-carousel.html, test-mobile-menu.html) sont publiques et servies en production (HTTP 200), ce qui n'a pas lieu d'être sur un site institutionnel.

**Tableau 3 — Inventaire des 23 pages (dépôt HEAD vs production greenfad.tech, mesuré le 07/11/2026)**

| Page | Rôle | Dépôt | Production |
|---|---|---|---|
| index.html | Accueil : héros, 4 piliers, solutions, portfolio, équipe, témoignages, contact | OK | 200 (version antérieure au dépôt) |
| blog.html | Index du blog (6 articles en dur) | OK | 404 |
| blog-article.html | Gabarit d'article (?id=N, 3 articles en dur) | OK | 404 |
| careers.html | Carrières : 2 offres, formulaire de candidature avec CV | OK | 200 |
| faq.html | FAQ (5 entrées) | CSS/JS cassés | 200 |
| support-technique.html | Support (documentation liée mais absente) | CSS/JS cassés | 200 |
| cgv.html | Conditions générales de vente | OK | 200 |
| mentions-legales.html | Mentions légales GREEN FAD SARL | OK | 200 |
| politique-de-confidentialite.html | Politique de confidentialité | OK | 200 |
| 404.html | Page d'erreur | CSS/JS cassés | 200 |
| test-carousel.html | Page de test (carrousel) | Hors périmètre utile | 200 — à retirer |
| test-mobile-menu.html | Page de test (menu mobile) | Hors périmètre utile | 200 — à retirer |
| countries/mali.html | Implantation Mali (siège social) | CSS/JS cassés | 200 |
| countries/niger.html | Implantation Niger | CSS/JS cassés | 200 |
| countries/cote-ivoire.html | Implantation Côte d'Ivoire | CSS/JS cassés | 200 |
| countries/burkina-faso.html | Implantation Burkina Faso | CSS/JS cassés | 200 |
| countries/rdc-congo.html | Implantation RDC Congo | CSS/JS cassés | 200 |
| services/mobile-apps.html | Service applications mobiles | CSS/JS cassés | 200 |
| services/web-development.html | Service développement web | CSS/JS cassés | 200 |
| services/seo-marketing.html | Service SEO et marketing | CSS/JS cassés | 200 |
| services/print-communication.html | Service impression et communication | CSS/JS cassés + logo footer absent | 200 |
| projets/portfolio.html | Portfolio (6 réalisations illustrées) | CSS/JS cassés | 200 |
| admin/index.html | Back-office Decap CMS | Non fonctionnel (auth) | 404 |


### 4.1 Fonctionnalités réellement opérationnelles

Au sens strict — « ne jamais déclarer opérationnelle une fonctionnalité sur la seule base de son apparence » — seules les fonctionnalités statiques sont opérationnelles : navigation, pages de contenu, images, documents légaux, liens vers les réseaux sociaux officiels de l'entreprise (Facebook, YouTube, TikTok) et quelques comportements d'interface côté client (menu mobile, carrousel de logos, filtres de recherche blog). Aucune fonctionnalité serveur n'existe : rien n'est enregistré, envoyé ou administré. Le tableau 1 de la synthèse résume ce verdict fonction par fonction.


## 5. Backend, base de données et stockage : état réel


### 5.1 Backend Hono, API et validation serveur — absents

Aucun artefact backend n'existe dans le dépôt : ni package.json, ni wrangler.toml, ni répertoire de source TypeScript, ni worker, ni fichier de routes. Aucun endpoint applicatif n'est joignable sur le domaine : la route /api/auth attendue par la configuration Decap CMS renvoie 404 en production et 404 sur GitHub Pages. Il n'existe donc ni contrats API, ni schémas de validation, ni couche de cache applicative. L'ordre de mission impose le flux Database → Backend Hono → API → Cache/State → Frontend : aujourd'hui, aucun maillon de cette chaîne n'est posé, ce qui n'est pas un défaut de qualité mais un état initial — le projet est à la phase zéro de sa couche serveur.


### 5.2 Cloudflare D1 — absentes

Aucune base D1 n'est référencée : aucun répertoire migrations/, aucun fichier de schéma SQL, aucun binding d1_databases dans une configuration wrangler, et aucun outil de gestion de base dans le dépôt. Il n'existe par conséquent ni table à inventorier ni relation à documenter. Le chapitre 17 propose le modèle de données cible complet à créer en Phase 2.


### 5.3 Cloudflare R2 — absent ; inventaire des médias actuels

Aucun bucket R2 n'est référencé dans le dépôt (ni binding, ni script d'upload). Les médias vivent exclusivement dans assets/images : 94 fichiers (59 .jpg, 27 .png, 2 .jpeg, 5 .svg, 1 .ico) totalisant 33 Mo. L'optimisation est absente : 15 fichiers dépassent 750 Ko, le plus lourd étant hero-image-modern.png à 1 824 Ko, suivi des logos clients en PNG photographique (1 000 à 1 600 Ko chacun) et de services/mobile-development.jpg (1 657 Ko). Deux fichiers strictement identiques (hachage MD5 identique) doublonnent le poids. Aucun format nouvelle génération (WebP/AVIF), aucune déclinaison responsive (srcset), aucune image paresseuse au-delà de l'attribut loading="lazy" natif. La migration vers R2 avec variants compressés est intégrée au plan cible.

**Tableau 4 — Medias les plus lourds (extrait mesuré)**

| Fichier | Poids | Usage |
|---|---|---|
| assets/images/hero-image-modern.png | 1 824 Ko | Bannière (variante moderne) |
| assets/images/services/mobile-development.jpg | 1 657 Ko | Page service |
| assets/images/clients/client2.png | 1 600 Ko | Carrousel de logos clients |
| assets/images/clients/client1.png | 1 587 Ko | Carrousel de logos clients |
| assets/images/clients/client4.png | 1 393 Ko | Carrousel de logos clients |
| assets/images/clients/client3.png | 1 365 Ko | Carrousel de logos clients |
| assets/images/services/communication.jpg | 1 234 Ko | Page service |
| assets/images/portfolio/ferefad1.jpg | 1 072 Ko | Portfolio produit FERE FAD |
| assets/images/clients/client5.png | 1 016 Ko | Carrousel de logos clients |


## 6. Frontend : architecture réelle et défauts structurels


### 6.1 Deux systèmes de design mélangés

Le frontend mélange deux générations de conception. La première, complète et fonctionnelle, repose sur assets/css/styles.css (et ses compléments blog.css, enhancements.css, hero-enhancements.css, mobile-menu.css, services-enhanced.css) avec les scripts main.js, enhancements.js, mobile-menu.js, blog.js et blog-article.js : c'est le système de l'accueil, du blog et des pages légales. La seconde génération, incomplète, référence des fichiers qui n'ont jamais été livrés au dépôt : main-redesign.css, professional-design.min.css, main-redesign.js, footer-script.js, mobile-fixes.css, portfolio-page.css, portfolio-animations.js, styles.min.css. Les pages qui la mobilisent (5 pays, 4 services, portfolio, FAQ, support, 404) se rendent donc avec un squelette HTML partiellement stylé — le fichier 404.html lui-même en dépend.


### 6.2 Les 76 références cassées, preuve chiffrée

Sur 1 104 références locales vérifiées, 76 pointent vers des fichiers absents du dépôt : 26 scripts, 25 feuilles de style, 11 pages HTML liées, 10 manifests PWA et 4 images ou icônes. Ces références touchent 14 des 23 pages. Le graphique ci-dessous donne la répartition exacte ; le tableau 5 détaille les fichiers manquants et leur étendue. La référence documentation.html est particulièrement représentative : elle apparaît dans le pied de page de 11 pages profondes alors que la page n'existe nulle part.

![Preuve](audits/proofs-phase1-2026-11-07/figure-1-references-cassees.png)

*Figure 1 — Répartition des 76 références cassées mesurées sur les 23 pages HTML du dépôt*

**Tableau 5 — Fichiers référencés mais absents du dépôt (étendue)**

| Fichier manquant | Type | Pages concernées | Effet visible |
|---|---|---|---|
| assets/js/main-redesign.js | JS | 13 pages | Comportements de la 2e génération inactifs |
| assets/css/main-redesign.css | CSS | 13 pages | Mise en page dégradée des pages concernées |
| documentation.html | HTML | 11 liens | Liens morts depuis 11 pieds de page |
| /assets/images/site.webmanifest | PWA | 10 pages | Manifest manquant (installation PWA impossible) |
| assets/js/footer-script.js | JS | 6 pages | Comportements de pied de page inactifs |
| assets/css/professional-design.min.css | CSS | 6 pages | Système de design non livré |
| assets/css/mobile-fixes.css | CSS | 4 pages services | Corrections mobiles absentes |
| assets/css/portfolio-page.css | CSS | 1 page (portfolio) | Mise en page portfolio dégradée |
| assets/js/portfolio-animations.js | JS | 1 page (portfolio) | Animations portfolio absentes |
| assets/css/styles.min.css | CSS | 1 page (portfolio) | Styles minifiés non livrés |
| assets/images/testimonials/avatar-1/2/3.jpg | Images | Accueil | Avatars des 3 témoignages en 404 (les fichiers existent sous le nom avatar1.jpg…) |
| assets/images/greenfad-og-image.jpg | Image | Metas Open Graph de l'accueil | Partage social sans image |
| assets/images/blog/*.jpg (3) | Images | Données blog blog-loader.js | Visuels des articles absents |
| assets/images/greenfad-logo-footer1.svg | Image | Page service impression | Logo de pied de page manquant |


## 7. Blog : dysfonctionnements structurels

Le blog ajouté les 9 et 10 novembre 2025 est l'exemple le plus net de la règle « ne jamais créer une interface qui simule une fonctionnalité ». Il repose sur quatre sources de données indépendantes et divergentes, aucun mécanisme ne les reliant : (1) un tableau blogPosts en dur dans blog.html, six articles illustrés par deux images Unsplash réutilisées ; (2) un tableau blogPosts en dur dans blog-article.html, trois articles avec contenu HTML complet, sans rapport avec les six précédents ; (3) un script assets/js/blog/blog-loader.js qui contient une troisième liste de trois articles — jamais chargé par aucune page ; (4) trois fichiers Markdown dans _posts/. La sitemap annonce les trois slugs des fichiers Markdown ; les cartes du blog pointent vers blog-article.html?slug=… ; le gabarit d'article ne lit que le paramètre ?id= avec repli sur l'identifiant 1 ; le pied de page de l'accueil utilise encore une troisième forme (?post=). Résultat mesurable : quelle que soit la carte cliquée ou l'URL de la sitemap suivie, le visiteur aboutit systématiquement au même article (identifiant 1) — les titres annoncés par la sitemap ne sont jamais servis.

À cela s'ajoutent les images des articles du blog-loader et du sitemap, inexistantes (assets/images/blog/ n'existe pas), et le fait que blog.html et blog-article.html sont en 404 sur la production. La stratégie Decap CMS déclarée dans BLOG_INTEGRATION.md est cohérente en intention mais non fonctionnelle en pratique : le widget Netlify Identity ne fonctionne pas hors Netlify, et la configuration admin/config.yml attend un serveur OAuth à https://greenfad.tech/api/auth qui n'existe pas. Conclusion d'audit : la fonction blog doit être reconstruite sur la base de données cible avec un flux éditorial réel, plutôt que réparée sur ce socle.

**Tableau 6 — Les quatre sources de données du blog et leurs divergences**

| Source | Contenu | Images | Lien de sortie |
|---|---|---|---|
| blog.html (inline) | 6 articles, titres différents des autres sources | 2 photos Unsplash réutilisées | ?slug=… (non lu par le gabarit) |
| blog-article.html (inline) | 3 articles avec contenu HTML | Unsplash | Lit ?id= uniquement (repli id=1) |
| assets/js/blog/blog-loader.js | 3 articles (dont 2 identiques à _posts) | /assets/images/blog/*.jpg inexistantes | Jamais chargé par une page |
| _posts/*.md (3 fichiers) | 3 articles Markdown | front-matter image | Annoncés par sitemap.xml (?slug=…) |


## 8. État réel du Dashboard existant

Le « Dashboard » existant se limite à deux fichiers : admin/index.html, qui charge le widget Netlify Identity puis Decap CMS 3 depuis unpkg, et admin/config.yml, qui déclare un backend de type github sur le dépôt Green-fad/Greenfad avec base_url https://greenfad.tech et auth_endpoint api/auth. L'audit établit trois faits. Premièrement, cette configuration ne peut pas s'authentifier : Decap avec backend github exige un serveur OAuth (flux d'autorisation GitHub) ; le point de terminaison /api/auth n'existe ni dans le dépôt ni en ligne (404 mesuré), et le widget Netlify Identity n'a aucune instance Netlify derrière le domaine. Deuxièmement, le back-office n'est même pas déployé sur la production (404 sur /admin/ à greenfad.tech) : il n'est accessible que sur green-fad.github.io/Greenfad/admin/. Troisièmement, la collection déclarée ne couvre que le blog (5 champs d'article) : aucun module de pages, produits, services, pays, équipe, partenaires, documents ou menus n'est défini. L'objectif de l'ordre de mission — 23 modules administrables sans développeur — est donc à construire intégralement ; le chapitre 18 en propose l'architecture et le chapitre 20 le séquençage.

Un point de sécurité mérite d'être noté dès maintenant : le robots.txt du site interdit l'exploration de /admin/, mais la page reste publiable par URL directe sur GitHub Pages ; avant toute réutilisation de Decap ou d'un back-office maison, l'authentification doit être effective côté serveur et l'espace d'administration protégé ou exclu de toute zone publique.


## 9. Formulaires et fonctionnalités simulées

Trois formulaires sont exposés aux visiteurs et aucun ne transmet de données. Le formulaire de contact de l'accueil (action="#") est traité par FormHandler dans main.js : après validation des champs, le code exécute await new Promise(resolve => setTimeout(resolve, 1500)) puis affiche « Merci ! Votre message a été envoyé avec succès. » — aucun envoi réseau n'a lieu, aucun stockage n'existe. Le formulaire de candidature de careers.html (avec dépôt de CV, enctype multipart/form-data) réutilise la même classe et suit le même chemin simulé : les candidatures et les CV des visiteurs sont simplement perdus. La newsletter du blog affiche une alerte navigateur (« Merci de votre inscription ! Un email de confirmation a été envoyé à … ») sans la moindre inscription — le commentaire du code dit explicitement « Simulate newsletter subscription ».

L'impact business est direct et chiffrable qualitativement : chaque prospect qui remplit le formulaire croit avoir contacté l'entreprise ; sans réponse, la confiance se dégrade silencieusement. Ce point est le premier correctif prioritaire proposé (chapitre 19, actions immédiates), indépendamment de la refonte : soit un service de réception éprouvé configuré et testé, soit la mise en service du futur endpoint /api/v1/contacts dès la Phase 3. Le choix appartient à GREEN FAD ; l'état simulé ne doit en aucun cas subsister.

**Tableau 7 — Inventaire des formulaires et de leur réalité**

| Formulaire | Page | Comportement mesuré | Données reçues |
|---|---|---|---|
| Contact commercial | index.html | Délai artificiel de 1 500 ms puis message de succès (main.js, FormHandler.handleSubmit) | Aucune |
| Candidature + CV | careers.html | Même traitement simulé ; champ fichier non transmis | Aucune |
| Newsletter | blog.html | alert() navigateur, commentée « Simulate newsletter subscription » | Aucune |


## 10. SEO, redirections et découvrabilité


### 10.1 Fondations correctes sur les pages principales

L'accueil porte des métadonnées complètes et cohérentes : title et meta description orientés « Accélérateur de la Transformation Numérique et Écologique en Afrique », canonical absolu, Open Graph complet, Twitter Card summary_large_image et données structurées JSON-LD Organization correctement renseignées avec l'adresse (Missabougou, Bamako, Mali), le téléphone et les profils sociaux officiels. Le blog porte un JSON-LD de type Blog. Ces fondations sont à conserver et à étendre.


### 10.2 Défauts mesurés

- Sitemap en production réduite à 5 URL (accueil et ancres #services/#portfolio/#about/#contact) contre 9 dans le dépôt ; les ancres internes n'ont pas à figurer dans un sitemap.
- Aucune des 10 pages profondes (pays, services, portfolio) ni les pages légales, carrières, FAQ et support ne figure dans le sitemap — ni en production ni dans le dépôt.
- blog.html et blog-article.html en 404 sur la production alors qu'annoncées par le sitemap du dépôt : les moteurs qui respectent le sitemap en ligne ne voient aucun blog.
- Image Open Graph assets/images/greenfad-og-image.jpg référencée par l'accueil mais absente du dépôt : les partages sociaux sortent sans visuel.
- Le domaine GitHub Pages sert la totalité du site avec des canonical pointant greenfad.tech : double indexation potentielle du même contenu sous un second hôte.
- robots.txt interdit /components/ et /docs/ qui n'existent pas, et laisse /admin/ indexable par URL directe (GitHub Pages) ; aucune directive propre aux crawlers d'IA n'est posée (choix à trancher).
- Pages pays et services sans données structurées (aucun JSON-LD de type Service, Organization locale ou BreadcrumbList).
- Aucune hreflang ni déclinaison anglaise alors que le JSON-LD déclare availableLanguage fr et en : le multilingue annoncé n'existe pas.
- Pied de page © 2024 sur toutes les pages (année courante : 2026) — signal de négligence visible.
- Redirections : HTTP→HTTPS 301 correcte en production ; URLs sans extension servies (pretty URLs LiteSpeed) ; en revanche aucune redirection 301 de l'ancienne arborescence vers la cible n'est planifiable tant que la nouvelle architecture n'est pas arrêtée (chapitre 19).

Conclusion SEO : la découvrabilité actuelle repose presque exclusivement sur la page d'accueil. La refonte doit traiter le sitemap dynamique, les données structurées par type de contenu, la suppression propre du doublon GitHub Pages (retrait des workflows et du CNAME après bascule vers Cloudflare Pages), la migration des URL avec redirections 301 exhaustives et un maillage réel vers les pages pays et services.


## 11. Défauts UX/UI constatés

Les défauts ci-dessous sont documentés par rendu navigué du contenu du dépôt (identique à GitHub Pages HEAD) et vérifiés par lecture du code. La page d'accueil elle-même est correctement stylée et lisible, y compris en mobile (menu hamburger fonctionnel, hiérarchie claire) : les captures 2 et 5 le montrent. Les défauts sont donc surtout structurels et de cohérence, et touchent d'abord les pages profondes.

- 13 pages servies sans leur feuille de style principale (main-redesign.css absent) : mise en page cassée sur toutes les pages pays, services, le portfolio, la FAQ, le support et la page 404 (capture 3).
- Trois navigations différentes coexistent : accueil (« Accueil, Services, À propos, Équipe, Blog, Contact »), blog (« Accueil, Services, Projets, Blog, Contact »), pages profondes (« Accueil, Services, Portfolio, À propos, Contact ») — le visiteur perd les repères.
- Aucun lien de navigation vers les 10 pages profondes : pays, services détaillés et portfolio sont inaccessibles depuis le menu principal.
- Incohérences de contenus visibles : le héros annonce « 4 Pays d'Implantation » alors que 5 pages pays existent, et « 5 Solutions Propriétaires » alors que 6 produits sont listés (FAD CARD, NIAFAD, QRFAD, FERE FAD, SARAPAY, Carte Santé).
- Trois témoignages clients nommés avec avatars génériques (images en 404 au demeurant) : risque de crédibilité si ces personnes et sociétés ne sont pas réelles et consentantes — à confirmer par Greenfad-SARL.
- Pied de page « © 2024 » (l'audit est daté de 2026) ; réseaux sociaux du pied de page de l'accueil différents de ceux des pages profondes (Instagram et LinkedIn apparaissent seulement sur certaines pages).
- Deux pages de test publiques (test-carousel.html, test-mobile-menu.html) servies en production.
- Logos clients servis en PNG photographiques de 1 à 1,6 Mo pour des rendus de 100 px : lenteur de chargement mesurable sur mobile.
- Le logo GREEN FAD dans l'en-tête est de faible lisibilité à petite taille (texte « Green Fad Digital Solutions » sur fond clair), et deux variantes de logo coexistent (greenfad-logo-new.svg, greenfad-logo.svg) sans règle d'usage.

![Preuve](audits/proofs-phase1-2026-11-07/capture-2-accueil-desktop.png)

*Capture 2 — Accueil (rendu du dépôt) : design correct sur desktop, statistiques « 4 Pays / 5 Solutions / 100 % » à confirmer*

![Preuve](audits/proofs-phase1-2026-11-07/capture-3-page-pays-sans-css.png)

*Capture 3 — countries/mali.html rendue sans sa feuille de style principale (main-redesign.css absent) : page en production dans cet état*

![Preuve](audits/proofs-phase1-2026-11-07/capture-4-blog-cartes.png)

*Capture 4 — blog.html : première carte sans image, sources de données multiples, troisième navigation différente*

![Preuve](audits/proofs-phase1-2026-11-07/capture-5-accueil-mobile.png)

*Capture 5 — Accueil en 390×844 : rendu mobile correct (menu hamburger, hiérarchie conservée)*


## 12. Analyse de sécurité

L'état de sécurité actuel est celui d'un site purement public, sans surface privée : c'est paradoxalement ce qui limite l'exposition. Le balayage du dépôt par motifs (mots de passe, clés d'API, jetons) n'a révélé aucun secret. Les en-têtes de sécurité définis dans .htaccess sont bien appliqués par LiteSpeed en production (CSP avec sources restreintes, X-Content-Type-Options, X-Frame-Options SAMEORIGIN, Referrer-Policy) et la redirection HTTP→HTTPS est effective (301 mesuré). Le HTTPS est assuré côté Cloudflare.

- Aucune authentification ni gestion d'utilisateurs : la future administration doit être construite avec RBAC serveur (chapitre 16) et sessions protégées — rien à réparer, tout à créer.
- Le back-office Decap CMS ne doit pas être déployé en l'état : son flux d'authentification est cassé (/api/auth 404) et il s'exécute côté client sur une page publique ; toute réutilisation exige un serveur OAuth dédié ou un remplacement par l'administration cible.
- Le site expose deux pages de test ; à retirer de la zone publique.
- La politique CSP inclut script-src 'unsafe-inline' (nécessaire au code en ligne actuel) : la refonte doit permettre de s'en affranchir.
- Aucune journalisation d'actions administratives n'existe ; l'audit_log du modèle cible y répond.
- Aucun secret Cloudflare ne doit jamais être embarqué côté frontend : le modèle Workers/Hono avec bindings secrets répond à cette exigence dès la Phase 2.
- La protection bot est mal calibrée : challenge reCAPTCHA Enterprise non solvable pour certains visiteurs (chapitre 3.4) — sécurité contre-productive à corriger immédiatement.


## 13. Bilan : à conserver, à corriger, à remplacer, absents

**Tableau 8 — Éléments à conserver**

| Élément | Localisation | Raison |
|---|---|---|
| Identité institutionnelle GREEN FAD SARL | index.html, mentions-legales.html | Contenus réels et cohérents |
| Coordonnées de contact affichées | index.html, JSON-LD | Adresse Missabougou (Bamako), téléphone, e-mail, réseaux sociaux officiels — à revalider par l'entreprise |
| Données structurées Organization | index.html | Base SEO solide à étendre |
| Contenu des 5 pages pays et 4 pages services | countries/, services/ | Textes et visuels réutilisables dans le nouveau modèle de données |
| Portfolio de 6 réalisations | projets/portfolio.html | Base du module Projets cible |
| Pages légales complètes | cgv, mentions, confidentialité | Conformes à la structure attendue |
| Images de marque et logo officiels | assets/images/*.svg | À normaliser mais à conserver |
| Pages d'équipe et de carrières (textes) | index.html #equipe, careers.html | Contenus à revalider puis migrer |

**Tableau 9 — Données publiées à confirmer par Greenfad-SARL avant migration**

| Donnée publiée | Où | Question à trancher |
|---|---|---|
| Témoignages « Amadou Diallo — TechStart Mali », « Fatou Koné — Innov'Apps », « Ibrahim Traoré — Commerce Plus » | index.html | Personnes et sociétés réelles et consentantes ? Sinon suppression immédiate (faux témoignages interdits par l'ordre de mission) |
| « 4 Pays d'Implantation » / « 5 Solutions Propriétaires » / « 15+ Experts » / « 100 % Satisfaction » / « 24/7 » | index.html (héros et équipe) | Chiffres officiels à valider ou retirer ; incohérence avec 5 pages pays et 6 produits listés |
| 6 produits : FAD CARD, NIAFAD, QRFAD, FERE FAD, SARAPAY, Carte Santé | index.html #solutions | Statut réel de chaque produit (en production, en préparation, arrêté) |
| 2 offres d'emploi ouvertes (Développeur Full-Stack Senior, Designer UX/UI) | careers.html | Offres réellement ouvertes ? |
| Implantations : Mali, Niger, Côte d'Ivoire, Burkina Faso, RDC | countries/ | Liste officielle des implantations et bureaux (adresses, contacts) |
| Téléphone +223 72 19 46 54 / contact@greenfad.tech | index.html, mentions | Canaux officiels actuels de réception |

**Tableau 10 — Éléments à corriger (réparation possible sur la base actuelle)**

| Élément | Correctif recommandé |
|---|---|
| 13 pages sans CSS/JS principaux | Livrer ou retirer les 8 références aux fichiers manquants ; à terme remplacé par le design system unique |
| Avatars témoignages (nommage avatar-1.jpg vs avatar1.jpg) | Renommer les fichiers ou corriger les références |
| og:image absente | Produire et livrer greenfad-og-image.jpg (1200×630) |
| Sitemap dégradé | Regénérer sans ancres, toutes pages incluses, via générateur automatisé |
| Footer © 2024 | Génération dynamique de l'année |
| Pages test publiques | Retrait du déploiement |
| documentation.html liée 11 fois | Créer la page ou retirer les liens |
| site.webmanifest manquant | Livrer un manifest complet ou retirer les références |

**Tableau 11 — Éléments à remplacer (défaillants par conception)**

| Élément | Remplacement cible |
|---|---|
| Blog à 4 sources de données divergentes | Module Articles sur D1 avec flux éditorial brouillon → validation → publication → archivage |
| Formulaires simulés (contact, carrières, newsletter) | Endpoints API réels + enregistrement D1 + notification e-mail + statuts de traitement |
| Back-office Decap CMS | Dashboard centralisé conforme aux 23 modules de l'ordre de mission |
| Double déploiement GitHub Pages (2 workflows concurrents) | Chaîne unique : Cloudflare Pages (front) + Workers/Hono (API), avec environnement de préproduction |
| Publication Hostinger manuelle hors dépôt | Pipeline automatisée testée, avec retour arrière |

**Tableau 12 — Fonctionnalités manquantes (exigées par l'ordre de mission)**

| Domaine | Ce qui manque intégralement |
|---|---|
| Backend / API | Backend Hono, routes, validation serveur, contrats |
| Base de données | Toutes les tables métier, migrations, relations |
| Stockage médias | Bucket R2, upload sécurisé, variants d'images |
| Dashboard 23 modules | Vue générale, pages, Page Builder, produits, services, blog, médias, documents, pays, portfolio, identité, équipe, partenaires, contacts, carrières, presse, newsletter, FAQ, menus, SEO, utilisateurs, paramètres, journal |
| Statuts éditoriaux | Brouillon / en attente de validation / publié / dépublié / archivé + publication programmée + dates éditoriales distinctes des dates techniques + historique de versions |
| RBAC | 8 rôles minimum avec permissions contrôlées côté serveur |
| Multilingue | Aucune déclinaison malgré la déclaration fr/en du JSON-LD |
| Recherche | Aucune recherche site (la recherche blog est un filtre client local) |


## 14. Architecture cible proposée

L'architecture cible reprend intégralement la stack de référence imposée : Cloudflare Pages pour le frontend, backend Hono exécuté sur Cloudflare Workers, base Cloudflare D1, stockage Cloudflare R2, TypeScript partout, validation par schémas côté serveur, cache Cloudflare avec stratégie applicative, et pipeline CI/CD automatisée. Le flux obligatoire Database → Backend Hono → API → Cache/State → Frontend → Interface est respecté : le Dashboard consomme exactement les mêmes API et règles métier que le site public, et aucune donnée métier n'est codée en dur dans le frontend.

**Tableau 13 — Architecture cible par couche**

| Couche | Technologie | Rôle et règles |
|---|---|---|
| Frontend public | Cloudflare Pages (SSR/hybride ou statique généré depuis l'API) | Rendu des pages publiques depuis l'API uniquement ; aucune donnée métier en dur ; cache CDN + revalidation |
| API | Hono sur Cloudflare Workers (TypeScript) | Contrats REST /api/v1 ; validation zod systématique ; gestion des erreurs normalisée ; CORS restreint au domaine |
| Base de données | Cloudflare D1 (SQLite) avec migrations versionnées | Source unique de vérité ; aucune table redondante sans justification écrite |
| Médias | Cloudflare R2 | Upload via URL signée côté serveur ; variants WebP/AVIF ; clé de médiation par media_assets |
| Authentification | Sessions signées (JWT courte durée + rotation) ou cookie httpOnly ; RBAC serveur | 8 rôles minimum ; permissions vérifiées sur chaque route ; journalisation des actions sensibles |
| Dashboard | Application séparée sur le même domaine protégé (/dashboard), même API | 23 modules ; statuts éditoriaux ; prévisualisation ; versions et restauration |
| Cache/State | Cache Cloudflare (réponses API GET) + état client minimal | Purge par événement de publication ; aucune donnée métier persistée côté client |
| CI/CD | GitHub Actions : lint, tests, build, preview sur PR, déploiement main validé | Environnements : preview → production ; retour arrière par réexécution du build N−1 |

Décision à arbitrer en Phase 2 : le frontend public sera servi par Cloudflare Pages avec le domaine greenfad.tech (Cloudflare gère déjà le DNS, ce qui simplifie la bascule sans temps d'indisponibilité), tandis que l'API est exposée sous /api/* via le même domaine (routes Workers). L'hébergement Hostinger actuel est conservé jusqu'à la validation de la Phase 4, puis retiré après vérification complète — conformément à la règle « aucune modification destructive de production pendant la première phase ».


## 15. Modèle de données cible (Cloudflare D1)

Le modèle ci-dessous couvre les 23 modules du Dashboard et les statuts éditoriaux exigés. Il distingue systématiquement la date éditoriale (editorial_date, indépendante) de la date technique d'enregistrement (created_at) : un article historique peut ainsi être publié avec sa véritable date. Toutes les tables portent id (clé primaire), created_at, updated_at ; les champs de statut suivent l'énumération brouillon / en_attente / publié / dépublié / archivé. Les contenus riches sont stockés en JSON structuré (blocs) pour alimenter le Page Builder sans schéma fragile.

**Tableau 14 — Modèle de données proposé (28 tables, groupées par domaine)**

| Domaine | Table | Rôle et champs clés |
|---|---|---|
| Identité & accès | users | E-mail, mot de passe haché (argon2), nom, role_id, statut actif/inactif |
|  | roles / permissions / role_permissions | 8 rôles minimum ; permissions par code ; jointure n-n contrôlée serveur |
|  | audit_log | user_id, action, entity, entity_id, payload_json, ip, created_at — écriture pour toute action sensible |
| Site | site_settings | Paramètres généraux clé/valeur (nom, logo, année légale, réseaux officiels, e-mails de réception) |
| Pages | pages | slug, titre, langue, statut, published_at, seo_id — la page d'accueil est une page ordinaire (slug « accueil ») |
|  | page_sections | page_id, position, section_type, variant, content_json, visible — cœur du Page Builder |
|  | page_versions | page_id, version_no, snapshot_json, author_id, note — restauration d'ancienne version |
| Offres | products | slug, nom, accroche, description, catégorie, ordre, statut |
|  | services | slug, nom, résumé, description, icône, ordre, statut |
|  | projects | slug, titre, secteur, country_id, résumé, description, cover_media_id, date, ordre, statut |
| Blog & presse | article_categories / tags / article_tags | Catégorisation et étiquetage n-n |
|  | articles | slug, titre, extrait, corps (blocs JSON), category_id, cover_media_id, statut, editorial_date, published_at, scheduled_at, author_user_id, seo_id, langue |
|  | article_versions | Même mécanique de versions que les pages |
|  | press_releases | Communiqués et archives historiques (editorial_date libre) |
| Médias | media_assets | r2_key, mime, dimensions, poids, alt, caption, uploaded_by — pivot unique des médias |
|  | documents | PDF institutionnels/commerciaux ; visibilité public/privé ; r2_key |
| Implantations | countries | code, nom, drapeau_media_id, introduction, ordre, statut |
|  | offices | country_id, ville, adresse, téléphone, e-mail, is_hq, horaires |
| Entreprise | team_members | nom, fonction, biographie, photo_media_id, catégorie (direction/équipe), ordre, statut |
|  | partners | nom, logo_media_id, url, description, ordre, statut |
|  | faqs | question, réponse, catégorie, ordre, statut |
| Commercial | job_offers | slug, titre, département, lieu, type, description, exigences, dates d'ouverture/clôture, statut |
|  | applications | job_offer_id, nom, e-mail, téléphone, cv_media_id, message, statut de traitement |
|  | contacts | Prospects : nom, e-mail, téléphone, objet, message, source, statut (nouveau/en cours/traité), assigné à |
|  | newsletter_subscribers | E-mail, statut, source, confirmed_at, unsubscribed_at (double opt-in) |
| Navigation & SEO | menus / menu_items | Menu administrable : libellé, type de cible (page/produit/URL), parent, position, visible |
|  | seo_meta | entity_type + entity_id, title, description, og_image_media_id, canonical, robots, JSON-LD |
|  | redirects | from_path, to_path, code 301/302, actif — pilote les redirections de migration |

*Note : la table testimonials n'est pas prévue — elle ne sera créée que si GREEN FAD fournit des témoignages authentiques et consentants (règle « pas de faux témoignages »).*


## 16. Contrats API proposés (backend Hono)

Les contrats suivent une convention REST cohérente : préfixe /api/v1, JSON, authentification par jeton de session pour les routes d'administration, validation zod de tout corps et de tout paramètre, réponses d'erreur normalisées { error: { code, message, details } }, et pagination standard (limit/cursor). Les routes d'administration exigent un rôle portant la permission cible ; chaque mutation sensible écrit dans audit_log. Les endpoints publics sont en cache CDN avec purge par événement de publication.

**Tableau 15 — Contrats API cibles (vue d'ensemble)**

| Groupe | Endpoints | Accès |
|---|---|---|
| Authentification | POST /auth/login, POST /auth/logout, GET /auth/me | Public (login), session |
| Paramètres | GET/PATCH /settings | Admin |
| Pages & Page Builder | CRUD /pages ; POST /pages/{id}/sections (ajout, réordonnancement, duplication, masquage) ; POST /pages/{id}/publish ; POST /pages/{id}/revert/{version} ; GET /pages/{id}/preview | Éditorial + Admin |
| Produits / Services | CRUD /products, /services (+ réordonnancement) | Gestionnaire produits / services |
| Blog & presse | CRUD /articles, /press (+ publish, schedule, versions) ; CRUD /article-categories, /tags | Éditorial |
| Médias & documents | POST /media/uploads (URL signée R2), GET /media, PATCH /media/{id}, DELETE /media/{id} ; CRUD /documents | Médias |
| Implantations | CRUD /countries, /offices | Admin |
| Entreprise | CRUD /team, /partners, /faqs | Admin / Éditorial |
| Portfolio | CRUD /projects | Éditorial |
| Carrières | CRUD /jobs ; GET /jobs/{id}/applications ; PATCH /applications/{id} | Commercial |
| Prospects | POST /contacts (public) ; GET /contacts, PATCH /contacts/{id} (statut, assignation) | Commercial |
| Newsletter | POST /newsletter/subscribe (public, double opt-in) ; GET /newsletter | Éditorial |
| Navigation & SEO | CRUD /menus, /menu-items, /seo, /redirects | Admin |
| Utilisateurs & audit | CRUD /users (rôles, statut) ; GET /audit (filtres) | Super administrateur |
| Lecture publique | GET /public/page/{slug}, /public/articles, /public/articles/{slug}, /public/products, /public/services, /public/projects, /public/countries, /public/settings | Public (cache) |

**Tableau 16 — Matrice RBAC proposée (8 rôles minimum)**

| Rôle | Lecture Dashboard | Édition contenus | Publication | Utilisateurs & paramètres | Audit |
|---|---|---|---|---|---|
| Super administrateur | Oui | Oui | Oui | Oui | Oui |
| Administrateur | Oui | Oui | Oui | Limité | Oui |
| Responsable éditorial | Oui | Oui | Oui (contenus éditoriaux) | Non | Non |
| Gestionnaire produits | Oui | Produits | Produits | Non | Non |
| Gestionnaire services | Oui | Services | Services | Non | Non |
| Responsable médias | Oui | Médias & documents | Non | Non | Non |
| Responsable commercial | Oui | Contacts, candidatures | Non | Non | Non |
| Lecteur / auditeur | Oui | Non | Non | Non | Oui |


## 17. Plan de migration et de préservation

Conformément au chapitre 9 de l'ordre de mission, aucune modification n'est engagée avant l'inventaire et la sauvegarde. La séquence ci-dessous intègre les sept phases imposées et s'arrête après chaque phase majeure pour validation du CTO.


### 17.1 Sauvegarde préalable et procédure de retour arrière

- Sauvegarde complète de l'hébergement Hostinger (fichiers FTP + configuration hPanel) et de la zone DNS Cloudflare (export), archivée hors production.
- Copie du dépôt GitHub avec étiquette d'état (tag pre-refonte-2026-11) : tout l'historique reste intact, aucune suppression de branche.
- Retour arrière à tout moment : la production Hostinger reste la cible active jusqu'à la bascule finale ; la bascule DNS vers Cloudflare Pages est réversible (TTL réduit au préalable) ; les médias R2 ne sont jamais supprimés (double écriture pendant la transition).
- Aucune suppression de table, média ou fonctionnalité sans justification écrite et validation.


### 17.2 Séquence en sept phases

**Tableau 17 — Séquencement conforme à l'ordre de mission**

| Phase | Objectif | Livrables majeurs | Critères de validation |
|---|---|---|---|
| 1 — Audit (ce rapport) | Diagnostic vérifiable | Rapport d'audit, inventaires, architecture cible, plan | Validation CTO du présent rapport |
| 2 — Architecture, données, contrats | Poser la source de vérité | Schéma D1 versionné (migrations), contrats OpenAPI/zod, conventions d'erreurs et de cache, environnement preview | Migrations exécutables de zéro ; contrats revus ; projet Pages/Workers initialisé |
| 3 — Backend, CMS, Dashboard | Créer l'administration | API /api/v1 opérationnelle, RBAC serveur, Dashboard multi-modules, médias R2, journal d'audit | CRUD testés par API sur tous les modules ; permissions refusées/mises à l'épreuve ; aucun contenu fictif |
| 4 — Page Builder & site public | Reconstruire l'expérience | Page Builder (sections, variantes, prévisualisation desktop/tablette/mobile, versions), site public rendu depuis l'API, accueil administrable | Page d'accueil construite et publiée depuis le Dashboard sans développeur ; aucune section vide ni carte fictive ; mobile irréprochable |
| 5 — Intégrations, recherche, documents, SEO, multilingue | Étendre | Recherche site, documents privés/partagés, SEO dynamique (sitemap, JSON-LD par contenu), FR/EN | Sitemap générée à chaque publication ; recherche indexée ; bascule de langue complète |
| 6 — Migration & référencement | Transférer les contenus | Reprise des contenus validés (pays, services, produits, articles historiques avec dates réelles), redirections 301 exhaustives, retrait du doublon GitHub Pages | Inventaire d'entrée/sortie à 100 % ; 301 testées ; Google Search Console réassorti |
| 7 — Tests, sécurité, validation production | Durcir | Suite de tests (unitaires, contrats, E2E critiques), revue sécurité (permissions, secrets, en-têtes), plan de sauvegarde D1/R2 récurrent, bascule finale et retrait Hostinger | Zéro test rouge ; permissions vérifiées ; bascule DNS validée et réversible ; monitoring et sauvegardes actifs |


### 17.3 Actions immédiates recommandées (indépendantes de la refonte)

Quatre actions correctives, à valider par le CTO avant exécution, améliorent l'état présent sans engager la refonte : (1) corriger la configuration de protection bot afin de supprimer l'interstitiel reCAPTCHA en dépassement de quota — action sur le compte Cloudflare/Hostinger par le titulaire ; (2) mettre fin au double déploiement GitHub Pages (désactivation des deux workflows et du CNAME) pour éliminer le doublon d'indexation — réversible à tout moment ; (3) sortir les deux pages de test de la zone publique ; (4) décider du traitement des formulaires simulés (service de réception réel ou affichage d'un e-mail direct le temps de la construction) — décision business, la perte de prospects est déjà en cours. Aucune de ces actions ne supprime de contenu ni ne touche aux données.


## 18. Risques et dépendances

**Tableau 18 — Registre des risques**

| N° | Risque | Gravité | Traitement proposé |
|---|---|---|---|
| R1 | Production Hostinger désynchronisée du dépôt : le site réel n'est pas la source versionnée ; chaque correction manuelle crée une divergence | Critique | Geler les déploiements manuels ; construire la pipeline Phase 2 ; ne plus modifier hPanel hors dépôt |
| R2 | Interstitiel reCAPTCHA Enterprise en dépassement de quota : visiteurs bloqués sur l'accueil | Critique | Action immédiate par le titulaire du compte (chap. 17.3) |
| R3 | Formulaires simulés : prospects et candidatures perdus silencieusement | Critique | Décision immédiate (chap. 17.3) puis endpoint réel Phase 3 |
| R4 | Blog cassé et servi en 404 : signal de qualité négatif pour les moteurs | Élevé | Ne pas réparer en surface ; reconstruit en Phase 3/4 sur D1 |
| R5 | Doublon d'indexation green-fad.github.io (canonical greenfad.tech) | Élevé | Retrait des workflows/CNAME dès validation |
| R6 | Contenus non vérifiés publiés au nom de l'entreprise (témoignages, chiffres) | Élevé | Tableau 9 transmis à GREEN FAD pour arbitrage avant toute migration |
| R7 | Images non optimisées (33 Mo) : temps de chargement mobile pénalisant | Moyen | Migration R2 avec compression et variants (Phase 3/6) |
| R8 | Déploiements sans test ni retour arrière documentés | Élevé | Pipeline avec preview, tests et réversibilité (Phase 2) |
| R9 | Dépendances à des comptes non documentés (Hostinger, DNS Cloudflare, app OAuth GitHub future) | Moyen | Recenser les accès titulaires ; documentation d'exploitation en Phase 2 |
| R10 | Connaissance détenue par des intervenants multiples sans documentation | Moyen | Le présent rapport et la documentation d'architecture constituent la référence |

Dépendances externes à sécuriser avant la Phase 2 : accès titulaire à l'hébergement Hostinger et à la zone DNS Cloudflare ; décision sur le domaine définitif de l'administration ; fourniture des contenus réels (tableau 9) ; création de l'application OAuth GitHub si une étape d'authentification tiers reste nécessaire pendant la transition ; approbation budgétaire des ressources Cloudflare (D1, R2, Workers) selon l'usage réel.


## 19. Découpage des missions entre agents

Le découpage proposé répartit la transformation en six missions d'agents séquencées selon les phases. Chaque fiche suit le format imposé (mission, responsabilité, travaux, périmètres fichiers/tables/endpoints, tests, résultats, risques, statut, éléments non terminés, prochaine étape). L'agent A1 est le seul statué à ce jour.

**Tableau 19 — Agent A1 : Audit et diagnostic — statut TERMINÉ**

| Rubrique | Contenu |
|---|---|
| Mission | Phase 1 — audit complet de l'écosystème greenfad.tech avant tout développement |
| Responsabilité | Architecture, diagnostic, propositions |
| Travaux effectués | Clonage du dépôt ; analyse des 23 pages HTML ; vérification de 1 104 références locales ; sonde HTTP production + GitHub Pages ; rendu navigué (5 captures) ; balayage secrets ; revue des 2 workflows CI ; analyse du blog, du CMS et des formulaires |
| Fonctionnalités examinées | Navigation, blog, formulaires, carrousel, menu mobile, back-office Decap, SEO, redirections, sécurité HTTP |
| Fichiers concernés | index.html, blog.html, blog-article.html, careers.html, faq.html, support-technique.html, 404.html, countries/*.html, services/*.html, projets/portfolio.html, admin/{index.html,config.yml}, assets/js/*, assets/css/*, .htaccess, robots.txt, sitemap.xml, .github/workflows/* |
| Tables concernées | Aucune (D1 absente) — modèle cible proposé au chapitre 15 |
| Endpoints concernés | greenfad.tech : /, /blog.html, /blog-article.html, /admin/, /api/auth, /countries/mali.html, /assets/css/main-redesign.css, /sitemap.xml, /faq, /blog, /404.html ; green-fad.github.io/Greenfad/ (mêmes chemins + /_posts/…) |
| Tests effectués | Codes HTTP (curl et navigateur), hachages MD5 de contenu, résolution statique de références, rendu 1366×900 et 390×844, balayage de secrets |
| Résultats réels | 76 références cassées sur 14 pages ; production en retard sur HEAD ; blog 404 en production ; formulaires simulés ; back-office non authentifiable ; sitemap dégradé ; og:image 404 ; reCAPTCHA en dépassement de quota |
| Erreurs restantes | Aucune erreur d'exécution de l'audit ; vérifications DNS complètes (enregistrements MX/SPF/DKIM) non incluses — hors périmètre technique immédiat |
| Risques identifiés | Registre du chapitre 18 (10 risques) |
| Commits | Rapport et preuves archivés dans le dépôt Green-fad/Greenfad, dossier audits/ (voir commit référencé en page de garde) |
| Captures et URLs | 5 captures d'écran (annexe B) ; toutes URLs mesurées listées en annexe A |
| Éléments non terminés | Aucun développement engagé (conforme à l'ordre de mission) |
| Prochaine étape | Validation du rapport par le CTO puis lancement de la mission A2 (Phase 2) |
| Statut | TERMINÉ |

**Tableau 20 — Missions A2 à A6 : périmètres planifiés — statut PLANIFIÉ**

| Mission | Phases | Responsabilité et livrables | Périmètres clés |
|---|---|---|---|
| A2 — Fondations & DevOps | 2 | Projet Cloudflare (Pages, Workers, D1, R2), migrations versionnées, environnement preview, pipeline CI/CD avec retour arrière, secrets et bindings | wrangler.toml, migrations D1, workflows GitHub Actions, domaines et cache |
| A3 — Backend & API | 3 | Contrats /api/v1, validation zod, RBAC serveur, journal d'audit, uploads R2, notifications | src/api/**, tables du chapitre 15, endpoints du tableau 15 |
| A4 — Dashboard & Page Builder | 3-4 | 23 modules administrables, statuts éditoriaux, versions et prévisualisation, Page Builder de l'accueil | Application /dashboard, /pages/page_sections, intégrations API |
| A5 — Frontend public | 4 | Design system unique, site public rendu depuis l'API, navigation unifiée, mobile irréprochable, performance | Front Pages, design tokens, rendu des sections, images R2 |
| A6 — Contenus, migration & QA | 5-7 | Reprise des contenus validés, redirections, SEO dynamique, multilingue, suite de tests, revue sécurité, bascule finale | Migration des contenus (tableau 9), redirects, sitemap, tests E2E |

*Règle d'interface entre agents : A3 livre les contrats avant que A4 n'attache le Dashboard ; A5 ne commence le rendu public qu'après que A4 a publié une page de démonstration complète depuis le Dashboard ; A6 n'importe aucun contenu non validé au tableau 9.*


## 20. Estimations et critères de validation

**Tableau 21 — Estimations indicatives par mission (jours-personne)**

| Mission | Fourchette indicative | Hypothèses principales |
|---|---|---|
| A2 — Fondations & DevOps (Phase 2) | 5 à 8 j | Comptes Cloudflare existants ; schéma D1 figé en une itération |
| A3 — Backend & API (Phase 3) | 12 à 18 j | 28 tables ; ~15 groupes d'endpoints ; RBAC 8 rôles ; uploads R2 |
| A4 — Dashboard & Page Builder (Phases 3-4) | 15 à 22 j | 23 modules ; Page Builder avec prévisualisation et versions ; aucune donnée fictive |
| A5 — Frontend public (Phase 4) | 10 à 15 j | Design system unique ; ~15 gabarits de sections ; performance mobile soignée |
| A6 — Contenus, migration & QA (Phases 5-7) | 10 à 15 j | Contenus fournis par GREEN FAD ; multilingue FR/EN ; redirections complètes |
| Total indicatif | 52 à 78 j | Chevauchements partiels entre missions ; à affiner après validation de la Phase 2 |

Ces fourchettes sont des ordres de grandeur de planification, pas des engagements : elles supposent la disponibilité des accès et des contenus (tableau 9) et la validation de l'architecture en Phase 2. Chaque phase est clôturée par les critères du tableau 17 ; une phase ne démarre qu'après validation écrite de la précédente, conformément à l'ordre de mission. Critères transverses retenus : aucune donnée fictive en production, aucune fonctionnalité apparente sans fonction réelle, toute mutation sensible journalisée, tout déploiement réversible, expérience mobile vérifiée à chaque livraison.


## 21. Annexe A — Preuves techniques


### 21.1 URLs mesurées le 07/11/2026

**Tableau 22 — Sondes HTTP production (greenfad.tech) et GitHub Pages**

| URL | Code | Observation |
|---|---|---|
| https://greenfad.tech/ | 200 | En-têtes : server cloudflare, platform hostinger, LiteSpeed ; CSP et en-têtes de sécurité actifs ; Last-Modified 10/11/2025 06:37 UTC ; MD5 ≠ dépôt |
| https://greenfad.tech/blog.html | 404 | Page de blog absente de la production |
| https://greenfad.tech/blog-article.html | 404 | Gabarit d'article absent de la production |
| https://greenfad.tech/admin/ | 404 | Back-office absent de la production |
| https://greenfad.tech/api/auth | 404 | Endpoint OAuth attendu par Decap CMS inexistant |
| https://greenfad.tech/documentation.html | 404 | Page liée 11 fois, nulle part |
| https://greenfad.tech/assets/css/main-redesign.css | 404 | Feuille de style principale de 13 pages absente |
| https://greenfad.tech/countries/mali.html | 200 | Servie sans son CSS principal (capture 3) |
| https://greenfad.tech/sitemap.xml | 200 | 5 URL seulement (accueil + 4 ancres) |
| https://greenfad.tech/faq (sans extension) | 200 | Pretty URLs LiteSpeed actives |
| https://greenfad.tech/test-carousel.html | 200 | Page de test exposée en production |
| http://greenfad.tech/ → HTTPS | 301 | Redirection forcée correcte |
| https://green-fad.github.io/Greenfad/ | 200 | Site complet servi sur l'hôte GitHub (server GitHub.com) |
| https://green-fad.github.io/Greenfad/admin/ | 200 | Back-office accessible uniquement ici |
| https://green-fad.github.io/Greenfad/_posts/2025-11-10-bienvenue-sur-le-blog-greenfad.md | 200 | Preuve que le workflow static.yml est actif (fichier brut servi) |
| https://green-fad.github.io/Greenfad/assets/images/blog/blog-hero.jpg | 404 | Image d'article référencée, absente |


### 21.2 Extraits de code probants

Simulation d'envoi du formulaire de contact — assets/js/main.js, FormHandler.handleSubmit : le code attend 1,5 seconde puis affiche le succès ; aucun envoi réseau n'existe.

```
async handleSubmit(e) {
  // ...validation des champs...
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.showSuccessMessage();   // « Votre message a été envoyé avec succès. »
    this.form.reset();
  } catch (error) { this.showErrorMessage(); }
```

Authentification du back-office attendue sur un endpoint inexistant — admin/config.yml : le CMS git-based exige un serveur OAuth ; /api/auth n'existe ni dans le dépôt ni en ligne.

```
backend:
  name: github
  repo: Green-fad/Greenfad
  branch: main
  auth_endpoint: api/auth
  base_url: https://greenfad.tech
```

Divergence de paramètres du blog — assets/js/blog-article.js lit ?id= avec repli sur 1, tandis que les cartes et la sitemap pointent ?slug= : toute URL annoncée aboutit à l'article n° 1.

```
const articleId = parseInt(params.get('id')) || 1;
const article = blogPosts.find(post => post.id === articleId);
```

Deux workflows concurrents sur le même déclencheur — .github/workflows/ : jekyll-gh-pages.yml (build Jekyll) et static.yml (publication statique) s'exécutent tous deux sur push vers main vers le même environnement github-pages.


### 21.3 Reproductibilité

Les preuves sont reproductibles : le comptage de références est réexécuté par le script d'audit livré (audit_greenfad_links.py), les sondes HTTP sont des commandes curl standard, et les captures proviennent d'un navigateur automatisé à résolutions normalisées (1366×900 et 390×844). Les hachages MD5 cités ont été calculés sur les corps HTML sans compression transport.


## 22. Annexe B — Captures d'écran

Les captures ci-dessous complètent celles des chapitres 3 et 11. Elles ont été produites le 7 novembre 2026 à résolutions normalisées et sont archivées dans le dépôt (audits/proofs-phase1-2026-11-07/) avec les preuves JSON/texte des sondes.

- Capture 1 (chapitre 3.4) — accueil production bloqué par l'interstitiel reCAPTCHA Enterprise en dépassement de quota.
- Capture 2 (chapitre 11) — accueil desktop : design correct, chiffres à confirmer.
- Capture 3 (chapitre 11) — page pays servie sans feuille de style principale (état production).
- Capture 4 (chapitre 11) — blog : première carte sans image, navigation divergente.
- Capture 5 (chapitre 11) — accueil mobile 390×844 : rendu correct.

Fin de la Phase 1. Le présent rapport n'engage aucun développement ; la Phase 2 (architecture, données et contrats API) ne démarrera qu'après validation écrite du CTO.
