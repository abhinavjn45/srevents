const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All dashboard routes require authentication
router.get('/dashboard', authMiddleware, dashboardController.getDashboard);
router.get('/votes', authMiddleware, dashboardController.getVotes);
router.get('/votes/statistics', authMiddleware, dashboardController.getStatistics);
router.get('/votes/export', authMiddleware, dashboardController.exportVotes);

module.exports = router;
