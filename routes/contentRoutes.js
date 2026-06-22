const express = require('express');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');
const {
  getContent,
  searchContent,
  listAdminContent,
  createContent,
  updateContent,
  deleteContent,
} = require('../controllers/contentController');

const router = express.Router();

router.get('/api/content/search', requireAuth, searchContent);
router.get('/api/content', requireAuth, getContent);

router.get('/api/admin/content', requireAuth, requireAdmin, listAdminContent);
router.post('/api/admin/content', requireAuth, requireAdmin, createContent);
router.put('/api/admin/content/:id', requireAuth, requireAdmin, updateContent);
router.delete('/api/admin/content/:id', requireAuth, requireAdmin, deleteContent);

module.exports = router;
