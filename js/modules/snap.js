(function (Undangan) {
  'use strict';

  /**
   * Menandai section yang sedang tampil (.is-active) → memicu animasi masuk,
   * dan mencabutnya saat ditinggal → animasi keluar, lalu diputar ulang saat kembali.
   * Section dianggap tampil bila melewati pita 20% di tengah layar, jadi section
   * yang lebih tinggi dari layar tetap terdeteksi. Section [data-reveal-blocks]
   * tidak diaktifkan di sini; blok-bloknya diurus reveal.js.
   * Tombol [data-scroll-next] menggulung ke section berikutnya.
   */
  function initSnap(scroller) {
    const sections = scroller.querySelectorAll('[data-section]');
    const emit = (type, section) =>
      scroller.dispatchEvent(new CustomEvent(type, { detail: { id: section.dataset.section, section } }));

    const io = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!target.hasAttribute('data-reveal-blocks')) {
            target.classList.toggle('is-active', isIntersecting);
          }
          emit(isIntersecting ? 'section:enter' : 'section:leave', target);
        }
      },
      { root: scroller, rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));

    scroller.addEventListener('click', (e) => {
      const next = e.target.closest('[data-scroll-next]')?.closest('[data-section]')?.nextElementSibling;
      if (!next) return;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      next.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  }

  Object.assign(Undangan, { initSnap });
})((window.Undangan = window.Undangan || {}));
