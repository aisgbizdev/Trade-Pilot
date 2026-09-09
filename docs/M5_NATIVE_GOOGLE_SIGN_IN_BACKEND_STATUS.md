# M5 — Native Google Sign-In — Status Backend

**Balasan untuk:** `BACKEND_HANDOFF_M5_NATIVE_GOOGLE_SIGN_IN.md` (tim mobile)
**Produk:** TradePilot Mobile 1.0.2
**Status backend:** ✅ Kode selesai & lolos test — ⏳ menunggu OAuth client Android/iOS + config deployment
**Branch:** `prodd-v2` · commit `2ef4931`
**Tanggal:** 9 September 2026

---

## 1. Ringkasan

Semua endpoint native yang diminta di handoff sudah **diimplementasikan,
di-test lawan database asli (41 test auth lolos), dan didokumentasikan di
OpenAPI**. Flow web (`GET /auth/google` + `/callback`) **tidak diubah**.

Yang belum: **OAuth client Android & iOS** harus dibuat di Google Cloud
Console, dan `GOOGLE_NATIVE_ALLOWED_CLIENT_IDS` di-set di deployment.
Sebelum itu, `POST /auth/google/native` dan `POST /auth/reauth/google`
mengembalikan **`503`** (endpoint lain tidak terpengaruh).

Kirim `lib/api-spec/openapi.yaml` terbaru ke tim mobile untuk regenerate
Dart client.

---

## 2. Endpoint yang tersedia

Path di bawah **tanpa** prefix deployment `/api`.

### 2.1 `POST /auth/google/native`

Tukar Google **ID token** (dari SDK native) → session TradePilot.

**Request** (strict — field tak dikenal ditolak `400`):

```http
POST /api/auth/google/native
Content-Type: application/json

{ "idToken": "GOOGLE_ID_TOKEN" }
```

**Response `200`** — sama persis dengan `AuthResponse` login biasa:

```json
{
  "token": "TRADEPILOT_BEARER_TOKEN",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "displayName": "Example User",
    "avatarUrl": null,
    "role": "user",
    "selectedMode": "pro",
    "themePreference": "light",
    "onboardingCompleted": false,
    "hasPassword": false,
    "createdAt": "2026-09-09T08:00:00.000Z"
  }
}
```

- `token` = session token TradePilot (opaque, expiry 30 hari). **Bukan**
  Google token. Simpan hanya token ini di secure storage.
- Tidak set cookie. Tidak butuh cookie.
- Response tidak pernah memuat Google token, `sub`, atau credential internal.

**Verifikasi ID token (server-side, library `google-auth-library`):**
signature vs Google public keys, `iss`, `aud` ∈ allowlist server
(`GOOGLE_NATIVE_ALLOWED_CLIENT_IDS`), `exp`/`iat` + clock skew, dan
`email_verified === true`. `email`/`sub` diambil **hanya** dari token yang
sudah terverifikasi, bukan dari body.

**Aturan akun** (sama dengan web):
1. cari `google_id` → user itu
2. cari **verified email** → belum tertaut Google: link `google_id`;
   tertaut ke `google_id` berbeda: `409`
3. tidak ada → buat akun baru (`selectedMode: "pro"`, `onboardingCompleted:
   false`). Transaction + unique constraint mencegah akun/link ganda pada
   request paralel.

**Error:**

| Status | Kondisi | `error` (contoh) |
|---|---|---|
| `400` | Body kosong / tipe salah / field tak dikenal | `Permintaan tidak valid.` |
| `401` | Signature/issuer/audience salah, expired, atau email belum verified | `Login Google tidak dapat diverifikasi. Silakan coba lagi.` |
| `409` | Email sudah tertaut ke `google_id` lain | `Email ini sudah tertaut ke akun Google lain.` |
| `429` | Rate limit (20 / 15 menit / IP) + header `Retry-After` | — |
| `503` | `GOOGLE_NATIVE_ALLOWED_CLIENT_IDS` belum diset | `Login Google native belum dikonfigurasi.` |

Tidak ada pesan berbeda yang membocorkan apakah email terdaftar (anti
enumeration). Detail alasan verifikasi masuk security log (tanpa token mentah).

### 2.2 `POST /auth/reauth/google`

Bukti identitas dengan Google ID token **baru** untuk operasi sensitif.

**Request** (butuh Bearer, strict):

```http
POST /api/auth/reauth/google
Authorization: Bearer TRADEPILOT_BEARER_TOKEN
Content-Type: application/json

{ "idToken": "FRESH_GOOGLE_ID_TOKEN" }
```

**Response `200`:**

```json
{
  "reauthToken": "SINGLE_USE_TOKEN",
  "expiresAt": "2026-09-09T08:05:00.000Z"
}
```

`reauthToken`: acak kriptografis, **disimpan sebagai hash SHA-256**, berlaku
**5 menit**, **sekali pakai**, terikat ke user + purpose `delete_account`,
ditandai terpakai secara atomik saat dikonsumsi, tidak pernah di-log.

Identitas Google di token baru harus **cocok** dengan akun yang sedang
login (`google_id` atau email sama), kalau tidak → `401`.

**Error:** `400` (body invalid), `401` (belum login / token invalid /
identitas tidak cocok), `429` (10 / 15 menit / user), `503` (belum dikonfigurasi).

### 2.3 `GET /auth/me` (+ semua response auth)

Field baru pada schema `User`, ikut di **semua** response yang memakainya
(register, login, google native, `/auth/me`, `PATCH /auth/profile`):

| Field | Tipe | Arti |
|---|---|---|
| `hasPassword` | `boolean` | `true` = akun punya password lokal (bisa login password + reauth password). `false` = akun Google-only |
| `createdAt` | `string (date-time)` | Sudah `required` di OpenAPI tapi sebelumnya tidak dikirim — sekarang dikirim |

`passwordHash` dan `googleId` **tidak** dikirim.

### 2.4 `DELETE /auth/account`

Sekarang wajib bukti re-autentikasi (session aktif saja **tidak cukup**):

```jsonc
// akun password (user.hasPassword === true)
{ "currentPassword": "..." }

// akun Google-only
{ "reauthToken": "..." }   // dari POST /auth/reauth/google
```

**Error:**

| Status | Kondisi |
|---|---|
| `400` | Akun password tanpa `currentPassword`, atau akun Google-only tanpa `reauthToken` |
| `401` | Password salah, atau `reauthToken` invalid/expired/sudah dipakai |

Path password **tidak berubah** dari sebelumnya.

---

## 3. Yang backend BUTUHKAN dari tim mobile

Untuk membuat OAuth client Android & iOS di Google Cloud Console (project
`trade-pilot-508001`), backend/DevOps butuh dari kalian:

| # | Dibutuhkan | Untuk |
|---|---|---|
| 1 | **SHA-1 & SHA-256** signing certificate fingerprint — **debug**, **release/upload key**, dan **Play App Signing key** (dari Play Console) | Android OAuth client (package `id.tradepilot.app`) |
| 2 | Konfirmasi **bundle ID** iOS = `id.tradepilot.app` (atau kirim yang benar) | iOS OAuth client |
| 3 | Konfirmasi apakah kalian pakai **`serverClientId`** di `google_sign_in` (biasanya = web client id `929958103345-…`). Kalau pakai client id lain, kirim | Menentukan `aud` yang harus di-allowlist |
| 4 | Konfirmasi **package name** Android final = `id.tradepilot.app` | Android OAuth client |

Setelah itu backend/DevOps akan:
- membuat kedua OAuth client;
- mengembalikan ke kalian: **client id Android**, **client id iOS**, dan
  **reversed client id iOS** (untuk URL scheme) — plus file `GoogleService`
  publik kalau perlu;
- set `GOOGLE_NATIVE_ALLOWED_CLIENT_IDS=<android>,<ios>,<web>` di deployment;
- jalankan migrasi DB prod (`reauth_tokens`).

⚠️ Backend **tidak** akan mengirim OAuth **web client secret** — jangan
memasukkannya ke Flutter/APK/IPA/repo/CI.

---

## 4. Yang backend kirim ke tim mobile (setelah config selesai)

1. `lib/api-spec/openapi.yaml` terbaru (operation `loginWithGoogleNative`,
   `reauthenticateWithGoogle`; schema `GoogleNativeLoginBody`,
   `GoogleReauthBody`, `GoogleReauthResponse`; `User.hasPassword`,
   `DeleteAccountBody.reauthToken`).
2. Base URL staging.
3. Client id **Android** + **iOS** + **reversed client id iOS** (publik).
4. Test account (email + password) untuk verifikasi flow.
5. Contoh respons: akun baru, akun existing (link), akun Google-only, dan
   error (invalid audience, expired, unverified email, `409` conflict, `429`).

---

## 5. Hasil Acceptance Test Backend

Referensi: §10 handoff. Status per commit `2ef4931` (test lawan DB asli):

| Kriteria | Status |
|---|---|
| ID token valid → akun baru + `{user, token}` | ✅ |
| Google `sub` sama pada login berikutnya → akun sama | ✅ |
| Verified email menautkan akun password existing | ✅ |
| Request paralel tidak membuat user/link ganda | ✅ (transaction + unique constraint) |
| Google `sub` berbeda tidak mengambil alih link existing | ✅ (`409`) |
| Signature / issuer / audience invalid ditolak | ✅ (via `google-auth-library`) |
| Token expired ditolak | ✅ |
| `email_verified=false` ditolak | ✅ |
| Field/token tambahan tidak sesuai schema ditolak | ✅ (`400`, strict body) |
| Rate limit → `429` + `Retry-After` | ✅ |
| Semua response `User` memuat `hasPassword` benar | ✅ |
| Google-only user tidak bisa endpoint password/security-question | ✅ (sudah dari M-sebelumnya) |
| Fresh Google ID token → `reauthToken` berumur pendek | ✅ (≤5 menit) |
| `reauthToken` user lain / expired / sudah dipakai ditolak | ✅ (`401`) |
| Hapus akun Google-only gagal tanpa reauth baru | ✅ (`400`) |
| Hapus akun berhasil dengan reauth valid, token tidak bisa dipakai ulang | ✅ |
| Log / error tracker tidak memuat Google ID token, session token, secret, `reauthToken` | ✅ (token tidak pernah di-log; reauth disimpan sebagai hash) |

Belum dites di backend (butuh device fisik / setup mobile):
- Delivery end-to-end dengan Google SDK asli (kalian yang verifikasi setelah
  config OAuth client selesai).

---

## 6. Definition of Ready — checklist gabungan

| Kondisi | PIC | Status |
|---|---|---|
| Endpoint native + reauth tersedia di kode | Backend | ✅ |
| OpenAPI memuat seluruh kontrak | Backend | ✅ |
| `User.hasPassword` konsisten di semua auth response | Backend | ✅ |
| Backend acceptance test lulus | Backend | ✅ |
| SHA fingerprints Android + konfirmasi bundle/package | **Mobile** | ⏳ |
| Android/iOS OAuth client dibuat | Backend/DevOps (butuh #atas) | ⏳ |
| `GOOGLE_NATIVE_ALLOWED_CLIENT_IDS` di-set di staging + prod | Backend/DevOps | ⏳ |
| Migrasi DB `reauth_tokens` di prod | Backend/DevOps | ⏳ (lokal ✅) |
| Test account + client id publik dikirim ke mobile | Backend/DevOps | ⏳ |

Setelah semua ⏳ selesai → tim mobile boleh menambah `google_sign_in`,
kirim ID token **hanya** ke `/auth/google/native`, simpan **hanya**
TradePilot Bearer token, sembunyikan menu password saat `hasPassword=false`,
dan minta `/auth/reauth/google` sebelum hapus akun.
