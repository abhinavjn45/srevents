const pool = require('./config/database');

async function migrate() {
    const connection = await pool.getConnection();
    try {
        console.log('Altering audit_logs table...');
        await connection.query('ALTER TABLE audit_logs MODIFY admin_id BIGINT NULL');
        console.log('Successfully altered audit_logs table.');
    } catch (error) {
        console.error('Migration failed:', error.message);
    } finally {
        connection.release();
        process.exit(0);
    }
}

migrate();
