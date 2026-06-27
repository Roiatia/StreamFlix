// this demo page is hardcoded to Breaking Bad (legacyId 5 in data/content.json)
const BREAKING_BAD_CONTENT_ID = 5;

// URL param wins, then sessionStorage fallback, then guest
function getCurrentPersonaId() {
  return new URLSearchParams(window.location.search).get('persona')
    || sessionStorage.getItem('streamflix_active_persona')
    || 'guest';
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===== WATCH HISTORY =====

function showWatchMessage(message, type) {
  const el = document.getElementById('watchMessage');
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden', 'post-message-success', 'post-message-error');
  el.classList.add(`post-message-${type}`);
}

async function markEpisodeWatched() {
  const btn = document.getElementById('watchEpisodeBtn');
  if (btn.classList.contains('watched')) return;

  try {
    const res = await fetch('/api/watch-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId: getCurrentPersonaId(),
        contentId: BREAKING_BAD_CONTENT_ID,
        completed: true,
        progressSeconds: 0,
      }),
    });

    let data = null;
    try { data = await res.json(); } catch (err) { /* no body */ }

    if (!res.ok) {
      showWatchMessage((data && data.error) || 'Could not save watch history right now.', 'error');
      return;
    }

    btn.textContent = 'Watched';
    btn.classList.add('watched');
    showWatchMessage('Marked as watched.', 'success');
  } catch (err) {
    showWatchMessage('Could not reach the server. Please try again later.', 'error');
  }
}

// ===== REVIEWS =====

let editingReviewId = null;

function showReviewMessage(msg, type) {
  const el = document.getElementById('reviewMessage');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden', 'post-message-success', 'post-message-error');
  el.classList.add(`post-message-${type}`);
}

function clearReviewMessage() {
  const el = document.getElementById('reviewMessage');
  if (!el) return;
  el.textContent = '';
  el.classList.add('hidden');
  el.classList.remove('post-message-success', 'post-message-error');
}

function formatReviewDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderReviews(reviews) {
  const container = document.getElementById('reviewsList');
  if (!container) return;
  if (!reviews.length) {
    container.innerHTML = '<p class="posts-empty">No reviews yet. Be the first!</p>';
    return;
  }
  const personaId = getCurrentPersonaId();
  container.innerHTML = reviews.map(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const isOwn = String(r.profileId) === String(personaId);
    const actions = isOwn ? `
      <div class="post-actions">
        <button class="post-edit-btn"
          data-id="${escapeHtml(r.id)}"
          data-rating="${r.rating}"
          data-text="${escapeHtml(r.text)}"
          onclick="startEditReview(this)">Edit</button>
        <button class="post-delete-btn" onclick="deleteReview('${escapeHtml(r.id)}')">Delete</button>
      </div>` : '';
    return `
      <div class="post-card">
        <div class="post-header">
          <span class="post-author">${escapeHtml(r.profileId)}</span>
          <span class="review-rating">${stars}</span>
        </div>
        <p class="post-content-text">${escapeHtml(r.text)}</p>
        <div class="review-card-footer">
          <span class="post-date">${formatReviewDate(r.createdAt)}</span>
          ${actions}
        </div>
      </div>`;
  }).join('');
}

async function loadReviews() {
  const container = document.getElementById('reviewsList');
  if (!container) return;
  container.innerHTML = '<p class="posts-empty">Loading…</p>';
  try {
    const res = await fetch(`/api/content/${BREAKING_BAD_CONTENT_ID}/reviews`);
    const data = await res.json();
    if (!res.ok) {
      container.innerHTML = `<p class="posts-empty">${escapeHtml(data.error || 'Could not load reviews.')}</p>`;
      return;
    }
    renderReviews(data.reviews || []);
  } catch (err) {
    container.innerHTML = '<p class="posts-empty">Could not reach the server.</p>';
  }
}

async function searchReviews() {
  const q = document.getElementById('reviewSearchText')?.value.trim() || '';
  const minRating = document.getElementById('reviewSearchMin')?.value || '';
  const container = document.getElementById('reviewsList');
  if (!container) return;
  container.innerHTML = '<p class="posts-empty">Searching…</p>';
  try {
    const params = new URLSearchParams({ contentId: BREAKING_BAD_CONTENT_ID });
    if (q) params.set('q', q);
    if (minRating) params.set('minRating', minRating);
    const res = await fetch('/api/reviews/search?' + params.toString());
    const data = await res.json();
    if (!res.ok) {
      container.innerHTML = `<p class="posts-empty">${escapeHtml(data.error || 'Search failed.')}</p>`;
      return;
    }
    renderReviews(data.reviews || []);
  } catch (err) {
    container.innerHTML = '<p class="posts-empty">Could not reach the server.</p>';
  }
}

function startEditReview(btn) {
  editingReviewId = btn.dataset.id;
  const ratingEl = document.getElementById('reviewRating');
  const textEl   = document.getElementById('reviewText');
  const submitBtn = document.getElementById('reviewSubmitBtn');
  const cancelBtn = document.getElementById('reviewCancelBtn');
  if (ratingEl)  ratingEl.value  = btn.dataset.rating;
  if (textEl)    textEl.value    = btn.dataset.text;
  if (submitBtn) submitBtn.textContent = 'Update Review';
  if (cancelBtn) cancelBtn.classList.remove('hidden');
  clearReviewMessage();
  textEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function cancelReviewEdit() {
  editingReviewId = null;
  const ratingEl  = document.getElementById('reviewRating');
  const textEl    = document.getElementById('reviewText');
  const submitBtn = document.getElementById('reviewSubmitBtn');
  const cancelBtn = document.getElementById('reviewCancelBtn');
  if (ratingEl)  ratingEl.value = '';
  if (textEl)    textEl.value   = '';
  if (submitBtn) submitBtn.textContent = 'Post Review';
  if (cancelBtn) cancelBtn.classList.add('hidden');
  clearReviewMessage();
}

async function handleReviewSubmit() {
  const rating = document.getElementById('reviewRating')?.value;
  const text   = (document.getElementById('reviewText')?.value || '').trim();
  clearReviewMessage();
  if (!rating) {
    showReviewMessage('Please select a rating.', 'error');
    return;
  }
  if (editingReviewId) {
    await doUpdateReview(editingReviewId, rating, text);
  } else {
    await doCreateReview(rating, text);
  }
}

async function doCreateReview(rating, text) {
  try {
    const res = await fetch(`/api/content/${BREAKING_BAD_CONTENT_ID}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: getCurrentPersonaId(), rating: Number(rating), text }),
    });
    const data = await res.json();
    if (!res.ok) {
      showReviewMessage(data.error || 'Could not post review.', 'error');
      return;
    }
    cancelReviewEdit();
    showReviewMessage('Review posted.', 'success');
    await loadReviews();
  } catch (err) {
    showReviewMessage('Could not reach the server.', 'error');
  }
}

async function doUpdateReview(id, rating, text) {
  try {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: Number(rating), text }),
    });
    const data = await res.json();
    if (!res.ok) {
      showReviewMessage(data.error || 'Could not update review.', 'error');
      return;
    }
    cancelReviewEdit();
    showReviewMessage('Review updated.', 'success');
    await loadReviews();
  } catch (err) {
    showReviewMessage('Could not reach the server.', 'error');
  }
}

async function deleteReview(id) {
  if (!confirm('Delete this review?')) return;
  try {
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      showReviewMessage(data.error || 'Could not delete review.', 'error');
      return;
    }
    showReviewMessage('Review deleted.', 'success');
    await loadReviews();
  } catch (err) {
    showReviewMessage('Could not reach the server.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('watchEpisodeBtn')?.addEventListener('click', markEpisodeWatched);

  document.getElementById('reviewSubmitBtn')?.addEventListener('click', handleReviewSubmit);
  document.getElementById('reviewCancelBtn')?.addEventListener('click', cancelReviewEdit);
  document.getElementById('reviewSearchBtn')?.addEventListener('click', searchReviews);
  document.getElementById('reviewClearBtn')?.addEventListener('click', () => {
    const t = document.getElementById('reviewSearchText');
    const m = document.getElementById('reviewSearchMin');
    if (t) t.value = '';
    if (m) m.value = '';
    loadReviews();
  });

  loadReviews();
});
