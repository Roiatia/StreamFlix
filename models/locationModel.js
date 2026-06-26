const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  lat:     { type: Number, required: true, min: -90,  max: 90  },
  lng:     { type: Number, required: true, min: -180, max: 180 },
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
