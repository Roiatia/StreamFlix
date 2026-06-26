const express = require('express');
const router  = express.Router();
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');
const {
  getLocations,
  adminGetLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} = require('../controllers/locationController');

// authenticated users — used by the public map page
router.get('/api/locations', requireAuth, getLocations);

// admin-only CRUD
router.get('/api/admin/locations',     requireAuth, requireAdmin, adminGetLocations);
router.post('/api/admin/locations',    requireAuth, requireAdmin, createLocation);
router.put('/api/admin/locations/:id', requireAuth, requireAdmin, updateLocation);
router.delete('/api/admin/locations/:id', requireAuth, requireAdmin, deleteLocation);

module.exports = router;
