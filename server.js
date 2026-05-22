const express = require('express');

const app = express();
const PORT = 3000;

// serve static files (css, js, images) from the project root
app.use(express.static('.'));

// GET "/" returns the login page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

app.listen(PORT, () => {
  console.log(`StreamFlix running at http://localhost:${PORT}`);
});
