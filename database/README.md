# Panduan Database — Teduh Alam (teduhalam.id)

Rancangan database standar industri untuk sistem penyewaan tenda Basecamp Alahan Panjang,
dianalisis langsung dari kode: `Index.html` + `assets/js/landing.js`, `HalPemesanan.html`,
`admin.html` + `assets/js/app.js`, dan `login.html`.

## Struktur Folder

```
database/
├── README.md                  ← panduan ini
├── schema.sql                 ← skrip lengkap siap jalan (DDL + views + seed)
├── erd.md                     ← diagram ERD (Mermaid) + relasi + lifecycle status
└── migrations/
    ├── 001_create_roles_and_users.sql      (roles, users)
    ├── 002_create_catalog.sql              (categories, tents, tags, tent_tags, tent_galleries, addons)
    ├── 003_create_transactions.sql         (customers, rentals, rental_addons, payment_proofs, payments)
    └── 004_create_logs_reports_views.sql   (activity_logs, financial_reports, views, seed data)

backend/
├── config/Database.php        ← koneksi PDO MySQL (singleton + helper transaksi)
├── config/.env.example        ← template kredensial (jangan commit .env asli)
└── migrate.php                ← runner migrasi CLI
```

## Cara Install (MySQL 8.x / MariaDB 10.5+)

### Opsi A — Skrip sekali jalan (paling cepat)
```bash
mysql -u root -p < database/schema.sql
```

### Opsi B — Migrasi bertahap (disarankan untuk produksi)
```bash
# buat database dulu
mysql -u root -p -e "CREATE DATABASE teduh_alam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# jalankan lewat runner PHP (butuh PHP 8+ & ekstensi pdo_mysql)
export DB_HOST=127.0.0.1 DB_NAME=teduh_alam DB_USER=root DB_PASS=rahasia
php backend/migrate.php            # up semua migrasi yang belum berjalan
php backend/migrate.php --status   # lihat status tiap migrasi
```

Atau manual tanpa PHP:
```bash
for f in database/migrations/*.sql; do mysql -u root -p teduh_alam < "$f"; done
```

## Daftar Tabel (15 tabel + 2 view)

| # | Tabel | Fungsi | Sumber di kode |
|---|-------|--------|----------------|
| 1 | `roles` | Level akses portal admin | login.html |
| 2 | `users` | Admin/kasir/gudang; password & PIN **di-hash** | login.html |
| 3 | `categories` | Kategori kapasitas tenda | filter katalog landing.js |
| 4 | `tents` | Master unit tenda + harga/malam + stok + soft delete | state.tents app.js, TENT_UNITS |
| 5 | `tags` | Fitur tenda (Double Layer, Waterproof 3000mm…) | array tags[] |
| 6 | `tent_tags` | Junction M:N tenda ↔ tag | tags[] per tenda |
| 7 | `tent_galleries` | Multi-foto per tenda (4 label galeri) | array gallery[] |
| 8 | `addons` | Matras/sleeping bag/kompor per malam | ADDON_ITEMS |
| 9 | `customers` | Data penyewa (nama/telp/email) | form submitBookingOrder |
| 10 | `rentals` | Transaksi inti: invoice, tanggal, DP/lunas, status lifecycle | orders app.js + booking TDA-xxxx |
| 11 | `rental_addons` | Item add-on per transaksi + snapshot harga | addonCounts |
| 12 | `payment_proofs` | Bukti transfer + verifikasi admin | receiptDataUrl, verifyOrderDP |
| 13 | `payments` | Riwayat bayar: DP → Pelunasan → Refund | markOrderPaid |
| 14 | `activity_logs` | Audit trail dashboard | state.activities |
| 15 | `financial_reports` | Snapshot laporan bulanan (gross/DP/settled/piutang) | renderReportsView |
| V1 | `v_tent_availability` | Stok siap sewa real-time (menggantikan field `rented` manual) | toggleTentStatus/stok |
| V2 | `v_rental_summary` | Tabel daftar pesanan utk panel admin & cek pesanan | renderOrdersView |

## Prinsip Standar Industri yang Diterapkan

1. **Normalisasi 3NF** — master vs transaksi terpisah; M:N via junction table.
2. **InnoDB + FK constraint** — RESTRICT (transaksi terlindungi), CASCADE (data dependen), SET NULL (referensi user di log).
3. **DECIMAL(12,2)** untuk uang — bukan FLOAT; CHECK constraints untuk nilai mustahil.
4. **Price snapshot** di baris transaksi — laporan historis stabil saat tarif berubah.
5. **Generated column** `nights = DATEDIFF(check_out, check_in)` — satu sumber kebenaran.
6. **Soft delete** (`deleted_at`) — histori sewa tidak hilang saat tenda dihapus.
7. **Audit columns** `created_at`/`updated_at` di semua tabel + `activity_logs`.
8. **Indeks sesuai pola query** — status, rentang tanggal (cek bentrok jadwal), FULLTEXT pencarian, agregasi laporan.
9. **Kredensial di-hash** (bcrypt/argon2) — tidak seperti demo plaintext di login.html.
10. **Query anti-bentrok jadwal**:
    ```sql
    SELECT ... FROM rentals
    WHERE tent_id = ? AND status NOT IN ('DIBATALKAN','SELESAI')
      AND check_in_date < :checkout AND check_out_date > :checkin;
    ```

## Contoh Query Utama (padanan fungsi JS)

```sql
-- Dashboard: pesanan menunggu verifikasi DP  (ganti filter dpStatus === 'Menunggu')
SELECT * FROM v_rental_summary WHERE status = 'MENUNGGU_VERIFIKASI_DP';

-- Katalog publik dengan stok hari ini (ganti products landing.js)
SELECT t.*, v.available_units
FROM tents t JOIN v_tent_availability v ON v.id = t.id
WHERE t.is_published = 1 AND t.deleted_at IS NULL;

-- Pencarian fulltext (ganti searchInput filter manual)
SELECT * FROM tents
WHERE deleted_at IS NULL AND MATCH(name, description) AGAINST ('keluarga waterproof');

-- Laporan bulanan (ganti perhitungan gross/dpCollected/settalan di renderReportsView)
SELECT
  SUM(total_amount)                                            AS gross_revenue,
  SUM(CASE WHEN status <> 'MENUNGGU_VERIFIKASI_DP' THEN paid_amount ELSE 0 END) AS dp_collected,
  SUM(remaining_amount)                                        AS outstanding_debt
FROM rentals
WHERE YEAR(created_at) = 2026 AND MONTH(created_at) = 11;

-- Booking baru (transaksi multi-tabel — pakai App\Database::transaction())
INSERT INTO rentals (invoice_code, customer_id, tent_id, quantity, check_in_date, check_out_date,
  base_cost, addon_cost, total_amount, payment_scheme, paid_amount, remaining_amount, pickup_type)
VALUES ('TDA-2026-8841', 1, 1, 2, '2026-12-01', '2026-12-03', 260000, 40000, 300000, 'dp', 150000, 150000, 'antar_danau');
INSERT INTO rental_addons (rental_id, addon_id, quantity, unit_price, nights) VALUES (LAST_INSERT_ID(), 1, 2, 10000, 2);
```
