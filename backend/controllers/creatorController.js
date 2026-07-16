const creatorService = require('../services/creatorService');
const auditService = require('../services/auditService');
const { validateId, validateCreator } = require('../utils/validation');

// Get all creators
exports.getCreators = async (req, res, next) => {
    try {
        const { categoryId } = req.query;
        const creators = await creatorService.getAllCreators(categoryId);

        res.json({
            success: true,
            data: creators
        });
    } catch (error) {
        next(error);
    }
};

// Create creator
exports.createCreator = async (req, res, next) => {
    try {
        const { categoryId, creatorName, bio, instagram, youtube } = req.body;

        // Input validation
        const validation = validateCreator({
            categoryId: parseInt(categoryId),
            creatorName,
            bio,
            instagram,
            youtube
        });

        if (!validation.isValid) {
            return res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const creatorId = await creatorService.createCreator(parseInt(categoryId), {
            creatorName,
            bio,
            instagram,
            youtube
        }, imagePath);

        // Log action
        await auditService.logAction(req.adminId, 'CREATE', 'CREATOR', `Created creator: ${creatorName}`, req.ip);

        res.status(201).json({
            success: true,
            message: 'Creator created successfully',
            data: { id: creatorId }
        });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

// Update creator
exports.updateCreator = async (req, res, next) => {
    try {
        const { id } = req.params;

        // SECURITY FIX: Validate ID parameter
        if (!validateId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid creator ID'
            });
        }

        const { creatorName, bio, instagram, youtube, displayOrder, status } = req.body;

        // Input validation
        const validation = validateCreator({
            creatorName,
            bio,
            instagram,
            youtube,
            displayOrder: displayOrder ? parseInt(displayOrder) : undefined,
            status
        });

        if (!validation.isValid) {
            return res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        await creatorService.updateCreator(parseInt(id), {
            creatorName,
            bio,
            instagram,
            youtube,
            displayOrder: displayOrder ? parseInt(displayOrder) : undefined,
            status
        }, imagePath);

        // Log action
        await auditService.logAction(req.adminId, 'UPDATE', 'CREATOR', `Updated creator ID: ${id}`, req.ip);

        res.json({
            success: true,
            message: 'Creator updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Delete creator
exports.deleteCreator = async (req, res, next) => {
    try {
        const { id } = req.params;

        // SECURITY FIX: Validate ID parameter
        if (!validateId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid creator ID'
            });
        }

        await creatorService.deleteCreator(parseInt(id));

        // Log action
        await auditService.logAction(req.adminId, 'DELETE', 'CREATOR', `Deleted creator ID: ${id}`, req.ip);

        res.json({
            success: true,
            message: 'Creator deleted or set to inactive successfully'
        });
    } catch (error) {
        next(error);
    }
};
