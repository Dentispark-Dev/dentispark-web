const { Client } = require('pg');

const client = new Client({
    user: 'dentispark_admin',
    host: '158.220.83.23',
    database: 'dentispark_mgt',
    password: 'dr346rrffe4578thj34',
    port: 5432,
});

async function dropConstraint() {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL DB");

        const res = await client.query('ALTER TABLE platform_permission DROP CONSTRAINT IF EXISTS platform_permission_permission_check');
        console.log("Dropped check constraint successfully.");

    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

dropConstraint();
