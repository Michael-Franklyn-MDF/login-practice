# 🔐 Neumorphic Authentication System

A modern, secure, and aesthetically pleasing user authentication system featuring a **"Soft UI" (Neumorphism)** design. Built with PHP, MySQL, and vanilla JavaScript.

![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Neumorphism](https://img.shields.io/badge/Design-Neumorphism-E0E5EC?style=for-the-badge&labelColor=4a5568&color=e0e5ec)

---

## ✨ Features

### 🎨 Neumorphic Design (Soft UI)

- **Tactile Interface**: Elements appear to be extruded from the background with soft shadows (`#e0e5ec` base).
- **Responsive Interactions**: Buttons and inputs have distinct "Raised" and "Pressed" states.
- **Micro-Animations**: Smooth transitions for focus, hover, and active states.

### 🔒 Core Authentication

- **Secure Signup/Login**: PHP-based authentication with `password_hash()` (Bcrypt).
- **Session Management**: Secure session handling for user state.
- **Form Validation**: Real-time client-side validation + robust server-side checks.

### 👤 User Dashboard

- **Profile Management**: View and update username/email.
- **Security**: Change password with strength metering.
- **Account Control**: "Delete Account" functionality.

---

## 📁 Project Structure

The project uses a flattened structure for simplicity:

```
login-practice/
├── index.html              # Main Landing (Login & Signup Forms)
├── style.css               # Neumorphic Styles for Login/Signup
├── script.js               # Frontend Logic (Validation, Tab Switching)
├── MOCK_DATA.json          # (Optional) Fake data for testing
├── config.php              # Database Configuration
├── login.php               # Backend: Login Logic
├── signup.php              # Backend: User Registration
├── logout.php              # Backend: Session Logout
├── dashboard.php           # User Dashboard (Protected Route)
├── dashboard-style.css     # Neumorphic Styles for Dashboard
├── dashboard-script.js     # Dashboard Interaction Logic
├── update_profile.php      # Backend: Profile Updates
├── change_password.php     # Backend: Password Changes
├── delete_account.php      # Backend: Account Deletion
└── README.md               # Documentation
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Local Server**: MAMP, XAMPP, or WAMP.
- **PHP**: Version 7.4 or higher.
- **MySQL**: Database server.

### 1. Database Setup

1. Open **phpMyAdmin** (usually `http://localhost:8888/phpMyAdmin`).
2. Create a new database named `user_auth_system`.
3. Run the following SQL to create the necessary tables:

```sql
CREATE DATABASE IF NOT EXISTS user_auth_system;
USE user_auth_system;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

### 2. Configure Credentials

Open `config.php` and verify your database credentials:

```php
$DB_HOST = 'localhost';
$DB_USER = 'root';        // Default for MAMP/XAMPP
$DB_PASS = 'root';        // 'root' for MAMP, '' (empty) for XAMPP
$DB_NAME = 'user_auth_system';
$DB_PORT = 8889;          // 8889 for MAMP, 3306 for XAMPP
```

### 3. Run the Application

1. Place the `login-practice` folder in your server's root (`htdocs` for MAMP/XAMPP).
2. Start your Apache and MySQL servers.
3. Open your browser to `http://localhost:8888/login-practice/` (or your specific port).

---

## 🎨 Customization

### Neumorphic Color Palette

To change the theme validation, look for these values in `style.css` and `dashboard-style.css`:

- **Background**: `#e0e5ec` (The core soft gray-blue)
- **Text Primary**: `#4a5568`
- **Text Secondary**: `#718096`
- **Accent**: `#667eea` (Purple-ish Blue)
- **Shadow Light**: `rgba(255, 255, 255, 0.8)`
- **Shadow Dark**: `rgba(163, 177, 198, 0.6)`

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests for new features like "Forgot Password" flows or Two-Factor Authentication!

## 📝 License

This project is open-source and free to use.
