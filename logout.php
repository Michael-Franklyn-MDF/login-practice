<?php
// logout.php
require_once 'config.php';

// Destroy all session data
session_unset();
session_destroy();

// Check if it's an AJAX request or direct access
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    // AJAX request - send JSON response
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
} else {
    // Direct access - redirect to login page
    header('Location: index.html');
    exit;
}
?>