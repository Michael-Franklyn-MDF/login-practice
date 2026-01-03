<?php
// dashboard.php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: index.html');
    exit;
}

$conn = getDBConnection();

// Get user data
$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT username, email, created_at, last_login FROM users WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();
$conn->close();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard -
        <?php echo htmlspecialchars($user['username']); ?>
    </title>
    <link rel="stylesheet" href="dashboard-style.css">
</head>

<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo">
                <h2>My Account</h2>
            </div>
            <nav class="nav-menu">
                <a href="#" class="nav-item active" onclick="showSection('profile')">
                    <span class="icon">👤</span> Profile
                </a>
                <a href="#" class="nav-item" onclick="showSection('edit')">
                    <span class="icon">✏️</span> Edit Profile
                </a>
                <a href="#" class="nav-item" onclick="showSection('password')">
                    <span class="icon">🔒</span> Change Password
                </a>
                <a href="#" class="nav-item" onclick="showSection('settings')">
                    <span class="icon">⚙️</span> Settings
                </a>
                <a href="logout.php" class="nav-item logout">
                    <span class="icon">🚪</span> Logout
                </a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="page-header">
                <h1>Welcome back,
                    <?php echo htmlspecialchars($user['username']); ?>!
                </h1>
                <p class="subtitle">Manage your account settings and preferences</p>
            </header>

            <!-- Message Area -->
            <div id="message" class="message"></div>

            <!-- Profile Section -->
            <section id="profileSection" class="content-section active">
                <div class="card">
                    <div class="card-header">
                        <h2>Profile Information</h2>
                    </div>
                    <div class="card-body">
                        <div class="profile-grid">
                            <div class="profile-item">
                                <label>Username</label>
                                <p>
                                    <?php echo htmlspecialchars($user['username']); ?>
                                </p>
                            </div>
                            <div class="profile-item">
                                <label>Email Address</label>
                                <p>
                                    <?php echo htmlspecialchars($user['email']); ?>
                                </p>
                            </div>
                            <div class="profile-item">
                                <label>Member Since</label>
                                <p>
                                    <?php echo date('F j, Y', strtotime($user['created_at'])); ?>
                                </p>
                            </div>
                            <div class="profile-item">
                                <label>Last Login</label>
                                <p>
                                    <?php echo $user['last_login'] ? date('F j, Y g:i A', strtotime($user['last_login'])) : 'Never'; ?>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Edit Profile Section -->
            <section id="editSection" class="content-section">
                <div class="card">
                    <div class="card-header">
                        <h2>Edit Profile</h2>
                    </div>
                    <div class="card-body">
                        <form id="editProfileForm" onsubmit="handleEditProfile(event)">
                            <div class="form-group">
                                <label for="editUsername">Username</label>
                                <input type="text" id="editUsername"
                                    value="<?php echo htmlspecialchars($user['username']); ?>" required
                                    oninput="validateDashUsername()">
                                <div class="field-error" id="editUsername-error"></div>
                            </div>
                            <div class="form-group">
                                <label for="editEmail">Email Address</label>
                                <input type="email" id="editEmail"
                                    value="<?php echo htmlspecialchars($user['email']); ?>" required
                                    oninput="validateDashEmail()">
                                <div class="field-error" id="editEmail-error"></div>
                            </div>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                    </div>
                </div>
            </section>

            <!-- Change Password Section -->
            <section id="passwordSection" class="content-section">
                <div class="card">
                    <div class="card-header">
                        <h2>Change Password</h2>
                    </div>
                    <div class="card-body">
                        <form id="changePasswordForm" onsubmit="handleChangePassword(event)">
                            <div class="form-group">
                                <label for="currentPassword">Current Password</label>
                                <input type="password" id="currentPassword" required>
                                <div class="field-error" id="currentPassword-error"></div>
                            </div>
                            <div class="form-group">
                                <label for="newPassword">New Password</label>
                                <input type="password" id="newPassword" required
                                    oninput="checkPasswordStrength('newPassword', 'dashStrength')">
                                <div class="password-strength">
                                    <div id="dashStrength" class="password-strength-bar"></div>
                                </div>
                                <div id="dashStrengthText" class="password-strength-text"></div>
                                <div class="field-error" id="newPassword-error"></div>
                            </div>
                            <div class="form-group">
                                <label for="confirmNewPassword">Confirm New Password</label>
                                <input type="password" id="confirmNewPassword" required
                                    oninput="validateDashConfirmPassword()">
                                <div class="field-error" id="confirmNewPassword-error"></div>
                            </div>
                            <button type="submit" class="btn btn-primary">Update Password</button>
                        </form>
                    </div>
                </div>
            </section>

            <!-- Settings Section -->
            <section id="settingsSection" class="content-section">
                <div class="card">
                    <div class="card-header">
                        <h2>Account Settings</h2>
                    </div>
                    <div class="card-body">
                        <div class="settings-item">
                            <div class="settings-info">
                                <h3>Account Status</h3>
                                <p>Your account is currently active</p>
                            </div>
                            <span class="status-badge active">Active</span>
                        </div>
                        <div class="settings-item danger-zone">
                            <div class="settings-info">
                                <h3>Delete Account</h3>
                                <p>Permanently delete your account and all data</p>
                            </div>
                            <button class="btn btn-danger" onclick="confirmDelete()">Delete Account</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script src="dashboard-script.js"></script>
</body>

</html>