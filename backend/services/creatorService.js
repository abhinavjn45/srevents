const pool = require('../config/database');

// Get all creators with vote counts
const getAllCreators = async (categoryId = null) => {
    const connection = await pool.getConnection();
    
    try {
        let query = `SELECT 
                        cr.*,
                        COUNT(v.id) as vote_count
                     FROM creators cr
                     LEFT JOIN votes v ON cr.id = v.creator_id`;
        
        const params = [];

        if (categoryId) {
            query += ` WHERE cr.category_id = ?`;
            params.push(categoryId);
        }

        query += ` GROUP BY cr.id ORDER BY cr.display_order ASC`;

        const [creators] = await connection.query(query, params);
        return creators;
    } finally {
        connection.release();
    }
};

// Create creator
const createCreator = async (categoryId, data, imagePath = null) => {
    const connection = await pool.getConnection();
    
    try {
        // Verify category exists
        const [categories] = await connection.query(
            'SELECT id FROM categories WHERE id = ?',
            [categoryId]
        );

        if (categories.length === 0) {
            throw new Error('Category not found');
        }

        const [result] = await connection.query(
            `INSERT INTO creators (category_id, creator_name, short_bio, profile_image, instagram_url, youtube_url, display_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                categoryId,
                data.creatorName,
                data.bio || null,
                imagePath || null,
                data.instagram || null,
                data.youtube || null,
                data.displayOrder || 0,
                'Active'
            ]
        );

        return result.insertId;
    } finally {
        connection.release();
    }
};

// Update creator
const updateCreator = async (creatorId, data, imagePath = null) => {
    const connection = await pool.getConnection();
    
    try {
        const updates = [];
        const values = [];

        if (data.creatorName) {
            updates.push('creator_name = ?');
            values.push(data.creatorName);
        }
        if (data.bio !== undefined) {
            updates.push('short_bio = ?');
            values.push(data.bio);
        }
        if (imagePath) {
            updates.push('profile_image = ?');
            values.push(imagePath);
        }
        if (data.instagram !== undefined) {
            updates.push('instagram_url = ?');
            values.push(data.instagram);
        }
        if (data.youtube !== undefined) {
            updates.push('youtube_url = ?');
            values.push(data.youtube);
        }
        if (data.displayOrder !== undefined) {
            updates.push('display_order = ?');
            values.push(data.displayOrder);
        }
        if (data.status) {
            updates.push('status = ?');
            values.push(data.status);
        }

        if (updates.length === 0) {
            return;
        }

        values.push(creatorId);

        await connection.query(
            `UPDATE creators SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    } finally {
        connection.release();
    }
};

// Delete creator or set to inactive
const deleteCreator = async (creatorId) => {
    const connection = await pool.getConnection();
    
    try {
        // Check if creator has votes
        const [votes] = await connection.query(
            'SELECT id FROM votes WHERE creator_id = ? LIMIT 1',
            [creatorId]
        );

        if (votes.length > 0) {
            // Set to inactive instead of deleting
            await connection.query(
                'UPDATE creators SET status = "Inactive" WHERE id = ?',
                [creatorId]
            );
        } else {
            // Delete if no votes
            await connection.query(
                'DELETE FROM creators WHERE id = ?',
                [creatorId]
            );
        }
    } finally {
        connection.release();
    }
};

module.exports = {
    getAllCreators,
    createCreator,
    updateCreator,
    deleteCreator
};
