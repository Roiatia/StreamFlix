const Post = require('../models/postModel');
const { logOperation, logError } = require('../utils/logger');

function toPostJSON(post, requestingUserId, requestingRole) {
  const isOwner = post.userId && post.userId.toString() === requestingUserId;
  return {
    _id:       post._id,
    title:     post.title,
    content:   post.content,
    author:    post.author,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    canManage: isOwner || requestingRole === 'admin',
  };
}

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      posts: posts.map(p => toPostJSON(p, req.user.userId, req.user.role)),
    });
  } catch (err) {
    logError('getAllPosts', err);
    res.status(500).json({ success: false, message: 'Error fetching posts' });
  }
}

async function createPost(req, res) {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const post = await Post.create({
      title:   title.trim(),
      content: content.trim(),
      author:  req.user.email,   // set server-side from the session, never trusted from browser
      userId:  req.user.userId,
    });

    logOperation('POST_CREATED', `id=${post._id} by=${req.user.email}`);
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: toPostJSON(post, req.user.userId, req.user.role),
    });
  } catch (err) {
    logError('createPost', err);
    res.status(500).json({ success: false, message: 'Error creating post' });
  }
}

async function updatePost(req, res) {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const isOwner = post.userId && post.userId.toString() === req.user.userId;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    post.title   = title.trim();
    post.content = content.trim();
    await post.save();

    logOperation('POST_UPDATED', `id=${post._id} by=${req.user.email}`);
    res.json({
      success: true,
      message: 'Post updated successfully',
      post: toPostJSON(post, req.user.userId, req.user.role),
    });
  } catch (err) {
    logError('updatePost', err);
    res.status(500).json({ success: false, message: 'Error updating post' });
  }
}

async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const isOwner = post.userId && post.userId.toString() === req.user.userId;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    await post.deleteOne();
    logOperation('POST_DELETED', `id=${post._id} by=${req.user.email}`);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    logError('deletePost', err);
    res.status(500).json({ success: false, message: 'Error deleting post' });
  }
}

module.exports = { getAllPosts, createPost, updatePost, deletePost };
