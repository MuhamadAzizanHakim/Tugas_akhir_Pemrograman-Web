-- ============================================================================
-- MIGRASI 003 — Transaksi Penyewaan (sumber: orders app.js + submitBookingOrder HalPemesanan.html)
-- Skema pembayaran: dp = DP 50%, full = lunas 100% (setPaymentScheme)
-- Lifecycle: MENUNGGU_VERIFIKASI_DP -> DP_TERVERIFIKASI -> UNIT_SIAP -> LUNAS/SELESAI | DIBATALKAN
-- ============================================================================

CREATE TABLE IF NOT EXISTS customers (
    id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name               VARCHAR(100) NOT NULL,
    phone              VARCHAR(20)  NOT NULL,
    email              VARCHAR(120) NULL,
    address            VARCHAR(255) NULL,
    total_orders_count INT UNSIGNED NOT NULL DEFAULT 0,   -- denormalisasi utk dashboard/CRM
    first_ordered_at   DATETIME     NULL,
    created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_customer_phone_email (phone, email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rentals (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_code     VARCHAR(20)  NOT NULL UNIQUE,   -- 'INV-2611-01' (admin) / 'TDA-2026-8841' (booking)
    customer_id      BIGINT UNSIGNED NOT NULL,
    tent_id          BIGINT UNSIGNED NOT NULL,
    quantity         SMALLINT UNSIGNED NOT NULL CHECK (quantity > 0),
    check_in_date    DATE          NOT NULL,
    check_out_date   DATE          NOT NULL,
    nights           SMALLINT UNSIGNED GENERATED ALWAYS AS (DATEDIFF(check_out_date, check_in_date)) STORED,
    base_cost        DECIMAL(12,2) NOT NULL,         -- price * qty * nights (snapshot)
    addon_cost       DECIMAL(12,2) NOT NULL DEFAULT 0,
    pickup_cost      DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_amount     DECIMAL(12,2) NOT NULL,         -- base + addon + pickup
    payment_scheme   ENUM('dp','full') NOT NULL DEFAULT 'dp',
    dp_percentage    DECIMAL(5,2)  NOT NULL DEFAULT 50.00,
    paid_amount      DECIMAL(12,2) NOT NULL DEFAULT 0,
    remaining_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    pickup_type      ENUM('basecamp','antar_danau') NOT NULL DEFAULT 'basecamp',
    status           ENUM('MENUNGGU_VERIFIKASI_DP','DP_TERVERIFIKASI','UNIT_SIAP','LUNAS','SELESAI','DIBATALKAN')
                     NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI_DP',
    stage            TINYINT UNSIGNED NOT NULL DEFAULT 0,  -- 0:Masuk 1:Verif DP 2:Unit Siap 3:Selesai
    notes            TEXT NULL,
    created_by       BIGINT UNSIGNED NULL,
    verified_dp_at   DATETIME NULL,                  -- verifyOrderDP()
    verified_dp_by   BIGINT UNSIGNED NULL,
    settled_at       DATETIME NULL,                  -- markOrderPaid()
    settled_by       BIGINT UNSIGNED NULL,
    cancelled_at     DATETIME NULL,
    cancel_reason    VARCHAR(255) NULL,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rental_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    CONSTRAINT fk_rental_tent     FOREIGN KEY (tent_id)     REFERENCES tents(id)     ON DELETE RESTRICT,
    CONSTRAINT fk_rental_creator  FOREIGN KEY (created_by)  REFERENCES users(id)     ON DELETE SET NULL,
    CONSTRAINT fk_rental_verifier FOREIGN KEY (verified_dp_by) REFERENCES users(id)  ON DELETE SET NULL,
    CONSTRAINT fk_rental_settler  FOREIGN KEY (settled_by)  REFERENCES users(id)     ON DELETE SET NULL,
    CONSTRAINT chk_dates CHECK (check_out_date > check_in_date),
    INDEX idx_rental_status (status),
    INDEX idx_rental_dates (check_in_date, check_out_date),   -- cek ketersediaan/bentrok jadwal
    INDEX idx_rental_customer (customer_id),
    INDEX idx_rental_tent (tent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rental_addons (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rental_id  BIGINT UNSIGNED NOT NULL,
    addon_id   BIGINT UNSIGNED NOT NULL,
    quantity   SMALLINT UNSIGNED NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL,      -- snapshot harga saat transaksi
    nights     SMALLINT UNSIGNED NOT NULL,
    subtotal   DECIMAL(12,2) GENERATED ALWAYS AS (unit_price * quantity * nights) STORED,
    CONSTRAINT fk_ra_rental FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE,
    CONSTRAINT fk_ra_addon  FOREIGN KEY (addon_id)  REFERENCES addons(id)  ON DELETE RESTRICT,
    UNIQUE KEY uq_rental_addon (rental_id, addon_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payment_proofs (
    id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rental_id          BIGINT UNSIGNED NOT NULL,
    file_url           VARCHAR(500) NOT NULL,     -- receiptDataUrl -> simpan sbg file, DB hanya path
    file_name          VARCHAR(255) NULL,
    method             VARCHAR(50)  NULL,         -- 'Transfer BSI','QRIS Dana','Transfer BRI','Transfer Nagari'
    sender_name        VARCHAR(100) NULL,         -- 'a.n. Rizky Pratama' (field bank pada order)
    amount_claimed     DECIMAL(12,2) NULL,
    uploaded_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at        DATETIME NULL,
    verified_by        BIGINT UNSIGNED NULL,
    verification_notes VARCHAR(255) NULL,
    CONSTRAINT fk_proof_rental   FOREIGN KEY (rental_id)   REFERENCES rentals(id)        ON DELETE CASCADE,
    CONSTRAINT fk_proof_verifier FOREIGN KEY (verified_by) REFERENCES users(id)          ON DELETE SET NULL,
    INDEX idx_proof_rental (rental_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rental_id    BIGINT UNSIGNED NOT NULL,
    payment_type ENUM('DP','PELUNASAN','REFUND') NOT NULL,
    amount       DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    method       VARCHAR(50) NOT NULL,      -- transfer/QRIS/tunai di tempat
    proof_id     BIGINT UNSIGNED NULL,
    paid_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    recorded_by  BIGINT UNSIGNED NULL,
    CONSTRAINT fk_pay_rental   FOREIGN KEY (rental_id)   REFERENCES rentals(id)         ON DELETE CASCADE,
    CONSTRAINT fk_pay_proof    FOREIGN KEY (proof_id)    REFERENCES payment_proofs(id)  ON DELETE SET NULL,
    CONSTRAINT fk_pay_recorder FOREIGN KEY (recorded_by) REFERENCES users(id)           ON DELETE SET NULL,
    INDEX idx_pay_rental (rental_id),
    INDEX idx_pay_date (paid_at)            -- agregasi laporan mingguan/bulanan
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down migration:
-- DROP TABLE IF EXISTS payments, payment_proofs, rental_addons, rentals, customers;
