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

  // Reveal au scroll
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
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
