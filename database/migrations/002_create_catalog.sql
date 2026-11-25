-- ============================================================================
-- MIGRASI 002 — Master Katalog (sumber: state.tents app.js, TENT_UNITS HalPemesanan.html,
-- products landing.js, array tags[] & gallery[])
-- ============================================================================

CREATE TABLE IF NOT EXISTS categories (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(50) NOT NULL UNIQUE,   -- '2 Orang','4 Orang','6-8 Orang Keluarga','8-10 Orang','alat','glamping'
    min_people SMALLINT UNSIGNED NULL,        -- untuk filter kapasitas & kalkulator rekomendasi (landing.js)
    max_people SMALLINT UNSIGNED NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tents (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code             VARCHAR(15)   NOT NULL UNIQUE,        -- 'TND-001' dst.
    category_id      INT UNSIGNED  NOT NULL,
    name             VARCHAR(150)  NOT NULL,
    description      TEXT          NULL,
    price_per_day    DECIMAL(12,2) NOT NULL CHECK (price_per_day >= 0),  -- Rp / unit / malam
    total_stock      SMALLINT UNSIGNED NOT NULL DEFAULT 0 CHECK (total_stock >= 0),
    status           ENUM('Tersedia','Perawatan') NOT NULL DEFAULT 'Tersedia',  -- toggleTentStatus()
    svg_preset       VARCHAR(30)   NULL,                   -- 'dome4'|'ultralight2'|'family6' (fallback visual)
    custom_image_url VARCHAR(500)  NULL,                   -- foto hasil upload admin
    is_published     BOOLEAN       NOT NULL DEFAULT TRUE,
    rating           DECIMAL(2,1)  NULL,                   -- 4.9 (produk landing.js)
    badge_label      VARCHAR(50)   NULL,                   -- 'Terpopuler','Anti Badai'
    waterproof_spec  VARCHAR(50)   NULL,                   -- '3000mm','IPX4'
    created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at       TIMESTAMP     NULL,                   -- soft delete (executeDeleteTent app.js)
    CONSTRAINT fk_tents_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_tents_category (category_id),
    INDEX idx_tents_status (status, is_published),
    FULLTEXT INDEX ft_tents_search (name, description)     -- catalogSearch & searchInput
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tags (
    id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE                       -- 'Double Layer','Waterproof 3000mm', dst.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tent_tags (
    tent_id BIGINT UNSIGNED NOT NULL,
    tag_id  INT UNSIGNED    NOT NULL,
    PRIMARY KEY (tent_id, tag_id),
    CONSTRAINT fk_tt_tent FOREIGN KEY (tent_id) REFERENCES tents(id) ON DELETE CASCADE,
    CONSTRAINT fk_tt_tag  FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tent_galleries (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tent_id    BIGINT UNSIGNED NOT NULL,
    label      VARCHAR(60)  NOT NULL,      -- 'Tampak Depan','Interior','Detail Jahitan','Suasana Malam'
    image_url  VARCHAR(500) NOT NULL,      -- simpan file di storage, DB hanya path
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gallery_tent FOREIGN KEY (tent_id) REFERENCES tents(id) ON DELETE CASCADE,
    INDEX idx_gallery_tent (tent_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS addons (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code          VARCHAR(20)   NOT NULL UNIQUE,   -- 'matras','sb','kompor' (ADDON_ITEMS)
    name          VARCHAR(100)  NOT NULL,          -- 'Matras Spons'
    price_per_day DECIMAL(12,2) NOT NULL CHECK (price_per_day >= 0),
    total_stock   SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down migration:
-- DROP TABLE IF EXISTS addons, tent_galleries, tent_tags, tags, tents, categories;
