const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    legacyId:      { type: Number, required: true, unique: true },
    title:         { type: String, required: true },
    type:          { type: String, required: true },
    genre:         { type: String, required: true },
    year:          { type: Number, required: true },
    rating:        { type: String, required: true },
    language:      { type: String },
    description:   { type: String, required: true },
    img:           { type: String },
    personas:      [String],
    baseLikeCount: { type: Number, default: 0 },
    isPopular:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);
