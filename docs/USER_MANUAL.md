# Buku Panduan Pengguna — AI Trading Assistant

> Versi: MVP — 25 April 2026
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
- **Tombol cepat**: *Buat Analisis Baru*, *Riwayat*, *Statistik*.
- **Bell notifikasi** di kanan atas — angka merah = ada notifikasi belum
  dibaca. Klik untuk membuka popover berisi pesan terbaru.
- **Tombol tema** (Light/Dark) dan **EN/ID** di header.

> Bell akan ter-update **otomatis** setiap kali ada notifikasi baru, kamu
> tidak perlu refresh halaman.

---

## 4. Membuat Analisis Baru

1. Tekan **Analyze** / **Analisis** di bottom bar.
2. Pilih **Instrumen** (mis. XAU/USD, EUR/USD, BTC/USD…).
3. Pilih **Timeframe** (1m, 5m, 15m, 1h, 4h, 1D, 1W).
4. **Upload screenshot chart** (atau ambil foto langsung dari kamera HP).
5. Tekan **Generate Analysis** / **Mulai Analisis**.
6. Tunggu beberapa detik — Rere akan membaca chart-mu dan menyusun rekomendasi.

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
| **Market Condition**          | Kondisi pasar: Bullish / Bearish / Sideways                                           |
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
analisis-nya dan tekan **Tambah Feedback**. Pilih:

- **Win** — sesuai prediksi
- **Loss** — meleset
- **Break Even** — tidak rugi tidak untung

Catatan opsionalnya bebas. Feedback ini dipakai untuk statistik personalmu.

---

## 6. Riwayat & Statistik Pribadi

### Riwayat (`/history`)

- Daftar semua analisismu, terbaru di atas.
- Filter: instrumen, timeframe, status (Valid / Expired), outcome
  (Win/Loss/BE).
- Klik salah satu kartu untuk melihat detail penuh + feedback.

### Statistik Pribadi (`/analytics`)

- **Win-rate** keseluruhan dan per-instrumen.
- **Distribusi confidence vs outcome** (apakah analisis high-confidence-mu
  beneran lebih sering menang?).
- **Tren mingguan**.
- **Instrumen favorit**.

> Semakin sering kamu mengisi feedback, semakin akurat statistikmu.

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

- Mengubah nama tampilan.
- Mengubah mode (Pemula ↔ Pro) — kapan pun, langsung berlaku.
- Mengubah tema (Light / Dark / System).
- Mengubah bahasa default (EN / ID).
- **Ganti Password** — minta password lama + dua kali password baru.
- **Ganti Pertanyaan Keamanan** — minta password sekarang + pertanyaan
  baru + jawaban baru.
- **Logout** dari semua sesi di perangkat ini.

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

Kamu bisa pindah mode kapan pun di halaman Profile. Mode hanya mempengaruhi
*tampilan* output baru — analisis lama tetap dengan format saat dibuat.

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

Akses panel Admin lewat avatar di header (jika role-mu `admin` atau
`super_admin`).

### Yang Bisa Dilakukan Admin

- **Statistik Sistem** — total user hari ini, total analisis hari ini /
  minggu ini / bulan ini, breakdown instrumen, breakdown mode.
- **Lihat Semua Analisis** — paginasi seluruh user.
- **Broadcast Notifikasi** — kirim pengumuman ke semua user atau role
  tertentu (juga otomatis dikirim sebagai Web Push ke yang mengaktifkan).

### Yang Hanya Super Admin

- **Manajemen User** — lihat semua user, buat user baru, reset password,
  ubah role, hapus user.
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
Bahasa mengikuti pilihan terakhir di profilmu. Cek **Profile → Language**.

**Q: Apakah analisis lama saya hilang setelah kadaluarsa?**
Tidak. Analisis tetap tersimpan di **Riwayat** seumur akunmu — hanya
labelnya berubah jadi *Expired*.

---

## 14. Aturan Main & Disclaimer

- **Bukan saran finansial.** Output Rere adalah opini AI berdasarkan data
  publik dan chart yang kamu unggah. Bukan rekomendasi resmi dari
  penasihat keuangan berlisensi.
- **Trading mengandung risiko.** Hanya gunakan dana yang siap kamu
  rugikan. Aplikasi ini *tidak* menjamin profit.
- **Privasi.** Screenshot chart hanya digunakan untuk menghasilkan
  analisismu sendiri dan tidak dibagikan ke pengguna lain.
- **Data partner.** Berita & kalender ekonomi disediakan oleh
  **Newsmaker.id**. Akurasi mengikuti sumber asli.

---

> Butuh bantuan tambahan? Hubungi admin lewat menu *Help* di Profile, atau
> kirim feedback langsung dari menu *Settings → Send Feedback*.
