const express = require('express');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');
const { getMovieInfo } = require('../controllers/externalMovieController');

const router = express.Router();

// admin-only — used by the content management page to look movies up on OMDb
router.get('/api/external/movie', requireAuth, requireAdmin, getMovieInfo);

module.exports = router;
