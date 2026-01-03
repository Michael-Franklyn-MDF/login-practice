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