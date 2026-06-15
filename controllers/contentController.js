const Profile = require('../models/profileModel');
const Content = require('../models/contentModel');

async function getContent(req, res) {
  try {
    const personaId = (req.query.persona || 'guest').trim();

    const profile = await Profile.findOne({ legacyId: personaId });
    if (!profile) {
      return res.status(404).json({ error: `Persona '${personaId}' not found.` });
    }

    // new profiles have no content tagged to them yet, so fall back to guest content
    let docs = await Content.find({ personas: personaId });
    if (docs.length === 0) {
      docs = await Content.find({ personas: 'guest' });
    }

    const items = docs.map(doc => ({
      id:          doc.legacyId,
      title:       doc.title,
      type:        doc.type,
      genre:       doc.genre,
      year:        doc.year,
      rating:      doc.rating,
      language:    doc.language,
      description: doc.description,
      img:         doc.img,
      personas:    doc.personas,
    }));

    // only include popularIds that are actually in this persona's visible content
    const itemIdSet = new Set(items.map(i => i.id));
    const popularIds = docs
      .filter(d => d.isPopular && itemIdSet.has(d.legacyId))
      .map(d => d.legacyId);

    const baseLikeCounts = {};
    docs.forEach(d => { baseLikeCounts[String(d.legacyId)] = d.baseLikeCount; });

    res.json({ items, popularIds, baseLikeCounts });
  } catch (err) {
    res.status(500).json({ error: 'Could not load content.' });
  }
}

module.exports = { getContent };
