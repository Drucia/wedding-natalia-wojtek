/**
 * Nawigacja mobilna, linki Dysku z config, RSVP (Web3Forms)
 */
(function () {
  "use strict";

  const config = window.WEDDING_CONFIG || {
    RSVP_ACCESS_KEY: "TWOJ_ACCESS_KEY",
    RSVP_SUBMIT_URL: "https://api.web3forms.com/submit",
    PHOTOS_DRIVE_URL: "https://drive.google.com",
  };

  const driveLink = document.getElementById("link-drive");
  const driveLink2 = document.getElementById("link-drive-2");
  if (config.PHOTOS_DRIVE_URL) {
    if (driveLink) {
      driveLink.href = config.PHOTOS_DRIVE_URL;
    }
    if (driveLink2) {
      driveLink2.href = config.PHOTOS_DRIVE_URL;
    }
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
  }

  function bodyNavToggle(open) {
    if (open) {
      document.body.classList.add("nav-open");
    } else {
      document.body.classList.remove("nav-open");
    }
  }

  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpStatus = document.getElementById("rsvp-status");
  const rsvpConfigNote = document.getElementById("rsvp-config-note");
  const rsvpSubmit = document.getElementById("rsvp-submit");
  const PLACEHOLDER_KEYS = ["TWOJ_ACCESS_KEY", "YOUR_ACCESS_KEY"];

  if (rsvpConfigNote) {
    const k = String(config.RSVP_ACCESS_KEY || "");
    if (!k || PLACEHOLDER_KEYS.indexOf(k) !== -1) {
      rsvpConfigNote.removeAttribute("hidden");
    }
  }

  if (rsvpForm && rsvpStatus) {
    rsvpForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const key = (config.RSVP_ACCESS_KEY || "").trim();
      if (!key || PLACEHOLDER_KEYS.indexOf(key) !== -1) {
        rsvpStatus.className = "rsvp-form__status rsvp-form__status--err";
        rsvpStatus.textContent =
          "Dodaj prawdziwy klucz Web3Forms w pliku config.js, żeby wysyłka maila działała.";
        if (rsvpConfigNote) rsvpConfigNote.removeAttribute("hidden");
        return;
      }

      const name = document.getElementById("rsvp-name");
      const email = document.getElementById("rsvp-email");
      const guests = document.getElementById("rsvp-guests");
      const attendance = document.getElementById("rsvp-attendance");
      const message = document.getElementById("rsvp-message");

      const nameVal = (name && name.value) || "";
      const emailVal = (email && email.value) || "";
      const guestsVal = (guests && guests.value) || "1";
      const att = (attendance && attendance.value) || "";
      const msg = (message && message.value) || "";

      rsvpStatus.className = "rsvp-form__status";
      rsvpStatus.textContent = "Wysyłanie…";
      if (rsvpSubmit) {
        rsvpSubmit.disabled = true;
      }

      const textBody = [
        "Obecność: " + att,
        "Liczba gości: " + guestsVal,
        "",
        msg,
      ].join("\n");

      const payload = {
        access_key: key,
        subject: "RSVP wesele — Natalia i Wojtek",
        name: nameVal,
        email: emailVal,
        message: textBody,
        from_name: nameVal,
      };

      const url = config.RSVP_SUBMIT_URL || "https://api.web3forms.com/submit";

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data && (data.success === true || data.message === "Email sent successfully!")) {
          rsvpStatus.className = "rsvp-form__status rsvp-form__status--ok";
          rsvpStatus.textContent = "Dziękujemy! Wkrótce potwierdzimy. Jeśli coś pójdzie nie tak, napisz lub zadzwoń.";
          rsvpForm.reset();
        } else {
          const errMsg = (data && (data.message || data.error)) || "Spróbuj później lub napisz na e-mail albo zadzwoń.";
          throw new Error(errMsg);
        }
      } catch (err) {
        rsvpStatus.className = "rsvp-form__status rsvp-form__status--err";
        rsvpStatus.textContent =
          "Nie udało się wysłać. " + (err && err.message ? err.message : "Możesz poinformować nas telefonicznie.");
      } finally {
        if (rsvpSubmit) {
          rsvpSubmit.disabled = false;
        }
      }
    });
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
