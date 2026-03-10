const { Client } = require('pg');

const client = new Client({
    user: 'dentispark_admin',
    host: '158.220.83.23',
    database: 'dentispark_mgt',
    password: 'dr346rrffe4578thj34',
    port: 5432,
});

async function checkPermissions() {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL DB");
        const res = await client.query('SELECT DISTINCT permission FROM platform_permission');
        console.log("Current Permissions in DB:");
        console.table(res.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

checkPermissions();
