const express = require('express');
const creatorController = require('../controllers/creatorController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const { publicLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes
router.get('/creators', publicLimiter, creatorController.getCreators);

// Protected routes (admin only)
router.post('/creators', authMiddleware, upload.single('image'), creatorController.createCreator);
router.put('/creators/:id', authMiddleware, upload.single('image'), creatorController.updateCreator);
router.delete('/creators/:id', authMiddleware, creatorController.deleteCreator);

module.exports = router;
