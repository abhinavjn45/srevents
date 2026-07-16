const express = require('express');
const auditController = require('../controllers/auditController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All audit routes require authentication
router.get('/audit-logs', authMiddleware, auditController.getAuditLogs);

module.exports = router;
