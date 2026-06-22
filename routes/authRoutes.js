const express = require('express');
const { login, logout, register, me } = require('../controllers/authController');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);
router.post('/api/auth/register', register);
router.get('/api/auth/me', requireAuth, me);

router.get('/api/admin/check', requireAuth, requireAdmin, (req, res) => {
  res.json({ success: true, role: req.user.role });
});

module.exports = router;
