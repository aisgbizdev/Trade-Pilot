# 02 — Dashboard

Dashboard adalah halaman utama Trade Pilot — pusat informasi market, analisa terbaru, dan akses ke semua fitur.

---

## 2.1 Ringkasan Halaman

Setelah login kamu langsung masuk ke Dashboard. Halaman ini terbagi menjadi beberapa bagian:

1. Live Prices Ticker
2. Kartu Ringkasan (total analisa, akurasi AI)
3. Watchlist
4. Analisa Terbaru
5. Berita Pasar
6. Economic Calendar
7. Kartu USD/IDR
8. Enable Push Notification

---

## 2.2 Live Prices Ticker

**Fungsi:** Menampilkan harga instrumen secara real-time di bagian atas halaman.

Instrumen yang ditampilkan di ticker:
- Gold (XAU/USD), Brent Oil, Bitcoin, Ethereum
- Hang Seng, Nikkei
- AUD/USD (Aussie), EUR/USD (Euro), GBP/USD (Pound), USD/CHF (Swissy), USD/JPY (Yen)

Cara baca:
- Harga hijau dengan ▲ → harga naik dari sebelumnya
- Harga merah dengan ▼ → harga turun
- Angka persentase → perubahan dari harga pembukaan hari ini

> 💡 Data live diperbarui setiap 15 detik. Kalau koneksi lambat, ticker akan menampilkan data terakhir yang berhasil diambil.

---

## 2.3 Kartu USD/IDR

**Fungsi:** Menampilkan kurs Dolar Amerika terhadap Rupiah secara live.

Sangat berguna untuk trader saham lokal Indonesia dan siapa saja yang perlu pantau nilai tukar rupiah saat trading.

---

## 2.4 Market Sessions Badge

**Fungsi:** Menampilkan sesi trading mana yang sedang aktif saat ini.

| Sesi | Jam Aktif (WIB) | Instrumen Aktif |
|------|----------------|-----------------|
| 🇯🇵 Tokyo | 06:00 – 15:00 | JPY pairs, indeks Asia |
| 🇬🇧 London | 14:00 – 23:00 | EUR, GBP, emas, minyak |
| 🇺🇸 New York | 19:30 – 04:00 | USD pairs, S&P, indeks US |

Badge warna hijau = sesi sedang buka. Abu-abu = sesi tutup.

> 💡 Volatilitas dan likuiditas tertinggi biasanya saat sesi London + New York tumpang tindih (sekitar 19:30–23:00 WIB).

---

## 2.5 Watchlist

**Fungsi:** Menyimpan instrumen favorit kamu supaya mudah diakses.

### Cara tambah instrumen ke watchlist
1. Masuk ke halaman **Analyze**
2. Pilih instrumen yang ingin kamu simpan
3. Tap ikon ⭐ (bintang) di sebelah nama instrumen
4. Instrumen langsung masuk ke Watchlist di Dashboard

### Cara hapus dari watchlist
- Tap ikon ⭐ lagi (bintang sudah terisi) → otomatis dihapus

Dari Dashboard, kamu bisa langsung tap instrumen di Watchlist untuk langsung masuk ke halaman Analyze dengan instrumen tersebut terpilih.

---

## 2.6 Kartu Ringkasan Analisa

**Fungsi:** Menampilkan statistik keseluruhan penggunaan Trade Pilot kamu.

### Informasi yang ditampilkan:

| Kartu | Artinya |
|-------|---------|
| **Total Analisa** | Berapa kali kamu sudah buat analisa |
| **Akurasi AI** | Persentase analisa yang hasilnya sesuai outcome yang kamu catat |
| **Win / Loss** | Jumlah analisa yang kamu tandai menang vs. kalah |

> ⚠️ Akurasi hanya terhitung kalau kamu rajin mengisi **outcome** di setiap analisa. Kalau belum pernah diisi, akurasi akan menampilkan tanda "—".

---

## 2.7 Analisa Terbaru

**Fungsi:** Menampilkan daftar pendek analisa yang paling baru kamu buat.

Setiap item menampilkan:
- Nama instrumen (misal: XAU/USD)
- Timeframe (misal: 1h, 4h)
- Waktu dibuat
- Outcome badge (win / loss / belum ditandai)

Tap salah satu item untuk langsung masuk ke halaman **Analysis Detail**.

---

## 2.8 Mode Selector (Pemula / Pro)

Di bagian atas Dashboard ada info mode yang sedang aktif: **"Kamu di mode Pemula"** atau **"Kamu di mode Pro"**.

Tap kartu tersebut untuk ganti mode. Perubahan langsung berlaku dan memengaruhi tampilan hasil analisa.

---

## 2.9 Banner Live Analisa

Kalau Trade Pilot sedang menjalankan sesi live analisa (misalnya jam tertentu setiap hari), akan muncul banner berwarna di atas Dashboard.

- Tap banner untuk join atau lihat info lebih lanjut
- Tap ✕ di pojok kanan untuk dismiss banner (tidak muncul lagi sampai browser di-refresh)

---

## 2.10 News Widget

**Fungsi:** Menampilkan berita pasar terkini yang relevan dengan instrumen-instrumen yang ada di Trade Pilot.

Cara baca:
- Setiap item menampilkan judul berita, sumber, dan waktu tayang
- Tap judul berita untuk membuka artikel di browser

Berita diperbarui secara berkala oleh sistem.

---

## 2.11 Economic Calendar Widget

**Fungsi:** Menampilkan event ekonomi penting yang akan datang dan bisa mempengaruhi pergerakan market.

| Ikon Dampak | Artinya |
|------------|---------|
| ★★★ (merah) | Dampak tinggi — bisa bikin volatilitas besar |
| ★★ (kuning) | Dampak sedang |
| ★ (abu) | Dampak rendah |

> 💡 Selalu cek kalender ekonomi sebelum buat analisa atau masuk trade, terutama kalau ada event ★★★ dalam beberapa jam ke depan.

---

## 2.12 Enable Push Notification Card

Kalau kamu belum mengaktifkan push notification, akan muncul kartu ajakan di Dashboard.

Tap **"Aktifkan Notifikasi"** → browser akan meminta izin → klik **"Allow"**.

Setelah aktif, kamu bisa terima notifikasi untuk:
- Price alert terpicu
- Ringkasan harian market
- Pengingat sesi trading

Lihat pengaturan detail notifikasi di [Halaman Notifikasi →](./13-notifications.md).
