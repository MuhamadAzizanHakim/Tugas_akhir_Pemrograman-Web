<?php
/**
 * Runner migrasi sederhana untuk Teduh Alam.
 *
 * Usage:
 *   php backend/migrate.php            # jalankan semua migrasi yang belum berjalan
 *   php backend/migrate.php --status   # lihat status tiap file migrasi
 *
 * Butuh: PHP 8+, ekstensi pdo_mysql, dan env DB_HOST/DB_NAME/DB_USER/DB_PASS (lihat config/.env.example).
 */

declare(strict_types=1);

$root = __DIR__;
require_once $root . '/config/Database.php';

use App\Database;

$MIGRATIONS_DIR = dirname(__DIR__) . '/database/migrations';

$pdo = Database::getConnection();

// Tabel pelacak migrasi (idempotent)
$pdo->exec("CREATE TABLE IF NOT EXISTS migrations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$files = glob($MIGRATIONS_DIR . '/*.sql');
sort($files, SORT_NATURAL);

$done = $pdo->query("SELECT filename FROM migrations")->fetchAll(PDO::FETCH_COLUMN);

if (in_array('--status', $argv, true)) {
    foreach ($files as $f) {
        $name = basename($f);
        printf("[%s] %s\n", in_array($name, $done, true) ? 'DONE' : ' TODO', $name);
    }
    exit(0);
}

foreach ($files as $file) {
    $name = basename($file);
    if (in_array($name, $done, true)) {
        echo "= skip   $name\n";
        continue;
    }

    $sql = file_get_contents($file);
    echo "> running $name ... ";
    try {
        // Satu file migrasi = satu transaksi DDL. Catatan: di MySQL, DDL bersifat
        // auto-commit; untuk atomicity ketat gunakan tool migrasi (Phinx/Laravel).
        $pdo->exec($sql);
        $ins = $pdo->prepare("INSERT INTO migrations (filename) VALUES (?)");
        $ins->execute([$name]);
        echo "OK\n";
    } catch (Throwable $e) {
        echo "GAGAL\n  " . $e->getMessage() . "\n";
        exit(1);
    }
}

echo "Selesai. Semua migrasi diterapkan.\n";
