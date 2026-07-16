const pool = require('../config/database');

// Get settings
const getSettings = async () => {
    const connection = await pool.getConnection();
    
    try {
        const [settings] = await connection.query('SELECT * FROM settings WHERE id = 1');
        return settings[0] || {};
    } finally {
        connection.release();
    }
};

// Update settings
const updateSettings = async (data) => {
    const connection = await pool.getConnection();
    
    try {
        const updates = [];
        const values = [];

        if (data.event_name !== undefined) {
            updates.push('event_name = ?');
            values.push(data.event_name);
        }
        if (data.event_logo !== undefined) {
            updates.push('event_logo = ?');
            values.push(data.event_logo);
        }
        if (data.event_description !== undefined) {
            updates.push('event_description = ?');
            values.push(data.event_description);
        }
        if (data.global_voting_enabled !== undefined) {
            updates.push('global_voting_enabled = ?');
            values.push(data.global_voting_enabled ? 1 : 0);
        }
        if (data.voting_start !== undefined) {
            updates.push('voting_start = ?');
            values.push(data.voting_start);
        }
        if (data.voting_end !== undefined) {
            updates.push('voting_end = ?');
            values.push(data.voting_end);
        }
        if (data.footer_text !== undefined) {
            updates.push('footer_text = ?');
            values.push(data.footer_text);
        }

        if (updates.length === 0) {
            return;
        }

        values.push(1);

        await connection.query(
            `UPDATE settings SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    } finally {
        connection.release();
    }
};

module.exports = {
    getSettings,
    updateSettings
};
