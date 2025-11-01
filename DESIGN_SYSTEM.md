# Design System Greenfad - Refonte 2025

## 1. Philosophie du Design

Le design de Greenfad reflète l'harmonie entre **technologie moderne** et **engagement écologique**. Chaque élément visuel communique l'innovation, la durabilité et le professionnalisme.

### Principes directeurs
- **Clarté** : Information accessible et hiérarchisée
- **Modernité** : Design contemporain et épuré
- **Durabilité** : Palette inspirée de la nature
- **Performance** : Optimisation et rapidité
- **Accessibilité** : Utilisable par tous

## 2. Palette de Couleurs

### Couleurs Principales

#### Vert Greenfad (Primaire)
- **Primary Green** : `#2D5F3F` - Vert forêt profond (logo, CTA principaux)
- **Light Green** : `#4A9D6F` - Vert éclatant (hover, accents)
- **Pale Green** : `#E8F5E9` - Vert très clair (backgrounds, sections)

#### Bleu Technologie (Secondaire)
- **Tech Blue** : `#1E4D7B` - Bleu professionnel (titres, liens)
- **Light Blue** : `#3498DB` - Bleu clair (éléments interactifs)
- **Sky Blue** : `#E3F2FD` - Bleu pâle (backgrounds alternatifs)

### Couleurs Neutres
- **Dark** : `#1A1A1A` - Texte principal
- **Gray Dark** : `#4A4A4A` - Texte secondaire
- **Gray Medium** : `#757575` - Texte tertiaire
- **Gray Light** : `#E0E0E0` - Bordures
- **Gray Pale** : `#F5F5F5` - Backgrounds
- **White** : `#FFFFFF` - Fond principal

### Couleurs d'État
- **Success** : `#4CAF50` - Validation, succès
- **Warning** : `#FF9800` - Attention
- **Error** : `#F44336` - Erreur
- **Info** : `#2196F3` - Information

## 3. Typographie

### Police Principale : Inter
Font moderne, lisible et professionnelle (déjà utilisée)

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Hiérarchie Typographique

#### Titres
- **H1** : 48px / 700 / line-height: 1.2 - Hero, titres principaux
- **H2** : 36px / 700 / line-height: 1.3 - Titres de sections
- **H3** : 28px / 600 / line-height: 1.4 - Sous-titres
- **H4** : 22px / 600 / line-height: 1.4 - Titres de cartes
- **H5** : 18px / 600 / line-height: 1.5 - Petits titres
- **H6** : 16px / 600 / line-height: 1.5 - Mini titres

#### Corps de texte
- **Body Large** : 18px / 400 / line-height: 1.7 - Texte important
- **Body** : 16px / 400 / line-height: 1.6 - Texte standard
- **Body Small** : 14px / 400 / line-height: 1.5 - Texte secondaire
- **Caption** : 12px / 400 / line-height: 1.4 - Légendes

#### Responsive
- Mobile (< 768px) : Réduire toutes les tailles de 20%
- Tablet (768-1024px) : Réduire de 10%

## 4. Espacements

### Système d'espacement (base 8px)
```
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px
--space-3xl: 64px
--space-4xl: 96px
```

### Conteneurs
- **Max-width** : 1200px (contenu principal)
- **Padding horizontal** : 24px (desktop), 16px (mobile)
- **Section spacing** : 96px (desktop), 64px (mobile)

## 5. Composants UI

### Boutons

#### Bouton Primaire
```css
background: linear-gradient(135deg, #2D5F3F 0%, #4A9D6F 100%);
color: white;
padding: 14px 32px;
border-radius: 8px;
font-weight: 600;
transition: transform 0.3s, box-shadow 0.3s;
box-shadow: 0 4px 12px rgba(45, 95, 63, 0.3);
```
Hover : `transform: translateY(-2px); box-shadow: 0 6px 20px rgba(45, 95, 63, 0.4);`

#### Bouton Secondaire
```css
background: transparent;
border: 2px solid #2D5F3F;
color: #2D5F3F;
padding: 12px 30px;
border-radius: 8px;
```

#### Bouton Outline
```css
background: white;
border: 2px solid #E0E0E0;
color: #1A1A1A;
```

### Cartes

#### Carte Standard
```css
background: white;
border-radius: 16px;
padding: 32px;
box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
transition: transform 0.3s, box-shadow 0.3s;
```
Hover : `transform: translateY(-8px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);`

#### Carte avec Icône
- Icône en haut (64px)
- Titre H4
- Description body
- Lien ou CTA en bas

### Navigation

#### Header
```css
background: white;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
position: sticky;
top: 0;
z-index: 1000;
```

#### Menu Items
```css
color: #1A1A1A;
font-weight: 500;
padding: 8px 16px;
transition: color 0.3s;
```
Hover : `color: #2D5F3F;`

### Formulaires

#### Input
```css
border: 2px solid #E0E0E0;
border-radius: 8px;
padding: 12px 16px;
font-size: 16px;
transition: border-color 0.3s;
```
Focus : `border-color: #2D5F3F; box-shadow: 0 0 0 3px rgba(45, 95, 63, 0.1);`

## 6. Animations

### Transitions Standard
```css
transition-duration: 0.3s;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

### Animations d'Entrée
- **Fade In Up** : Opacité 0→1 + translateY(20px→0)
- **Scale In** : scale(0.95→1) + opacité 0→1
- **Slide In** : translateX(-20px→0) + opacité 0→1

### Durées
- **Fast** : 150ms - Micro-interactions
- **Normal** : 300ms - Transitions standard
- **Slow** : 500ms - Animations complexes

## 7. Grille et Layout

### Grid System
- **12 colonnes** avec gap de 24px
- **Breakpoints** :
  - Mobile : < 768px
  - Tablet : 768px - 1024px
  - Desktop : > 1024px
  - Large : > 1440px

### Sections
Toutes les sections suivent cette structure :
```html
<section class="section" id="section-name">
  <div class="container">
    <div class="section-header">
      <h2>Titre</h2>
      <p>Description</p>
    </div>
    <div class="section-content">
      <!-- Contenu -->
    </div>
  </div>
</section>
```

## 8. Iconographie

### Style
- **Font Awesome 6** (déjà inclus)
- Style : Solid pour les icônes principales, Regular pour les secondaires
- Taille : 24px (standard), 32px (grandes), 16px (petites)

### Couleurs d'icônes
- Primaire : Vert Greenfad
- Secondaire : Bleu Tech
- Neutre : Gray Dark

## 9. Images

### Traitement
- **Border-radius** : 16px pour les images de contenu
- **Aspect ratios** :
  - Hero : 16:9
  - Portfolio : 4:3
  - Équipe : 1:1
  - Blog : 16:9

### Optimisation
- Format WebP avec fallback
- Lazy loading
- Responsive images (srcset)

## 10. Accessibilité

### Contrastes
- Texte principal sur fond clair : ratio 4.5:1 minimum
- Texte large sur fond clair : ratio 3:1 minimum
- Éléments interactifs : zone de clic 44x44px minimum

### Focus
```css
outline: 3px solid #2D5F3F;
outline-offset: 2px;
```

### ARIA
- Labels sur tous les éléments interactifs
- Rôles sémantiques appropriés
- Navigation au clavier complète

## 11. Performance

### Objectifs
- First Contentful Paint : < 1.5s
- Time to Interactive : < 3.5s
- Cumulative Layout Shift : < 0.1

### Stratégies
- CSS critique inline
- Lazy loading des images
- Minification CSS/JS
- Compression Gzip/Brotli
- CDN pour les assets statiques

## 12. Dark Mode (Optionnel - Phase 2)

Variables CSS pour faciliter l'implémentation future :
```css
--bg-primary: #FFFFFF;
--bg-secondary: #F5F5F5;
--text-primary: #1A1A1A;
--text-secondary: #4A4A4A;
```

## 13. Composants Spécifiques Greenfad

### Badge Écologique
```css
background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
color: #2D5F3F;
padding: 6px 12px;
border-radius: 20px;
font-size: 14px;
font-weight: 600;
```

### Carte Projet/Solution
- Image en haut (aspect 16:9)
- Badge technologie
- Titre H4
- Description courte
- Technologies utilisées (pills)
- Lien "En savoir plus"

### Section Valeurs
- Icône centrale (64px)
- Titre H3
- Description
- Background : Alternance blanc / pale green

### Timeline (pour l'histoire)
- Ligne verticale verte
- Points de connexion
- Cartes d'événements alternées gauche/droite

## 14. Responsive Behavior

### Mobile First
Tous les styles sont écrits pour mobile d'abord, puis améliorés pour desktop.

### Breakpoints
```css
/* Mobile : styles par défaut */

@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1440px) {
  /* Large Desktop */
}
```

### Navigation Mobile
- Hamburger menu
- Menu plein écran avec overlay
- Animation slide-in
- Fermeture au clic sur overlay ou lien

## 15. Micro-interactions

### Hover States
- Boutons : Élévation + ombre
- Cartes : Translation Y + ombre
- Liens : Couleur + underline
- Images : Léger zoom (scale 1.05)

### Loading States
- Skeleton screens pour le contenu
- Spinners pour les actions
- Progress bars pour les uploads

### Success/Error States
- Toast notifications
- Inline validation
- Animations de confirmation
