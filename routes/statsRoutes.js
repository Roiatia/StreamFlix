const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  getContentByGenre,
  getContentByType,
  getViewsByContent,
  getViewsByGenre,
  getLikesByContent,
  getLikesByGenre,
} = require('../controllers/statsController');

const router = express.Router();

router.get('/api/stats/content-by-genre', requireAuth, getContentByGenre);
router.get('/api/stats/content-by-type', requireAuth, getContentByType);
router.get('/api/stats/views-by-content', requireAuth, getViewsByContent);
router.get('/api/stats/views-by-genre', requireAuth, getViewsByGenre);
router.get('/api/stats/likes-by-content', requireAuth, getLikesByContent);
router.get('/api/stats/likes-by-genre', requireAuth, getLikesByGenre);

module.exports = router;
