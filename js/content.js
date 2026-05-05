const streamflixContent = [
  { id: 1,  title: "Stranger Things",               type: "TV Show", genre: "sci-fi",    year: 2016, rating: "TV-14", language: "English", description: "A group of kids uncover supernatural mysteries in their small town.", img: "../content-images/StrangerThings.png" },
  { id: 2,  title: "Squid Game",                    type: "TV Show", genre: "thriller",  year: 2021, rating: "TV-MA", language: "Korean",  description: "Desperate players compete in deadly children's games for a huge cash prize.", img: "../content-images/squidGames.jpg" },
  { id: 3,  title: "The Crown",                     type: "TV Show", genre: "drama",     year: 2016, rating: "TV-MA", language: "English", description: "The political rivalries and romance of Queen Elizabeth II's reign.", img: "../content-images/The crown.jpg" },
  { id: 4,  title: "Money Heist",                   type: "TV Show", genre: "thriller",  year: 2017, rating: "TV-MA", language: "Spanish", description: "A gang of robbers takes on the Royal Mint of Spain in a daring heist.", img: "../content-images/MoneyHeist.jpg" },
  { id: 5,  title: "Breaking Bad",                  type: "TV Show", genre: "crime",     year: 2008, rating: "TV-MA", language: "English", description: "A chemistry teacher turned drug kingpin navigates a dangerous criminal world.", img: "../content-images/Breaking bad.jpg" },
  { id: 6,  title: "Dark",                          type: "TV Show", genre: "sci-fi",    year: 2017, rating: "TV-MA", language: "German",  description: "A time travel conspiracy unfolds across four interconnected families.", img: "../content-images/dark.jpg" },
  { id: 7,  title: "Ozark",                         type: "TV Show", genre: "crime",     year: 2017, rating: "TV-MA", language: "English", description: "A financial advisor launders money for a drug cartel in the Missouri Ozarks.", img: "../content-images/ozark.jpg" },
  { id: 8,  title: "The Witcher",                   type: "TV Show", genre: "fantasy",   year: 2019, rating: "TV-MA", language: "English", description: "A mutant monster hunter struggles to find his place in a morally ambiguous world.", img: "../content-images/TheWitcher.jpg" },
  { id: 9,  title: "Wednesday",                     type: "TV Show", genre: "comedy",    year: 2022, rating: "TV-14", language: "English", description: "Wednesday Addams investigates mysteries at her new school.", img: "../content-images/Wednesday.jpg" },
  { id: 10, title: "Peaky Blinders",                type: "TV Show", genre: "crime",     year: 2013, rating: "TV-MA", language: "English", description: "A gangster family epic set in Birmingham, England after World War I.", img: "../content-images/PeakyBLinders.jpg" },
  { id: 11, title: "Narcos",                        type: "TV Show", genre: "crime",     year: 2015, rating: "TV-MA", language: "Spanish", description: "The true story of Colombia's infamously violent and powerful drug cartels.", img: "../content-images/Narcos.jpg" },
  { id: 12, title: "Lupin",                         type: "TV Show", genre: "thriller",  year: 2021, rating: "TV-MA", language: "French",  description: "A gentleman thief inspired by Arsène Lupin seeks revenge against a corrupt family.", img: "../content-images/Lupin.jpg" },
  { id: 13, title: "Emily in Paris",                type: "TV Show", genre: "romance",   year: 2020, rating: "TV-MA", language: "French",  description: "An ambitious American marketing executive moves to Paris for an unexpected job opportunity.", img: "../content-images/EmilyInParis.jpg" },
  { id: 14, title: "Bridgerton",                    type: "TV Show", genre: "romance",   year: 2020, rating: "TV-MA", language: "English", description: "Eight close-knit siblings of the Bridgerton family seek love in Regency London.", img: "../content-images/Bridgerton.jpg" },
  { id: 15, title: "Inception",                     type: "Movie",   genre: "sci-fi",    year: 2010, rating: "PG-13", language: "English", description: "A thief enters dreams to steal secrets from deep within the subconscious.", img: "../content-images/Inception.jpg" },
  { id: 16, title: "Interstellar",                  type: "Movie",   genre: "sci-fi",    year: 2014, rating: "PG-13", language: "English", description: "Astronauts travel through a wormhole in search of a new home for humanity.", img: "../content-images/Interstellar.jpg" },
  { id: 17, title: "The Dark Knight",               type: "Movie",   genre: "action",    year: 2008, rating: "PG-13", language: "English", description: "Batman faces his greatest challenge when the Joker unleashes chaos on Gotham.", img: "../content-images/TheDarkKnight.jpg" },
  { id: 18, title: "Parasite",                      type: "Movie",   genre: "thriller",  year: 2019, rating: "R",     language: "Korean",  description: "A poor family schemes to work for a wealthy household with unexpected results.", img: "../content-images/Parasite.jpg" },
  { id: 19, title: "Bird Box",                      type: "Movie",   genre: "horror",    year: 2018, rating: "R",     language: "English", description: "A mysterious force decimates the population; survivors must blindfold themselves.", img: "../content-images/Birdbox.jpg" },
  { id: 20, title: "Extraction",                    type: "Movie",   genre: "action",    year: 2020, rating: "R",     language: "English", description: "A mercenary is hired to rescue a kidnapped boy from a ruthless gangster.", img: "../content-images/Extraction.jpg" },
  { id: 21, title: "The Platform",                  type: "Movie",   genre: "thriller",  year: 2019, rating: "TV-MA", language: "Spanish", description: "In a prison with vertical food distribution, only the top levels eat well.", img: "../content-images/ThePlatform.jpg" },
  { id: 22, title: "Klaus",                         type: "Movie",   genre: "animation", year: 2019, rating: "PG",    language: "English", description: "A selfish postman forms an unlikely friendship with a mysterious toymaker.", img: "../content-images/Klaus.jpg" },
  { id: 23, title: "The Trial of the Chicago 7",   type: "Movie",   genre: "drama",     year: 2020, rating: "R",     language: "English", description: "Seven defendants are charged with conspiracy at the 1968 Democratic National Convention.", img: "../content-images/Chicago7.jpg" },
  { id: 24, title: "Army of the Dead",              type: "Movie",   genre: "horror",    year: 2021, rating: "R",     language: "English", description: "A group of mercenaries plans a heist in the middle of a zombie apocalypse.", img: "../content-images/ArmyOfTheDead.jpg" },
  { id: 25, title: "Don't Look Up",                type: "Movie",   genre: "comedy",    year: 2021, rating: "R",     language: "English", description: "Two scientists try to warn humanity about a comet heading for Earth.", img: "../content-images/DontLookUp.jpg" },
  { id: 26, title: "The Gray Man",                  type: "Movie",   genre: "action",    year: 2022, rating: "PG-13", language: "English", description: "A CIA operative turned mercenary is hunted across the globe by a psychopathic rival.", img: "../content-images/TheGreyMan.jpg" },
  { id: 27, title: "Glass Onion",                  type: "Movie",   genre: "comedy",    year: 2022, rating: "PG-13", language: "English", description: "Detective Benoit Blanc investigates a murder mystery on a billionaire's private island.", img: "../content-images/GLassOnion.jpg" },
  { id: 28, title: "All Quiet on the Western Front", type: "Movie", genre: "drama",     year: 2022, rating: "R",     language: "German",  description: "A young German soldier experiences the brutal reality of World War I.", img: "../content-images/WestrenFront.jpg" },
  { id: 29, title: "The Irishman",                  type: "Movie",   genre: "crime",     year: 2019, rating: "R",     language: "English", description: "A hitman recalls his work for the mob and his involvement with Jimmy Hoffa.", img: "../content-images/TheIrishman.jpg" },
  { id: 30, title: "Enola Holmes",                  type: "Movie",   genre: "adventure", year: 2020, rating: "PG-13", language: "English", description: "Sherlock Holmes' younger sister sets out to find their missing mother.", img: "../content-images/EnolaHolms.jpg" },
  { id: 31, title: "The Last of Us",               type: "Game",    genre: "horror",    year: 2013, rating: "M",     language: "English", description: "Survive a post-apocalyptic world overrun by infected as you escort a young girl to safety.", img: "../content-images/TheLastOFUS.jpg" },
  { id: 32, title: "Cyberpunk 2077",               type: "Game",    genre: "sci-fi",    year: 2020, rating: "M",     language: "English", description: "Navigate the dangerous streets of Night City as a mercenary fighting for survival.", img: "../content-images/Cyberpunk.jpg" },
  { id: 33, title: "God of War",                   type: "Game",    genre: "fantasy",   year: 2018, rating: "M",     language: "English", description: "Kratos and his son journey through the realms of Norse mythology.", img: "../content-images/GodOfWar.jpg" },
  { id: 34, title: "Among Us",                     type: "Game",    genre: "comedy",    year: 2018, rating: "E",     language: "English", description: "Work together to complete tasks on a spaceship — but watch out for the impostors.", img: "../content-images/AmongUs.jpg" },
  { id: 35, title: "Minecraft",                    type: "Game",    genre: "adventure", year: 2011, rating: "E10+",  language: "English", description: "Build, explore, and survive in an infinite world made entirely of blocks.", img: "../content-images/Minecraft.jpg" },
  { id: 36, title: "GTA V",                        type: "Game",    genre: "action",    year: 2013, rating: "M",     language: "English", description: "Three criminals pull off heists across the sprawling open world of Los Santos.", img: "../content-images/GTAV.jpg" },
];

//temp cover colors - to be deleted !!
const genreColors = {
  "sci-fi":      "#1a6bb5",
  "thriller":    "#8b1a1a",
  "drama":       "#5b2d8e",
  "crime":       "#4a4a4a",
  "action":      "#c0392b",
  "horror":      "#0d0d1a",
  "comedy":      "#c87f0a",
  "romance":     "#9c1560",
  "animation":   "#0e7862",
  "fantasy":     "#1a5c35",
  "adventure":   "#0a5c6e",
  "documentary": "#2c6e49",
};

const popularIds = [1, 2, 4, 5, 8, 15, 16, 17, 18, 26, 27];

function buildPersonaFeedRows() {
  const state = getPersonaState();
  const rows = [];

  const watchedItems = state.watchedIds
    .map(id => streamflixContent.find(c => c.id === id))
    .filter(Boolean);

  if (watchedItems.length > 0) {
    rows.push({ label: "Continue Watching", items: watchedItems });
  }

  const seenGenres = new Set();
  watchedItems.forEach(watched => {
    if (seenGenres.size >= 2 || seenGenres.has(watched.genre)) return;
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
      label: "My List",
      items: state.myListIds.map(id => streamflixContent.find(c => c.id === id)).filter(Boolean),
    });
  }

  rows.push({
    label: "Trending Now",
    items: streamflixContent.filter(c => c.year >= 2020 && c.type !== "Game"),
    trending: true,
  });

  rows.push({
    label: "Popular on StreamFlix",
    items: streamflixContent.filter(c => popularIds.includes(c.id)),
  });

  rows.push({ label: "TV Shows", items: streamflixContent.filter(c => c.type === "TV Show") });
  rows.push({ label: "Movies",   items: streamflixContent.filter(c => c.type === "Movie") });

  if (watchedItems.length === 0) {
    rows.push({ label: "Thriller & Crime", items: streamflixContent.filter(c => ["thriller", "crime"].includes(c.genre) && c.type !== "Game") });
    rows.push({ label: "Sci-Fi & Fantasy", items: streamflixContent.filter(c => ["sci-fi", "fantasy"].includes(c.genre) && c.type !== "Game") });
  }

  return rows;
}

const baseLikeCounts = {
   1: 847,  2: 923,  3: 412,  4: 784,  5: 905,
   6: 523,  7: 618,  8: 741,  9: 689, 10: 577,
  11: 443, 12: 398, 13: 312, 14: 456, 15: 892,
  16: 819, 17: 967, 18: 723, 19: 504, 20: 387,
  21: 276, 22: 445, 23: 334, 24: 291, 25: 612,
  26: 478, 27: 723, 28: 389, 29: 567, 30: 298,
  31: 712, 32: 634, 33: 791, 34: 445, 35: 878, 36: 834,
};

const personaProfiles = {
  roi: {
    name: 'Roi',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
  },
  dan: {
    name: 'Dan',
    avatar: 'data:image/png;base64,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',
  },
  guest: {
    name: 'Guest',
    avatar: 'https://ih1.redbubble.net/image.618427277.3222/flat,1000x1000,075,f.u2.jpg',
  },
};

// ----- Persona state -----

function createEmptyPersonaState() {
  return { watchedIds: [], likedIds: [], myListIds: [] };
}

function getCurrentPersonaId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('persona') || "guest";
}

function getPersonaStorageKey() {
  return `streamflix_persona_${getCurrentPersonaId()}`;
}

function getPersonaState() {
  const key = getPersonaStorageKey();

  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const state = JSON.parse(saved);
      const savedState = state && typeof state === "object" ? state : {};
      const normalizedState = {
        watchedIds: Array.isArray(savedState.watchedIds) ? savedState.watchedIds : [],
        likedIds: Array.isArray(savedState.likedIds) ? savedState.likedIds : [],
        myListIds: Array.isArray(savedState.myListIds) ? savedState.myListIds : [],
      };
      savePersonaState(normalizedState);
      return normalizedState;
    }
  } catch {}

  const emptyState = createEmptyPersonaState();
  localStorage.setItem(key, JSON.stringify(emptyState));
  return emptyState;
}

function savePersonaState(state) {
  localStorage.setItem(getPersonaStorageKey(), JSON.stringify(state));
}

// ----- Watched state -----

function isWatched(id) {
  return getPersonaState().watchedIds.includes(id);
}

function markContentWatched(id) {
  const state = getPersonaState();
  if (!state.watchedIds.includes(id)) {
    state.watchedIds.push(id);
    savePersonaState(state);
    if (document.querySelector('.nav-item.active')?.dataset.category === 'home') {
      renderHomeContent();
      return;
    }
  }
  updateWatchButtons(id);
}

function updateWatchButtons(id) {
  const watched = isWatched(id);
  document.querySelectorAll(`[data-watch-id="${id}"]`).forEach(btn => {
    btn.textContent = watched ? 'Watched' : 'Watch';
    btn.classList.toggle('watched', watched);
  });
}

// ----- Like state -----

function getBaseLikeCount(id) {
  return baseLikeCounts[id] || 0;
}

function isLiked(id) {
  return getPersonaState().likedIds.includes(id);
}

function getDisplayedLikeCount(id) {
  return getBaseLikeCount(id) + (isLiked(id) ? 1 : 0);
}

function toggleLike(id) {
  const state = getPersonaState();
  const idx = state.likedIds.indexOf(id);
  if (idx === -1) state.likedIds.push(id); else state.likedIds.splice(idx, 1);
  savePersonaState(state);
  updateLikeButtons(id);
}

function updateLikeButtons(id) {
  const liked = isLiked(id);
  const count = getDisplayedLikeCount(id);
  document.querySelectorAll(`[data-like-id="${id}"]`).forEach(btn => {
    btn.classList.toggle('liked', liked);
    btn.classList.remove('heart-pop');
    void btn.offsetWidth;
    btn.classList.add('heart-pop');
    btn.addEventListener('animationend', () => btn.classList.remove('heart-pop'), { once: true });
  });
  document.querySelectorAll(`[data-like-count-id="${id}"]`).forEach(span => {
    span.textContent = count;
  });
}

// ----- My List (localStorage) -----

function getMyList() {
  return getPersonaState().myListIds;
}

function isInMyList(id) {
  return getMyList().includes(id);
}

function toggleMyList(id) {
  const state = getPersonaState();
  const idx = state.myListIds.indexOf(id);
  if (idx === -1) state.myListIds.push(id); else state.myListIds.splice(idx, 1);
  savePersonaState(state);

  const inList = isInMyList(id);
  document.querySelectorAll(`[data-list-id="${id}"]`).forEach(btn => {
    btn.textContent = inList ? '✓' : '+';
    btn.classList.toggle('in-list', inList);
    btn.title = inList ? 'Remove from My List' : 'Add to My List';
  });

  const activeEl = document.querySelector('.nav-item.active');
  if (activeEl?.dataset.category === 'mylist' && typeof renderMyList === 'function') {
    renderMyList();
  }
}

// ----- Shared rendering -----

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getFeedSearchText(item) {
  return `${item.title} ${item.postText || item.description || ''}`.toLowerCase();
}

function filterFeedPosts(query) {
  const container = document.getElementById("contentRows");
  let visibleCount = 0;

  container.querySelector('.trending-row').style.display = 'none';

  container.querySelectorAll('.content-row:not(.trending-row)').forEach(row => {
    const cards = row.querySelectorAll('[data-feed-post]');
    let rowVisible = false;
    cards.forEach(card => {
      const matches = (card.dataset.searchText || '').includes(query);
      card.style.display = matches ? '' : 'none';
      if (matches) { visibleCount++; rowVisible = true; }
    });
    row.style.display = rowVisible ? '' : 'none';
  });

  let msg = container.querySelector('.feed-no-results');
  if (visibleCount === 0) {
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'feed-no-results empty-state';
      container.appendChild(msg);
    }
    msg.innerHTML = `<p>No feed posts found for "<strong>${escapeHtml(query)}</strong>".</p>`;
    msg.style.display = '';
  } else if (msg) {
    msg.style.display = 'none';
  }
}

function resetFeedSearch() {
  const container = document.getElementById("contentRows");
  const trending = container.querySelector('.trending-row');
  if (trending) trending.style.display = '';
  container.querySelectorAll('.content-row:not(.trending-row)').forEach(row => {
    row.style.display = '';
    row.querySelectorAll('[data-feed-post]').forEach(card => { card.style.display = ''; });
  });
  const msg = container.querySelector('.feed-no-results');
  if (msg) msg.style.display = 'none';
}

function renderTrendingCard(item, rank) {
  const color = genreColors[item.genre] || "#333";
  const inList = isInMyList(item.id);
  const thumbStyle = item.img
    ? `background-image: url('${item.img}'); background-size: cover; background-position: center top;`
    : `background: linear-gradient(135deg, ${color} 0%, #111 100%);`;
  return `
    <div class="trending-item">
      <span class="trending-number">${rank}</span>
      <div class="content-card" title="${escapeHtml(item.description)}">
        <div class="card-thumb" style="${thumbStyle}">
          <button class="card-list-btn${inList ? ' in-list' : ''}" data-list-id="${item.id}"
            onclick="toggleMyList(${item.id}); event.stopPropagation()"
            title="${inList ? 'Remove from My List' : 'Add to My List'}">${inList ? '✓' : '+'}</button>
        </div>
        <div class="card-info">
          <p class="card-title">${escapeHtml(item.title)}</p>
          <p class="card-meta">${escapeHtml(item.type)} &middot; ${item.year} &middot; ${escapeHtml(item.rating)}</p>
          <div class="card-actions">
            <button class="card-watch-btn${isWatched(item.id) ? ' watched' : ''}" data-watch-id="${item.id}"
              onclick="markContentWatched(${item.id}); event.stopPropagation()">${isWatched(item.id) ? 'Watched' : 'Watch'}</button>
            <button class="card-like-btn${isLiked(item.id) ? ' liked' : ''}" data-like-id="${item.id}"
              onclick="toggleLike(${item.id}); event.stopPropagation()">&#9829; <span data-like-count-id="${item.id}">${getDisplayedLikeCount(item.id)}</span></button>
          </div>
        </div>
      </div>
    </div>`;
}

function renderCard(item) {
  const color = genreColors[item.genre] || "#333";
  const inList = isInMyList(item.id);
  const thumbStyle = item.img
    ? `background-image: url('${item.img}'); background-size: cover; background-position: center top;`
    : `background: linear-gradient(135deg, ${color} 0%, #111 100%);`;
  return `
    <div class="content-card" title="${escapeHtml(item.description)}">
      <div class="card-thumb" style="${thumbStyle}">
        <span class="card-genre">${escapeHtml(item.genre)}</span>
        <button class="card-list-btn${inList ? ' in-list' : ''}" data-list-id="${item.id}"
          onclick="toggleMyList(${item.id}); event.stopPropagation()"
          title="${inList ? 'Remove from My List' : 'Add to My List'}">${inList ? '✓' : '+'}</button>
      </div>
      <div class="card-info">
        <p class="card-title">${escapeHtml(item.title)}</p>
        <p class="card-meta">${escapeHtml(item.type)} &middot; ${item.year} &middot; ${escapeHtml(item.rating)}</p>
        <div class="card-actions">
          <button class="card-watch-btn${isWatched(item.id) ? ' watched' : ''}" data-watch-id="${item.id}"
            onclick="markContentWatched(${item.id}); event.stopPropagation()">${isWatched(item.id) ? 'Watched' : 'Watch'}</button>
          <button class="card-like-btn${isLiked(item.id) ? ' liked' : ''}" data-like-id="${item.id}"
            onclick="toggleLike(${item.id}); event.stopPropagation()">&#9829; <span data-like-count-id="${item.id}">${getDisplayedLikeCount(item.id)}</span></button>
        </div>
      </div>
    </div>`;
}

function renderRow(label, items, trending) {
  const cards = trending
    ? items.slice(0, 10).map((item, i) => renderTrendingCard(item, i + 1)).join("")
    : items.map(renderCard).join("");
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

function scrollRow(btn, direction) {
  const rowItems = btn.closest('.row-wrapper').querySelector('.row-items');
  const next = Math.max(0, Math.min(
    rowItems.scrollWidth - rowItems.clientWidth,
    rowItems.scrollLeft + direction * rowItems.clientWidth
  ));
  rowItems.scrollTo({ left: next, behavior: 'smooth' });
  setTimeout(() => updateScrollButtons(rowItems), 450);
}

function updateScrollButtons(rowItems) {
  const wrapper = rowItems.closest('.row-wrapper');
  if (!wrapper) return;
  const cur = rowItems.scrollLeft;
  const max = rowItems.scrollWidth - rowItems.clientWidth;
  wrapper.querySelector('.scroll-left')?.classList.toggle('visible', cur > 2);
  wrapper.querySelector('.scroll-right')?.classList.toggle('visible', cur < max - 2);
}

function initScrollButtons() {
  document.querySelectorAll('.row-items').forEach(rowItems => {
    updateScrollButtons(rowItems);
    if (!rowItems._scrollInit) {
      rowItems._scrollInit = true;
      rowItems.addEventListener('scroll', () => updateScrollButtons(rowItems));
    }
  });
}

function renderHomeContent() {
  const container = document.getElementById("contentRows");
  container.innerHTML = buildPersonaFeedRows()
    .filter(row => row.items.length > 0)
    .map(row => renderRow(row.label, row.items, row.trending))
    .join("");

  container.querySelectorAll('.content-card').forEach(card => {
    const watchBtn = card.querySelector('[data-watch-id]');
    if (!watchBtn) return;
    const item = streamflixContent.find(c => c.id === parseInt(watchBtn.dataset.watchId));
    if (!item) return;
    card.dataset.feedPost = '';
    card.dataset.searchText = getFeedSearchText(item);
  });

  setTimeout(initScrollButtons, 100);
}

function initNavPersona() {
  const id = getCurrentPersonaId();
  const profile = personaProfiles[id] || personaProfiles.guest;
  const avatarEl = document.getElementById('navAvatar');
  const nameEl   = document.getElementById('navPersonaName');
  if (avatarEl) avatarEl.src = profile.avatar;
  if (nameEl)   nameEl.textContent = profile.name;
}

window.addEventListener('resize', initScrollButtons);
document.addEventListener("DOMContentLoaded", () => {
  initNavPersona();
  renderHomeContent();
});
