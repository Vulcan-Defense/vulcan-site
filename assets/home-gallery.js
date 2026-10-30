/* Galeria de eventos: navegação horizontal, lightbox acessível e atalhos de teclado. */
(function () {
  "use strict";

  var gallery = document.querySelector(".home-event-gallery");
  var lightbox = document.getElementById("home-gallery-lightbox");
  var image = document.getElementById("home-gallery-lightbox-image");
  var caption = document.getElementById("home-gallery-lightbox-caption");
  if (!gallery || !lightbox || !image || !caption) return;

  var closeButton = lightbox.querySelector(".home-gallery-lightbox-close");
  var triggers = Array.prototype.slice.call(gallery.querySelectorAll(".home-event-photo"));
  var current = -1;
  var lastTrigger = null;

  /* Controles de rolagem da faixa de fotos */
  var head = document.querySelector(".home-gallery-head");
  if (head && !head.querySelector(".home-gallery-nav")) {
    var nav = document.createElement("div");
    nav.className = "home-gallery-nav";
    nav.innerHTML = ''
      + '<button class="gallery-btn gallery-prev" type="button" aria-label="Ver fotos anteriores">'
      + '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      + '</button>'
      + '<button class="gallery-btn gallery-next" type="button" aria-label="Ver próximas fotos">'
      + '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      + '</button>';
    head.appendChild(nav);

    var step = function () {
      var first = triggers[0];
      return first ? first.getBoundingClientRect().width + 14 : 360;
    };
    nav.querySelector(".gallery-prev").addEventListener("click", function () {
      gallery.scrollBy({ left: -step(), behavior: "smooth" });
    });
    nav.querySelector(".gallery-next").addEventListener("click", function () {
      gallery.scrollBy({ left: step(), behavior: "smooth" });
    });
  }

  /* Botões de anterior/próxima no lightbox */
  var figure = lightbox.querySelector("figure");
  if (figure && triggers.length > 1 && !lightbox.querySelector(".home-gallery-lightbox-next")) {
    var prev = document.createElement("button");
    prev.type = "button";
    prev.className = "home-gallery-lightbox-prev";
    prev.setAttribute("aria-label", "Imagem anterior");
    prev.textContent = "‹";
    var next = document.createElement("button");
    next.type = "button";
    next.className = "home-gallery-lightbox-next";
    next.setAttribute("aria-label", "Próxima imagem");
    next.textContent = "›";
    figure.appendChild(prev);
    figure.appendChild(next);
    prev.addEventListener("click", function () { show(current - 1); });
    next.addEventListener("click", function () { show(current + 1); });
  }

  function show(index) {
    if (!triggers.length) return;
    current = (index + triggers.length) % triggers.length;
    var trigger = triggers[current];
    var preview = trigger.querySelector("img");
    var label = trigger.querySelector("span");
    image.src = trigger.getAttribute("href");
    image.alt = preview ? preview.alt : "Imagem ampliada da galeria";
    caption.textContent = label ? label.textContent : "Registro do Hub Rio";
  }

  function openLightbox(index, trigger) {
    lastTrigger = trigger;
    show(index);
    lightbox.hidden = false;
    document.body.classList.add("home-gallery-lightbox-open");
    if (closeButton) closeButton.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    image.removeAttribute("src");
    document.body.classList.remove("home-gallery-lightbox-open");
    if (lastTrigger) lastTrigger.focus();
  }

  triggers.forEach(function (trigger, index) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      openLightbox(index, trigger);
    });
  });

  if (closeButton) closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      show(current + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(current - 1);
    }
  });
})();
