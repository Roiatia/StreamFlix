// regex to check if the email has a basic valid format (something@something.something)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// grab all the form elements we need from the DOM
const form          = document.getElementById('loginForm');
const emailInput    = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const emailError    = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const formError     = document.getElementById('formError');

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
  formError.textContent = '';

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

// if the server redirected back with an error, surface it in the form
const params = new URLSearchParams(window.location.search);
const emailErr = params.get('emailError');
const passErr  = params.get('passwordError');
const credErr  = params.get('formError');

if (emailErr) showError(emailInput, emailError, emailErr);
if (passErr)  showError(passwordInput, passwordError, passErr);
if (credErr)  formError.textContent = credErr;

// block form submission only if client-side validation fails;
// if it passes, the browser POSTs the form to /login naturally
form.addEventListener('submit', (e) => {
  if (!validate()) {
    e.preventDefault();
  }
});

// clear each field's error as soon as the user starts typing in it
emailInput.addEventListener('input',    () => clearError(emailInput, emailError));
passwordInput.addEventListener('input', () => clearError(passwordInput, passwordError));
