const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const { getLikesForProfile, toggleLike, getLikeCounts } = require('../controllers/likeController');

const router = express.Router();

router.get('/api/likes', requireAuth, getLikesForProfile);
router.post('/api/likes/toggle', requireAuth, toggleLike);
router.get('/api/likes/counts', requireAuth, getLikeCounts);

module.exports = router;
