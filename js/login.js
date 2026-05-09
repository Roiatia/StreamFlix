// regex to check if the email has a basic valid format (something@something.something)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// grab all the form elements we need from the DOM
const form          = document.getElementById('loginForm');
const emailInput    = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const emailError    = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// highlight the field in red and show the error message below it
function showError(input, msgEl, message) {
  input.classList.add('input-error');
  msgEl.textContent = message;
}

// remove the red border and clear the error message
function clearError(input, msgEl) {
  input.classList.remove('input-error');
  msgEl.textContent = '';
}

// validate all fields and return true only if everything passes
function validate() {
  let valid = true;

  // reset any previous errors before re-validating
  clearError(emailInput, emailError);
  clearError(passwordInput, passwordError);

  const email    = emailInput.value.trim();
  const password = passwordInput.value;

  // check email: can't be empty, and must match the expected format
  if (!email) {
    showError(emailInput, emailError, 'Email is required.');
    valid = false;
  } else if (!EMAIL_RE.test(email)) {
    showError(emailInput, emailError, 'Please enter a valid email address.');
    valid = false;
  }

  // check password: can't be empty, and must be at least 6 characters
  if (!password) {
    showError(passwordInput, passwordError, 'Password is required.');
    valid = false;
  } else if (password.length < 6) {
    showError(passwordInput, passwordError, 'Password must be at least 6 characters.');
    valid = false;
  }

  return valid;
}

// listen for form submission — preventDefault stops the page from reloading
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // only redirect if all fields are valid
  if (validate()) {
    window.location.href = 'UserScreen.html';
  }
});

// clear each field's error as soon as the user starts typing in it
emailInput.addEventListener('input', () => clearError(emailInput, emailError));
passwordInput.addEventListener('input', () => clearError(passwordInput, passwordError));
