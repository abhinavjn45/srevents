const express = require('express');
const voteController = require('../controllers/voteController');
const { voteLimiterDevice, voteLimiterIP, publicLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes
router.post('/vote', voteLimiterIP, voteLimiterDevice, voteController.submitVote);
router.get('/vote/status', publicLimiter, voteController.getVotingStatus);
router.post('/vote/my-votes', publicLimiter, voteController.getMyVotes);

module.exports = router;
