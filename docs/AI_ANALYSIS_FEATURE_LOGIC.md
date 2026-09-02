# Logic Fitur Analisis AI

Dokumen ini menjelaskan cara kerja fitur **Analisis AI** Trade Pilot dari ujung
ke ujung: input pengguna, pengambilan data pasar, perhitungan indikator,
penyusunan prompt, validasi output AI, perhitungan ulang Risk:Reward,
penyimpanan database, sampai hasil dibuka di halaman Analysis Detail.

Dokumen ini khusus membahas fitur analisis utama. Logic Adaptive Position Plan
dibahas terpisah dalam:

```text
docs/ADAPTIVE_POSITION_PLAN.md
docs/ADAPTIVE_POSITION_FORM_LOGIC.md
```

---

## 1. Tujuan dan batas fitur

Fitur analisis menggabungkan:

1. instrumen dan timeframe yang dipilih pengguna;
2. candle OHLC dan indikator teknikal;
3. harga live sebagai anchor;
4. berita relevan;
5. kalender ekonomi;
6. catatan tambahan pengguna pada mode Pro;
7. model AI dengan schema output yang ketat;
8. validasi dan normalisasi setelah AI selesai.

Hasil akhirnya adalah **peta skenario**, bukan order otomatis. Sistem membuat:

- kondisi pasar;
- tingkat risiko;
- confidence range;
- trading bias;
- opportunity dan risk;
- narasi sesuai mode Beginner atau Pro;
- Trade Plan dua sisi: Buy dan Sell;
- provenance berita dan kalender yang benar-benar dipakai AI.

Sistem tidak:

- mengeksekusi Buy/Sell;
- mengirim order ke broker;
- menjamin confidence sebagai probabilitas kemenangan;
- menghitung confidence dari satu rumus matematis;
- mengarang harga ketika anchor harga benar-benar tidak tersedia;
- menerima citation berita atau event yang tidak ada pada snapshot input.

---

## 2. File utama

| Area | File |
|---|---|
| Form dan submit halaman Analyze | `artifacts/ai-trading/src/pages/analyze.tsx` |
| Endpoint create/list/detail analysis | `artifacts/api-server/src/routes/analyses.ts` |
| Prompt, schema, retry, fallback, level hygiene | `artifacts/api-server/src/lib/openai.ts` |
| Pengambilan candle dan cache indikator | `artifacts/api-server/src/lib/historical.ts` |
| Rumus indikator | `artifacts/api-server/src/lib/indicators.ts` |
| Berita Newsmaker.id dan Yahoo Finance | `artifacts/api-server/src/lib/news.ts` |
| Adapter Yahoo Finance RSS | `artifacts/api-server/src/lib/news-yahoo.ts` |
| Kalender ekonomi | `artifacts/api-server/src/lib/calendar.ts` |
| Harga live | `artifacts/api-server/src/lib/live-prices.ts` |
| Schema database | `lib/db/src/schema/index.ts` |
| Kontrak API | `lib/api-spec/openapi.yaml` |
| Render hasil tersimpan | `artifacts/ai-trading/src/pages/analysis-detail.tsx` |

---

## 3. Gambaran alur end-to-end

```text
Pengguna membuka Analyze
        │
        ├─ memilih mode Beginner/Pro
        ├─ memilih instrumen
        ├─ memilih timeframe
        └─ menulis catatan tambahan jika mode Pro
        │
        ▼
Frontend memvalidasi input dan guardrail perilaku
        │
        ▼
POST /analyses
        │
        ├─ validasi request dan autentikasi
        ├─ cek lock request dan quota
        ├─ ambil harga live
        ├─ ambil candle + hitung indikator
        ├─ ambil berita
        ├─ ambil kalender ekonomi
        └─ bentuk snapshot analisis
        │
        ▼
generateAnalysis()
        │
        ├─ pilih model
        ├─ susun system prompt + user context
        ├─ panggil AI dalam JSON mode
        ├─ validasi schema
        ├─ retry koreksi jika diperlukan
        ├─ validasi citation
        ├─ sanitasi level Buy/Sell
        └─ hitung ulang Risk:Reward
        │
        ▼
Simpan analysis + token usage ke PostgreSQL
        │
        ├─ buat notifikasi selesai
        ├─ auto-arm price alert jika push aktif
        ├─ periksa signal flip
        └─ reset dormancy streak
        │
        ▼
HTTP 201 + analysis ID
        │
        ▼
Frontend membuka /analyses/{id}
```

Halaman detail membaca analysis yang sudah disimpan. Membuka halaman detail
tidak memanggil AI lagi.

---

## 4. Input pada halaman Analyze

### 4.1 Mode

Pilihan mode:

```text
beginner
pro
```

Mode awal berasal dari `user.selectedMode`. Jika pengguna mengganti mode:

1. UI langsung berubah secara optimistis;
2. pilihan disimpan ke profile pengguna;
3. jika penyimpanan gagal, UI dikembalikan ke nilai sebelumnya.

Perbedaan utamanya:

| Bagian | Beginner | Pro |
|---|---|---|
| Bahasa | Sederhana dan edukatif | Lebih teknis dan mendalam |
| Catatan tambahan | Tidak dikirim | Dapat dikirim |
| Scenario | Main + alternative | Base + bullish + bearish |
| Technical/fundamental drivers | Digabung dalam narasi | Field khusus |
| Confidence maksimum schema | 75 | 80 |

### 4.2 Instrumen

Instrumen dapat dipilih dari kategori:

- Futures;
- Forex;
- Crypto.

Daftar utama frontend:

```text
Futures:
XAU/USD, BRENT, XAG/USD, HSI, NIKKEI, DJIA, NASDAQ, DXY

Forex:
AUD/USD, EUR/USD, GBP/USD, USD/CHF, USD/JPY, USD/IDR

Crypto:
BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD
```

Pengguna juga dapat mengetik instrumen custom. Jika input custom terisi, nilainya
menggantikan instrumen dari tombol:

```text
finalInstrument = customInstrument.trim() || selectedInstrument
```

Frontend hanya memastikan instrumen tidak kosong. Coverage data upstream tetap
bergantung pada mapping yang tersedia di backend.

### 4.3 Timeframe

Timeframe yang diterima:

```text
1m, 5m, 15m, 30m, 1h, 4h, 1D, 1W
```

Default frontend:

```text
1D
```

Timeframe memengaruhi:

- sumber dan rentang candle;
- period moving average;
- masa berlaku analysis;
- detail prompt;
- model dan timeout untuk 1m/5m;
- apakah news/calendar diambil;
- fallback aman untuk mode cepat.

### 4.4 Catatan Pro

`userInputContext` hanya dikirim jika:

```text
selectedMode === "pro"
```

Sebelum dimasukkan ke prompt, backend memeriksa kata yang mengarah ke nama
broker, platform, atau pialang. Jika ditemukan, seluruh catatan diganti dengan
pesan bahwa aplikasi independen dan tidak membahas broker.

Catatan adalah konteks tambahan, bukan instruksi yang boleh mengalahkan system
prompt, schema, sumber data, atau guardrail.

### 4.5 Calendar preview dan warning sebelum submit

Halaman Analyze dapat menampilkan event kalender yang relevan untuk instrumen.
Event berdampak tinggi yang dekat dengan waktu rilis memunculkan pre-trade
warning.

Guardrail perilaku bersifat soft:

- telemetry mencatat jika pengguna tetap melanjutkan;
- cooling-off aktif membuka breathing dialog;
- analysis hanya berjalan setelah pengguna menekan **Continue anyway**;
- guardrail tidak mengubah rumus indikator atau output AI secara langsung.

---

## 5. Request API

Frontend memanggil:

```http
POST /analyses
Content-Type: application/json
```

Payload:

```json
{
  "instrument": "XAU/USD",
  "timeframe": "1D",
  "mode": "beginner",
  "userInputContext": "opsional, hanya Pro"
}
```

Field wajib:

- `instrument`;
- `timeframe`;
- `mode`.

Backend menolak:

- field wajib kosong: HTTP `400`;
- mode selain `beginner`/`pro`: HTTP `400`;
- pengguna belum login: HTTP `401`;
- request bersamaan untuk user yang sama: HTTP `429`;
- quota habis: HTTP `429`;
- layanan AI gagal: HTTP `502`.

---

## 6. Quota dan proteksi request bersamaan

### 6.1 Role privileged

Role berikut tidak dibatasi quota:

```text
admin
super_admin
```

Analisis tetap menghasilkan catatan token usage dan cost estimate.

### 6.2 User biasa

User biasa memakai quota efektif:

```text
customQuotaPerHour ?? globalPerHour
customQuotaPerDay  ?? globalPerDay
```

Default project saat ini didokumentasikan sebagai:

```text
5 analysis per jam
20 analysis per 24 jam
```

Nilai sebenarnya dapat berubah melalui konfigurasi atau custom quota user.

### 6.3 Advisory lock

Backend membuka transaction lalu mencoba PostgreSQL advisory lock per user:

```text
pg_try_advisory_xact_lock(namespace, userId)
```

Tujuannya agar dua request bersamaan tidak sama-sama melihat quota lama lalu
lolos bersamaan.

Jika lock tidak didapat:

```text
HTTP 429
Retry-After: 5
scope: concurrent
```

### 6.4 Perhitungan quota

Jumlah penggunaan dihitung langsung di PostgreSQL:

```text
hourly = count(createdAt >= now() - interval '1 hour')
daily  = count(createdAt >= now() - interval '24 hours')
```

Waktu dihitung server-side untuk menghindari perbedaan timezone antara
Node.js, PostgreSQL, dan kolom timestamp.

Jika quota jam habis:

```text
HTTP 429
Retry-After: 3600
```

Jika quota harian habis:

```text
HTTP 429
Retry-After: 86400
```

AI dipanggil dan row analysis disimpan di dalam transaction user biasa. Jika AI
gagal, transaction tidak menyimpan analysis, sehingga kegagalan tidak menjadi
analysis sukses yang memakan slot tersimpan.

---

## 7. Pengumpulan data sebelum AI dipanggil

Backend menjalankan beberapa pekerjaan secara paralel menggunakan
`Promise.allSettled()`:

1. harga live;
2. technical indicators;
3. berita relevan;
4. kalender ekonomi.

Fetch bersifat best-effort. Kegagalan satu sumber tidak otomatis membatalkan
seluruh analysis.

### 7.1 Harga live

Harga live diambil melalui:

```text
getLivePriceFor(instrument)
```

Lookup pada route dibatasi sekitar:

```text
1.500 ms
```

Jika timeout atau instrumen tidak memiliki coverage:

```text
livePrice = null
```

Jika tersedia, harga live menjadi anchor utama untuk Entry, SL, dan TP pada
prompt AI.

### 7.2 Technical indicators

`getIndicators(instrument, timeframe)` mengambil candle dan menghitung indikator.
Hasilnya diformat menjadi blok:

```text
=== DATA TEKNIKAL ===
Harga terakhir
Perubahan 1/5/20 candle
Ringkasan oscillator
Ringkasan moving average
RSI
MACD
Stochastic
Bollinger Bands
Moving averages
```

Selain dikirim ke AI, tally berikut disimpan terpisah:

```text
techBuyCount
techSellCount
techNeutralCount
```

Tujuannya agar halaman detail dapat menampilkan snapshot teknikal yang sama tanpa
menghitung ulang data terbaru.

### 7.3 Berita dan kalender pada 1m/5m

Untuk timeframe:

```text
1m
5m
```

route tidak mengambil news dan calendar untuk proses analisis utama. Mode cepat
difokuskan pada struktur mikro dan fallback aman.

Snapshot fundamental tetap disimpan sebagai:

```json
{
  "newsItems": [],
  "calendarEvents": []
}
```

Nilainya bukan `null`, sehingga halaman detail dapat menampilkan empty state
secara jujur.

---

## 8. Sumber candle

### 8.1 Intraday

Timeframe intraday:

```text
1m, 5m, 15m, 30m, 1h, 4h
```

Sumber utama adalah Yahoo Finance Chart API. Mapping contoh:

| Instrument | Yahoo symbol |
|---|---|
| XAU/USD | `GC=F` |
| XAG/USD | `SI=F` |
| BRENT | `BZ=F` |
| EUR/USD | `EURUSD=X` |
| GBP/USD | `GBPUSD=X` |
| USD/JPY | `JPY=X` |
| USD/IDR | `IDR=X` |
| HSI | `^HSI` |
| NIKKEI | `NIY=F` |
| DJIA | `YM=F` |
| NASDAQ | `NQ=F` |
| DXY | `DX-Y.NYB` |

Crypto menggunakan symbol Yahoo per pasangan, misalnya format `BTC-USD`.

Parameter candle:

| Timeframe app | Interval Yahoo | Range |
|---|---|---|
| 1m | 1m | 7d |
| 5m | 5m | 60d |
| 15m | 15m | 60d |
| 30m | 30m | 60d |
| 1h | 60m | 730d |
| 4h | 60m | 730d, lalu resample |

Yahoo tidak memiliki interval 4h native. Sistem mengelompokkan candle 1h ke
bucket UTC:

```text
00–04, 04–08, 08–12, 12–16, 16–20, 20–24
```

Untuk setiap bucket:

```text
open  = open candle pertama
high  = high tertinggi
low   = low terendah
close = close candle terakhir
```

Yahoo fetch memiliki timeout 10 detik. Error network, timeout, HTTP 429, atau
5xx dapat dicoba ulang satu kali setelah backoff sekitar 500 ms ditambah jitter.

### 8.2 Daily dan weekly

Forex, komoditas, dan index yang didukung mengambil data daily dari historical
API eksternal selama sekitar 365 hari.

Crypto daily/weekly mengambil Yahoo Finance secara langsung.

Timeframe `1W` dibentuk dari candle daily per ISO week Senin–Minggu:

```text
open  = open hari pertama
high  = high tertinggi minggu tersebut
low   = low terendah minggu tersebut
close = close hari terakhir
date  = tanggal candle terakhir
```

Beberapa instrumen hanya memiliki coverage intraday. Jika mapping daily tidak
ada, indicator context dapat menjadi tidak tersedia.

---

## 9. Cache dan stale fallback indikator

TTL indikator:

| Timeframe | TTL normal |
|---|---:|
| 1m | 30 detik |
| 5m | 60 detik |
| 15m | 3 menit |
| 30m | 4 menit |
| 1h | 5 menit |
| 4h | 15 menit |
| 1D | 10 menit |
| 1W | 10 menit |

Raw daily feed memiliki cache bersama selama satu jam.

Jika upstream gagal, sistem dapat memakai indicator cache lama selama usianya
tidak lebih dari:

```text
6 × TTL normal timeframe
```

Jika lebih lama, hasil dianggap terlalu stale dan `null` dikembalikan.

---

## 10. Penyelarasan candle dengan harga live

Masalah yang diselesaikan:

- candle Yahoo XAU/USD memakai futures `GC=F`;
- ticker aplikasi dapat memakai harga spot/rule lain;
- keduanya dapat memiliki basis spread.

Sistem menghitung:

```text
offset = livePrice - lastCandleClose
```

Lalu menggeser semua candle:

```text
open'  = open  + offset
high'  = high  + offset
low'   = low   + offset
close' = close + offset
```

Karena seluruh bar digeser dengan konstanta yang sama:

- perubahan relatif tetap;
- bentuk candle tetap;
- signal teknikal tetap;
- moving average dan Bollinger bergeser ke price space live.

Guardrail:

```text
abs(offset) / lastClose <= 5%
```

Jika offset lebih besar dari 5%, live value dianggap mencurigakan dan candle
Yahoo dipertahankan tanpa shift.

---

## 11. Perhitungan indikator teknikal

Semua indikator dihitung deterministik di backend. AI hanya membaca hasilnya.

### 11.1 Perubahan harga

Untuk candle terakhir `C[n]`:

```text
change1  = C[n] - C[n-1]
change5  = C[n] - C[n-5]
change20 = C[n] - C[n-20]

changePct = change / C[pembanding] × 100
```

Angka `1`, `5`, dan `20` berarti jumlah candle sesuai timeframe, bukan selalu
hari kalender.

### 11.2 Simple Moving Average

```text
SMA(period) =
  jumlah close pada N candle terakhir / period
```

Signal:

```text
lastClose > SMA → Buy
selain itu       → Sell
```

### 11.3 Exponential Moving Average

Seed:

```text
EMA awal = SMA dari N close pertama
```

Multiplier:

```text
k = 2 / (period + 1)
```

Update:

```text
EMA sekarang =
  close sekarang × k + EMA sebelumnya × (1 - k)
```

Signal:

```text
lastClose > EMA → Buy
selain itu       → Sell
```

### 11.4 Period moving average

Intraday:

```text
SMA: 10, 20, 50, 100
EMA: 9, 21, 50
```

Daily/weekly:

```text
SMA: 5, 10, 20, 50, 100, 200
EMA: 10, 20, 50
```

### 11.5 RSI(14)

Untuk setiap perubahan close:

```text
gain = max(change, 0)
loss = abs(min(change, 0))
```

Initial average:

```text
avgGain = jumlah gain 14 period / 14
avgLoss = jumlah loss 14 period / 14
```

Wilder-style smoothing:

```text
avgGainBaru =
  (avgGainLama × 13 + gainSekarang) / 14

avgLossBaru =
  (avgLossLama × 13 + lossSekarang) / 14
```

RS dan RSI:

```text
RS  = avgGain / avgLoss
RSI = 100 - 100 / (1 + RS)
```

Jika data kurang dari 15 candle, RSI fallback ke `50`. Jika average loss nol,
RSI menjadi `100`.

Mapping signal:

| Nilai RSI | Signal |
|---:|---|
| <30 | Buy |
| 30–<45 | Buy |
| 45–55 | Neutral |
| >55–70 | Sell |
| >70 | Sell |

### 11.6 MACD(12,26,9)

```text
MACD line   = EMA12 - EMA26
Signal line = EMA9 dari MACD line
Histogram   = MACD line - Signal line
```

Mapping:

```text
MACD > signal dan histogram > 0 → Buy
MACD < signal dan histogram < 0 → Sell
selain itu                       → Neutral
```

### 11.7 Stochastic(14,3,3)

Raw `%K`:

```text
%K =
  (close - lowestLow14) /
  (highestHigh14 - lowestLow14) × 100
```

`%K` kemudian dihaluskan dengan SMA 3. `%D` adalah SMA 3 dari `%K` yang sudah
dihaluskan.

Jika range high-low nol, `%K` memakai `50`. Jika data kurang dari 14 candle,
hasil fallback:

```text
K = 50
D = 50
signal = Neutral
```

Mapping:

| Kondisi | Signal |
|---|---|
| K dan D <20 | Buy |
| K dan D >80 | Sell |
| K <40 | Buy |
| K >60 | Sell |
| Selain itu | Neutral |

### 11.8 Bollinger Bands(20,2)

```text
middle = SMA20
upper  = SMA20 + 2 × standardDeviation20
lower  = SMA20 - 2 × standardDeviation20
```

Standard deviation menggunakan population divisor:

```text
stdDev = sqrt(
  jumlah((close - mean)²) / jumlahData
)
```

Posisi harga dalam band:

```text
position = (lastClose - lower) / (upper - lower)
```

Mapping:

```text
position < 0,2 → Buy
position > 0,8 → Sell
selain itu     → Neutral
```

### 11.9 Ringkasan signal

Oscillator summary menghitung:

```text
RSI + MACD + Stochastic + Bollinger
```

MA summary menghitung semua SMA dan EMA yang tersedia.

Total:

```text
totalBuy     = oscillatorBuy + maBuy
totalSell    = oscillatorSell + maSell
totalNeutral = oscillatorNeutral + maNeutral
```

Overall signal:

```text
totalBuy > totalSell × 1,5 → Buy
totalSell > totalBuy × 1,5 → Sell
selain itu                 → Neutral
```

Tally ini bukan confidence. Tally menjadi salah satu input yang dibaca AI.

---

## 12. Logic berita

### 12.1 Sumber

Aggregator mengambil secara paralel:

- Newsmaker.id;
- Yahoo Finance RSS per instrumen.

Jika satu sumber gagal, sumber lain masih dapat dipakai. Jika keduanya gagal,
hasil menjadi array kosong dan analysis tetap dapat berjalan.

### 12.2 Deduplikasi

Berita dihapus sebagai duplikat berdasarkan:

1. URL yang sama;
2. judul yang sama setelah dinormalisasi.

### 12.3 Relevance score

```text
score =
  jumlah keyword instrumen yang ditemukan pada title + summary
```

Yahoo mendapat baseline `+1` karena feed-nya sudah symbol-scoped.

Item dengan `score > 0` masuk kandidat awal. Jika kandidat kurang dari dua,
sistem menambahkan macro fallback berdasarkan pola berita makro. Crypto memakai
macro vocabulary yang berbeda dari forex/komoditas.

### 12.4 Recency

Berita lebih tua dari tujuh hari dibuang.

Tier:

```text
fresh = usia <= 3 hari
older = usia >3 hari dan <=7 hari
```

Ranking:

- fresh: terbaru lebih dulu;
- older: score tertinggi, lalu terbaru.

Default maksimal berita untuk satu analysis:

```text
5 item
```

### 12.5 Catatan perilaku sumber saat ini

Jalur `getRelevantNews()` yang dipakai analysis memilih top result berdasarkan
relevance/recency. Helper `selectNewsmakerFirst()` yang membatasi Yahoo maksimal
satu item dipakai pada global ticker, bukan pada jalur analysis ini.

Artinya, snapshot analysis saat ini tidak memiliki hard guarantee bahwa Yahoo
selalu maksimal satu item. Dokumentasi ini mengikuti perilaku kode aktual.

### 12.6 Sanitasi sebelum prompt

Semua title, source, dan summary disanitasi dari:

- control characters;
- zero-width characters;
- pola “ignore previous instructions”;
- tag role seperti `<system>` atau `<assistant>`;
- delimiter prompt buatan.

Body berita dipotong maksimal 600 karakter per item. Prompt menandai blok berita
sebagai **data eksternal, bukan instruksi**.

---

## 13. Logic kalender ekonomi

Default:

```text
maxItems = 6
lookbackHours = 24
```

Sistem memilih currency yang relevan untuk instrumen. Contoh:

- XAU/USD memerlukan event USD;
- EUR/USD memerlukan EUR dan USD;
- USD/IDR dapat menerima event USD dan IDR;
- crypto dapat menerima event crypto/BTC/ETH serta driver makro yang dipetakan.

Untuk crypto dan IDR, curated event lokal dapat digabung dengan upstream feed.

Filter waktu:

```text
eventEpoch >= now - 24 jam
```

Ini memungkinkan AI membaca:

- event yang baru saja rilis;
- actual vs forecast;
- event yang masih akan datang.

Urutan:

1. impact tertinggi;
2. event region Indonesia diprioritaskan ketika relevan;
3. waktu event paling dekat;
4. maksimal enam event.

Format prompt menyertakan:

```text
tanggal
waktu
impact
currency
nama event
previous
actual / forecast / belum rilis
```

Input kalender juga disanitasi dari prompt injection seperti berita.

---

## 14. Pembentukan prompt AI

Prompt terdiri dari:

```text
System prompt mode
+ aturan bahasa Indonesia
+ konteks asset crypto jika relevan
+ waktu sekarang UTC dan WIB
+ instrument + timeframe
+ harga live
+ data teknikal
+ catatan Pro yang sudah disanitasi
+ berita
+ kalender ekonomi
```

Waktu UTC dan WIB dikirim agar AI dapat menilai jendela event satu jam dan
24 jam dengan anchor waktu yang jelas.

### 14.1 Bahasa

AI diminta:

- memakai bahasa konsultatif;
- tidak memberi perintah order;
- menyebut timeframe secara eksplisit;
- menjelaskan ketidakpastian;
- tetap independen dan tidak membahas broker;
- menggunakan bahasa Indonesia yang natural tetapi profesional;
- tidak menggunakan emoji.

### 14.2 Fundamental rules

Prompt mewajibkan:

- event high impact dalam 24 jam disebut dan menurunkan confidence;
- event medium impact dalam 24 jam menjadi sumber ketidakpastian;
- event high/medium impact dalam satu jam memaksa:

```text
marketCondition = volatile
riskLevel       = high
```

- berita material harus dikaitkan dengan teknikal;
- konflik fundamental vs teknikal harus dijelaskan;
- jika fundamental kosong, AI harus menyatakan tidak ada katalis signifikan;
- citation harus cocok dengan snapshot.

Aturan penurunan confidence adalah instruksi kepada AI, bukan formula backend.
Backend memvalidasi range schema dan citation, tetapi tidak menghitung ulang
confidence berdasarkan event.

---

## 15. Mode Beginner dan Pro

### 15.1 Output bersama

Kedua mode wajib menghasilkan:

```text
marketCondition
riskLevel
confidenceMin
confidenceMax
tradingBias
opportunity
risk
tradePlan
fundamentalCitations
```

Enum:

```text
marketCondition:
trending_up | trending_down | ranging | volatile

riskLevel:
low | medium | high

tradingBias:
bearish_strong | bearish | neutral | bullish | bullish_strong
```

### 15.2 Beginner

Field khusus:

```text
mainScenario
alternativeScenario
whyReason
failureConditions
```

Schema confidence:

```text
confidenceMin: integer 1–65
confidenceMax: integer 11–75
```

Prompt meminta jarak minimum 10 poin, tetapi Zod schema hanya memvalidasi range
masing-masing field. Selisih 10 poin bergantung pada kepatuhan output AI.

### 15.3 Pro

Field khusus:

```text
baseCase
bullishScenario
bearishScenario
keyDriversTechnical
keyDriversFundamental
marketContext
invalidationConditions
uncertaintyNotes
```

Schema confidence:

```text
confidenceMin: integer 1–70
confidenceMax: integer 11–80
```

Seperti Beginner, confidence adalah assessment AI yang dibatasi schema dan
prompt, bukan hasil pembagian signal Buy/Sell.

---

## 16. Trade Plan dua sisi

AI wajib mengisi:

```text
preferredSide: buy | sell | wait
buy:  entryZone, stopLoss, takeProfit1, takeProfit2, riskRewardRatio, rationale
sell: entryZone, stopLoss, takeProfit1, takeProfit2, riskRewardRatio, rationale
```

Aturan prompt:

```text
bias bullish        → preferredSide buy
bias bearish        → preferredSide sell
bias neutral        → preferredSide wait
market volatile     → preferredSide wait
```

Walaupun preferred side hanya satu, Buy dan Sell tetap wajib diisi agar pengguna
memiliki skenario dua arah.

### 16.1 Struktur Buy

```text
Stop Loss < Entry
TP1 > Entry
TP2 > TP1
```

### 16.2 Struktur Sell

```text
Stop Loss > Entry
TP1 < Entry
TP2 < TP1
```

Jika tidak ada anchor harga, AI diminta memakai `wait` dan menulis panduan
konfirmasi deskriptif, bukan mengarang level.

---

## 17. Parsing level harga

Level AI berbentuk string, misalnya:

```text
"1.0850 – 1.0865"
"di atas 4680 setelah breakout H1"
"tunggu candle konfirmasi"
```

Parser:

1. menghapus koma pemisah ribuan;
2. menghapus token timeframe seperti `H1`, `M15`, `4H`, `30m`, `1D`;
3. mengambil angka;
4. jika satu angka, memakai angka tersebut;
5. jika dua atau lebih, memakai midpoint dua angka pertama;
6. jika tidak ada angka, mengembalikan `null`.

Midpoint entry:

```text
entry = (angka1 + angka2) / 2
```

Digit timeframe dihapus lebih dulu agar `4680 setelah breakout H1` tidak salah
dibaca sebagai range antara `4680` dan `1`.

---

## 18. Perhitungan ulang Risk:Reward

AI memang mengirim `riskRewardRatio`, tetapi backend tidak mempercayai string
tersebut sebagai nilai final. Backend menghitung ulang dari level AI sendiri.

Untuk Buy:

```text
risk   = entry - stopLoss
reward = takeProfit1 - entry
ratio  = reward / risk
```

Valid hanya jika:

```text
stopLoss < entry
takeProfit1 > entry
```

Untuk Sell:

```text
risk   = stopLoss - entry
reward = entry - takeProfit1
ratio  = reward / risk
```

Valid hanya jika:

```text
stopLoss > entry
takeProfit1 < entry
```

Output:

```text
1:{ratio dibulatkan 1 desimal}
```

Contoh:

```text
Entry = 2.300
SL    = 2.290
TP1   = 2.320

risk   = 10
reward = 20
R:R    = 1:2.0
```

Jika level tidak dapat diparse, risk nol, arah salah, atau ratio tidak valid:

```text
riskRewardRatio = "n/a"
```

---

## 19. Sanitasi geometri level

Sebelum disimpan, backend memeriksa apakah harga benar-benar cocok dengan label
Buy atau Sell.

Jika Buy memiliki SL di atas Entry, TP di bawah Entry, atau TP2 tidak di atas
TP1, seluruh sisi Buy diganti dengan fallback:

```text
entryZone       = "tunggu konfirmasi ulang"
stopLoss        = "n/a"
takeProfit1     = "n/a"
takeProfit2     = "n/a"
riskRewardRatio = "n/a"
rationale       = penjelasan bahwa level AI tidak konsisten
```

Aturan yang sama dibalik untuk Sell.

Level deskriptif tanpa angka tidak dianggap kontradiktif. Itu dianggap no-anchor
plan yang sah.

Urutan finalisasi:

```text
AI output
→ sanitizeTradePlanLevels()
→ reconcileTradePlanRiskReward()
→ output final
```

---

## 20. Mode cepat 1m/5m

Timeframe `1m` dan `5m` memiliki jalur khusus.

Model:

```text
OPENAI_MODEL_FAST_INTRADAY
?? OPENAI_MODEL
?? gpt-4o-mini
```

Konfigurasi:

```text
timeout   = 2.800 ms
maxTokens = 1.400
```

Prompt meminta narasi lebih singkat dan fokus struktur mikro.

Jika AI timeout, error, schema invalid, atau citation tidak valid, backend
menggunakan fallback deterministik.

Fallback:

```text
marketCondition = volatile
riskLevel       = high
confidence      = 25–40
tradingBias     = neutral
preferredSide   = wait
```

Trade Plan fallback tidak membuat angka:

- Buy menunggu candle close di atas resistance mikro;
- Sell menunggu candle close di bawah support mikro;
- SL ditentukan setelah swing konfirmasi;
- TP mengikuti struktur berikutnya;
- R:R dihitung setelah Entry dan SL terbentuk.

Fallback ini memastikan request cepat tetap menghasilkan response yang aman,
tanpa Entry/SL/TP palsu.

---

## 21. Pemanggilan model AI

Model non-fast:

```text
OPENAI_MODEL ?? gpt-4o
```

Konfigurasi umum:

```text
response_format = json_object
temperature     = 0,4
```

AI harus mengembalikan JSON tanpa Markdown.

Token usage dicatat dari response:

```text
promptTokens
completionTokens
totalTokens
callCount
```

`callCount` menghitung call yang selesai dan dapat memberikan usage. Timeout
yang tidak mengembalikan usage tidak ditambahkan sebagai token palsu.

---

## 22. Schema validation dan retry

### 22.1 Attempt pertama

AI output diparse sebagai JSON lalu divalidasi dengan Zod schema sesuai mode.

Validation memeriksa:

- semua field wajib tersedia;
- enum benar;
- confidence integer dalam range;
- string tidak kosong;
- struktur Buy/Sell lengkap;
- struktur citation benar.

### 22.2 Schema retry non-fast

Jika output non-fast gagal schema validation, backend mengirim satu corrective
retry yang meminta:

- semua field wajib hadir;
- tipe dan enum benar;
- hanya JSON;
- tanpa Markdown.

Jika retry tetap gagal, error diteruskan ke route dan user menerima HTTP `502`.

### 22.3 Citation retry

Setelah schema valid, backend memeriksa citation terhadap fundamental snapshot.

Jika citation tidak grounded:

1. AI diberi alasan citation yang salah;
2. AI diminta memakai hanya title/event dari snapshot;
3. output retry divalidasi lagi;
4. citation diperiksa lagi.

Jika retry citation masih gagal, request dianggap gagal. Sistem lebih memilih
HTTP `502` daripada menyimpan fundamental prose dengan sumber fiktif.

Untuk 1m/5m, kegagalan tersebut langsung memakai fast fallback.

---

## 23. Validasi fundamental citation

Jika snapshot kosong, citation wajib kosong.

Jika snapshot berisi data, citation dianggap grounded ketika:

1. normalized citation adalah substring item asli; atau
2. item asli adalah substring citation; atau
3. minimal dua significant token dengan panjang minimal empat karakter cocok.

Untuk singkatan pendek seperti:

```text
CPI
NFP
FOMC
```

normalized citation harus ditemukan langsung pada item asli.

Backend hanya menolak citation yang dibuat-buat. AI boleh tidak memakai berita
atau kalender tertentu meskipun snapshot tidak kosong.

---

## 24. Masa berlaku analysis

`validUntil` dihitung dari waktu pembuatan:

| Timeframe | Masa berlaku |
|---|---:|
| 1m | 15 menit |
| 5m | 1 jam |
| 15m | 2,5 jam |
| 30m | 3,5 jam |
| 1h | 5 jam |
| 4h | 18 jam |
| 1D | 36 jam |
| 1W | 96 jam |

Timeframe tidak dikenal fallback ke satu jam.

Masa berlaku menunjukkan window relevansi analisis dan dipakai oleh proses lain
seperti outcome resolution. Itu bukan jaminan level akan tetap valid sampai
detik terakhir.

---

## 25. Data yang disimpan

Satu analysis menyimpan:

### Identitas

```text
id
userId
instrument
timeframe
mode
createdAt
validUntil
```

### Input

```text
userInputContext
```

### Output bersama

```text
rawAiOutput
marketCondition
riskLevel
confidenceMin
confidenceMax
tradingBias
opportunity
risk
tradePlan
```

### Snapshot teknikal

```text
techBuyCount
techSellCount
techNeutralCount
```

### Snapshot fundamental

```text
fundamentalContext
fundamentalCitations
```

### Beginner

```text
mainScenario
alternativeScenario
whyReason
failureConditions
```

### Pro

```text
baseCase
bullishScenario
bearishScenario
keyDriversTechnical
keyDriversFundamental
marketContext
invalidationConditions
uncertaintyNotes
```

Snapshot penting karena halaman detail harus menampilkan konteks yang sama
dengan yang dilihat AI saat generation, bukan diam-diam menggantinya dengan
berita atau indikator terbaru.

---

## 26. Token usage dan cost estimate

Setelah analysis tersimpan, backend mencoba menyimpan:

```text
analysisId
userId
model
promptTokens
completionTokens
totalTokens
callCount
estimatedCostUsd
instrument
timeframe
```

Cost dihitung menggunakan metadata harga model.

Kegagalan menyimpan token usage hanya dicatat sebagai warning. Analysis utama
tetap sukses karena telemetry biaya bukan bagian wajib dari hasil pengguna.

---

## 27. Response sukses dan proses lanjutan

Jika berhasil:

```text
HTTP 201
body = row analysis yang baru disimpan
```

Backend kemudian:

1. membuat notifikasi **Analisis Selesai**;
2. mencoba auto-arm price alert jika user sudah memiliki push subscription;
3. membandingkan dengan analysis instrument/timeframe sebelumnya untuk signal
   flip;
4. mereset dormancy streak.

Proses alert dan signal-flip bersifat best-effort dan tidak boleh menggagalkan
response analysis.

Frontend:

1. memperbarui cache quota;
2. mencatat event `analysis_created`;
3. berpindah ke:

```text
/analyses/{created.id}
```

Tidak ada generation AI kedua saat navigasi.

---

## 28. Failure handling

| Kondisi | Perilaku |
|---|---|
| Instrumen kosong | Frontend toast, request tidak dikirim |
| Timeframe kosong | Frontend toast, request tidak dikirim |
| Cooling-off aktif | Buka breathing dialog |
| Request user yang sama masih berjalan | 429 concurrent |
| Quota jam/hari habis | 429 + quota scope |
| Harga live gagal | Lanjut tanpa live anchor |
| Indicators gagal | Lanjut tanpa technical context atau memakai stale cache |
| News gagal | Lanjut dengan source lain atau array kosong |
| Calendar gagal | Lanjut dengan array kosong |
| AI fast gagal | Gunakan fallback aman 1m/5m |
| AI non-fast gagal | 502 |
| Schema non-fast gagal pertama | Retry satu kali |
| Citation salah | Corrective retry |
| Citation tetap salah | 502, jangan simpan analysis palsu |
| Token telemetry gagal | Analysis tetap sukses |
| Auto-arm alert gagal | Analysis tetap sukses |

Jika kegagalan AI terjadi tiga kali dalam window satu jam, sistem membuat
peringatan untuk admin lalu mereset penghitung error window tersebut.

---

## 29. Refresh Fundamentals

Analysis Detail memiliki operasi terpisah untuk me-refresh fundamental:

```text
POST /analyses/{id}/refresh-fundamentals
```

Operasi ini:

- mengambil ulang news;
- mengambil ulang calendar;
- menyimpan fundamental snapshot baru;
- membandingkan snapshot dengan citation asli;
- melaporkan fundamental drift.

Operasi ini **tidak menjalankan AI ulang** dan tidak mengubah narasi lama. Tujuan
utamanya adalah menunjukkan apakah basis fundamental yang dipakai analysis lama
masih tersedia atau sudah berubah.

---

## 30. Pseudocode keseluruhan

```text
function createAnalysis(request, user):
  requireAuthenticated(user)
  validate(request.instrument, request.timeframe, request.mode)

  if user is normal:
    acquirePerUserTransactionLock()
    enforceHourlyAndDailyQuota()

  parallel:
    livePrice = fetchLivePrice(timeout=1500ms)
    indicators = fetchAndCalculateIndicators()
    news = timeframe in [1m, 5m] ? [] : fetchRelevantNews()
    calendar = timeframe in [1m, 5m] ? [] : fetchRelevantCalendar()

  fundamentalSnapshot = { newsItems: news, calendarEvents: calendar }
  indicatorContext = formatIndicators(indicators)

  result = generateAnalysis(
    instrument,
    timeframe,
    mode,
    sanitizedProNotes,
    indicatorContext,
    fundamentalSnapshot,
    livePrice
  )

  validateSchema(result)
  validateFundamentalCitations(result, fundamentalSnapshot)
  sanitizeBuySellGeometry(result.tradePlan)
  recomputeRiskReward(result.tradePlan)

  analysis = insertAnalysis(result, snapshots, validUntil)
  saveTokenUsageBestEffort()
  notifyUserBestEffort()
  autoArmAlertsBestEffort()
  detectSignalFlipBestEffort()

  return 201 analysis
```

---

## 31. Bagian deterministik vs penilaian AI

### Dihitung oleh kode

- candle resampling;
- live-price offset;
- price changes;
- SMA/EMA;
- RSI;
- MACD;
- Stochastic;
- Bollinger Bands;
- Buy/Sell/Neutral tally;
- overall technical signal;
- quota;
- analysis validity window;
- parsing Entry/SL/TP;
- validasi geometri Buy/Sell;
- Risk:Reward;
- citation matching;
- fast fallback.

### Dinilai oleh AI

- market condition;
- risk level;
- confidence range;
- trading bias;
- opportunity;
- risk narrative;
- skenario Beginner/Pro;
- level Entry/SL/TP awal;
- rationale;
- pemilihan citation yang dianggap relevan.

### Dibatasi oleh kode dan prompt

- enum output;
- confidence minimum/maksimum;
- keberadaan semua field;
- JSON shape;
- fundamental grounding;
- struktur Trade Plan;
- arah geometri level;
- Risk:Reward final.

Pemisahan ini penting: confidence tidak boleh didokumentasikan sebagai hasil
rumus jumlah indikator. Jumlah indikator adalah input AI, sedangkan confidence
adalah assessment model yang dibatasi range dan aturan fundamental.

---

## 32. Test yang relevan

Area test utama:

```text
artifacts/api-server/src/lib/__tests__/openai-trade-plan.test.ts
artifacts/api-server/src/lib/__tests__/openai-citations.test.ts
artifacts/api-server/src/lib/__tests__/openai-style.test.ts
artifacts/api-server/src/lib/__tests__/indicators-periods.test.ts
artifacts/api-server/src/lib/__tests__/historical-resilience.test.ts
artifacts/api-server/src/lib/__tests__/news.test.ts
artifacts/api-server/src/lib/__tests__/calendar.test.ts
artifacts/api-server/src/routes/__tests__/analyses-30m.test.ts
artifacts/ai-trading/src/pages/__tests__/analyze.test.tsx
artifacts/ai-trading/src/pages/__tests__/analysis-detail.test.tsx
```

Perintah umum:

```bash
pnpm --filter @workspace/api-server run test
pnpm --filter @workspace/ai-trading run test
pnpm run typecheck
```

---

## 33. Aturan pemeliharaan

Saat mengubah fitur analisis:

1. Jangan menyebut confidence sebagai win probability.
2. Jika mengubah rumus indikator, update test dan dokumen ini bersama-sama.
3. Jika menambah timeframe, update frontend, OpenAPI, source candle, cache TTL,
   period logic, prompt, dan validity window.
4. Jika mengubah schema AI, update schema Zod, prompt JSON, database projection,
   API schema, dan test.
5. Jangan menyimpan fundamental prose dengan citation fiktif.
6. Jangan memakai news/calendar terbaru untuk menggantikan snapshot analysis
   tanpa label refresh/drift yang jelas.
7. Jangan mempercayai Risk:Reward dari string AI; tetap hitung ulang dari level.
8. Jangan menampilkan level numerik yang geometri Buy/Sell-nya bertentangan.
9. Pertahankan fallback aman untuk 1m/5m.
10. Kegagalan telemetry, token logging, atau alert tidak boleh menghapus hasil
    analysis yang sudah valid.
