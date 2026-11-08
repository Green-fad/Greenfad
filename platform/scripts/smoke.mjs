// GREEN FAD — Tests automatisés de bout en bout (exécutés contre wrangler pages dev)
// Usage : node scripts/smoke.mjs [baseUrl] "$(sed -n 's/^Mot de passe: //p' ../../../backups/greenfad-admin-initial-password.txt)"
const BASE = process.argv[2] || "http://localhost:8788";
const ADMIN_PW = process.argv[3] || "";
const RUN_ID = Date.now().toString(36);
let cookie = "";
let passed = 0, failed = 0;

function ok(name, cond, extra = "") {
  if (cond) { passed++; console.log(`  ✔ ${name}`); }
  else { failed++; console.log(`  ✘ ${name} ${extra}`); }
}

async function get(path, opts = {}) {
  return fetch(BASE + path, { redirect: "manual", headers: { cookie, ...(opts.headers || {}) } });
}
async function post(path, body, headers = {}) {
  const h = { cookie, ...headers };
  let payload = body;
  if (typeof body === "object" && !(body instanceof FormData) && !(body instanceof URLSearchParams)) {
    h["content-type"] = "application/json";
    payload = JSON.stringify(body);
  }
  return fetch(BASE + path, { method: "POST", redirect: "manual", headers: h, body: payload });
}

console.log(`\n═══ GREEN FAD — Tests automatisés sur ${BASE} ═══\n`);

// ---------- 1. Site public ----------
console.log("— Site public (SSR depuis D1) —");
let r = await get("/");
let html = await r.text();
ok("GET / → 200", r.status === 200);
ok("accueil rend le hero réel", html.includes("Nous concevons les produits numériques"));
ok("accueil rend les 7 produits réels (FAD CARD présent)", html.includes("FAD CARD"));
ok("accueil rend les piliers réels", html.includes("Quatre piliers stratégiques"));
ok("accueil rend les services dynamiques", html.includes("Développement Web"));
ok("accueil rend l'implantation (pays)", html.includes("Burkina Faso"));
ok("JSON-LD Organization", html.includes('"@type":"Organization"'));
ok("canonical défini", html.includes('rel="canonical"'));

r = await get("/expertises/developpement-web");
html = await r.text();
ok("page service rend le contenu migré", r.status === 200 && html.includes("Développement Web"));
ok("fiche service : formulaire de devis", html.includes("Demander un devis"));
ok("fiche service : JSON-LD Service", html.includes('"@type":"Service"'));

r = await get("/produits/fad-card");
html = await r.text();
ok("page produit rend FAD CARD + fonctionnalités", r.status === 200 && html.includes("NFC"));

r = await get("/galerie");
html = await r.text();
ok("galerie multimédia (albums)", r.status === 200 && html.includes("Produits Green FAD"));

r = await get("/blog");
html = await r.text();
ok("liste blog (média éditorial)", r.status === 200);
ok("article 'Tendances du Développement Web 2025' présent", html.includes("Tendances du Développement Web"));
ok("blog : section articles populaires", html.includes("Articles populaires"));
ok("blog : recherche présente", html.includes("blog-search"));

r = await get("/blog/tendances-developpement-web-2025");
html = await r.text();
ok("article rendu avec date éditoriale originale (8 nov 2025)", r.status === 200 && html.includes("8 novembre 2025"));
ok("JSON-LD BlogPosting", html.includes('"@type":"BlogPosting"'));
ok("temps de lecture affiché", html.includes("min de lecture"));
ok("boutons de partage présents", html.includes("Partager"));

r = await get("/blog/archives");
ok("archives blog mensuelles", r.status === 200);

r = await get("/blog?q=referencement");
html = await r.text();
ok("recherche insensible aux accents", r.status === 200 && html.includes("résultat"));

r = await get("/blog?type=analyse");
html = await r.text();
ok("filtre par type", r.status === 200);

r = await get("/implantation/mali");
html = await r.text();
ok("page pays Mali + bureau HQ réel", r.status === 200 && html.includes("Missabougou"));

r = await get("/faq");
html = await r.text();
ok("FAQ réelle rendue", r.status === 200 && html.includes("Qui est GREEN FAD ?"));

r = await get("/sitemap.xml");
html = await r.text();
ok("sitemap contient produits+pays+articles+albums", r.status === 200 && html.includes("/produits/fad-card") && html.includes("/implantation/mali") && html.includes("/blog/tendances-developpement-web-2025") && html.includes("/galerie/album/produits-green-fad"));

// ---------- 2. Redirections SEO ----------
console.log("\n— Redirections anciennes URL —");
r = await get("/services/web-development.html");
ok("301 /services/web-development.html → /expertises/developpement-web", r.status === 301 && r.headers.get("location") === "/expertises/developpement-web");
r = await get("/blog.html");
ok("301 /blog.html → /blog", r.status === 301 && r.headers.get("location") === "/blog");
r = await get("/innovation");
ok("301 /innovation → /blog", r.status === 301 && r.headers.get("location")?.includes("/blog"));
r = await get("/actualites/tendances-developpement-web-2025");
ok("301 /actualites/[slug] → /blog/[slug]", r.status === 301 && r.headers.get("location")?.includes("/blog/tendances-developpement-web-2025"));
r = await get("/services");
ok("301 /services → /expertises", r.status === 301 && r.headers.get("location") === "/expertises");
r = await get("/countries/mali.html");
ok("301 /countries/mali.html → /implantation/mali", r.status === 301);
r = await get("/greenfad");
ok("302 /greenfad → /admin (alias PWA)", r.status === 302 && r.headers.get("location") === "/admin");
r = await get("/manifest.webmanifest");
ok("manifest PWA servi", r.status === 200 && (await r.text()).includes("GREEN FAD"));
r = await get("/admin/sw.js");
ok("service worker admin + header Service-Worker-Allowed", r.status === 200 && r.headers.get("service-worker-allowed") === "/admin/");

// ---------- 3. Sécurité ----------
console.log("\n— Sécurité (CSRF, sessions) —");
r = await post("/admin/login", new URLSearchParams({ email: "contact@greenfad.tech", password: "mauvais-mot-de-passe" }), { "content-type": "application/x-www-form-urlencoded" });
ok("mauvais mot de passe → 401", r.status === 401);

r = await get("/admin");
ok("/admin sans session → redirection login", r.status === 302 && r.headers.get("location").includes("/admin/login"));

// login réussi
r = await post("/admin/login", new URLSearchParams({ email: "contact@greenfad.tech", password: ADMIN_PW }), { "content-type": "application/x-www-form-urlencoded" });
const loc = r.headers.get("location") || "";
const setCookie = r.headers.get("set-cookie") || "";
cookie = setCookie.split(";")[0] || "";
ok("login super_admin → 302 /admin", r.status === 302 && loc === "/admin", `status=${r.status} loc=${loc}`);
ok("cookie session HttpOnly émis", /gf_session=/.test(cookie) && /httponly/i.test(setCookie));

r = await get("/api/v1/me");
const me = await r.json();
ok("API /me renvoie le super admin", me.role === "super_admin");

// ---------- 4. Dashboard ----------
console.log("\n— Dashboard (données réelles D1) —");
r = await get("/admin");
html = await r.text();
ok("tableau de bord rendu", r.status === 200);
ok("statistiques réelles affichées", html.includes("Tableau de bord"));

r = await get("/admin/products");
html = await r.text();
ok("module produits liste les 7 produits réels", r.status === 200 && html.includes("SARAPAY") && html.includes("FAD CARD"));

// ---------- 5. CRUD complet (création + édition + statut) ----------
console.log("\n— CRUD serveur —");
// récupérer le CSRF depuis le dashboard
r = await get("/admin");
html = await r.text();
const csrfMatch = html.match(/GF_CSRF="([^"]+)"/);
ok("jeton CSRF injecté dans l'interface", !!csrfMatch);
const csrf = csrfMatch ? csrfMatch[1] : "";

r = await post("/admin/products", new URLSearchParams({
  _csrf: csrf, name: "Produit Test QA", slug: "", tagline: "Produit créé par les tests automatisés",
  category: "QA", icon: "", image_key: "", description_md: "Test", features: "[]", external_url: "",
  sort_order: "99", status: "brouillon", published_at: "", meta_title: "", meta_description: "",
}), { "content-type": "application/x-www-form-urlencoded" });
ok("création produit → 302", r.status === 302);

r = await get("/admin/products?q=Produit+Test+QA");
html = await r.text();
ok("produit de test visible en liste", html.includes("Produit Test QA"));
const idMatch = html.match(/\/admin\/products\/(\d+)"/);
const testId = idMatch ? idMatch[1] : "0";
ok("id du produit récupéré", testId !== "0");

r = await post(`/admin/products/${testId}`, new URLSearchParams({
  _csrf: csrf, name: "Produit Test QA modifié", slug: "produit-test-qa", tagline: "Modifié par test",
  category: "QA", icon: "", image_key: "", description_md: "Test", features: "[]", external_url: "",
  sort_order: "99", status: "publie", published_at: "", meta_title: "", meta_description: "",
}), { "content-type": "application/x-www-form-urlencoded" });
ok("modification produit → 302", r.status === 302);

r = await get("/produits/produit-test-qa");
ok("produit publié visible côté public", r.status === 200);

r = await post(`/admin/products/${testId}/delete`, new URLSearchParams({ _csrf: csrf }), { "content-type": "application/x-www-form-urlencoded" });
ok("suppression produit → 302", r.status === 302);
r = await get("/produits/produit-test-qa");
ok("produit supprimé → 404 côté public", r.status === 404);

// ---------- 6. Page Builder ----------
console.log("\n— Page Builder —");
// nettoyage ciblé : uniquement les pages créées par les runs de test (jamais les pages réelles)
r = await get("/admin/pages");
html = await r.text();
for (const m of [...html.matchAll(/<tr><td>(\d+)<\/td>\s*<td><strong>Page Test Builder<\/strong>.*?<form method="post" action="\/admin\/pages\/(\d+)\/delete"/g)]) {
  await post(`/admin/pages/${m[2]}/delete`, new URLSearchParams({ _csrf: csrf }), { "content-type": "application/x-www-form-urlencoded" });
}
const RUN = Date.now().toString(36);
r = await post("/admin/pages", new URLSearchParams({ _csrf: csrf, title: "Page Test Builder", slug: `page-test-${RUN}`, status: "brouillon", show_in_nav: "0" }), { "content-type": "application/x-www-form-urlencoded" });
const builderLoc = r.headers.get("location") || "";
ok("création page → 302 builder", r.status === 302 && builderLoc.includes("/builder"));
const pid = (builderLoc.match(/\/admin\/pages\/(\d+)\/builder/) || [])[1] || "0";
ok("id de la page récupéré (slug unique par run)", pid !== "0");

const blocks = [
  { type: "hero", visible: true, title: "Page construite au Builder", subtitle: "Créée par les tests automatisés", variant: "gradient" },
  { type: "section_header", visible: true, title: "Section test", align: "center" },
  { type: "cards", visible: true, source: "services", limit: 2, columns: 2, items: [] },
  { type: "spacer", visible: true, height: "small" },
];
r = await post(`/admin/pages/${pid}/publish`, { blocks }, { "x-csrf-token": csrf });
const pub = await r.json();
ok("publication des blocs acceptée (validation zod serveur)", r.status === 200 && pub.ok === true, JSON.stringify(pub));

r = await post(`/admin/pages/${pid}/blocks`, { blocks: [{ type: "bloc_inexistant", title: "x" }] }, { "x-csrf-token": csrf });
ok("bloc invalide refusé par le serveur", r.status === 400);

r = await get(`/p/page-test-${RUN}`);
html = await r.text();
ok("page publiée rendue côté public avec blocs dynamiques", r.status === 200 && html.includes("Page construite au Builder") && html.includes("Développement Web"), `status=${r.status}`);

r = await get(`/admin/pages/${pid}/versions`);
html = await r.text();
ok("versions enregistrées (v1, v2)", r.status === 200 && html.includes("v1") && html.includes("v2"));

// restauration v1
r = await post(`/admin/pages/${pid}/versions/1/restore`, new URLSearchParams({ _csrf: csrf }), { "content-type": "application/x-www-form-urlencoded" });
ok("restauration v1 → 302", r.status === 302);

// ---------- 7. Upload média R2 (émulation locale) ----------
console.log("\n— Médias R2 —");
// PNG 1x1 minimal
const pngB64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
const png = Buffer.from(pngB64, "base64");
const fd = new FormData();
fd.append("file", new Blob([png], { type: "image/png" }), "test-pixel.png");
r = await post("/api/v1/media", fd);
const mediaRes = await r.json();
ok("upload média via API → clé R2 renvoyée", r.status === 200 && mediaRes.keys?.length === 1, JSON.stringify(mediaRes));
if (mediaRes.keys?.[0]) {
  const key = mediaRes.keys[0];
  r = await get(`/media/${key}`);
  ok("média servi via /media/", r.status === 200 && r.headers.get("content-type")?.includes("png"));
}

// ---------- 8. Formulaires publics ----------
console.log("\n— Formulaires publics —");
r = await post("/contact", new URLSearchParams({
  website: "", name: "Client Test", email: "client@test.example", phone: "+223 00 00", subject: "Test automatisé", message: "Message envoyé par la suite de tests.",
}), { "content-type": "application/x-www-form-urlencoded" });
ok("POST /contact → 302 merci", r.status === 302 && (r.headers.get("location") || "").includes("sent=1"));

r = await post("/devis", new URLSearchParams({
  website: "", name: "Prospect Test", email: "prospect@test.example", company: "ACME Mali", message: "Besoin d'un ERP",
}), { "content-type": "application/x-www-form-urlencoded" });
ok("POST /devis → 302", r.status === 302);

r = await get("/admin/messages");
html = await r.text();
ok("message visible dans le module Contacts", r.status === 200 && html.includes("Client Test"));
r = await get("/admin/leads");
html = await r.text();
ok("prospect visible dans le module Prospects", r.status === 200 && html.includes("Prospect Test"));

// honeypot anti-spam
r = await post("/contact", new URLSearchParams({
  website: "http://spam.example", name: "Bot", email: "bot@spam.example", message: "spam",
}), { "content-type": "application/x-www-form-urlencoded" });
ok("honeypot : bot silencieusement ignoré", r.status === 302);

// ---------- 9. RBAC ----------
console.log("\n— RBAC (8 rôles, contrôle serveur) —");
// créer un lecteur
r = await post("/admin/users", new URLSearchParams({
  _csrf: csrf, name: "Auditeur QA", email: "auditeur-" + RUN_ID + "@greenfad.tech", role: "lecteur", password: "LecteurQA-2026-Pass",
}), { "content-type": "application/x-www-form-urlencoded" });
ok("création utilisateur lecteur → 302", r.status === 302);

// session lecteur séparée
let adminCookie = cookie;
r = await post("/admin/login", new URLSearchParams({ email: "auditeur-" + RUN_ID + "@greenfad.tech", password: "LecteurQA-2026-Pass" }), { "content-type": "application/x-www-form-urlencoded" });
cookie = (r.headers.get("set-cookie") || "").split(";")[0] || "";
ok("login lecteur → 302", r.status === 302);

r = await get("/admin/users");
ok("lecteur REFUSÉ sur /admin/users (403 serveur)", r.status === 403);
// lecteur-auditeur : lecture autorisée (matrice RBAC), écriture refusée
const pngB642 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
const fd2 = new FormData();
fd2.append("file", new Blob([Buffer.from(pngB642, "base64")], { type: "image/png" }), "x.png");
r = await post("/api/v1/media", fd2);
ok("lecteur REFUSÉ sur upload média API (403 serveur)", r.status === 403);
r = await get("/admin/products");
ok("lecteur autorisé en lecture sur produits", r.status === 200);
r = await post("/admin/products", new URLSearchParams({ _csrf: csrf, name: "Interdit" }), { "content-type": "application/x-www-form-urlencoded" });
ok("lecteur REFUSÉ en création (403 serveur)", r.status === 403);
r = await get("/api/v1/stats");
ok("lecteur autorisé en LECTURE sur /api/v1/stats (auditeur)", r.status === 200);

// CSRF : POST sans jeton
r = await post("/admin/pages", new URLSearchParams({ title: "Sans CSRF" }), { "content-type": "application/x-www-form-urlencoded" });
ok("POST sans jeton CSRF → 403", r.status === 403);

// retour admin pour audit
cookie = adminCookie;

// ---------- 10. Journal d'audit ----------
console.log("\n— Journal d'audit —");
r = await get("/admin/audit");
html = await r.text();
ok("audit journalise les opérations", r.status === 200 && html.includes("creation") && html.includes("publication_page"));

// ---------- Nettoyage ----------
r = await post(`/admin/pages/${pid}/delete`, new URLSearchParams({ _csrf: csrf }), { "content-type": "application/x-www-form-urlencoded" });

console.log(`\n═══ RÉSULTAT : ${passed} réussis, ${failed} échoués ═══\n`);
process.exit(failed ? 1 : 0);
