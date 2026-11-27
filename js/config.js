(function (Undangan) {
  'use strict';

  /** Tanggal acara (ISO dengan zona waktu) — dipakai countdown & fase. */
  const EVENT_START = '2026-12-01T08:00:00+07:00';
  /** Mulai tanggal ini halaman berubah jadi "kenangan" (H+1). */
  const AFTER_FROM = '2026-12-02T00:00:00+07:00';

  /**
   * Supabase: isi dari Project Settings → API.
   * `key` = Publishable key (sb_publishable_...). Aman di frontend karena
   * dibatasi RLS (lihat supabase/schema.sql). JANGAN pasang service_role.
   * Idealnya pakai project terpisah untuk test dan live.
   */
  const SUPABASE = { url: '', key: '' };

  function currentDatabase() {
    const { url, key } = SUPABASE;
    return url && key ? { url: url.replace(/\/+$/, ''), key } : null;
  }

  /**
   * Data contoh untuk MODE DEMO: dipakai otomatis selama SUPABASE belum diisi.
   * Kiriman form di mode demo hanya tampil di halaman ini (tidak disimpan).
   */
  const DUMMY_WISHES = [
    { name: 'Dina Anggraini', message: 'Selamat menempuh hidup baru, Esa & Khodi! Semoga sakinah, mawaddah, warahmah. 🌸' },
    { name: 'Keluarga Besar Wijaya', message: 'Barakallahu lakuma wa baraka alaikuma. Bahagia selalu dan lekas dikaruniai momongan.' },
    { name: 'Bagas Saputra', message: 'Akhirnya! Setelah 5 tahun. Semoga lancar sampai hari H, bro. Sampai ketemu di Sumedang!' },
    { name: 'Maya', message: 'Selamat ya Khodi, cantik banget undangannya. Doa terbaik buat kalian berdua.' },
  ];

  Object.assign(Undangan, { EVENT_START, AFTER_FROM, SUPABASE, DUMMY_WISHES, currentDatabase });
})((window.Undangan = window.Undangan || {}));
