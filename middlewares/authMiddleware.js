const sessions = new Set();

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
  if (token && sessions.has(token)) return next();
  res.redirect('/');
}

module.exports = { sessions, getCookie, requireAuth };
