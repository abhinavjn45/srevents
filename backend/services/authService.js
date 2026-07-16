const pool = require('../config/database');
const jwt = require('jwt-simple');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

// Admin login
const adminLogin = async (email, password) => {
    const connection = await pool.getConnection();
    
    try {
        // Validate input
        if (typeof email !== 'string' || !email.includes('@')) {
            return { success: false, message: 'Invalid credentials' };
        }
        if (typeof password !== 'string' || password.length < 1) {
            return { success: false, message: 'Invalid credentials' };
        }

        const [admins] = await connection.query(
            'SELECT * FROM admins WHERE email = ?',
            [email]
        );

        const admin = admins.length > 0 ? admins[0] : null;
        
        // SECURITY FIX: Always perform bcrypt comparison to prevent timing attacks
        // Use dummy hash if user not found
        const hashToCompare = admin ? admin.password : '$2a$10$dummyhash.dummyhash.dummy';
        const isPasswordValid = await bcryptjs.compare(password, hashToCompare);

        if (!admin || !isPasswordValid) {
            return { success: false, message: 'Invalid credentials' };
        }

        // Update last login
        await connection.query(
            'UPDATE admins SET last_login = NOW() WHERE id = ?',
            [admin.id]
        );

        // Generate JWT token
        const token = jwt.encode(
            {
                adminId: admin.id,
                email: admin.email,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + parseInt(process.env.SESSION_EXPIRY || 86400)
            },
            process.env.JWT_SECRET
        );

        return {
            success: true,
            token,
            admin: {
                id: admin.id,
                fullName: admin.full_name,
                email: admin.email,
                requiresPasswordChange: Boolean(admin.requires_password_change)
            }
        };
    } finally {
        connection.release();
    }
};

// Get admin profile
const getAdminProfile = async (adminId) => {
    const connection = await pool.getConnection();
    
    try {
        const [admins] = await connection.query(
            'SELECT id, full_name, email, last_login FROM admins WHERE id = ?',
            [adminId]
        );

        if (admins.length === 0) {
            return null;
        }

        return admins[0];
    } finally {
        connection.release();
    }
};

// Change password
const changePassword = async (adminId, currentPassword, newPassword) => {
    const connection = await pool.getConnection();
    
    try {
        const [admins] = await connection.query(
            'SELECT * FROM admins WHERE id = ?',
            [adminId]
        );

        if (admins.length === 0) {
            return { success: false, message: 'Admin not found' };
        }

        const admin = admins[0];
        const isPasswordValid = await bcryptjs.compare(currentPassword, admin.password);

        if (!isPasswordValid) {
            return { success: false, message: 'Invalid current password' };
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        await connection.query(
            'UPDATE admins SET password = ?, requires_password_change = FALSE WHERE id = ?',
            [hashedPassword, adminId]
        );

        return { success: true };
    } finally {
        connection.release();
    }
};

module.exports = {
    adminLogin,
    getAdminProfile,
    changePassword
};
