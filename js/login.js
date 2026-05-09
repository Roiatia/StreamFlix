const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const form          = document.getElementById('loginForm');
const emailInput    = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const emailError    = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

function showError(input, msgEl, message) {
  input.classList.add('input-error');
  msgEl.textContent = message;
}

function clearError(input, msgEl) {
  input.classList.remove('input-error');
  msgEl.textContent = '';
}

function validate() {
  let valid = true;

  clearError(emailInput, emailError);
  clearError(passwordInput, passwordError);

  const email    = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email) {
    showError(emailInput, emailError, 'Email is required.');
    valid = false;
  } else if (!EMAIL_RE.test(email)) {
    showError(emailInput, emailError, 'Please enter a valid email address.');
    valid = false;
  }

  if (!password) {
    showError(passwordInput, passwordError, 'Password is required.');
    valid = false;
  } else if (password.length < 6) {
    showError(passwordInput, passwordError, 'Password must be at least 6 characters.');
    valid = false;
  }

  return valid;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validate()) {
    window.location.href = 'UserScreen.html';
  }
});

// Clear individual field error as soon as the user starts correcting it
emailInput.addEventListener('input', () => clearError(emailInput, emailError));
passwordInput.addEventListener('input', () => clearError(passwordInput, passwordError));
