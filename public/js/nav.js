// check who's logged in and, if they're an admin, drop an Admin link into the nav bar
async function initAdminNavLink() {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) return;

    const data = await res.json();
    if (!data.authenticated || !data.user || data.user.role !== 'admin') return;

    const nav = document.querySelector('.navigation');
    if (!nav || nav.querySelector('.admin-nav-link')) return;

    const link = document.createElement('a');
    link.href = '/admin-content.html';
    link.className = 'nav-item admin-nav-link';
    link.textContent = 'Admin';
    nav.appendChild(link);
  } catch (err) {
    // not logged in or request failed — just skip showing the admin link
  }
}

document.addEventListener('DOMContentLoaded', initAdminNavLink);

// called when a nav link is clicked — updates the active style and renders the right page
function setActiveNav(el) {
  // remove 'active' from all nav items, then add it only to the clicked one
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');

  // close the search bar if it's open
  if (typeof closeSearch === 'function' && searchOpen) closeSearch();

  // make sure the overlay is hidden and the main content is visible
  document.getElementById('searchOverlay').classList.add('hidden');
  document.getElementById('contentRows').classList.remove('hidden');

  renderCategory(el.dataset.category);
}

// routes the category string to the correct render function
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

// shared helper — sets the page HTML and initializes the scroll buttons after the DOM updates
function setPageContent(html) {
  document.getElementById('contentRows').innerHTML = html;
  setTimeout(initScrollButtons, 100);
}

// returns a hero banner HTML string for the top of each category page
function categoryHero(title) {
  return `<div class="category-hero"><h2>${title}</h2></div>`;
}

// capitalizes the first letter of a string (used for genre labels)
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// groups a list of items by genre and renders a separate row for each one
function genreRows(items) {
  return [...new Set(items.map(c => c.genre))]  // get unique genres using a Set
    .map(genre => renderRow(capitalize(genre), items.filter(c => c.genre === genre)))
    .join('');
}

function renderTVShows() {
  const shows = streamflixContent.filter(c => c.type === 'TV Show');
  setPageContent(categoryHero('TV Shows') + genreRows(shows));
}

function renderMovies() {
  const movies = streamflixContent.filter(c => c.type === 'Movie');
  setPageContent(categoryHero('Movies') + genreRows(movies));
}

function renderGames() {
  const games = streamflixContent.filter(c => c.type === 'Game');
  setPageContent(categoryHero('Games') + renderRow('All Games', games));
}

function renderNewAndPopular() {
  // split into two groups: very recent (2022+) and somewhat recent (2019–2021)
  const latest = streamflixContent
    .filter(c => c.year >= 2022 && c.type !== 'Game')
    .sort((a, b) => b.year - a.year);
  const recent = streamflixContent
    .filter(c => c.year >= 2019 && c.year < 2022 && c.type !== 'Game')
    .sort((a, b) => b.year - a.year);

  setPageContent(
    categoryHero('New &amp; Popular') +
    (latest.length ? renderRow('Latest Releases', latest) : '') +
    renderRow('Recently Added', recent)
  );
}

function renderMyList() {
  const ids = getPersonaState().myListIds;

  // show an empty state message if the user hasn't added anything yet
  if (ids.length === 0) {
    setPageContent(`
      ${categoryHero('My List')}
      <div class="empty-state">
        <p>Your list is empty.</p>
        <p class="empty-sub">Browse and click <strong>+</strong> on any title to save it here.</p>
      </div>`);
    return;
  }

  // map the saved IDs back to the actual content objects
  const items = ids.map(id => streamflixContent.find(c => c.id === id)).filter(Boolean);
  setPageContent(categoryHero('My List') + renderRow('Saved Titles', items));
}

function renderByLanguage() {
  // collect unique languages, sort alphabetically, then build a row for each
  const rows = [...new Set(streamflixContent.map(c => c.language))]
    .sort()
    .map(lang => renderRow(escapeHtml(lang), streamflixContent.filter(c => c.language === lang)))
    .join('');
  setPageContent(categoryHero('Browse by Languages') + rows);
}
