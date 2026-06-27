// ----- Persona state -----

// each profile has its own watched, liked, and list data stored separately in localStorage
function createEmptyPersonaState() {
  return { watchedIds: [], likedIds: [], myListIds: [] };
}

// URL param wins, then sessionStorage fallback, then guest
function getCurrentPersonaId() {
  return new URLSearchParams(window.location.search).get('persona')
    || sessionStorage.getItem('streamflix_active_persona')
    || 'guest';
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
        likedIds:   Array.isArray(saved.likedIds)   ? saved.likedIds   : [],
        myListIds:  Array.isArray(saved.myListIds)  ? saved.myListIds  : [],
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

// pull this profile's watch history from MongoDB and merge it into the local
// state, so a fresh browser/device still shows the right watched cards
async function loadServerWatchHistory() {
  try {
    const res = await fetch(`/api/watch-history?profile=${getCurrentPersonaId()}`);
    if (!res.ok) {
      console.warn('Could not load watch history from the server; using local storage only.');
      return;
    }

    const data = await res.json();
    const serverWatchedIds = (data.items || []).map(item => item.contentId);

    const state = getPersonaState();
    state.watchedIds = [...new Set([...state.watchedIds, ...serverWatchedIds])];
    savePersonaState(state);
  } catch (err) {
    console.warn('Could not reach the watch history API; using local storage only.', err);
  }
}

async function markContentWatched(id) {
  const state = getPersonaState();

  if (state.watchedIds.includes(id)) {
    updateWatchButtons(id);
    return;
  }

  try {
    const res = await fetch('/api/watch-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId:       getCurrentPersonaId(),
        contentId:       id,
        completed:       true,
        progressSeconds: 0,
      }),
    });

    if (!res.ok) {
      console.warn('Could not save watch history to the server; using local storage only.');
    }
  } catch (err) {
    console.warn('Could not reach the watch history API; using local storage only.', err);
  }

  // update local state regardless of whether the API call succeeded, so the
  // UI keeps working even when the server/network is unavailable
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
