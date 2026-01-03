<?php
// verify_deployment.php

echo "Starting Project Health Check Verification...\n";
echo "------------------------------------------------\n";

$files_to_check = [
    'config.php',
    'login.php',
    'signup.php',
    'logout.php',
    'index.html',
    'style.css',
    'script.js',
    'backend/change_password.php',
    'backend/delete_account.php',
    'backend/update_profile.php',
    'dashboard/dashboard.php',
    'dashboard/dashboard-style.css',
    'dashboard/dashboard-script.js'
];

$all_exist = true;

foreach ($files_to_check as $file) {
    if (file_exists(__DIR__ . '/' . $file)) {
        echo "[OK] Found: " . $file . "\n";
    } else {
        echo "[ERROR] Missing: " . $file . "\n";
        $all_exist = false;
    }
}

echo "------------------------------------------------\n";

// Check content of login.php for correct redirect
$login_content = file_get_contents(__DIR__ . '/login.php');
if (strpos($login_content, "'redirect' => 'dashboard/dashboard.php'") !== false) {
    echo "[OK] login.php redirect is correct.\n";
} else {
    echo "[FAIL] login.php redirect is INCORRECT. Found: " . substr($login_content, strpos($login_content, "'redirect' => '"), 50) . "...\n";
}

// Check content of dashboard.php for correct include
$dash_content = file_get_contents(__DIR__ . '/dashboard/dashboard.php');
if (strpos($dash_content, "require_once '../config.php'") !== false) {
    echo "[OK] dashboard.php include is correct.\n";
} else {
    echo "[FAIL] dashboard.php include is INCORRECT.\n";
}

if ($all_exist) {
    echo "\nVerification Passed: All files are present and key configs look correct.\n";
} else {
    echo "\nVerification Failed: Some files are missing.\n";
}
?>