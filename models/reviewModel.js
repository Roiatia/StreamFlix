const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    rating:    { type: Number, min: 1, max: 5 },
    text:      { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
