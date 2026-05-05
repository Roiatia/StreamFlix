let searchOpen = false;

function toggleSearch() {
  searchOpen = !searchOpen;
  const container = document.getElementById("searchContainer");
  const input = document.getElementById("searchInput");

  if (searchOpen) {
    container.classList.add("open");
    input.focus();
  } else {
    closeSearch();
  }
}

function isHomeFeedActive() {
  return document.querySelector('.nav-item.active')?.dataset.category === 'home';
}

function closeSearch() {
  searchOpen = false;
  const input = document.getElementById("searchInput");
  const container = document.getElementById("searchContainer");
  const overlay = document.getElementById("searchOverlay");
  const contentRows = document.getElementById("contentRows");

  input.value = "";
  container.classList.remove("open");
  overlay.classList.add("hidden");
  contentRows.classList.remove("hidden");
  resetFeedSearch();
}

function handleSearch(query) {
  const overlay = document.getElementById("searchOverlay");
  const contentRows = document.getElementById("contentRows");

  query = query.trim().toLowerCase();

  if (isHomeFeedActive()) {
    if (!query) resetFeedSearch(); else filterFeedPosts(query);
    return;
  }

  if (!query) {
    overlay.classList.add("hidden");
    contentRows.classList.remove("hidden");
    return;
  }

  const results = streamflixContent.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.genre.toLowerCase().includes(query) ||
    item.type.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query) ||
    String(item.year).includes(query)
  );

  contentRows.classList.add("hidden");
  overlay.classList.remove("hidden");
  renderSearchResults(results, query);
}

function renderSearchResults(results, query) {
  const overlay = document.getElementById("searchOverlay");

  if (results.length === 0) {
    overlay.innerHTML = `
      <div class="no-results">
        <p>No results for "<strong>${escapeHtml(query)}</strong>"</p>
        <p class="no-results-sub">Try a different title, genre, or year.</p>
      </div>`;
    return;
  }

  overlay.innerHTML = `
    <h3 class="results-heading">Results for "<span>${escapeHtml(query)}</span>"</h3>
    <div class="results-grid">
      ${results.map(renderCard).join("")}
    </div>`;
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && searchOpen) closeSearch();
});

document.addEventListener("click", e => {
  const container = document.getElementById("searchContainer");
  if (searchOpen && container && !container.contains(e.target)) closeSearch();
});
