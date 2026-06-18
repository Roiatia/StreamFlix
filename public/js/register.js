const registerForm = document.getElementById('registerForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const registerMessage = document.getElementById('registerMessage');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clearRegisterErrors() {
  nameError.textContent = '';
  emailError.textContent = '';
  passwordError.textContent = '';
  registerMessage.textContent = '';
}

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearRegisterErrors();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  let valid = true;

  if (!name) {
    nameError.textContent = 'Name is required.';
    valid = false;
  }

  if (!email) {
    emailError.textContent = 'Email is required.';
    valid = false;
  } else if (!EMAIL_RE.test(email)) {
    emailError.textContent = 'Please enter a valid email address.';
    valid = false;
  }

  if (!password) {
    passwordError.textContent = 'Password is required.';
    valid = false;
  } else if (password.length < 6) {
    passwordError.textContent = 'Password must be at least 6 characters.';
    valid = false;
  }

  if (!valid) return;

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      registerMessage.textContent = result.message || 'Registration failed.';
      return;
    }

    window.location.href = '/';
  } catch (err) {
    registerMessage.textContent = 'Server error. Please try again.';
  }
});