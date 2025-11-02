# Plan de Modernisation Visuelle pour Greenfad

## 1. Images à Remplacer/Ajouter

| Section | Élément Actuel | Remplacement/Ajout Proposé | Justification |
| :--- | :--- | :--- | :--- |
| **Hero** | `assets/images/hero-image.jpg` | **Nouvelle image moderne** (style abstrait, technologie, écologie, Afrique) | L'image actuelle est probablement générique. Une image plus moderne et conceptuelle renforcera l'identité de marque. |
| **Solutions** | Images de portfolio (dans `portfolio/`) | **Nouvelles images de portfolio** (si les anciennes sont génériques) | Assurer que les images de portfolio sont de haute qualité et modernes. |
| **Équipe** | Avatars (dans `team/`) | **Avatars modernes** (si non fournis) | Assurer un style cohérent et professionnel pour les photos d'équipe. |

## 2. Icônes à Moderniser (Utilisation de Font Awesome 6 Pro/SVG si possible)

Le projet utilise déjà Font Awesome 6. Pour moderniser les icônes, nous allons nous concentrer sur l'utilisation d'icônes plus stylisées (par exemple, en utilisant le style "Duotone" ou "Solid" avec des couleurs cohérentes) et, si nécessaire, les remplacer par des icônes SVG personnalisées pour un contrôle total du style.

| Section | Icône Actuelle (HTML) | Icône Proposée (Concept) | Justification |
| :--- | :--- | :--- | :--- |
| **Hero Badge** | `<i class="fas fa-leaf"></i>` | Icône de feuille plus stylisée (SVG ou Duotone) | Renforcer l'aspect "durable" et "écologique". |
| **Valeurs** | `<i class="fas fa-lightbulb"></i>` (Innovation) | Icône d'ampoule plus abstraite/moderne | Moderniser le concept d'innovation. |
| **Valeurs** | `<i class="fas fa-shield-alt"></i>` (Responsabilité) | Icône de bouclier ou de sécurité plus épurée | Moderniser le concept de sécurité/responsabilité. |
| **Valeurs** | `<i class="fas fa-leaf"></i>` (Durabilité) | Icône de feuille/arbre/nature plus graphique | Renforcer l'engagement écologique. |
| **Valeurs** | `<i class="fas fa-handshake"></i>` (Partenariat) | Icône de poignée de main ou de connexion plus moderne | Moderniser le concept de collaboration. |
| **Contact** | `<i class="fas fa-map-marker-alt"></i>` (Adresse) | Icône de localisation plus moderne | Moderniser l'icône de localisation. |
| **Contact** | `<i class="fas fa-envelope"></i>` (Email) | Icône d'enveloppe plus épurée | Moderniser l'icône de contact. |
| **Contact** | `<i class="fas fa-phone"></i>` (Téléphone) | Icône de téléphone plus moderne | Moderniser l'icône de téléphone. |

## 3. Animations et Effets Flottants (Hover Effects)

Les effets flottants (hover effects) sont déjà présents sur les boutons (`btn-primary:hover`), les cartes (`card:hover`, `value-card:hover`, `solution-card:hover`, `team-card:hover`) et les liens de navigation.

**Améliorations Proposées :**

1.  **Effet Flottant (Floating Effect) sur l'Image Hero :** Ajouter une légère animation de translation verticale (`translateY`) et d'ombre pour donner une impression de flottement à l'image principale.
2.  **Micro-animations sur les Icônes :** Ajouter une petite animation (rotation, pulsation) aux icônes des cartes au survol.
3.  **Animation de Révélation (Scroll Reveal) :** Le code JS (`AnimationController`) est en place mais les classes CSS `animate-on-scroll`, `service-card`, `portfolio-item`, `testimonial`, `step` ne sont pas définies dans le CSS actuel. Nous allons :
    *   Ajouter la classe CSS `animate` pour l'animation `fadeInUp`.
    *   Mettre à jour le JS pour utiliser la classe `reveal` déjà définie dans le CSS.

---
**Prochaine Étape :** Générer la nouvelle image Hero et les icônes SVG/modernes.

**Image Hero Concept :** Une image abstraite et moderne représentant la **connexion entre la technologie (circuits, données) et la nature (feuilles, eau)**, avec une palette de couleurs dominée par le vert et le bleu, en accord avec les variables CSS (`--color-primary: #2D5F3F`, `--color-secondary: #1E4D7B`).

**Icônes Concept :** Utiliser un style **minimaliste et géométrique** pour les icônes des valeurs.
