const Location = require('../models/locationModel');
const { logOperation, logError } = require('../utils/logger');

async function getLocations(req, res) {
  try {
    const locations = await Location.find().lean();
    res.json({ locations });
  } catch (err) {
    logError('getLocations', err);
    res.status(500).json({ error: 'Could not load locations.' });
  }
}

async function createLocation(req, res) {
  try {
    const { name, address, lat, lng } = req.body || {};
    const location = await Location.create({ name, address, lat, lng });
    logOperation('LOCATION_CREATED', `id=${location._id} name="${location.name}"`);
    res.status(201).json({ location });
  } catch (err) {
    if (err.name !== 'ValidationError') logError('createLocation', err);
    const message = err.name === 'ValidationError'
      ? Object.values(err.errors).map(e => e.message).join(', ')
      : 'Could not create location.';
    res.status(400).json({ error: message });
  }
}

async function updateLocation(req, res) {
  try {
    const { id } = req.params;
    const { name, address, lat, lng } = req.body || {};
    const location = await Location.findByIdAndUpdate(
      id,
      { $set: { name, address, lat, lng } },
      { new: true, runValidators: true }
    );
    if (!location) return res.status(404).json({ error: 'Location not found.' });
    logOperation('LOCATION_UPDATED', `id=${location._id} name="${location.name}"`);
    res.json({ location });
  } catch (err) {
    if (err.name !== 'ValidationError') logError('updateLocation', err);
    const message = err.name === 'ValidationError'
      ? Object.values(err.errors).map(e => e.message).join(', ')
      : 'Could not update location.';
    res.status(400).json({ error: message });
  }
}

async function deleteLocation(req, res) {
  try {
    const { id } = req.params;
    const location = await Location.findByIdAndDelete(id);
    if (!location) return res.status(404).json({ error: 'Location not found.' });
    logOperation('LOCATION_DELETED', `id=${location._id} name="${location.name}"`);
    res.json({ message: 'Location deleted.' });
  } catch (err) {
    logError('deleteLocation', err);
    res.status(500).json({ error: 'Could not delete location.' });
  }
}

module.exports = { getLocations, createLocation, updateLocation, deleteLocation };
