-- ============================================================================
-- MIGRASI 004 — Audit Log, Laporan Keuangan, Views, Seed Data
-- (sumber: state.activities & renderReportsView app.js)
-- ============================================================================

CREATE TABLE IF NOT EXISTS activity_logs (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NULL,        -- NULL jika aksi sistem/pelanggan
    entity_type ENUM('TENT','RENTAL','PAYMENT','ADDON','USER') NOT NULL,
    entity_id   BIGINT UNSIGNED NULL,
    action      VARCHAR(60) NOT NULL,        -- 'CREATE_TENT','TOGGLE_STATUS','DELETE_TENT','VERIFY_DP','MARK_PAID','RETURN_UNIT'
    title       VARCHAR(150) NOT NULL,       -- 'DP Terverifikasi — Fajar Kurniawan'
    description VARCHAR(255) NULL,
    metadata    JSON NULL,                   -- payload detail (before/after)
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_log_entity (entity_type, entity_id),
    INDEX idx_log_time (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Snapshot periode agar laporan historis stabil meski transaksi diubah/hapus.
CREATE TABLE IF NOT EXISTS financial_reports (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    period_year      SMALLINT UNSIGNED NOT NULL,           -- 2026
    period_month     TINYINT UNSIGNED  NOT NULL,           -- 11 (November)
    gross_revenue    DECIMAL(14,2) NOT NULL DEFAULT 0,     -- total nilai seluruh pesanan
    dp_collected     DECIMAL(14,2) NOT NULL DEFAULT 0,     -- DP terverifikasi masuk
    settled_amount   DECIMAL(14,2) NOT NULL DEFAULT 0,     -- pelunasan masuk
    outstanding_debt DECIMAL(14,2) NOT NULL DEFAULT 0,     -- sisa piutang pelanggan
    order_count      INT UNSIGNED    NOT NULL DEFAULT 0,
    generated_by     BIGINT UNSIGNED NULL,
    generated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_report_user FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY uq_report_period (period_year, period_month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- VIEWS — menggantikan perhitungan manual di JS (field `rented` yang rawan tidak konsisten)
-- ----------------------------------------------------------------------------

-- Stok siap sewa real-time per tenda:
-- unit aktif = rentals yang belum SELESAI/DIBATALKAN dan range tanggalnya mencakup hari ini
CREATE OR REPLACE VIEW v_tent_availability AS
SELECT
    t.id,
    t.code,
    t.name,
    t.price_per_day,
    t.total_stock,
    t.status,
    COALESCE(SUM(CASE
        WHEN r.status NOT IN ('DIBATALKAN','SELESAI')
         AND CURDATE() >= r.check_in_date AND CURDATE() < r.check_out_date
        THEN r.quantity ELSE 0 END), 0) AS rented_units,
    (t.total_stock - COALESCE(SUM(CASE
        WHEN r.status NOT IN ('DIBATALKAN','SELESAI')
         AND CURDATE() >= r.check_in_date AND CURDATE() < r.check_out_date
        THEN r.quantity ELSE 0 END), 0)) AS available_units
FROM tents t
LEFT JOIN rentals r ON r.tent_id = t.id
WHERE t.deleted_at IS NULL
GROUP BY t.id, t.code, t.name, t.price_per_day, t.total_stock, t.status;

-- Tabel verifikasi DP panel admin (invoice + customer + tenda + bukti):
CREATE OR REPLACE VIEW v_rental_summary AS
SELECT
    r.id,
    r.invoice_code,
    cu.name            AS customer_name,
    cu.phone           AS customer_phone,
    t.name             AS tent_name,
    t.code             AS tent_code,
    r.quantity,
    r.nights,
    r.check_in_date,
    r.check_out_date,
    r.total_amount,
    r.paid_amount,
    r.remaining_amount,
    r.status,
    r.stage,
    pp.method          AS payment_method,
    pp.sender_name,
    r.created_at
FROM rentals r
JOIN customers cu ON cu.id = r.customer_id
JOIN tents t      ON t.id  = r.tent_id
LEFT JOIN payment_proofs pp ON pp.rental_id = r.id
ORDER BY r.created_at DESC;

-- ----------------------------------------------------------------------------
-- SEED DATA (mengikuti data demo di kode)
-- ----------------------------------------------------------------------------
INSERT INTO roles (name, description) VALUES
  ('super_admin', 'Akses penuh portal admin'),
  ('admin',       'Kelola katalog, pesanan, laporan'),
  ('kasir',       'Transaksi & pembayaran di kasir'),
  ('gudang',      'Stok & perawatan unit');

INSERT INTO categories (name, min_people, max_people) VALUES
  ('2 Orang', 1, 2),
  ('4 Orang', 3, 4),
  ('6-8 Orang Keluarga', 6, 8),
  ('8-10 Orang', 8, 10),
  ('alat', NULL, NULL),
  ('glamping', NULL, NULL);

INSERT INTO tents (code, category_id, name, description, price_per_day, total_stock, status, svg_preset) VALUES
  ('TND-001', 2, 'Tenda Dome Borneo 4P Double Layer',
   'Tenda favorit untuk camping di bukit dan danau Alahan Panjang. Lapisan ganda menahan dingin malam dan hujan deras.', 65000, 6, 'Tersedia', 'dome4'),
  ('TND-002', 1, 'Tenda Guardian 2P Ultralight Pro',
   'Pilihan ringkas dan ringan untuk solo camper atau berdua. Mudah didirikan dalam 5 menit.', 45000, 8, 'Tersedia', 'ultralight2'),
  ('TND-003', 3, 'Tenda Keluarga Arpenaz 6.3 XL',
   'Tenda keluarga berkapasitas besar dengan tinggi kabin 195 cm, 2 kamar terpisah.', 135000, 4, 'Tersedia', 'family6'),
  ('TND-004', 4, 'Tenda Pleton Regu Camping 10P',
   'Tenda kapasitas rombongan besar dengan bahan terpal tebal anti-badai dan tiang besi galvanis.', 175000, 2, 'Tersedia', 'dome4');

INSERT INTO tags (name) VALUES
  ('Double Layer'), ('Waterproof 3000mm'), ('Free Matras & Pasak'),
  ('Frame Alloy Kokoh'), ('Teras Luas'), ('Anti Badai & Embun'), ('Ringan & Praktis');

INSERT INTO tent_tags (tent_id, tag_id) VALUES
  (1,1),(1,2),(1,3), (2,4),(2,2),(2,7), (3,5),(3,1),(3,3), (4,1),(4,2);

INSERT INTO addons (code, name, price_per_day, total_stock) VALUES
  ('matras',  'Matras Spons',            10000, 30),
  ('sb',      'Sleeping Bag',            15000, 20),
  ('kompor',  'Kompor Portable + Gas',   25000, 10);

INSERT INTO customers (name, phone, email) VALUES
  ('Rizky Pratama',      '081267449910', 'rizky.pratama@gmail.com'),
  ('Nadia Putri Rahma',  '085274113028', 'nadia.putri@gmail.com'),
  ('Fajar Kurniawan',    '081363901182', 'fajar.kurniawan@gmail.com'),
  ('Siti Aisyah',        '082170885421', 'siti.aisyah@gmail.com');

INSERT INTO rentals (invoice_code, customer_id, tent_id, quantity, check_in_date, check_out_date,
                     base_cost, total_amount, payment_scheme, paid_amount, remaining_amount, status, stage) VALUES
  ('INV-2611-01', 1, 1, 2, '2026-11-15', '2026-11-17', 260000, 260000, 'dp',   130000, 130000, 'MENUNGGU_VERIFIKASI_DP', 0),
  ('INV-2611-02', 2, 3, 1, '2026-11-16', '2026-11-18', 270000, 270000, 'dp',   135000, 135000, 'MENUNGGU_VERIFIKASI_DP', 0),
  ('INV-2611-03', 3, 2, 3, '2026-11-14', '2026-11-15', 135000, 135000, 'dp',    67500,  67500, 'DP_TERVERIFIKASI',       1),
  ('INV-2611-04', 4, 1, 1, '2026-11-12', '2026-11-15', 195000, 195000, 'full', 195000,      0, 'LUNAS',                  3);

-- Down migration:
-- DROP VIEW IF EXISTS v_rental_summary, v_tent_availability;
-- DROP TABLE IF EXISTS financial_reports, activity_logs;
