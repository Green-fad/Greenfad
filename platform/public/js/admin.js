// GREEN FAD — Dashboard : confirmations, garde de modifications, médias (téléversement direct + sélecteur)
(function () {
  "use strict";

  // ---------- Menu latéral mobile ----------
  var side = document.getElementById("admSide");
  var backdrop = document.getElementById("admBackdrop");
  var burger = document.getElementById("admBurger");
  function toggleSide(open) {
    if (!side) return;
    side.classList.toggle("is-open", open);
    if (backdrop) backdrop.classList.toggle("is-open", open);
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (burger) burger.addEventListener("click", function () { toggleSide(!side.classList.contains("is-open")); });
  if (backdrop) backdrop.addEventListener("click", function () { toggleSide(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggleSide(false); });
  // Fermer le menu après navigation (mobile)
  side && side.addEventListener("click", function (e) {
    if (e.target.closest("a") && window.innerWidth <= 860) toggleSide(false);
  });

  // Confirmations
  document.addEventListener("click", function (e) {
    var f = e.target.closest("[data-confirm]");
    if (f && !window.confirm(f.getAttribute("data-confirm"))) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Copier l'URL média (ou une URL complète pour les partages)
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (!b) return;
    var raw = b.getAttribute("data-copy") || "";
    var url = raw.indexOf("http") === 0 ? raw : location.origin + raw;
    var done = function () {
      var old = b.getAttribute("data-label") || b.textContent;
      b.setAttribute("data-label", old);
      b.textContent = "Copié";
      setTimeout(function () { b.textContent = old; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
    else { var t = document.createElement("textarea"); t.value = url; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (err) {} t.remove(); done(); }
  });

  // ---------- PWA Admin : service worker + bouton d'installation ----------
  var installEvt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    installEvt = e;
    var btn = document.getElementById("admInstall");
    if (btn) btn.hidden = false;
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("#admInstall");
    if (!b || !installEvt) return;
    installEvt.prompt();
    installEvt.userChoice.finally(function () { installEvt = null; b.hidden = true; });
  });
  if ("serviceWorker" in navigator && location.hostname !== "localhost") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/admin/sw.js", { scope: "/admin/" }).catch(function () {});
    });
  }

  // Avertissement modifications non enregistrées
  document.querySelectorAll("[data-confirm-leave]").forEach(function (form) {
    var dirty = false;
    form.addEventListener("input", function () { dirty = true; form.classList.add("is-dirty"); });
    form.addEventListener("submit", function () { dirty = false; });
    window.addEventListener("beforeunload", function (e) {
      if (dirty) { e.preventDefault(); e.returnValue = ""; }
    });
  });

  // =====================================================================
  // MÉDIAS — téléversement direct (R2), sélecteur en bibliothèque, retrait
  // =====================================================================

  function toast(msg, ok) {
    var el = document.createElement("div");
    el.className = "adm-alert " + (ok ? "adm-alert--ok" : "adm-alert--error");
    el.textContent = msg;
    el.style.cssText = "position:fixed;bottom:22px;right:22px;z-index:300;min-width:250px;max-width:380px";
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 4200);
  }

  // Champ input lié à un bouton (remonte au conteneur [data-media-field])
  function fieldInput(btn) {
    var field = btn.closest("[data-media-field]");
    return field ? field.querySelector("[data-media-input]") : null;
  }

  // Applique (ou vide) la valeur d'un champ média + vignette
  function applyMediaValue(input, key, isImg) {
    if (!input) return;
    input.value = key || "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    var field = input.closest("[data-media-field]");
    var thumb = field && field.querySelector("[data-media-thumb]");
    if (thumb) {
      if (key && isImg !== false) { thumb.src = key.indexOf("/") === 0 ? key : "/media/" + key; thumb.classList.remove("is-empty"); }
      else { thumb.removeAttribute("src"); thumb.classList.add("is-empty"); }
    }
  }

  // Téléverse des fichiers vers R2 via l'API interne
  function uploadMedia(files, docMode, done) {
    var fd = new FormData();
    var n = 0;
    for (var i = 0; i < files.length; i++) { if (files[i]) { fd.append("file", files[i]); n++; } }
    if (!n) { done({ ok: false, j: { error: "Aucun fichier reçu" } }); return; }
    fetch("/api/v1/media?folder=" + (docMode ? "docs" : "media"), {
      method: "POST",
      headers: { "x-csrf-token": window.GF_CSRF },
      body: fd
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(done)
      .catch(function () { done({ ok: false, j: { error: "Erreur réseau pendant l'envoi" } }); });
  }

  // Ouvre un sélecteur de fichiers natif (input dynamique)
  function pickFile(multiple, accept, cb) {
    var inp = document.createElement("input");
    inp.type = "file";
    if (accept) inp.accept = accept;
    if (multiple) inp.multiple = true;
    inp.style.display = "none";
    document.body.appendChild(inp);
    inp.addEventListener("change", function () {
      var files = inp.files;
      var list = files && files.length ? Array.prototype.slice.call(files) : null;
      document.body.removeChild(inp);
      cb(list);
    });
    inp.click();
  }

  // Téléversement depuis un bouton d'un champ média (avec état « Envoi… »)
  function uploadFromButton(btn) {
    var docMode = btn.hasAttribute("data-doc");
    var input = fieldInput(btn);
    pickFile(true, docMode ? undefined : "image/*", function (files) {
      if (!files || !files.length) return;
      btn.disabled = true;
      var old = btn.innerHTML;
      btn.textContent = "Envoi…";
      uploadMedia(files, docMode, function (res) {
        btn.disabled = false;
        btn.innerHTML = old;
        if (res.ok && res.j.keys && res.j.keys.length) {
          applyMediaValue(input, res.j.keys[0], !docMode);
          toast(files.length > 1 ? files.length + " fichiers téléversés — le premier est appliqué au champ." : "Image téléversée et appliquée.", true);
        } else {
          toast("Échec du téléversement : " + ((res.j && res.j.error) || "erreur inconnue"), false);
        }
      });
    });
  }

  // ---------- Sélecteur de bibliothèque (modal) ----------
  function thumbSrc(key) {
    return key ? (key.indexOf("/") === 0 ? key : "/media/" + key) : "";
  }

  function openPicker(docMode, input) {
    if (document.querySelector(".media-modal")) return;
    var modal = document.createElement("div");
    modal.className = "media-modal";
    modal.innerHTML =
      '<div class="media-modal__box"><div class="media-modal__head"><strong>' + (docMode ? "Documents" : "Images") + " — bibliothèque</strong>" +
      '<input type="search" placeholder="Rechercher un fichier…">' +
      '<button type="button" class="btn btn--sm btn--primary" data-mm-upload>Téléverser</button>' +
      '<button type="button" class="btn btn--sm" data-close>Fermer</button></div>' +
      '<div class="media-modal__grid"><em>Chargement…</em></div>' +
      '<div class="media-modal__foot"><span>Cliquez pour appliquer — ou téléversez / supprimez directement ici.</span>' +
      '<a href="/admin/media' + (docMode ? "?folder=documents" : "") + '" target="_blank" rel="noopener">Gérer la bibliothèque ↗</a></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-close]")) closePicker();
    });
    var search = modal.querySelector("input[type=search]");
    var grid = modal.querySelector(".media-modal__grid");

    function itemHtml(m) {
      var isImg = m.mime && m.mime.indexOf("image/") === 0;
      return '<div class="media-modal__wrap">' +
        '<button type="button" class="media-modal__item" data-key="' + m.r2_key + '" data-img="' + (isImg ? 1 : 0) + '">' +
        (isImg ? '<img src="' + (m.r2_key.indexOf("/") === 0 ? m.r2_key : "/media/" + m.r2_key) + '" alt="" loading="lazy">' : '<div class="media-modal__item is-doc"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h5"/></svg></div>') +
        "<span>" + m.filename.replace(/</g, "&lt;").slice(0, 26) + "</span></button>" +
        '<button type="button" class="media-modal__del" data-del-key="' + m.r2_key + '" title="Supprimer ce média de R2">' +
        '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>' +
        "</div>";
    }

    function load(q) {
      fetch("/api/v1/media/search?folder=" + (docMode ? "docs" : "media") + "&q=" + encodeURIComponent(q || ""), {
        headers: { "x-csrf-token": window.GF_CSRF }
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data.items || !data.items.length) {
            grid.innerHTML = "<em>Bibliothèque vide — utilisez « Téléverser » pour ajouter vos premières images.</em>";
            return;
          }
          grid.innerHTML = "";
          data.items.forEach(function (m) {
            var wrap = document.createElement("div");
            wrap.innerHTML = itemHtml(m);
            var sel = wrap.querySelector("[data-key]");
            sel.addEventListener("click", function () {
              applyMediaValue(input, sel.getAttribute("data-key"), sel.getAttribute("data-img") === "1");
              closePicker();
            });
            var del = wrap.querySelector("[data-del-key]");
            del.addEventListener("click", function () {
              var key = del.getAttribute("data-del-key");
              if (!window.confirm("Supprimer définitivement ce média de R2 ?\n\nSi une page ou une fiche l'utilise encore, son visuel sera cassé — pensez à le remplacer avant.")) return;
              del.disabled = true;
              fetch("/api/v1/media/" + key, {
                method: "DELETE",
                headers: { "x-csrf-token": window.GF_CSRF }
              })
                .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
                .then(function (res) {
                  if (res.ok) {
                    if (input && input.value === key) applyMediaValue(input, "", false);
                    load(search.value);
                    toast("Média supprimé de la bibliothèque.", true);
                  } else {
                    del.disabled = false;
                    toast("Suppression refusée : " + ((res.j && res.j.error) || "erreur"), false);
                  }
                })
                .catch(function () { del.disabled = false; toast("Erreur réseau lors de la suppression.", false); });
            });
            grid.appendChild(wrap.firstChild);
          });
        })
        .catch(function () { grid.innerHTML = "<em>Erreur de chargement.</em>"; });
    }

    // Téléversement depuis le modal
    modal.querySelector("[data-mm-upload]").addEventListener("click", function () {
      var b = this;
      pickFile(true, docMode ? undefined : "image/*", function (files) {
        if (!files || !files.length) return;
        b.disabled = true;
        b.textContent = "Envoi…";
        uploadMedia(files, docMode, function (res) {
          b.disabled = false;
          b.textContent = "Téléverser";
          if (res.ok && res.j.keys && res.j.keys.length) {
            load(search.value);
            toast(files.length + " fichier(s) téléversé(s) dans R2.", true);
          } else {
            toast("Échec du téléversement : " + ((res.j && res.j.error) || "erreur inconnue"), false);
          }
        });
      });
    });

    search.addEventListener("input", function () { load(search.value); });
    load("");

    function closePicker() { modal.remove(); }
  }

  // Délégation globale : ouvrir le sélecteur, téléverser, retirer
  document.addEventListener("click", function (e) {
    var up = e.target.closest("[data-media-upload]");
    if (up) { e.preventDefault(); uploadFromButton(up); return; }
    var clr = e.target.closest("[data-media-clear]");
    if (clr) {
      e.preventDefault();
      var inp = fieldInput(clr);
      if (inp) applyMediaValue(inp, "", false);
      return;
    }
    var open = e.target.closest("[data-media-open]");
    if (open) {
      e.preventDefault();
      openPicker(open.hasAttribute("data-doc"), fieldInput(open));
    }
  });

  // Glisser-déposer une image sur la vignette = téléversement immédiat
  document.addEventListener("dragover", function (e) {
    var f = e.target.closest(".media-pick");
    if (f) { e.preventDefault(); f.classList.add("is-dragover"); }
  });
  document.addEventListener("dragleave", function (e) {
    var f = e.target.closest(".media-pick");
    if (f && !f.contains(e.relatedTarget)) f.classList.remove("is-dragover");
  });
  document.addEventListener("drop", function (e) {
    var f = e.target.closest(".media-pick");
    if (!f) return;
    e.preventDefault();
    f.classList.remove("is-dragover");
    var field = f.closest("[data-media-field]");
    if (!field) return;
    var input = field.querySelector("[data-media-input]");
    var docMode = field.hasAttribute("data-doc");
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      uploadMedia(e.dataTransfer.files, docMode, function (res) {
        if (res.ok && res.j.keys && res.j.keys.length) {
          applyMediaValue(input, res.j.keys[0], !docMode);
          toast("Image téléversée et appliquée.", true);
        } else {
          toast("Échec du téléversement : " + ((res.j && res.j.error) || "erreur inconnue"), false);
        }
      });
    }
  });

  // Revalidation JSON dans les textareas dédiés
  document.querySelectorAll("[data-json]").forEach(function (ta) {
    function check() {
      try { JSON.parse(ta.value); ta.style.borderColor = ""; }
      catch (e) { ta.style.borderColor = "#DC2626"; }
    }
    ta.addEventListener("input", check);
    check();
  });
})();
