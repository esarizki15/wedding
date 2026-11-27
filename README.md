# Undangan Pernikahan Digital

Situs statis (HTML/CSS/JS vanilla, tanpa build) + Supabase untuk buku tamu.

## Struktur

```
index.html            satu halaman, semua section
css/tokens.css        warna/font/ukuran/motion (tema dasar = pink)
css/themes.css        tema lain: matahari, lavender, sage, romantis (+ pemilih tema)
js/theme-boot.js      daftar tema, tema bawaan, & font per tema (dimuat di <head>)
css/base.css          reset, tombol, kartu
css/layout.css        frame 430px, tombol musik
css/sections/*.css    gaya per section
js/config.js          tanggal acara + kredensial Supabase
css/animations.css    sistem animasi: [data-anim], split huruf/baris/ketik, spin, pop-shake
css/components/       lightbox galeri
js/modules/*.js       satu modul per fitur (phase, guest-name, countdown, copy, music, wishes, snap, reveal, split-letters, split-lines, gallery)
js/main.js            merangkai semua modul
supabase/schema.sql   tabel wishes + RLS
assets/images, audio  foto & musik (saat ini dummy, lihat "Data dummy")
```

Aturan dan skenario pengujian lengkap ada di [docs/RULES.md](docs/RULES.md).

## Menjalankan lokal

```sh
python3 -m http.server 8000     # lalu buka http://localhost:8000/?to=Budi+Santoso
```

- `?to=Nama+Tamu` mengisi nama di cover dan form ucapan.
- `?fase=setelah` / `?fase=sebelum` memaksa fase (hanya di localhost).

## Menyiapkan Supabase

1. Buat project (disarankan **dua**: test dan live).
2. Jalankan `supabase/schema.sql` di SQL Editor.
3. Isi `SUPABASE.url` dan `SUPABASE.key` (publishable key) di `js/config.js`.

Jangan pernah memasang `service_role` / secret key di frontend.

## Data dummy

Proyek ini sudah berisi data contoh (Esa & Khodi) supaya UI langsung terlihat penuh:

- Foto placeholder SVG di `assets/images/` dan `assets/images/galeri/` (8 foto), musik dummy `assets/audio/music.wav`.
- Ucapan contoh `DUMMY_WISHES` di `js/config.js`. Selama `SUPABASE` kosong, buku tamu berjalan
  dalam **mode demo** (kiriman tidak disimpan).
- Ganti foto dengan WebP asli dan musik dengan MP3 asli sebelum dibagikan.

## Yang perlu diganti

- Nama, orang tua, alamat acara, tautan peta, dan rekening di `index.html`.
- `EVENT_START` dan `AFTER_FROM` di `js/config.js`.
- Warna dan font di `css/tokens.css`.
- Foto di `assets/images/` (gunakan WebP) dan musik di `assets/audio/` (lalu sesuaikan `src` di `index.html`).

## Fase sebelum/sesudah hari H

Elemen `data-only="before"` dihapus setelah `AFTER_FROM`; `data-only="after"` (awalnya
`hidden`) baru ditampilkan setelahnya. Lihat `js/modules/phase.js`.

## Tema warna

Lima tema tersedia: **romantis** (bawaan), **pink**, **matahari**, **lavender**, dan **sage**.

**romantis** (bawaan) berbeda dari yang lain: selain warna (pink + emas), ia mengganti font menjadi
tulisan sambung (Great Vibes) + serif (Cormorant Infant), memakai bayangan lembut, sudut membulat, dan foto
berbentuk lengkung. Font-nya hanya dimuat saat tema ini dipakai.

- Ganti tema bawaan: ubah `DEFAULT_THEME` di `js/theme-boot.js`.
- Per link: `?tema=lavender` (bisa digabung dengan nama tamu: `?to=Budi&tema=sage`).
- Mencoba-coba: buka `?tema=pilih` untuk menampilkan pemilih tema.
- Tema baru: salin satu blok di `css/themes.css` (hanya 7 warna), lalu daftarkan namanya di
  `js/theme-boot.js`. Warna maskot bunga ikut otomatis. Tema yang juga mengubah font/bentuk (seperti romantis) cukup menimpa token
  `--font-*`, `--radius*`, `--border`, `--shadow-hard` di blok temanya.

## Animasi

Section memenuhi layar dengan scroll-snap. Saat section tampil ia mendapat `.is-active` dan elemen
`[data-anim="..."]` di dalamnya beranimasi; animasi **diputar ulang** setiap kali section dikunjungi lagi.
Contoh pemakaian di HTML:

```html
<h2 data-split="letters" style="--delay: 400ms">Judul per huruf</h2>
<p  data-split="lines"   style="--delay: 900ms">Paragraf muncul baris demi baris.</p>
<div data-anim="from-left" style="--delay: 600ms">Datang dari kiri</div>
<img data-anim="bloom" data-spin src="assets/images/bunga.svg" alt="">
```

Daftar preset dan aturannya ada di [docs/RULES.md](docs/RULES.md) bagian 7.

## Publish ke GitHub Pages

Situs ini statis dan semua path-nya relatif, jadi jalan baik di `https://USER.github.io/REPO/`
maupun di domain sendiri.

1. Buat repo di GitHub, lalu dari folder proyek:
   ```sh
   git init -b main
   git add .
   git commit -m "Undangan pernikahan"
   git remote add origin https://github.com/USER/REPO.git
   git push -u origin main
   ```
2. Di GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Setiap push ke `main`, workflow [.github/workflows/pages.yml](.github/workflows/pages.yml) menerbitkan
   situs. Alamatnya tampil di tab **Actions** dan di Settings → Pages.

Catatan:
- Workflow hanya menerbitkan `index.html`, `css/`, `js/`, dan `assets/`. Folder `docs/` dan
  `supabase/` tidak ikut tampil.
- Repo publik berarti kode (termasuk publishable key Supabase) terbaca siapa saja. Itu aman
  **selama RLS di `supabase/schema.sql` sudah dijalankan**. Jangan pernah commit `service_role`.
- Pratinjau link di WhatsApp butuh `og:image` berupa URL absolut dan gambar PNG/JPG
  (SVG tidak ditampilkan). Ubah di `<head>` `index.html`.
- Repo privat hanya bisa memakai Pages di paket GitHub berbayar.
- Domain sendiri: tambahkan file `CNAME` berisi nama domain, lalu atur di Settings → Pages.
