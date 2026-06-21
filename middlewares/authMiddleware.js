// token -> { userId, email, role }
const sessions = new Map();

// page routes that should redirect to / when unauthenticated (everything else gets 401 JSON)
const PAGE_PATHS = new Set([
  '/UserScreen.html',
  '/interface.html',
  '/advanced-search.html',
  '/statistics.html',
  '/map.html',
]);

function getCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const chunk of header.split(';')) {
    const [key, ...val] = chunk.trim().split('=');
    if (key === name) return decodeURIComponent(val.join('='));
  }
  return null;
}

function requireAuth(req, res, next) {
  const token = getCookie(req, 'session');
  const session = token && sessions.get(token);
  if (session) {
    req.user = session;
    return next();
  }
  if (PAGE_PATHS.has(req.path)) {
    return res.redirect('/');
  }
  res.status(401).json({ error: 'Not authenticated.' });
}

function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ error: 'Forbidden.' });
}

module.exports = { sessions, getCookie, requireAuth, requireAdmin };
