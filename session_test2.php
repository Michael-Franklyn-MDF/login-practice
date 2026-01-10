<?php
session_start();

echo "<h2>Session Test - Page 2</h2>";
echo "<pre>";
echo "Session ID: " . session_id() . "\n\n";

if (isset($_SESSION['test'])) {
    echo "✅ Session is working!\n";
    echo "Test data: " . $_SESSION['test'] . "\n";
    echo "Timestamp: " . $_SESSION['timestamp'] . "\n";
} else {
    echo "❌ Session NOT working - data lost\n";
}

print_r($_SESSION);
echo "</pre>";

echo "<a href='session_test.php'>Back to Test Page 1</a>";
?>