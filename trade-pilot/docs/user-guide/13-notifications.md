# 13 — Notifications (Pengaturan Notifikasi)

Halaman Notifications adalah pusat kendali semua notifikasi Trade Pilot — mulai dari price alert, daily digest, sinyal market, hingga pengingat sesi trading.

---

## 13.1 Cara Masuk

Tap ikon 🔔 di bagian kanan atas aplikasi, atau tap **"Notifikasi"** dari navigation.

---

## 13.2 In-App Notifications

Di tab **"In-App"**, kamu melihat daftar semua notifikasi yang masuk secara kronologis.

### Tipe Notifikasi yang Bisa Masuk

| Tipe | Kapan Muncul |
|------|-------------|
| **Price Alert** | Harga menyentuh level yang kamu set di My Alerts |
| **Daily Summary** | Digest harian sudah tersedia (sesuai jadwal) |
| **Market News** | Ada berita besar yang relevan dengan instrumenmu |
| **Calendar Event** | Event ekonomi penting akan segera terjadi |
| **Price Anomaly** | Deteksi pergerakan harga tidak biasa |
| **Weekly Recap** | Ringkasan performa trading minggu ini |
| **Signal Flip** | Bias/sinyal berubah arah dari analisa sebelumnya |
| **Dormancy Nudge** | Pengingat kalau kamu tidak aktif analisa cukup lama |
| **Broadcast** | Pengumuman dari Tim Trade Pilot |

### Interaksi
- Tap notifikasi untuk membuka detail atau halaman yang relevan (misal: tap alert → buka analisa terkait)
- Swipe untuk dismiss (menghapus dari daftar)
- Tombol **"Tandai Semua Dibaca"** di kanan atas untuk clear semua badge

---

## 13.3 Push Notification — Aktifkan Dulu

Push notification memungkinkan Trade Pilot mengirim alert ke HP bahkan saat aplikasi tidak sedang dibuka.

### Cara Mengaktifkan Push Notification

1. Di halaman Notifikasi, scroll ke bagian **"Push Notification"**
2. Tap tombol **"Aktifkan Push Notification"**
3. Browser meminta izin — tap **"Allow"** / **"Izinkan"**
4. Status berubah menjadi "Push Aktif ✅"

> ⚠️ Kalau kamu tidak tap "Allow" saat browser meminta izin, push notification tidak akan berfungsi. Kamu bisa reset izin di pengaturan browser:
> - Chrome: Settings → Privacy and Security → Site Settings → Notifications
> - Safari: Settings → Notifications → Trade Pilot

### Test Push

Setelah aktif, tap **"Kirim Test Push"** untuk verifikasi:
- Kalau berhasil → kamu terima notifikasi "Test Berhasil" dalam beberapa detik
- Kalau gagal → cek izin browser

---

## 13.4 Preferensi Push Per Kategori

Di bagian **"Preferensi Push"**, kamu bisa kontrol tipe push notification mana yang aktif dan mana yang tidak.

### Toggle Tersedia

| Toggle | Keterangan |
|--------|-----------|
| **Daily Summary** | Push ketika digest harian siap |
| **Market News** | Push untuk berita market penting |
| **Calendar Events** | Push untuk event ekonomi yang akan datang |
| **Price Anomaly** | Push ketika ada pergerakan harga tidak biasa |
| **Weekly Recap** | Push ringkasan performa mingguan |
| **Signal Flip** | Push ketika sinyal analisa berubah arah |
| **Dormancy Nudge** | Push pengingat kalau kamu tidak aktif |
| **Broadcast** | Push pengumuman dari Tim Trade Pilot |

Tap toggle untuk aktifkan/nonaktifkan masing-masing kategori.

---

## 13.5 Guardrail Notifications 🛡️

**Apa itu:** Notifikasi peringatan yang dikirim Trade Pilot ketika AI mendeteksi kamu mungkin sedang dalam kondisi mental atau market yang berisiko untuk trading.

| Guardrail | Kapan Terpicu |
|-----------|--------------|
| **Revenge Trading** | Kamu buat analisa/trade banyak dalam waktu singkat setelah loss — pola revenge terdeteksi |
| **Overtrading** | Jumlah analisa atau trade hari ini melebihi batas yang sehat |
| **High Risk Window** | Kondisi market sedang sangat volatile — risk lebih tinggi dari biasanya |
| **Cooling Off** | Setelah beberapa loss berturut-turut, sistem menyarankan jeda |

### Toggle Guardrail

Di bagian **"Guardrail"**, kamu bisa aktifkan/nonaktifkan setiap guardrail:

| Toggle | Keterangan |
|--------|-----------|
| **Guardrail Revenge** | Aktifkan deteksi dan peringatan revenge trading |
| **Guardrail Overtrading** | Aktifkan peringatan overtrading |
| **Guardrail High Risk** | Aktifkan peringatan window berisiko tinggi |
| **Cooling Off Enabled** | Aktifkan periode jeda otomatis setelah multiple loss |

> 💡 Sangat direkomendasikan untuk mengaktifkan semua guardrail, terutama Revenge dan Overtrading — dua pola yang paling sering menghancurkan akun trader pemula.

---

## 13.6 Pengaturan Daily Digest

Atur kapan kamu ingin menerima ringkasan harian:

| Pengaturan | Keterangan |
|-----------|-----------|
| **Toggle On/Off** | Aktifkan atau nonaktifkan daily digest |
| **Jam Pengiriman** | Ketik jam dalam format HH:MM (contoh: `07:00`) |
| **Timezone** | Pilih timezone kamu dari daftar dropdown |

### Timezone yang Tersedia (sebagian)
- Asia/Jakarta (WIB, UTC+7)
- Asia/Makassar (WITA, UTC+8)
- Asia/Jayapura (WIT, UTC+9)
- Asia/Singapore (SGT, UTC+8)
- Europe/London (GMT/BST)
- America/New_York (EST/EDT)
- Dan banyak lainnya

Setelah mengubah setting, tap **"Simpan"**.

---

## 13.7 Market Session Reminders (Pengingat Sesi Trading)

Aktifkan pengingat untuk sesi trading utama:

| Sesi | Waktu (UTC) | Waktu WIB |
|------|-------------|-----------|
| **Tokyo** | 00:00 – 09:00 UTC | 07:00 – 16:00 WIB |
| **London** | 07:00 – 16:00 UTC | 14:00 – 23:00 WIB |
| **New York** | 12:00 – 21:00 UTC | 19:00 – 04:00 WIB |

Toggle masing-masing untuk mengaktifkan/nonaktifkan pengingat saat sesi trading tersebut dimulai.

---

## 13.8 Push Expiry

Preferensi **Push Expiry** mengatur berapa lama push notification aktif sebelum "kadaluarsa" jika tidak terkirim (misal: HP kamu offline).

Pilihan:
- 1 jam
- 6 jam
- 24 jam (default)
- 7 hari

Untuk price alert yang time-sensitive, pilih expiry lebih pendek (1–6 jam) supaya alert yang sudah lewat waktunya tidak muncul terlambat.
