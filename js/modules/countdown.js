(function (Undangan) {
  'use strict';

  function initCountdown() {
    const root = document.querySelector('[data-countdown]');
    if (!root) return; // dihapus oleh phase setelah hari H
    const target = Date.parse(Undangan.EVENT_START);
    const cells = Object.fromEntries(
      [...root.querySelectorAll('[data-unit]')].map((el) => [el.dataset.unit, el]),
    );

    const tick = () => {
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const days = Math.floor(s / 86400); s %= 86400;
      const hours = Math.floor(s / 3600); s %= 3600;
      const minutes = Math.floor(s / 60);
      const seconds = s % 60;
      const v = { days, hours, minutes, seconds };
      for (const k in v) if (cells[k]) cells[k].textContent = String(v[k]).padStart(2, '0');
    };

    tick();
    setInterval(tick, 1000);
  }

  Object.assign(Undangan, { initCountdown });
})((window.Undangan = window.Undangan || {}));
