function switchTab(tab) {
    // Update tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    // Update forms
    document.querySelectorAll('.form-content').forEach(f => f.classList.remove('active'));
    if (tab === 'login') {
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.getElementById('signupForm').classList.add('active');
    }

    // Clear message
    hideMessage();
}

function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = `message ${type} show`;
}

function hideMessage() {
    document.getElementById('message').classList.remove('show');
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
        const response = await fetch('login.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showMessage(data.message, 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.php';
            }, 1000);
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Client-side validation
    let isValid = true;

    if (!validateUsername('signupUsername')) {
        isValid = false;
    }

    if (!validateEmail('signupEmail')) {
        isValid = false;
    }

    if (!validatePassword('signupPassword')) {
        showFieldError('signupPassword', 'Password must be at least 8 characters with uppercase, lowercase, and numbers');
        isValid = false;
    }

    if (!validateConfirmPassword('signupPassword', 'signupConfirmPassword')) {
        isValid = false;
    }

    if (!isValid) {
        showMessage('Please fix the errors above', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);

    try {
        const response = await fetch('signup.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showMessage(data.message, 'success');
            setTimeout(() => {
                switchTab('login');
                document.getElementById('signupForm').reset();
                // Clear all validation states
                clearFieldValidation('signupUsername');
                clearFieldValidation('signupEmail');
                clearFieldValidation('signupPassword');
                clearFieldValidation('signupConfirmPassword');
            }, 1500);
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error');
    }
}

async function handleLogout() {
    try {
        const response = await fetch('logout.php');
        const data = await response.json();

        if (data.success) {
            document.getElementById('dashboard').classList.remove('active');
            document.getElementById('authForms').style.display = 'block';
            document.getElementById('loginForm').reset();
            showMessage(data.message, 'success');
        }
    } catch (error) {
        showMessage('An error occurred during logout.', 'error');
    }
}

function showDashboard(user) {
    document.getElementById('authForms').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('displayUsername').textContent = user.username;
    document.getElementById('dashUsername').textContent = user.username;
    document.getElementById('dashEmail').textContent = user.email;
}

// Password Strength Checker
function checkPasswordStrength(inputId, barId) {
    const password = document.getElementById(inputId).value;
    const strengthBar = document.getElementById(barId);
    const strengthText = document.getElementById(inputId === 'signupPassword' ? 'signupStrengthText' : 'dashStrengthText');

    // Requirements
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password)
    };

    // Update requirement indicators (only for signup)
    if (inputId === 'signupPassword') {
        document.getElementById('req-length').classList.toggle('met', requirements.length);
        document.getElementById('req-uppercase').classList.toggle('met', requirements.uppercase);
        document.getElementById('req-lowercase').classList.toggle('met', requirements.lowercase);
        document.getElementById('req-number').classList.toggle('met', requirements.number);
    }

    // Calculate strength
    let strength = 0;
    if (requirements.length) strength++;
    if (requirements.uppercase) strength++;
    if (requirements.lowercase) strength++;
    if (requirements.number) strength++;

    // Special characters bonus
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // Update UI
    strengthBar.className = 'password-strength-bar';
    strengthText.className = 'password-strength-text';

    if (password.length === 0) {
        strengthBar.className = 'password-strength-bar';
        strengthText.textContent = '';
    } else if (strength <= 2) {
        strengthBar.classList.add('weak');
        strengthText.classList.add('weak');
        strengthText.textContent = '❌ Weak password';
    } else if (strength <= 4) {
        strengthBar.classList.add('medium');
        strengthText.classList.add('medium');
        strengthText.textContent = '⚠️ Medium password';
    } else {
        strengthBar.classList.add('strong');
        strengthText.classList.add('strong');
        strengthText.textContent = '✓ Strong password';
    }
}

// Validation Functions
function showFieldError(fieldId, message) {
    const inputGroup = document.getElementById(fieldId).closest('.input-group');
    const errorDiv = document.getElementById(fieldId + '-error');
    const successDiv = document.getElementById(fieldId + '-success');
    const icon = document.getElementById(fieldId + '-icon');

    inputGroup.classList.add('error');
    inputGroup.classList.remove('success');

    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    }

    if (successDiv) {
        successDiv.classList.remove('show');
    }

    if (icon) {
        icon.textContent = '✕';
        icon.className = 'validation-icon error show';
    }
}

function showFieldSuccess(fieldId, message = '') {
    const inputGroup = document.getElementById(fieldId).closest('.input-group');
    const errorDiv = document.getElementById(fieldId + '-error');
    const successDiv = document.getElementById(fieldId + '-success');
    const icon = document.getElementById(fieldId + '-icon');

    inputGroup.classList.remove('error');
    inputGroup.classList.add('success');

    if (errorDiv) {
        errorDiv.classList.remove('show');
    }

    if (successDiv && message) {
        successDiv.textContent = message;
        successDiv.classList.add('show');
    }

    if (icon) {
        icon.textContent = '✓';
        icon.className = 'validation-icon success show';
    }
}

function clearFieldValidation(fieldId) {
    const inputGroup = document.getElementById(fieldId).closest('.input-group');
    const errorDiv = document.getElementById(fieldId + '-error');
    const successDiv = document.getElementById(fieldId + '-success');
    const icon = document.getElementById(fieldId + '-icon');

    inputGroup.classList.remove('error', 'success');

    if (errorDiv) errorDiv.classList.remove('show');
    if (successDiv) successDiv.classList.remove('show');
    if (icon) icon.classList.remove('show');
}

function validateUsername(fieldId) {
    const username = document.getElementById(fieldId).value;

    if (username.length === 0) {
        clearFieldValidation(fieldId);
        return false;
    }

    if (username.length < 3) {
        showFieldError(fieldId, 'Username must be at least 3 characters');
        return false;
    }

    if (username.length > 20) {
        showFieldError(fieldId, 'Username must be less than 20 characters');
        return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showFieldError(fieldId, 'Username can only contain letters, numbers, and underscores');
        return false;
    }

    showFieldSuccess(fieldId, '✓ Username looks good');
    return true;
}

function validateEmail(fieldId) {
    const email = document.getElementById(fieldId).value;

    if (email.length === 0) {
        clearFieldValidation(fieldId);
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        showFieldError(fieldId, 'Please enter a valid email address');
        return false;
    }

    showFieldSuccess(fieldId, '✓ Email looks good');
    return true;
}

function validatePassword(fieldId) {
    const password = document.getElementById(fieldId).value;

    if (password.length === 0) {
        return false;
    }

    if (password.length < 8) {
        return false;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasUppercase && hasLowercase && hasNumber;
}

function validateConfirmPassword(passwordId, confirmPasswordId) {
    const password = document.getElementById(passwordId).value;
    const confirmPassword = document.getElementById(confirmPasswordId).value;

    if (confirmPassword.length === 0) {
        clearFieldValidation(confirmPasswordId);
        return false;
    }

    if (password !== confirmPassword) {
        showFieldError(confirmPasswordId, 'Passwords do not match');
        return false;
    }

    showFieldSuccess(confirmPasswordId, '✓ Passwords match');
    return true;
}