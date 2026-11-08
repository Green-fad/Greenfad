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
