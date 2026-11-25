-- ============================================================================
-- TEDUH ALAM (teduhalam.id) — RANCANGAN DATABASE STANDAR INDUSTRI
-- Sistem Penyewaan Tenda Basecamp Alahan Panjang
--
-- Sumber analisis kode:
--   - Index.html + assets/js/landing.js  : katalog publik, filter kategori/kapasitas, kalkulator durasi sewa
--   - HalPemesanan.html                  : pemesanan (booking), add-on, skema DP 50% / lunas, bukti transfer,
--                                          e-ticket, pickup basecamp/antar danau, cek pesanan (stage tracking)
--   - admin.html + assets/js/app.js      : panel admin (upload tenda, kelola stok & status, verifikasi DP,
--                                          konfirmasi lunas, log aktivitas, laporan keuangan mingguan/bulanan)
--   - login.html                         : autentikasi portal admin (PIN + password)
--
-- DBMS target   : MySQL 8.x / MariaDB 10.5+ (InnoDB, utf8mb4)
-- Konvensi      : snake_case, PK BIGINT UNSIGNED AUTO_INCREMENT, kode bisnis unik (TND-xxx / INV-xxxx),
--                 audit column created_at/updated_at, soft-delete via deleted_at, FK RESTRICT untuk transaksi.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS teduh_alam
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE teduh_alam;

-- ----------------------------------------------------------------------------
-- 1. USERS & AUTHENTICATION (login.html: PIN + kata sandi portal admin)
-- ----------------------------------------------------------------------------
CREATE TABLE roles (
    id          TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,          -- 'super_admin', 'admin', 'kasir', 'gudang'
    description VARCHAR(255) NULL
) ENGINE=InnoDB;

CREATE TABLE users (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id       TINYINT UNSIGNED NOT NULL,
    full_name     VARCHAR(100)  NOT NULL,
    username      VARCHAR(50)   NOT NULL UNIQUE,
    email         VARCHAR(120)  NOT NULL UNIQUE,
    phone         VARCHAR(20)   NULL,
    password_hash VARCHAR(255)  NOT NULL,              -- bcrypt/argon2, JANGAN simpan plaintext
    pin_hash      VARCHAR(255)  NULL,                  -- PIN 6 digit portal admin (di-hash)
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    last_login_at DATETIME      NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_users_role ON users(role_id);

-- ----------------------------------------------------------------------------
-- 2. MASTER KATALOG PRODUK (state.tents app.js, TENT_UNITS HalPemesanan.html, products landing.js)
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(50) NOT NULL UNIQUE,   -- '2 Orang', '4 Orang', '6-8 Orang Keluarga', '8-10 Orang', 'alat', 'glamping'
    min_people SMALLINT UNSIGNED NULL,        -- untuk filter kapasitas & kalkulator rekomendasi (landing.js)
    max_people SMALLINT UNSIGNED NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE tents (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code           VARCHAR(15)  NOT NULL UNIQUE,        -- 'TND-001' dst (generate: TND- + urutan)
    category_id    INT UNSIGNED NOT NULL,
    name           VARCHAR(150) NOT NULL,
    description    TEXT         NULL,
    price_per_day  DECIMAL(12,2) NOT NULL CHECK (price_per_day >= 0),  -- Rp / unit / malam
    total_stock    SMALLINT UNSIGNED NOT NULL DEFAULT 0 CHECK (total_stock >= 0),
    status         ENUM('Tersedia','Perawatan') NOT NULL DEFAULT 'Tersedia',  -- toggleTentStatus() app.js
    svg_preset     VARCHAR(30)  NULL,                   -- 'dome4' | 'ultralight2' | 'family6' (fallback visual)
    custom_image_url VARCHAR(500) NULL,                 -- foto hasil upload admin
    is_published   BOOLEAN      NOT NULL DEFAULT TRUE,  -- tampil di katalog publik atau tidak
    rating         DECIMAL(2,1) NULL,                   -- 4.9 (produk landing.js)
    badge_label    VARCHAR(50)  NULL,                   -- 'Terpopuler', 'Anti Badai' (landing.js)
    waterproof_spec VARCHAR(50) NULL,                   -- '3000mm', 'IPX4' (landing.js)
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at     TIMESTAMP    NULL,                   -- soft delete (executeDeleteTent app.js)
    CONSTRAINT fk_tents_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_tents_category (category_id),
    INDEX idx_tents_status (status, is_published),
    FULLTEXT INDEX ft_tents_search (name, description)  -- catalogSearch app.js & searchInput landing.js
) ENGINE=InnoDB;

-- Tag/fitur tenda ('Double Layer', 'Waterproof 3000mm', 'Free Matras & Pasak', checklist HalPemesanan.html)
CREATE TABLE tags (
    id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE tent_tags (
    tent_id BIGINT UNSIGNED NOT NULL,
    tag_id  INT UNSIGNED    NOT NULL,
    PRIMARY KEY (tent_id, tag_id),
    CONSTRAINT fk_tt_tent FOREIGN KEY (tent_id) REFERENCES tents(id) ON DELETE CASCADE,
    CONSTRAINT fk_tt_tag  FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE
) ENGINE=InnoDB;

-- Galeri multi-gambar per tenda (array gallery[] label+url pada HalPemesanan.html)
CREATE TABLE tent_galleries (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tent_id    BIGINT UNSIGNED NOT NULL,
    label      VARCHAR(60)  NOT NULL,      -- 'Tampak Depan', 'Interior', 'Detail Jahitan', 'Suasana Malam'
    image_url  VARCHAR(500) NOT NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gallery_tent FOREIGN KEY (tent_id) REFERENCES tents(id) ON DELETE CASCADE,
    INDEX idx_gallery_tent (tent_id, sort_order)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 3. ADD-ON / PERALATAN TAMBAHAN (ADDON_ITEMS: matras, sleeping bag, kompor)
-- ----------------------------------------------------------------------------
CREATE TABLE addons (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code          VARCHAR(20)   NOT NULL UNIQUE,   -- 'matras', 'sb', 'kompor'
    name          VARCHAR(100)  NOT NULL,          -- 'Matras Spons'
    price_per_day DECIMAL(12,2) NOT NULL CHECK (price_per_day >= 0),
    total_stock   SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 4. CUSTOMER (customer, phone, email @gmail.com — submitBookingOrder HalPemesanan.html)
-- ----------------------------------------------------------------------------
CREATE TABLE customers (
    id                       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name                     VARCHAR(100) NOT NULL,
    phone                    VARCHAR(20)  NOT NULL,
    email                    VARCHAR(120) NULL,
    address                  VARCHAR(255) NULL,
    total_orders_count       INT UNSIGNED NOT NULL DEFAULT 0,   -- denormalisasi utk dashboard/CRM
    first_ordered_at         DATETIME     NULL,
    created_at               TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at               TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_customer_phone_email (phone, email)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 5. TRANSAKSI PENYEWAAN (orders app.js + orders localStorage HalPemesanan.html)
-- ----------------------------------------------------------------------------
-- Skema pembayaran: dp = DP 50%, full = lunas 100% (setPaymentScheme)
-- Status lifecycle (gabungan dpStatus + stage tracking):
--   MENUNGGU_VERIFIKASI_DP -> DP_TERVERIFIKASI -> UNIT_SIAP -> LUNAS/SELESAI, atau DIBATALKAN
CREATE TABLE rentals (
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_code      VARCHAR(20)  NOT NULL UNIQUE,   -- 'INV-2611-01' (admin) / 'TDA-2026-8841' (booking)
    customer_id       BIGINT UNSIGNED NOT NULL,
    tent_id           BIGINT UNSIGNED NOT NULL,
    quantity          SMALLINT UNSIGNED NOT NULL CHECK (quantity > 0),
    check_in_date     DATE          NOT NULL,         -- rentalDate / checkIn
    check_out_date    DATE          NOT NULL,
    nights            SMALLINT UNSIGNED GENERATED ALWAYS AS
                        (DATEDIFF(check_out_date, check_in_date)) STORED,  -- dihitung DB, tidak pernah salah input
    base_cost         DECIMAL(12,2) NOT NULL,         -- price * qty * nights
    addon_cost        DECIMAL(12,2) NOT NULL DEFAULT 0,
    pickup_cost       DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_amount      DECIMAL(12,2) NOT NULL,         -- base + addon + pickup
    payment_scheme    ENUM('dp','full') NOT NULL DEFAULT 'dp',
    dp_percentage     DECIMAL(5,2)  NOT NULL DEFAULT 50.00,
    paid_amount       DECIMAL(12,2) NOT NULL DEFAULT 0,   -- DP/uang muka yang dibayar
    remaining_amount  DECIMAL(12,2) NOT NULL DEFAULT 0,   -- sisa pelunasan
    pickup_type       ENUM('basecamp','antar_danau') NOT NULL DEFAULT 'basecamp',
    status            ENUM('MENUNGGU_VERIFIKASI_DP','DP_TERVERIFIKASI','UNIT_SIAP','LUNAS','SELESAI','DIBATALKAN')
                      NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI_DP',
    stage             TINYINT UNSIGNED NOT NULL DEFAULT 0, -- 0:Pesanan Masuk 1:Verif DP 2:Unit Siap 3:Selesai
    notes             TEXT NULL,
    created_by        BIGINT UNSIGNED NULL,               -- user admin/kasir yang memproses
    verified_dp_at    DATETIME NULL,                      -- verifyOrderDP()
    verified_dp_by    BIGINT UNSIGNED NULL,
    settled_at        DATETIME NULL,                      -- markOrderPaid()
    settled_by        BIGINT UNSIGNED NULL,
    cancelled_at      DATETIME NULL,
    cancel_reason     VARCHAR(255) NULL,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rental_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    CONSTRAINT fk_rental_tent     FOREIGN KEY (tent_id)     REFERENCES tents(id)     ON DELETE RESTRICT,
    CONSTRAINT fk_rental_creator  FOREIGN KEY (created_by)  REFERENCES users(id)     ON DELETE SET NULL,
    CONSTRAINT chk_dates CHECK (check_out_date > check_in_date),
    INDEX idx_rental_status (status),
    INDEX idx_rental_dates (check_in_date, check_out_date),   -- cek ketersediaan jadwal
    INDEX idx_rental_customer (customer_id),
    INDEX idx_rental_tent (tent_id)
) ENGINE=InnoDB;

-- Item add-on per transaksi (addonCounts: {matras, sb, kompor} — harga per malam)
CREATE TABLE rental_addons (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rental_id      BIGINT UNSIGNED NOT NULL,
    addon_id       BIGINT UNSIGNED NOT NULL,
    quantity       SMALLINT UNSIGNED NOT NULL CHECK (quantity > 0),
    unit_price     DECIMAL(12,2) NOT NULL,      -- snapshot harga saat transaksi (harga bisa berubah nanti)
    nights         SMALLINT UNSIGNED NOT NULL,
    subtotal       DECIMAL(12,2) GENERATED ALWAYS AS (unit_price * quantity * nights) STORED,
    CONSTRAINT fk_ra_rental FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE,
    CONSTRAINT fk_ra_addon  FOREIGN KEY (addon_id)  REFERENCES addons(id)  ON DELETE RESTRICT,
    UNIQUE KEY uq_rental_addon (rental_id, addon_id)
) ENGINE=InnoDB;

-- Bukti transfer DP (receiptDataUrl/fileName upload pelanggan)
CREATE TABLE payment_proofs (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rental_id    BIGINT UNSIGNED NOT NULL,
    file_url     VARCHAR(500) NOT NULL,     -- simpan file di storage/S3, DB hanya path
    file_name    VARCHAR(255) NULL,
    method       VARCHAR(50)  NULL,         -- 'Transfer BSI', 'QRIS Dana', 'Transfer BRI', 'Transfer Nagari'
    sender_name  VARCHAR(100) NULL,         -- 'a.n. Rizky Pratama' (field bank pada order app.js)
    amount_claimed DECIMAL(12,2) NULL,
    uploaded_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at  DATETIME NULL,
    verified_by  BIGINT UNSIGNED NULL,
    verification_notes VARCHAR(255) NULL,
    CONSTRAINT fk_proof_rental FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE,
    CONSTRAINT fk_proof_verifier FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_proof_rental (rental_id)
) ENGINE=InnoDB;

-- Riwayat pembayaran bertahap (DP lalu pelunasan — mendukung cicilan >1 transaksi bayar)
CREATE TABLE payments (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rental_id     BIGINT UNSIGNED NOT NULL,
    payment_type  ENUM('DP','PELUNASAN','REFUND') NOT NULL,
    amount        DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    method        VARCHAR(50) NOT NULL,      -- transfer/QRIS/tunai di tempat
    proof_id      BIGINT UNSIGNED NULL,
    paid_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    recorded_by   BIGINT UNSIGNED NULL,
    CONSTRAINT fk_pay_rental FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE,
    CONSTRAINT fk_pay_proof  FOREIGN KEY (proof_id)  REFERENCES payment_proofs(id) ON DELETE SET NULL,
    INDEX idx_pay_rental (rental_id),
    INDEX idx_pay_date (paid_at)             -- agregasi laporan keuangan bulanan/mingguan
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 6. LOG AKTIVITAS / AUDIT TRAIL (state.activities app.js — dashboard feed)
-- ----------------------------------------------------------------------------
CREATE TABLE activity_logs (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NULL,        -- NULL jika aksi sistem/pelanggan
    entity_type ENUM('TENT','RENTAL','PAYMENT','ADDON','USER') NOT NULL,
    entity_id   BIGINT UNSIGNED NULL,
    action      VARCHAR(60) NOT NULL,        -- 'CREATE_TENT','TOGGLE_STATUS','DELETE_TENT','VERIFY_DP','MARK_PAID','RETURN_UNIT'
    title       VARCHAR(150) NOT NULL,       -- 'DP Terverifikasi — Fajar Kurniawan'
    description VARCHAR(255) NULL,           -- '3x Tenda Guardian 2P Ultralight Pro (Rp 67.500)'
    metadata    JSON NULL,                   -- payload detail (before/after)
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_log_entity (entity_type, entity_id),
    INDEX idx_log_time (created_at DESC)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 7. LAPORAN KEUANGAN (renderReportsView app.js — gross, dpCollected, settled, mingguan)
-- ----------------------------------------------------------------------------
-- Snapshot periode agar laporan historis stabil meski transaksi diubah/hapus.
CREATE TABLE financial_reports (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    period_year      SMALLINT UNSIGNED NOT NULL,           -- 2026
    period_month     TINYINT UNSIGNED  NOT NULL,           -- 11 (November)
    gross_revenue    DECIMAL(14,2) NOT NULL DEFAULT 0,     -- Total Pemasukan Sewa
    dp_collected     DECIMAL(14,2) NOT NULL DEFAULT 0,     -- Dana DP Terverifikasi
    settled_amount   DECIMAL(14,2) NOT NULL DEFAULT 0,     -- Pelunasan Selesai
    rentals_count    INT UNSIGNED    NOT NULL DEFAULT 0,
    week_1_amount    DECIMAL(14,2) NOT NULL DEFAULT 0,     -- grafik pemasukan mingguan
    week_2_amount    DECIMAL(14,2) NOT NULL DEFAULT 0,
    week_3_amount    DECIMAL(14,2) NOT NULL DEFAULT 0,
    week_4_amount    DECIMAL(14,2) NOT NULL DEFAULT 0,
    generated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    generated_by     BIGINT UNSIGNED NULL,
    UNIQUE KEY uq_report_period (period_year, period_month),
    CONSTRAINT fk_report_user FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 8. VIEW UNTUK DASHBOARD & KETERSEDIAAN
-- ----------------------------------------------------------------------------
-- Stok siap sewa per tenda = total_stock - unit yang sedang dipesan aktif
CREATE OR REPLACE VIEW v_tent_availability AS
SELECT
    t.id,
    t.code,
    t.name,
    c.name              AS category,
    t.price_per_day,
    t.total_stock,
    COALESCE(SUM(CASE WHEN r.status IN ('MENUNGGU_VERIFIKASI_DP','DP_TERVERIFIKASI','UNIT_SIAP')
                      THEN r.quantity ELSE 0 END), 0) AS rented_units,
    t.total_stock -
    COALESCE(SUM(CASE WHEN r.status IN ('MENUNGGU_VERIFIKASI_DP','DP_TERVERIFIKASI','UNIT_SIAP')
                      THEN r.quantity ELSE 0 END), 0) AS ready_units,
    t.status
FROM tents t
JOIN categories c ON c.id = t.category_id
LEFT JOIN rentals r ON r.tent_id = t.id
WHERE t.deleted_at IS NULL
GROUP BY t.id, t.code, t.name, c.name, t.price_per_day, t.total_stock, t.status;

-- Ringkasan transaksi untuk tabel "Pesanan & Verifikasi DP"
CREATE OR REPLACE VIEW v_rental_summary AS
SELECT
    r.id,
    r.invoice_code,
    cu.name             AS customer,
    cu.phone,
    cu.email,
    t.name              AS tent_name,
    r.quantity,
    r.nights,
    r.check_in_date,
    r.check_out_date,
    r.total_amount,
    r.paid_amount       AS dp_amount,
    r.remaining_amount,
    r.status,
    r.stage,
    pp.method           AS payment_method,
    pp.sender_name,
    r.created_at
FROM rentals r
JOIN customers cu ON cu.id = r.customer_id
JOIN tents t      ON t.id  = r.tent_id
LEFT JOIN payment_proofs pp ON pp.rental_id = r.id
ORDER BY r.created_at DESC;

-- ----------------------------------------------------------------------------
-- 9. SEED DATA (mengikuti data demo di kode)
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

-- Contoh transaksi sesuai seed orders app.js
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

-- ----------------------------------------------------------------------------
-- 10. CATATAN DESAIN (keputusan arsitektur)
-- ----------------------------------------------------------------------------
-- a) nights dibuat GENERATED COLUMN dari check_in/check_out -> menghilangkan inkonsistensi
--    (di kode lama `rentalDate` string "15 Nov 2026" sulit di-query/di-report).
-- b) Harga disnapshot ke baris transaksi (rentals.base_cost, rental_addons.unit_price) supaya
--    laporan keuangan tidak berubah ketika tarif tenda dinaikkan.
-- c) rented_units TIDAK disimpan sebagai kolom manual di tents (di app.js berupa field manual) —
--    dihitung via view dari rentals aktif agar stok selalu konsisten & bebas race condition.
-- d) Bukti transfer disimpan sebagai file (disk/S3/Cloudinary); DB hanya menyimpan path + metadata.
-- e) Laporan bulanan adalah tabel snapshot (financial_reports) + bisa di-regenerate dari payments.
-- f) Untuk cek bentrok jadwal (HalPemesanan "Cek Pesanan"), query:
--      SELECT ... FROM rentals WHERE tent_id = ? AND status NOT IN ('DIBATALKAN','SELESAI')
--        AND check_in_date < :checkout AND check_out_date > :checkin;
--    Pada skala besar tambahkan indeks komposit (tent_id, check_in_date, check_out_date).
