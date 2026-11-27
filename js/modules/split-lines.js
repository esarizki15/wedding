(function (Undangan) {
  'use strict';

  /**
   * Memecah paragraf [data-split="lines"] jadi span per BARIS sesuai pemenggalan
   * yang benar-benar tampil, supaya bisa dianimasikan baris demi baris.
   * Pemenggalan bergantung lebar layar & font, jadi panggil SETELAH font siap;
   * dihitung ulang otomatis saat lebar elemen berubah (rotasi HP, resize).
   */
  function initSplitLines(root = document) {
    root.querySelectorAll('[data-split="lines"]').forEach((el) => {
      const text = el.textContent.replace(/\s+/g, ' ').trim();
      let lastWidth = 0;
      const build = () => {
        if (el.clientWidth === lastWidth) return;
        lastWidth = el.clientWidth;
        rebuild(el, text);
      };
      build();
      new ResizeObserver(build).observe(el);
      // Font tema dimuat belakangan → pemenggalan baris harus dihitung ulang setelah font siap.
      document.fonts?.addEventListener?.('loadingdone', () => { lastWidth = 0; build(); });
    });
  }

  function rebuild(el, text) {
    // 1. Pasang kata satu-satu untuk mengukur posisi barisnya.
    const words = text.split(' ').map((w) => Object.assign(document.createElement('span'), { textContent: w }));
    el.replaceChildren();
    words.forEach((s, i) => { if (i) el.append(' '); el.append(s); });

    // 2. Kelompokkan kata menurut posisi vertikal.
    const lines = [];
    let top = null;
    for (const s of words) {
      if (s.offsetTop !== top) { lines.push([]); top = s.offsetTop; }
      lines.at(-1).push(s.textContent);
    }

    // 3. Ganti dengan satu blok per baris.
    el.replaceChildren(...lines.map((ws, i) => {
      const line = document.createElement('span');
      line.className = 'split__line';
      line.style.setProperty('--line-i', i);
      line.textContent = ws.join(' ');
      return line;
    }));
    el.setAttribute('data-split-ready', '');
  }

  Object.assign(Undangan, { initSplitLines });
})((window.Undangan = window.Undangan || {}));
