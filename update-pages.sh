#!/bin/bash

# Script pour mettre à jour toutes les pages avec les nouvelles améliorations responsive

echo "🚀 Mise à jour des pages avec les améliorations responsive..."

# Liste des pages à mettre à jour
pages=(
    "cgv.html"
    "politique-de-confidentialite.html"
    "faq.html"
    "support-technique.html"
    "careers.html"
    "documentation.html"
)

# Fonction pour mettre à jour une page
update_page() {
    local file=$1
    echo "📄 Mise à jour de $file..."
    
    # Vérifier si le fichier existe
    if [ ! -f "$file" ]; then
        echo "⚠️  Le fichier $file n'existe pas"
        return 1
    fi
    
    # Créer une sauvegarde
    cp "$file" "$file.backup"
    
    # Mettre à jour le CSS (si la structure est similaire aux autres pages)
    sed -i 's|<link rel="stylesheet" href="assets/css/styles.min.css">|<link rel="stylesheet" href="assets/css/styles.min.css">\n    <link rel="stylesheet" href="assets/css/responsive-enhanced.css?v=2.0.0">|g' "$file"
    
    # Ajouter les CSS supplémentaires si pas déjà présents
    if ! grep -q "responsive-enhanced.css" "$file"; then
        sed -i '/assets\/css\/styles.min.css/a\    <link rel="stylesheet" href="assets/css/responsive-enhanced.css?v=2.0.0">' "$file"
    fi
    
    if ! grep -q "improvements.min.css" "$file"; then
        sed -i '/responsive-enhanced.css/a\    <link rel="stylesheet" href="assets/css/improvements.min.css">' "$file"
    fi
    
    if ! grep -q "agency-identity.min.css" "$file"; then
        sed -i '/improvements.min.css/a\    <link rel="stylesheet" href="assets/css/agency-identity.min.css">' "$file"
    fi
    
    # Ajouter le JavaScript si pas déjà présent
    if ! grep -q "responsive-enhanced.js" "$file"; then
        sed -i 's|</head>|    <script src="assets/js/responsive-enhanced.js?v=2.0.0" defer></script>\n</head>|g' "$file"
    fi
    
    echo "✅ $file mis à jour avec succès"
}

# Mettre à jour chaque page
for page in "${pages[@]}"; do
    update_page "$page"
done

echo "🎉 Mise à jour terminée ! Toutes les pages ont été améliorées avec le système responsive."
echo "📋 Résumé des améliorations:"
echo "   - Système de grille CSS Grid et Flexbox"
echo "   - Navigation mobile optimisée"
echo "   - Typographie fluide avec clamp()"
echo "   - Animations et transitions responsives"
echo "   - Gestion avancée des breakpoints"
echo "   - Accessibilité améliorée"