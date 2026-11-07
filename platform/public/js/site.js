// GREEN FAD — Site public : menu mobile, reveal au scroll, retours formulaires
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
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
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
