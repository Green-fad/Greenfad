// GREEN FAD — Dashboard : confirmations, garde de modifications, sélecteur de médias
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

  // Copier l'URL média
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (!b) return;
    var url = location.origin + b.getAttribute("data-copy");
    navigator.clipboard.writeText(url).then(function () {
      var old = b.textContent;
      b.textContent = "Copié";
      setTimeout(function () { b.textContent = old; }, 1600);
    });
  });

  // Avertissement modifications non enregistrées
  document.querySelectorAll("[data-confirm-leave]").forEach(function (form) {
    var dirty = false;
    form.addEventListener("input", function () { dirty = true; form.classList.add("is-dirty"); });
    form.addEventListener("submit", function () { dirty = false; });
    window.addEventListener("beforeunload", function (e) {
      if (dirty) { e.preventDefault(); e.returnValue = ""; }
    });
  });

  // ---------- Sélecteur de médias ----------
  var currentInput = null;
  function openPicker(docMode) {
    if (currentInput) closePicker();
    var modal = document.createElement("div");
    modal.className = "media-modal";
    modal.innerHTML =
      '<div class="media-modal__box"><div class="media-modal__head"><strong>Bibliothèque médias</strong>' +
      '<input type="search" placeholder="Rechercher un fichier…">' +
      '<button type="button" class="btn btn--sm" data-close>Fermer</button></div>' +
      '<div class="media-modal__grid"><em>Chargement…</em></div>' +
      '<div class="media-modal__foot"><span>Les fichiers listés proviennent du stockage R2 de production.</span>' +
      '<span>Mode : ' + (docMode ? "documents" : "images") + '</span></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-close]")) closePicker();
    });
    var search = modal.querySelector("input[type=search]");
    var grid = modal.querySelector(".media-modal__grid");
    function load(q) {
      fetch("/api/v1/media/search?folder=" + (docMode ? "docs" : "media") + "&q=" + encodeURIComponent(q || ""), {
        headers: { "x-csrf-token": window.GF_CSRF }
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data.items || !data.items.length) {
            grid.innerHTML = "<em>Aucun fichier — téléversez d'abord dans « Bibliothèque médias ».</em>";
            return;
          }
          grid.innerHTML = "";
          data.items.forEach(function (m) {
            var isImg = m.mime && m.mime.indexOf("image/") === 0;
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "media-modal__item";
            btn.innerHTML =
              (isImg ? '<img src="/media/' + m.r2_key + '" alt="" loading="lazy">' : '<div class="media-modal__item is-doc"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h5"/></svg></div>') +
              "<span>" + m.filename.replace(/</g, "&lt;").slice(0, 26) + "</span>";
            btn.addEventListener("click", function () {
              currentInput.value = m.r2_key;
              currentInput.dispatchEvent(new Event("change", { bubbles: true }));
              var thumb = currentInput.closest("[data-media-field]")?.querySelector("[data-media-thumb]");
              if (thumb && isImg) { thumb.src = "/media/" + m.r2_key; thumb.classList.remove("is-empty"); }
              closePicker();
            });
            grid.appendChild(btn);
          });
        })
        .catch(function () { grid.innerHTML = "<em>Erreur de chargement.</em>"; });
    }
    search.addEventListener("input", function () { load(search.value); });
    load("");
    currentInput = modal;
    function closePicker() { modal.remove(); currentInput = null; }
    modal._close = closePicker;
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-media-open]");
    if (!b) return;
    e.preventDefault();
    openPicker(b.hasAttribute("data-doc"));
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
