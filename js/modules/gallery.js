(function (Undangan) {
  'use strict';

  const SWIPE_MIN = 50; // px

  /**
   * Lightbox untuk `.gallery img`, memakai <dialog> modal (fokus terkunci, Esc menutup,
   * fokus kembali ke thumbnail). Navigasi: tombol, panah keyboard, swipe.
   * Gambar penuh = atribut data-full bila ada, kalau tidak src thumbnail.
   */
  function initGallery() {
    const imgs = [...document.querySelectorAll('.gallery img')];
    if (!imgs.length) return;

    // Bungkus tiap gambar dengan <button> supaya bisa difokus & dibuka dengan keyboard.
    const buttons = imgs.map((img, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery__item';
      btn.setAttribute('aria-label', `Buka foto ${i + 1} dari ${imgs.length}`);
      // Atribut animasi (data-anim, --i, --delay) pindah ke pembungkus supaya tombolnya yang beranimasi.
      if (img.dataset.anim) { btn.dataset.anim = img.dataset.anim; img.removeAttribute('data-anim'); }
      if (img.getAttribute('style')) { btn.setAttribute('style', img.getAttribute('style')); img.removeAttribute('style'); }
      img.replaceWith(btn);
      btn.append(img);
      btn.addEventListener('click', () => open(i));
      return btn;
    });

    const dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Galeri foto');
    dlg.innerHTML = `
      <div class="lightbox__bar">
        <span data-lb-count></span>
        <button type="button" class="lightbox__btn" data-lb-close aria-label="Tutup">✕</button>
      </div>
      <div class="lightbox__stage">
        <button type="button" class="lightbox__btn lightbox__btn--nav lightbox__btn--prev" data-lb-prev aria-label="Foto sebelumnya">‹</button>
        <img class="lightbox__img" data-lb-img alt="">
        <button type="button" class="lightbox__btn lightbox__btn--nav lightbox__btn--next" data-lb-next aria-label="Foto berikutnya">›</button>
      </div>
      <p class="lightbox__caption" data-lb-caption></p>`;
    document.body.append(dlg);

    const $ = (s) => dlg.querySelector(s);
    const view = $('[data-lb-img]');
    const count = $('[data-lb-count]');
    const caption = $('[data-lb-caption]');
    let index = 0;

    const srcOf = (i) => imgs[(i + imgs.length) % imgs.length].dataset.full || imgs[(i + imgs.length) % imgs.length].src;

    function show(i, animate = true) {
      index = (i + imgs.length) % imgs.length;
      const swap = () => {
        view.src = srcOf(index);
        view.alt = imgs[index].alt;
        count.textContent = `${index + 1} / ${imgs.length}`;
        caption.textContent = imgs[index].alt;
        view.classList.remove('is-swapping');
      };
      if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        view.classList.add('is-swapping');
        setTimeout(swap, 150);
      } else swap();
      // Muat duluan tetangganya supaya geser terasa instan.
      [index - 1, index + 1].forEach((n) => { new Image().src = srcOf(n); });
    }

    function open(i) {
      show(i, false);
      document.documentElement.classList.add('lb-open');
      dlg.showModal();
    }
    const close = () => dlg.close();

    dlg.addEventListener('close', () => {
      document.documentElement.classList.remove('lb-open');
      buttons[index]?.focus({ preventScroll: true });
    });

    $('[data-lb-close]').addEventListener('click', close);
    $('[data-lb-prev]').addEventListener('click', () => show(index - 1));
    $('[data-lb-next]').addEventListener('click', () => show(index + 1));
    // Klik area gelap di luar gambar/tombol menutup.
    $('.lightbox__stage').addEventListener('click', (e) => { if (e.target === e.currentTarget) close(); });

    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
    });

    // Swipe horizontal.
    let startX = null;
    const stage = $('.lightbox__stage');
    stage.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) >= SWIPE_MIN) show(index + (dx < 0 ? 1 : -1));
    });
    stage.addEventListener('pointercancel', () => { startX = null; });
  }

  Object.assign(Undangan, { initGallery });
})((window.Undangan = window.Undangan || {}));
