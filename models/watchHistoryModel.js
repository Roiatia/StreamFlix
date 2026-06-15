const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema(
  {
    userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    profileId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    contentId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    watchedAt:       { type: Date, default: Date.now },
    progressSeconds: { type: Number, default: 0 },
    completed:       { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
