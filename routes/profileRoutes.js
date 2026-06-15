const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const { getPersonas, createPersona } = require('../controllers/profileController');

const router = express.Router();

router.get('/api/personas', requireAuth, getPersonas);
router.post('/api/personas', requireAuth, createPersona);

module.exports = router;
