(function (Undangan) {
  'use strict';

  /**
   * Animasi per blok untuk section yang lebih tinggi dari layar
   * ([data-reveal-blocks], mis. Kisah & Ucapan). Isi bagian bawahnya belum
   * terlihat saat section mulai tampil, jadi tiap [data-reveal] diberi
   * .is-active sendiri saat masuk layar, dan dicabut saat keluar supaya
   * animasinya diulang ketika tamu kembali.
   */
  function initReveal(scroller) {
    const blocks = scroller.querySelectorAll('[data-reveal-blocks] [data-reveal]');
    if (!blocks.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(({ target, isIntersecting }) => target.classList.toggle('is-active', isIntersecting)),
      { root: scroller, rootMargin: '0px 0px -15% 0px', threshold: 0 },
    );
    blocks.forEach((b) => io.observe(b));
  }

  Object.assign(Undangan, { initReveal });
})((window.Undangan = window.Undangan || {}));
