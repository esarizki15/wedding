# Catatan Skenario Rule

Daftar aturan (rule) yang berlaku di undangan, lengkap dengan skenario, hasil yang
diharapkan, dan letak kodenya. Dipakai sebagai acuan saat mengubah perilaku atau
menguji manual sebelum dibagikan ke tamu.

## 1. Fase halaman (sebelum / sesudah hari H)

Kode: `js/modules/phase.js`, `AFTER_FROM` di `js/config.js`.

| # | Skenario | Hasil yang diharapkan |
|---|----------|-----------------------|
| 1.1 | Waktu sekarang < `AFTER_FROM` (2 Des 2026 00:00 WIB) | Fase `before`: Acara & Countdown tampil, Terima Kasih dihapus |
| 1.2 | Waktu sekarang ≥ `AFTER_FROM` | Fase `after`: Acara & Countdown dihapus, Terima Kasih tampil (atribut `hidden` dilepas) |
| 1.3 | Buka di `localhost` dengan `?fase=setelah` / `?fase=sebelum` | Fase dipaksa sesuai parameter |
| 1.4 | Buka di domain live dengan `?fase=setelah` | Parameter **diabaikan**, fase murni dari tanggal |
| 1.5 | Elemen berlabel `data-only="before"` / `"after"` | Dihapus dari DOM bila bukan fase aktif, jadi modul lain tidak memindainya |

Catatan: fase dihitung dari jam perangkat tamu. Jam HP yang salah bisa memunculkan fase yang salah.

## 2. Nama tamu (`?to=`)

Kode: `js/modules/guest-name.js`.

| # | Skenario | Hasil yang diharapkan |
|---|----------|-----------------------|
| 2.1 | `?to=Budi+Santoso` | Cover menampilkan "Budi Santoso"; field Nama di form terisi |
| 2.2 | Tanpa `?to=` atau nilainya kosong/spasi | Teks bawaan HTML ("Tamu Undangan") dipakai; field Nama kosong |
| 2.3 | Nama > 60 karakter | Dipotong di 60 karakter |
| 2.4 | Spasi berulang / di ujung | Dirapikan jadi satu spasi, ujung dipangkas |
| 2.5 | `?to=<img src=x onerror=alert(1)>` | Tampil sebagai teks biasa, tidak dieksekusi (`textContent` / `value`) |

## 3. Buku tamu (ucapan)

Kode: `js/modules/wishes.js`, `js/modules/wishes-api.js`, `supabase/schema.sql`.

| # | Skenario | Hasil yang diharapkan |
|---|----------|-----------------------|
| 3.1 | `SUPABASE.url` / `key` belum diisi | **Mode demo**: tampil `DUMMY_WISHES` dari `js/config.js`; kiriman form hanya muncul di halaman (hilang saat refresh, tidak dikirim ke server). Status: "Mode demo…" |
| 3.2 | Kirim ucapan valid (nama + ucapan) | Status "Terkirim!", textarea dikosongkan, daftar dimuat ulang |
| 3.3 | Ucapan > 500 karakter / nama > 60 | Ditahan `maxlength` di form, dipotong lagi di kode, ditolak `check` di database |
| 3.4 | Link yang sama (`?to=` sama, tak peduli huruf besar/kecil) kirim dua kali | Kiriman kedua ditolak HTTP 409 → "Link undangan ini sudah pernah mengirim ucapan" |
| 3.5 | Tanpa `?to=` | `guest_key` = null; **tidak ada batas** kiriman ganda (unique index hanya untuk non-null) |
| 3.6 | Kehadiran tidak dipilih | `attendance` = null, kiriman tetap sah |
| 3.7 | Ucapan berisi HTML/script | Ditampilkan sebagai teks, tidak dieksekusi |
| 3.8 | Admin menandai `is_hidden = true` di Table Editor | Ucapan hilang dari daftar publik |
| 3.9 | Publik mencoba update/delete lewat REST | Ditolak (tidak ada policy & grant) |
| 3.10 | Publik mencoba mengirim `is_hidden` atau `id` sendiri | Ditolak: grant insert hanya `name, message, attendance, guest_key` |
| 3.11 | Jaringan gagal saat kirim / muat | Pesan galat umum, tombol aktif lagi, form tidak hilang |

Catatan keamanan: `guest_key` bisa dibaca publik lewat select. Rule 3.4 mencegah kiriman
ganda yang tidak disengaja, bukan pencegah penyalahgunaan; orang yang tahu link orang lain
bisa memakainya. Kalau perlu lebih ketat, pakai token acak per tamu, bukan nama.

## 4. Countdown

Kode: `js/modules/countdown.js`, `EVENT_START` di `js/config.js`.

| # | Skenario | Hasil yang diharapkan |
|---|----------|-----------------------|
| 4.1 | Sebelum `EVENT_START` | Hari/jam/menit/detik berkurang tiap detik |
| 4.2 | Setelah `EVENT_START` namun sebelum `AFTER_FROM` | Semua angka berhenti di 00 (tidak negatif) |
| 4.3 | Setelah `AFTER_FROM` | Section dihapus oleh fase; modul keluar tanpa galat |

## 5. Musik

Kode: `js/modules/music.js`.

| # | Skenario | Hasil yang diharapkan |
|---|----------|-----------------------|
| 5.1 | Tamu menekan "Buka Undangan" | Musik mulai, tombol toggle muncul |
| 5.2 | Tamu menekan toggle saat memutar | Jeda; tekan lagi, lanjut |
| 5.3 | Tab/aplikasi disembunyikan | Musik dijeda; kembali ke tab → lanjut **hanya bila** tadi memang diputar/diinginkan |
| 5.4 | Browser menolak autoplay / file audio tidak ada | Tidak ada galat tampak; tombol tetap bisa dicoba |

## 6. Galeri & lightbox

Kode: `js/modules/gallery.js`, `css/components/lightbox.css`.

| # | Skenario | Hasil yang diharapkan |
|---|----------|-----------------------|
| 6.1 | Tap thumbnail | Lightbox terbuka di foto itu, penghitung "n / total" |
| 6.2 | Tombol ‹ ›, panah keyboard, atau swipe ≥ 50px | Pindah foto; dari foto terakhir lanjut ke pertama (berputar) |
| 6.3 | Esc, tombol ✕, atau klik area gelap | Lightbox menutup, fokus kembali ke thumbnail yang terakhir dilihat |
| 6.4 | Lightbox terbuka | Halaman di belakang tidak bisa di-scroll (`html.lb-open`) |
| 6.5 | Thumbnail punya `data-full="..."` | Lightbox memakai gambar resolusi penuh itu; kalau tidak, pakai `src` thumbnail |
| 6.6 | Tab ditekan berulang | Fokus terkunci di dalam dialog (perilaku `<dialog>` modal) |

## 7. Animasi & scroll

Kode: `css/animations.css`, `js/modules/snap.js`, `reveal.js`, `split-letters.js`, `split-lines.js`.

| # | Skenario | Hasil yang diharapkan |
|---|----------|-----------------------|
| 7.1 | Section melewati pita 20% di tengah layar | Section dapat `.is-active`; semua `[data-anim]` di dalamnya masuk |
| 7.2 | Section ditinggalkan lalu didatangi lagi | Elemen keluar cepat (300ms), lalu animasi masuk **diputar ulang** |
| 7.3 | Preset `[data-anim]` | `rise`, `from-left`, `from-right`, `stamp`, `bloom`, `stick`, `wipe`, `wipe-from-right`, `curtain`, `zoom-out`, `pop-shake` (nama = arah datang) |
| 7.4 | Jeda animasi | `--delay` eksplisit, atau `--i` × `--stagger` bila tidak ada |
| 7.5 | `data-split="letters"` / `"type"` | Teks dipecah per huruf (total durasi tetap) / efek mesin ketik + kursor |
| 7.6 | `data-split="lines"` | Dipecah per baris sesuai pemenggalan nyata; dihitung ulang saat lebar berubah |
| 7.7 | Teks terpecah | Teks utuh ada di `.sr-only` untuk screen reader; versi terpecah `aria-hidden` |
| 7.8 | Section lebih tinggi dari layar (`data-reveal-blocks`) | Tiap blok `[data-reveal]` aktif sendiri saat masuk layar, dicabut saat keluar |
| 7.9 | `[data-spin]` (bunga) | Berputar terus, dijeda saat section tidak aktif |
| 7.10 | JavaScript mati | Keadaan awal "tersembunyi" hanya berlaku bila `html.js`, jadi konten tetap terlihat |
| 7.11 | OS mengaktifkan *reduce motion* | Transisi 1ms, tanpa gerak, tanpa putaran/getar |
| 7.12 | Tombol `[data-scroll-next]` | Menggulung halus ke section berikutnya (tanpa animasi bila reduce motion) |
| 7.13 | Tombol "Geser untuk membuka" (`[data-open]`) | Memulai musik dan pindah ke section berikutnya |

### 7b. Perilaku bunga (maskot) per section

Tiap section punya perlakuan sendiri (bukan satu animasi yang diulang):

| Section | Posisi & gerak | Catatan |
|---------|----------------|---------|
| Cover | Besar di tengah; `bloom` (mekar + putar balik) lalu berputar 40 dtk/putaran | Putaran dijeda saat section tidak aktif |
| Acara | Terpotong di pojok kanan atas; `bloom` + berputar | |
| Countdown | Terpotong di bawah tengah; `rise` 6rem dari bawah + berputar | Muncul terakhir (1400ms) |
| Kisah | **Sticky** kanan atas di latar gelap; ikut terbawa saat scroll, di belakang teks | Wajib `overflow: clip` di section, bukan `hidden` |
| Hadiah | **Sticky** kiri atas, terpotong | Konten diberi `padding-top` agar judul tidak tertimpa |
| Penutup | Bunga blush raksasa yang "terbenam" seperti matahari: naik 1,4 dtk → terbenam pelan 30 dtk → jeda 3 dtk → ulang; berputar 60 dtk | Variabel `--sun-t` mengatur posisi bunga|

Di *reduce motion*, bunga penutup diam di posisi naik penuh (`--sun-t: 0`).

## 7c. Tema warna

Kode: `css/tokens.css` (bawaan = pink), `css/themes.css`, `js/theme-boot.js`, `js/modules/theme-picker.js`.

| # | Skenario | Hasil yang diharapkan |
|---|----------|-----------------------|
| 7c.1 | Link tanpa `?tema=` | Tema bawaan (`DEFAULT_THEME` di `js/theme-boot.js`, saat ini `pink`) |
| 7c.2 | `?tema=matahari` / `lavender` / `sage` / `pink` | Tema itu dipakai sejak gambar pertama (tanpa kedipan warna) |
| 7c.3 | `?tema=` berisi nama yang tidak dikenal | Diabaikan, tema bawaan dipakai |
| 7c.4 | `?tema=pilih` | Pemilih tema muncul di atas; klik mengganti warna langsung dan memperbarui `?tema=` di URL agar bisa disalin |
| 7c.5 | Tamu biasa | Tidak pernah melihat pemilih tema |
| 7c.6 | Maskot bunga | SVG inline (`<use href="#flower">`) yang warnanya dari token `--flower-*`, jadi ikut tema otomatis |
| 7c.7 | Bilah browser HP | `meta theme-color` mengikuti warna "kertas" tema |
| 7c.8 | Foto dummy (`assets/images/*.svg`) | Warnanya tetap (pink); foto asli menggantikannya, jadi tidak ikut tema |

Syarat kontras tiap tema: `--ink-800` terbaca di atas `--paper-200`, `--ink-950` terbaca di atas `--accent-500` (teks tombol), dan `--paper-200` terbaca di atas `--ink-800`.

## 8. Daftar cek manual sebelum dibagikan

1. Buka dengan `?to=` berisi nama panjang dan karakter khusus; cek cover tidak meluber.
2. Kirim satu ucapan, lalu coba kirim lagi dari link yang sama (harus ditolak).
3. Cek `?fase=setelah` di localhost; bagian Terima Kasih tampil, Acara/Countdown hilang.
4. Buka galeri, geser ke kiri/kanan, tutup dengan Esc dan tap area gelap.
5. Aktifkan *reduce motion* di OS, muat ulang, pastikan tidak ada gerak.
6. Uji di HP asli (iOS Safari & Chrome Android): musik, swipe, dan keyboard form.
7. Pastikan tidak ada `service_role` / secret key di kode yang di-deploy.
