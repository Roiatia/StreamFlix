const personasData = require('../data/personas.json');

// in-memory copy so new profiles don't touch the JSON file
const personas = [...personasData];

function getPersonas(req, res) {
  res.json(personas);
}

function createPersona(req, res) {
  const name = (req.body.name || '').trim();

  if (!name) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (name.length > 30) {
    return res.status(400).json({ error: 'Name must be 30 characters or fewer.' });
  }

  // build an id from the name, e.g. "New User" -> "new-user"
  const id = name.toLowerCase().replace(/\s+/g, '-');

  if (personas.some(p => p.id === id || p.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ error: 'A profile with that name already exists.' });
  }

  const newPersona = {
    id,
    name,
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
  };

  personas.push(newPersona);
  res.status(201).json(newPersona);
}

module.exports = { personas, getPersonas, createPersona };
