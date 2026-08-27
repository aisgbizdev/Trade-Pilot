# 03 — Analyze (Buat Analisa Baru)

Halaman Analyze adalah inti dari Trade Pilot — di sini kamu meminta AI menganalisa instrumen pilihanmu dan menghasilkan insight teknikal + fundamental beserta level trading yang konkret.

---

## 3.1 Cara Masuk ke Halaman Analyze

- Tap ikon **"+"** atau **"Analyze"** di navigation bar bawah
- Atau dari Dashboard, tap tombol **"Analisa Baru"**

---

## 3.2 Pilih Instrumen

### Tab Kategori

Di bagian atas halaman ada 3 tab kategori instrumen:

| Tab | Instrumen yang Tersedia |
|-----|------------------------|
| **Futures** | XAU/USD (Emas), BRENT (Minyak Brent), XAG/USD (Perak), HSI (Hang Seng), NIKKEI, DJIA (Dow Jones), NASDAQ, DXY (US Dollar Index) |
| **Forex** | AUD/USD, EUR/USD, GBP/USD, USD/CHF, USD/JPY, USD/IDR |
| **Crypto** | BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD |

> 💡 Kalau kamu mencari saham lokal Indonesia (IDX), instrumen tersedia di tab **Futures** dalam kategori indeks, atau kontak admin untuk penambahan saham spesifik.

### Cara Pilih Instrumen
1. Tap tab kategori (Futures / Forex / Crypto)
2. Tap nama instrumen yang ingin dianalisa
3. Instrumen terpilih akan highlight dan live price-nya langsung muncul

---

## 3.3 Harga Live & Status Sesi

Setelah memilih instrumen, bagian atas menampilkan:

- **Harga Live:** Harga pasar terkini (diperbarui setiap ~15 detik)
- **Spread:** Selisih bid-ask (kalau tersedia)
- **Market Sessions Badge:** Sesi trading apa yang sedang aktif untuk instrumen ini

Harga live ini digunakan AI sebagai anchor utama saat membuat analisa, sehingga level entry/SL/TP yang dihasilkan selalu relevan dengan kondisi harga saat itu.

---

## 3.4 Tombol Watchlist ⭐

Di sebelah nama instrumen ada ikon **bintang (⭐)**.
- Bintang kosong = belum di watchlist
- Tap untuk menambahkan ke Watchlist di Dashboard
- Bintang terisi (kuning) = sudah di watchlist; tap lagi untuk hapus

---

## 3.5 Mini Chart TradingView

Di bawah harga live tersedia mini chart interaktif dari TradingView yang menampilkan pergerakan harga instrumen.

### Pilih Range Chart

| Range | Artinya |
|-------|---------|
| **1D** | Harga dalam 1 hari terakhir |
| **1W** | Harga dalam 1 minggu terakhir |
| **1M** | Harga dalam 1 bulan terakhir |
| **3M** | Harga dalam 3 bulan terakhir |
| **1Y** | Harga dalam 1 tahun terakhir |

Chart berguna untuk melihat tren besar sebelum memilih timeframe analisa.

---

## 3.6 Pilih Timeframe

Timeframe menentukan seberapa lama perspektif analisa yang dibuat AI.

| Timeframe | Cocok Untuk |
|-----------|------------|
| **1m / 5m** | Scalping — trading dalam hitungan menit |
| **15m / 30m** | Day trading pendek |
| **1h** | Day trading / swing harian |
| **4h** | Swing trading 1–3 hari |
| **1D** | Swing trading beberapa hari hingga minggu |
| **1W** | Position trading jangka panjang |

> ⚠️ Pilih timeframe yang sesuai dengan gaya trading kamu. Analisa 1h tidak cocok dijadikan dasar trade yang kamu hold berminggu-minggu.

---

## 3.7 Economic Calendar (Relevan dengan Instrumen)

Di bawah chart ada panel **Economic Calendar** yang sudah difilter hanya untuk event yang relevan dengan instrumen dan mata uang yang terlibat.

Misalnya: kalau kamu pilih EUR/USD, calendar akan menampilkan event USD dan EUR saja.

### Cara Baca Calendar

Setiap event menampilkan:
- **Nama event** (misal: Non-Farm Payroll, CPI, FOMC)
- **Dampak:** ★★★ (tinggi), ★★ (sedang), ★ (rendah)
- **Waktu:** Jam event
- **Bendera negara:** Mata uang yang terdampak

Tap nama event untuk melihat **penjelasan** singkat tentang apa artinya dan kenapa trader harus perhatikan event tersebut.

> ⚠️ Kalau ada event ★★★ dalam 2–4 jam ke depan, pertimbangkan untuk tunggu dulu hasil event sebelum entry.

---

## 3.8 Local Sentiment Widget

Menampilkan **sentimen komunitas trader** untuk instrumen yang dipilih — berapa persen trader memilih Buy vs Sell secara agregat.

- Bukan sinyal trading langsung
- Berguna sebagai konteks: kalau sentimen terlalu satu arah, market sering berlawanan arah (contrarian signal)

---

## 3.9 Mental Checklist 🧠

**Apa itu Mental Checklist?**
Sebuah checklist 4 poin psikologi trading yang muncul di atas tombol analisa untuk mengingatkan kamu bahwa kamu siap trading dengan pikiran jernih — bukan karena emosi.

### 4 Poin Checklist

| # | Poin | Tujuan |
|---|------|--------|
| 1 | Gw tau persis berapa loss kalau trade ini gagal | Pastikan risk sudah diperhitungkan |
| 2 | Gw punya entry, stop-loss, dan target — tertulis, bukan di kepala doang | Pastikan ada rencana |
| 3 | Gw nggak ngejar pergerakan yang sudah jalan (bukan FOMO) | Cegah FOMO |
| 4 | Gw nggak trade buat balas dendam loss sebelumnya | Cegah revenge trading |

### Cara Menggunakan
- Tap setiap poin untuk centang ✅
- Kalau semua centang → kartu berubah hijau = kamu siap
- Kalau belum semua dicentang → ada hint pengingat di bawah
- Checklist **tidak memblok** kamu buat analisa — tapi sangat dianjurkan

### Cara Aktifkan / Nonaktifkan
Pergi ke **Profil** → toggle **Mental Checklist** ON/OFF.

---

## 3.10 Anti-Pattern Guardrails ⚠️

**Apa itu Anti-Pattern Guardrails?**
Sistem deteksi otomatis yang memperingatkan kamu kalau Trade Pilot mendeteksi pola trading berbahaya berdasarkan riwayat aktivitasmu.

### Jenis Warning yang Bisa Muncul

| Warning | Artinya |
|---------|---------|
| **Revenge Trading** 🔄 | Kamu baru saja loss dan langsung mau masuk lagi — kemungkinan besar emosi |
| **Overtrading** 🛡️ | Kamu sudah terlalu banyak buat analisa/trade dalam waktu singkat |
| **High Risk Window** ⚠️ | Ada event ekonomi besar yang bisa bikin market bergerak ekstrem |
| **Unusual Hour** 🌙 | Kamu trading di jam yang tidak biasa (malam hari, dll) |

### Cooling-Off Period

Kalau guardrail aktif, ada pilihan untuk mengaktifkan **Cooling-Off** — timer jeda yang membuatmu berhenti sejenak dan melakukan latihan pernapasan sebelum lanjut.

Latihan pernapasan:
1. Tarik napas 4 detik
2. Tahan 4 detik
3. Buang napas 4 detik
4. Ulangi sampai timer habis

Kamu tetap bisa lanjut analisa setelah cooling-off selesai.

> 💡 Guardrails bisa dinonaktifkan per jenis di **Profil → Notifikasi → Guardrail Settings**.

---

## 3.11 Kolom Catatan (Opsional)

Sebelum submit analisa, ada kolom **catatan** opsional. Kamu bisa menulis:
- Alasan kenapa kamu pilih instrumen ini
- Setup yang kamu lihat sebelum analisa
- Ekspektasi kamu

Catatan ini disimpan bersama analisa dan bisa dilihat lagi di halaman History/Detail.

---

## 3.12 Tombol Set Alert 🔔

Tap tombol **"Set Alert"** untuk membuat price alert untuk instrumen yang dipilih sebelum atau setelah analisa dibuat.

Lihat panduan lengkap di [12 — Alerts →](./12-alerts.md).

---

## 3.13 Kuota Analisa

Setiap akun mendapatkan **kuota analisa harian** yang terbatas. Sisa kuota ditampilkan di dekat tombol submit.

| Jenis | Detail |
|-------|--------|
| Kuota harian | Reset setiap hari pada tengah malam |
| Kuota per jam | Proteksi agar tidak ada penyalahgunaan |
| Tampilan | "Tersisa X analisa hari ini" |

> ⚠️ Kalau kuota habis, tombol submit akan disabled. Tunggu sampai kuota reset keesokan harinya.

---

## 3.14 Submit Analisa

Setelah semua siap:

1. Pastikan instrumen dan timeframe sudah sesuai
2. (Opsional) Isi Mental Checklist
3. (Opsional) Tambahkan catatan
4. Tap tombol **"Analisa Sekarang"** / **"Analyze"**
5. Tunggu proses analisa (biasanya 10–30 detik)
6. Kamu otomatis diarahkan ke halaman **Analysis Detail**

> 💡 Proses analisa menggunakan AI yang menggabungkan data teknikal (indikator), fundamental (berita & calendar), dan harga live saat itu. Hasilnya unik setiap kali meski instrumen sama — karena kondisi market selalu berubah.
