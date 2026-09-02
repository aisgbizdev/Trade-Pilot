# 04 — Analysis Detail (Membaca Hasil Analisa)

Halaman ini menampilkan hasil analisa AI secara lengkap — dari sinyal arah market hingga level entry, stop-loss, dan take profit yang konkret.

---

## 4.1 Cara Masuk ke Halaman Ini

- Setelah submit analisa baru → otomatis diarahkan ke sini
- Dari **History** → tap salah satu analisa
- Dari **Dashboard** → tap analisa di bagian "Analisa Terbaru"

---

## 4.2 Header Analisa

Di bagian paling atas terlihat:
- **Nama instrumen** (misal: XAU/USD)
- **Timeframe** yang dianalisa (misal: 4h)
- **Waktu dibuat** (misal: "2 jam yang lalu")
- **Tombol kembali** (←) ke halaman sebelumnya

---

## 4.3 Signal Speedometer (Bias Gauge) 📊

**Apa itu:** Gauge setengah lingkaran yang menampilkan kekuatan sinyal pasar secara visual — seberapa bullish atau bearish kondisi market saat analisa dibuat.

### Cara Membaca

| Nilai | Arti |
|-------|------|
| **0–35** | Bearish kuat — sinyal cenderung turun |
| **36–45** | Bearish ringan |
| **46–54** | Netral — tidak ada arah yang jelas |
| **55–64** | Bullish ringan |
| **65–100** | Bullish kuat — sinyal cenderung naik |

Warna gauge:
- 🔴 Merah = bearish
- 🟡 Kuning = netral
- 🟢 Hijau = bullish

> 💡 Speedometer adalah **ringkasan** dari semua indikator yang dianalisa. Semakin ekstrem nilainya (mendekati 0 atau 100), semakin kuat sinyal tersebut.

---

## 4.4 Market Context Summary

**Apa itu:** Ringkasan singkat satu paragraf tentang kondisi market instrumen ini saat analisa dibuat — ditulis oleh AI dalam bahasa yang mudah dipahami.

Biasanya mencakup:
- Tren yang sedang terjadi
- Support/resistance kunci yang relevan
- Konteks fundamental singkat

---

## 4.5 TradingView Chart

Chart interaktif TradingView untuk instrumen yang dianalisa — ditampilkan dengan simbol dan timeframe yang sama dengan analisa.

### Fitur Chart
- **Scroll & zoom** untuk melihat detail harga
- **Tombol Full Screen** di pojok kanan atas chart → membuka chart dalam modal layar penuh
- **Simbol & interval** otomatis terisi sesuai instrumen dan timeframe analisa

> 💡 Gunakan chart untuk konfirmasi visual sebelum memutuskan entry berdasarkan level yang direkomendasikan AI.

---

## 4.6 Technical Indicators Panel 📈

Panel indikator teknikal yang menampilkan nilai-nilai indikator pada timeframe yang dianalisa.

### Indikator yang Ditampilkan

| Indikator | Fungsi |
|-----------|--------|
| **RSI** (Relative Strength Index) | Mengukur kekuatan momentum; >70 = overbought, <30 = oversold |
| **MACD** | Tren dan persilangan sinyal buy/sell |
| **Bollinger Bands** | Volatilitas dan posisi harga relatif terhadap range |
| **EMA / MA** | Moving average sebagai support/resistance dinamis |
| **Stochastic** | Momentum oscillator untuk konfirmasi entry |

Kamu bisa ganti timeframe panel indikator secara terpisah dari timeframe analisa untuk melihat konteks multi-timeframe.

---

## 4.7 Suggested Levels — Trade Plan Card 🎯

Ini adalah bagian **paling penting** dari hasil analisa. Trade Plan Card berisi rekomendasi level trading konkret dari AI.

### 4.7.1 Preferred Side

AI merekomendasikan satu dari tiga posisi:

| Preferred Side | Artinya |
|---------------|---------|
| **Buy** | AI melihat peluang untuk posisi beli (long) |
| **Sell** | AI melihat peluang untuk posisi jual (short) |
| **Wait** | Kondisi market tidak jelas atau berisiko tinggi — tunggu dulu |

Kenapa "Wait"?
- Tidak ada sinyal yang cukup kuat
- Event besar akan datang dalam waktu dekat
- Market sedang choppy (tidak tren)

### 4.7.2 Level Buy Side

| Field | Penjelasan |
|-------|-----------|
| **Entry Zone** | Range harga untuk masuk posisi Buy. Bisa satu angka atau range (misal: 2315 – 2325) |
| **Stop Loss** | Level harga di mana posisi Buy harus ditutup jika analisa salah (selalu di bawah entry untuk Buy) |
| **Take Profit 1** | Target profit pertama — biasanya level terdekat |
| **Take Profit 2** | Target profit kedua — level lebih jauh |
| **Take Profit 3** | Target profit ketiga — target paling optimistis |
| **Risk:Reward** | Perbandingan risiko vs potensi profit. Misal: 1:2.0 = risiko 1, untung 2 |
| **Reasoning** | Penjelasan AI kenapa merekomendasikan level-level ini |

### 4.7.3 Level Sell Side

Sama seperti Buy Side, tapi dibalik:
- Entry Zone untuk posisi Sell
- Stop Loss selalu **di atas** entry untuk Sell
- Take Profit 1/2/3 di bawah entry

### 4.7.4 Estimasi Profit Dollar per TP

Pada bagian **Adaptive Position Plan**, kartu TP sekarang menampilkan dua hal:

- harga target TP1 atau TP2; dan
- **Estimasi profit** dalam USD untuk seluruh posisi yang direkomendasikan
  jika target tersebut tercapai.

Contoh satu posisi Buy:

```text
Entry  = 2.301
TP1    = 2.315
Lot    = 0,10
Contract size = 10

Estimasi profit TP1
= (2.315 - 2.301) × 10 × 0,10
= $14
```

Untuk posisi **Sell**, perhitungannya dibalik:

```text
Estimasi profit
= (Entry - TP) × contract size × lot
```

Jika ada beberapa layer, sistem menghitung profit dari setiap harga entry lalu
menjumlahkannya. Jadi angka pada kartu adalah **profit kumulatif seluruh
rencana**, bukan profit dari satu layer atau jaminan hasil transaksi.

Di rincian setiap layer, label **Profit kumulatif ke TP1/TP2** menunjukkan jumlah
profit dari seluruh layer sampai tahap tersebut. Nilai ini mengikuti:

- arah Buy/Sell;
- lot yang benar-benar direkomendasikan;
- contract size tier akun Micro/Mini/Regular; dan
- jarak setiap entry ke target TP.

Jika TP tidak tersedia atau tidak bisa dihitung, sistem tidak membuat angka
perkiraan. Target yang tersedia saja yang ditampilkan.

> ⚠️ Estimasi profit adalah skenario matematika berdasarkan level analisis yang
> tersimpan. Spread, slippage, biaya broker, overnight fee, dan order yang
> ditolak dapat membuat hasil aktual berbeda. Adaptive Plan tidak mengeksekusi
> transaksi otomatis.

### 4.7.5 Cara Membaca Risk:Reward

```
R:R = 1:2.0
→ Untuk setiap 1 unit risiko (jarak entry ke SL),
  potensi keuntungan adalah 2 unit (jarak entry ke TP1)
```

| R:R | Kualitas Setup |
|-----|---------------|
| 1:1.0 | Minimum — hanya worth kalau win rate >50% |
| 1:1.5 | Cukup |
| 1:2.0 | Bagus — standar yang direkomendasikan |
| 1:3.0+ | Sangat bagus |

> ⚠️ R:R dihitung otomatis oleh sistem dari entry/SL/TP1. Kalau muncul **"n/a"** artinya level yang diberikan AI tidak parseable (biasanya karena preferred side = Wait dan tidak ada angka konkret).

### 4.7.6 Reasoning (Penjelasan AI)

Klik/tap bagian Reasoning untuk membaca penjelasan lengkap AI tentang:
- Mengapa memilih level entry di area tersebut
- Support/resistance yang dijadikan acuan
- Kondisi indikator yang mendukung arah tersebut

---

## 4.8 Fundamental Context 📰

Bagian ini menampilkan **berita dan event ekonomi** yang relevan dengan instrumen dan memengaruhi kondisi fundamentalnya.

### 4.8.1 Berita Relevan

Setiap item berita menampilkan:
- Judul berita
- Sumber & waktu tayang
- Ikon sumber
- Tap judul → buka artikel di browser

### 4.8.2 Calendar Events

Event ekonomi yang relevan (sama seperti di halaman Analyze, tapi difilter untuk instrumen ini dan dicantumkan dalam konteks analisa).

---

## 4.9 Fundamental Drift ⚡

**Apa itu:** Indikator yang mendeteksi apakah ada **perubahan besar pada kondisi fundamental** sejak analisa pertama kali dibuat.

Contoh situasi yang memicu Fundamental Drift:
- Berita besar keluar setelah analisa dibuat (misal: Fed mengumumkan kenaikan suku bunga)
- Data ekonomi penting dirilis dan hasilnya berbeda dari ekspektasi

Kalau ada drift, sistem menampilkan peringatan bahwa analisa mungkin sudah tidak sepenuhnya relevan.

### Tombol Refresh Fundamentals

Tap **"Refresh Fundamentals"** untuk memperbarui konteks fundamental analisa tanpa membuat analisa baru. Berguna kalau kamu mau cek apakah ada berita baru yang masuk setelah analisa pertama dibuat.

---

## 4.10 Alert Toggle 🔔

Di area Trade Plan Card ada toggle **ON/OFF** untuk mengaktifkan price alert dari level-level analisa ini.

- **ON** → Sistem akan memberitahu kamu ketika harga mendekati level entry, SL, atau TP yang direkomendasikan
- **OFF** → Tidak ada notifikasi untuk analisa ini

> 💡 Kamu perlu mengaktifkan push notification di browser agar alert terkirim ke HP. Lihat [13 — Notifications →](./13-notifications.md).

---

## 4.11 Catatan Analisa 📝

Di bawah Trade Plan ada area **catatan** untuk menyimpan pikiran atau observasi tambahan terkait analisa ini.

- Ketik catatan kamu di kolom yang tersedia
- Tap **"Simpan"** untuk menyimpan
- Catatan bisa diedit kapan saja

---

## 4.12 Feedback 👍 👎

**Apa itu:** Cara kamu memberikan penilaian atas kualitas analisa yang dihasilkan AI.

- 👍 Thumbs Up = Analisa berguna, arah dan level masuk akal
- 👎 Thumbs Down = Analisa kurang tepat atau tidak sesuai harapan

Feedback kamu membantu meningkatkan kualitas AI Trade Pilot ke depannya.

---

## 4.13 Outcome Badge ✅

**Apa itu:** Label yang kamu sendiri yang tentukan untuk menandai apakah analisa ini "menang" atau tidak.

### Pilihan Outcome

| Outcome | Kapan Digunakan |
|---------|----------------|
| **Win** | Kamu entry sesuai analisa dan meraih profit |
| **Loss** | Kamu entry dan kena stop-loss |
| **Breakeven** | Kamu entry dan keluar di titik impas (tidak untung tidak rugi) |
| **Skipped** | Kamu memutuskan untuk tidak entry meski sudah analisa |
| **Belum ditandai** | Analisa baru dibuat, belum ada tindak lanjut |

### Cara Set Outcome
1. Tap area Outcome Badge di halaman detail
2. Pilih outcome yang sesuai
3. Tersimpan otomatis

> ⚠️ Mengisi outcome dengan jujur sangat penting karena memengaruhi statistik akurasi AI di halaman Analytics. Kalau tidak diisi, akurasi tidak terhitung.

---

## 4.14 Log Trade 📓

Tombol **"Log Trade"** membuka dialog untuk mencatat trade yang kamu lakukan berdasarkan analisa ini langsung ke **Jurnal Trading**.

Form akan otomatis terisi dengan instrumen dan arah (Buy/Sell) dari analisa yang sedang dibuka.

Lihat panduan lengkap di [06 — Journal →](./06-journal.md).
