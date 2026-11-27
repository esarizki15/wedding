(function (Undangan) {
  'use strict';

  /** Akses tabel `wishes` lewat REST API Supabase (tanpa library tambahan). */

  const MAX_NAME = 60;
  const MAX_MESSAGE = 500;
  const ATTENDANCE = ['hadir', 'tidak_hadir'];

  const toQuery = (params) =>
    Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');

  const headers = (db, extra = {}) => ({ apikey: db.key, 'Content-Type': 'application/json', ...extra });

  const isConfigured = () => Undangan.currentDatabase() !== null;

  /** Kunci tamu dari ?to=: huruf kecil, spasi dirapikan. null kalau tak ada nama. */
  function guestKey() {
    const raw = new URLSearchParams(location.search).get('to');
    return raw?.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80) || null;
  }

  /** Ucapan terbaru lebih dulu. */
  async function fetchWishes(limit = 200) {
    const db = Undangan.currentDatabase();
    if (!db) throw new Error('not-configured');
    const query = toQuery({
      select: 'id,name,message,created_at',
      is_hidden: 'eq.false',
      order: 'created_at.desc',
      limit: String(limit),
    });
    const res = await fetch(`${db.url}/rest/v1/wishes?${query}`, { headers: headers(db) });
    if (!res.ok) throw new Error(`fetch-failed:${res.status}`);
    return res.json();
  }

  /** Kirim ucapan. Error('already-sent') kalau guest_key sudah pernah kirim (HTTP 409). */
  async function sendWish({ name, message, attendance }) {
    const db = Undangan.currentDatabase();
    if (!db) throw new Error('not-configured');
    const res = await fetch(`${db.url}/rest/v1/wishes`, {
      method: 'POST',
      headers: headers(db, { Prefer: 'return=minimal' }),
      body: JSON.stringify({
        name: name.trim().slice(0, MAX_NAME),
        message: message.trim().slice(0, MAX_MESSAGE),
        guest_key: guestKey(),
        attendance: ATTENDANCE.includes(attendance) ? attendance : null,
      }),
    });
    if (res.status === 409) throw new Error('already-sent');
    if (!res.ok) throw new Error(`send-failed:${res.status}`);
  }

  Object.assign(Undangan, { MAX_NAME, MAX_MESSAGE, isConfigured, guestKey, fetchWishes, sendWish });
})((window.Undangan = window.Undangan || {}));
