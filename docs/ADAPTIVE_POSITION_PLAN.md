# Adaptive Position Plan — Dokumentasi Teknis

> Referensi teknis untuk fitur **Adaptive Position Plan** pada halaman Analysis
> Detail Trade Pilot. Dokumen ini menjelaskan perubahan yang sudah diterapkan,
> sumber data, aturan perhitungan, dan cara sistem menampilkan estimasi profit
> dalam USD.
>
> Terakhir diperbarui: 2 September 2026.

---

## 1. Ringkasan perubahan

Adaptive Position Plan adalah lapisan perhitungan di atas **Standard Plan** yang
dibuat oleh AI. Fitur ini tidak membuat entry, Stop Loss, atau Take Profit baru.
Fitur hanya mengubah level yang sudah tersimpan menjadi rencana ukuran posisi
yang dapat diaudit berdasarkan dana bebas, batas rugi, tier akun, dan konfirmasi
chart terbaru.

Perubahan yang terdokumentasi di sini mencakup:

1. **Profit TP dalam USD pada kartu ringkasan**
   - TP1 tetap menampilkan harga TP1.
   - TP2 tetap menampilkan harga TP2.
   - Di bawah masing-masing harga ditampilkan `Estimated profit` atau
     `Estimasi profit`, misalnya `+$296`.
   - Angka berasal dari `plan.profitToTakeProfit1` dan
     `plan.profitToTakeProfit2`; tidak ada rumus sizing baru di UI.

2. **Profit kumulatif pada setiap layer**
   - Rincian setiap layer menampilkan profit kumulatif jika seluruh posisi yang
     sudah direncanakan pada tahap itu mencapai TP1 atau TP2.
   - Labelnya secara eksplisit menggunakan kata **cumulative/kumulatif** agar
     tidak disalahartikan sebagai profit dari satu partial close saja.

3. **Nilai yang tidak tersedia tetap aman**
   - Jika target TP tidak dapat diparse atau tidak tersedia, field perhitungannya
     tetap `null`.
   - Kartu TP terkait tidak ditampilkan jika harga target tidak tersedia.
   - Sistem tidak mengarang profit, biaya, spread, slippage, atau nilai lain.

4. **Tier akun eksplisit**
   - Pengguna memilih Micro, Mini, atau Regular secara manual.
   - Tier tidak berpindah otomatis berdasarkan dana.
   - Kapasitas dana hanya menentukan apakah ukuran posisi atau penambahan layer
     dapat diterima.

5. **Rencana multi-layer yang tetap manual**
   - Entry awal berasal dari Standard Plan.
   - Maksimal dua penambahan manual, sehingga maksimal tiga posisi total.
   - Layer tambahan hanya berupa checkpoint yang harus dikonfirmasi pengguna;
     sistem tidak mengeksekusi order.

Implementasi utama:

| Area | File |
|---|---|
| Model, guardrail, sizing, dan kalkulasi profit | `artifacts/ai-trading/src/lib/adaptive-position-plan.ts` |
| Render kartu TP dan breakdown layer | `artifacts/ai-trading/src/components/adaptive-position-plan.tsx` |
| Label English | `artifacts/ai-trading/src/locales/en.ts` |
| Label Indonesia | `artifacts/ai-trading/src/locales/id.ts` |
| Test kalkulasi | `artifacts/ai-trading/src/lib/adaptive-position-plan.test.ts` |
| Test halaman Analysis Detail | `artifacts/ai-trading/src/pages/__tests__/analysis-detail.test.tsx` |

---

## 2. Batas fitur dan sumber data

### 2.1 Instrumen yang dapat memakai Adaptive

Adaptive hanya aktif untuk identitas canonical:

```text
XAU/USD
```

Pencocokan mengabaikan spasi dan besar-kecil huruf, tetapi tidak mengaktifkan
alias seperti `XAUUSD`, `GOLD`, `XUL10`, atau instrumen lain. Ini disengaja agar
aturan Adaptive tidak terpasang diam-diam pada instrumen yang level atau
contract size-nya berbeda.

Standard Trading Rules tetap menjadi sumber aturan resmi, antara lain:

- contract size;
- initial/day margin;
- minimum price movement;
- unit harga.

Jika aturan untuk instrumen tidak tersedia atau code-nya tidak cocok, rencana
ditolak secara aman.

### 2.2 Data yang masuk ke engine

`buildAdaptivePlanRecommendation()` menerima:

- `instrument`;
- `tradePlan` Buy dan Sell dari analisis AI tersimpan;
- `availableMargin` atau dana bebas trading;
- `maximumLoss` atau batas rugi keras dalam USD;
- `existingExposure`;
- Standard Trading Rule;
- konteks analisis;
- kandidat checkpoint dari candle chart;
- `accountTier`;
- `riskStyle`.

Konteks analisis yang digunakan:

- timeframe;
- market condition;
- risk level;
- trading bias;
- confidence min/max;
- jumlah indikator Buy, Sell, dan Neutral;
- snapshot berita dan economic calendar.

Fundamental context dianggap tersedia jika snapshot-nya ada, walaupun jumlah
berita atau event di dalamnya bisa nol. Sistem tidak menyimpulkan arah pasar dari
berita yang tidak tersedia.

### 2.3 Konfirmasi chart

Frontend mengambil candle melalui:

```text
/api/historical/candles?instrument=...&timeframe=...&purpose=adaptive-layering
```

Engine hanya memakai candle valid dengan `high >= low`, membatasi pemeriksaan ke
160 candle terakhir, lalu mencari swing:

- Buy: low candle menjadi kandidat jika merupakan low lokal di dalam jalur
  entry-ke-Stop Loss dan berada di atas Stop Loss serta di bawah entry.
- Sell: high candle menjadi kandidat jika merupakan high lokal di dalam jalur
  entry-ke-Stop Loss dan berada di bawah Stop Loss serta di atas entry.

Kandidat dideduplikasi, dipisahkan minimal berdasarkan jarak risiko, dibulatkan
ke minimum price movement, dan dibatasi maksimal enam kandidat per arah.
Kandidat chart tidak menggantikan level Standard Plan.

---

## 3. Alur keputusan rencana

### 3.1 Validasi input keras

Sebelum mencoba sizing, engine memastikan:

1. Instrumen adalah XAU/USD canonical.
2. Standard Trading Rule tersedia.
3. Minimal satu sisi Buy atau Sell tersedia.
4. Dana bebas lebih besar dari nol.
5. Batas rugi lebih besar dari nol dan tidak melebihi dana bebas.
6. Existing exposure tidak negatif.
7. Initial lot valid untuk tier akun.
8. Jumlah tambahan berada di antara 0 dan 2.
9. Entry dan Stop Loss setiap sisi lengkap serta geometrinya benar:
   - Buy: Stop Loss harus di bawah entry.
   - Sell: Stop Loss harus di atas entry.

Kegagalan pada validasi ini menghentikan perhitungan, bukan membuat angka
sintetis.

### 3.2 Kelengkapan konteks

Konteks dianggap lengkap jika timeframe, market condition, risk level, trading
bias, confidence 0–100, snapshot teknikal, dan fundamental context semuanya
tersedia.

Jika konteks tidak lengkap:

- posture menjadi `entry_only`;
- jumlah layer tambahan menjadi 0;
- preferred side menjadi `none`;
- sistem hanya mempertahankan kemungkinan entry awal yang bisa diaudit;
- reason code mencatat `context_unavailable`, serta alasan teknikal atau
  fundamental bila relevan.

Ini adalah perilaku **fail closed**: data yang hilang tidak boleh dipakai untuk
menjustifikasi penambahan posisi.

### 3.3 Penilaian konteks lengkap

Dengan konteks lengkap, engine memeriksa:

| Kondisi | Dampak |
|---|---|
| Timeframe 1m, 5m, atau 15m | Soft warning `short_timeframe` |
| Risk level `high` | Soft warning `high_risk` |
| Market condition `volatile` | Soft warning `volatile_market` |
| Confidence maksimum < 70 | Soft warning `low_confidence` |
| Ada event fundamental berdampak tinggi | Soft warning `fundamental_high_impact` |
| Technical Buy dan Sell hampir seimbang, selisih <20% | Soft warning `technical_mixed` |
| Market dan bias berlawanan | `directional_conflict` |
| Bias dan technical snapshot berlawanan | `directional_conflict` |

Soft warning menghapus layer tambahan dan menghasilkan rencana entry-only yang
lebih konservatif. Directional conflict lebih kuat: posture menjadi
`not_recommended`, preferred side menjadi `none`, dan hasil ditampilkan sebagai
diagnostik yang tidak direkomendasikan.

Jika konteks lengkap, tidak ada konflik arah, dan tidak ada soft warning,
engine dapat meminta maksimal dua tambahan. Kondisi `ranging` diberi alasan
`range_supports_scaling`, tetapi tetap tunduk pada seluruh batas margin, risiko,
dan tier.

Preferred side ditentukan secara berurutan dari:

1. bias tersimpan;
2. market condition;
3. perbandingan technical Buy vs Sell;
4. trade plan tersimpan untuk kasus bias netral.

Sisi yang lebih selaras dapat menerima layer tambahan. Sisi lawan tetap dapat
ditampilkan jika level Buy/Sell-nya valid, tetapi biasanya hanya entry awal.

---

## 4. Tier akun dan sizing

Standard Trading Rules yang dipakai engine adalah basis Mini. Tier mengubah
minimum lot, cap per posisi, margin basis, dan contract value secara eksplisit.

| Tier | Minimum lot | Maximum per posisi | Lot step | Margin minimum XAU/USD* | Contract size* | Minimum opening funds |
|---|---:|---:|---:|---:|---:|---:|
| Micro | 0,01 | 0,09 | 0,01 | 10% dari Mini | 10% dari Mini | $50 |
| Mini | 0,10 | 0,90 | 0,10 | basis | basis | — |
| Regular | 1,00 | 50,00 | 1,00 | 10× Mini | 10× Mini | — |

\* Nilai nominal mengikuti Standard Trading Rule instrumen. Untuk contoh
XAU/USD pada rule yang saat ini dipakai: Mini memiliki margin minimum `$100`
dan contract size `10 troy ounce/lot`; Micro menjadi `$10` dan `1`, sedangkan
Regular menjadi `$1.000` dan `100`.

`marginPerLot` dihitung dari:

```text
marginPerLot = marginAtMinimumLot / minimumLot
```

Pada rule XAU/USD tersebut nilainya `$1.000 per lot` di ketiga tier, tetapi
minimum lot dan contract size membuat nominal posisi tetap berbeda.

### 4.1 Kapasitas dana

Kapasitas teoritis per posisi:

```text
affordableLots = availableFunds / marginPerLot
capacity = floor_to_lot_step(
  min(affordableLots, maximumLot jika ada)
)
```

Jika hasil di bawah minimum lot, kapasitas dianggap nol. Ini hanya kapasitas
awal. Rencana final masih harus lulus:

- margin total;
- rugi kumulatif ke Stop Loss final;
- dana total yang dibutuhkan saat Stop Loss;
- cap tier di setiap posisi.

### 4.2 Profil ukuran layer

Gaya risiko dipetakan deterministik ke faktor lot tambahan:

| Gaya | Profil | Faktor posisi tambahan |
|---|---|---|
| Conservative | decreasing | 75%, lalu 50% dari initial lot |
| Balanced | mixed | 125%, lalu 75% dari initial lot |
| Aggressive | increasing | 125%, lalu 150% dari initial lot |

Faktor diterapkan per posisi, lalu dibatasi maksimum tier dan dibulatkan ke lot
step menggunakan pembulatan ke bawah. Posisi pertama selalu menggunakan
initial lot.

Gaya risiko tidak mengganti dana bebas atau membuat persentase risiko tersembunyi.
Batas `maximumLoss` yang dimasukkan pengguna tetap menjadi batas USD keras.

### 4.3 Mencari rencana yang layak

Engine mencoba kandidat secara berurutan:

1. jumlah layer tertinggi yang diizinkan konteks;
2. initial lot terbesar yang muat dalam kapasitas;
3. jika gagal, kurangi layer;
4. jika masih gagal, kurangi initial lot dengan lot step;
5. berhenti pada kandidat pertama yang lulus semua batas keras.

Jika kandidat yang diterima memiliki lebih sedikit layer daripada jumlah yang
semula diminta, kandidat lengkap tetap dihitung untuk menjelaskan layer yang
ditolak. UI menampilkan alasan penolakan:

- `day_margin`;
- `loss_ceiling`;
- `tier_limit`;
- `analysis_limit`.

Untuk penolakan finansial, sistem juga menampilkan dana tambahan atau loss
budget tambahan yang dibutuhkan. Angka ini adalah diagnostik, bukan instruksi
untuk menambah dana atau menaikkan risiko.

---

## 5. Perhitungan level, margin, risiko, dan profit

### 5.1 Normalisasi harga

Parser mengambil angka dari level AI dan membuang koma. Angka timeframe seperti
`H1`, `4H`, atau `15m` tidak dianggap sebagai angka harga.

Jika `entryZone` berisi dua angka:

```text
entry = (entryZoneLow + entryZoneHigh) / 2
```

Jika hanya satu angka, angka itu dipakai langsung. Entry, Stop Loss, dan TP
kemudian dibulatkan ke `minimumPriceMovement`.

### 5.2 Risiko ke Stop Loss

Untuk setiap posisi pada harga `P` dan lot `L`:

```text
Buy:
  riskToStopForLot = (P - StopLoss) × contractSize × L

Sell:
  riskToStopForLot = (StopLoss - P) × contractSize × L
```

Rumus hanya menghasilkan nilai positif untuk posisi yang geometrinya benar.
Rugi kumulatif:

```text
cumulativeRisk[n] = Σ riskToStopForLot dari posisi 1 sampai n
```

### 5.3 Margin dan dana saat Stop Loss

```text
dayMarginForLot = L × marginPerLot
cumulativeDayMargin[n] = Σ dayMarginForLot dari posisi 1 sampai n
cumulativeFundsAtStop[n] = cumulativeDayMargin[n] + cumulativeRisk[n]
remainingFundsAtStop[n] = availableFunds - cumulativeFundsAtStop[n]
```

Rencana ditolak jika margin total, cumulative risk, atau
`cumulativeFundsAtStop` melampaui batasnya.

Perhitungan ini hanya untuk **day trading**. Overnight fee, rollover, spread,
facility fee, VAT, slippage, broker auto-liquidation, dan order rejection
adalah risiko eksternal yang tidak dipakai untuk memindahkan level.

### 5.4 Profit per posisi ke TP

Profit dihitung terpisah dari risiko dan mengikuti arah posisi:

```text
Buy:
  profitToTakeProfit = (TakeProfit - P) × contractSize × L

Sell:
  profitToTakeProfit = (P - TakeProfit) × contractSize × L
```

Jika target tidak ada, hasilnya `null`. Jika target berada di sisi yang tidak
menghasilkan profit positif, hasilnya juga `null`; sistem tidak menampilkan
profit negatif sebagai profit yang dipaksakan.

### 5.5 Profit kumulatif seluruh rencana

Untuk setiap layer, engine menyimpan dua jenis nilai:

- `profitToTakeProfit1/2`: profit posisi pada layer tersebut menuju TP1/TP2;
- `cumulativeProfitToTakeProfit1/2`: jumlah profit seluruh layer sampai layer
  tersebut menuju TP1/TP2.

Nilai ringkasan pada `AdaptiveSidePositionPlan` diambil dari layer terakhir:

```text
plan.profitToTakeProfit1 = cumulative profit seluruh layer ke TP1
plan.profitToTakeProfit2 = cumulative profit seluruh layer ke TP2
```

Dengan demikian, angka pada kartu TP adalah skenario profit seluruh posisi yang
direncanakan jika semua posisi mencapai target tersebut. Angka itu bukan
simulasi partial close atau jaminan hasil transaksi.

Contoh sederhana satu posisi Buy:

```text
Entry         = 2.301
TP1           = 2.315
Contract size = 10
Lot           = 0,10

Profit TP1 = (2.315 - 2.301) × 10 × 0,10
           = $14
```

Pada multi-layer, setiap entry dihitung terhadap TP yang sama dan hasilnya
dijumlahkan. Untuk Sell, arah selisih dibalik sesuai rumus di atas.

### 5.6 Risk-reward

Pada rencana multi-layer, risk-reward dihitung dari nilai USD kumulatif:

```text
R:R to TP1 = cumulativeProfitToTP1 / cumulativeRiskToStop
R:R to TP2 = cumulativeProfitToTP2 / cumulativeRiskToStop
```

Jika profit atau cumulative risk tidak tersedia, R:R menjadi `null`.

### 5.7 Weighted average entry

Untuk memberi gambaran harga rata-rata posisi:

```text
weightedAverageEntry =
  Σ(entryPrice × lot) / Σ(lot)
```

Harga rata-rata hanya ringkasan matematis. Pengguna tetap harus mengikuti
checkpoint dan validasi chart sebelum menambah posisi.

---

## 6. Perilaku UI

### 6.1 Cara kerja form “Rekomendasi Ukuran Posisi”

Form pada screenshot adalah **form input dan review**, bukan panel eksekusi
order. Form mengumpulkan parameter yang dibutuhkan engine untuk menyusun
ukuran posisi manual.

#### A. Header dan detail metode

Judul card menjelaskan bahwa hasilnya adalah rekomendasi ukuran posisi. Subtitle
menegaskan bahwa rencana tetap manual dan berbasis analisis yang sudah ada serta
TP Standard Trading Rules.

Bagian **Detail, sumber, dan batas risiko** adalah panel penjelasan yang dapat
dibuka, bukan input tambahan. Panel ini menerangkan bahwa:

- Entry, Stop Loss, dan TP berasal dari Standard Plan tersimpan;
- contract size, margin, dan minimum price movement berasal dari TP Standard
  Trading Rules;
- candle chart terbaru hanya dipakai untuk mencari kandidat checkpoint;
- Adaptive tidak mengubah Standard Plan dan tidak mengirim order;
- perhitungan hanya day trade, tanpa overnight dan biaya menginap;
- jumlah kandidat Buy/Sell dan status pemuatan chart dapat diperiksa di sana.

#### B. Profil aturan akun tetap

Tiga tombol tier adalah pilihan manual:

| Tier | Default | Minimum lot | Margin minimum XAU/USD | Maksimum per posisi |
|---|---|---:|---:|---:|
| Micro | Tidak | 0,01 | $10 | 0,09 lot |
| Mini | Ya | 0,10 | $100 | 0,90 lot |
| Regular | Tidak | 1,00 | $1.000 | 50 lot |

Tier awal adalah **Mini**. Ketika tier diganti, rule sizing, contract size,
minimum lot, lot step, margin, dan preview kapasitas dihitung ulang. Hasil
rekomendasi lama dihapus karena tidak lagi memakai rule yang sama. Keterangan
minimum `$50` untuk Micro hanya informasi syarat pembukaan akun; angka itu tidak
mengubah free margin yang dimasukkan pengguna.

#### C. Dana bebas dan batas rugi

**Dana bebas yang tersedia untuk trading** adalah nominal USD yang benar-benar
tersedia untuk rencana. Nilai ini harus lebih besar dari nol dan dipakai langsung
untuk:

- kapasitas lot teoritis;
- margin day seluruh rencana;
- margin day ditambah rugi ke Stop Loss final;
- perhitungan dana tambahan jika layer ditolak.

**Batas rugi maksimum** adalah batas rugi keras dalam USD untuk seluruh rencana,
bukan batas per layer. Syarat dasarnya:

```text
availableMargin > 0
maximumLoss > 0
maximumLoss <= availableMargin
```

Engine menghitung rugi tiap layer dari Entry ke satu Stop Loss final lalu
menjumlahkannya. Ia tidak menaikkan batas rugi secara otomatis. Free margin
seharusnya sudah mengecualikan margin yang terkunci pada posisi lain.

`existingExposure` tetap diteruskan ke engine dan default-nya `0`, tetapi saat
ini tidak ditampilkan sebagai field terpisah pada card screenshot. Exposure tidak
dikurangkan dari cap per-posisi; margin yang sudah terkomitmen harus sudah
tercermin dalam dana bebas.

#### D. Gaya risiko

Gaya risiko menentukan pola faktor lot tambahan, bukan persentase risiko akun:

| Gaya | Faktor layer tambahan yang diminta |
|---|---|
| Konservatif | sekitar 75%, lalu 50% dari lot awal |
| Seimbang | sekitar 125%, lalu 75% dari lot awal |
| Agresif | sekitar 125%, lalu 150% dari lot awal |

Lot aktual tetap dibulatkan ke lot step tier, dibatasi cap per posisi, serta
harus lulus margin dan `maximumLoss`. Profil juga dapat diturunkan oleh konteks:
market ranging menjadi campuran, sedangkan pola meningkat hanya dipertahankan
jika trend dan teknikal selaras, risk level rendah, confidence minimum setidaknya
65, dan tidak ada event fundamental berdampak tinggi.

#### E. Kapasitas margin teoritis

Preview kapasitas muncul setelah Standard Trading Rules tersedia dan dana bebas
lebih dari nol:

```text
affordableLots = availableMargin / marginPerLot
capacity = floor_to_lot_step(
  min(affordableLots, tierMaximumLot)
)
```

Preview ini **belum** memperhitungkan jarak Entry–Stop Loss, batas rugi,
jumlah layer, atau konteks analisis. Karena itu kapasitas dapat lebih besar
daripada ukuran posisi final yang direkomendasikan.

#### F. Tombol aksi dan alur internal

Tombol **Buat rekomendasi** aktif setelah Standard Trading Rules dan kandidat
chart selesai dimuat. Saat ditekan, frontend meneruskan input form, Trade Plan
Buy/Sell, konteks analisis, Standard Rule, dan checkpoint chart ke
`buildAdaptivePlanRecommendation()`. Engine kemudian:

1. memvalidasi instrumen, rule, dana, batas rugi, exposure, dan Entry/SL;
2. menentukan posture dan preferred side dari konteks analisis;
3. meminta maksimal dua layer tambahan jika konteks mengizinkan;
4. mencoba lot awal terbesar yang masih muat;
5. mengurangi layer lalu lot jika margin atau risiko tidak lolos;
6. menghitung rencana Buy/Sell serta menandai layer yang ditolak;
7. menyimpan hasil valid untuk analisis tersebut di browser.

Jika input dana atau batas rugi masih kosong seperti pada screenshot, hasil
menjadi invalid. Sistem tidak membuat lot, profit, Entry, SL, atau TP sintetis.

Tombol **Mulai ulang** mengosongkan dana dan batas rugi, mengembalikan tier ke
Mini, mengembalikan gaya ke Konservatif, menghapus hasil, dan menghapus
rekomendasi tersimpan dari browser. Perubahan input juga menghapus hasil yang
sedang ditampilkan agar pengguna harus menghitung ulang.

### 6.2 Urutan interaksi

1. Halaman Analysis Detail merender Adaptive hanya untuk XAU/USD canonical.
2. Frontend mengambil Standard Trading Rules.
3. Frontend mengambil candle untuk kandidat checkpoint.
4. Pengguna memilih tier akun secara manual.
5. Pengguna memilih gaya risiko.
6. Pengguna memasukkan dana bebas dan batas rugi maksimum.
7. Pengguna menekan **Buat rekomendasi/Create recommendation**.
8. Sistem menghitung Buy dan Sell sesuai konteks tersimpan.
9. Jika hasil valid, pengguna meninjau satu arah pada satu waktu.
10. Pengguna tetap melakukan entry atau penambahan secara manual.

Perubahan input menghapus hasil rekomendasi lama agar angka tidak berasal dari
form yang sudah berubah. Rekomendasi yang disimpan di browser memakai fingerprint
yang mencakup trade plan, konteks fundamental, Standard Trading Rule, kandidat
chart, tier, dan gaya risiko. Jika salah satu berubah, hasil lama tidak dipakai.

### 6.3 Kartu ringkasan TP

Untuk setiap sisi yang aktif:

```text
TP1
2.315,00
Estimasi profit: +$...

TP2
2.325,00
Estimasi profit: +$...
```

Harga tetap diformat sesuai locale. Format nominal memakai USD dan tanda `+`
untuk menandai skenario profit positif.

Kartu hanya dibuat jika target TP tersedia. Jika `profitToTakeProfit` tidak
tersedia, renderer menggunakan `—`, bukan angka buatan.

### 6.4 Breakdown finansial layer

Setiap layer yang diterima atau ditolak dapat menampilkan:

- margin layer;
- margin kumulatif;
- risiko layer ke Stop Loss;
- risiko kumulatif;
- dana kumulatif saat Stop Loss;
- sisa dana;
- profit kumulatif ke TP1 jika TP1 tersedia;
- profit kumulatif ke TP2 jika TP2 tersedia.

Label profit memakai kata **kumulatif** agar jelas bahwa nilainya mencakup
semua layer sampai posisi tersebut. Layer yang ditolak tetap dapat ditampilkan
sebagai diagnostik, tetapi tidak menjadi rekomendasi yang diterima.

### 6.5 Buy dan Sell

Buy dan Sell memakai level dari sisi masing-masing pada Standard Plan. Tidak ada
proses yang membalik level Buy menjadi Sell secara otomatis. Direction selector
menampilkan satu panel pada satu waktu dan tidak menjalankan order.

### 6.6 Fallback aman

Pada konteks tidak lengkap, timeframe terlalu pendek, risiko tinggi, confidence
rendah, volatilitas, fundamental berdampak tinggi, atau konflik arah, sistem
mengurangi atau menghapus layer tambahan sesuai aturan keputusan. Ini tidak
mengubah harga Entry/SL/TP Standard Plan.

Jika tidak ada entry dan Stop Loss valid, sisi tersebut tidak tersedia. Jika
TP1/TP2 hilang, hanya target yang tersedia yang ditampilkan. Tidak ada synthetic
Entry, SL, TP, atau profit.

---

## 7. Test dan verifikasi

Coverage yang relevan untuk fitur ini:

- resolusi XAU/USD canonical dan pencegahan alias;
- aturan Micro, Mini, dan Regular;
- cap Regular 50 lot per posisi;
- scaling margin, contract size, risk, dan profit Regular terhadap Mini;
- kalkulasi Buy dan Sell;
- multi-layer dan rejected layer;
- konteks yang memaksa entry-only atau not-recommended;
- TP yang tidak tersedia tetap `null`;
- kartu UI menampilkan profit TP1/TP2 untuk Buy dan Sell;
- label breakdown profit kumulatif;
- verifikasi browser pada viewport mobile.

Perintah verifikasi:

```bash
pnpm --filter @workspace/ai-trading run test
pnpm run typecheck
```

Validasi terakhir untuk perubahan tampilan profit:

- AI Trading: 26 test files, 226 tests lulus saat dijalankan terisolasi.
- Typecheck seluruh workspace lulus.
- Browser flow memverifikasi `+$` pada TP1 dan TP2 untuk Buy dan Sell.

Test workspace penuh dapat menjalankan API, frontend, dan E2E secara paralel.
Jika worker Vitest atau database test bersama mengalami contention, ulangi suite
yang terdampak secara terisolasi sebelum menyimpulkan ada regresi fitur.

---

## 8. Kontrak data penting untuk pengembangan berikutnya

Field yang menjadi sumber tampilan profit dan tidak boleh dihitung ulang di
komponen React:

```ts
AdaptiveSidePositionPlan {
  takeProfit1: number | null;
  takeProfit2: number | null;
  profitToTakeProfit1: number | null;
  profitToTakeProfit2: number | null;
  ladder: AdaptiveLadderLevel[];
}

AdaptiveLadderLevel {
  profitToTakeProfit1: number | null;
  profitToTakeProfit2: number | null;
  cumulativeProfitToTakeProfit1: number | null;
  cumulativeProfitToTakeProfit2: number | null;
}
```

Aturan pemeliharaan:

1. Jangan membuat rumus profit kedua di UI.
2. Jangan menggunakan `maximumLoss` atau margin sebagai pengganti profit.
3. Jangan menganggap TP yang hilang sebagai nol.
4. Jika mengubah semantics kalkulasi, ubah test numerik dan fingerprint/cache
   bersama-sama.
5. Jika menambah biaya broker yang datanya benar-benar tersedia, dokumentasikan
   apakah biaya itu mengurangi profit dan apakah berlaku per posisi atau total
   siklus.
6. Pertahankan tier sebagai pilihan eksplisit pengguna.
