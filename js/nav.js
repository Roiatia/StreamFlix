function setActiveNav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');

  if (typeof closeSearch === 'function' && searchOpen) closeSearch();

  document.getElementById("searchOverlay").classList.add("hidden");
  document.getElementById("contentRows").classList.remove("hidden");

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
  const shows = streamflixContent.filter(c => c.type === "TV Show");
  document.getElementById("contentRows").innerHTML =
    categoryHero("TV Shows") + genreRows(shows);
}

function renderMovies() {
  const movies = streamflixContent.filter(c => c.type === "Movie");
  document.getElementById("contentRows").innerHTML =
    categoryHero("Movies") + genreRows(movies);
}

function renderGames() {
  const games = streamflixContent.filter(c => c.type === "Game");
  document.getElementById("contentRows").innerHTML =
    categoryHero("Games") + renderRow("All Games", games);
}

function renderNewAndPopular() {
  const latest = streamflixContent
    .filter(c => c.year >= 2022 && c.type !== "Game")
    .sort((a, b) => b.year - a.year);
  const recent = streamflixContent
    .filter(c => c.year >= 2019 && c.year < 2022 && c.type !== "Game")
    .sort((a, b) => b.year - a.year);

  document.getElementById("contentRows").innerHTML =
    categoryHero("New &amp; Popular") +
    (latest.length ? renderRow("Latest Releases", latest) : "") +
    renderRow("Recently Added", recent);
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
  container.innerHTML =
    categoryHero("My List") + renderRow("Saved Titles", items);
}

function renderByLanguage() {
  const languages = [...new Set(streamflixContent.map(c => c.language))].sort();
  document.getElementById("contentRows").innerHTML =
    categoryHero("Browse by Languages") +
    languages.map(lang =>
      renderRow(escapeHtml(lang), streamflixContent.filter(c => c.language === lang))
    ).join("");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
