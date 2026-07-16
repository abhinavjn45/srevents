const pool = require('../config/database');

// Get or create vote device
const getOrCreateVoteDevice = async (browserFingerprint, cookieToken, localStorageToken, ipAddress, userAgent) => {
    const connection = await pool.getConnection();
    
    try {
        // Try to find existing device
        const [devices] = await connection.query(
            'SELECT * FROM vote_devices WHERE browser_fingerprint = ? OR cookie_token = ? OR local_storage_token = ? LIMIT 1',
            [browserFingerprint, cookieToken, localStorageToken]
        );

        if (devices.length > 0) {
            // Update last seen and IP
            await connection.query(
                'UPDATE vote_devices SET latest_ip = ?, last_seen = NOW() WHERE id = ?',
                [ipAddress, devices[0].id]
            );
            return devices[0];
        }

        // Create new device
        const { parseUserAgent } = require('../utils/fingerprint');
        const userAgentInfo = parseUserAgent(userAgent);

        const [result] = await connection.query(
            `INSERT INTO vote_devices (browser_fingerprint, cookie_token, local_storage_token, first_ip, latest_ip, browser, operating_system, device_type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                browserFingerprint,
                cookieToken,
                localStorageToken,
                ipAddress,
                ipAddress,
                userAgentInfo.browser,
                userAgentInfo.os,
                userAgentInfo.deviceType
            ]
        );

        return {
            id: result.insertId,
            browser_fingerprint: browserFingerprint,
            cookie_token: cookieToken,
            local_storage_token: localStorageToken,
            latest_ip: ipAddress,
            first_ip: ipAddress
        };
    } finally {
        connection.release();
    }
};

// Check if device already voted in category
const hasDeviceVotedInCategory = async (voteDeviceId, categoryId) => {
    const connection = await pool.getConnection();
    
    try {
        const [votes] = await connection.query(
            'SELECT id FROM votes WHERE vote_device_id = ? AND category_id = ? LIMIT 1',
            [voteDeviceId, categoryId]
        );

        return votes.length > 0;
    } finally {
        connection.release();
    }
};

// Get all active categories
const getActiveCategories = async () => {
    const connection = await pool.getConnection();
    
    try {
        const [categories] = await connection.query(
            'SELECT * FROM categories WHERE status = "Active" ORDER BY display_order ASC'
        );
        return categories;
    } finally {
        connection.release();
    }
};

// Get category with creators
const getCategoryWithCreators = async (categoryId) => {
    const connection = await pool.getConnection();
    
    try {
        const [categories] = await connection.query(
            'SELECT * FROM categories WHERE id = ? AND status = "Active"',
            [categoryId]
        );

        if (categories.length === 0) {
            return null;
        }

        const [creators] = await connection.query(
            'SELECT * FROM creators WHERE category_id = ? AND status = "Active" ORDER BY display_order ASC',
            [categoryId]
        );

        return {
            ...categories[0],
            creators
        };
    } finally {
        connection.release();
    }
};

// Get creators by category
const getCreatorsByCategory = async (categoryId) => {
    const connection = await pool.getConnection();
    
    try {
        const [creators] = await connection.query(
            'SELECT * FROM creators WHERE category_id = ? AND status = "Active" ORDER BY display_order ASC',
            [categoryId]
        );
        return creators;
    } finally {
        connection.release();
    }
};

// Record vote
const recordVote = async (categoryId, creatorId, voteDeviceId, ipAddress, userAgent, riskScore = 0) => {
    const connection = await pool.getConnection();
    
    try {
        const [result] = await connection.query(
            `INSERT INTO votes (category_id, creator_id, vote_device_id, ip_address, user_agent, risk_score)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [categoryId, creatorId, voteDeviceId, ipAddress, userAgent, riskScore]
        );

        return result.insertId;
    } finally {
        connection.release();
    }
};

module.exports = {
    getOrCreateVoteDevice,
    hasDeviceVotedInCategory,
    getActiveCategories,
    getCategoryWithCreators,
    getCreatorsByCategory,
    recordVote
};
