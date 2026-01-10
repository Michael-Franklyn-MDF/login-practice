<?php
// config.php
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = 'root';
$DB_NAME = 'user_auth_system';
$DB_PORT = 3306;

function getDBConnection()
{
    global $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT;

    $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}

// IMPORTANT: Start session ONLY ONCE
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>