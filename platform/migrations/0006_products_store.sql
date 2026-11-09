-- GREEN FAD — Migration 0006 : fiche produit « style store »
-- Captures d'écran (mobile & desktop) + liens de téléchargement (App Store,
-- Google Play, APK, Web, Windows, Mac) éditables depuis l'Admin → Produits.
ALTER TABLE products ADD COLUMN screenshots_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE products ADD COLUMN downloads_json TEXT NOT NULL DEFAULT '[]';
