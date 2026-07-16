const categoryService = require('../services/categoryService');
const auditService = require('../services/auditService');
const { validateId, validateCategory } = require('../utils/validation');

// Get all categories
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

// Create category
exports.createCategory = async (req, res, next) => {
    try {
        const { title, description, displayOrder, status, votingStart, votingEnd } = req.body;

        // Input validation
        const validation = validateCategory({
            title,
            description,
            displayOrder: displayOrder ? parseInt(displayOrder) : 1,
            status: status || 'Active',
            votingStart,
            votingEnd
        });

        if (!validation.isValid) {
            return res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        const categoryId = await categoryService.createCategory({
            title,
            description,
            displayOrder: displayOrder ? parseInt(displayOrder) : 1,
            status: status || 'Active',
            votingStart,
            votingEnd
        });

        // Log action
        await auditService.logAction(req.adminId, 'CREATE', 'CATEGORY', `Created category: ${title}`, req.ip);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { id: categoryId }
        });
    } catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(409).json({
                success: false,
                message: 'Category already exists'
            });
        }
        next(error);
    }
};

// Update category
exports.updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        // SECURITY FIX: Validate ID parameter
        if (!validateId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID'
            });
        }

        const { title, description, displayOrder, status, votingStart, votingEnd } = req.body;

        // Input validation
        const validation = validateCategory({
            title,
            description,
            displayOrder: displayOrder ? parseInt(displayOrder) : undefined,
            status,
            votingStart,
            votingEnd
        });

        if (!validation.isValid) {
            return res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        await categoryService.updateCategory(parseInt(id), {
            title,
            description,
            displayOrder: displayOrder ? parseInt(displayOrder) : undefined,
            status,
            votingStart,
            votingEnd
        });

        // Log action
        await auditService.logAction(req.adminId, 'UPDATE', 'CATEGORY', `Updated category ID: ${id}`, req.ip);

        res.json({
            success: true,
            message: 'Category updated successfully'
        });
    } catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(409).json({
                success: false,
                message: 'Category already exists'
            });
        }
        next(error);
    }
};

// Delete category
exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        // SECURITY FIX: Validate ID parameter
        if (!validateId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID'
            });
        }

        await categoryService.deleteCategory(parseInt(id));

        // Log action
        await auditService.logAction(req.adminId, 'DELETE', 'CATEGORY', `Deleted category ID: ${id}`, req.ip);

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        if (error.message.includes('Cannot delete')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};
