# 🎠 Documentation Technique - Carousel de Logos

## Vue d'ensemble

Le carousel de logos clients de GREEN FAD SARL utilise une animation CSS pure (sans JavaScript) pour créer un défilement horizontal infini et fluide.

## 🎯 Caractéristiques

- ✅ **Défilement automatique** : De gauche à droite, en boucle infinie
- ✅ **Animation fluide** : 30 secondes pour un cycle complet
- ✅ **Pause au survol** : L'animation se met en pause quand la souris survole
- ✅ **Effet de fondu** : Gradient mask sur les bords gauche/droite
- ✅ **Responsive** : Fonctionne sur tous les écrans (desktop, tablette, mobile)
- ✅ **Performance optimisée** : Utilise `transform` et `will-change`
- ✅ **Boucle sans coupure** : Les logos sont dupliqués pour un effet seamless

## 📐 Architecture

### Structure HTML

```html
<section class="social-proof">
    <div class="container">
        <p class="social-proof-title">Ils nous font confiance</p>
    </div>
    
    <!-- Conteneur avec overflow hidden -->
    <div class="clients-logos" data-scroll="horizontal">
        
        <!-- Track animée -->
        <div class="clients-logos-track" data-animated="true">
            
            <!-- Première série de 11 logos -->
            <div class="client-logo">
                <img src="assets/images/clients/logo1.jpg" alt="Client 1">
            </div>
            <!-- ... 10 autres logos ... -->
            
            <!-- Deuxième série IDENTIQUE pour boucle seamless -->
            <div class="client-logo">
                <img src="assets/images/clients/logo1.jpg" alt="Client 1">
            </div>
            <!-- ... 10 autres logos dupliqués ... -->
            
        </div>
    </div>
</section>
```

### Style CSS

```css
/* Conteneur principal - cache le débordement */
.clients-logos {
    overflow: hidden !important;
    position: relative;
    width: 100%;
    background: white;
    padding: 40px 0;
    
    /* Gradient mask pour effet de fondu */
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

/* Track animée - contient tous les logos */
.clients-logos-track {
    display: flex !important;
    gap: 60px;
    animation: scroll-logos 30s linear infinite !important;
    width: fit-content !important;
    will-change: transform; /* Optimisation performance */
}

/* Pause au survol */
.clients-logos-track:hover {
    animation-play-state: paused !important;
}

/* Animation de défilement */
@keyframes scroll-logos {
    0% {
        transform: translateX(0);
    }
    100% {
        /* -50% car les logos sont dupliqués (2x11 = 22 logos) */
        transform: translateX(-50%);
    }
}

/* Style des cartes logos */
.client-logo {
    flex-shrink: 0 !important; /* Empêche le rétrécissement */
    opacity: 0.7;
    transition: all 0.3s ease;
    filter: grayscale(100%); /* Désaturation par défaut */
    display: flex !important;
    align-items: center;
    justify-content: center;
    padding: 20px 30px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    min-height: 80px;
    width: 180px;
}

/* Effet au survol d'un logo individuel */
.client-logo:hover {
    opacity: 1;
    filter: grayscale(0%); /* Couleur au survol */
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 212, 170, 0.15);
}

.client-logo img {
    height: 50px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
}
```

## 🔧 Comment ça marche ?

### 1. Principe de la boucle infinie

```
┌─────────────────────────────────────────────────────────┐
│  Viewport (visible)                                      │
│                                                          │
│  [Logo1] [Logo2] [Logo3] ... [Logo11]                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
                              ↓ Animation
┌─────────────────────────────────────────────────────────┐
│          Viewport (visible)                              │
│                                                          │
│          [Logo2] [Logo3] ... [Logo11] [Logo1-dup]       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

- Les 11 logos sont **dupliqués** (22 au total)
- L'animation déplace la track de **50%** (moitié de sa largeur)
- Quand le dernier logo original disparaît, le premier logo dupliqué apparaît
- Effet de **boucle sans coupure** (seamless loop)

### 2. Calcul de la durée

```javascript
// Formule pour calculer la durée de l'animation
Durée = (Nombre de logos × Largeur d'un logo × Vitesse désirée)

// Exemple actuel:
// 11 logos × 180px largeur × 0.015s/px = 29.7s ≈ 30s
```

Pour modifier la vitesse:
- **Plus rapide** : Réduire la durée (ex: 20s)
- **Plus lent** : Augmenter la durée (ex: 40s)

### 3. Gradient Mask

```css
/* Crée un effet de fondu sur les bords */
mask-image: linear-gradient(
    to right,
    transparent,        /* Gauche: invisible */
    black 10%,          /* Fondu entrée */
    black 90%,          /* Zone visible */
    transparent         /* Droite: invisible */
);
```

### 4. Performance

```css
/* Optimisations pour animation fluide */
.clients-logos-track {
    will-change: transform;  /* Prépare le GPU */
    animation: ... infinite; /* Pas de recalcul entre les cycles */
}

/* Utilise transform au lieu de left/right */
transform: translateX(-50%); /* Accélération GPU ✅ */
/* Au lieu de: left: -50%; ❌ */
```

## 🎨 Personnalisation

### Changer la vitesse

```css
/* Modifier la durée dans .clients-logos-track */
animation: scroll-logos 20s linear infinite; /* Plus rapide */
animation: scroll-logos 40s linear infinite; /* Plus lent */
```

### Changer l'espacement entre logos

```css
/* Modifier le gap dans .clients-logos-track */
gap: 40px;  /* Espacement réduit */
gap: 80px;  /* Espacement augmenté */
```

### Changer la largeur des logos

```css
/* Modifier width dans .client-logo */
.client-logo {
    width: 200px;  /* Logos plus larges */
}
```

### Désactiver la pause au survol

```css
/* Supprimer ou commenter cette règle */
/* .clients-logos-track:hover {
    animation-play-state: paused !important;
} */
```

### Modifier l'effet de fondu

```css
/* Ajuster les pourcentages dans mask-image */
mask-image: linear-gradient(
    to right,
    transparent,
    black 5%,    /* Fondu plus rapide */
    black 95%,   /* Zone visible plus large */
    transparent
);
```

## 📱 Responsive Design

### Desktop (> 768px)
- Logos: 180px de largeur
- Images: 50px de hauteur
- Gap: 60px

### Tablette (480px - 768px)
```css
@media (max-width: 768px) {
    .client-logo {
        width: 160px;
        min-height: 70px;
    }
    .client-logo img {
        height: 40px;
    }
}
```

### Mobile (< 480px)
```css
@media (max-width: 480px) {
    .clients-logos-track {
        gap: 40px;  /* Espacement réduit */
    }
    .client-logo {
        width: 140px;
        min-height: 65px;
        padding: 15px;
    }
    .client-logo img {
        height: 35px;
    }
}
```

## 🐛 Résolution de problèmes

### Le carousel ne défile pas

**Problème** : Les logos sont affichés en grille statique

**Solutions** :
1. Vérifier que les `!important` sont présents dans le CSS
2. Vider le cache du navigateur (Ctrl+Shift+R)
3. Vérifier qu'aucun autre CSS n'écrase les propriétés
4. Ouvrir `test-carousel.html` pour tester isolément

### Les logos sautent à la fin de la boucle

**Problème** : Coupure visible au retour au début

**Solutions** :
1. Vérifier que les 11 logos sont bien **dupliqués**
2. Confirmer que l'animation va de `0` à `-50%` (et non `-100%`)
3. Vérifier que tous les logos ont la même largeur

### Performance lente

**Problème** : Animation saccadée

**Solutions** :
1. Ajouter `will-change: transform` sur `.clients-logos-track`
2. Utiliser `transform` au lieu de `left/right`
3. Réduire le nombre de logos si trop nombreux
4. Optimiser la taille des images (WebP, compression)

### Gradient mask ne fonctionne pas

**Problème** : Pas d'effet de fondu sur les bords

**Solutions** :
1. Vérifier la compatibilité du navigateur
2. Ajouter le préfixe `-webkit-mask-image` pour Safari
3. Utiliser les pseudo-éléments `::before` et `::after` comme fallback

## 🧪 Tests

### Tester l'animation isolément

Ouvrir `test-carousel.html` dans votre navigateur :
- Console JavaScript affichera le statut de l'animation
- Vérifiez que "Animation name: scroll-logos" s'affiche
- Testez le survol de la souris

### Tests multi-navigateurs

- ✅ Chrome / Edge (Chromium)
- ✅ Firefox
- ✅ Safari (avec `-webkit-mask-image`)
- ✅ Mobile browsers

### Tests responsive

```bash
# Ouvrir les DevTools
F12

# Activer le mode responsive
Ctrl + Shift + M (Chrome/Firefox)

# Tester différentes résolutions
- Mobile: 375px
- Tablette: 768px
- Desktop: 1920px
```

## 📚 Ressources

- [CSS Animation MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [CSS Transform Performance](https://web.dev/animations-guide/)
- [Mask Image MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image)

## 🤝 Support

Pour toute question ou assistance, contactez l'équipe GREEN FAD SARL.

---

**Dernière mise à jour** : 10 Novembre 2025  
**Version** : 1.0  
**Auteur** : GREEN FAD SARL Development Team
