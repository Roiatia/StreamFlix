const express = require('express');

const app = express();
const PORT = 3000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// hard-coded valid user (no sessions yet)
const VALID_USER = { email: 'test@example.com', password: '123456' };

app.use(express.urlencoded({ extended: false }));
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

  // format is valid — now check credentials
  if (email !== VALID_USER.email || password !== VALID_USER.password) {
    return res.redirect(`/?formError=${encodeURIComponent('Invalid email or password.')}`);
  }

  res.redirect('/UserScreen.html');
});

app.listen(PORT, () => {
  console.log(`StreamFlix running at http://localhost:${PORT}`);
});
