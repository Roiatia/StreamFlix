function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showSearchError(message) {
  const container = document.getElementById('advancedSearchResults');
  container.innerHTML = `
    <div class="empty-state">
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function renderResults(items) {
  const container = document.getElementById('advancedSearchResults');

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No results found.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <article class="content-card">
      <div class="card-thumb" style="background-image: url('${escapeHtml(item.img)}'); background-size: cover; background-position: center top;"></div>
      <div class="card-info">
        <p class="card-title">${escapeHtml(item.title)}</p>
        <p class="card-meta">${escapeHtml(item.type)} · ${escapeHtml(item.year)} · ${escapeHtml(item.rating)}</p>
        <p class="card-meta">${escapeHtml(item.genre)} · ${escapeHtml(item.language)}</p>
      </div>
    </article>
  `).join('');
}

// fetch from the search endpoint and render; omits any blank values from the query string
async function fetchAndRender(params) {
  try {
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      if (val !== '' && val != null) query.set(key, val);
    }
    const qs  = query.toString();
    const res  = await fetch('/api/content/search' + (qs ? '?' + qs : ''));
    const data = await res.json();

    if (!res.ok) {
      showSearchError(data.error || 'Could not load content.');
      return;
    }

    renderResults(data.items || []);
  } catch (err) {
    showSearchError('Server error while loading content.');
  }
}

function runContentSearch() {
  const q       = document.getElementById('titleSearch').value.trim();
  const genre   = document.getElementById('genreSearch').value;
  const minYear = document.getElementById('yearSearch').value.trim();
  fetchAndRender({ q, genre, minYear });
}

function runMetaSearch() {
  const type     = document.getElementById('typeSearch').value;
  const language = document.getElementById('languageSearch').value.trim();
  const rating   = document.getElementById('ratingSearch').value.trim();
  fetchAndRender({ type, language, rating });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchAndRender({});
});
