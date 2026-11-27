/* Dimuat di <head> (blocking, sangat kecil) supaya tema terpasang SEBELUM halaman
   digambar, tanpa kedipan warna. Daftar tema & tema bawaan diatur di sini. */
(function (Undangan) {
  'use strict';

  /** Nama tema = nilai html[data-theme] di css/themes.css ("pink" = nilai dasar di tokens.css). */
  const THEMES = ['pink', 'matahari', 'lavender', 'sage', 'romantis'];
  /** Tema bawaan bila link tidak menyebut ?tema= */
  const DEFAULT_THEME = 'romantis';
  /** Warna contoh di pemilih tema (hanya tampilan; warna asli dari themes.css). */
  const THEME_LABELS = {
    pink: { label: 'Pink', swatch: '#ff6fa0' },
    matahari: { label: 'Matahari', swatch: '#ffbf00' },
    lavender: { label: 'Lavender', swatch: '#a98bff' },
    sage: { label: 'Sage', swatch: '#7fc29b' },
    romantis: { label: 'Romantis', swatch: '#e8c26a' },
  };
  /** Font tambahan per tema; dimuat hanya saat tema itu dipakai (tema lain tidak membayar ukurannya). */
  const THEME_FONTS = {
    romantis: 'https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Great+Vibes&display=swap',
  };

  function loadThemeFonts(name) {
    const href = THEME_FONTS[name];
    if (!href || document.querySelector(`link[data-theme-font="${name}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.themeFont = name;
    document.head.append(link);
  }

  function themeFromUrl() {
    const q = new URLSearchParams(location.search).get('tema');
    return THEMES.includes(q) ? q : null; // nilai tak dikenal diabaikan
  }

  function applyTheme(name) {
    if (!THEMES.includes(name)) return;
    document.documentElement.dataset.theme = name;
    loadThemeFonts(name);
    // Warna bilah browser HP mengikuti warna "kertas" tema.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue('--paper-200').trim();
  }

  const initial = themeFromUrl() || DEFAULT_THEME;
  document.documentElement.dataset.theme = initial;
  loadThemeFonts(initial);
  Object.assign(Undangan, { THEMES, DEFAULT_THEME, THEME_LABELS, applyTheme });
})((window.Undangan = window.Undangan || {}));
