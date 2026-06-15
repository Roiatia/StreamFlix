const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    legacyId:    { type: String, required: true, unique: true },
    name:        { type: String, required: true },
    avatar:      { type: String, required: true },
    age:         { type: Number },
    preferences: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
