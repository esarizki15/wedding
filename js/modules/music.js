(function (Undangan) {
  'use strict';

  /**
   * Browser hanya mengizinkan audio setelah interaksi, jadi musik dimulai
   * dari tombol "Buka Undangan". Tombol toggle muncul setelahnya.
   */
  function initMusic() {
    const audio = document.querySelector('[data-music]');
    const toggle = document.querySelector('[data-music-toggle]');
    if (!audio || !toggle) return { start() {} };

    const render = (playing) => {
      toggle.classList.toggle('is-playing', playing);
      toggle.setAttribute('aria-label', playing ? 'Jeda musik' : 'Putar musik');
    };
    audio.addEventListener('play', () => render(true));
    audio.addEventListener('pause', () => render(false));

    let wanted = false;
    toggle.addEventListener('click', () => {
      wanted = audio.paused;
      if (wanted) audio.play().catch(() => {}); else audio.pause();
    });
    // Hemat baterai: jeda saat tab disembunyikan, lanjut kalau tadi memang diputar.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) audio.pause();
      else if (wanted) audio.play().catch(() => {});
    });

    return {
      start() {
        toggle.hidden = false;
        wanted = true;
        audio.play().catch(() => { wanted = false; });
      },
    };
  }

  Object.assign(Undangan, { initMusic });
})((window.Undangan = window.Undangan || {}));
