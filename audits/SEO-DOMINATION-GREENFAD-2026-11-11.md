# DOMINATION SEO « GREENFAD » SUR GOOGLE — PLAN D'ACTION
**Date : 11/11/2026 — CTO Green FAD SARL. Objectif fondateur : lorsque quelqu'un cherche « greenfad » ou « green fad » sur Google, plusieurs pages complètes de résultats doivent être 100 % GREEN FAD — aucun concurrent homonyme.**

---

## 1. État des lieux réel de la SERP (relevé du 11/11/2026)

La recherche « greenfad » renvoie aujourd'hui, dans cet ordre approximatif :

| Position approx. | Résultat | Nature |
|---|---|---|
| 1-2 | **greenoleo.com** — GreenFad® 2207, 2137, 2198, 2220, 2100 (5+ URLs) | ⚠️ CONCURRENT le plus nuisible : société chimique italienne d'esters pour lubrifiants, marque déposée « GreenFad® », domaine très autoritaire |
| 3-4 | **greenfad.tech** (accueil) + **greenfad.tech/assets/docs/plaquette-greenfad.pdf** | ✅ Nos URL — déjà indexées |
| 5-6 | **facebook.com/greenfad** — Green Fashion Art & Design Museum (21 000 abonnés) + goodnewsplanet.com + instagram.com/greenfadmuseum | ⚠️ Homonyme américain (musée de mode) — occupe le handle @greenfad sur Facebook |
| 7+ | Bruit : FAD Magazine, NJ.gov (cannabis), mackinac.org, ResearchGate (biochimie « green FAD ») | Bruit générique non homonyme |
| variable | **play.google.com — « Android Apps by Greenfad »** | ✅ Notre page développeur Google Play — asset précieux, à renforcer |

**Constat honnête** : la domination totale (3 pages ≈ 30 résultats) contre un domaine aussi autoritaire que greenoleo.com prendra **plusieurs mois de travail continu**. Le plan combine la technique (déployée aujourd'hui), le contenu et le hors-site.

---

## 2. Ce qui est déployé aujourd'hui (commit 3ab204f)

Tout est **automatique** à chaque déploiement — aucune action manuelle récurrente :

1. **Sitemaps dédiés déclarés dans robots.txt** :
   - `/sitemap.xml` — toutes les pages (produits, expertises, blog, implantation, offres, communiqués, documents…)
   - `/sitemap-videos.xml` — format vidéo Google : les 21 pages vidéo avec miniature, titre, description, player, date
   - `/sitemap-images.xml` — format images Google : logo, images produits, expertises, couvertures d'articles, albums photo (61 images au lancement)
2. **Données structurées complètes (JSON-LD schema.org)** — alimentent les résultats enrichis et le graphe de connaissance :
   - `Organization` sur chaque page : nom, logo, adresse Bamako, téléphone, sameAs → YouTube/Facebook/TikTok officiels
   - `VideoObject` sur chaque page vidéo + liste sur /videos → **Google Vidéo**
   - `Blog` + BlogPosting sur /blog et chaque article
   - `JobPosting` sur chaque offre → **Google Jobs**
   - `FAQPage` sur /faq → extrait enrichi FAQ
   - `SoftwareApplication`/`Product` sur chaque fiche produit
   - `Article` sur les communiqués de presse, `CreativeWork` sur les études de cas
   - `BreadcrumbList` sur toutes les pages
3. **Balise de vérification Google Search Console** : Réglages → « Code de vérification Google Search Console » — le fondateur colle le code, il apparaît instantanément sur tout le site, sans déploiement.
4. **Suffixe de titre éditable** (admin SEO) — par défaut « | GREEN FAD », chaque page indexable porte la marque.
5. **404 en noindex** — plus aucune page vide indexable ; flux RSS déclaré dans le head de chaque page.
6. Réparation au passage : les cartes vidéo de l'accueil pointaient vers `/galerie/video/undefined` — liens réparés.

---

## 3. Actions propriétaires — SEULES dépendances externes (par ordre de priorité)

### A. Google Search Console (30 min, à faire cette semaine) — CRITIQUE
1. Ouvrir https://search.google.com/search-console → « Ajouter une propriété » → **Domaine** : greenfad.tech
2. Choisir la validation par **balise HTML** → copier le code `google-site-verification=XXXXX`
3. Coller la valeur XXXXX dans Dashboard → Réglages → « Code de vérification Google Search Console » → Enregistrer → vérifier dans Search Console
4. Soumettre les **3 sitemaps** (section Sitemaps) : `sitemap.xml`, `sitemap-videos.xml`, `sitemap-images.xml`
5. Surveiller chaque semaine le rapport de performances : requêtes « greenfad », pages classées, impressions

### B. Google Business Profile (Bamako) — pour le Knowledge Panel
1. Créer https://business.google.com — GREEN FAD SARL, Missabougou Bamako, horaires, photos réelles, catégorie « Éditeur de logiciels »
2. La cohérence NAP (nom/adresse/téléphone identiques partout : site, FB, LinkedIn, annuaires) est le premier facteur du panneau de connaissance.

### C. YouTube — 2e moteur de recherche mondial, déjà notre meilleur asset
1. Renommer chaque vidéo avec la marque en tête : « GREENFAD — PayGfad School V3 : la gestion scolaire réunie » (les titres actuels commencent par le produit, pas par la marque)
2. La description de la chaîne doit contenir : « greenfad », « green fad », « Green FAD SARL Bamako », l'URL https://greenfad.tech et le lien vers /videos
3. Publier 1 short/semaine minimum — les Shorts YouTube rankent sur mobile pour les requêtes de marque
4. Ajouter https://greenfad.tech en lien de site web : chaque vidéo du site pointe vers YouTube → **boucle de signaux réciproques**

### D. Réseaux sociaux — renforcer les handles officiels
1. **TikTok @greenfad1** existe (1 159 abonnés) : publier les mêmes Shorts ; ajouter greenfad.tech dans la bio
2. **Facebook** : la page Green fad (100083594433530) est faible (191 abonnés) face au musée homonyme. Publier les vidéos ORTM, les démos produits ; demander à des partenaires de partager. Objectif : la page sous le site pour « green fad »
3. **LinkedIn** : créer/réaliser la Page Entreprise GREEN FAD SARL avec le même NAP — LinkedIn rank très fort sur les requêtes de marque
4. **Google Play** : la page développeur « Android Apps by Greenfad » doit lister TOUTES les applications (TILE, FAD CARD, QRFAD…) avec des descriptions contenant « Greenfad » — chaque fiche app est une SERP de plus

### E. Annuaires & backlinks locaux (1-2 par semaine, récurrent)
Cibles : annuaires d'entreprises maliens (mali-pme, Kompass Mali, crunchbase, europages, goodfirms, clutch), plateformes tech africaines (TechCabal Directory, WeeTracker), presse tech (TechMali, MaliWeb) avec les communiqués déjà rédigés (dossier de presse PDF prêt dans /ressources).
Chaque annuaire = 1 URL Greenfad supplémentaire sur la SERP + autorité pour le domaine.

---

## 4. Stratégie de contenu (à partir de ce qui existe déjà)

1. **Blog** : rythme 2 articles/semaine minimum (les 41 articles existants sont le socle). Titres contenant le nom quand c'est naturel : « Greenfad lance… », « Comment Greenfad… ».
2. **Pages marque** : vérifier dans l'admin que les meta_title des pages /p/entreprise, /produits/*, /realisations/* contiennent « Green FAD ».
3. **Vidéos** : chaque nouvelle vidéo (YouTube, Facebook, TikTok) est référencée depuis l'admin en 1 minute — elle apparaît automatiquement dans /videos, le sitemap vidéo et les JSON-LD.
4. **Documents PDF** : les 7 PDF d'/assets/docs/ sont DÉJÀ indexés par Google (preuve : plaquette-greenfad.pdf classé). Chaque nouveau document public = 1 résultat de plus. Les titres PDF contiennent « GREEN FAD » ✓.

---

## 5. Sur la marque « GreenFad® » de GreenOleo (réalité à ne pas ignorer)

- GreenOleo a déposé « GreenFad® » (produits chimiques, UE). Une marque déposée ≠ interdiction d'apparaître sur Google : les résultats se battent sur la pertinence et l'autorité, pas sur la marque seule.
- **À faire par le fondateur (hors code)** : consulter un conseil en propriété intellectuelle pour vérifier les classes du dépôt GreenOleo (classe chimie vs classes 9/42 logiciels — très probablement sans conflit) et, si pertinent, déposer « GREEN FAD » en classes 9/42/35 au Mali (OAPI) et à l'international. Ce document ne constitue pas un conseil juridique.
- Côté Google : utiliser systématiquement **« GREEN FAD SARL »** comme raison sociale complète partout — la désambiguïsation par l'entité (SARL, Bamako, tech) est ce qui séparera nos résultats de ceux de GreenOleo et du musée.

---

## 6. Calendrier réaliste et indicateurs

| Horizon | Objectif vérifiable |
|---|---|
| Semaine 1 | Search Console validé, 3 sitemaps soumis, profil Google Business créé |
| Mois 1 | 100 % des pages du site indexées (rapport « Pages ») ; /videos et 10+ articles dans l'index ; titres YouTube renommés |
| Mois 2-3 | « greenfad » : top 3 = greenfad.tech + pages internes + YouTube + Google Play ; GreenOleo partiellement repoussé hors du premier écran |
| Mois 4-6 | Première page pleine GREEN FAD (site multi-URLs + YouTube + Play + LinkedIn + FB + annuaires) ; travail continu sur la 2e |
| Suivi | 1 fois/semaine : Search Console (requêtes greenfad, impressions, position moyenne) + recherche Google en navigation privée |

**Règle de vérité** : toute évolution SEO du site passe par le dépôt GitHub (source de vérité). Ce plan est révisé à chaque étape franchie.
