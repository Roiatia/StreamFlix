const mongoose = require('mongoose');
const Review  = require('../models/reviewModel');
const Content = require('../models/contentModel');
const Profile = require('../models/profileModel');
const { logOperation, logError } = require('../utils/logger');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toReviewJSON(doc) {
  return {
    id:        doc._id.toString(),
    contentId: doc.contentId && doc.contentId.legacyId !== undefined ? doc.contentId.legacyId : doc.contentId,
    profileId: doc.profileId && doc.profileId.legacyId !== undefined ? doc.profileId.legacyId : doc.profileId,
    userId:    doc.userId ? doc.userId.toString() : null,
    rating:    doc.rating,
    text:      doc.text,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

async function getReviewsForContent(req, res) {
  try {
    const contentLegacyId = Number(req.params.contentId);
    if (!Number.isFinite(contentLegacyId)) {
      return res.status(400).json({ success: false, error: 'Invalid content id.' });
    }

    const content = await Content.findOne({ legacyId: contentLegacyId });
    if (!content) {
      return res.status(404).json({ success: false, error: 'Content not found.' });
    }

    const reviews = await Review.find({ contentId: content._id })
      .populate('contentId', 'legacyId')
      .populate('profileId', 'legacyId')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews: reviews.map(toReviewJSON) });
  } catch (err) {
    logError('getReviewsForContent', err);
    res.status(500).json({ success: false, error: 'Could not load reviews.' });
  }
}

async function createReview(req, res) {
  try {
    const contentLegacyId = Number(req.params.contentId);
    if (!Number.isFinite(contentLegacyId)) {
      return res.status(400).json({ success: false, error: 'Invalid content id.' });
    }

    const { profileId, rating, text } = req.body || {};

    if (!profileId) {
      return res.status(400).json({ success: false, error: 'profileId is required.' });
    }

    const ratingNum = Number(rating);
    if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, error: 'rating must be a number from 1 to 5.' });
    }

    const content = await Content.findOne({ legacyId: contentLegacyId });
    if (!content) {
      return res.status(404).json({ success: false, error: 'Content not found.' });
    }

    const profile = await Profile.findOne({ legacyId: profileId });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found.' });
    }

    const isProfileOwner = profile.userId && profile.userId.toString() === req.user.userId;
    if (!isProfileOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden.' });
    }

    const review = await Review.create({
      userId:    req.user.userId,
      profileId: profile._id,
      contentId: content._id,
      rating:    ratingNum,
      text:      (text || '').trim(),
    });

    await review.populate('contentId', 'legacyId');
    await review.populate('profileId', 'legacyId');

    logOperation('REVIEW_CREATED', `id=${review._id} contentId=${contentLegacyId} rating=${ratingNum} by=${req.user.email}`);
    res.status(201).json({ success: true, review: toReviewJSON(review) });
  } catch (err) {
    logError('createReview', err);
    res.status(500).json({ success: false, error: 'Could not create review.' });
  }
}

async function updateReview(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid review id.' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found.' });
    }

    const isOwner = review.userId && review.userId.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Forbidden.' });
    }

    const { rating, text } = req.body || {};

    if (rating !== undefined) {
      const ratingNum = Number(rating);
      if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ success: false, error: 'rating must be a number from 1 to 5.' });
      }
      review.rating = ratingNum;
    }
    if (text !== undefined) {
      review.text = String(text).trim();
    }

    await review.save();
    await review.populate('contentId', 'legacyId');
    await review.populate('profileId', 'legacyId');

    logOperation('REVIEW_UPDATED', `id=${id} by=${req.user.email}`);
    res.json({ success: true, review: toReviewJSON(review) });
  } catch (err) {
    logError('updateReview', err);
    res.status(500).json({ success: false, error: 'Could not update review.' });
  }
}

async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid review id.' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found.' });
    }

    const isOwner = review.userId && review.userId.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Forbidden.' });
    }

    await Review.deleteOne({ _id: id });
    logOperation('REVIEW_DELETED', `id=${id} by=${req.user.email}`);
    res.json({ success: true });
  } catch (err) {
    logError('deleteReview', err);
    res.status(500).json({ success: false, error: 'Could not delete review.' });
  }
}

async function searchReviews(req, res) {
  try {
    const { contentId, profileId, rating, minRating, q } = req.query;
    const filter = {};

    if (contentId !== undefined) {
      const legacyId = Number(contentId);
      if (!Number.isFinite(legacyId)) {
        return res.status(400).json({ success: false, error: 'Invalid contentId.' });
      }
      const content = await Content.findOne({ legacyId });
      if (!content) {
        return res.json({ success: true, reviews: [] });
      }
      filter.contentId = content._id;
    }

    if (profileId !== undefined) {
      const profile = await Profile.findOne({ legacyId: profileId });
      if (!profile) {
        return res.json({ success: true, reviews: [] });
      }
      filter.profileId = profile._id;
    }

    if (rating !== undefined) {
      const r = Number(rating);
      if (!Number.isFinite(r)) {
        return res.status(400).json({ success: false, error: 'rating must be a number.' });
      }
      filter.rating = r;
    } else if (minRating !== undefined) {
      const min = Number(minRating);
      if (!Number.isFinite(min)) {
        return res.status(400).json({ success: false, error: 'minRating must be a number.' });
      }
      filter.rating = { $gte: min };
    }

    if (q) {
      filter.text = { $regex: escapeRegex(String(q).trim()), $options: 'i' };
    }

    const reviews = await Review.find(filter)
      .populate('contentId', 'legacyId')
      .populate('profileId', 'legacyId')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews: reviews.map(toReviewJSON) });
  } catch (err) {
    logError('searchReviews', err);
    res.status(500).json({ success: false, error: 'Could not search reviews.' });
  }
}

module.exports = {
  getReviewsForContent,
  createReview,
  updateReview,
  deleteReview,
  searchReviews,
};
