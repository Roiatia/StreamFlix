const Profile = require('../models/profileModel');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toFrontendProfile(p) {
  return { id: p.legacyId, name: p.name, avatar: p.avatar };
}

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

    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exists = await Profile.findOne({
      $or: [
        { legacyId },
        { name: { $regex: `^${escapedName}$`, $options: 'i' } },
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

async function searchProfiles(req, res) {
  try {
    const q = (req.query.q || '').trim();
    let filter = {};

    if (q) {
      const escaped = escapeRegex(q);
      filter = {
        $or: [
          { name: { $regex: escaped, $options: 'i' } },
          { legacyId: { $regex: escaped, $options: 'i' } },
        ],
      };
    }

    const profiles = await Profile.find(filter).sort({ createdAt: 1 });
    res.json(profiles.map(toFrontendProfile));
  } catch (err) {
    res.status(500).json({ error: 'Could not search profiles.' });
  }
}

async function updateProfile(req, res) {
  try {
    const profile = await Profile.findOne({ legacyId: req.params.id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    const { name, avatar, age, preferences } = req.body;

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) {
        return res.status(400).json({ error: 'Name is required.' });
      }
      if (trimmed.length > 30) {
        return res.status(400).json({ error: 'Name must be 30 characters or fewer.' });
      }
      profile.name = trimmed;
    }
    if (avatar !== undefined) {
      profile.avatar = String(avatar);
    }
    if (age !== undefined) {
      const ageNum = Number(age);
      if (!Number.isFinite(ageNum) || ageNum < 0) {
        return res.status(400).json({ error: 'Age must be a valid number.' });
      }
      profile.age = ageNum;
    }
    if (preferences !== undefined) {
      if (!Array.isArray(preferences)) {
        return res.status(400).json({ error: 'Preferences must be an array.' });
      }
      profile.preferences = preferences;
    }

    await profile.save();
    res.json(toFrontendProfile(profile));
  } catch (err) {
    res.status(500).json({ error: 'Could not update profile.' });
  }
}

async function deleteProfile(req, res) {
  try {
    if (req.params.id === 'guest') {
      return res.status(400).json({ error: 'The guest profile cannot be deleted.' });
    }

    const deleted = await Profile.findOneAndDelete({ legacyId: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete profile.' });
  }
}

module.exports = { getPersonas, createPersona, searchProfiles, updateProfile, deleteProfile };
