const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const { getContent } = require('../controllers/contentController');

const router = express.Router();

router.get('/api/content', requireAuth, getContent);

module.exports = router;
