let currentCatalogCategory = null;
let currentAlphabetLetter = 'all';

function setActiveNav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');

  if (typeof closeSearch === 'function' && searchOpen) closeSearch();

  document.getElementById("searchOverlay").classList.add("hidden");
  document.getElementById("contentRows").classList.remove("hidden");

  currentAlphabetLetter = 'all';
  renderCategory(el.dataset.category);
}

function renderCategory(category) {
  switch (category) {
    case 'home':       renderHomeContent();   break;
    case 'tvshows':    renderTVShows();       break;
    case 'movies':     renderMovies();        break;
    case 'games':      renderGames();         break;
    case 'newpopular': renderNewAndPopular(); break;
    case 'mylist':     renderMyList();        break;
    case 'languages':  renderByLanguage();    break;
  }
}

// ----- Alphabet filter -----

function renderAlphabetFilter(activeLetter) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const allBtn = `<button class="alpha-btn${activeLetter === 'all' ? ' active' : ''}" onclick="setAlphabetFilter('all')">All</button>`;
  const letterBtns = letters.map(l =>
    `<button class="alpha-btn${activeLetter === l ? ' active' : ''}" onclick="setAlphabetFilter('${l}')">${l}</button>`
  ).join('');
  return `<div class="alphabet-filter">${allBtn}${letterBtns}</div>`;
}

function filterItemsByLetter(items, letter) {
  if (letter === 'all') return items;
  return items
    .filter(c => c.title.toUpperCase().startsWith(letter))
    .sort((a, b) => a.title.localeCompare(b.title));
}

function renderCatalogWithAlphabet(title, items, activeLetter) {
  const hero = categoryHero(title);
  const filter = renderAlphabetFilter(activeLetter);

  if (activeLetter === 'all') {
    return hero + filter + genreRows(items);
  }

  const filtered = filterItemsByLetter(items, activeLetter);
  if (filtered.length === 0) {
    return hero + filter + `<div class="catalog-empty">No titles starting with "<strong>${activeLetter}</strong>".</div>`;
  }
  return hero + filter + renderRow(`Titles: ${activeLetter}`, filtered);
}

function setAlphabetFilter(letter) {
  currentAlphabetLetter = letter;
  renderCategory(currentCatalogCategory);
}

// ----- Category renderers -----

function setContentHTML(html) {
  document.getElementById("contentRows").innerHTML = html;
  setTimeout(initScrollButtons, 100);
}

function categoryHero(title) {
  return `<div class="category-hero"><h2>${title}</h2></div>`;
}

function genreRows(items) {
  const genres = [...new Set(items.map(c => c.genre))];
  return genres.map(genre =>
    renderRow(capitalize(genre), items.filter(c => c.genre === genre))
  ).join("");
}

function renderTVShows() {
  currentCatalogCategory = 'tvshows';
  setContentHTML(renderCatalogWithAlphabet("TV Shows", streamflixContent.filter(c => c.type === "TV Show"), currentAlphabetLetter));
}

function renderMovies() {
  currentCatalogCategory = 'movies';
  setContentHTML(renderCatalogWithAlphabet("Movies", streamflixContent.filter(c => c.type === "Movie"), currentAlphabetLetter));
}

function renderGames() {
  currentCatalogCategory = 'games';
  const games = streamflixContent.filter(c => c.type === "Game");
  if (currentAlphabetLetter === 'all') {
    setContentHTML(categoryHero("Games") + renderAlphabetFilter('all') + renderRow("All Games", games));
  } else {
    setContentHTML(renderCatalogWithAlphabet("Games", games, currentAlphabetLetter));
  }
}

function renderNewAndPopular() {
  currentCatalogCategory = 'newpopular';
  const allItems = streamflixContent.filter(c => c.type !== "Game");

  if (currentAlphabetLetter !== 'all') {
    setContentHTML(renderCatalogWithAlphabet("New &amp; Popular", allItems, currentAlphabetLetter));
    return;
  }

  const latest = allItems.filter(c => c.year >= 2022).sort((a, b) => b.year - a.year);
  const recent = allItems.filter(c => c.year >= 2019 && c.year < 2022).sort((a, b) => b.year - a.year);
  setContentHTML(
    categoryHero("New &amp; Popular") +
    renderAlphabetFilter('all') +
    (latest.length ? renderRow("Latest Releases", latest) : "") +
    renderRow("Recently Added", recent)
  );
}

function renderMyList() {
  const ids = getMyList();
  const container = document.getElementById("contentRows");

  if (ids.length === 0) {
    container.innerHTML = `
      ${categoryHero("My List")}
      <div class="empty-state">
        <p>Your list is empty.</p>
        <p class="empty-sub">Browse and click <strong>+</strong> on any title to save it here.</p>
      </div>`;
    return;
  }

  const items = ids.map(id => streamflixContent.find(c => c.id === id)).filter(Boolean);
  setContentHTML(categoryHero("My List") + renderRow("Saved Titles", items));
}

function renderByLanguage() {
  const languages = [...new Set(streamflixContent.map(c => c.language))].sort();
  setContentHTML(
    categoryHero("Browse by Languages") +
    languages.map(lang =>
      renderRow(escapeHtml(lang), streamflixContent.filter(c => c.language === lang))
    ).join("")
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
