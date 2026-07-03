const Like    = require('../models/likeModel');
const Profile = require('../models/profileModel');
const Content = require('../models/contentModel');
const { logError } = require('../utils/logger');

function canAccessProfile(profile, user) {
  if (user.role === 'admin') return true;
  return profile.userId && profile.userId.toString() === user.userId;
}

// GET /api/likes?profile=<legacyId>
async function getLikesForProfile(req, res) {
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

    const likes = await Like.find({ userId: req.user.userId, profileId: profile._id })
      .populate('contentId', 'legacyId');

    const likedIds = likes
      .filter(l => l.contentId)
      .map(l => l.contentId.legacyId);

    res.json({ success: true, likedIds });
  } catch (err) {
    logError('getLikesForProfile', err);
    res.status(500).json({ success: false, error: 'Could not load likes.' });
  }
}

// POST /api/likes/toggle — body: { profileId, contentId }
async function toggleLike(req, res) {
  try {
    const { profileId: profileLegacyId, contentId: contentLegacyIdRaw } = req.body || {};

    if (!profileLegacyId) {
      return res.status(400).json({ success: false, error: 'profileId is required.' });
    }

    const contentLegacyId = Number(contentLegacyIdRaw);
    if (!Number.isFinite(contentLegacyId)) {
      return res.status(400).json({ success: false, error: 'contentId must be a number.' });
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

    const filter = { userId: req.user.userId, profileId: profile._id, contentId: content._id };
    const existing = await Like.findOne(filter);

    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      return res.json({ success: true, liked: false });
    }

    await Like.create(filter);
    return res.json({ success: true, liked: true });
  } catch (err) {
    logError('toggleLike', err);
    res.status(500).json({ success: false, error: 'Could not toggle like.' });
  }
}

// GET /api/likes/counts — total likes per content (DB count + baseLikeCount)
async function getLikeCounts(req, res) {
  try {
    const agg = await Like.aggregate([
      { $group: { _id: '$contentId', count: { $sum: 1 } } },
    ]);

    const dbCountMap = {};
    agg.forEach(row => { dbCountMap[row._id.toString()] = row.count; });

    const allContent = await Content.find({}, 'legacyId baseLikeCount');

    const counts = {};
    allContent.forEach(c => {
      counts[c.legacyId] = (c.baseLikeCount || 0) + (dbCountMap[c._id.toString()] || 0);
    });

    res.json({ success: true, counts });
  } catch (err) {
    logError('getLikeCounts', err);
    res.status(500).json({ success: false, error: 'Could not get like counts.' });
  }
}

module.exports = { getLikesForProfile, toggleLike, getLikeCounts };
