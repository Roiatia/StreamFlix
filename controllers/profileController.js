const Profile = require('../models/profileModel');

async function getPersonas(req, res) {
  try {
    const profiles = await Profile.find().sort({ createdAt: 1 });
    res.json(profiles.map(p => ({ id: p.legacyId, name: p.name, avatar: p.avatar })));
  } catch (err) {
    res.status(500).json({ error: 'Could not load profiles.' });
  }
}

async function createPersona(req, res) {
  try {
    const name = (req.body.name || '').trim();

    if (!name) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    if (name.length > 30) {
      return res.status(400).json({ error: 'Name must be 30 characters or fewer.' });
    }

    // build an id from the name, e.g. "New User" -> "new-user"
    const legacyId = name.toLowerCase().replace(/\s+/g, '-');

    const exists = await Profile.findOne({
      $or: [
        { legacyId },
        { name: { $regex: `^${name}$`, $options: 'i' } },
      ],
    });
    if (exists) {
      return res.status(409).json({ error: 'A profile with that name already exists.' });
    }

    const profile = await Profile.create({
      legacyId,
      name,
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
    });

    res.status(201).json({ id: profile.legacyId, name: profile.name, avatar: profile.avatar });
  } catch (err) {
    res.status(500).json({ error: 'Could not create profile.' });
  }
}

module.exports = { getPersonas, createPersona };
