const auditService = require('../services/auditService');

// Get audit logs
exports.getAuditLogs = async (req, res, next) => {
    try {
        const { adminId, action, module, startDate, endDate, page = 1, limit = 20 } = req.query;

        const filters = {
            adminId: adminId ? parseInt(adminId) : null,
            action,
            module,
            startDate,
            endDate
        };

        const result = await auditService.getAuditLogs(filters, parseInt(page), parseInt(limit));

        res.json({
            success: true,
            data: result.logs,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                pages: result.pages
            }
        });
    } catch (error) {
        next(error);
    }
};
