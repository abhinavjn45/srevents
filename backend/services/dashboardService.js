const pool = require('../config/database');

// Get dashboard summary
const getDashboardSummary = async () => {
    const connection = await pool.getConnection();
    
    try {
        const [totalVotes] = await connection.query('SELECT COUNT(*) as count FROM votes');
        const [todayVotes] = await connection.query('SELECT COUNT(*) as count FROM votes WHERE DATE(created_at) = CURDATE()');
        const [categories] = await connection.query('SELECT COUNT(*) as count FROM categories WHERE status = "Active"');
        const [creators] = await connection.query('SELECT COUNT(*) as count FROM creators WHERE status = "Active"');
        const [flaggedVotes] = await connection.query('SELECT COUNT(*) as count FROM votes WHERE is_flagged = TRUE');

        return {
            totalVotes: totalVotes[0].count,
            todayVotes: todayVotes[0].count,
            categories: categories[0].count,
            creators: creators[0].count,
            flaggedVotes: flaggedVotes[0].count
        };
    } finally {
        connection.release();
    }
};

// Get votes with pagination
const getVotes = async (filters = {}, page = 1, limit = 20) => {
    const connection = await pool.getConnection();
    
    try {
        let query = `SELECT v.*, c.title as category_title, cr.creator_name
                     FROM votes v
                     JOIN categories c ON v.category_id = c.id
                     JOIN creators cr ON v.creator_id = cr.id
                     WHERE 1=1`;
        
        const params = [];

        if (filters.categoryId) {
            query += ` AND v.category_id = ?`;
            params.push(filters.categoryId);
        }

        if (filters.creatorId) {
            query += ` AND v.creator_id = ?`;
            params.push(filters.creatorId);
        }

        if (filters.isFlagged !== undefined) {
            query += ` AND v.is_flagged = ?`;
            params.push(filters.isFlagged ? 1 : 0);
        }

        query += ` ORDER BY v.created_at DESC LIMIT ? OFFSET ?`;
        
        const offset = (page - 1) * limit;
        params.push(limit, offset);

        const [votes] = await connection.query(query, params);

        // Get total count
        let countQuery = `SELECT COUNT(*) as count FROM votes v
                         WHERE 1=1`;
        const countParams = [];

        if (filters.categoryId) {
            countQuery += ` AND v.category_id = ?`;
            countParams.push(filters.categoryId);
        }

        if (filters.creatorId) {
            countQuery += ` AND v.creator_id = ?`;
            countParams.push(filters.creatorId);
        }

        if (filters.isFlagged !== undefined) {
            countQuery += ` AND v.is_flagged = ?`;
            countParams.push(filters.isFlagged ? 1 : 0);
        }

        const [countResult] = await connection.query(countQuery, countParams);

        return {
            votes,
            total: countResult[0].count,
            page,
            limit,
            pages: Math.ceil(countResult[0].count / limit)
        };
    } finally {
        connection.release();
    }
};

// Get vote statistics
const getVoteStatistics = async () => {
    const connection = await pool.getConnection();
    
    try {
        // Votes per category
        const [perCategory] = await connection.query(
            `SELECT c.id, c.title, COUNT(v.id) as count
             FROM categories c
             LEFT JOIN votes v ON c.id = v.category_id
             GROUP BY c.id, c.title
             ORDER BY count DESC`
        );

        // Votes per creator
        const [perCreator] = await connection.query(
            `SELECT cr.id, cr.creator_name, c.title as category, COUNT(v.id) as count
             FROM creators cr
             LEFT JOIN votes v ON cr.id = v.creator_id
             LEFT JOIN categories c ON cr.category_id = c.id
             GROUP BY cr.id, cr.creator_name
             ORDER BY count DESC
             LIMIT 20`
        );

        // Votes per day (last 30 days)
        const [perDay] = await connection.query(
            `SELECT DATE(created_at) as date, COUNT(*) as count
             FROM votes
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
             GROUP BY DATE(created_at)
             ORDER BY date ASC`
        );

        return {
            perCategory,
            perCreator,
            perDay
        };
    } finally {
        connection.release();
    }
};

module.exports = {
    getDashboardSummary,
    getVotes,
    getVoteStatistics
};
