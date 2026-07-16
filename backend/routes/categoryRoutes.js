const express = require('express');
const categoryController = require('../controllers/categoryController');
const { publicLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public GET route (added separately in server.js without auth)
// Protected admin routes
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;
