import os
import re

def extract_section(content, start_tag, end_tag):
    """Extrait une section du contenu HTML entre deux balises."""
    start_match = re.search(start_tag, content, re.DOTALL)
    end_match = re.search(end_tag, content, re.DOTALL)
    
    if start_match and end_match:
        return content[start_match.start():end_match.end()]
    return None

def update_page(filepath, base_head_content, header_content, footer_content):
    """Met à jour le contenu <head>, <header> et <footer> d'une page."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Mise à jour du <head>
    # Conserver le <title> et les meta spécifiques à la page
    title_match = re.search(r'<title>(.*?)</title>', content, re.DOTALL)
    page_title = title_match.group(0) if title_match else "<title>Greenfad</title>"
    
    # Remplacer tout le <head> par le nouveau contenu
    # On reconstruit le <head> avec le title spécifique et le reste du contenu de base
    new_head_content = f"""
    <head>
        {page_title}
        {base_head_content}
    </head>
    """
    
    # Remplacer l'ancien <head> par le nouveau
    content = re.sub(r'<head>.*?</head>', new_head_content, content, flags=re.DOTALL)
    
    # 2. Mise à jour du <header>
    content = re.sub(r'<header.*?>.*?</header>', header_content, content, flags=re.DOTALL)

    # 3. Mise à jour du <footer>
    # On cherche le <footer> qui est souvent à la fin du <body>
    content = re.sub(r'<footer.*?>.*?</footer>', footer_content, content, flags=re.DOTALL)

    # 4. Écrire le nouveau contenu
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated: {filepath}")

# Fichiers à mettre à jour
files_to_update = [
    '404.html',
    'careers.html',
    'cgv.html',
    'documentation.html',
    'faq.html',
    'mentions-legales.html',
    'politique-de-confidentialite.html',
    'support-technique.html'
]

# 1. Lire le contenu de la page d'accueil
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# 2. Extraire les sections de référence
# Extraire le contenu du <head> (sans les balises <head>)
head_match = re.search(r'<head>(.*?)</head>', index_content, re.DOTALL)
if head_match:
    # On garde tout le contenu du head, mais on va le nettoyer après
    full_head_content = head_match.group(1)
    
    # On enlève le <title> et les meta description/keywords/og pour les conserver dans les pages spécifiques
    head_lines = full_head_content.split('\n')
    filtered_head_lines = []
    for line in head_lines:
        # On exclut les balises qui doivent être spécifiques à la page
        if not re.search(r'<(title|meta property="og:|meta name="(description|keywords)")', line):
            filtered_head_lines.append(line)
    
    # On enlève les lignes vides
    filtered_head_lines = [line.strip() for line in filtered_head_lines if line.strip()]
    
    # On ajoute les balises de base qui sont souvent manquantes dans les autres pages
    base_head_content = "\n".join(filtered_head_lines)
else:
    base_head_content = ""

# Extraire le <header> complet
header_content = extract_section(index_content, r'<header class="header">', r'</header>')

# Extraire le <footer> complet (en supposant qu'il est à la fin du body)
# On va chercher le <footer> qui est souvent à la fin du <body>
footer_match = re.search(r'<footer.*?>.*?</footer>', index_content, re.DOTALL)
footer_content = footer_match.group(0) if footer_match else None

if not header_content:
    print("Erreur: Impossible de trouver la balise <header> dans index.html")
    exit()

if not footer_content:
    print("Erreur: Impossible de trouver la balise <footer> dans index.html")
    exit()

# 3. Mettre à jour les fichiers
for file in files_to_update:
    if os.path.exists(file):
        update_page(file, base_head_content, header_content, footer_content)
    else:
        print(f"File not found: {file}")

# 4. Ajouter le script JS pour le menu mobile à toutes les pages
js_script_tag = '<script src="assets/js/main.js"></script>'

for file in files_to_update:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # S'assurer que le script est présent avant la fermeture de </body>
        if js_script_tag not in content:
            content = content.replace('</body>', f'  {js_script_tag}\n</body>')
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Added main.js to: {file}")

