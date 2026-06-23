const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// page-specific admin guard: requireAuth already attached req.user, so just
// check the role here and bounce non-admins to a normal logged-in page
// instead of the JSON 403 that the API-facing requireAdmin would send.
function requirePageAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.redirect('/UserScreen.html');
}

router.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'views' });
});

router.get('/register.html', (req, res) => {
  res.sendFile('register.html', { root: 'views' });
});

router.get('/UserScreen.html', requireAuth, (req, res) => {
  res.sendFile('UserScreen.html', { root: 'views' });
});

router.get('/interface.html', requireAuth, (req, res) => {
  res.sendFile('interface.html', { root: 'views' });
});

router.get('/advanced-search.html', requireAuth, (req, res) => {
  res.sendFile('advanced-search.html', { root: 'views' });
});

router.get('/statistics.html', requireAuth, (req, res) => {
  res.sendFile('statistics.html', { root: 'views' });
});

router.get('/map.html', requireAuth, (req, res) => {
  res.sendFile('map.html', { root: 'views' });
});

router.get('/admin-content.html', requireAuth, requirePageAdmin, (req, res) => {
  res.sendFile('admin-content.html', { root: 'views' });
});

router.get('/content-detail.html', requireAuth, (req, res) => {
  res.sendFile('content-detail.html', { root: 'views' });
});

module.exports = router;