/* Aviso de cookies: escolha registrada localmente, sem rastreamento. */
(function () {
  "use strict";

  var STORAGE_KEY = "vulcan_cookies_accepted";
  var banner = document.getElementById("cookie-banner");
  if (!banner) return;

  var acceptBtn = document.getElementById("cookie-accept");
  var rejectBtn = document.getElementById("cookie-reject");

  function readChoice() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeChoice(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      /* Armazenamento indisponível: o aviso apenas não reaparece nesta sessão. */
    }
  }

  function dismiss() {
    banner.style.animation = "cookieSlideUp .24s ease-out reverse";
    window.setTimeout(function () { banner.remove(); }, 220);
  }

  if (readChoice() !== null) {
    banner.remove();
    return;
  }

  banner.hidden = false;

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      storeChoice("1");
      dismiss();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", function () {
      storeChoice("0");
      dismiss();
    });
  }
})();
