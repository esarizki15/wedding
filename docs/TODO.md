# Daftar Tugas Lanjutan

Status per 27 Nov 2026. Desain, animasi, tema, aksesibilitas, dan deploy sudah selesai.
Sisanya menunggu data asli dari pemilik undangan.

## Perlu data dari pemilik undangan

- [ ] Nama orang tua kedua mempelai (`index.html`, section Mempelai Pria/Wanita)
- [ ] Jam dan alamat akad serta resepsi, beserta tautan Google Maps (`index.html`, section Acara)
- [ ] **Nomor rekening asli** (`index.html`, section Wedding Gift; yang tampil sekarang hanya contoh)
- [ ] Kisah cinta (`index.html`, section Kisah Kami)
- [ ] Bio singkat masing-masing mempelai
- [ ] Foto asli format WebP: `assets/images/mempelai-*.svg`, `assets/images/galeri/img-*.svg` (ganti juga `src` di HTML)
- [ ] Musik asli: `assets/audio/music.wav` (dummy), sesuaikan `src` di `index.html`

## Teknis

- [ ] Buat project Supabase, jalankan `supabase/schema.sql`, isi `SUPABASE` di `js/config.js`
      (disarankan dua project: test dan live). Setelah itu buku tamu keluar dari mode demo.
- [ ] `og:image`: pakai URL absolut dan gambar PNG/JPG agar pratinjau link WhatsApp tampil
      (`<head>` di `index.html`).
- [ ] Opsional: `<meta name="robots" content="noindex">` dan `robots.txt` agar tidak muncul di Google.
- [ ] Opsional: domain sendiri (file `CNAME`, lalu atur di Settings → Pages).

## Keamanan (jangan dilewatkan)

- [ ] Pastikan tidak ada token/kunci rahasia di repo (repo ini publik). Hanya publishable key
      Supabase yang boleh ada di `js/config.js`; jangan pernah `service_role`.
- [ ] Gunakan `gh auth login` atau credential helper untuk push, bukan token di URL remote.

## Sebelum dibagikan ke tamu

Jalankan daftar cek manual di [RULES.md](RULES.md) bagian 8.
