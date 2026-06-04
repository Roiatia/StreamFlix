const express = require('express');
const { getAllPosts, createPost, deletePost } = require('../controllers/postController');

const router = express.Router();

router.get('/posts', getAllPosts);
router.post('/posts', createPost);
router.delete('/posts/:id', deletePost);

module.exports = router;
