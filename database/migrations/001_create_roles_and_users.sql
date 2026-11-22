-- ============================================================================
-- MIGRASI 001 — Roles & Users (sumber: login.html — PIN + kata sandi portal admin)
-- DBMS target: MySQL 8.x / MariaDB 10.5+ (InnoDB, utf8mb4)
-- ============================================================================

CREATE TABLE IF NOT EXISTS roles (
    id          TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,          -- 'super_admin', 'admin', 'kasir', 'gudang'
    description VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id       TINYINT UNSIGNED NOT NULL,
    full_name     VARCHAR(100)  NOT NULL,
    username      VARCHAR(50)   NOT NULL UNIQUE,
    email         VARCHAR(120)  NOT NULL UNIQUE,
    phone         VARCHAR(20)   NULL,
    password_hash VARCHAR(255)  NOT NULL,              -- bcrypt/argon2 via password_hash(), JANGAN plaintext
    pin_hash      VARCHAR(255)  NULL,                  -- PIN 6 digit portal admin (di-hash)
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    last_login_at DATETIME      NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_users_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Down migration:
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS roles;
