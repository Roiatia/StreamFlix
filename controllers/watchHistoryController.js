const WatchHistory = require('../models/watchHistoryModel');
const Profile = require('../models/profileModel');
const Content = require('../models/contentModel');
const { logError } = require('../utils/logger');

function canAccessProfile(profile, user) {
  if (user.role === 'admin') return true;
  return profile.userId && profile.userId.toString() === user.userId;
}

function toContentJSON(doc) {
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

// expects historyDoc.contentId and .profileId to be populated documents
function toWatchHistoryItem(historyDoc) {
  return {
    contentId:       historyDoc.contentId.legacyId,
    profileId:       historyDoc.profileId ? historyDoc.profileId.legacyId : undefined,
    watchedAt:       historyDoc.watchedAt,
    progressSeconds: historyDoc.progressSeconds,
    completed:       historyDoc.completed,
    content:         toContentJSON(historyDoc.contentId),
  };
}

async function upsertWatchHistory(req, res) {
  try {
    const { profileId, contentId, progressSeconds, completed } = req.body || {};

    if (!profileId) {
      return res.status(400).json({ success: false, error: 'profileId is required.' });
    }

    const contentLegacyId = Number(contentId);
    if (!Number.isFinite(contentLegacyId)) {
      return res.status(400).json({ success: false, error: 'contentId is required and must be a number.' });
    }

    let progress = 0;
    if (progressSeconds !== undefined) {
      progress = Number(progressSeconds);
      if (!Number.isFinite(progress) || progress < 0) {
        return res.status(400).json({ success: false, error: 'progressSeconds must be a non-negative number.' });
      }
    }
    const isCompleted = completed === undefined ? true : Boolean(completed);

    const profile = await Profile.findOne({ legacyId: profileId });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found.' });
    }
    if (!canAccessProfile(profile, req.user)) {
      return res.status(403).json({ success: false, error: 'Forbidden.' });
    }

    const content = await Content.findOne({ legacyId: contentLegacyId });
    if (!content) {
      return res.status(404).json({ success: false, error: 'Content not found.' });
    }

    const doc = await WatchHistory.findOneAndUpdate(
      { userId: req.user.userId, profileId: profile._id, contentId: content._id },
      {
        $set: {
          userId:          req.user.userId,
          profileId:       profile._id,
          contentId:       content._id,
          watchedAt:       new Date(),
          progressSeconds: progress,
          completed:       isCompleted,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      item: {
        contentId:       content.legacyId,
        profileId:       profile.legacyId,
        watchedAt:       doc.watchedAt,
        progressSeconds: doc.progressSeconds,
        completed:       doc.completed,
        content:         toContentJSON(content),
      },
    });
  } catch (err) {
    logError('upsertWatchHistory', err);
    res.status(500).json({ success: false, error: 'Could not save watch history.' });
  }
}

async function getWatchHistory(req, res) {
  try {
    const profileLegacyId = (req.query.profile || '').trim();
    if (!profileLegacyId) {
      return res.status(400).json({ success: false, error: 'profile query param is required.' });
    }

    const profile = await Profile.findOne({ legacyId: profileLegacyId });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found.' });
    }
    if (!canAccessProfile(profile, req.user)) {
      return res.status(403).json({ success: false, error: 'Forbidden.' });
    }

    const history = await WatchHistory.find({ userId: req.user.userId, profileId: profile._id })
      .populate('contentId')
      .populate('profileId')
      .sort({ watchedAt: -1 });

    // skip rows whose content was deleted out from under the watch history entry
    const items = history.filter(h => h.contentId).map(toWatchHistoryItem);

    res.json({ success: true, items });
  } catch (err) {
    logError('getWatchHistory', err);
    res.status(500).json({ success: false, error: 'Could not load watch history.' });
  }
}

async function deleteWatchHistory(req, res) {
  try {
    const contentLegacyId = Number(req.params.contentId);
    if (!Number.isFinite(contentLegacyId)) {
      return res.status(400).json({ success: false, error: 'Invalid content id.' });
    }

    const profileLegacyId = (req.query.profile || '').trim();
    if (!profileLegacyId) {
      return res.status(400).json({ success: false, error: 'profile query param is required.' });
    }

    const profile = await Profile.findOne({ legacyId: profileLegacyId });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found.' });
    }
    if (!canAccessProfile(profile, req.user)) {
      return res.status(403).json({ success: false, error: 'Forbidden.' });
    }

    const content = await Content.findOne({ legacyId: contentLegacyId });
    if (!content) {
      return res.status(404).json({ success: false, error: 'Content not found.' });
    }

    await WatchHistory.deleteOne({ userId: req.user.userId, profileId: profile._id, contentId: content._id });

    res.json({ success: true });
  } catch (err) {
    logError('deleteWatchHistory', err);
    res.status(500).json({ success: false, error: 'Could not delete watch history entry.' });
  }
}

async function getPersonalFeed(req, res) {
  try {
    const profileLegacyId = (req.query.profile || '').trim();
    if (!profileLegacyId) {
      return res.status(400).json({ success: false, error: 'profile query param is required.' });
    }

    const profile = await Profile.findOne({ legacyId: profileLegacyId });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found.' });
    }
    if (!canAccessProfile(profile, req.user)) {
      return res.status(403).json({ success: false, error: 'Forbidden.' });
    }

    const history = await WatchHistory.find({ userId: req.user.userId, profileId: profile._id })
      .populate('contentId')
      .sort({ watchedAt: -1 });

    const watchedContent = history.filter(h => h.contentId).map(h => h.contentId);
    const watchedIds = watchedContent.map(c => c.legacyId);
    const watchedIdSet = new Set(watchedIds);

    // same visibility rule as the regular feed: fall back to guest content for new profiles
    let docs = await Content.find({ personas: profileLegacyId });
    if (docs.length === 0) {
      docs = await Content.find({ personas: 'guest' });
    }

    const rows = [];

    if (watchedContent.length > 0) {
      rows.push({ label: 'Continue Watching', items: watchedContent.map(toContentJSON) });
    }

    const seenGenres = new Set();
    for (const watched of watchedContent) {
      if (seenGenres.size >= 2 || seenGenres.has(watched.genre)) continue;

      const recs = docs.filter(c => c.genre === watched.genre && !watchedIdSet.has(c.legacyId));
      if (recs.length > 0) {
        seenGenres.add(watched.genre);
        rows.push({ label: `Because you watched ${watched.title}`, items: recs.map(toContentJSON) });
      }
    }

    rows.push({
      label: 'Trending Now',
      items: docs.filter(c => c.year >= 2020 && c.type !== 'Game').map(toContentJSON),
    });

    rows.push({
      label: 'Popular on StreamFlix',
      items: docs.filter(c => c.isPopular).map(toContentJSON),
    });

    rows.push({
      label: 'TV Shows',
      items: docs.filter(c => c.type === 'TV Show').map(toContentJSON),
    });

    rows.push({
      label: 'Movies',
      items: docs.filter(c => c.type === 'Movie').map(toContentJSON),
    });

    res.json({
      success: true,
      rows: rows.filter(row => row.items.length > 0),
      watchedIds,
    });
  } catch (err) {
    logError('getPersonalFeed', err);
    res.status(500).json({ success: false, error: 'Could not build personal feed.' });
  }
}

module.exports = {
  upsertWatchHistory,
  getWatchHistory,
  deleteWatchHistory,
  getPersonalFeed,
};
