const crypto  = require('crypto');
const bcrypt  = require('bcryptjs');
const User    = require('../models/userModel');
const { sessions, getCookie } = require('../middlewares/authMiddleware');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function login(req, res) {
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

  try {
    const user  = await User.findOne({ email: email.toLowerCase() });
    const match = user && await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      return res.redirect(`/?formError=${encodeURIComponent('Invalid email or password.')}`);
    }

    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { userId: user._id.toString(), email: user.email, role: user.role });
    res.cookie('session', token, { httpOnly: true });
    res.redirect('/UserScreen.html');
  } catch (err) {
    res.redirect(`/?formError=${encodeURIComponent('Something went wrong. Please try again.')}`);
  }
}

function logout(req, res) {
  const token = getCookie(req, 'session');
  if (token) sessions.delete(token);
  res.clearCookie('session');
  res.redirect('/');
}

async function register(req, res) {
  const name     = (req.body.name     || '').trim();
  const email    = (req.body.email    || '').trim().toLowerCase();
  const password =  req.body.password || '';

  if (!name) {
    return res.status(400).json({ success: false, message: 'Name is required.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'That email is already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: 'user' });

    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { userId: user._id.toString(), email: user.email, role: user.role });
    res.cookie('session', token, { httpOnly: true });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
}

module.exports = { login, logout, register };
