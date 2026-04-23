/**
 * Ekran powitalny: koperta + otwarcie, zapis w localStorage, wsparcie prefer-reduced-motion
 */
(function () {
  "use strict";

  const STORAGE_KEY = "weddingEnvelopeOpened";
  const body = document.body;
  const screen = document.getElementById("envelope-screen");
  const envelope = screen && screen.querySelector(".envelope");
  const openBtn = document.getElementById("envelope-open-btn");
  const main = document.getElementById("main");
  const skip = document.querySelector('.skip-link[href="#main"]');

  if (!screen || !envelope || !openBtn) return;

  const prefersReduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduce) {
    body.classList.add("reduce-motion-override");
  }

  function openDone() {
    screen.classList.add("is-closed");
    screen.setAttribute("aria-hidden", "true");
    if (openBtn) {
      openBtn.disabled = true;
      openBtn.setAttribute("tabindex", "-1");
    }
    body.classList.remove("is-envelope-active");
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {
      /* prywatna przeglądarka itp. */
    }
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
  }

  function playOpenAnimation() {
    if (openBtn) openBtn.disabled = true;
    envelope.classList.add("is-opening");
    if (prefersReduce) {
      setTimeout(openDone, 200);
      return;
    }
    setTimeout(openDone, 2000);
  }

  function skipOrInstantOpen() {
    envelope.classList.add("is-opening");
    if (prefersReduce) {
      setTimeout(openDone, 0);
    } else {
      setTimeout(openDone, 350);
    }
  }

  try {
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      openDone();
    }
  } catch (e) {
    /* ignore */
  }

  if (screen.classList.contains("is-closed")) {
    return;
  }

  openBtn.addEventListener("click", playOpenAnimation);
  if (skip) {
    skip.addEventListener("click", function (e) {
      e.preventDefault();
      skipOrInstantOpen();
    });
  }
})();
