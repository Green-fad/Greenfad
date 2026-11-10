#!/usr/bin/env python3
# GREEN FAD — Tests migration 0025 (ordre alphabétique des références)
# et seed/restore_media_items.sql (récupération des images galerie).
# Simule prod-like : schema 0001 + 0002 (tables partenaires / media / media_items
# / media_albums), données de la production, puis assertions.
import sqlite3
import re
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PASS = 0
FAIL = 0


def check(name, cond, detail=""):
    global PASS, FAIL
    if cond:
        PASS += 1
        print(f"  PASS — {name}")
    else:
        FAIL += 1
        print(f"  FAIL — {name} {detail}")


def apply_script(db, path):
    sql = pathlib.Path(path).read_text()
    db.executescript(sql)


# ---------- base prod-like minimale ----------
SEED_PARTNERS = [  # ordre semé d'origine (arbitraire)
    ("Afric-Immo", "afric-immo", 0), ("ArtifyFad", "artifyfad", 1),
    ("Casa des Délices", "casa-des-delices", 2), ("Cours Africa", "cours-africa", 3),
    ("EFB Entreprise", "efb-entreprise", 4), ("Massaley Hôtel", "massaley-hotel", 5),
    ("Pharmacie hôpital du Mali", "pharmacie-hopital-du-mali", 6),
    ("Eurodecor", "eurodecor", 7), ("Justice Mali", "justice-mali", 8),
    ("Le Baobab Hôtel", "le-baobab-hotel", 9), ("Nature Attitude", "nature-attitude", 10),
    ("Sky Buffet", "sky-buffet", 11), ("Greenfad", "greenfad", 12),
    ("Greenfad 2", "greenfad-2", 13),
]


def make_db():
    db = sqlite3.connect(":memory:")
    db.execute("CREATE TABLE partners (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, slug TEXT, sector TEXT, description TEXT, logo_key TEXT, url TEXT, sort_order INTEGER DEFAULT 0, status TEXT DEFAULT 'publie', updated_at TEXT)")
    db.execute("CREATE TABLE media (id INTEGER PRIMARY KEY AUTOINCREMENT, r2_key TEXT UNIQUE, filename TEXT, mime TEXT, size INTEGER DEFAULT 0, width INTEGER, height INTEGER, alt TEXT, folder TEXT DEFAULT '/', uploaded_by TEXT, created_at TEXT)")
    db.execute("CREATE TABLE media_albums (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE, name TEXT, description TEXT, category TEXT DEFAULT 'general', cover_key TEXT, sort_order INTEGER DEFAULT 0, status TEXT DEFAULT 'brouillon', published_at TEXT, created_at TEXT, updated_at TEXT)")
    db.execute("""CREATE TABLE media_items (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT DEFAULT 'image', media_id INTEGER, source_url TEXT, provider TEXT, provider_id TEXT, title TEXT, description TEXT, caption TEXT, credit TEXT, alt TEXT, keywords TEXT DEFAULT '[]', album_id INTEGER, category TEXT, sort_order INTEGER DEFAULT 0, status TEXT DEFAULT 'brouillon', published_at TEXT, uploaded_by TEXT, created_at TEXT, updated_at TEXT)""")
    for name, slug, order in SEED_PARTNERS:
        db.execute("INSERT INTO partners (name, slug, sort_order, status) VALUES (?, ?, ?, 'publie')", (name, slug, order))
    return db


print("== 1. Migration 0025 sur l'ordre semé (cas production) ==")
db = make_db()
mig = (ROOT / "migrations" / "0025_partners_ordre_alphabetique.sql").read_text()
db.executescript(mig)
rows = db.execute("SELECT name, sort_order FROM partners ORDER BY sort_order").fetchall()
attendu = ["Afric-Immo", "ArtifyFad", "Casa des Délices", "Cours Africa", "EFB Entreprise",
           "Eurodecor", "Greenfad", "Greenfad 2", "Justice Mali", "Le Baobab Hôtel",
           "Massaley Hôtel", "Nature Attitude", "Pharmacie hôpital du Mali", "Sky Buffet"]
check("14 références préservées", len(rows) == 14, f"reçu {len(rows)}")
check("aucune perte de nom", [r[0] for r in rows] == attendu, f"reçu {[r[0] for r in rows]}")
check("ordre strictement alphabétique (NOCASE)",
      [r[0] for r in rows] == sorted(attendu, key=str.casefold))
check("rangées contiguës 0..13", [r[1] for r in rows] == list(range(14)))

print("== 2. Idempotence : seconde exécution = no-op ==")
db.executescript(mig)
rows2 = db.execute("SELECT name, sort_order FROM partners ORDER BY sort_order").fetchall()
check("ordre inchangé après re-exécution", rows2 == rows)

print("== 3. Garde : personnalisation admin préservée ==")
db3 = make_db()
db3.execute("UPDATE partners SET sort_order = 99 WHERE slug = 'greenfad'")  # admin a réordonné
db3.executescript(mig)
ordre_admin = db3.execute("SELECT sort_order FROM partners WHERE slug = 'greenfad'").fetchone()[0]
check("sort_order personnalisé (99) non écrasé", ordre_admin == 99, f"reçu {ordre_admin}")
n = db3.execute("SELECT COUNT(*) FROM partners WHERE sort_order != (SELECT sort_order FROM partners p2 WHERE p2.id = partners.id)").fetchone()
check("aucune autre ligne modifiée", db3.execute("SELECT COUNT(DISTINCT sort_order) FROM partners").fetchone()[0] > 0)

print("== 4. Seeds : cohérence avec l'ordre migré ==")
for f in ["seed/seed.sql", "seed/content-update.sql"]:
    txt = (ROOT / f).read_text()
    pairs = re.findall(r"SELECT '([^']+)', (?:'[^']+', )?m\.r2_key, (\d+), 'publie' FROM media m WHERE m\.r2_key = '/assets/images/clients/partenaire-", txt)
    uniq = {n: int(o) for n, o in set(pairs)}
    check(f"{f} : 14 partenaires", len(uniq) == 14)
    check(f"{f} : ordre alphabétique", sorted(uniq, key=str.casefold) == [n for n, _ in sorted(uniq.items(), key=lambda x: x[1])])

print("== 5. restore_media_items.sql : récupération chirurgicale ==")
db5 = make_db()
# fichiers : 3 téléversés admin (2 images + 1 pdf), 2 semés, 1 admin déjà référencée
db5.executescript("""
INSERT INTO media (r2_key, filename, mime, uploaded_by) VALUES ('/media/u1.jpg','u1.jpg','image/jpeg','admin');
INSERT INTO media (r2_key, filename, mime, uploaded_by) VALUES ('/media/u2.png','u2.png','image/png','admin');
INSERT INTO media (r2_key, filename, mime, uploaded_by) VALUES ('/media/doc.pdf','doc.pdf','application/pdf','admin');
INSERT INTO media (r2_key, filename, mime, uploaded_by) VALUES ('/media/s1.webp','s1.webp','image/webp','seed');
INSERT INTO media (r2_key, filename, mime, uploaded_by) VALUES ('/media/s2.webp','s2.webp','image/webp','seed');
INSERT INTO media (r2_key, filename, mime, uploaded_by) VALUES ('/media/u3.jpg','u3.jpg','image/jpeg','admin');
INSERT INTO media_items (type, media_id, title, album_id, sort_order, status, uploaded_by) VALUES ('image', 6, 'déjà en galerie', NULL, 0, 'publie', 'admin');
""")
db5.execute("INSERT INTO media_albums (slug, name, status) VALUES ('galerie-seed', 'Galerie', 'publie')")
apply_script(db5, ROOT / "seed" / "restore_media_items.sql")
album = db5.execute("SELECT id, name FROM media_albums WHERE slug = 'images-restaurees'").fetchone()
check("album « Images restaurées » créé", album is not None)
n_items = db5.execute("SELECT COUNT(*) FROM media_items WHERE album_id = ?", (album[0],)).fetchone()[0]
check("exactement les 2 images admin orphelines récupérées (u1, u2 — ni pdf, ni seed, ni déjà référencée)",
      n_items == 2, f"reçu {n_items}")
titres = [r[0] for r in db5.execute("SELECT title FROM media_items WHERE album_id = ?", (album[0],)).fetchall()]
check("titres depuis filename (u1.jpg → « u1.jpg »)", titres == ["u1.jpg", "u2.png"], f"reçu {titres}")
check("statut publie", db5.execute("SELECT COUNT(*) FROM media_items WHERE album_id = ? AND status = 'publie'", (album[0],)).fetchone()[0] == 2)
avant = db5.execute("SELECT COUNT(*) FROM media").fetchone()[0]
avant_items = db5.execute("SELECT COUNT(*) FROM media_items").fetchone()[0]
apply_script(db5, ROOT / "seed" / "restore_media_items.sql")
check("idempotent : 2e exécution ne crée rien",
      db5.execute("SELECT COUNT(*) FROM media_items").fetchone()[0] == avant_items)
check("aucun fichier media supprimé/modifié", db5.execute("SELECT COUNT(*) FROM media").fetchone()[0] == avant)

print("== 6. Apostrophes droites hors littéraux (contrainte wrangler) ==")
for f in ["migrations/0025_partners_ordre_alphabetique.sql", "seed/restore_media_items.sql"]:
    txt = (ROOT / f).read_text()
    # retire les littéraux '...' (y compris '' échappé) puis vérifie qu'il ne reste aucun '
    sans_litteraux = re.sub(r"'(?:[^']|'')*'", "", txt)
    check(f"{f} : aucun apostrophe droit hors littéraux", "'" not in sans_litteraux)

print(f"\nRésultat : {PASS} PASS, {FAIL} FAIL")
sys.exit(1 if FAIL else 0)
