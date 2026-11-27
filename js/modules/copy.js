(function (Undangan) {
  'use strict';

  /** Tombol [data-copy] menyalin teks [data-copy-text] di dalam kartu yang sama. */
  function initCopy() {
    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const text = btn.closest('.card')?.querySelector('[data-copy-text]')?.textContent.trim();
        if (!text) return;
        const label = btn.textContent;
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = 'Tersalin';
        } catch {
          btn.textContent = 'Gagal menyalin';
        }
        setTimeout(() => { btn.textContent = label; }, 1500);
      });
    });
  }

  Object.assign(Undangan, { initCopy });
})((window.Undangan = window.Undangan || {}));
