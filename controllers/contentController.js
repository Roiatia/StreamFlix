const Profile = require('../models/profileModel');
const Content = require('../models/contentModel');

const REQUIRED_CONTENT_FIELDS = ['title', 'type', 'genre', 'year', 'rating', 'description'];
const UPDATABLE_CONTENT_FIELDS = ['title', 'type', 'genre', 'year', 'rating', 'description', 'language', 'img', 'personas', 'baseLikeCount', 'isPopular'];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toFrontendItem(doc) {
  return {
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
  };
}

function toAdminItem(doc) {
  return {
    id:            doc.legacyId,
    title:         doc.title,
    type:          doc.type,
    genre:         doc.genre,
    year:          doc.year,
    rating:        doc.rating,
    language:      doc.language,
    description:   doc.description,
    img:           doc.img,
    personas:      doc.personas,
    baseLikeCount: doc.baseLikeCount,
    isPopular:     doc.isPopular,
  };
}

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

    const items = docs.map(toFrontendItem);

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

async function searchContent(req, res) {
  try {
    const { q, genre, type, year, minYear, maxYear, rating, language } = req.query;
    const filter = {};

    if (q) {
      const escaped = escapeRegex(String(q).trim());
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
      ];
    }
    if (genre)    filter.genre    = { $regex: `^${escapeRegex(String(genre).trim())}$`, $options: 'i' };
    if (type)     filter.type     = { $regex: `^${escapeRegex(String(type).trim())}$`, $options: 'i' };
    if (rating)   filter.rating   = { $regex: `^${escapeRegex(String(rating).trim())}$`, $options: 'i' };
    if (language) filter.language = { $regex: `^${escapeRegex(String(language).trim())}$`, $options: 'i' };

    if (year !== undefined) {
      const y = Number(year);
      if (!Number.isFinite(y)) {
        return res.status(400).json({ success: false, error: 'year must be a number.' });
      }
      filter.year = y;
    } else if (minYear !== undefined || maxYear !== undefined) {
      filter.year = {};
      if (minYear !== undefined) {
        const min = Number(minYear);
        if (!Number.isFinite(min)) {
          return res.status(400).json({ success: false, error: 'minYear must be a number.' });
        }
        filter.year.$gte = min;
      }
      if (maxYear !== undefined) {
        const max = Number(maxYear);
        if (!Number.isFinite(max)) {
          return res.status(400).json({ success: false, error: 'maxYear must be a number.' });
        }
        filter.year.$lte = max;
      }
    }

    const docs = await Content.find(filter).sort({ legacyId: 1 });
    res.json({ success: true, items: docs.map(toFrontendItem) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not search content.' });
  }
}

async function listAdminContent(req, res) {
  try {
    const docs = await Content.find().sort({ legacyId: 1 });
    res.json({ success: true, items: docs.map(toAdminItem) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not load content.' });
  }
}

async function createContent(req, res) {
  try {
    const body = req.body || {};
    const missing = REQUIRED_CONTENT_FIELDS.filter(f => body[f] === undefined || body[f] === '');
    if (missing.length) {
      return res.status(400).json({ success: false, error: `Missing required fields: ${missing.join(', ')}` });
    }

    const year = Number(body.year);
    if (!Number.isFinite(year)) {
      return res.status(400).json({ success: false, error: 'year must be a number.' });
    }

    if (body.personas !== undefined && !Array.isArray(body.personas)) {
      return res.status(400).json({ success: false, error: 'personas must be an array.' });
    }

    const last = await Content.findOne().sort({ legacyId: -1 });
    const nextLegacyId = last ? last.legacyId + 1 : 1;

    const doc = await Content.create({
      legacyId:      nextLegacyId,
      title:         String(body.title).trim(),
      type:          String(body.type).trim(),
      genre:         String(body.genre).trim(),
      year,
      rating:        String(body.rating).trim(),
      description:   String(body.description).trim(),
      language:      body.language !== undefined ? String(body.language).trim() : undefined,
      img:           body.img,
      personas:      body.personas,
      baseLikeCount: body.baseLikeCount !== undefined ? Number(body.baseLikeCount) : undefined,
      isPopular:     body.isPopular !== undefined ? Boolean(body.isPopular) : undefined,
    });

    res.status(201).json({ success: true, item: toAdminItem(doc) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not create content.' });
  }
}

async function updateContent(req, res) {
  try {
    const legacyId = Number(req.params.id);
    if (!Number.isFinite(legacyId)) {
      return res.status(400).json({ success: false, error: 'Invalid content id.' });
    }

    const doc = await Content.findOne({ legacyId });
    if (!doc) {
      return res.status(404).json({ success: false, error: 'Content not found.' });
    }

    const body = req.body || {};
    for (const field of UPDATABLE_CONTENT_FIELDS) {
      if (body[field] === undefined) continue;

      if (field === 'year' || field === 'baseLikeCount') {
        const num = Number(body[field]);
        if (!Number.isFinite(num)) {
          return res.status(400).json({ success: false, error: `${field} must be a number.` });
        }
        doc[field] = num;
      } else if (field === 'isPopular') {
        doc[field] = Boolean(body[field]);
      } else if (field === 'personas') {
        if (!Array.isArray(body.personas)) {
          return res.status(400).json({ success: false, error: 'personas must be an array.' });
        }
        doc.personas = body.personas;
      } else {
        doc[field] = String(body[field]).trim();
      }
    }

    await doc.save();
    res.json({ success: true, item: toAdminItem(doc) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not update content.' });
  }
}

async function deleteContent(req, res) {
  try {
    const legacyId = Number(req.params.id);
    if (!Number.isFinite(legacyId)) {
      return res.status(400).json({ success: false, error: 'Invalid content id.' });
    }

    const deleted = await Content.findOneAndDelete({ legacyId });
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Content not found.' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not delete content.' });
  }
}

module.exports = {
  getContent,
  searchContent,
  listAdminContent,
  createContent,
  updateContent,
  deleteContent,
};
