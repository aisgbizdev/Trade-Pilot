# 08 — Performance (Performa AI)

Halaman Performance menampilkan seberapa akurat rekomendasi AI Trade Pilot selama periode waktu tertentu — bukan hanya performa kamu, tapi kualitas analisa yang dihasilkan sistem secara keseluruhan.

---

## 8.1 Cara Masuk

Tap **"Performance"** dari menu atau navigation. Halaman ini bisa juga diakses dari link di halaman Dashboard (kartu "Akurasi AI").

---

## 8.2 Window Waktu: 30 vs 90 Hari

Di bagian atas ada toggle untuk memilih periode evaluasi:

| Window | Kapan Digunakan |
|--------|----------------|
| **30 Hari** | Performa jangka pendek — cocok untuk lihat tren terkini |
| **90 Hari** | Performa jangka panjang — lebih representatif dan stabil |

> 💡 Performa 30 hari bisa berfluktuasi drastis karena sampelnya lebih kecil. Gunakan 90 hari untuk gambaran yang lebih jujur.

---

## 8.3 Hit Bar 📊

**Apa itu:** Visualisasi horizontal yang menampilkan proporsi Win, Loss, dan Expired dari total analisa dalam periode yang dipilih.

### Cara Membaca

```
[████████████░░░░░░░░░░░░░░░░]
   Win%      Loss%   Expired%
```

| Warna | Kategori | Artinya |
|-------|---------|---------|
| 🟢 Hijau | **Win** | Analisa yang outcomenya tercatat sebagai profit |
| 🔴 Merah | **Loss** | Analisa yang outcomenya tercatat sebagai rugi |
| ⬜ Abu | **Expired** | Analisa yang tidak pernah diberi outcome (kadaluarsa) |

> ⚠️ Makin banyak "Expired", makin kurang akurat data performa — artinya banyak analisa yang tidak kamu follow up. Biasakan selalu mengisi outcome.

---

## 8.4 Performance Segments

Di bawah Hit Bar ada breakdown lebih detail per **segmen** — biasanya per instrumen atau kategori aset.

Setiap segmen menampilkan:

| Info | Keterangan |
|------|-----------|
| **Nama segmen** | Instrumen atau kategori (misal: Gold, Forex, Crypto) |
| **Total analisa** | Berapa analisa dalam segmen ini |
| **Win rate** | Persentase analisa yang Win |
| **Hit bar mini** | Visualisasi Win/Loss/Expired segmen ini |
| **Win / Loss / Expired count** | Angka absolut per kategori |

Tap setiap segmen untuk lihat analisa-analisa spesifik dalam segmen tersebut — mengarah ke halaman History yang sudah difilter.

---

## 8.5 Performance Banner

Di atas halaman ada banner informasi yang memberikan tips atau konteks tentang cara membaca data performa.

Contoh isi banner:
- "Performa terbaik kamu ada di Gold — pertahankan!"
- "Win rate kamu naik 12pp dibanding bulan lalu"
- "Expired tinggi — coba biasakan isi outcome setiap analisa"

---

## 8.6 Perbedaan Analytics vs Performance

| Aspek | Analytics (Hal. 07) | Performance (Hal. 08) |
|-------|--------------------|-----------------------|
| **Fokus** | Performa **kamu** sebagai trader | Kualitas **analisa AI** secara keseluruhan |
| **Filter** | Weekly / Monthly / All Time | 30 hari / 90 hari |
| **Visualisasi** | Accuracy Gauge + Bar chart per aset | Hit Bar + Segments |
| **Berguna untuk** | Self-review trading personal | Evaluasi kepercayaan ke sistem AI |

---

## 8.7 Cara Menginterpretasi Data Performa

### Win Rate yang Baik

Tidak ada angka "sempurna" — tapi panduan umum:

| Win Rate | Interpretasi |
|----------|-------------|
| **>65%** | Sangat baik — AI sangat konsisten untuk instrumen/kondisi ini |
| **50–65%** | Normal — masih profitable kalau R:R bagus |
| **40–50%** | Perlu evaluasi — cek apakah instrumentnya kurang coverage |
| **<40%** | Signifikan — bisa jadi periode market yang choppy atau instrumen kurang cocok |

### Expired Tinggi

Kalau segmen Expired mendominasi, artinya banyak analisa yang dibuat tapi tidak ditindaklanjuti. Ini bisa berarti:
- Kamu terlalu banyak buat analisa tanpa eksekusi (analisa jadi "warm-up" saja)
- Kamu lupa mengisi outcome setelah trading
- Setup yang direkomendasikan AI memang sering tidak terpenuhi kondisinya

**Solusi:** Setelah setiap trade (entah entry atau skip), langsung set outcome di Analysis Detail.
