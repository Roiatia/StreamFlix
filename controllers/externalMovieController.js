const { logError } = require('../utils/logger');

// Looks up a movie/show on OMDb (an IMDB-style external API) by title.
// Used by the admin content page so admins can auto-fill info instead of
// typing everything by hand.
async function getMovieInfo(req, res) {
  try {
    const title = (req.query.title || '').trim();
    if (!title) {
      return res.status(400).json({ success: false, error: 'title query param is required.' });
    }

    // key lives in .env so we never commit a real one to git
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'OMDb API key is not configured.' });
    }

    const url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`;
    const omdbRes = await fetch(url);
    const data = await omdbRes.json();

    // OMDb always returns 200, so it flags "not found" with Response: "False"
    if (data.Response === 'False') {
      return res.status(404).json({ success: false, error: 'Movie not found.' });
    }

    // trim OMDb's big payload down to just the fields our app cares about
    res.json({
      success: true,
      movie: {
        title:      data.Title,
        year:       data.Year,
        rating:     data.Rated,
        runtime:    data.Runtime,
        genre:      data.Genre,
        plot:       data.Plot,
        poster:     data.Poster,
        imdbRating: data.imdbRating,
      },
    });
  } catch (err) {
    logError('getMovieInfo', err);
    res.status(500).json({ success: false, error: 'Could not reach the OMDb API.' });
  }
}

module.exports = { getMovieInfo };
