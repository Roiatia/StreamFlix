const Post = require('../models/postModel');

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching posts' });
  }
}

async function createPost(req, res) {
  try {
    const { title, content, author } = req.body;

    if (!title?.trim() || !content?.trim() || !author?.trim()) {
      return res.status(400).json({ success: false, message: 'Title, content, and author are required' });
    }

    const post = await Post.create({ title, content, author });
    res.status(201).json({ success: true, message: 'Post created successfully', post });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating post' });
  }
}

async function updatePost(req, res) {
  try {
    const { title, content, author } = req.body;

    if (!title?.trim() || !content?.trim() || !author?.trim()) {
      return res.status(400).json({ success: false, message: 'Title, content, and author are required' });
    }

    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, author },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, message: 'Post updated successfully', post: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating post' });
  }
}

async function deletePost(req, res) {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting post' });
  }
}

module.exports = { getAllPosts, createPost, updatePost, deletePost };
