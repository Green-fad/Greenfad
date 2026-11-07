#!/usr/bin/env python3
"""Audit Greenfad : vérification des références internes cassées (images, css, js, pages)."""
import re, os, sys
from collections import defaultdict

ROOT = "/home/z/my-project/greenfad"
html_files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d != ".git"]
    for f in filenames:
        if f.endswith(".html"):
            html_files.append(os.path.join(dirpath, f))

broken = defaultdict(list)
checked = 0
attr_re = re.compile(r'''(?:src|href)\s*=\s*["']([^"']+)["']''')

for hf in sorted(html_files):
    rel = os.path.relpath(hf, ROOT)
    with open(hf, encoding="utf-8", errors="replace") as fh:
        content = fh.read()
    for m in attr_re.finditer(content):
        url = m.group(1).strip()
        checked += 1
        if url.startswith(("http", "//", "mailto:", "tel:", "#", "javascript:", "data:")):
            continue
        # sépare query string / ancre
        path = url.split("?")[0].split("#")[0]
        if not path:
            continue
        # résout relatif
        target = os.path.normpath(os.path.join(os.path.dirname(hf), path) if not path.startswith("/") else os.path.join(ROOT, path.lstrip("/")))
        if not os.path.exists(target):
            broken[rel].append(url)

print(f"Fichiers HTML analysés : {len(html_files)}")
print(f"Références locales vérifiées : {checked}")
print(f"Fichiers avec références cassées : {len(broken)}")
total_broken = sum(len(v) for v in broken.values())
print(f"Références cassées au total : {total_broken}\n")
for f in sorted(broken):
    print(f"[{f}]")
    for u in sorted(set(broken[f])):
        print(f"   - {u}")
