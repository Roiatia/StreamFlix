require('dotenv').config();

const express      = require('express');
const connectDB    = require('./config/db');
const pageRoutes   = require('./routes/pageRoutes');
const authRoutes   = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const contentRoutes = require('./routes/contentRoutes');
const postRoutes   = require('./routes/postRoutes');

connectDB();

const app  = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.use('/', pageRoutes);
app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', contentRoutes);
app.use('/', postRoutes);

app.listen(PORT, "0.0.0.0",() => {
  console.log(`StreamFlix running at http://localhost:${PORT}`);
});
