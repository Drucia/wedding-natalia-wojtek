/**
 * Mobile nav, Drive link from config, optional `id=` query snippet for the folder
 */
(function () {
  "use strict";

  const config = window.WEDDING_CONFIG || {
    PHOTOS_DRIVE_URL: "https://drive.google.com",
    PHOTOS_DRIVE_FOLDER_ID: "",
  };

  function resolveDriveFolderId(cfg) {
    const explicit = String(cfg.PHOTOS_DRIVE_FOLDER_ID || "").trim();
    if (explicit) return explicit;
    const url = String(cfg.PHOTOS_DRIVE_URL || "");
    const m = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return m ? m[1] : "";
  }

  if (config.PHOTOS_DRIVE_URL) {
    document.querySelectorAll(".js-photos-drive").forEach(function (el) {
      el.href = config.PHOTOS_DRIVE_URL;
    });
  }

  const folderId = resolveDriveFolderId(config);
  const driveQueryNote = document.getElementById("drive-query-note");
  const driveQueryValue = document.getElementById("drive-query-value");
  if (folderId && driveQueryNote && driveQueryValue) {
    driveQueryValue.textContent = "id=" + folderId;
    driveQueryNote.removeAttribute("hidden");
  }

  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      bodyNavToggle(isOpen);
    });
    siteNav.querySelectorAll("a[href^='#']").forEach(function (a) {
      a.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        bodyNavToggle(false);
      });
    });
    siteNav.querySelectorAll("a.site-nav__external").forEach(function (a) {
      a.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        bodyNavToggle(false);
      });
    });
  }

  function bodyNavToggle(open) {
    if (open) {
      document.body.classList.add("nav-open");
    } else {
      document.body.classList.remove("nav-open");
    }
  }

  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function makeParallaxUpdater(rootSelector, mediaSelector) {
    const root = document.querySelector(rootSelector);
    const media = root && root.querySelector(mediaSelector);
    if (!root || !media) return null;
    return function updateParallaxMedia() {
      const rect = root.getBoundingClientRect();
      const y = Math.round(rect.top * 0.28);
      media.style.transform = "translate3d(0, " + y + "px, 0)";
    };
  }

  const parallaxHeroUpd = makeParallaxUpdater("[data-parallax-hero]", ".hero__media");
  const parallaxLocationUpd = makeParallaxUpdater("[data-parallax-location]", ".location-hero__media");
  let parallaxRaf = 0;

  function runParallax() {
    if (reduceMotion) return;
    if (parallaxHeroUpd) parallaxHeroUpd();
    if (parallaxLocationUpd) parallaxLocationUpd();
  }

  function scheduleParallax() {
    if (reduceMotion) return;
    if (!parallaxHeroUpd && !parallaxLocationUpd) return;
    if (parallaxRaf) cancelAnimationFrame(parallaxRaf);
    parallaxRaf = requestAnimationFrame(function () {
      parallaxRaf = 0;
      runParallax();
    });
  }

  if (!reduceMotion && (parallaxHeroUpd || parallaxLocationUpd)) {
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    window.addEventListener("resize", scheduleParallax);
    runParallax();
  }

  const revealTargets = document.querySelectorAll(".js-reveal");
  if (revealTargets.length) {
    if (reduceMotion) {
      revealTargets.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      const ioReveal = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              ioReveal.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
      );
      revealTargets.forEach(function (el) {
        ioReveal.observe(el);
      });
    }
  }
})();
