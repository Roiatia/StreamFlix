let streamflixContent = [];
let popularIds = [];
let baseLikeCounts = {};
let personaProfiles = {};

// ----- Server data -----

// load content for the current persona, then load all profiles
async function loadServerData() {
  const personaId = getCurrentPersonaId();

  const contentResponse = await fetch(`/api/content?persona=${personaId}`);
  const contentData = await contentResponse.json();

  if (!contentResponse.ok) {
    console.error(contentData.error || 'Could not load content from server');
    return false;
  }

  streamflixContent = contentData.items;
  popularIds = contentData.popularIds;
  baseLikeCounts = contentData.baseLikeCounts;

  const personasResponse = await fetch('/api/personas');

  if (!personasResponse.ok) {
    console.error('Could not load personas from server');
    return false;
  }

  const personas = await personasResponse.json();

  personaProfiles = {};
  personas.forEach(persona => {
    personaProfiles[persona.id] = persona;
  });

  return true;
}

// ----- Persona state -----

// each profile has its own watched, liked, and list data stored separately in localStorage
function createEmptyPersonaState() {
  return { watchedIds: [], likedIds: [], myListIds: [] };
}

// get the persona from the URL - e.g. ?persona=roi
function getCurrentPersonaId() {
  return new URLSearchParams(window.location.search).get('persona') || 'guest';
}

function getPersonaStorageKey() {
  return `streamflix_persona_${getCurrentPersonaId()}`;
}

// load this persona's saved state from localStorage - start fresh if nothing is there yet
function getPersonaState() {
  try {
    const saved = JSON.parse(localStorage.getItem(getPersonaStorageKey()));
    if (saved && typeof saved === 'object') {
      return {
        watchedIds: Array.isArray(saved.watchedIds) ? saved.watchedIds : [],
        likedIds: Array.isArray(saved.likedIds) ? saved.likedIds : [],
        myListIds: Array.isArray(saved.myListIds) ? saved.myListIds : [],
      };
    }
  } catch { }

  return createEmptyPersonaState();
}

function savePersonaState(state) {
  localStorage.setItem(getPersonaStorageKey(), JSON.stringify(state));
}

// ----- Watched -----

function isWatched(id) {
  return getPersonaState().watchedIds.includes(id);
}

function markContentWatched(id) {
  const state = getPersonaState();

  if (state.watchedIds.includes(id)) {
    updateWatchButtons(id);
    return;
  }

  state.watchedIds.push(id);
  savePersonaState(state);

  if (document.querySelector('.nav-item.active')?.dataset.category === 'home') {
    renderHomeContent();
  } else {
    updateWatchButtons(id);
  }
}

function updateWatchButtons(id) {
  const watched = isWatched(id);

  document.querySelectorAll(`[data-watch-id="${id}"]`).forEach(btn => {
    btn.textContent = watched ? 'Watched' : 'Watch';
    btn.classList.toggle('watched', watched);
  });
}

// ----- Likes -----

function isLiked(id) {
  return getPersonaState().likedIds.includes(id);
}

function getDisplayedLikeCount(id) {
  return (baseLikeCounts[id] || 0) + (isLiked(id) ? 1 : 0);
}

function toggleLike(id) {
  const state = getPersonaState();
  const idx = state.likedIds.indexOf(id);

  if (idx === -1) {
    state.likedIds.push(id);
  } else {
    state.likedIds.splice(idx, 1);
  }

  savePersonaState(state);
  updateLikeButtons(id);
}

// sync all like buttons for this item and play the heart pop animation
function updateLikeButtons(id) {
  const liked = isLiked(id);
  const count = getDisplayedLikeCount(id);

  document.querySelectorAll(`[data-like-id="${id}"]`).forEach(btn => {
    btn.classList.toggle('liked', liked);

    // reading offsetWidth forces a repaint, which restarts the animation
    btn.classList.remove('heart-pop');
    void btn.offsetWidth;
    btn.classList.add('heart-pop');

    btn.addEventListener('animationend', () => {
      btn.classList.remove('heart-pop');
    }, { once: true });
  });

  document.querySelectorAll(`[data-like-count-id="${id}"]`).forEach(span => {
    span.textContent = count;
  });
}

// ----- My List -----

function isInMyList(id) {
  return getPersonaState().myListIds.includes(id);
}

function toggleMyList(id) {
  const state = getPersonaState();
  const idx = state.myListIds.indexOf(id);

  if (idx === -1) {
    state.myListIds.push(id);
  } else {
    state.myListIds.splice(idx, 1);
  }

  savePersonaState(state);

  const inList = isInMyList(id);

  document.querySelectorAll(`[data-list-id="${id}"]`).forEach(btn => {
    btn.textContent = inList ? '✓' : '+';
    btn.classList.toggle('in-list', inList);
    btn.title = inList ? 'Remove from My List' : 'Add to My List';
  });

  // if the user is on the My List tab, refresh it so the change shows right away
  if (document.querySelector('.nav-item.active')?.dataset.category === 'mylist') {
    renderMyList();
  }
}

// ----- Rendering helpers -----

// escape HTML so user data can't break the page or run as a script
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function thumbStyleFor(item) {
  return item.img
    ? `background-image: url('${item.img}'); background-size: cover; background-position: center top;`
    : 'background: #1a1a1a;';
}

function cardInfoHTML(item) {
  return `
    <div class="card-info">
      <p class="card-title">${escapeHtml(item.title)}</p>
      <p class="card-meta">${escapeHtml(item.type)} &middot; ${item.year} &middot; ${escapeHtml(item.rating)}</p>
      <div class="card-actions">
        <button class="card-watch-btn${isWatched(item.id) ? ' watched' : ''}" data-watch-id="${item.id}"
          onclick="markContentWatched(${item.id}); event.stopPropagation()">${isWatched(item.id) ? 'Watched' : 'Watch'}</button>

        <button class="card-like-btn${isLiked(item.id) ? ' liked' : ''}" data-like-id="${item.id}"
          onclick="toggleLike(${item.id}); event.stopPropagation()">&#9829;
          <span data-like-count-id="${item.id}">${getDisplayedLikeCount(item.id)}</span>
        </button>
      </div>
    </div>`;
}

function renderTrendingCard(item, rank) {
  const inList = isInMyList(item.id);

  return `
    <div class="trending-item">
      <span class="trending-number">${rank}</span>
      <div class="content-card" title="${escapeHtml(item.description)}">
        <div class="card-thumb" style="${thumbStyleFor(item)}">
          <button class="card-list-btn${inList ? ' in-list' : ''}" data-list-id="${item.id}"
            onclick="toggleMyList(${item.id}); event.stopPropagation()"
            title="${inList ? 'Remove from My List' : 'Add to My List'}">${inList ? '✓' : '+'}</button>
        </div>
        ${cardInfoHTML(item)}
      </div>
    </div>`;
}

// build a card and save the search text on it as a data attribute so filtering works
function renderCard(item) {
  const inList = isInMyList(item.id);
  const searchText = `${item.title} ${item.description}`.toLowerCase();

  return `
    <div class="content-card" title="${escapeHtml(item.description)}"
         data-feed-post data-search-text="${escapeHtml(searchText)}">
      <div class="card-thumb" style="${thumbStyleFor(item)}">
        <span class="card-genre">${escapeHtml(item.genre)}</span>
        <button class="card-list-btn${inList ? ' in-list' : ''}" data-list-id="${item.id}"
          onclick="toggleMyList(${item.id}); event.stopPropagation()"
          title="${inList ? 'Remove from My List' : 'Add to My List'}">${inList ? '✓' : '+'}</button>
      </div>
      ${cardInfoHTML(item)}
    </div>`;
}

// build a labeled row with scrollable cards and left/right arrows
function renderRow(label, items, trending) {
  const cards = trending
    ? items.slice(0, 10).map((item, i) => renderTrendingCard(item, i + 1)).join('')
    : items.map(renderCard).join('');

  return `
    <div class="content-row${trending ? ' trending-row' : ''}">
      <h3 class="row-label">${escapeHtml(label)}</h3>
      <div class="row-wrapper">
        <button class="scroll-btn scroll-left" onclick="scrollRow(this, -1)">&#10094;</button>
        <div class="row-items">${cards}</div>
        <button class="scroll-btn scroll-right" onclick="scrollRow(this, 1)">&#10095;</button>
      </div>
    </div>`;
}

// ----- Scroll -----

// jump the row left or right by one full page width
function scrollRow(btn, direction) {
  const rowItems = btn.closest('.row-wrapper').querySelector('.row-items');

  const next = Math.max(0, Math.min(
    rowItems.scrollWidth - rowItems.clientWidth,
    rowItems.scrollLeft + direction * rowItems.clientWidth
  ));

  rowItems.scrollTo({ left: next, behavior: 'smooth' });

  setTimeout(() => updateScrollButtons(rowItems), 450);
}

// show or hide the arrows based on how far the row is scrolled
function updateScrollButtons(rowItems) {
  const wrapper = rowItems.closest('.row-wrapper');
  if (!wrapper) return;

  const cur = rowItems.scrollLeft;
  const max = rowItems.scrollWidth - rowItems.clientWidth;

  wrapper.querySelector('.scroll-left')?.classList.toggle('visible', cur > 2);
  wrapper.querySelector('.scroll-right')?.classList.toggle('visible', cur < max - 2);
}

// wire up scroll events on all rows and show/hide their arrows based on position
function initScrollButtons() {
  document.querySelectorAll('.row-items').forEach(rowItems => {
    updateScrollButtons(rowItems);

    if (!rowItems._scrollInit) {
      rowItems._scrollInit = true;
      rowItems.addEventListener('scroll', () => updateScrollButtons(rowItems));
    }
  });
}

// ----- Feed search -----

// hide cards that don't match the search and hide the trending row while searching
function filterFeedPosts(query) {
  const container = document.getElementById('contentRows');
  let visibleCount = 0;

  const trendingRow = container.querySelector('.trending-row');
  if (trendingRow) {
    trendingRow.style.display = 'none';
  }

  container.querySelectorAll('.content-row:not(.trending-row)').forEach(row => {
    let rowVisible = false;

    row.querySelectorAll('[data-feed-post]').forEach(card => {
      const matches = card.dataset.searchText.includes(query);
      card.style.display = matches ? '' : 'none';

      if (matches) {
        visibleCount++;
        rowVisible = true;
      }
    });

    row.style.display = rowVisible ? '' : 'none';
  });

  // show a "no results" message if nothing matched
  let msg = container.querySelector('.feed-no-results');

  if (visibleCount === 0) {
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'feed-no-results empty-state';
      container.appendChild(msg);
    }

    msg.innerHTML = `<p>No results for "<strong>${escapeHtml(query)}</strong>".</p>`;
    msg.style.display = '';
  } else if (msg) {
    msg.style.display = 'none';
  }
}

// show everything again after the search is cleared
function resetFeedSearch() {
  const container = document.getElementById('contentRows');

  const trending = container.querySelector('.trending-row');
  if (trending) {
    trending.style.display = '';
  }

  container.querySelectorAll('.content-row:not(.trending-row)').forEach(row => {
    row.style.display = '';

    row.querySelectorAll('[data-feed-post]').forEach(card => {
      card.style.display = '';
    });
  });

  const msg = container.querySelector('.feed-no-results');
  if (msg) {
    msg.style.display = 'none';
  }
}

// ----- Home feed -----

// decide which rows to show on the home page based on what this persona has watched
function buildPersonaFeedRows() {
  const state = getPersonaState();
  const rows = [];

  const watchedItems = state.watchedIds
    .map(id => streamflixContent.find(c => c.id === id))
    .filter(Boolean);

  if (watchedItems.length > 0) {
    rows.push({ label: 'Continue Watching', items: watchedItems });
  }

  // add up to 2 recommendation rows based on genres from the watch history
  const seenGenres = new Set();

  watchedItems.forEach(watched => {
    if (seenGenres.size >= 2 || seenGenres.has(watched.genre)) {
      return;
    }

    const recs = streamflixContent.filter(
      c => c.genre === watched.genre && !state.watchedIds.includes(c.id)
    );

    if (recs.length >= 2) {
      seenGenres.add(watched.genre);
      rows.push({ label: `Because you watched ${watched.title}`, items: recs });
    }
  });

  if (state.myListIds.length > 0) {
    rows.push({
      label: 'My List',
      items: state.myListIds
        .map(id => streamflixContent.find(c => c.id === id))
        .filter(Boolean),
    });
  }

  rows.push({
    label: 'Trending Now',
    items: streamflixContent.filter(c => c.year >= 2020 && c.type !== 'Game'),
    trending: true,
  });

  rows.push({
    label: 'Popular on StreamFlix',
    items: streamflixContent.filter(c => popularIds.includes(c.id)),
  });

  rows.push({
    label: 'TV Shows',
    items: streamflixContent.filter(c => c.type === 'TV Show'),
  });

  rows.push({
    label: 'Movies',
    items: streamflixContent.filter(c => c.type === 'Movie'),
  });

  // if nothing has been watched yet, fall back to some genre rows
  if (watchedItems.length === 0) {
    rows.push({
      label: 'Thriller & Crime',
      items: streamflixContent.filter(c =>
        ['thriller', 'crime'].includes(c.genre) && c.type !== 'Game'
      ),
    });

    rows.push({
      label: 'Sci-Fi & Fantasy',
      items: streamflixContent.filter(c =>
        ['sci-fi', 'fantasy'].includes(c.genre) && c.type !== 'Game'
      ),
    });
  }

  return rows;
}

// render the home page and skip any rows that have no items
function renderHomeContent() {
  document.getElementById('contentRows').innerHTML = buildPersonaFeedRows()
    .filter(row => row.items.length > 0)
    .map(row => renderRow(row.label, row.items, row.trending))
    .join('');

  setTimeout(initScrollButtons, 100);
}

// ----- Init -----

// put the right name and avatar in the navbar for whoever is logged in
function initNavPersona() {
  const profile = personaProfiles[getCurrentPersonaId()] || personaProfiles.guest;

  const avatarEl = document.getElementById('navAvatar');
  const nameEl = document.getElementById('navPersonaName');

  if (profile) {
    if (avatarEl) avatarEl.src = profile.avatar;
    if (nameEl) nameEl.textContent = profile.name;
  }
}

// arrows might need to show or hide when the window size changes
window.addEventListener('resize', initScrollButtons);

document.addEventListener('DOMContentLoaded', async () => {
  // don't show anything until the server data is ready
  const loaded = await loadServerData();
  if (!loaded) return;

  initNavPersona();
  renderHomeContent();
});