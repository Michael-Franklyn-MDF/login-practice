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

    if (newPassword !== confirmNewPassword) {
        showMessage('New passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showMessage('New password must be at least 6 characters', 'error');
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
        } else {
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