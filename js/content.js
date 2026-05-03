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

const homeRows = [
  { label: "Trending Now",          filter: c => c.year >= 2020 && c.type !== "Game", trending: true },
  { label: "Popular on StreamFlix", filter: c => [1, 2, 4, 5, 8, 15, 16, 17, 18, 26, 27].includes(c.id) },
  { label: "TV Shows",              filter: c => c.type === "TV Show" },
  { label: "Movies",                filter: c => c.type === "Movie" },
  { label: "Thriller & Crime",      filter: c => ["thriller", "crime"].includes(c.genre) && c.type !== "Game" },
  { label: "Sci-Fi & Fantasy",      filter: c => ["sci-fi", "fantasy"].includes(c.genre) && c.type !== "Game" },
];

// ----- My List (localStorage) -----

function getMyList() {
  try { return JSON.parse(localStorage.getItem("streamflixMyList") || "[]"); }
  catch { return []; }
}

function isInMyList(id) {
  return getMyList().includes(id);
}

function toggleMyList(id) {
  const list = getMyList();
  const idx = list.indexOf(id);
  if (idx === -1) list.push(id); else list.splice(idx, 1);
  localStorage.setItem("streamflixMyList", JSON.stringify(list));

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
  container.innerHTML = homeRows.map(row => {
    const items = streamflixContent.filter(row.filter);
    if (!items.length) return "";
    return renderRow(row.label, items, row.trending);
  }).join("");
  setTimeout(initScrollButtons, 100);
}

window.addEventListener('resize', initScrollButtons);
document.addEventListener("DOMContentLoaded", renderHomeContent);
