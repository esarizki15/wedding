(function (Undangan) {
  'use strict';

  const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]', ''];

  /** 'before' | 'after'. Di lokal bisa dipaksa lewat ?fase=setelah / ?fase=sebelum. */
  function currentPhase() {
    if (LOCAL_HOSTS.includes(location.hostname)) {
      const forced = new URLSearchParams(location.search).get('fase');
      if (forced === 'setelah') return 'after';
      if (forced === 'sebelum') return 'before';
    }
    return Date.now() >= Date.parse(Undangan.AFTER_FROM) ? 'after' : 'before';
  }

  /** Panggil paling awal. Hapus elemen fase lain: [data-only="before|after"]. */
  function initPhase() {
    const phase = currentPhase();
    document.documentElement.dataset.phase = phase;
    const other = phase === 'after' ? 'before' : 'after';
    document.querySelectorAll(`[data-only="${other}"]`).forEach((el) => el.remove());
    if (phase === 'after') {
      document.querySelectorAll('[data-only="after"]').forEach((el) => el.removeAttribute('hidden'));
    }
    return phase;
  }

  Object.assign(Undangan, { currentPhase, initPhase });
})((window.Undangan = window.Undangan || {}));
