const express = require('express');
const crypto  = require('crypto');

const app  = express();
const PORT = 3000;


// --- Load data ---

const contentData  = require('./data/content.json');
const personasData = require('./data/personas.json');

// copy to memory so we can add personas without touching the JSON files
const personas       = [...personasData];
const contentItems   = [...contentData.items];
const popularIds     = contentData.popularIds;
const baseLikeCounts = contentData.baseLikeCounts;


// --- Session store ---

const sessions = new Set(); // active session tokens

const VALID_EMAIL    = 'test@example.com';
const VALID_PASSWORD = '123456';
const EMAIL_RE       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


// --- Helpers ---

// reads a named cookie from the request
function getCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const chunk of header.split(';')) {
    const [key, ...val] = chunk.trim().split('=');
    if (key === name) return decodeURIComponent(val.join('='));
  }
  return null;
}

// redirect to login if the user doesn't have a valid session
function requireAuth(req, res, next) {
  const token = getCookie(req, 'session');
  if (token && sessions.has(token)) return next();
  res.redirect('/');
}


// --- Middleware ---

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// only expose these folders — /data stays private
app.use('/css',            express.static('css'));
app.use('/js',             express.static('js'));
app.use('/images',         express.static('images'));
app.use('/content-images', express.static('content-images'));


// --- Public routes ---

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

app.post('/login', (req, res) => {
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

  // login OK — give the user a session token
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


// --- Protected pages ---

app.get('/UserScreen.html', requireAuth, (req, res) => {
  res.sendFile('UserScreen.html', { root: '.' });
});

app.get('/interface.html', requireAuth, (req, res) => {
  res.sendFile('interface.html', { root: '.' });
});


// --- API routes ---

app.get('/api/personas', requireAuth, (req, res) => {
  res.json(personas);
});

app.post('/api/personas', requireAuth, (req, res) => {
  const name = (req.body.name || '').trim();

  if (!name) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (name.length > 30) {
    return res.status(400).json({ error: 'Name must be 30 characters or fewer.' });
  }

  // build an id from the name, e.g. "New User" -> "new-user"
  const id = name.toLowerCase().replace(/\s+/g, '-');

  if (personas.some(p => p.id === id || p.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ error: 'A profile with that name already exists.' });
  }

  const newPersona = {
    id,
    name,
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
  };

  personas.push(newPersona);
  res.status(201).json(newPersona);
});

app.get('/api/content', requireAuth, (req, res) => {
  const personaId = (req.query.persona || 'guest').trim();

  if (!personas.some(p => p.id === personaId)) {
    return res.status(404).json({ error: `Persona '${personaId}' not found.` });
  }

  // get items for this persona; new profiles with no tagged content fall back to guest
  let items = contentItems.filter(item => item.personas.includes(personaId));
  if (items.length === 0) {
    items = contentItems.filter(item => item.personas.includes('guest'));
  }

  // only keep popular IDs that exist in this persona's content
  const itemIds = new Set(items.map(c => c.id));
  const filteredPopularIds = popularIds.filter(id => itemIds.has(id));

  res.json({ items, popularIds: filteredPopularIds, baseLikeCounts });
});


// --- Start ---

app.listen(PORT, () => {
  console.log(`StreamFlix running at http://localhost:${PORT}`);
});
