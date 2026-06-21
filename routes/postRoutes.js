const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const { getAllPosts, createPost, updatePost, deletePost } = require('../controllers/postController');

const router = express.Router();

router.get('/posts',       requireAuth, getAllPosts);
router.post('/posts',      requireAuth, createPost);
router.put('/posts/:id',   requireAuth, updatePost);
router.delete('/posts/:id', requireAuth, deletePost);

module.exports = router;
