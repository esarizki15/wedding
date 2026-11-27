(function (Undangan) {
  'use strict';

  /**
   * Pemilih tema untuk mencoba-coba: hanya muncul bila link memakai ?tema=pilih.
   * Tamu biasa tidak pernah melihatnya. Memilih tema mengganti warna langsung dan
   * memperbarui ?tema= di URL, jadi tautannya bisa disalin untuk dibagikan.
   */
  function initThemePicker() {
    const { THEMES, THEME_LABELS, applyTheme } = Undangan;
    applyTheme(document.documentElement.dataset.theme); // sinkronkan meta theme-color

    if (new URLSearchParams(location.search).get('tema') !== 'pilih') return;

    const bar = document.createElement('div');
    bar.className = 'theme-picker';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Pilih tema warna');

    const mark = () =>
      bar.querySelectorAll('button').forEach((b) =>
        b.setAttribute('aria-pressed', String(b.dataset.theme === document.documentElement.dataset.theme)));

    THEMES.forEach((name) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.theme = name;
      const dot = document.createElement('i');
      dot.style.background = THEME_LABELS[name]?.swatch || 'currentColor';
      btn.append(dot, THEME_LABELS[name]?.label || name);
      btn.addEventListener('click', () => {
        applyTheme(name);
        const url = new URL(location.href);
        url.searchParams.set('tema', name);
        history.replaceState(null, '', url);
        mark();
      });
      bar.append(btn);
    });

    document.body.append(bar);
    mark();
  }

  Object.assign(Undangan, { initThemePicker });
})((window.Undangan = window.Undangan || {}));
