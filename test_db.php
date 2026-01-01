<?php
require_once 'config.php';

$conn = getDBConnection();

if ($conn) {
    echo "✅ Database connection successful!<br>";

    // Check if users table exists
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    if ($result->num_rows > 0) {
        echo "✅ Users table exists!<br>";

        // Count users
        $count = $conn->query("SELECT COUNT(*) as total FROM users");
        $row = $count->fetch_assoc();
        echo "📊 Total users in database: " . $row['total'];
    } else {
        echo "❌ Users table does NOT exist!";
    }
} else {
    echo "❌ Database connection failed!";
}
?>