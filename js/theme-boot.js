/* Dimuat di <head> (blocking, sangat kecil) supaya tema terpasang SEBELUM halaman
   digambar, tanpa kedipan warna. Daftar tema & tema bawaan diatur di sini. */
(function (Undangan) {
  'use strict';

  /** Nama tema = nilai html[data-theme] di css/themes.css ("pink" = bawaan di tokens.css). */
  const THEMES = ['pink', 'matahari', 'lavender', 'sage'];
  /** Tema bawaan bila link tidak menyebut ?tema= */
  const DEFAULT_THEME = 'pink';
  /** Warna contoh di pemilih tema (hanya tampilan; warna asli dari themes.css). */
  const THEME_LABELS = {
    pink: { label: 'Pink', swatch: '#ff6fa0' },
    matahari: { label: 'Matahari', swatch: '#ffbf00' },
    lavender: { label: 'Lavender', swatch: '#a98bff' },
    sage: { label: 'Sage', swatch: '#7fc29b' },
  };

  function themeFromUrl() {
    const q = new URLSearchParams(location.search).get('tema');
    return THEMES.includes(q) ? q : null; // nilai tak dikenal diabaikan
  }

  function applyTheme(name) {
    if (!THEMES.includes(name)) return;
    document.documentElement.dataset.theme = name;
    // Warna bilah browser HP mengikuti warna "kertas" tema.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue('--paper-200').trim();
  }

  document.documentElement.dataset.theme = themeFromUrl() || DEFAULT_THEME;
  Object.assign(Undangan, { THEMES, DEFAULT_THEME, THEME_LABELS, applyTheme });
})((window.Undangan = window.Undangan || {}));
