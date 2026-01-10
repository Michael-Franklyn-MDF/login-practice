<?php
session_start();

echo "<h2>Session Test</h2>";
echo "<pre>";
echo "Session ID: " . session_id() . "\n";
echo "Session Status: " . session_status() . "\n";
echo "Session started: " . (session_id() ? 'YES' : 'NO') . "\n\n";

// Set test data
$_SESSION['test'] = 'Hello World';
$_SESSION['timestamp'] = time();

echo "Session Data:\n";
print_r($_SESSION);
echo "</pre>";

echo "<a href='session_test2.php'>Go to Test Page 2</a>";
?>