(() => {
  'use strict';

  const triggers = Array.from(document.querySelectorAll('[data-press-lightbox]'));
  const modal = document.getElementById('press-lightbox');
  if (!triggers.length || !modal) return;

  const image = modal.querySelector('[data-lightbox-image]');
  const caption = modal.querySelector('[data-lightbox-caption]');
  const counter = modal.querySelector('[data-lightbox-counter]');
  const closeButton = modal.querySelector('[data-lightbox-close]');
  const previousButton = modal.querySelector('[data-lightbox-prev]');
  const nextButton = modal.querySelector('[data-lightbox-next]');
  let activeIndex = 0;
  let returnFocus = null;
  let pointerStartX = null;

  const render = () => {
    const item = triggers[activeIndex];
    const itemImage = item.querySelector('img');
    image.src = item.dataset.src;
    image.alt = itemImage ? itemImage.alt : '';
    caption.textContent = item.dataset.caption || image.alt;
    counter.textContent = `${activeIndex + 1} / ${triggers.length}`;
  };

  const show = (index, source) => {
    activeIndex = index;
    returnFocus = source;
    render();
    modal.hidden = false;
    document.body.classList.add('press-lightbox-open');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    closeButton.focus();
  };

  const hide = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('press-lightbox-open');
    window.setTimeout(() => {
      modal.hidden = true;
      image.removeAttribute('src');
      if (returnFocus) returnFocus.focus();
    }, 200);
  };

  const move = (step) => {
    activeIndex = (activeIndex + step + triggers.length) % triggers.length;
    render();
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => show(index, trigger));
  });

  closeButton.addEventListener('click', hide);
  previousButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) hide();
  });

  modal.addEventListener('pointerdown', (event) => {
    pointerStartX = event.clientX;
  });
  modal.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) > 60) move(distance > 0 ? -1 : 1);
  });

  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') hide();
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
    if (event.key === 'Tab') {
      const controls = [closeButton, previousButton, nextButton];
      const current = controls.indexOf(document.activeElement);
      if (event.shiftKey && current === 0) {
        event.preventDefault();
        nextButton.focus();
      } else if (!event.shiftKey && current === controls.length - 1) {
        event.preventDefault();
        closeButton.focus();
      }
    }
  });

  const gallery = document.querySelector('[data-egc-gallery]');
  document.querySelectorAll('[data-egc-scroll]').forEach((control) => {
    control.addEventListener('click', () => {
      if (!gallery) return;
      const direction = control.dataset.egcScroll === 'prev' ? -1 : 1;
      gallery.scrollBy({ left: gallery.clientWidth * .78 * direction, behavior: 'smooth' });
    });
  });
})();
