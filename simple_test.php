<?php
echo "Testing MySQL Connection...<br><br>";

$host = 'localhost';
$user = 'root';
$pass = 'root';
$port = 3306;

echo "Host: $host<br>";
echo "User: $user<br>";
echo "Port: $port<br><br>";

// Test 1: Connect without database
$conn = @new mysqli($host, $user, $pass, '', $port);

if ($conn->connect_error) {
    echo "❌ Connection failed: " . $conn->connect_error . "<br>";
    echo "Error code: " . $conn->connect_errno . "<br>";
} else {
    echo "✅ Connected to MySQL successfully!<br><br>";

    // Test 2: Check if database exists
    $result = $conn->query("SHOW DATABASES LIKE 'user_auth_system'");

    if ($result->num_rows > 0) {
        echo "✅ Database 'user_auth_system' exists!<br>";
    } else {
        echo "❌ Database 'user_auth_system' does NOT exist!<br>";
        echo "Creating database...<br>";

        if ($conn->query("CREATE DATABASE user_auth_system")) {
            echo "✅ Database created successfully!<br>";
        } else {
            echo "❌ Error creating database: " . $conn->error . "<br>";
        }
    }

    $conn->close();
}
?>