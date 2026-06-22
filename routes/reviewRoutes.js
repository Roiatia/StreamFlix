const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  getReviewsForContent,
  createReview,
  updateReview,
  deleteReview,
  searchReviews,
} = require('../controllers/reviewController');

const router = express.Router();

router.get('/api/reviews/search', requireAuth, searchReviews);
router.get('/api/content/:contentId/reviews', requireAuth, getReviewsForContent);
router.post('/api/content/:contentId/reviews', requireAuth, createReview);
router.put('/api/reviews/:id', requireAuth, updateReview);
router.delete('/api/reviews/:id', requireAuth, deleteReview);

module.exports = router;
