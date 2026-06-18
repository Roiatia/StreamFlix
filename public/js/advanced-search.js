let allContent = [];

async function loadAllContent() {
  try {
    const response = await fetch('/api/content?persona=guest');
    const data = await response.json();

    if (!response.ok) {
      showSearchError(data.error || 'Could not load content.');
      return;
    }

    allContent = data.items || [];
  } catch (error) {
    showSearchError('Server error while loading content.');
  }
}

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

function runContentSearch() {
  const title = document.getElementById('titleSearch').value.trim().toLowerCase();
  const genre = document.getElementById('genreSearch').value;
  const year = Number(document.getElementById('yearSearch').value);

  const results = allContent.filter(item => {
    const matchesTitle = !title || String(item.title).toLowerCase().includes(title);
    const matchesGenre = !genre || item.genre === genre;
    const matchesYear = !year || Number(item.year) >= year;

    return matchesTitle && matchesGenre && matchesYear;
  });

  renderResults(results);
}

function runMetaSearch() {
  const type = document.getElementById('typeSearch').value;
  const language = document.getElementById('languageSearch').value.trim().toLowerCase();
  const rating = document.getElementById('ratingSearch').value.trim().toLowerCase();

  const results = allContent.filter(item => {
    const matchesType = !type || item.type === type;
    const matchesLanguage = !language || String(item.language || '').toLowerCase().includes(language);
    const matchesRating = !rating || String(item.rating || '').toLowerCase().includes(rating);

    return matchesType && matchesLanguage && matchesRating;
  });

  renderResults(results);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadAllContent();
  renderResults(allContent);
});