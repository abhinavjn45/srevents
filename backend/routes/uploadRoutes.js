const express = require('express');
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/multer');

const router = express.Router();

// Upload requires authentication
router.post('/upload', authMiddleware, upload.single('file'), uploadController.uploadImage);

module.exports = router;
