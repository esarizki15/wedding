(function (Undangan) {
  'use strict';

  const MAX_LENGTH = 60;

  /** Nama tamu dari ?to=Budi+Santoso. Kosong → teks bawaan HTML dipakai. */
  function guestName() {
    const raw = new URLSearchParams(location.search).get('to');
    return raw?.replace(/\s+/g, ' ').trim().slice(0, MAX_LENGTH) || null;
  }

  function initGuestName(root = document) {
    const name = guestName();
    if (!name) return;
    // textContent / value (bukan innerHTML) supaya input URL tidak bisa menyisipkan HTML.
    root.querySelectorAll('[data-guest-name]').forEach((el) => { el.textContent = name; });
    root.querySelectorAll('[data-guest-name-input]').forEach((el) => { el.value = name; });
  }

  Object.assign(Undangan, { guestName, initGuestName });
})((window.Undangan = window.Undangan || {}));
