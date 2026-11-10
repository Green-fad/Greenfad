-- GREEN FAD — Récupération chirurgicale des images de la galerie
-- Contexte (incident du 10/11/2026) : le rejeu du seed éditorial a exécuté
-- DELETE FROM media_items sur la production. Les lignes de la table media
-- (registre des fichiers téléversés dans R2) n ont PAS été supprimées : les
-- fichiers de l administration sont donc toujours présents en base et dans R2,
-- mais sans élément de galerie pour les afficher.
--
-- Ce script recrée UNIQUEMENT les éléments de galerie manquants :
--   - fichiers téléversés par l administration (media.uploaded_by != seed)
--   - de type image
--   - qui ne sont référencés par aucun media_item existant
-- Il est idempotent : relancé une seconde fois, il ne crée rien de plus.
-- Il ne modifie ni ne supprime aucune donnée existante.

-- 1) Album de regroupement (créé une seule fois)
INSERT INTO media_albums (slug, name, description, category, sort_order, status, published_at)
SELECT 'images-restaurees', 'Images restaurées',
       'Images téléversées par l''équipe — références de galerie recréées automatiquement après l''incident du 10/11/2026. Réorganisez librement via l''admin.',
       'general', 90, 'publie', datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM media_albums WHERE slug = 'images-restaurees');

-- 2) Recréation des éléments de galerie pour chaque image téléversée orpheline
INSERT INTO media_items (type, media_id, title, alt, keywords, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at)
SELECT 'image',
       m.id,
       COALESCE(NULLIF(m.alt, ''), REPLACE(m.filename, '-', ' '), 'Image'),
       m.alt,
       '[]',
       (SELECT id FROM media_albums WHERE slug = 'images-restaurees'),
       m.id,
       'publie',
       datetime('now'),
       m.uploaded_by,
       datetime('now'),
       datetime('now')
FROM media m
WHERE m.uploaded_by IS NOT NULL
  AND m.uploaded_by != 'seed'
  AND m.mime LIKE 'image/%'
  AND m.id IN (SELECT id FROM media)
  AND NOT EXISTS (SELECT 1 FROM media_items mi WHERE mi.media_id = m.id);
