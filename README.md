# Dewantara — Deteksi Alfabet Bahasa Isyarat Real-Time untuk Anak Tunarungu

**Dewantara** adalah aplikasi web edukasi berbasis kecerdasan buatan yang membantu anak tunarungu mempelajari **Abjad Bahasa Isyarat Indonesia (BISINDO)** secara mandiri. Cukup dengan kamera perangkat, sistem mengenali gerakan tangan dan memberi umpan balik hampir seketika, tanpa perangkat tambahan dan tanpa biaya.

> **Innovillage 2025** · Kategori *Social Project*
> Program yang diselenggarakan oleh **PT Telkom Indonesia** bekerja sama dengan **Telkom University**.
> Mendukung **SDG 4 (Quality Education)** dan **SDG 10 (Reduced Inequalities)**.
>
> 🌐 Situs: [https://www.dewantara.cloud](https://www.dewantara.cloud)

---

![Hero Dewantara](frontend/public/asetreadme/dewantara2.png)

## Daftar Isi

- [Latar Belakang](#latar-belakang)
- [Deskripsi Proyek](#deskripsi-proyek)
- [Fitur Utama](#fitur-utama)
- [Aturan Permainan (Mulai Belajar)](#aturan-permainan-mulai-belajar)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Struktur Proyek](#struktur-proyek)
- [Halaman dan Rute](#halaman-dan-rute)
- [Prasyarat](#prasyarat)
- [Cara Menjalankan](#cara-menjalankan)
- [Variabel Lingkungan](#variabel-lingkungan)
- [Deployment](#deployment)
- [Pemecahan Masalah](#pemecahan-masalah)
- [Tim Pengembang](#tim-pengembang)

---

## Latar Belakang

Akses pendidikan khusus bagi anak tunarungu masih timpang, terutama di wilayah yang jauh dari Sekolah Luar Biasa (SLB). Dewantara hadir untuk menjawab tiga tantangan nyata berikut:

| Masalah | Penjelasan |
|---|---|
| **Literasi terbatas** | Anak tunarungu di wilayah terpencil kesulitan mengakses materi pembelajaran bahasa isyarat yang berkualitas. |
| **Jarak dari SLB** | Daerah yang jauh dari SLB membatasi akses pendidikan khusus. |
| **Hambatan komunikasi** | Kurangnya pengetahuan bahasa isyarat menciptakan kesenjangan komunikasi antara anak tunarungu dan lingkungan sekitar. |

**Visi:** menciptakan dunia di mana setiap anak, termasuk yang tunarungu di wilayah terpencil, dapat mengakses pendidikan berkualitas melalui teknologi AI.

**Misi:**

1. Menyediakan platform deteksi alfabet bahasa isyarat real-time yang gratis dan mudah diakses.
2. Memberikan umpan balik pembelajaran instan menggunakan AI (MediaPipe dan model klasifikasi Random Forest).
3. Menjangkau anak tunarungu di wilayah terpencil.
4. Meningkatkan literasi dan komunikasi untuk mengatasi hambatan pendidikan inklusif.

---

## Deskripsi Proyek

Dengan memanfaatkan *computer vision* dan *machine learning*, Dewantara mendeteksi gerakan tangan pengguna melalui webcam dan menerjemahkannya menjadi huruf abjad BISINDO. Frame kamera dikirim ke server lewat WebSocket, dianalisis dengan MediaPipe Hands, lalu diklasifikasikan oleh model yang telah dilatih.

Dewantara dikembangkan dari proyek sebelumnya, **Bvision**, dengan antarmuka baru, mode belajar bergamifikasi, dan fokus pada pendidikan inklusif.

---

## Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **Mulai Belajar** | Petualangan belajar bergamifikasi: lima level bertema pulau, sistem bintang, XP, dan *streak* harian. Pemain memeragakan huruf satu per satu dan mendapat umpan balik langsung. |
| **Gerakan Bebas** | Mode praktik tanpa batas: arahkan tangan ke kamera dan huruf yang diperagakan ditampilkan secara real-time. |
| **Kamus BISINDO** | Referensi visual untuk abjad, angka, dan kosakata sehari-hari dilengkapi gambar dan video. |
| **Tentang Dewantara** | Latar belakang masalah, visi, dan misi proyek. |
| **Responsif** | Tampilan menyesuaikan perangkat desktop maupun mobile. |
| **Gratis dan mandiri** | Tanpa akun, tanpa biaya; progres belajar tersimpan di peramban. |

---

## Aturan Permainan (Mulai Belajar)

Halaman **Mulai Belajar** berupa peta dengan lima level. Level berikutnya terbuka setelah level sebelumnya meraih minimal 1 bintang.

| Level | Huruf |
|---|---|
| 🌴 Pulau Awal | A – E |
| 🌲 Hutan Misteri | F – J |
| ⛰️ Gunung Tantangan | K – O |
| ⚡ Lembah Petir | P – T |
| 🏆 Puncak Kejayaan | U – Z |

Aturan di dalam level:

- Pemain memeragakan huruf yang diminta, berurutan dari huruf pertama sampai terakhir level.
- Huruf dianggap **benar** bila terbaca **2 kali berturut-turut** (± 0,8 detik) agar satu frame yang kebetulan tepat tidak langsung meloloskan.
- Satu **kesalahan** dihitung bila huruf lain terbaca **3 kali berturut-turut**.
- Setiap huruf benar memberi **+10 XP**. Saat level selesai, bonus **10 XP × jumlah bintang**.
- Bintang: **0–1 kesalahan = 3 bintang**, **2–4 kesalahan = 2 bintang**, **5 atau lebih = 1 bintang**. Total maksimal **15 bintang** (5 level × 3).
- *Streak* bertambah bila pengguna aktif pada hari berurutan.
- Progres (XP, bintang, streak) disimpan di `localStorage` peramban dengan kunci `dewantara-progress-v1`. Menghapus data peramban akan mengatur ulang progres.

Konstanta aturan ini ada di bagian atas `frontend/src/components/LevelPlay.js`, daftar level di `frontend/src/data/levels.js`.

---

## Teknologi yang Digunakan

### Backend

| Teknologi | Versi | Kegunaan |
|---|---|---|
| Python | 3.12 | Bahasa pemrograman utama |
| FastAPI | ≥ 0.141 | Framework web dan WebSocket server |
| MediaPipe | 0.10.21 | Deteksi dan pelacakan landmark tangan |
| Scikit-learn | 1.7.2 | Model klasifikasi abjad (Random Forest) |
| OpenCV (headless) | 4.10.0 | Pemrosesan gambar dari frame kamera |
| Uvicorn | ≥ 0.52 | ASGI server |
| joblib | ≥ 1.5 | Memuat model `.pkl` yang telah dilatih |

### Frontend

| Teknologi | Versi | Kegunaan |
|---|---|---|
| React | 19 | Library antarmuka pengguna |
| React Router DOM | 7 | Navigasi halaman (SPA) |
| WebSocket API | (native browser) | Komunikasi real-time ke backend |
| MediaDevices API | (native browser) | Akses kamera perangkat |
| localStorage | (native browser) | Penyimpanan progres belajar |

---

## Arsitektur Sistem

```
┌──────────────────────────────────────────────┐
│                  Browser                      │
│                                               │
│  Webcam → <video> → Canvas → JPEG blob        │
│       │         (useHandDetection)            │
│       └──── WebSocket (ws://.../ws) ──────────┤
└──────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│              FastAPI Backend                  │
│                                               │
│  receive_bytes()                              │
│       ↓                                       │
│  OpenCV decode → RGB frame                    │
│       ↓                                       │
│  MediaPipe Hands → 21 landmark × 2 tangan     │
│       ↓                                       │
│  84 fitur (x, y) + padding                    │
│       ↓                                       │
│  StandardScaler → model.predict()             │
│       ↓                                       │
│  send_text(huruf)                             │
└──────────────────────────────────────────────┘
```

Frame kamera dikirim setiap **400 ms** via WebSocket sebagai JPEG blob (kualitas 50%). Backend membalas dengan satu karakter huruf hasil prediksi, atau `"Tidak Terdeteksi"` jika tangan tidak ditemukan. Logika kamera dan WebSocket di frontend dipusatkan di *hook* `useHandDetection` dan dipakai bersama oleh halaman Gerakan Bebas dan Mulai Belajar.

---

## Struktur Proyek

```
dewantara/
├── backend/
│   ├── main.py               # Entry point — FastAPI + WebSocket endpoint
│   ├── main2.py              # Versi eksperimen (model alternatif)
│   ├── models/
│   │   ├── model_new.pkl     # Model klasifikasi abjad (aktif)
│   │   └── scaler_new.pkl    # StandardScaler untuk model aktif
│   ├── Dockerfile
│   ├── nixpacks.toml         # Konfigurasi deployment Railway
│   └── pyproject.toml
│
└── frontend/
    ├── public/
    │   └── asetreadme/       # Gambar untuk README
    └── src/
        ├── App.js            # Definisi rute
        ├── pages/
        │   ├── BerandaPage.js            # Beranda (hero, keunggulan, SDG, CTA)
        │   ├── TentangKamiPage.js        # Tentang Dewantara (visi, misi, masalah)
        │   ├── BelajarPage.js            # Mulai Belajar — peta petualangan
        │   ├── GerakanBebasPage.js       # Gerakan Bebas — praktik bebas
        │   ├── KamusPage.js              # Kamus visual BISINDO
        │   ├── HubungiKamiPage.js        # Kontak
        │   ├── ArtikelPage.js            # Daftar artikel (di luar navigasi utama)
        │   ├── ArticleDetailPage.js      # Detail artikel
        │   ├── TentangBisindoPage.js     # Penjelasan BISINDO
        │   └── *.dewantara.css           # Gaya tiap halaman
        ├── components/
        │   ├── Navbar.js / Navbar.css    # Navigasi + skala ukuran global
        │   ├── Footer.js / Footer.css
        │   ├── CameraCard.js / .css      # Kartu kamera bersama (video, bingkai, tombol)
        │   └── LevelPlay.js              # Permainan satu level (huruf, XP, bintang)
        ├── hooks/
        │   ├── useHandDetection.js       # Kamera + WebSocket + prediksi
        │   └── useGameProgress.js        # XP, bintang, streak (localStorage)
        └── data/
            ├── levels.js                 # Daftar level dan huruf
            ├── dictionaryData.js         # Data kamus (abjad, angka, kosakata)
            └── articles.js               # Data konten artikel
```

---

## Halaman dan Rute

| Rute | Halaman | Keterangan |
|---|---|---|
| `/` | Beranda | Pengenalan, keunggulan, dan dukungan SDG |
| `/tentang-kami` | Tentang Dewantara | Visi, misi, dan masalah yang diatasi |
| `/belajar` | Mulai Belajar | Peta level bergamifikasi |
| `/gerakan-bebas` | Gerakan Bebas | Deteksi huruf tanpa batas |
| `/kamus` | Kamus | Referensi visual BISINDO |
| `/hubungi-kami` | Hubungi | Kontak |
| `/artikel`, `/tentang-bisindo` | Halaman tambahan | Tidak ada di navigasi utama |

Pastikan semua rute terdaftar di `App.js`, termasuk `/gerakan-bebas`:

```jsx
import GerakanBebasPage from "./pages/GerakanBebasPage";

<Route path="/gerakan-bebas" element={<GerakanBebasPage />} />
```

---

## Prasyarat

Pastikan perangkat Anda telah menginstal:

- **Python** 3.12+
- **uv** (package manager Python) atau `pip` biasa
- **Node.js** 18+ dan **npm**
- Webcam (kamera depan/belakang)
- Browser modern (Chrome, Firefox, Edge)

---

## Cara Menjalankan

### 1. Clone Repositori

```bash
git clone <url-repositori>
cd dewantara
```

### 2. Jalankan Backend

```bash
cd backend
```

**Menggunakan `uv` (direkomendasikan):**

```bash
uv sync
uv run uvicorn main:app --host 0.0.0.0 --port 8000
```

**Menggunakan `pip` + `venv`:**

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt  # atau: pip install .
uvicorn main:app --host 0.0.0.0 --port 8000
```

Backend berjalan di `http://localhost:8000`. WebSocket tersedia di `ws://localhost:8000/ws`.

> **Catatan:** Backend membutuhkan pustaka sistem `libgl1` dan `libglib2.0-0` untuk OpenCV. Di Ubuntu/Debian jalankan `sudo apt-get install libgl1 libglib2.0-0`.

### 3. Jalankan Frontend

Buka terminal baru:

```bash
cd frontend
npm install
npm start
```

Aplikasi terbuka otomatis di `http://localhost:3000`.

### 4. Penggunaan Aplikasi

**Gerakan Bebas**

1. Buka menu **Gerakan Bebas**.
2. Klik tombol kamera berwarna merah dan izinkan akses kamera saat diminta peramban.
3. Letakkan tangan di dalam bingkai putus-putus lalu peragakan huruf BISINDO. Hasil prediksi tampil di bawah kartu kamera.
4. Klik tombol kamera lagi untuk mematikan kamera. Tombol **⇄ Cermin** membalik tampilan kamera (hanya pratinjau).

**Mulai Belajar**

1. Buka menu **Mulai Belajar** dan pilih level yang terbuka (hijau).
2. Nyalakan kamera, lalu peragakan huruf yang ditampilkan satu per satu.
3. Selesaikan semua huruf untuk mendapatkan bintang dan XP, lalu lanjut ke level berikutnya.

---

## Variabel Lingkungan

### Frontend

Buat file `.env` di folder `frontend/` jika ingin mengganti URL backend (misalnya saat deploy):

```
REACT_APP_WS_URL=wss://domain-backend-anda.com/ws
```

Jika variabel ini tidak diset, frontend terhubung ke `ws://localhost:8000/ws` secara default.

### Opsi di kode

| Lokasi | Opsi | Fungsi |
|---|---|---|
| `frontend/src/hooks/useHandDetection.js` | `MIRROR_SENT_FRAMES` | Balik frame yang **dikirim ke backend** secara horizontal. Aktifkan hanya bila webcam memantulkan gambar dan model dilatih dengan gambar tidak terbalik. Default `false`. |
| `frontend/src/hooks/useHandDetection.js` | `FRAME_INTERVAL_MS`, `JPEG_QUALITY` | Interval pengiriman frame (400 ms) dan kualitas JPEG (0,5). |
| `frontend/src/components/Navbar.css` | `clamp(14px, 0.5vw + 7px, 16px)` | Ukuran dasar huruf di desktop; semua ukuran `rem` mengikutinya. |

---

## Deployment

### Backend (Railway / Docker)

Proyek menyertakan `Dockerfile` dan `nixpacks.toml` untuk deployment di [Railway](https://railway.app).

```bash
# Build Docker image secara lokal
cd backend
docker build -t dewantara-backend .
docker run -p 8000:8000 dewantara-backend
```

### Frontend (Vercel / Netlify / Static Hosting)

```bash
cd frontend
npm run build
```

Folder `build/` yang dihasilkan dapat di-deploy ke layanan hosting statis mana pun. Pastikan:

- `REACT_APP_WS_URL` diset ke URL backend produksi **sebelum** build.
- Situs dan backend memakai **HTTPS/WSS**. Peramban hanya mengizinkan akses kamera di koneksi aman (kecuali `localhost`), dan halaman HTTPS tidak boleh memakai WebSocket `ws://` biasa.
- Hosting menangani rute SPA, yaitu semua jalur (misalnya `/gerakan-bebas`) diarahkan ke `index.html`.

---

## Pemecahan Masalah

| Gejala | Kemungkinan penyebab dan solusi |
|---|---|
| "Tidak dapat mengakses kamera" | Izin kamera ditolak atau kamera dipakai aplikasi lain. Izinkan akses di pengaturan situs peramban dan tutup aplikasi lain yang memakai kamera. |
| "Koneksi ke server gagal" | Backend belum berjalan atau `REACT_APP_WS_URL` salah. Pastikan backend aktif di port 8000 dan restart frontend setelah mengubah `.env`. |
| Prediksi selalu "Tidak Terdeteksi" | Tangan di luar bingkai, pencahayaan kurang, atau latar terlalu ramai. Dekatkan tangan dan perbaiki cahaya. |
| Tampilan kamera terbalik | Klik tombol **⇄ Cermin**. Jika webcam memantulkan gambar dan akurasi turun, lihat opsi `MIRROR_SENT_FRAMES`. |
| Halaman tampil tanpa gaya atau menyempit | Pastikan file `*.dewantara.css` ada di `src/pages/` dan tidak ada aturan global `display: flex` pada `body`, `#root`, atau pembungkus rute di `App.js`/`App.css`. |
| Progres belajar hilang | Progres tersimpan di `localStorage`; menghapus data peramban atau memakai mode penyamaran akan mengatur ulang progres. |

---

## Tim Pengembang

Proyek **Dewantara** dikembangkan dalam program **Innovillage 2025** (PT Telkom Indonesia × Telkom University).

<!-- TODO: lengkapi daftar anggota tim, peran, dan dosen pembimbing -->

| Nama | Peran |
|---|---|
| **Abrar Wahid** | Ketua Tim — [GitHub](https://github.com/abrarwahidd) |
| **Wildan Zhilal Manafi** | Anggota 1 — [GitHub](https://github.com/wildannzm) |
| **Ibnu Restu Pamungkas** | Anggota 2 — [GitHub](https://github.com/ibnurs) |
| **Ade Bastian, S.T., M.Kom.** | Dosen Pembimbing — [GitHub](https://github.com/ibnurs) |

---

*Dewantara — Mendukung SDG 4 & 10 untuk Pendidikan Inklusif.*