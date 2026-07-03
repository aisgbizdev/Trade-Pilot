# 12 — Alerts (Price Alerts)

Price Alert adalah fitur untuk mendapatkan notifikasi otomatis ketika harga instrumen menyentuh level tertentu yang kamu tentukan — sangat berguna agar kamu tidak perlu terus-terusan pantau layar.

---

## 12.1 Cara Set Alert Baru

Ada dua cara membuat price alert:

### Cara 1 — Dari Halaman Analyze
1. Pilih instrumen di halaman **Analyze**
2. Tap tombol **"Set Alert"** (ikon 🔔) di sebelah tombol submit
3. Dialog Set Alert terbuka

### Cara 2 — Dari Halaman Analysis Detail
1. Buka analisa yang ingin kamu set alert-nya
2. Tap toggle **Alert ON/OFF** di area Trade Plan Card
3. Aktifkan untuk arm alert di semua level analisa sekaligus

---

## 12.2 Dialog Set Alert — Field yang Diisi

| Field | Keterangan |
|-------|-----------|
| **Instrumen** | Sudah otomatis terisi sesuai instrumen yang dipilih (tidak bisa diubah di dialog ini) |
| **Target Price** | Harga yang ingin kamu pantau. Otomatis terisi dengan harga live saat ini sebagai titik awal |
| **Arah** | **"Di atas"** = alert terpicu kalau harga naik ke/melewati target. **"Di bawah"** = alert terpicu kalau harga turun ke/melewati target |
| **Catatan** | Label opsional untuk alert ini (maks 200 karakter). Misal: "Entry Buy Gold", "Support area" |

### Cara Isi dan Submit
1. Ubah angka di **Target Price** ke level yang kamu inginkan
2. Pilih arah: **"Di Atas"** atau **"Di Bawah"**
3. (Opsional) Tambahkan catatan
4. Tap **"Simpan Alert"**
5. Alert tersimpan dan aktif

> ⚠️ Kamu perlu mengaktifkan **push notification** di browser agar alert terkirim ke HP. Kalau push tidak aktif, alert tetap tercatat tapi notifikasinya hanya muncul saat kamu membuka app.

---

## 12.3 Halaman My Alerts — Kelola Alert Aktif

Tap **"My Alerts"** dari navigation atau profil untuk melihat semua price alert yang aktif.

### Tampilan Setiap Alert

| Info | Keterangan |
|------|-----------|
| **Instrumen** | Nama aset yang dipantau |
| **Target** | Harga target yang ditetapkan |
| **Arah** | Di atas / Di bawah |
| **Catatan** | Label yang kamu set (kalau ada) |
| **Dibuat** | Berapa lama yang lalu alert dibuat |
| **Arah Ikon** | 📈 (atas) atau 📉 (bawah) |

---

## 12.4 Hapus Alert

1. Di halaman **My Alerts**, tap ikon 🗑️ di sebelah alert yang ingin dihapus
2. Konfirmasi penghapusan
3. Alert langsung dihapus dan tidak akan terpicu lagi

---

## 12.5 Kapan Alert Terpicu?

Alert terpicu ketika:
- Untuk **"Di Atas"**: harga live instrumen **menyentuh atau melewati** angka target dari bawah
- Untuk **"Di Bawah"**: harga live instrumen **menyentuh atau melewati** angka target dari atas

Sistem mengecek harga setiap beberapa detik. Ketika terpicu:
- **Push notification** muncul di HP (kalau push sudah aktif)
- **Notifikasi in-app** muncul di halaman Notifikasi

Alert **tidak otomatis dihapus** setelah terpicu — kamu harus hapus manual kalau sudah tidak diperlukan.

---

## 12.6 Alert dari Analysis Detail (Alert Toggle)

Di halaman Analysis Detail ada toggle **Alert ON/OFF** di Trade Plan Card:

- **ON** = sistem mengawasi level-level dari analisa ini (entry zone, SL, TP)
- **OFF** = tidak ada monitoring untuk analisa ini

Ini lebih cepat dari set manual — satu toggle mengaktifkan semua level analisa sekaligus.

---

## 12.7 Aktifkan Push Notification untuk Alert

Agar alert benar-benar terkirim ke HP, push notification harus aktif:

1. Buka halaman **Notifikasi**
2. Di bagian **Push Notification**, tap **"Aktifkan"**
3. Browser meminta izin → tap **"Allow"** / **"Izinkan"**
4. Uji dengan tap **"Kirim Test Push"** — kamu harusnya terima notifikasi dalam beberapa detik

Lihat panduan lengkap di [13 — Notifications →](./13-notifications.md).

---

## 12.8 Tips Penggunaan Alerts

- Set alert di **level support/resistance** kunci dari analisa untuk mendapat notifikasi saat harga mendekati area entry potensial
- Kombinasikan dengan catatan untuk ingat konteks: "SL Gold buy setup 4h"
- Hapus alert yang sudah tidak relevan supaya halaman My Alerts tetap bersih
- Kalau kamu set alert "Di Atas" untuk level resistance, siap-siap analisa ulang saat terpicu — bisa breakout atau false break
