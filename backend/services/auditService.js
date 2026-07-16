const pool = require('../config/database');

// Record audit log
const logAction = async (adminId, action, module, description, ipAddress) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.query(
            `INSERT INTO audit_logs (admin_id, action, module, description, ip_address)
             VALUES (?, ?, ?, ?, ?)`,
            [adminId || null, action, module, description, ipAddress]
        );
    } finally {
        connection.release();
    }
};

// Get audit logs
const getAuditLogs = async (filters = {}, page = 1, limit = 20) => {
    const connection = await pool.getConnection();
    
    try {
        let query = `SELECT al.*, a.email as admin_email
                     FROM audit_logs al
                     LEFT JOIN admins a ON al.admin_id = a.id
                     WHERE 1=1`;
        
        const params = [];

        if (filters.adminId) {
            query += ` AND al.admin_id = ?`;
            params.push(filters.adminId);
        }

        if (filters.action) {
            query += ` AND al.action = ?`;
            params.push(filters.action);
        }

        if (filters.module) {
            query += ` AND al.module = ?`;
            params.push(filters.module);
        }

        if (filters.startDate) {
            query += ` AND al.created_at >= ?`;
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += ` AND al.created_at <= ?`;
            params.push(filters.endDate);
        }

        query += ` ORDER BY al.created_at DESC LIMIT ? OFFSET ?`;
        
        const offset = (page - 1) * limit;
        params.push(limit, offset);

        const [logs] = await connection.query(query, params);

        // Get total count
        let countQuery = `SELECT COUNT(*) as count FROM audit_logs WHERE 1=1`;
        const countParams = [];

        if (filters.adminId) {
            countQuery += ` AND admin_id = ?`;
            countParams.push(filters.adminId);
        }

        if (filters.action) {
            countQuery += ` AND action = ?`;
            countParams.push(filters.action);
        }

        if (filters.module) {
            countQuery += ` AND module = ?`;
            countParams.push(filters.module);
        }

        const [countResult] = await connection.query(countQuery, countParams);

        return {
            logs,
            total: countResult[0].count,
            page,
            limit,
            pages: Math.ceil(countResult[0].count / limit)
        };
    } finally {
        connection.release();
    }
};

module.exports = {
    logAction,
    getAuditLogs
};
