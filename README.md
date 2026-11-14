# TeduhAlam — Prototype Web

Prototype antarmuka untuk penyewaan perlengkapan camping dan pengelolaan admin. Data katalog dan dashboard masih berupa data contoh di JavaScript, tanpa database.

## Struktur proyek

```text
.
├── Index.html                 # Halaman utama/landing page
├── login.html                 # Form login prototype
├── admin.html                 # Dashboard admin (wajib login)
├── assets/
│   ├── css/
│   │   ├── landing.css        # Gaya landing page
│   │   ├── login.css          # Gaya login
│   │   └── style.css          # Gaya dashboard admin
│   ├── images/
│   │   └── prototypes/        # Gambar rancangan awal
│   └── js/
│       ├── admin-auth.js      # Pemeriksaan sesi dan logout admin
│       ├── app.js             # Interaksi dashboard admin
│       ├── landing.js         # Interaksi landing page
│       └── login.js           # Validasi login prototype
└── README.md
```

## Menjalankan prototype

Jalankan proyek melalui server lokal, misalnya dengan ekstensi Live Server di VS Code, lalu buka halaman `Index.html`. CDN Tailwind CSS, Lucide, Google Fonts, dan gambar katalog memerlukan koneksi internet.

## Login demo admin

- PIN: `250761`
- Kata sandi: `HakimPTI#2026`

Tombol **Isi Data Demo** pada halaman login mengisi kredensial tersebut secara otomatis. Setelah login berhasil, browser membuka `admin.html`. Tombol **Keluar** menghapus sesi dan mengembalikan pengguna ke halaman login.

> Autentikasi ini hanya simulasi sisi-klien untuk prototype. Kredensial tersimpan di kode JavaScript dan sesi menggunakan `sessionStorage`, sehingga mekanisme ini tidak aman untuk produksi. Gunakan backend dan penyimpanan kredensial yang aman sebelum deployment.

## Anggota kelompok

- Muhamad Azizan Hakim (NIM: 25076100)
- Muhammad Sulthan Zaky (NIM: 25076104)
