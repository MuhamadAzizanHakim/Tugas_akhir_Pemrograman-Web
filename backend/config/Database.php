<?php
/**
 * Koneksi database Teduh Alam — PDO MySQL (singleton).
 * Kredensial dibaca dari environment (.env), tidak di-hardcode.
 */

namespace App;

use \PDOException;

class Database
{
    private static ?\PDO $instance = null;

    public static function getConnection(): \PDO
    {
        if (self::$instance === null) {
            $host = getenv('DB_HOST') ?: '127.0.0.1';
            $port = getenv('DB_PORT') ?: '3306';
            $db   = getenv('DB_NAME') ?: 'teduh_alam';
            $user = getenv('DB_USER') ?: 'root';
            $pass = getenv('DB_PASS') ?: '';

            $dsn = "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";
            $options = [
                \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION, // error -> exception
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                \PDO::ATTR_EMULATE_PREPARES   => false,                    // prepared statement asli (anti SQL injection)
                \PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
            ];

            try {
                self::$instance = new \PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode(['error' => 'Koneksi database gagal']);
                error_log('DB connect: ' . $e->getMessage());
                exit;
            }
        }
        return self::$instance;
    }

    /** Transaksi aman untuk operasi multi-tabel (buat rental + addons + payment sekaligus). */
    public static function transaction(callable $fn): mixed
    {
        $pdo = self::getConnection();
        $pdo->beginTransaction();
        try {
            $result = $fn($pdo);
            $pdo->commit();
            return $result;
        } catch (\Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }
}
