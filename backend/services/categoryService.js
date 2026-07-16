const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Get all categories with vote counts
const getAllCategories = async () => {
    const connection = await pool.getConnection();
    
    try {
        const [categories] = await connection.query(
            `SELECT 
                c.*,
                COUNT(v.id) as vote_count,
                COUNT(DISTINCT cr.id) as creator_count
             FROM categories c
             LEFT JOIN votes v ON c.id = v.category_id
             LEFT JOIN creators cr ON c.id = cr.category_id AND cr.status = 'Active'
             GROUP BY c.id
             ORDER BY c.display_order ASC`
        );
        return categories;
    } finally {
        connection.release();
    }
};

// Create category
const createCategory = async (data) => {
    const connection = await pool.getConnection();
    
    try {
        // Check if title is unique
        const [existing] = await connection.query(
            'SELECT id FROM categories WHERE title = ?',
            [data.title]
        );

        if (existing.length > 0) {
            throw new Error('Category with this title already exists');
        }

        const slug = data.title.toLowerCase().replace(/\s+/g, '-');

        const [result] = await connection.query(
            `INSERT INTO categories (title, slug, description, display_order, status, voting_start, voting_end)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.title,
                slug,
                data.description || null,
                data.displayOrder || 0,
                data.status || 'Active',
                data.votingStart || null,
                data.votingEnd || null
            ]
        );

        return result.insertId;
    } finally {
        connection.release();
    }
};

// Update category
const updateCategory = async (categoryId, data) => {
    const connection = await pool.getConnection();
    
    try {
        // Check if updating title to a duplicate
        if (data.title) {
            const [existing] = await connection.query(
                'SELECT id FROM categories WHERE title = ? AND id != ?',
                [data.title, categoryId]
            );

            if (existing.length > 0) {
                throw new Error('Category with this title already exists');
            }
        }

        const updates = [];
        const values = [];

        if (data.title) {
            updates.push('title = ?');
            values.push(data.title);
        }
        if (data.description !== undefined) {
            updates.push('description = ?');
            values.push(data.description);
        }
        if (data.displayOrder !== undefined) {
            updates.push('display_order = ?');
            values.push(data.displayOrder);
        }
        if (data.status) {
            updates.push('status = ?');
            values.push(data.status);
        }
        if (data.votingStart !== undefined) {
            updates.push('voting_start = ?');
            values.push(data.votingStart);
        }
        if (data.votingEnd !== undefined) {
            updates.push('voting_end = ?');
            values.push(data.votingEnd);
        }

        if (updates.length === 0) {
            return;
        }

        values.push(categoryId);

        await connection.query(
            `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    } finally {
        connection.release();
    }
};

// Delete category
const deleteCategory = async (categoryId) => {
    const connection = await pool.getConnection();
    
    try {
        // Check if category has votes
        const [votes] = await connection.query(
            'SELECT id FROM votes WHERE category_id = ? LIMIT 1',
            [categoryId]
        );

        if (votes.length > 0) {
            throw new Error('Cannot delete category with votes');
        }

        // Delete category
        await connection.query(
            'DELETE FROM categories WHERE id = ?',
            [categoryId]
        );
    } finally {
        connection.release();
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
