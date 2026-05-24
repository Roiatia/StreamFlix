const express = require('express');
const crypto  = require('crypto');

const app  = express();
const PORT = 3000;

const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_USER = { email: 'test@example.com', password: '123456' };

// in-memory session store: token strings
const sessions = new Set();

// load seed data from JSON files — mutable in-memory copies only
const { items: initialContent, popularIds, baseLikeCounts } = require('./data/content.json');
const initialPersonas = require('./data/personas.json');

const streamflixContent = [...initialContent];
const personas          = [...initialPersonas];

// read one named cookie from the request header
function getCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const chunk of header.split(';')) {
    const [k, ...v] = chunk.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

// block access to protected routes unless a valid session cookie exists
function requireAuth(req, res, next) {
  const token = getCookie(req, 'session');
  if (token && sessions.has(token)) return next();
  res.redirect('/');
}

app.use(express.urlencoded({ extended: false }));

// protected routes must be registered before express.static so static
// can't serve these files directly to unauthenticated requests
app.get('/api/personas', requireAuth, (req, res) => {
  res.json(personas);
});

app.get('/api/content', requireAuth, (req, res) => {
  res.json({ items: streamflixContent, popularIds, baseLikeCounts });
});

app.get('/UserScreen.html', requireAuth, (req, res) => {
  res.sendFile('UserScreen.html', { root: '.' });
});
app.get('/interface.html', requireAuth, (req, res) => {
  res.sendFile('interface.html', { root: '.' });
});

// everything else (css, js, images …) served as-is
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

app.post('/login', (req, res) => {
  const email    = (req.body.email    || '').trim();
  const password =  req.body.password || '';

  // server-side validation — same rules as the client
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

  if (email !== VALID_USER.email || password !== VALID_USER.password) {
    return res.redirect(`/?formError=${encodeURIComponent('Invalid email or password.')}`);
  }

  // credentials valid — issue a session token and store it in a cookie
  const token = crypto.randomBytes(32).toString('hex');
  sessions.add(token);
  res.cookie('session', token, { httpOnly: true });
  res.redirect('/UserScreen.html');
});

app.get('/logout', (req, res) => {
  const token = getCookie(req, 'session');
  if (token) sessions.delete(token);
  res.clearCookie('session');
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`StreamFlix running at http://localhost:${PORT}`);
});
