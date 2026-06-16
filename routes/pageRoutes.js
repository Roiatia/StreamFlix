const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

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

module.exports = router;