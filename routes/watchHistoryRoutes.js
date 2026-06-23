const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  upsertWatchHistory,
  getWatchHistory,
  deleteWatchHistory,
  getPersonalFeed,
} = require('../controllers/watchHistoryController');

const router = express.Router();

router.post('/api/watch-history', requireAuth, upsertWatchHistory);
router.get('/api/watch-history', requireAuth, getWatchHistory);
router.delete('/api/watch-history/:contentId', requireAuth, deleteWatchHistory);

router.get('/api/feed/personal', requireAuth, getPersonalFeed);

module.exports = router;
