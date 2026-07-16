const express = require('express');
const authController = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes (no authentication)
router.post('/login', loginLimiter, authController.login);

const authMiddleware = require('../middleware/authMiddleware');

// Protected routes (require authentication)
router.post('/logout', authMiddleware, authController.logout);
router.get('/profile', authMiddleware, authController.getProfile);
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
