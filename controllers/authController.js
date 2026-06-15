const crypto = require('crypto');
const { sessions, getCookie } = require('../middlewares/authMiddleware');

const VALID_EMAIL    = 'test@example.com';
const VALID_PASSWORD = '123456';
const EMAIL_RE       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function login(req, res) {
  const email    = (req.body.email    || '').trim();
  const password =  req.body.password || '';

  if (!email) {
    return res.redirect(`/?emailError=${encodeURIComponent('Email is required.')}`);
  }
  if (!EMAIL_RE.test(email)) {
    return res.redirect(`/?emailError=${encodeURIComponent('Please enter a valid email address.')}`);
  }
  if (!password) {
    return res.redirect(`/?passwordError=${encodeURIComponent('Password is required.')}`);
  }
  if (password.length < 6) {
    return res.redirect(`/?passwordError=${encodeURIComponent('Password must be at least 6 characters.')}`);
  }
  if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
    return res.redirect(`/?formError=${encodeURIComponent('Invalid email or password.')}`);
  }

  const token = crypto.randomBytes(32).toString('hex');
  sessions.add(token);
  res.cookie('session', token, { httpOnly: true });
  res.redirect('/UserScreen.html');
}

function logout(req, res) {
  const token = getCookie(req, 'session');
  if (token) sessions.delete(token);
  res.clearCookie('session');
  res.redirect('/');
}

module.exports = { login, logout };
