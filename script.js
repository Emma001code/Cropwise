// Form handling and validation
document.addEventListener('DOMContentLoaded', function() {
    // Get forms
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    // Signup form handling
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Login form handling
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Add input animations
    addInputAnimations();
});

// Signup form handler
async function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateSignupForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Creating Account...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Account created successfully! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage(result.error || 'Signup failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showMessage('Network error. Please check your connection.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Login form handler
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateLoginForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Signing In...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Login successful!', 'success');
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(result.user));
            setTimeout(() => {
                window.location.href = 'dashboard.html?token=' + result.token;
            }, 1500);
        } else {
            showMessage(result.error || 'Login failed. Please check your credentials.', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Network error. Please check your connection.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Validate signup form
function validateSignupForm(data) {
    const errors = [];
    
    // Username validation
    if (!data.username || data.username.length < 3) {
        errors.push('Username must be at least 3 characters long');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Password validation
    if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    // Confirm password validation
    if (data.password !== data.confirmPassword) {
        errors.push('Passwords do not match');
    }
    
    if (errors.length > 0) {
        showMessage(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Validate login form
function validateLoginForm(data) {
    const errors = [];
    
    // Username/Email validation
    if (!data.username || data.username.trim().length === 0) {
        errors.push('Please enter your username or email');
    }
    
    // Password validation
    if (!data.password || data.password.length === 0) {
        errors.push('Please enter your password');
    }
    
    if (errors.length > 0) {
        showMessage(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Show message to user
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = message;
    
    // Insert message
    const formContainer = document.querySelector('.form-container');
    formContainer.insertBefore(messageDiv, formContainer.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Add input animations
function addInputAnimations() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        // Focus animation
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // Blur animation
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Real-time validation
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });
}

// Validate individual input
function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    
    // Remove existing error styling
    input.classList.remove('error');
    
    // Validate based on input type
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            input.classList.add('error');
        }
    }
    
    if (name === 'password' && value && value.length < 6) {
        input.classList.add('error');
    }
    
    if (name === 'confirmPassword' && value) {
        const password = document.getElementById('password').value;
        if (value !== password) {
            input.classList.add('error');
        }
    }
}

// No automatic redirection - users can always access welcome, login, and signup pages

// Password toggle functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
        toggle.classList.add('active');
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
        toggle.classList.remove('active');
    }
}

// Add CSS for error states
const style = document.createElement('style');
style.textContent = `
    .form-group input.error {
        border-color: #e74c3c;
        background: #fdf2f2;
    }
    
    .form-group.focused label {
        color: #4CAF50;
        transform: translateY(-2px);
        transition: all 0.3s ease;
    }
    
    .form-group.focused input {
        border-color: #4CAF50;
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }
`;
document.head.appendChild(style);
