const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  getContentByGenre,
  getContentByType,
  getViewsByContent,
  getViewsByGenre,
} = require('../controllers/statsController');

const router = express.Router();

router.get('/api/stats/content-by-genre', requireAuth, getContentByGenre);
router.get('/api/stats/content-by-type', requireAuth, getContentByType);
router.get('/api/stats/views-by-content', requireAuth, getViewsByContent);
router.get('/api/stats/views-by-genre', requireAuth, getViewsByGenre);

module.exports = router;
