const authService = require('../services/authService');
const auditService = require('../services/auditService');

// Login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const result = await authService.adminLogin(email, password);

        if (!result.success) {
            // Log failed login attempt
            await auditService.logAction(null, 'LOGIN_FAILED', 'AUTH', `Failed login attempt for ${email}`, req.ip);

            return res.status(401).json({
                success: false,
                message: result.message
            });
        }

        // Log successful login
        await auditService.logAction(result.admin.id, 'LOGIN', 'AUTH', `Admin login successful`, req.ip);

        // Set JWT in HttpOnly cookie
        res.cookie('authToken', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: parseInt(process.env.SESSION_EXPIRY || 86400) * 1000
        });

        res.json({
            success: true,
            message: 'Login successful',
            data: result.admin
        });
    } catch (error) {
        next(error);
    }
};

// Logout
exports.logout = async (req, res, next) => {
    try {
        // Log logout
        await auditService.logAction(req.adminId, 'LOGOUT', 'AUTH', 'Admin logout', req.ip);

        res.clearCookie('authToken');
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        next(error);
    }
};

// Get logged in admin
exports.getProfile = async (req, res, next) => {
    try {
        const admin = await authService.getAdminProfile(req.adminId);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.json({
            success: true,
            data: admin
        });
    } catch (error) {
        next(error);
    }
};

// Change password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(422).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        const { validatePassword } = require('../utils/validation');
        if (!validatePassword(newPassword)) {
            return res.status(422).json({
                success: false,
                message: 'Password does not meet strength requirements'
            });
        }

        const result = await authService.changePassword(req.adminId, currentPassword, newPassword);

        if (!result.success) {
            await auditService.logAction(req.adminId, 'PASSWORD_CHANGE_FAILED', 'AUTH', 'Failed password change attempt', req.ip);
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        await auditService.logAction(req.adminId, 'PASSWORD_CHANGE', 'AUTH', 'Admin changed password', req.ip);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(error);
    }
};
