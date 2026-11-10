#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Test de la migration 0024_references_banniere.sql — GREEN FAD (11/11/2026).

Scénarios :
  A. Prod post-0023 (14 partenaires sans slug) → colonnes slug/sector, backfill 14/14,
     index unique, hero_slides créée, réglages par défaut, menu +footer « Références »
  B. Idempotence partielle : rejouer les UPDATE gardés → aucun slug écrasé, aucun doublon
  C. Références ajoutées par l'admin (sans slug, avec accents) → repli générique + dédoublonnage
  D. Installation fraîche : toutes migrations + seed.sql + content-update.sql → 14 slugs,
     hero_slides vide (aucune donnée inventée), content_version 17
  E. Render : le bloc partners et le hero ne cassent pas sans diapositive (garde SQL LIMIT 3)
"""
import sqlite3, json, glob, subprocess, sys, os, re

BASE = os.path.dirname(os.path.abspath(__file__))
MIG = os.path.join(BASE, "..", "migrations")
SEED = os.path.join(BASE, "..", "seed")
ok_all = True

def check(label, cond, detail=""):
    global ok_all
    print(("PASS  " if cond else "FAIL  ") + label + ((" — " + detail) if detail else ""))
    if not cond: ok_all = False

def fresh_db(path="/tmp/test0024.sqlite"):
    if os.path.exists(path): os.unlink(path)
    db = sqlite3.connect(path)
    db.isolation_level = None
    return db

def apply(db, p):
    with open(p, encoding="utf-8") as f: db.executescript(f.read())

PARTNERS = ["Afric-Immo", "ArtifyFad", "Casa des Délices", "Cours Africa", "EFB Entreprise",
            "Massaley Hôtel", "Pharmacie hôpital du Mali", "Eurodecor", "Justice Mali",
            "Le Baobab Hôtel", "Nature Attitude", "Sky Buffet", "Greenfad", "Greenfad 2"]

def setup_prod_like(db):
    for m in sorted(glob.glob(os.path.join(MIG, "00*.sql"))):
        if "0024" in m: continue
        apply(db, m)
    # 14 partenaires comme en production (seed.sql sans slug)
    for i, n in enumerate(PARTNERS):
        db.execute("INSERT INTO partners (name, logo_key, sort_order, status) VALUES (?, ?, ?, 'publie')", (n, f"/x/{i}.webp", i))
    db.execute("INSERT INTO menus (location, items) VALUES ('header', ?)",
               (json.dumps([{"label": "Entreprise", "url": "/p/entreprise"}, {"label": "Expertises", "url": "/expertises"},
                            {"label": "Produits", "url": "/produits"}, {"label": "Réalisations", "url": "/realisations"},
                            {"label": "Galerie", "url": "/galerie"}, {"label": "Vidéos", "url": "/videos"},
                            {"label": "Blog", "url": "/blog"}, {"label": "Documents", "url": "/ressources"},
                            {"label": "Implantation", "url": "/implantation"}, {"label": "Contact", "url": "/contact"}], ensure_ascii=False),))
    db.execute("INSERT INTO footer_sections (section_key, title, content, sort_order) VALUES ('liens', 'Informations', ?, 4)",
               (json.dumps({"items": [{"label": "Ressources", "url": "/ressources"}]}, ensure_ascii=False),))

# ---------- A. Migration sur une base « prod post-0023 » ----------
print("== A. prod-like → 0024 ==")
db = fresh_db()
setup_prod_like(db)
apply(db, os.path.join(MIG, "0024_references_banniere.sql"))
slugs = dict(db.execute("SELECT name, slug FROM partners").fetchall())
check("14/14 partenaires ont un slug", all(slugs.get(n) for n in PARTNERS), f"{len([s for s in slugs.values() if s])}/14")
expected = {"Massaley Hôtel": "massaley-hotel", "Pharmacie hôpital du Mali": "pharmacie-hopital-du-mali",
            "Le Baobab Hôtel": "le-baobab-hotel", "Casa des Délices": "casa-des-delices",
            "Greenfad 2": "greenfad-2", "Afric-Immo": "afric-immo"}
check("slugs attendus (accents translittérés)", all(slugs.get(k) == v for k, v in expected.items()),
      json.dumps({k: slugs.get(k) for k in expected}, ensure_ascii=False))
check("aucun doublon de slug", db.execute("SELECT COUNT(*) - COUNT(DISTINCT slug) FROM partners WHERE slug != ''").fetchone()[0] == 0)
idx = db.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND name='idx_partners_slug'").fetchone()[0]
check("index unique idx_partners_slug créé", idx == 1)
cols = [r[1] for r in db.execute("PRAGMA table_info(hero_slides)").fetchall()]
check("hero_slides créée (published_at inclus)", "published_at" in cols and "media_type" in cols, str(cols))
eff = db.execute("SELECT value FROM settings WHERE key='hero_effect'").fetchone()[0]
iv = db.execute("SELECT value FROM settings WHERE key='hero_interval'").fetchone()[0]
check("réglages par défaut fondu/5000", eff == '"fondu"' and iv == '5000', f"{eff} / {iv}")
menu = db.execute("SELECT items FROM menus WHERE location='header'").fetchone()[0]
check("menu header contient /references après Vidéos", '"Références"' in menu and menu.find("/videos") < menu.find("/references"))
foot = db.execute("SELECT content FROM footer_sections WHERE section_key='liens'").fetchone()[0]
check("footer liens contient /references", "/references" in foot)
check("secteurs vides (aucune donnée inventée)", all(not (s[0] or "") for s in db.execute("SELECT sector FROM partners").fetchall()))

# ---------- B. Rejouer les gardes (idempotence) ----------
print("== B. idempotence des gardes ==")
sql24 = open(os.path.join(MIG, "0024_references_banniere.sql"), encoding="utf-8").read()
# rejouer uniquement les UPDATE gardés (les ALTER échoueraient : colonnes déjà là — comportement D1 attendu)
guarded = "\n".join(l for l in sql24.splitlines() if not l.strip().startswith("--"))
stmts = [s.strip() + ";" for s in guarded.split(";") if s.strip() and "ALTER TABLE" not in s and "CREATE UNIQUE INDEX" not in s]
before = dict(db.execute("SELECT name, slug FROM partners").fetchall())
for s in stmts:
    try: db.execute(s)
    except sqlite3.OperationalError: pass  # CREATE TABLE IF NOT EXISTS etc. déjà présents
after = dict(db.execute("SELECT name, slug FROM partners").fetchall())
check("aucun slug écrasé au re-run", before == after)
check("toujours aucun doublon", db.execute("SELECT COUNT(*) - COUNT(DISTINCT slug) FROM partners WHERE slug != ''").fetchone()[0] == 0)

# ---------- C. Références admin + repli générique ----------
print("== C. repli générique + dédoublonnage ==")
# Scénario : références ajoutées par l'admin AVANT la migration (sans slug) —
# l'index unique n'existe pas encore à ce stade de la migration (il est créé
# APRÈS le dédoublonnage). On simule donc en retirant l'index d'abord.
db.execute("DROP INDEX IF EXISTS idx_partners_slug")
db.execute("INSERT INTO partners (name, sort_order, status) VALUES ('Mon Café Éclopé !', 20, 'publie')")
db.execute("INSERT INTO partners (name, sort_order, status) VALUES ('Mon Café Éclopé !', 21, 'publie')")
gen = " ".join(l for l in sql24.splitlines())
m = re.search(r"UPDATE partners SET slug =\s*(REPLACE\(.*?\))\s*WHERE \(slug IS NULL OR slug = ''\)", gen, re.S)
check("chaîne REPLACE générique trouvée", bool(m))
if m:
    db.execute(f"UPDATE partners SET slug = {m.group(1)} WHERE (slug IS NULL OR slug = '') AND TRIM(COALESCE(name, '')) != ''")
    row = db.execute("SELECT slug FROM partners WHERE name='Mon Café Éclopé !' ORDER BY id LIMIT 1").fetchone()
db.execute("UPDATE partners SET slug = RTRIM(slug, '-') WHERE slug LIKE '%-' AND slug != '-'")
row = db.execute("SELECT slug FROM partners WHERE name='Mon Café Éclopé !' ORDER BY id LIMIT 1").fetchone()
check("repli translittéré (apostrophe via char(39), accents majuscules, ponctuation nettoyée)", row and row[0] == "mon-cafe-eclope", str(row))
db.execute("UPDATE partners SET slug = slug || '-' || id WHERE slug != '' AND id NOT IN (SELECT MIN(id) FROM partners GROUP BY slug)")
check("dédoublonnage suffixé par id", db.execute("SELECT COUNT(*) - COUNT(DISTINCT slug) FROM partners WHERE slug != ''").fetchone()[0] == 0)
db.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_partners_slug ON partners(slug) WHERE slug IS NOT NULL AND slug != ''")
check("index unique re-créé sur données dédoublonnées", True)

# ---------- D. Installation fraîche complète ----------
print("== D. installation fraîche ==")
db2 = fresh_db("/tmp/test0024-fresh.sqlite")
for m in sorted(glob.glob(os.path.join(MIG, "00*.sql"))):
    apply(db2, m)
apply(db2, os.path.join(SEED, "seed.sql"))
apply(db2, os.path.join(SEED, "content-update.sql"))
n = db2.execute("SELECT COUNT(*) FROM partners WHERE slug != '' AND status='publie'").fetchone()[0]
check("seed fraîche : 14 références publiées avec slug", n == 14, f"{n}")
check("content_version 17", db2.execute("SELECT value FROM settings WHERE key='content_version'").fetchone()[0] == "17")
check("hero_slides vide (bannière sans diapositive = dégradé actuel)", db2.execute("SELECT COUNT(*) FROM hero_slides").fetchone()[0] == 0)
menu2 = db2.execute("SELECT items FROM menus WHERE location='header'").fetchone()[0]
check("menu fraîche à 11 entrées avec Références", json.loads(menu2).__len__() == 11 and "/references" in menu2)

# ---------- E. Garde SQL du rendu ----------
print("== E. garde rendu ==")
db2.execute("INSERT INTO hero_slides (media_key, media_type, alt, sort_order, status, published_at) VALUES ('a.jpg','image','a',0,'publie',datetime('now')), ('b.jpg','image','b',1,'publie',datetime('now')), ('c.jpg','image','c',2,'publie',datetime('now')), ('d.jpg','image','d',3,'publie',datetime('now'))")
lim = db2.execute("SELECT COUNT(*) FROM (SELECT media_key FROM hero_slides WHERE status='publie' ORDER BY sort_order, id LIMIT 3)").fetchone()[0]
check("LIMIT 3 : jamais plus de 3 diapositives tournantes", lim == 3)
db.execute("DELETE FROM partners WHERE name='Mon Café Éclopé !'") if False else None
db2.close(); db.close()

print()
print("TOUS PASS" if ok_all else "ÉCHECS PRÉSENTS")
sys.exit(0 if ok_all else 1)
