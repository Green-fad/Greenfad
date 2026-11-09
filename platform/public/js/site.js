// GREEN FAD — Site public v2 : menu mobile, reveal au scroll, lightbox galerie, retours formulaires
(function () {
  "use strict";

  // Menu mobile
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
      }
    });
  }

  // Reveal au scroll — threshold 0 : les très grands blocs (article complet) se révèlent dès leur entrée
  var revealEls = document.querySelectorAll(".reveal");
  // Filet de sécurité : tout conteneur [data-stagger] sans .reveal est révélé immédiatement
  // (sinon ses enfants resteraient à opacity:0 pour toujours — bug des bandeaux « stats »)
  document.querySelectorAll("[data-stagger]:not(.reveal)").forEach(function (el) { el.classList.add("is-in"); });
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -24px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Cascade : décalage progressif des enfants des grilles [data-stagger]
  document.querySelectorAll("[data-stagger]").forEach(function (grid) {
    Array.prototype.forEach.call(grid.children, function (child, i) {
      child.style.setProperty("--d", Math.min(i * 70, 560) + "ms");
    });
  });

  // Chiffres clés : comptage animé (la valeur reste celle de la base — uniquement l'affichage s'anime)
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var statEls = document.querySelectorAll(".stats .stat strong");
  if (statEls.length && !reduceMotion && "IntersectionObserver" in window) {
    var statIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        statIo.unobserve(en.target);
        var el = en.target;
        var m = /^([\d\u00A0\s]+)(.*)$/.exec((el.textContent || "").trim());
        if (!m) return;
        var target = parseInt(m[1].replace(/[^\d]/g, ""), 10);
        if (!target || target < 2 || target > 100000) return; // petites valeurs ou textes : pas d'animation
        var suffix = m[2] || "";
        var t0 = null;
        var DUR = 900;
        var step = function (ts) {
          if (!t0) t0 = ts;
          var k = Math.min((ts - t0) / DUR, 1);
          k = 1 - Math.pow(1 - k, 3); // ease-out cubic
          el.textContent = Math.round(target * k) + suffix;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    statEls.forEach(function (el) { statIo.observe(el); });
  }

  // Héros : indicateur de scroll → avance vers la section suivante
  var cue = document.querySelector(".hero__scroll");
  if (cue) {
    cue.addEventListener("click", function () {
      var main = document.getElementById("main");
      var hero = cue.closest(".hero");
      var next = hero && hero.nextElementSibling;
      while (next && next !== main && !next.offsetHeight) next = next.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }

  // Bouton retour en haut
  var top = document.createElement("button");
  top.className = "to-top";
  top.type = "button";
  top.setAttribute("aria-label", "Revenir en haut de la page");
  top.innerHTML = '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
  document.body.appendChild(top);
  var topShown = false;
  var onScroll = function () {
    var show = window.scrollY > 640;
    if (show !== topShown) { topShown = show; top.classList.toggle("is-visible", show); }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  top.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  // Lightbox galerie
  var galleries = document.querySelectorAll("[data-lightbox]");
  if (galleries.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<button class="lightbox__close" aria-label="Fermer"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button><img alt="">';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img");
    var close = function () { lb.classList.remove("is-open"); };
    lb.addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    galleries.forEach(function (g) {
      g.addEventListener("click", function (e) {
        var fig = e.target.closest("figure");
        if (!fig) return;
        var full = fig.getAttribute("data-full") || (fig.querySelector("img") || {}).src;
        if (full) { lbImg.src = full; lb.classList.add("is-open"); }
      });
    });
  }

  // Onglets captures produit (Tout / Mobile / Desktop) — délégation, sans jQuery
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-shots-tabs] button[data-filter]");
    if (!b) return;
    var wrap = b.closest("[data-shots-tabs]");
    wrap.querySelectorAll("button").forEach(function (x) { x.classList.toggle("is-active", x === b); });
    var f = b.getAttribute("data-filter");
    document.querySelectorAll("[data-shots]").forEach(function (s) {
      s.classList.toggle("shots--mobile-only", f === "mobile");
      s.classList.toggle("shots--desktop-only", f === "desktop");
    });
  });

  // Copier un lien (boutons de partage d'article)
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (!b) return;
    e.preventDefault();
    var v = b.getAttribute("data-copy") || "";
    var url = v.indexOf("http") === 0 ? v : location.origin + v;
    var done = function () {
      b.classList.add("is-copied");
      setTimeout(function () { b.classList.remove("is-copied"); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, done);
    } else {
      var t = document.createElement("textarea");
      t.value = url; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch (err) {}
      t.remove(); done();
    }
  });

  // Filtres de la chronologie historique (jalons : conception & développement / production & évolutions)
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-tl-tabs] button[data-tl-filter]");
    if (!b) return;
    var wrap = b.closest("[data-tl-tabs]");
    wrap.querySelectorAll("button").forEach(function (x) { x.classList.toggle("is-active", x === b); });
    var f = b.getAttribute("data-tl-filter");
    var tl = document.querySelector("[data-tl]");
    if (!tl) return;
    if (f === "all") {
      tl.removeAttribute("data-tl-active");
    } else {
      tl.setAttribute("data-tl-active", f);
    }
    // Si aucun jalon du groupe choisi n'existe, on reste sur « tout » pour ne pas afficher une liste vide
    if (f !== "all" && !tl.querySelector('[data-tl-group="' + f + '"]')) {
      tl.removeAttribute("data-tl-active");
    }
  });

  // Anti double-soumission des formulaires publics
  document.querySelectorAll("form[method=post]").forEach(function (f) {
    f.addEventListener("submit", function () {
      var btn = f.querySelector("button[type=submit]");
      if (btn && !btn.disabled) {
        btn.disabled = true;
        btn.dataset.orig = btn.textContent;
        btn.textContent = "Envoi en cours…";
        setTimeout(function () {
          btn.disabled = false;
          if (btn.dataset.orig) btn.textContent = btn.dataset.orig;
        }, 6000);
      }
    });
  });
})();
