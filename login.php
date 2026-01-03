<?php
// login.php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all fields']);
        exit;
    }

    $conn = getDBConnection();

    // Get user from database
    $stmt = $conn->prepare("SELECT user_id, username, email, password_hash FROM users WHERE email = ? AND is_active = 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        $stmt->close();
        $conn->close();
        exit;
    }

    $user = $result->fetch_assoc();

    // Verify password
    if (password_verify($password, $user['password_hash'])) {
        // Set session variables
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['logged_in'] = true;

        // Update last login
        $update_stmt = $conn->prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?");
        $update_stmt->bind_param("i", $user['user_id']);
        $update_stmt->execute();
        $update_stmt->close();

        echo json_encode([
            'success' => true,
            'message' => 'Login successful!',
            'redirect' => 'dashboard/dashboard.php',
            'user' => [
                'username' => $user['username'],
                'email' => $user['email']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    }

    $stmt->close();
    $conn->close();
}
?>