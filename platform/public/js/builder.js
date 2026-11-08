// GREEN FAD — Page Builder : gestion des blocs, édition, sauvegarde, publication, aperçu 3 devices
(function () {
  "use strict";

  var root = document.querySelector(".builder");
  if (!root) return;
  var pageId = root.getAttribute("data-page-id");
  var readonly = root.hasAttribute("data-readonly");
  var csrf = window.GF_CSRF;
  var list = root.querySelector("[data-blocks-list]");
  var formZone = root.querySelector("[data-block-form]");
  var frame = root.querySelector("[data-preview-frame]");
  var preview = root.querySelector(".builder__preview");
  var selected = null;
  var blocks = [];

  // Champs éditables par type de bloc (moteur de formulaire du builder)
  var FIELDS = {
    hero: [
      { k: "eyebrow", label: "Sur-titre", t: "text" },
      { k: "title", label: "Titre principal", t: "text", req: true },
      { k: "subtitle", label: "Sous-titre", t: "textarea" },
      { k: "image_key", label: "Image de fond", t: "media" },
      { k: "cta_label", label: "Bouton 1 — texte", t: "text" },
      { k: "cta_url", label: "Bouton 1 — lien", t: "text" },
      { k: "cta2_label", label: "Bouton 2 — texte", t: "text" },
      { k: "cta2_url", label: "Bouton 2 — lien", t: "text" },
      { k: "variant", label: "Variante visuelle", t: "select", o: ["gradient", "dark", "image", "split"] },
    ],
    section_header: [
      { k: "eyebrow", label: "Sur-titre", t: "text" },
      { k: "title", label: "Titre de section", t: "text", req: true },
      { k: "text", label: "Texte d'introduction", t: "textarea" },
      { k: "align", label: "Alignement", t: "select", o: ["center", "left"] },
    ],
    richtext: [{ k: "content_md", label: "Contenu (markdown)", t: "textarea", big: true, req: true }],
    image: [
      { k: "image_key", label: "Image", t: "media", req: true },
      { k: "alt", label: "Texte alternatif", t: "text" },
      { k: "caption", label: "Légende", t: "text" },
      { k: "width", label: "Largeur", t: "select", o: ["contained", "full"] },
    ],
    gallery: [
      { k: "__items_images", label: "Images (une clé média par ligne)", t: "textarea", big: true },
      { k: "columns", label: "Colonnes", t: "number" },
    ],
    split: [
      { k: "title", label: "Titre", t: "text", req: true },
      { k: "text_md", label: "Texte (markdown)", t: "textarea", big: true },
      { k: "image_key", label: "Image", t: "media" },
      { k: "image_side", label: "Côté image", t: "select", o: ["right", "left"] },
      { k: "cta_label", label: "Bouton — texte", t: "text" },
      { k: "cta_url", label: "Bouton — lien", t: "text" },
    ],
    cards: [
      { k: "source", label: "Source des cartes", t: "select", o: ["products", "services", "posts", "projects", "countries", "manual"], req: true },
      { k: "limit", label: "Nombre maximum", t: "number" },
      { k: "columns", label: "Colonnes", t: "number" },
      { k: "__manual", label: "Cartes manuelles (si source=manual) — JSON [{title,text,image_key,url,icon}]", t: "textarea", big: true },
      { k: "view_all_label", label: "Lien « tout voir » — texte", t: "text" },
      { k: "view_all_url", label: "Lien « tout voir » — URL", t: "text" },
    ],
    stats: [{ k: "__items", label: "Chiffres (JSON [{value,label}]) — uniquement des chiffres RÉELS", t: "textarea", big: true }],
    cta: [
      { k: "title", label: "Titre", t: "text", req: true },
      { k: "text", label: "Texte", t: "textarea" },
      { k: "button_label", label: "Bouton — texte", t: "text", req: true },
      { k: "button_url", label: "Bouton — lien", t: "text" },
    ],
    contact_form: [
      { k: "title", label: "Titre", t: "text" },
      { k: "intro", label: "Introduction", t: "textarea" },
      { k: "form_type", label: "Type", t: "select", o: ["contact", "devis"] },
    ],
    faq: [
      { k: "category", label: "Catégorie (vide = toutes)", t: "text" },
      { k: "limit", label: "Nombre max", t: "number" },
    ],
    team: [{ k: "limit", label: "Nombre max", t: "number" }],
    partners: [{ k: "limit", label: "Nombre max", t: "number" }],
    testimonials: [{ k: "limit", label: "Nombre max", t: "number" }],
    countries_map: [],
    timeline: [
      { k: "title", label: "Titre", t: "text" },
      { k: "__items", label: "Jalons (JSON [{year,title,text}])", t: "textarea", big: true },
    ],
    video: [
      { k: "url", label: "URL YouTube", t: "text", req: true },
      { k: "title", label: "Titre affiché", t: "text" },
    ],
    document_list: [
      { k: "category", label: "Catégorie", t: "text" },
      { k: "limit", label: "Nombre max", t: "number" },
    ],
    embed: [{ k: "code", label: "Code HTML (réservé aux administrateurs)", t: "textarea", big: true, req: true }],
    spacer: [{ k: "height", label: "Hauteur", t: "select", o: ["small", "medium", "large"] }],
  };

  function summary(b) {
    return b.title || b.question || b.name || b.image_key || b.source || b.height || b.type || "";
  }

  function renderList() {
    list.innerHTML = "";
    if (!blocks.length) {
      list.innerHTML = '<div class="adm-empty">Page vide — ajoutez un premier bloc depuis le catalogue.</div>';
      return;
    }
    blocks.forEach(function (b, i) {
      var el = document.createElement("div");
      el.className = "bblock" + (b.visible === false ? " is-hidden" : "") + (b === selected ? " is-selected" : "");
      el.setAttribute("data-block-index", i);
      el.innerHTML =
        '<div class="bblock__head"><span class="bblock__num">' + (i + 1) + "</span>" +
        "<strong>" + b.type + "</strong>" +
        '<em class="bblock__summary">' + String(summary(b)).replace(/[<>&]/g, "").slice(0, 60) + "</em>" +
        '<span class="bblock__tools">' +
        '<button type="button" title="Monter" data-move="-1"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform:scaleX(-1)"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>' +
        '<button type="button" title="Descendre" data-move="1"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>' +
        '<button type="button" title="Dupliquer" data-duplicate><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>' +
        '<button type="button" title="Afficher/Masquer" data-toggle-vis><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button>' +
        '<button type="button" title="Supprimer" data-remove class="danger"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></span></div>';
      el.addEventListener("click", function (e) {
        if (e.target.closest("[data-move]")) {
          var d = parseInt(e.target.getAttribute("data-move"), 10);
          var j = i + d;
          if (j >= 0 && j < blocks.length) { var tmp = blocks[i]; blocks[i] = blocks[j]; blocks[j] = tmp; renderList(); }
          return;
        }
        if (e.target.closest("[data-duplicate]")) {
          blocks.splice(i + 1, 0, JSON.parse(JSON.stringify(blocks[i])));
          renderList();
          return;
        }
        if (e.target.closest("[data-toggle-vis]")) {
          blocks[i].visible = blocks[i].visible === false ? true : false;
          renderList();
          return;
        }
        if (e.target.closest("[data-remove]")) {
          if (window.confirm("Supprimer ce bloc ?")) { blocks.splice(i, 1); renderList(); }
          return;
        }
        select(blocks[i]);
      });
      list.appendChild(el);
    });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function select(b) {
    selected = b;
    renderList();
    if (!b) { formZone.innerHTML = ""; return; }
    var fields = FIELDS[b.type] || [];
    var html = "";
    fields.forEach(function (f) {
      var v = b[f.k];
      if (f.k === "__items_images") v = (b.items || []).map(function (it) { return it.image_key || ""; }).join("\n");
      if (f.k === "__items" || f.k === "__manual") v = v ? JSON.stringify(v, null, 2) : (f.k === "__manual" ? "[]" : "[]");
      var closeLabel = true;
      html += '<label>' + esc(f.label) + (f.req ? " *" : "");
      if (f.t === "select") {
        html += '<select data-fk="' + f.k + '">' + (f.o || []).map(function (o) { return '<option ' + (b[f.k] === o || (!b[f.k] && o === (f.o[0])) ? "selected" : "") + ">" + o + "</option>"; }).join("") + "</select>";
      } else if (f.t === "textarea") {
        html += '<textarea data-fk="' + f.k + '" rows="' + (f.big ? 8 : 3) + '">' + esc(typeof v === "string" ? v : v == null ? "" : JSON.stringify(v)) + "</textarea>";
      } else if (f.t === "number") {
        html += '<input type="number" data-fk="' + f.k + '" value="' + esc(v == null ? "" : v) + '">';
      } else if (f.t === "media") {
        closeLabel = false;
        var sv = String(v == null ? "" : v);
        var msrc = sv ? (sv.indexOf("/") === 0 ? sv : "/media/" + sv) : "";
        html += '</label><div class="adm-field adm-field--media" data-media-field>' +
          '<div class="media-pick">' +
          '<img src="' + esc(msrc) + '" alt="" class="media-pick__thumb' + (sv ? "" : " is-empty") + '" data-media-thumb>' +
          '<div class="media-pick__main"><input data-fk="' + f.k + '" value="' + esc(sv) + '" placeholder="Téléversez une image depuis votre appareil, ou choisissez dans la bibliothèque" data-media-input>' +
          '<div class="media-pick__btns">' +
          '<button type="button" class="btn btn--sm btn--primary" data-media-upload>Téléverser</button>' +
          '<button type="button" class="btn btn--sm" data-media-open>Choisir</button>' +
          '<button type="button" class="btn btn--sm" data-media-clear>Retirer</button>' +
          '</div></div></div>';
      } else {
        html += '<input data-fk="' + f.k + '" value="' + esc(v == null ? "" : v) + '">';
      }
      if (closeLabel) html += "</label>";
    });
    if (!fields.length) html = '<p class="muted">Ce bloc n\'a pas d\'option.</p>';
    formZone.innerHTML = html;
    formZone.querySelectorAll("[data-fk]").forEach(function (inp) {
      inp.addEventListener("input", function () {
        var k = inp.getAttribute("data-fk");
        var val = inp.value;
        if (k === "__items_images") {
          b.items = val.split("\n").map(function (l) { return { image_key: l.trim() }; }).filter(function (it) { return it.image_key; });
          b.columns = b.columns || 3;
        } else if (k === "__items" || k === "__manual") {
          try { b[k === "__manual" ? "items" : "items"] = JSON.parse(val || "[]"); } catch (e) { /* invalid JSON : ne sauvegardera pas */ }
        } else if (k === "columns" || k === "limit") {
          b[k] = Math.max(1, parseInt(val || "3", 10) || (k === "limit" ? 6 : 3));
        } else {
          b[k] = val;
        }
      });
    });
  }

  // Catalogue : ajout de blocs
  root.querySelectorAll("[data-add-block]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (readonly) return;
      var t = btn.getAttribute("data-add-block");
      var nb = { type: t, visible: true };
      var defaults = { hero: { title: "Nouveau titre", variant: "gradient" }, section_header: { title: "Nouvelle section" }, cta: { title: "Prêt à démarrer ?", button_label: "Nous contacter", button_url: "/contact" }, split: { title: "Nouvelle section" }, stats: { items: [] }, timeline: { items: [] }, gallery: { items: [], columns: 3 }, cards: { source: "products", limit: 6, columns: 3, items: [] } };
      if (defaults[t]) Object.assign(nb, defaults[t]);
      blocks.push(nb);
      select(nb);
      list.scrollTop = list.scrollHeight;
    });
  });

  // Sauvegarde
  function save(publish) {
    if (readonly) return;
    var payload = JSON.stringify({ blocks: blocks });
    fetch("/admin/pages/" + pageId + (publish ? "/publish" : "/blocks"), {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
      body: payload,
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        flash(res.ok ? (publish ? "Page publiée (version v" + res.j.version + ")" : "Brouillon enregistré (v" + res.j.version + ")") : "Erreur : " + (res.j.error || "Erreur d'enregistrement"), res.ok);
        if (res.ok) frame.src = "/__preview/" + pageId + "&r=" + Date.now();
      })
      .catch(function () { flash("Erreur réseau", false); });
  }

  root.querySelectorAll("[data-save-blocks]").forEach(function (b) { b.addEventListener("click", function () { save(false); }); });
  root.querySelectorAll("[data-publish]").forEach(function (b) { b.addEventListener("click", function () { if (window.confirm("Publier cette page pour le public ?")) save(true); }); });

  function flash(msg, ok) {
    var el = document.createElement("div");
    el.className = "adm-alert " + (ok ? "adm-alert--ok" : "adm-alert--error");
    el.textContent = msg;
    el.style.position = "fixed";
    el.style.bottom = "22px";
    el.style.right = "22px";
    el.style.zIndex = "200";
    el.style.minWidth = "260px";
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 4200);
  }

  // Aperçu 3 devices
  root.querySelectorAll("[data-device]").forEach(function (b) {
    b.addEventListener("click", function () {
      preview.setAttribute("data-device", b.getAttribute("data-device"));
    });
  });

  // Chargement initial des blocs existants
  var existing = [];
  document.querySelectorAll(".bblock").forEach(function (el, i) {
    var t = el.getAttribute("data-block-type");
    if (t) existing.push({ type: t, visible: !el.classList.contains("is-hidden") });
  });
  if (existing.length) {
    // Les blocs complets viennent du serveur : on les recharge via l'aperçu du DOM initial
    fetch("/__preview/" + pageId, { headers: { accept: "text/html" } })
      .then(function () { /* rendu serveur : reconstruire depuis les données */
        var data = window.__GF_BLOCKS__;
        if (data && data.length) { blocks = data; renderList(); }
      });
  }
  // Les données sérialisées sont injectées par le serveur :
  blocks = window.__GF_BLOCKS__ || blocks;
  renderList();
})();
