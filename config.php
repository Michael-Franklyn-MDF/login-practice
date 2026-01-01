<?php
define('DB_HOST', 'localhost:8888');
define('DB_USER', 'root');
define('DB_PASS', 'root');
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

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>