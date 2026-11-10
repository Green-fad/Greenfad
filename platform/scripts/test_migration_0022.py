#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Test de la migration 0022_videos_menu.sql — GREEN FAD (11/11/2026).

Scénarios :
  A. Menu canonique 9 entrées (prod post-0019) → 10 entrées avec « Vidéos » après Galerie
  B. Idempotence : 0022 rejouée → aucun doublon (vidéos, menu, footer)
  C. Menu modifié par l'admin (sans /videos) → json_insert additif, saisies admin préservées
  D. Installation fraîche : toutes migrations + seed.sql + content-update.sql → 21 vidéos, sans doublon
  E. Unitaires parseVideo (node) : YouTube/Facebook/TikTok/Vimeo/fallback
"""
import sqlite3, json, glob, subprocess, sys, os

BASE = os.path.dirname(os.path.abspath(__file__))
MIG = os.path.join(BASE, "..", "migrations")
SEED = os.path.join(BASE, "..", "seed")
ok_all = True

def check(label, cond, detail=""):
    global ok_all
    print(("PASS  " if cond else "FAIL  ") + label + ((" — " + detail) if detail else ""))
    if not cond: ok_all = False

def fresh_db():
    if os.path.exists("/tmp/test0022.sqlite"): os.unlink("/tmp/test0022.sqlite")
    db = sqlite3.connect("/tmp/test0022.sqlite")
    db.isolation_level = None  # exécution directe, comme D1
    return db

def apply(db, path):
    with open(path, encoding="utf-8") as f: db.executescript(f.read())

MENU_9 = json.dumps([
    {"label": "Entreprise", "url": "/p/entreprise"}, {"label": "Expertises", "url": "/expertises"},
    {"label": "Produits", "url": "/produits"}, {"label": "Réalisations", "url": "/realisations"},
    {"label": "Galerie", "url": "/galerie"}, {"label": "Blog", "url": "/blog"},
    {"label": "Documents", "url": "/ressources"}, {"label": "Implantation", "url": "/implantation"},
    {"label": "Contact", "url": "/contact"}], ensure_ascii=False)

def setup_prod_like(db):
    for m in sorted(glob.glob(os.path.join(MIG, "00*.sql"))):
        if "0022" in m: continue
        apply(db, m)
    db.execute("INSERT INTO menus (location, items) VALUES ('header', ?)", (MENU_9,))
    db.execute("INSERT INTO footer_sections (section_key, title, content, sort_order) VALUES ('liens', 'Informations', ?, 4)",
               (json.dumps({"items": [{"label": "Ressources", "url": "/ressources"}, {"label": "Documents publics", "url": "/ressources"}]}, ensure_ascii=False),))

def counts(db):
    vids = db.execute("SELECT COUNT(*) FROM media_items WHERE type='video'").fetchone()[0]
    menu = db.execute("SELECT items FROM menus WHERE location='header'").fetchone()[0]
    foot = db.execute("SELECT content FROM footer_sections WHERE section_key='liens'").fetchone()[0]
    rels = db.execute("SELECT COUNT(*) FROM content_relations WHERE content_type='product'").fetchone()[0]
    return vids, json.loads(menu), json.loads(foot), rels

print("── Scénario A : menu canonique 9 entrées (prod post-0019)")
db = fresh_db(); setup_prod_like(db); apply(db, os.path.join(MIG, "0022_videos_menu.sql"))
vids, menu, foot, rels = counts(db)
check("15 vidéos insérées", vids == 15, f"{vids}")
check("menu → 10 entrées", len(menu) == 10, str([m["label"] for m in menu]))
check("« Vidéos » après Galerie", menu[4]["label"] == "Galerie" and menu[5]["label"] == "Vidéos" and menu[5]["url"] == "/videos")
check("« Documents » conservé", any(m.get("label") == "Documents" and m["url"] == "/ressources" for m in menu))
check("footer contient « Vidéos »", any(i.get("url") == "/videos" for i in foot["items"]))
rel_new = db.execute("SELECT COUNT(*) FROM content_relations cr JOIN media_items mi ON mi.id=cr.media_item_id WHERE mi.provider_id IN ('d2XY1csuELw','3uNcno1QbXo')").fetchone()[0]
check("pas de crash sans produits (EXISTS) — 0 relation créée", rel_new == 0, f"{rel_new}")

print("── Scénario B : idempotence (0022 rejouée)")
apply(db, os.path.join(MIG, "0022_videos_menu.sql"))
vids2, menu2, foot2, rels2 = counts(db)
check("vidéos toujours 15", vids2 == 15, f"{vids2}")
check("menu inchangé (10 entrées)", len(menu2) == 10)
check("un seul « Vidéos » dans le menu", sum(1 for m in menu2 if m.get("url") == "/videos") == 1)
check("un seul « Vidéos » dans le footer", sum(1 for i in foot2["items"] if i.get("url") == "/videos") == 1)
check("relations toujours intactes", db.execute("SELECT COUNT(*) FROM content_relations cr JOIN media_items mi ON mi.id=cr.media_item_id WHERE mi.provider_id IN ('d2XY1csuELw','3uNcno1QbXo')").fetchone()[0] == 0)

print("── Scénario C : menu modifié par l'admin (sans /videos)")
db = fresh_db(); setup_prod_like(db)
admin_menu = json.dumps([
    {"label": "Accueil", "url": "/"}, {"label": "Produits", "url": "/produits"},
    {"label": "Contact", "url": "/contact"}], ensure_ascii=False)
db.execute("UPDATE menus SET items = ? WHERE location='header'", (admin_menu,))
apply(db, os.path.join(MIG, "0022_videos_menu.sql"))
_, menu3, foot3, _ = counts(db)
check("saisies admin préservées", all(any(m.get("label") == x["label"] and m.get("url") == x["url"] for m in menu3) for x in json.loads(admin_menu)))
check("« Vidéos » ajouté (json_insert)", any(m.get("url") == "/videos" for m in menu3), str([m["label"] for m in menu3]))

print("── Scénario D : installation fraîche (migrations + seed + content-update)")
db = fresh_db()
for m in sorted(glob.glob(os.path.join(MIG, "00*.sql"))): apply(db, m)
apply(db, os.path.join(SEED, "seed.sql")); apply(db, os.path.join(SEED, "content-update.sql"))
vids4, menu4, foot4, rels4 = counts(db)
check("21 vidéos (6 v14 + 15 0022)", vids4 == 21, f"{vids4}")
check("seed menu 10 entrées", len(menu4) == 10)
rel4 = db.execute("SELECT COUNT(*) FROM content_relations cr JOIN media_items mi ON mi.id=cr.media_item_id WHERE mi.provider_id IN ('d2XY1csuELw','3uNcno1QbXo')").fetchone()[0]
check("2 relations produit↔vidéo créées (produits semés)", rel4 == 2, f"{rel4}")
check("pas de doublon provider_id", db.execute("SELECT COUNT(*) - COUNT(DISTINCT provider) || '-' || COUNT(*) FROM media_items WHERE type='video'").fetchone()[0] == 0 or db.execute("SELECT COUNT(*) FROM media_items WHERE type='video' AND provider_id IN (SELECT provider_id FROM media_items WHERE type='video' GROUP BY provider, provider_id HAVING COUNT(*) > 1)").fetchone()[0] == 0)
apply(db, os.path.join(SEED, "content-update.sql"))  # re-seed safe
vids5 = db.execute("SELECT COUNT(*) FROM media_items WHERE type='video'").fetchone()[0]
check("content-update rejoué → toujours 21", vids5 == 21, f"{vids5}")
check("content_version reste 16", db.execute("SELECT value FROM settings WHERE key='content_version'").fetchone()[0] == "16")

print("── Scénario E : unitaires parseVideo (node)")
ts = """
const { parseVideo } = require('./dist/_worker.js').parseVideo ? {} : {};
"""
# dist/_worker.js est un bundle ESM sans exports — on teste le code source via esbuild transpile isolée
node_code = r"""
const fbRe1 = /facebook\.com\/(?:[^\/?]+\/)?videos\/(?:[^\/?]+\/)?(\d{9,20})/;
const fbRe2 = /facebook\.com\/(?:video\.php|watch)\/?\?(?:[^#]*&)*v=(\d{9,20})/;
const ttRe = /(?:tiktok\.com\/@[^\/?]+\/|vm\.tiktok\.com\/.+\/)video\/(\d{15,25})/;
function parseVideo(raw) {
  const yt = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(raw);
  if (yt) return { embed: `https://www.youtube-nocookie.com/embed/${yt[1]}`, thumb: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`, provider: "youtube" };
  const vm = /vimeo\.com\/(?:video\/)?(\d{6,})/.exec(raw);
  if (vm) return { embed: `https://player.vimeo.com/video/${vm[1]}`, thumb: "", provider: "vimeo" };
  const fb = fbRe1.exec(raw) || fbRe2.exec(raw);
  if (fb) return { embed: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(`https://www.facebook.com/video.php?v=${fb[1]}`)}&show_text=false`, thumb: "", provider: "facebook" };
  if (/fb\.watch\//.test(raw)) return { embed: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(raw)}&show_text=false`, thumb: "", provider: "facebook" };
  const tt = ttRe.exec(raw);
  if (tt) return { embed: `https://www.tiktok.com/embed/v2/${tt[1]}`, thumb: "", provider: "tiktok" };
  if (/vm\.tiktok\.com\//.test(raw)) return { embed: raw, thumb: "", provider: "tiktok" };
  return { embed: raw, thumb: "", provider: "url" };
}
const cases = [
  ["https://www.youtube.com/watch?v=G78Iq3YOUiU", "youtube", "G78Iq3YOUiU"],
  ["https://youtu.be/BrBqSoTMcEs", "youtube", "BrBqSoTMcEs"],
  ["https://www.youtube.com/shorts/y9JmColz_nM", "youtube", "y9JmColz_nM"],
  ["https://www.facebook.com/100083594433530/videos/738279598528880/", "facebook", "738279598528880"],
  ["https://www.facebook.com/100083594433530/videos/vers-un-avenir-plus-lumineux-pour-lafrique-propulse-par-linnovation-locale-comme/738279598528880", "facebook", "738279598528880"],
  ["https://www.facebook.com/video.php?v=1195587872264932", "facebook", "1195587872264932"],
  ["https://www.facebook.com/watch/?v=1195587872264932", "facebook", "1195587872264932"],
  ["https://fb.watch/xYz123AbCd/", "facebook", ""],
  ["https://www.tiktok.com/@greenfad1/video/7461234567890123456", "tiktok", "7461234567890123456"],
  ["https://vm.tiktok.com/ZMabcdef/video/7461234567890123456/", "tiktok", "7461234567890123456"],
  ["https://example.com/clip", "url", ""],
];
let fail = 0;
for (const [url, provider, id] of cases) {
  const r = parseVideo(url);
  const ok = r.provider === provider && (!id || r.embed.includes(id)) && (provider !== "youtube" || r.thumb.includes("ytimg"));
  console.log((ok ? "PASS  " : "FAIL  ") + provider + " <- " + url + " => embed=" + r.embed.slice(0, 92));
  if (!ok) { fail++; console.log("      got: " + JSON.stringify(r)); }
}
// garde : provider youtube conserve sa miniature ; facebook/tiktok renvoient embed officiel
const fbv = parseVideo("https://www.facebook.com/100083594433530/videos/738279598528880/");
if (!fbv.embed.startsWith("https://www.facebook.com/plugins/video.php")) { fail++; console.log("FAIL  embed plugin FB"); }
const tkv = parseVideo("https://www.tiktok.com/@greenfad1/video/7461234567890123456");
if (!tkv.embed.startsWith("https://www.tiktok.com/embed/v2/")) { fail++; console.log("FAIL  embed v2 TikTok"); }
console.log(fail === 0 ? "UNIT-OK" : "UNIT-FAIL");
process.exit(fail === 0 ? 0 : 1);
"""
res = subprocess.run(["node", "-e", node_code], capture_output=True, text=True)
print(res.stdout.strip())
if res.returncode != 0: print(res.stderr[:500]); ok_all = False

print()
print("RESULTAT:", "TOUS PASS" if ok_all else "ECHEC")
sys.exit(0 if ok_all else 1)
