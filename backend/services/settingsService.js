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

        if (data.eventName) {
            updates.push('event_name = ?');
            values.push(data.eventName);
        }
        if (data.eventLogo) {
            updates.push('event_logo = ?');
            values.push(data.eventLogo);
        }
        if (data.eventDescription) {
            updates.push('event_description = ?');
            values.push(data.eventDescription);
        }
        if (data.globalVotingEnabled !== undefined) {
            updates.push('global_voting_enabled = ?');
            values.push(data.globalVotingEnabled ? 1 : 0);
        }
        if (data.votingStart) {
            updates.push('voting_start = ?');
            values.push(data.votingStart);
        }
        if (data.votingEnd) {
            updates.push('voting_end = ?');
            values.push(data.votingEnd);
        }
        if (data.footerText) {
            updates.push('footer_text = ?');
            values.push(data.footerText);
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
