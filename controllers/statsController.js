const Content = require('../models/contentModel');
const WatchHistory = require('../models/watchHistoryModel');
const Like = require('../models/likeModel');
const { logError } = require('../utils/logger');

async function getContentByGenre(req, res) {
  try {
    const items = await Content.aggregate([
      { $group: { _id: '$genre', value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $project: { _id: 0, label: '$_id', value: 1 } },
    ]);

    res.json({ success: true, items });
  } catch (err) {
    logError('getContentByGenre', err);
    res.status(500).json({ success: false, error: 'Could not load genre statistics.' });
  }
}

async function getContentByType(req, res) {
  try {
    const items = await Content.aggregate([
      { $group: { _id: '$type', value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $project: { _id: 0, label: '$_id', value: 1 } },
    ]);

    res.json({ success: true, items });
  } catch (err) {
    logError('getContentByType', err);
    res.status(500).json({ success: false, error: 'Could not load type statistics.' });
  }
}

async function getViewsByContent(req, res) {
  try {
    const items = await WatchHistory.aggregate([
      { $group: { _id: '$contentId', value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: Content.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'content',
        },
      },
      { $unwind: '$content' },
      {
        $project: {
          _id: 0,
          contentId: '$content.legacyId',
          label: '$content.title',
          value: 1,
        },
      },
    ]);

    res.json({ success: true, items });
  } catch (err) {
    logError('getViewsByContent', err);
    res.status(500).json({ success: false, error: 'Could not load views-by-content statistics.' });
  }
}

async function getViewsByGenre(req, res) {
  try {
    const items = await WatchHistory.aggregate([
      {
        $lookup: {
          from: Content.collection.name,
          localField: 'contentId',
          foreignField: '_id',
          as: 'content',
        },
      },
      { $unwind: '$content' },
      { $group: { _id: '$content.genre', value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $project: { _id: 0, label: '$_id', value: 1 } },
    ]);

    res.json({ success: true, items });
  } catch (err) {
    logError('getViewsByGenre', err);
    res.status(500).json({ success: false, error: 'Could not load views-by-genre statistics.' });
  }
}

// counts real Like docs per content, adds baseLikeCount to get the total shown
async function getLikesByContent(req, res) {
  try {
    const items = await Content.aggregate([
      {
        $lookup: {
          from: Like.collection.name,
          localField: '_id',
          foreignField: 'contentId',
          as: 'likes',
        },
      },
      {
        $project: {
          _id: 0,
          contentId: '$legacyId',
          label: '$title',
          value: { $add: [{ $ifNull: ['$baseLikeCount', 0] }, { $size: '$likes' }] },
        },
      },
      { $match: { value: { $gt: 0 } } },
      { $sort: { value: -1 } },
      { $limit: 10 },
    ]);

    res.json({ success: true, items });
  } catch (err) {
    logError('getLikesByContent', err);
    res.status(500).json({ success: false, error: 'Could not load likes-by-content statistics.' });
  }
}

// combines real Likes (grouped by content genre) with each content's baseLikeCount
// so genres with only "seed" likes still show up
async function getLikesByGenre(req, res) {
  try {
    const items = await Like.aggregate([
      {
        $lookup: {
          from: Content.collection.name,
          localField: 'contentId',
          foreignField: '_id',
          as: 'content',
        },
      },
      { $unwind: '$content' },
      { $project: { genre: '$content.genre', value: { $literal: 1 } } },
      {
        $unionWith: {
          coll: Content.collection.name,
          pipeline: [
            { $project: { _id: 0, genre: 1, value: '$baseLikeCount' } },
          ],
        },
      },
      { $group: { _id: '$genre', value: { $sum: '$value' } } },
      { $sort: { value: -1 } },
      { $project: { _id: 0, label: '$_id', value: 1 } },
    ]);

    res.json({ success: true, items });
  } catch (err) {
    logError('getLikesByGenre', err);
    res.status(500).json({ success: false, error: 'Could not load likes-by-genre statistics.' });
  }
}

module.exports = {
  getContentByGenre,
  getContentByType,
  getViewsByContent,
  getViewsByGenre,
  getLikesByContent,
  getLikesByGenre,
};
