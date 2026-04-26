# Buku Panduan Pengguna — AI Trading Assistant

> Versi: MVP — 26 April 2026
> Pengguna utama: **DR**  ·  Asisten AI: **Rere**

---

## Daftar Isi

1. [Selamat Datang](#1-selamat-datang)
2. [Memulai](#2-memulai)
3. [Halaman Utama (Dashboard)](#3-halaman-utama-dashboard)
4. [Membuat Analisis Baru](#4-membuat-analisis-baru)
5. [Memahami Hasil Analisis](#5-memahami-hasil-analisis)
6. [Riwayat & Statistik Pribadi](#6-riwayat--statistik-pribadi)
7. [Notifikasi & Pengaturan Push](#7-notifikasi--pengaturan-push)
8. [Profil & Keamanan Akun](#8-profil--keamanan-akun)
9. [Lupa Password (3 Langkah)](#9-lupa-password-3-langkah)
10. [Mode Pemula vs Mode Pro](#10-mode-pemula-vs-mode-pro)
11. [Memasang Sebagai Aplikasi (PWA)](#11-memasang-sebagai-aplikasi-pwa)
12. [Untuk Admin & Super Admin](#12-untuk-admin--super-admin)
13. [Pertanyaan yang Sering Diajukan](#13-pertanyaan-yang-sering-diajukan)
14. [Aturan Main & Disclaimer](#14-aturan-main--disclaimer)

---

## 1. Selamat Datang

AI Trading Assistant adalah **asisten pendukung keputusan trading** — bukan
sinyal jadi. Aplikasi ini membantu kamu:

- Membaca chart secara objektif dengan bantuan AI
- Menggabungkan **analisis teknikal**, **berita**, dan **kalender ekonomi**
  dalam satu rekomendasi yang mudah dipahami
- Mencatat hasil trading-mu agar kamu bisa belajar dari pengalaman sendiri

> Slogan internal: *"AI bantu lihat, kamu yang putuskan."*

Bahasa default adalah English; kamu bisa pindah ke Indonesia kapan pun lewat
tombol **EN/ID** di header.

---

## 2. Memulai

### Daftar Akun

1. Buka aplikasi → klik **Sign Up** / **Daftar**.
2. Isi nama tampilan, email, dan password (minimal 6 karakter).
3. Pilih **Mode** sesuai pengalamanmu:
   - **Beginner / Pemula** — penjelasan lebih panjang, banyak konteks edukasi.
   - **Pro** — output ringkas, langsung ke poin teknis.
4. Pilih **Pertanyaan Keamanan** (mis. *"Nama hewan peliharaan pertama
   kamu?"*) dan jawabannya. Ini dipakai jika kamu lupa password.
5. Klik **Sign Up**. Kamu otomatis masuk dan diarahkan ke layar
   onboarding singkat.

### Login

Email + password yang kamu daftarkan. Tekan **Sign In** / **Masuk**.

Sesi-mu akan tetap aktif di perangkat yang sama selama beberapa hari, kecuali
kamu menekan **Logout**.

---

## 3. Halaman Utama (Dashboard)

Ini halaman pertama yang kamu lihat setelah login. Yang ada di sana:

- **Sapaan singkat** dari Rere ("Halo, DR…").
- **Ringkasan analisismu hari ini** — total analisis, instrumen yang aktif,
  performa terakhir.
- **Live Market Quotes** — papan harga real-time dari TradingView untuk
  pasangan/komoditas yang paling sering kamu pakai. Kalau widget gagal
  dimuat (mis. ada ad-blocker), aplikasi otomatis switch ke mini-ticker
  cadangan.
- **Sticky ticker** di bawah header — geser-geser sendiri menampilkan
  harga + headline berita terbaru.
- **Tombol cepat**: *Buat Analisis Baru*, *Riwayat*, *Statistik*.
- **Bell notifikasi** di kanan atas — angka merah = ada notifikasi belum
  dibaca. Klik untuk membuka popover berisi pesan terbaru.
- **Tombol tema** (Light/Dark) dan **EN/ID** di header.

> Bell akan ter-update **otomatis** setiap kali ada notifikasi baru, kamu
> tidak perlu refresh halaman.

---

## 4. Membuat Analisis Baru

1. Tekan **Analyze** / **Analisis** di bottom bar.
2. Pilih **Instrumen**. Halaman dibagi dua tab:
   - **Futures / Komoditas / Indeks** — XAU/USD, XAG/USD, BRENT, HSI,
     NIKKEI, DJIA, NASDAQ, DXY.
   - **Forex** — AUD/USD, EUR/USD, GBP/USD, USD/CHF, USD/JPY, USD/IDR.
   Kalau instrumen yang kamu mau tidak ada di daftar, pakai field
   **Custom Instrument** di bagian bawah.
3. Pilih **Timeframe**:
   - **Intraday** (1m, 5m, 15m, 1h, 4h) — data OHLC diambil dari Yahoo
     Finance dan dipadukan dengan indikator teknikal yang dituning untuk
     timeframe pendek.
   - **Swing/posisi** (1D, 1W) — pakai data harian/mingguan standar.
4. (Opsional) Tambah **Notes** — konteks tambahan untuk Rere, mis.
   "fokus ke level psikologis 2350" atau "abaikan candle wick di 09:30
   karena rolling kontrak".
5. Tekan **Generate Analysis** / **Mulai Analisis**.
6. Tunggu beberapa detik — Rere akan membaca data live + indikator teknikal,
   menggabungkan dengan berita & kalender, lalu menyusun rekomendasi.

> Halaman Analyze **tidak** menerima upload screenshot chart maupun foto
> kamera. Rere bekerja murni dari data harga real-time + indikator teknikal
> + konteks berita/kalender — kamu cukup pilih instrumen, timeframe, dan
> (opsional) tulis catatan singkat.

> Kalau ada field wajib yang belum diisi (misal instrumen belum dipilih),
> aplikasi memunculkan **toast** notifikasi di pojok dan tombol Generate
> tidak akan jalan sampai inputnya valid.

### Chip Kuota

Di kanan atas form ada **chip kuota** (contoh: `4/5 jam · 17/20 hari`).

- **Hijau / biru** — kuota aman.
- **Kuning** — kurang dari 25% sisa.
- **Merah** — tinggal 1 atau 0; analisis berikutnya akan ditolak (HTTP 429)
  sampai jam berikutnya.

> Admin & Super Admin tidak punya batas kuota.

Kuota default: **5 analisis / jam**, **20 analisis / hari**.

---

## 5. Memahami Hasil Analisis

Setiap hasil analisis berisi:

| Bagian                        | Arti                                                                                  |
|-------------------------------|---------------------------------------------------------------------------------------|
| **Market Condition**          | Kondisi pasar: Trending Up / Trending Down / Ranging / Volatile                       |
| **Confidence**                | Tingkat keyakinan AI: Low / Medium / High / Very High (dengan bar visual)             |
| **Bias / Direction**          | Arah yang lebih disukai (Long / Short / Wait)                                         |
| **Key Levels**                | Support, resistance, dan area menarik di chart                                        |
| **Entry / SL / TP** (Pro)     | Skenario entry, stop-loss, take-profit                                                |
| **Reasoning**                 | Alasan teknikal di balik kesimpulan                                                   |
| **News & Calendar Context**   | Berita / data ekonomi dari Newsmaker.id yang relevan                                  |
| **Validity Countdown**        | Sisa waktu sebelum analisis ini dianggap kadaluarsa (lihat tabel di bawah)            |

### Masa Berlaku Analisis

| Timeframe | Berlaku selama |
|-----------|----------------|
| 1m        | 15 menit       |
| 5m        | 1 jam          |
| 15m       | 2,5 jam        |
| 1h        | 5 jam          |
| 4h        | 18 jam         |
| 1D        | 36 jam         |
| 1W        | 96 jam         |

Setelah lewat waktu ini, status analisis berubah jadi **Expired**. Kamu
masih bisa melihatnya di Riwayat, tapi disarankan membuat analisis baru.

### Memberi Feedback

Setelah trading dieksekusi (atau diputuskan untuk skip), kembalilah ke
analisis-nya dan tekan **Tambah Feedback**. Pilih dulu apakah analisisnya
**Useful** atau **Not Useful**, lalu pilih outcome:

- **Correct / Benar** — analisis terbukti akurat
- **Wrong / Salah** — analisis meleset
- **Unknown / Belum Tahu** — kamu tidak meng-eksekusi atau hasilnya belum jelas

Catatan opsionalnya bebas. Feedback ini dipakai untuk statistik personalmu
di halaman Analytics.

---

## 6. Riwayat & Statistik Pribadi

### Riwayat (`/history`)

- Daftar semua analisismu, terbaru di atas.
- Tombol **Filter** (ikon corong di kanan atas) membuka panel dengan tiga
  filter: **Mode** (Beginner / Pro), **Instrumen**, dan rentang **Tanggal**
  (From / To).
- Status (Valid vs Expired) dan badge market-condition tampil otomatis di
  setiap kartu — tidak perlu di-filter manual.
- Klik salah satu kartu untuk melihat detail penuh + feedback.

### Statistik Pribadi (`/analytics`)

Halaman menampilkan:

- **Total analisis** (all-time / bulan ini / minggu ini).
- **Top instruments** — instrumen yang paling sering kamu analisis.
- **Dominant mode** — apakah kamu lebih sering pakai Beginner atau Pro.
- **Self-accuracy gauge** — persentase analisis yang kamu tandai `correct`
  dibanding total feedback yang sudah diisi (plus jumlah feedback yang
  jadi basis perhitungan).
- **Weekly chart** — jumlah analisis per minggu (bar terakhir = minggu
  ini, di-highlight).

> Semakin sering kamu mengisi feedback, semakin akurat angka self-accuracy.

---

## 7. Notifikasi & Pengaturan Push

Buka halaman **Notifikasi** dari bell di header.

### Push Notifikasi (perangkat ini)

Toggle **Push Notifications** untuk mengizinkan browser mengirim peringatan
walaupun aplikasi sedang ditutup. Pertama kali diaktifkan, browser akan
meminta izin — pilih **Allow**.

### Preferensi Notifikasi

Di bawah toggle utama ada kartu **Preferensi Notifikasi** dengan dua
sakelar:

- **Peringatan Analisis Kadaluarsa** — peringatan 2 jam sebelum analisismu
  berakhir. Matikan kalau kamu rasa kebanyakan.
- **Pengumuman & Update** — broadcast dari admin (mis. update fitur,
  maintenance). Dianjurkan tetap menyala.

> Mematikan toggle ini hanya menonaktifkan push (bunyi/notifikasi di luar
> app). Kamu tetap bisa membaca pesannya di halaman Notifikasi.

### Daftar Notifikasi

Tab default menampilkan semua notifikasi (terbaru di atas). Tekan
**Mark all as read** untuk menandai semuanya sudah dibaca.

---

## 8. Profil & Keamanan Akun

Halaman **Profile** (`/profile`) memungkinkan kamu untuk:

- Melihat nama, email, role (User / Admin / Super Admin), dan mode aktif
  (Beginner / Pro) di kartu profil teratas.
- Mengubah **nama tampilan** lewat tombol *Edit* di sebelah nama.
- Mengubah **tema** — hanya tersedia dua pilihan: **Light** atau **Dark**.
  (Mengikuti tema sistem otomatis belum ada di MVP.)
- **Ganti Password** — minta password lama + dua kali password baru.
- **Ganti Pertanyaan Keamanan** — minta password sekarang + pertanyaan
  baru + jawaban baru.
- Pintasan ke **Admin Dashboard** & **User Management** (muncul kalau
  role-mu admin/super-admin).
- **Logout** dari sesi perangkat ini.

> Pengaturan **Bahasa (EN/ID)** tidak ada di halaman Profile — pakai
> tombol toggle EN/ID di header. Pengaturan **Mode (Beginner/Pro)** juga
> tidak bisa diubah dari Profile; pakai toggle Beginner/Pro di kartu mode
> yang ada di **Dashboard** (lihat §10).

---

## 9. Lupa Password (3 Langkah)

1. Di halaman Login, tekan **Forgot Password?** / **Lupa Password?**.
2. Masukkan email akunmu → tekan **Continue**.
3. Sistem menampilkan **pertanyaan keamanan** yang kamu pilih saat daftar.
4. Masukkan jawabannya dengan benar → kamu dapat tautan/halaman untuk
   menetapkan **password baru**.

> Demi keamanan, ada batas percobaan:
> - Maksimal **10 permintaan pertanyaan / 15 menit**
> - Maksimal **5 percobaan jawaban / 15 menit**
>
> Kalau lewat batas, kamu lihat pesan *"Terlalu banyak percobaan"* dan
> harus tunggu beberapa menit sebelum mencoba lagi.

---

## 10. Mode Pemula vs Mode Pro

| Aspek                  | Pemula                                  | Pro                                  |
|------------------------|-----------------------------------------|--------------------------------------|
| Panjang penjelasan     | Lebih panjang, edukatif                 | Ringkas, langsung ke poin            |
| Istilah teknikal       | Disertai definisi singkat               | Diasumsikan sudah paham              |
| Entry / SL / TP        | Diberikan + dijelaskan kenapa           | Diberikan dalam format trader        |
| Visual                 | Penekanan pada bar confidence & emoji   | Tabel padat, detail indikator        |

Mode dipilih saat kamu daftar. Untuk mengubahnya kapan pun, buka
**Dashboard** dan tekan tombol **Beginner** / **Pro** di kartu mode
(tepat di bawah sapaan Rere) — perubahan langsung berlaku untuk analisis
berikutnya.

> Catatan: halaman **Profile** hanya menampilkan mode aktif sebagai badge
> dan tidak punya toggle mode tersendiri di MVP ini. Pakai toggle di
> Dashboard.

Mode hanya mempengaruhi *tampilan* output baru — analisis lama tetap
dengan format saat dibuat.

---

## 11. Memasang Sebagai Aplikasi (PWA)

AI Trading Assistant adalah **Progressive Web App** — bisa di-install
seperti aplikasi native.

**Di Android Chrome:**
1. Buka aplikasi di browser.
2. Tekan menu (titik tiga) → **Add to Home screen**.
3. Konfirmasi nama → ikon muncul di home screen.

**Di iPhone Safari:**
1. Tekan tombol **Share** di bawah.
2. Pilih **Add to Home Screen**.
3. Konfirmasi → ikon muncul di home screen.

**Di Desktop Chrome / Edge:**
- Lihat ikon **Install** di address bar (biasanya pojok kanan).

Setelah di-install, app berjalan **fullscreen tanpa address bar** dan dapat
**push notification** seperti aplikasi native.

---

## 12. Untuk Admin & Super Admin

Akses panel Admin lewat tombol di halaman **Profile** (muncul kalau
role-mu `admin` atau `super_admin`).

### Yang Bisa Dilakukan Admin Biasa

- **Lihat Semua Feedback** (`/admin/feedback`) — paginasi feedback dari
  semua user untuk keperluan QA / kurasi.

> Catatan: di MVP saat ini, halaman **Admin Dashboard** utama (statistik
> sistem + daftar semua analisis) hanya bisa dibuka oleh **super-admin**.
> Admin biasa yang membuka link tersebut akan diarahkan keluar. Endpoint
> backend-nya sendiri menerima admin (boleh dibuka via API), tapi UI-nya
> super-admin only.

### Yang Hanya Super Admin

- **Admin Dashboard** (`/admin`) — statistik sistem (total user hari ini,
  total analisis hari ini / minggu ini / bulan ini, breakdown instrumen,
  breakdown mode) + daftar semua analisis seluruh user.
- **Broadcast Notifikasi** — kirim pengumuman + Web Push ke audience yang
  dipilih:
  - **All** — semua user
  - **Role** — hanya `user`, hanya `admin`, atau hanya `super_admin`
  - **Tag** — hanya user dengan tag tertentu (mis. `vip`, `beta-tester`)
  Setiap broadcast dicatat di **Broadcast History** lengkap dengan jumlah
  recipient final.
- **Manajemen User** — lihat semua user, buat user baru, reset password,
  ubah role, hapus user.
- **Manajemen Tag User** — pasang/lepas tag pada user (untuk audience
  broadcast).
- **Notifikasi Penghapusan User** otomatis dikirim ke seluruh super-admin.

> Admin dan Super Admin **tidak terkena batas kuota analisis**.

---

## 13. Pertanyaan yang Sering Diajukan

**Q: Apakah Rere memberi sinyal trading yang dijamin profit?**
Tidak. Rere memberi *analisis pendukung*, bukan jaminan. Keputusan akhir
tetap di tanganmu, dan trading selalu mengandung risiko kerugian.

**Q: Saya kena pesan "Quota habis", harus bagaimana?**
Tunggu jam berikutnya untuk reset jam-an, atau hari berikutnya untuk reset
harian. Kuota saat ini 5/jam dan 20/hari per user.

**Q: Bell tidak menampilkan notifikasi terbaru.**
Pastikan kamu masih login dan koneksi internet stabil. Notifikasi datang
otomatis tanpa perlu refresh; jika tidak muncul, refresh halaman sekali
lalu cek lagi.

**Q: Push notification tidak masuk meski sudah Allow.**
Cek halaman Notifikasi → toggle "Push Notifications" harus ON. Lalu cek
"Preferensi Notifikasi" — jika kategori yang relevan dimatikan, push tidak
akan dikirim. Di iPhone, push hanya bekerja setelah aplikasi di-install ke
home screen (PWA).

**Q: Bisa ganti email?**
Belum tersedia di MVP — hubungi admin/super-admin untuk perubahan email.

**Q: Bahasa berubah sendiri.**
Bahasa mengikuti pilihan terakhir lewat tombol **EN/ID** di header (atas
kanan) — pilihan disimpan di browser ini. Kalau kamu buka di browser /
device lain, set ulang lewat tombol tersebut.

**Q: Apakah analisis lama saya hilang setelah kadaluarsa?**
Status berubah jadi *Expired* tapi tetap kebaca di **Riwayat**. Demi
ringan-nya database, sistem **otomatis menghapus analisis yang lebih
tua dari 90 hari** (kamu akan dapat notifikasi peringatan 7 hari sebelum
deadline supaya bisa screenshot kalau memang perlu disimpan).

**Q: Pesan validasi form (mis. "Email wajib") tidak muncul di bawah field
di halaman Login / Register / Profile.**
Ini bug lama yang sudah diperbaiki di versi 26 April 2026. Pastikan kamu
hard-refresh browser (Ctrl/Cmd + Shift + R) supaya bundle terbaru
terpasang. Catatan: halaman **Analyze** memang sengaja memakai toast
notifikasi (bukan pesan inline) untuk validasi.

**Q: Harga di kotak "Live Market Quotes" tidak muncul.**
Widget berasal dari TradingView; biasanya kena ad-blocker atau ekstensi
privasi. Kalau widget tidak menampilkan iframe dalam beberapa detik,
sistem otomatis switch ke ticker mini cadangan yang menarik harga dari
server kami. Kalau masih kosong, matikan ad-blocker untuk domain ini lalu
refresh halaman.

---

## 14. Aturan Main & Disclaimer

- **Bukan saran finansial.** Output Rere adalah opini AI berdasarkan data
  harga publik (Yahoo Finance untuk intraday, sumber harian/mingguan
  standar untuk swing), berita & kalender ekonomi dari Newsmaker.id, plus
  catatan opsional yang kamu tulis sendiri. Bukan rekomendasi resmi dari
  penasihat keuangan berlisensi.
- **Trading mengandung risiko.** Hanya gunakan dana yang siap kamu
  rugikan. Aplikasi ini *tidak* menjamin profit.
- **Privasi.** Catatan (Notes) yang kamu isi di halaman Analyze hanya
  dipakai sebagai konteks tambahan untuk analisismu sendiri dan tidak
  dibagikan ke pengguna lain. Aplikasi tidak menerima upload screenshot
  chart maupun foto kamera.
- **Data partner.** Berita & kalender ekonomi disediakan oleh
  **Newsmaker.id**, harga intraday oleh **Yahoo Finance**, papan harga
  Dashboard oleh **TradingView**. Akurasi mengikuti sumber asli.

---

> Butuh bantuan tambahan? Hubungi admin lewat menu *Help* di Profile, atau
> kirim feedback langsung dari menu *Settings → Send Feedback*.
