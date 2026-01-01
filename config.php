<?php
// config.php - Database configuration for MAMP
define('DB_HOST', 'localhost:30'); // Added port 8889 for MAMP
define('DB_USER', 'root');
define('DB_PASS', 'root'); // MAMP default password
define('DB_NAME', 'user_auth_system');

// Create connection
function getDBConnection()
{
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>