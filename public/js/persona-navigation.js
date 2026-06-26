(function () {
  const STORAGE_KEY = 'streamflix_active_persona';

  // URL param wins; if present, refresh sessionStorage so other pages inherit it
  const urlPersona = new URLSearchParams(window.location.search).get('persona');
  let activePersona;
  if (urlPersona) {
    activePersona = urlPersona;
    sessionStorage.setItem(STORAGE_KEY, urlPersona);
  } else {
    activePersona = sessionStorage.getItem(STORAGE_KEY);
  }

  if (!activePersona) return;

  const INTERNAL_PATHS = [
    '/interface.html',
    '/advanced-search.html',
    '/statistics.html',
    '/map.html',
    '/content-detail.html',
  ];

  function updateLinks() {
    document.querySelectorAll('a[href]').forEach(function (link) {
      const href = link.getAttribute('href');
      // skip logout, external, and anchor-only links
      if (!href || href === '/logout' || href.startsWith('http') || href.startsWith('#')) return;

      const matched = INTERNAL_PATHS.some(function (path) {
        return href === path || href.startsWith(path + '?');
      });
      if (!matched) return;

      const url = new URL(href, window.location.origin);
      url.searchParams.set('persona', activePersona);
      link.setAttribute('href', url.pathname + '?' + url.searchParams.toString());
    });
  }

  // scripts are at bottom of body so DOM is parsed; DOMContentLoaded fires next
  document.addEventListener('DOMContentLoaded', updateLinks);
})();
