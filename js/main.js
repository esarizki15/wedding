(function (Undangan) {
  'use strict';

  const {
    initPhase, initGuestName, initSplitLetters, initSplitLines, initCountdown,
    initCopy, initMusic, initWishes, initSnap, initReveal, initGallery,
  } = Undangan;

  const scroller = document.getElementById('snap');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scroller.scrollTop = 0;

  initPhase();       // paling awal: buang section fase lain sebelum modul lain memindai DOM
  initGuestName();
  initSplitLetters(); // setelah nama tamu terpasang
  initCountdown();
  initCopy();
  initWishes();
  initGallery();     // membungkus gambar → harus sebelum snap/reveal mengamati

  const music = initMusic();
  document.querySelector('[data-open]')?.addEventListener('click', () => music.start());

  // Tunggu font siap (maks. 1,5 detik): pemenggalan baris & animasi butuh font final.
  const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
  fontsReady.then(() => {
    initSplitLines();
    initSnap(scroller);
    initReveal(scroller);
  });
})((window.Undangan = window.Undangan || {}));
