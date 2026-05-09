let searchOpen = false;

// cache DOM elements so we're not querying the DOM on every function call
const searchContainer = document.getElementById('searchContainer');
const searchInput     = document.getElementById('searchInput');
const searchOverlay   = document.getElementById('searchOverlay');
const contentRows     = document.getElementById('contentRows');

// toggle the search bar open/closed when the icon is clicked
function toggleSearch() {
  searchOpen = !searchOpen;
  if (searchOpen) {
    searchContainer.classList.add('open');
    searchInput.focus();
  } else {
    closeSearch();
  }
}

// fully close and reset the search — clears input, hides overlay, restores feed
function closeSearch() {
  searchOpen = false;
  searchInput.value = '';
  searchContainer.classList.remove('open');
  searchOverlay.classList.add('hidden');
  contentRows.classList.remove('hidden');
  resetFeedSearch();
}

// check if the user is currently on the home feed tab
function isHomeFeedActive() {
  return document.querySelector('.nav-item.active')?.dataset.category === 'home';
}

// called on every keystroke in the search input
function handleSearch(query) {
  query = query.trim().toLowerCase();

  // home feed uses inline filtering instead of the overlay
  if (isHomeFeedActive()) {
    if (query) filterFeedPosts(query); else resetFeedSearch();
    return;
  }

  // if the query is cleared, go back to showing the normal content
  if (!query) {
    searchOverlay.classList.add('hidden');
    contentRows.classList.remove('hidden');
    return;
  }

  // filter content by title, genre, type, description, or year
  const results = streamflixContent.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.genre.toLowerCase().includes(query) ||
    item.type.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query) ||
    String(item.year).includes(query)
  );

  // hide the main feed and show the search overlay with results
  contentRows.classList.add('hidden');
  searchOverlay.classList.remove('hidden');
  renderSearchResults(results, query);
}

// renders the search results grid (or a "no results" message) into the overlay
function renderSearchResults(results, query) {
  if (results.length === 0) {
    searchOverlay.innerHTML = `
      <div class="no-results">
        <p>No results for "<strong>${escapeHtml(query)}</strong>"</p>
        <p class="no-results-sub">Try a different title, genre, or year.</p>
      </div>`;
    return;
  }

  searchOverlay.innerHTML = `
    <h3 class="results-heading">Results for "<span>${escapeHtml(query)}</span>"</h3>
    <div class="results-grid">
      ${results.map(renderCard).join('')}
    </div>`;
}

// pressing Escape closes the search bar
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && searchOpen) closeSearch();
});

// clicking anywhere outside the search container closes it
document.addEventListener('click', e => {
  if (searchOpen && !searchContainer.contains(e.target)) closeSearch();
});
