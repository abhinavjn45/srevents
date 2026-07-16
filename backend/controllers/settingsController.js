const settingsService = require('../services/settingsService');
const auditService = require('../services/auditService');
const { validateSettings } = require('../utils/validation');

// Get settings
exports.getSettings = async (req, res, next) => {
    try {
        const settings = await settingsService.getSettings();

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        next(error);
    }
};

// Update settings
exports.updateSettings = async (req, res, next) => {
    try {
        const { event_name, event_description, global_voting_enabled, voting_start, voting_end, footer_text } = req.body;

        // Input validation
        const validation = validateSettings({
            event_name,
            event_description,
            global_voting_enabled,
            voting_start,
            voting_end,
            footer_text
        });

        if (!validation.isValid) {
            return res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        await settingsService.updateSettings({
            event_name,
            event_description,
            global_voting_enabled,
            voting_start,
            voting_end,
            footer_text
        });

        // Log action
        await auditService.logAction(req.adminId, 'UPDATE', 'SETTINGS', 'Updated application settings', req.ip);

        res.json({
            success: true,
            message: 'Settings updated successfully'
        });
    } catch (error) {
        next(error);
    }
};
