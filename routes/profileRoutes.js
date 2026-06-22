const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  getPersonas,
  createPersona,
  searchProfiles,
  updateProfile,
  deleteProfile,
} = require('../controllers/profileController');

const router = express.Router();

router.get('/api/personas/search', requireAuth, searchProfiles);
router.get('/api/personas', requireAuth, getPersonas);
router.post('/api/personas', requireAuth, createPersona);
router.put('/api/personas/:id', requireAuth, updateProfile);
router.delete('/api/personas/:id', requireAuth, deleteProfile);

module.exports = router;
