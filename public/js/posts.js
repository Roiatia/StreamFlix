let editingPostId = null;
let allPosts = [];

function showPostMessage(message, type) {
  const el = document.getElementById('postMessage');
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden', 'post-message-success', 'post-message-error');
  el.classList.add(`post-message-${type}`);
  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(() => el.classList.add('hidden'), 3000);
}

function validatePostForm(title, content) {
  if (title.length < 2) return 'Title must be at least 2 characters.';
  if (content.length < 5) return 'Content must be at least 5 characters.';
  return '';
}

async function loadPosts() {
  try {
    const res = await fetch('/posts');
    const data = await res.json();
    if (data.success) renderPosts(data.posts);
  } catch (err) {
    console.error('Could not load posts:', err);
  }
}

function formatPostDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function renderPosts(posts) {
  allPosts = posts;
  applyPostFilters();
}

function applyPostFilters() {
  const container = document.getElementById('postsContainer');
  if (!container) return;

  const searchQuery = document.getElementById('postSearch')?.value.trim().toLowerCase() || '';
  const authorQuery = document.getElementById('postAuthorFilter')?.value.trim().toLowerCase() || '';

  const filtered = allPosts.filter(post => {
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery) ||
      post.content.toLowerCase().includes(searchQuery);
    const matchesAuthor = !authorQuery || post.author.toLowerCase().includes(authorQuery);
    return matchesSearch && matchesAuthor;
  });

  if (filtered.length === 0) {
    if (allPosts.length === 0) {
      container.innerHTML = '<p class="posts-empty">No posts yet. Be the first to post!</p>';
    } else {
      container.innerHTML = '<p class="posts-empty">No posts match your filters.</p>';
    }
    return;
  }

  container.innerHTML = filtered.map(post => {
    // only show edit/delete for posts this user can manage
    const actions = post.canManage ? `
      <div class="post-actions">
        <button class="post-edit-btn"
          data-id="${post._id}"
          data-title="${escapeHtml(post.title)}"
          data-content="${escapeHtml(post.content)}"
          onclick="startEditPost(this)">Edit</button>
        <button class="post-delete-btn" onclick="deletePost('${post._id}')">Delete</button>
      </div>` : '';

    return `
      <div class="post-card" id="post-${post._id}">
        <div class="post-header">
          <span class="post-author">${escapeHtml(post.author)}</span>
          <div class="post-dates">
            <span>Created: ${formatPostDate(post.createdAt)}</span>
            <span>Updated: ${formatPostDate(post.updatedAt || post.createdAt)}</span>
          </div>
        </div>
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        <p class="post-content-text">${escapeHtml(post.content)}</p>
        ${actions}
      </div>`;
  }).join('');
}

function handlePostSubmit(event) {
  event.preventDefault();
  if (editingPostId) {
    updatePost();
  } else {
    createPost();
  }
}

function startEditPost(btn) {
  editingPostId = btn.dataset.id;
  document.getElementById('postTitle').value = btn.dataset.title;
  document.getElementById('postContent').value = btn.dataset.content;
  document.getElementById('postSubmitBtn').textContent = 'Update';
  document.getElementById('cancelEditBtn').classList.remove('hidden');
  document.getElementById('postTitle').focus();
}

function cancelEdit() {
  editingPostId = null;
  document.getElementById('postForm').reset();
  document.getElementById('postSubmitBtn').textContent = 'Post';
  document.getElementById('cancelEditBtn').classList.add('hidden');
}

function getPostFormData() {
  return {
    title:   document.getElementById('postTitle').value.trim(),
    content: document.getElementById('postContent').value.trim(),
  };
}

async function updatePost() {
  const { title, content } = getPostFormData();

  const error = validatePostForm(title, content);
  if (error) {
    showPostMessage(error, 'error');
    return;
  }

  try {
    const res = await fetch(`/posts/${editingPostId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();

    if (data.success) {
      cancelEdit();
      loadPosts();
      showPostMessage('Post updated successfully.', 'success');
    } else {
      showPostMessage(data.message || 'Could not update post.', 'error');
    }
  } catch (err) {
    showPostMessage('Could not update post.', 'error');
  }
}

async function createPost() {
  const { title, content } = getPostFormData();

  const error = validatePostForm(title, content);
  if (error) {
    showPostMessage(error, 'error');
    return;
  }

  try {
    const res = await fetch('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();

    if (data.success) {
      document.getElementById('postForm').reset();
      loadPosts();
      showPostMessage('Post created successfully.', 'success');
    } else {
      showPostMessage(data.message || 'Could not create post.', 'error');
    }
  } catch (err) {
    showPostMessage('Could not create post.', 'error');
  }
}

async function deletePost(postId) {
  const confirmed = confirm('Are you sure you want to delete this post?');
  if (!confirmed) return;

  try {
    const res = await fetch(`/posts/${postId}`, { method: 'DELETE' });
    const data = await res.json();

    if (data.success) {
      allPosts = allPosts.filter(p => p._id !== postId);
      applyPostFilters();
      showPostMessage('Post deleted successfully.', 'success');
    } else {
      showPostMessage(data.message || 'Could not delete post.', 'error');
    }
  } catch (err) {
    showPostMessage('Could not delete post.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const postForm = document.getElementById('postForm');
  if (!postForm) return;
  postForm.addEventListener('submit', handlePostSubmit);
  loadPosts();
});
