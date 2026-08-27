# Panduan SDK Flutter/Dart — Trade Pilot API Client

> Dokumentasi ini menjelaskan infrastruktur SDK Dart/Flutter yang dipakai untuk
> mengintegrasikan Trade Pilot ke aplikasi mobile lain (mis. app trading Flutter
> milik SOLID), plus cara konfigurasinya. SDK ini di-generate dan di-maintain
> dari dalam repo Trade Pilot, bukan di sisi konsumen.

---

## 1. Latar Belakang & Konsep

Trade Pilot punya satu sumber kebenaran untuk seluruh API-nya: file
`lib/api-spec/openapi.yaml`. Dari file spesifikasi ini, sekarang ada **3 client
yang di-generate otomatis**:

| Target | Tool | Lokasi output | Dipakai oleh |
|---|---|---|---|
| React Query (web) | `orval` | `lib/api-client-react` | `artifacts/ai-trading` |
| Zod validators | `orval` | `lib/api-zod` | backend & frontend |
| **Dart/Dio (Flutter)** | `openapi-generator-cli` | `lib/api-client-dart` | app Flutter eksternal (mis. SOLID) |

Ketiganya digenerate dari spec yang **sama persis** — jadi begitu ada endpoint
baru atau berubah di backend, tinggal jalankan satu perintah codegen dan
ketiga client otomatis ikut update, gak perlu tulis manual satu-satu.

**Kenapa bukan WebView aja?** Trade Pilot sebenarnya sudah punya mode embed
(`?embed=1`, lihat `artifacts/ai-trading/src/lib/embed-mode.tsx`) yang bisa
langsung ditempel di WebView — itu jalan paling cepat. Tapi karena rencananya
akun Trade Pilot & SOLID mau digabung ke depannya, dan itu butuh kontrol
auth/token yang presisi di level native, dipilih jalur SDK native Dart supaya
tim Flutter SOLID bisa bikin UI sendiri yang benar-benar nyatu, dengan tipe
data yang aman (typed) dan auth yang gampang di-custom.

**Penting:** paket ini baru menyediakan *akses ke API Trade Pilot apa adanya*
(login, register, bikin analisis, journal, dst). Penggabungan akun (SSO / tabel
linked-account) **belum diimplementasikan** — itu keputusan desain backend
terpisah yang menyusul nanti setelah strategi auth-nya diputuskan.

---

## 2. Prasyarat

Untuk **generate ulang** SDK (bukan untuk memakainya di app Flutter), mesin
yang menjalankan codegen butuh:

- **Java Runtime (JRE) 17+** — dipakai oleh `openapi-generator-cli` untuk
  menjalankan generator-nya (berbasis Java). Sudah diinstal di mesin dev ini
  via `winget install --id EclipseAdoptium.Temurin.21.JRE`.
- **Dart SDK** (opsional, hanya kalau mau memverifikasi hasil generate-nya
  benar-benar compile) — diinstal via `winget install --id Google.DartSDK`.
  Tim yang mengonsumsi paket ini (mis. developer Flutter SOLID) sudah pasti
  punya Dart/Flutter SDK karena itu prasyarat kerja mereka sehari-hari.

Untuk **memakai** SDK-nya di project Flutter, yang dibutuhkan cuma Dart/Flutter
SDK seperti biasa — gak perlu Java di sisi konsumen.

---

## 3. Struktur Project

```
lib/
├── api-spec/
│   ├── openapi.yaml           # sumber kebenaran tunggal untuk semua client
│   ├── orval.config.ts        # config generator React + Zod
│   └── package.json           # script codegen (lihat bagian 4)
│
└── api-client-dart/            # paket Dart yang dihasilkan
    ├── pubspec.yaml
    ├── lib/
    │   ├── trade_pilot_api_client.dart   # (generated) barrel export utama
    │   ├── trade_pilot_client.dart       # (TULISAN MANUAL — lihat bagian 6)
    │   └── src/
    │       ├── api.dart                  # (generated) class TradePilotApiClient
    │       ├── api/                      # (generated) satu file per grup endpoint
    │       └── model/                    # (generated) satu file per model/DTO
    ├── doc/                    # (generated) dokumentasi method per class, format .md
    ├── test/                   # (generated) skeleton test per API class
    └── .openapi-generator-ignore  # daftar file yang TIDAK boleh ditimpa saat regenerate
```

File yang **boleh diedit manual** hanya `lib/trade_pilot_client.dart` (dan
dokumen ini). Semua yang lain akan **tertimpa** setiap kali codegen dijalankan
ulang — jangan edit langsung, filenya sudah ditandai `AUTO-GENERATED FILE, DO
NOT MODIFY!` di bagian atas.

---

## 4. Cara Generate Ulang SDK

Setiap kali `lib/api-spec/openapi.yaml` berubah (endpoint baru, field baru,
dll), jalankan dari root repo:

```bash
pnpm --filter @workspace/api-spec run codegen
```

Perintah ini otomatis menjalankan **ketiganya sekaligus**: React, Zod, dan
Dart. Kalau cuma mau regenerate Dart-nya saja (lebih cepat saat sedang
eksperimen):

```bash
pnpm --filter @workspace/api-spec run codegen:dart
```

Isi perintahnya (di `lib/api-spec/package.json`):

```json
"codegen:dart": "openapi-generator-cli generate -i ./openapi.yaml -g dart-dio -o ../api-client-dart -p pubName=trade_pilot_api_client -p pubVersion=0.1.0"
```

Setelah regenerate, kalau mau memverifikasi hasilnya benar-benar bisa dipakai
(opsional, butuh Dart SDK terinstal):

```bash
cd lib/api-client-dart
dart pub get
dart run build_runner build --delete-conflicting-outputs   # generate file .g.dart (serializer)
dart analyze                                                 # cek error/warning
```

> **Catatan versi:** `pubVersion=0.1.0` di-hardcode di script. Kalau SDK ini
> mau dipublikasikan dengan versi berjalan (mis. mengikuti semver setiap ada
> perubahan API), ubah nilainya di script sebelum generate — belum ada
> automasi bump-version otomatis.

---

## 5. Cara Pakai di Project Flutter (Sisi Konsumen / SOLID)

Karena SDK ini belum dipublikasikan ke pub.dev atau server pub privat, ada 2
cara pakai untuk sekarang:

### Opsi A — Path lokal (kalau repo Trade Pilot & Flutter ada di mesin yang sama)

```yaml
# pubspec.yaml (di project Flutter SOLID)
dependencies:
  trade_pilot_api_client:
    path: /path/ke/Trade-Pilot/lib/api-client-dart
```

### Opsi B — Vendor lewat Git (paling umum untuk tim terpisah)

```yaml
dependencies:
  trade_pilot_api_client:
    git:
      url: https://github.com/aisgbizdev/Trade-Pilot.git
      path: lib/api-client-dart
      ref: main   # atau tag/commit tertentu biar versi terkunci
```

### Opsi C — Publish ke pub server privat (belum dilakukan)

Kalau ke depannya butuh versioning yang lebih rapi (banyak konsumen, banyak
rilis), paket ini bisa dipublikasikan ke server pub privat (mis. lewat
[pub.new](https://pub.new) hosting sendiri, atau GitHub Packages). Ini
**keputusan menyusul**, belum di-setup — opsi A/B sudah cukup untuk tahap
integrasi awal.

Setelah dependency terpasang, jalankan `flutter pub get` seperti biasa.

---

## 6. Konfigurasi `TradePilotClient` (Auth & Base URL)

### Kenapa ada wrapper manual?

`openapi.yaml` **tidak mendeklarasikan `securityScheme`** secara formal —
autentikasi di backend Trade Pilot dicek manual lewat header
`Authorization: Bearer <token>` (lihat `requireAuth` di
`artifacts/api-server/src/middleware/auth.ts`), bukan lewat mekanisme OpenAPI
resmi. Akibatnya, `BearerAuthInterceptor` bawaan hasil generate **tidak akan
otomatis nempel ke request manapun** karena spec-nya tidak bilang endpoint mana
yang butuh auth apa.

Karena itu, `lib/trade_pilot_client.dart` (file yang ditulis manual, aman dari
timpaan codegen) membungkus hasil generate dengan interceptor Dio kustom yang
meniru pola yang sama persis dengan client web
(`lib/api-client-react/src/custom-fetch.ts`): sebuah **fungsi getter yang
dipanggil sebelum setiap request**, dan hasilnya (kalau ada) dipasang sebagai
header `Authorization: Bearer <token>`.

### Contoh setup dasar

```dart
import 'package:trade_pilot_api_client/trade_pilot_client.dart';

final client = TradePilotClient(
  baseUrl: 'https://api.tradepilot.app/api', // ganti sesuai environment
  getToken: () async {
    // Ambil token dari mana pun app SOLID menyimpannya —
    // secure storage, provider/state management, dsb.
    return await mySecureStorage.read(key: 'trade_pilot_session_token');
  },
);
```

- `baseUrl` — wajib diisi, arahkan ke domain API Trade Pilot yang sesuai
  (dev/staging/production).
- `getToken` — opsional. Kalau tidak diisi, semua request dikirim tanpa header
  `Authorization` (cocok untuk endpoint publik seperti `login`/`register`).
  Kalau diisi, dipanggil ulang **setiap kali** ada request baru — jadi kalau
  nanti ada refresh-token atau *flow* auth gabungan-akun, tinggal ganti logic
  di dalam fungsi ini, tidak perlu ubah kode generated sama sekali.

### Contoh pemakaian

```dart
// Login — endpoint publik, belum butuh token
final loginResponse = await client.auth.login(
  loginBody: LoginBody((b) => b
    ..email = 'user@example.com'
    ..password = 'rahasia123'),
);
final token = loginResponse.data?.token; // simpan token ini

// Setelah login, getToken() di atas otomatis mengambil token yang baru
// disimpan, jadi request berikutnya sudah otomatis ter-autentikasi.

// Bikin analisis baru
final result = await client.analyses.createAnalysis(
  createAnalysisBody: CreateAnalysisBody((b) => b
    ..instrument = 'XAU/USD'
    ..timeframe = '1h'
    ..mode = CreateAnalysisBodyModeEnum.beginner),
);
print(result.data?.tradingBias);

// Lihat sisa kuota analisis user
final quota = await client.analyses.getAnalysisQuota();
print('Sisa kuota per jam: ${quota.data?.hourly.remaining}');
```

Semua kategori endpoint bisa diakses lewat getter singkat di `client`:
`client.auth`, `client.analyses`, `client.admin`, `client.superadmin`,
`client.tradeJournal`, `client.watchlist`, `client.push`,
`client.notifications`, `client.performance`, `client.dailySummary`,
`client.filterPresets`, `client.userPriceAlerts`, `client.traderMirror`,
`client.events`, `client.storage`, `client.health`.

### Menambah interceptor sendiri

Kalau SOLID butuh interceptor tambahan (logging, retry, crash reporting),
pakai `client.dio` langsung:

```dart
client.dio.interceptors.add(LogInterceptor(responseBody: true));
```

---

## 7. Referensi Endpoint Lengkap

Daftar lengkap semua method beserta parameter dan model request/response-nya
otomatis ter-generate di:

- `lib/api-client-dart/README.md` — tabel ringkas semua endpoint per kategori.
- `lib/api-client-dart/doc/*.md` — satu file per class API (mis.
  `AnalysesApi.md`) dan satu file per model (mis. `Analysis.md`), isinya detail
  parameter, tipe, dan contoh.

Berhubung ini ikut ter-generate ulang dari spec, dokumen ini **selalu sinkron**
dengan endpoint yang benar-benar ada di backend — kalau ragu endpoint tertentu
sudah tersedia atau belum, cek langsung ke file-file itu setelah codegen
terbaru dijalankan.

---

## 8. Troubleshooting

**`java: command not found` saat generate:**
Java belum ada di `PATH` sesi terminal yang sedang dipakai (biasanya karena
baru saja diinstal dan terminal belum di-restart). Buka terminal baru, atau
set manual:
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jre-21.0.12.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

**`dart: command not found` saat `dart pub get`/`dart analyze`:**
Sama seperti di atas tapi untuk Dart SDK — buka terminal baru, atau tambahkan
lokasi instalasi Dart SDK ke `PATH` secara manual.

**Warning `unused_import` saat `dart analyze`:**
Ini normal — bawaan template `openapi-generator` (dart-dio) yang selalu
meng-*import* `json_object.dart` dan model `ErrorResponse` secara defensif,
walau tidak semua endpoint memakainya. Bukan bug, aman diabaikan, dan akan
selalu muncul lagi setiap regenerate.

**Perubahan di model tidak muncul setelah edit `openapi.yaml`:**
Pastikan menjalankan `pnpm --filter @workspace/api-spec run codegen` (atau
`codegen:dart`) ulang — perubahan di spec tidak otomatis ter-refresh tanpa
generate ulang.

---

## 9. Rencana Selanjutnya (Belum Dikerjakan)

Hal-hal berikut **secara sengaja belum dibangun** di iterasi ini, karena
menunggu keputusan/prioritas lebih lanjut:

1. **Penggabungan akun (SSO / linked-account)** — desain backend terpisah,
   perlu diputuskan dulu strateginya (OAuth antar sistem, atau tabel mapping
   user Trade Pilot ↔ user SOLID) sebelum diimplementasikan.
2. **Publish ke pub server privat** — supaya versioning SDK lebih rapi untuk
   banyak konsumen/rilis, saat ini masih pakai path/git dependency.
3. **UI Flutter di sisi SOLID** — SDK ini hanya menyediakan lapisan data/API;
   layar-layar (Analyze, History, dsb) di app SOLID perlu dibangun terpisah
   oleh tim Flutter mereka memakai SDK ini.
