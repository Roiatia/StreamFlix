const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  },
  { timestamps: true }
);

likeSchema.index({ userId: 1, profileId: 1, contentId: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
