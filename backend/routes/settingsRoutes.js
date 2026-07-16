const express = require('express');
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');
const { publicLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public route to get settings
router.get('/settings', publicLimiter, settingsController.getSettings);

// Protected route to update settings
router.put('/settings', authMiddleware, settingsController.updateSettings);

module.exports = router;
