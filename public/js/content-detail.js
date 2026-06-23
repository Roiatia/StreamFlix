// this demo page is hardcoded to Breaking Bad (legacyId 5 in data/content.json)
const BREAKING_BAD_CONTENT_ID = 5;

function getCurrentPersonaId() {
  return new URLSearchParams(window.location.search).get('persona') || 'guest';
}

function showWatchMessage(message, type) {
  const el = document.getElementById('watchMessage');
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden', 'post-message-success', 'post-message-error');
  el.classList.add(`post-message-${type}`);
}

async function markEpisodeWatched() {
  const btn = document.getElementById('watchEpisodeBtn');
  if (btn.classList.contains('watched')) return;

  try {
    const res = await fetch('/api/watch-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId: getCurrentPersonaId(),
        contentId: BREAKING_BAD_CONTENT_ID,
        completed: true,
        progressSeconds: 0,
      }),
    });

    let data = null;
    try { data = await res.json(); } catch (err) { /* no body */ }

    if (!res.ok) {
      showWatchMessage((data && data.error) || 'Could not save watch history right now.', 'error');
      return;
    }

    btn.textContent = 'Watched';
    btn.classList.add('watched');
    showWatchMessage('Marked as watched.', 'success');
  } catch (err) {
    showWatchMessage('Could not reach the server. Please try again later.', 'error');
  }
}

// if the demo episode file can't be loaded, swap in a friendly placeholder
// instead of leaving a broken video box on the page
function handleVideoError() {
  document.getElementById('episodeVideo')?.classList.add('hidden');
  document.getElementById('videoFallback')?.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('watchEpisodeBtn')?.addEventListener('click', markEpisodeWatched);
  document.getElementById('episodeVideo')?.addEventListener('error', handleVideoError, true);
});
