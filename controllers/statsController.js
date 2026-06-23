const Content = require('../models/contentModel');
const WatchHistory = require('../models/watchHistoryModel');

async function getContentByGenre(req, res) {
  try {
    const items = await Content.aggregate([
      { $group: { _id: '$genre', value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $project: { _id: 0, label: '$_id', value: 1 } },
    ]);

    res.json({ success: true, items });
  } catch (err) {
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
    res.status(500).json({ success: false, error: 'Could not load views-by-genre statistics.' });
  }
}

module.exports = {
  getContentByGenre,
  getContentByType,
  getViewsByContent,
  getViewsByGenre,
};
