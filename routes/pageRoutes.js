const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'views' });
});

router.get('/UserScreen.html', requireAuth, (req, res) => {
  res.sendFile('UserScreen.html', { root: 'views' });
});

router.get('/interface.html', requireAuth, (req, res) => {
  res.sendFile('interface.html', { root: 'views' });
});

module.exports = router;
