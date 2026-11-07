# GREEN FAD — Plateforme officielle greenfad.tech

Dépôt **source de vérité** du code : toute mise en production passe par ce dépôt via GitHub Actions. Aucun déploiement direct.

## Architecture

```
.github/workflows/deploy.yml   ← pipeline CI/CD officiel (Cloudflare Pages + D1 + R2 + KV)
platform/
├── src/                        ← application Hono SSR (TypeScript)
│   ├── index.tsx               ← point d'entrée : assets statiques, sessions, routes
│   ├── auth.ts / rbac.ts       ← authentification PBKDF2, sessions KV, 8 rôles
│   ├── blocks.ts               ← catalogue Page Builder (23 blocs validés zod)
│   ├── icons.ts                ← bibliothèque d'icônes SVG (zéro emoji)
│   ├── routes/public.tsx       ← site public (produits, galerie, innovation, SEO)
│   ├── routes/admin-core.tsx   ← Media Center, albums, vidéos URL, utilisateurs, SEO
│   ├── routes/admin-crud.tsx   ← moteur CRUD générique (26 modules)
│   └── render/                 ← layouts public & dashboard
├── migrations/                 ← schéma D1 (32+ tables)
├── seed/                       ← contenu réel migré (idempotent)
├── public/                     ← css/js/logos officiels (identité navy/teal/or)
├── legacy-assets/              ← images réelles de l'ancien site (compatibilité URLs)
└── build.mjs                   ← esbuild → dist/_worker.js (Pages mode avancé)
audits/                         ← rapports de mission CTO
```

## Déploiement

1. **Push sur `main`** (chemins `platform/**` ou workflow) → GitHub Actions
2. Pipeline : `npm ci` → `tsc --noEmit` (0 erreur exigée) → `build.mjs`
3. **Migrations D1** (`wrangler d1 migrations apply --remote`)
4. **Seed** uniquement à la première installation (idempotent : exécuté si 0 utilisateur)
5. `wrangler pages deploy dist` → **greenfad.pages.dev** → greenfad.tech (DNS)

Secrets requis : `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

## Développement local

```bash
cd platform
npm install
npx wrangler d1 migrations apply greenfad-production --local
npx wrangler d1 execute greenfad-production --local --file=seed/seed.sql
npx wrangler pages dev --port 8788
node scripts/smoke.mjs http://localhost:8788 "<mot-de-passe-admin>"
```

## Modules du Dashboard

Pages & Page Builder · Produits technologiques (portfolio complet) · Services & Expertises · Projets & Réalisations · Innovation & publications · Archives · Presse · FAQ · Pays · Bureaux · Équipe · Partenaires · Témoignages · **Media Center** (bibliothèque R2, albums & galeries, vidéos par URL) · Documents · Messages · Prospects · Carrières · Newsletter · Menus · Pied de page · SEO & Redirections 301 · Paramètres & Identité · Utilisateurs & permissions (8 rôles) · Journal d'audit.

## Identité

Logo officiel GREEN FAD (glyph « G » concentrique navy + barre teal, souligné or). Palette : `#14274E` navy · `#2F8B9E` teal · `#D9A927` or. Typographies : Space Grotesk (titres) · Inter (texte). Toutes les icônes sont des SVG inline — aucun emoji n'est utilisé dans la plateforme.
