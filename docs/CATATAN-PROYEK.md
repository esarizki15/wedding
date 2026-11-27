# Catatan Proyek (untuk melanjutkan di mesin atau sesi baru)

Ringkasan keputusan dan status, supaya pekerjaan bisa dilanjutkan tanpa konteks percakapan sebelumnya.
Daftar tugas ada di [TODO.md](TODO.md); aturan perilaku dan skenario uji ada di [RULES.md](RULES.md).

## Tentang proyek

Undangan pernikahan digital statis (HTML/CSS/JS vanilla, tanpa build) untuk **Esa Rizki Hari Utama, M.Kom**
dan **Siti Khodijah** (nama panggilan "Khodi"). Akad 1 Desember 2026, Sumedang, Jawa Barat.
Gaya animasinya meniru situs referensi satriadanfebi.cimangclub.my.id: section memenuhi layar dengan
scroll-snap, teks dipecah per huruf/baris, dan bunga diperlakukan berbeda di tiap section.

- Repo: `github.com/esarizki15/wedding` (public)
- Live: `https://esarizki15.github.io/wedding/`
- Deploy: GitHub Actions (`.github/workflows/pages.yml`) setiap push ke `main`. Hanya `index.html`,
  `css/`, `js/`, dan `assets/` yang diterbitkan. Di repo, Settings → Pages → Source harus **GitHub Actions**.
- Link tamu: `?to=Nama+Tamu`. Tema: `?tema=nama`; `?tema=pilih` menampilkan pemilih tema.

## Keputusan desain

- **Tema bawaan: romantis** (Great Vibes + Cormorant Infant, pink + emas, bayangan lembut, foto lengkung).
  Tema lain: pink (nilai dasar di `css/tokens.css`), matahari, lavender, sage.
  Pasangan menyukai warna pink, karena itu maskot sengaja **mawar berlapis**, bukan bunga matahari.
- Semua warna lewat token (`css/tokens.css`, `css/themes.css`). Tema hanya menimpa token; font tema
  dimuat hanya saat tema itu aktif (`js/theme-boot.js`).
- Aksesibilitas sudah diaudit dan diuji: kontras teks ≥ 4,5:1 di semua tema, ring fokus keyboard,
  target sentuh ≥ 44px, ikon SVG (bukan emoji), dan `prefers-reduced-motion` dihormati.
- Bunga (maskot) adalah SVG inline (`<use href="#flower">`) yang warnanya mengikuti tema.
- Penutup memakai animasi "matahari terbenam" dengan variabel `--sun-t`.

## Sistem animasi singkat

`snap.js` memberi `.is-active` pada section yang tampil; elemen `[data-anim]` di dalamnya beranimasi dan
diputar ulang tiap section dikunjungi lagi. Preset: rise, from-left, from-right, stamp, bloom, stick, wipe,
curtain, zoom-out, pop-shake. Teks: `data-split="letters|lines|type"`. Section panjang memakai
`data-reveal-blocks` (blok diaktifkan satu per satu oleh `reveal.js`). Detail di `RULES.md` bagian 7.

## Jebakan yang pernah ditemui (jangan diulang)

- Token CSS yang dipakai tapi belum didefinisikan membuat deklarasi (mis. `padding`) tidak berlaku diam-diam.
  Selalu cek token baru ada di `tokens.css`.
- `clip-path: inset(0)` pada elemen beranimasi memotong bayangan; gunakan inset negatif.
- Sticky di dalam section butuh `overflow: clip`, bukan `hidden`.
- Font tema dimuat belakangan, jadi pemenggalan baris (`split-lines.js`) dihitung ulang saat `loadingdone`.
- Elemen `<path>` di dalam `<use>` tidak bisa di-query langsung (shadow tree); baca nilai CSS variable.

## Cara menguji lokal

```sh
python3 -m http.server 8000     # buka http://localhost:8000/?to=Budi+Santoso
```

Uji otomatis dilakukan dengan Playwright (Chromium headless) dari luar repo: periksa error konsol, 404,
ukuran target sentuh, ring fokus, dan screenshot per section.

## Langkah berikutnya

Lihat [TODO.md](TODO.md). Yang paling memajukan: kirim data asli (orang tua, jam & alamat acara,
rekening, kisah cinta, foto, musik), lalu hubungkan Supabase untuk buku tamu.
