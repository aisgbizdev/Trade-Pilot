# Logic Form Rekomendasi Ukuran Posisi

Dokumen ini khusus membahas cara kerja card **Rekomendasi Ukuran Posisi**
seperti pada screenshot di halaman Analysis Detail. Fokusnya adalah alur form
dari saat card dibuka sampai rekomendasi dibuat, bukan penjelasan seluruh
komponen Adaptive Position Plan.

---

## 1. Fungsi form

Form ini adalah alat bantu untuk menyusun **rencana posisi manual** berdasarkan:

- Trade Plan Buy/Sell yang sudah dibuat AI;
- TP Standard Trading Rules;
- dana bebas trading yang dimasukkan pengguna;
- batas rugi maksimum dalam USD;
- tier akun yang dipilih;
- gaya risiko;
- konteks analisis dan kandidat swing dari chart terbaru.

Form tidak:

- mengubah Entry, Stop Loss, atau Take Profit pada Standard Plan;
- mengirim order ke broker;
- membuka atau menutup posisi;
- menaikkan batas risiko secara otomatis;
- membuat angka Entry, SL, TP, lot, atau profit sintetis ketika data tidak cukup.

Engine utama yang dipanggil saat perhitungan:

```text
buildAdaptivePlanRecommendation()
```

Komponen UI:

```text
artifacts/ai-trading/src/components/adaptive-position-plan.tsx
```

Engine:

```text
artifacts/ai-trading/src/lib/adaptive-position-plan.ts
```

---

## 2. State awal saat card dibuka

Card hanya dirender jika instrumen adalah canonical:

```text
XAU/USD
```

State form awal:

| Field | Nilai awal | Arti |
|---|---|---|
| Dana bebas | Kosong | Pengguna wajib memasukkan nominal USD |
| Batas rugi maksimum | Kosong | Pengguna wajib memasukkan nominal USD |
| Existing exposure | `0` | Default exposure XAU/USD yang sedang terbuka |
| Tier akun | `Mini` | Profile default |
| Gaya risiko | `Konservatif` | Profile lot default |

Karena dana bebas dan batas rugi awalnya kosong, tombol dapat terlihat tetapi
belum menghasilkan rekomendasi valid sebelum kedua nilai tersebut diisi.

`existingExposure` saat ini disimpan sebagai bagian dari state internal dan
diteruskan ke engine. Field tersebut belum ditampilkan sebagai input terpisah
pada card.

---

## 3. Data yang disiapkan sebelum kalkulasi

### 3.1 Standard Trading Rules

Frontend mengambil aturan dari:

```text
/api/trading-rules/standard
```

Untuk Adaptive XAU/USD, rule yang dicari harus cocok dengan code standar Gold:

```text
XUL10
```

Rule menyediakan:

- initial margin USD per lot;
- contract size;
- minimum price movement;
- contract unit.

Jika rule sedang loading, tombol perhitungan ditahan. Jika rule gagal dimuat
atau tidak cocok, tombol dinonaktifkan dan card menampilkan pesan error.

### 3.2 Kandidat checkpoint chart

Setelah rule dan timeframe tersedia, frontend mengambil candle:

```text
/api/historical/candles?instrument=XAU%2FUSD&timeframe=<timeframe>&purpose=adaptive-layering
```

Candle valid dipakai untuk mencari swing lokal yang mungkin menjadi checkpoint
layer. Candidate ini hanya membantu menentukan lokasi penambahan posisi; tidak
menggantikan Entry atau Stop Loss dari Standard Plan.

Selama proses ini status card adalah `loading`. Tombol **Buat rekomendasi**
dinonaktifkan sampai status berubah menjadi `ready`. Jika fetch gagal, hasil
chart menjadi unavailable dan engine tidak boleh menganggap chart memiliki
konfirmasi tambahan.

---

## 4. Logic pilihan tier akun

Tier dipilih manual menggunakan tiga tombol yang bekerja seperti pilihan tunggal.
Tier aktif ditandai dengan `aria-pressed=true`.

| Tier | Minimum lot | Lot step | Maksimum per posisi | Margin minimum XAU/USD | Contract size |
|---|---:|---:|---:|---:|---:|
| Micro | 0,01 | 0,01 | 0,09 | 10% dari Mini | 10% dari Mini |
| Mini | 0,10 | 0,10 | 0,90 | basis | basis |
| Regular | 1,00 | 1,00 | 50,00 | 10× Mini | 10× Mini |

Untuk rule XAU/USD yang digunakan saat ini:

```text
Mini    : margin minimum $100, contract size 10
Micro   : margin minimum $10,  contract size 1
Regular : margin minimum $1.000, contract size 100
```

`marginPerLot` berasal dari:

```text
marginPerLot = marginAtMinimumLot / minimumLot
```

Tier tidak berpindah otomatis saat dana berubah. Dana hanya menentukan apakah
posisi pada tier pilihan tersebut muat atau tidak.

Saat pengguna mengganti tier:

1. rule margin dan contract size dihitung ulang;
2. minimum lot dan lot step berubah sesuai tier;
3. kapasitas margin teoritis diperbarui;
4. hasil rekomendasi yang sedang tampil dihapus;
5. draft rekomendasi lama di browser dihapus agar tidak tercampur dengan tier
   baru.

Keterangan minimum opening funds `$50` untuk Micro hanya informasi syarat
pembukaan akun. Itu bukan potongan otomatis dari dana bebas dan bukan pengganti
input free margin.

---

## 5. Logic input dana dan batas rugi

### 5.1 Dana bebas

Input **Dana bebas yang tersedia untuk trading** dibaca sebagai angka USD:

```text
availableMargin = numberValue(form.availableMargin)
```

Syarat:

```text
availableMargin > 0
```

Nilai ini dipakai langsung untuk:

- kapasitas margin per posisi;
- margin day seluruh layer;
- dana yang diperlukan saat Stop Loss final;
- evaluasi apakah layer tambahan masih terjangkau.

Tidak ada pengurangan persentase tersembunyi berdasarkan gaya risiko.

### 5.2 Batas rugi maksimum

Input **Batas rugi maksimum** dibaca sebagai hard loss cap dalam USD:

```text
maximumLoss = numberValue(form.maximumLoss)
```

Syarat:

```text
maximumLoss > 0
maximumLoss <= availableMargin
```

Nilai ini berlaku untuk seluruh rencana, bukan untuk satu posisi saja. Engine
menghitung rugi setiap layer terhadap satu Stop Loss final lalu menjumlahkannya.
Jika hasil kumulatif melewati `maximumLoss`, kandidat tersebut tidak diterima.

Jika margin cukup tetapi loss cap terlalu kecil, hasil dapat berupa:

- hanya entry awal;
- layer tambahan ditolak;
- seluruh rencana invalid jika entry awal pun tidak memenuhi batas.

Engine tidak menaikkan `maximumLoss` untuk memaksa kandidat lolos.

### 5.3 Existing exposure

`existingExposure` default-nya `0` lot. Nilainya diteruskan sebagai informasi
konteks posisi terbuka, tetapi tidak dipakai untuk mengurangi cap maksimum setiap
posisi.

Konsekuensinya:

- cap tier berlaku per posisi;
- dana bebas yang dimasukkan pengguna harus sudah memperhitungkan margin yang
  terkunci di posisi lain;
- total lot seluruh rencana dapat lebih besar daripada cap satu posisi jika
  margin dan risiko masih memenuhi batas.

---

## 6. Logic gaya risiko

Pilihan gaya risiko menentukan faktor lot tambahan yang diminta engine:

| Gaya UI | Profil lot | Faktor layer 2 | Faktor layer 3 |
|---|---|---:|---:|
| Konservatif | Decreasing | 75% lot awal | 50% lot awal |
| Seimbang | Mixed | 125% lot awal | 75% lot awal |
| Agresif | Increasing | 125% lot awal | 150% lot awal |

Faktor bukan jaminan ukuran final. Setiap hasil tetap:

1. dibulatkan ke lot step tier;
2. dibatasi maksimum lot per posisi;
3. diuji terhadap margin;
4. diuji terhadap loss cap;
5. diuji terhadap dana saat Stop Loss.

### 6.1 Penurunan profil oleh konteks analisis

Engine dapat menurunkan profil yang diminta:

- Konservatif selalu memakai pola decreasing.
- Market ranging memakai pola mixed.
- Pola increasing hanya dipertahankan jika:
  - trend dan technical snapshot searah;
  - risk level rendah;
  - confidence minimum setidaknya 65%;
  - tidak ada event fundamental berdampak tinggi.
- Jika syarat konteks kuat tidak terpenuhi, engine kembali ke profil yang lebih
  konservatif.

Jadi memilih **Agresif** hanya meminta pola lot meningkat. Pilihan itu tidak
memberi izin untuk melewati guardrail analisis atau batas finansial.

---

## 7. Preview “Kapasitas margin teoritis”

Preview ini muncul jika rule sudah tersedia dan dana bebas lebih besar dari nol.
Perhitungannya:

```text
affordableLots = availableMargin / marginPerLot
cappedLots = min(affordableLots, maximumLot tier)
capacity = floor(cappedLots / lotStep) × lotStep
```

Jika hasil lebih kecil dari minimum lot, kapasitas ditampilkan sebagai belum
memenuhi margin minimum tier.

Preview ini belum menghitung:

- jarak Entry ke Stop Loss;
- rugi kumulatif;
- jumlah layer;
- checkpoint chart;
- konflik arah;
- short timeframe;
- volatility atau high-impact event.

Karena itu:

```text
kapasitas teoritis ≠ lot rekomendasi final
```

Angka ini hanya menjawab berapa lot yang secara margin dan cap per-posisi
kelihatannya muat sebelum validasi lengkap dijalankan.

---

## 8. Alur saat “Buat rekomendasi” ditekan

### 8.1 Input frontend

Frontend mengirim object berikut ke engine:

```text
{
  instrument,
  tradePlan,
  availableMargin,
  maximumLoss,
  existingExposure,
  standardRule,
  context,
  checkpointPrices,
  accountTier,
  riskStyle
}
```

### 8.2 Validasi awal

Engine menghentikan kalkulasi jika salah satu kondisi berikut gagal:

1. Instrumen bukan canonical XAU/USD.
2. Standard Trading Rule tidak tersedia.
3. Dana bebas kosong atau tidak positif.
4. Batas rugi kosong atau tidak positif.
5. Batas rugi lebih besar daripada dana bebas.
6. Existing exposure negatif atau tidak tersedia.
7. Entry/Stop Loss Buy atau Sell memiliki geometri tidak valid.
8. Contract size, margin, atau minimum movement tidak valid.

Pada tahap ini, engine mengembalikan `recommendation: null` jika parameter dasar
belum lengkap. UI menampilkan state invalid, bukan angka default.

### 8.3 Evaluasi konteks analisis

Untuk konteks yang lengkap, engine mengevaluasi:

- timeframe;
- market condition;
- risk level;
- trading bias;
- confidence;
- technical Buy/Sell/Neutral;
- berita dan event ekonomi.

Dampaknya:

| Kondisi | Hasil |
|---|---|
| Konteks tidak lengkap | `entry_only`, tanpa tambahan layer |
| Timeframe pendek | soft warning, tanpa tambahan layer |
| Risk tinggi | soft warning, tanpa tambahan layer |
| Market volatil | soft warning, tanpa tambahan layer |
| Confidence maksimum <70 | soft warning, tanpa tambahan layer |
| Event high impact | soft warning, tanpa tambahan layer |
| Bias dan teknikal berlawanan | `not_recommended`, preferred side `none` |
| Konteks selaras tanpa warning | scaling dapat dipertimbangkan |

Preferred side dipilih dari kombinasi trading bias, market condition, technical
snapshot, dan preferred side Standard Plan.

### 8.4 Pencarian kandidat lot dan jumlah layer

Jika scaling diizinkan, engine:

1. meminta maksimal dua tambahan sehingga total maksimal tiga posisi;
2. membuat daftar initial lot dari kapasitas terbesar ke minimum tier;
3. mencoba jumlah layer terbanyak lebih dulu;
4. memakai faktor lot sesuai profil risiko;
5. memvalidasi setiap kandidat terhadap margin dan loss cap;
6. jika gagal, mengurangi layer;
7. jika masih gagal, mengurangi initial lot;
8. menerima kandidat pertama yang lulus semua hard limit.

Urutan ini memastikan engine tidak langsung memilih lot minimum jika rencana
yang lebih besar sebenarnya masih aman, tetapi juga tidak memaksakan scaling.

### 8.5 Layer yang ditolak

Jika rencana yang diterima memiliki lebih sedikit layer daripada kandidat awal,
layer yang tidak diterima disimpan sebagai diagnostic:

| Reason | Arti |
|---|---|
| `day_margin` | Margin kumulatif melewati dana bebas |
| `loss_ceiling` | Rugi kumulatif melewati batas rugi |
| `tier_limit` | Lot layer melewati cap tier |
| `analysis_limit` | Jumlah layer melewati izin konteks/analisis |

Untuk penolakan margin atau loss, sistem dapat menghitung:

- `additionalFundsRequired`;
- `additionalLossBudgetRequired`.

Angka ini hanya menjelaskan mengapa layer gagal; bukan instruksi untuk menambah
dana atau menaikkan risiko.

---

## 9. State hasil di UI

### 9.1 Sebelum calculate

Form menampilkan input, tier, gaya risiko, disclaimer day trade, dan kapasitas
teoritis jika dana sudah diisi. Belum ada panel hasil Buy/Sell.

### 9.2 Input belum valid

Jika dana atau batas rugi kosong/tidak valid:

- hasil rekomendasi tidak dibuat;
- UI dapat menampilkan status invalid;
- tidak ada lot atau profit sintetis;
- pengguna harus memperbaiki input.

### 9.3 Rekomendasi valid

UI menampilkan:

- badge valid;
- pemilih arah Buy/Sell;
- ladder posisi manual;
- Entry, Stop Loss, TP1, TP2;
- lot per layer;
- margin dan risiko kumulatif;
- profit estimasi ke TP;
- alasan dan asumsi perhitungan.

Satu arah ditinjau pada satu waktu. Meninjau arah tidak mengeksekusi transaksi.

### 9.4 Entry-only

Entry awal dapat ditampilkan, tetapi tidak ada tambahan layer ketika konteks
belum cukup atau soft warning aktif. Pengguna perlu menunggu analisis baru atau
konfirmasi konteks sebelum mempertimbangkan penambahan.

### 9.5 Not recommended

Jika bias pasar dan snapshot teknikal bertentangan, hasil ditandai tidak
direkomendasikan. Diagnostic masih dapat ditampilkan untuk menjelaskan kondisi,
tetapi tidak boleh diperlakukan sebagai izin scaling.

---

## 10. Reset dan penyimpanan browser

### 10.1 Perubahan input

Setiap perubahan input:

- menghapus rekomendasi dari tampilan;
- mengharuskan pengguna menekan **Buat rekomendasi** lagi.

Perubahan tier juga langsung menghapus draft tersimpan karena rule sizing
berubah.

### 10.2 “Mulai ulang”

Tombol **Mulai ulang** mengembalikan:

```text
availableMargin  = kosong
maximumLoss      = kosong
existingExposure = 0
accountTier      = Mini
riskStyle        = Konservatif
recommendation   = null
activeSide       = Buy
```

Storage untuk analisis tersebut juga dihapus.

### 10.3 Restore

Draft disimpan di `localStorage` dengan key berbasis analysis ID. Hasil lama
hanya dipulihkan jika fingerprint analisis, Standard Rule, konteks, kandidat
chart, tier, dan gaya risiko masih cocok.

Perubahan fundamental, trade plan, rule, tier, atau gaya risiko membuat hasil
lama tidak dipakai. Tujuannya mencegah rekomendasi dari snapshot lama tampil
seolah-olah masih sesuai kondisi terbaru.

---

## 11. Contoh state seperti screenshot

Saat card pertama kali dibuka:

```text
Tier              = Mini
Gaya risiko       = Konservatif
Dana bebas        = kosong
Batas rugi        = kosong
Existing exposure = 0
```

Jika pengguna menekan **Buat rekomendasi** tanpa mengisi dua nominal:

```text
availableMargin <= 0  → invalid
maximumLoss <= 0      → invalid
recommendation       → null
```

Jika pengguna kemudian mengisi:

```text
Dana bebas      = $1.000
Batas rugi      = $100
Tier            = Mini
Gaya risiko     = Konservatif
```

engine baru boleh mencoba:

1. initial lot yang muat pada margin Mini;
2. jumlah layer yang diizinkan konteks;
3. faktor lot menurun 75% lalu 50%;
4. validasi rugi kumulatif tidak lebih dari `$100`;
5. validasi total margin dan dana saat Stop Loss.

Hasil final tetap dapat lebih kecil atau entry-only jika jarak Entry–SL,
konteks, atau checkpoint tidak mendukung.

---

## 12. Batasan yang harus dipertahankan

Saat mengubah form atau engine, pertahankan aturan berikut:

1. Tier selalu dipilih eksplisit oleh pengguna.
2. Dana bebas dan batas rugi dibaca sebagai nominal USD langsung.
3. Gaya risiko tidak boleh mengalahkan margin, loss cap, atau tier limit.
4. Preview kapasitas tidak boleh disebut sebagai rekomendasi final.
5. Konteks yang tidak lengkap harus fail closed.
6. Level Standard Plan tidak boleh diganti oleh Adaptive.
7. Layer tambahan tetap manual dan tidak menjadi auto-trading.
8. Nilai yang tidak tersedia harus `null` atau disembunyikan, bukan dibuat-buat.
9. Overnight, rollover, dan biaya menginap tidak boleh diam-diam dimasukkan ke
   perhitungan day trade.
