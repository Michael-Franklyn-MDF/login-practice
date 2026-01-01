<?php
// config.php - Database configuration for MAMP
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root');  // MAMP default password is 'root'
define('DB_NAME', 'user_auth_system');

// MAMP uses port 8889 for MySQL by default
// But we connect through localhost, so this should work

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
```