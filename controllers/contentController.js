const contentData  = require('../data/content.json');
const { personas } = require('./profileController');

const contentItems   = [...contentData.items];
const popularIds     = contentData.popularIds;
const baseLikeCounts = contentData.baseLikeCounts;

function getContent(req, res) {
  const personaId = (req.query.persona || 'guest').trim();

  if (!personas.some(p => p.id === personaId)) {
    return res.status(404).json({ error: `Persona '${personaId}' not found.` });
  }

  // new profiles have no content tagged to them yet, so fall back to guest content
  let items = contentItems.filter(item => item.personas.includes(personaId));
  if (items.length === 0) {
    items = contentItems.filter(item => item.personas.includes('guest'));
  }

  // trim popularIds down to only the ones this persona actually has
  const itemIds = new Set(items.map(c => c.id));
  const filteredPopularIds = popularIds.filter(id => itemIds.has(id));

  res.json({ items, popularIds: filteredPopularIds, baseLikeCounts });
}

module.exports = { getContent };
