// Show different sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected section
    const sections = {
        'profile': 'profileSection',
        'edit': 'editSection',
        'password': 'passwordSection',
        'settings': 'settingsSection'
    };

    document.getElementById(sections[sectionName]).classList.add('active');

    // Add active class to clicked nav item
    event.target.closest('.nav-item').classList.add('active');

    // Clear any messages
    hideMessage();
}

function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = `message ${type} show`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideMessage();
    }, 5000);
}

function hideMessage() {
    document.getElementById('message').classList.remove('show');
}

// Handle Edit Profile
async function handleEditProfile(e) {
    e.preventDefault();

    const username = document.getElementById('editUsername').value;
    const email = document.getElementById('editEmail').value;

    // Validate before submitting
    let isValid = true;

    if (!validateDashUsername()) {
        isValid = false;
    }

    if (!validateDashEmail()) {
        isValid = false;
    }

    if (!isValid) {
        showMessage('Please fix the errors above', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);

    try {
        const response = await fetch('update_profile.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showMessage(data.message, 'success');
            // Update the profile section with new data
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error');
    }
}

// Handle Change Password
async function handleChangePassword(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    // Clear previous errors
    clearDashFieldError('currentPassword');
    clearDashFieldError('newPassword');
    clearDashFieldError('confirmNewPassword');

    let isValid = true;

    if (newPassword.length < 8) {
        showDashFieldError('newPassword', 'Password must be at least 8 characters');
        isValid = false;
    }

    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (!hasUppercase || !hasLowercase || !hasNumber) {
        showDashFieldError('newPassword', 'Password must contain uppercase, lowercase, and numbers');
        isValid = false;
    }

    if (newPassword !== confirmNewPassword) {
        showDashFieldError('confirmNewPassword', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) {
        showMessage('Please fix the errors above', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('current_password', currentPassword);
    formData.append('new_password', newPassword);

    try {
        const response = await fetch('change_password.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showMessage(data.message, 'success');
            document.getElementById('changePasswordForm').reset();
            clearDashFieldError('currentPassword');
            clearDashFieldError('newPassword');
            clearDashFieldError('confirmNewPassword');
        } else {
            if (data.message.includes('Current password')) {
                showDashFieldError('currentPassword', data.message);
            }
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error');
    }
}

// Confirm Delete Account
function confirmDelete() {
    const confirmed = confirm(
        'Are you sure you want to delete your account?\n\n' +
        'This action cannot be undone and all your data will be permanently deleted.'
    );

    if (confirmed) {
        deleteAccount();
    }
}

async function deleteAccount() {
    try {
        const response = await fetch('delete_account.php', {
            method: 'POST'
        });

        const data = await response.json();

        if (data.success) {
            alert('Your account has been deleted.');
            window.location.href = 'index.html';
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error');
    }
}

// Password Strength Checker
function checkPasswordStrength(inputId, barId) {
    const password = document.getElementById(inputId).value;
    const strengthBar = document.getElementById(barId);
    const strengthText = document.getElementById(barId + 'Text');

    // Requirements
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password)
    };

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

// Dashboard Validation Functions
function showDashFieldError(fieldId, message) {
    const formGroup = document.getElementById(fieldId).closest('.form-group');
    const errorDiv = document.getElementById(fieldId + '-error');

    formGroup.classList.add('error');
    formGroup.classList.remove('success');

    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    }
}

function clearDashFieldError(fieldId) {
    const formGroup = document.getElementById(fieldId).closest('.form-group');
    const errorDiv = document.getElementById(fieldId + '-error');

    formGroup.classList.remove('error', 'success');

    if (errorDiv) {
        errorDiv.classList.remove('show');
    }
}

function validateDashUsername() {
    const username = document.getElementById('editUsername').value;

    if (username.length < 3) {
        showDashFieldError('editUsername', 'Username must be at least 3 characters');
        return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showDashFieldError('editUsername', 'Username can only contain letters, numbers, and underscores');
        return false;
    }

    clearDashFieldError('editUsername');
    return true;
}

function validateDashEmail() {
    const email = document.getElementById('editEmail').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        showDashFieldError('editEmail', 'Please enter a valid email address');
        return false;
    }

    clearDashFieldError('editEmail');
    return true;
}

function validateDashConfirmPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    if (confirmPassword.length === 0) {
        clearDashFieldError('confirmNewPassword');
        return false;
    }

    if (newPassword !== confirmPassword) {
        showDashFieldError('confirmNewPassword', 'Passwords do not match');
        return false;
    }

    clearDashFieldError('confirmNewPassword');
    return true;
}