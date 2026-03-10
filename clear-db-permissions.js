const { Client } = require('pg');

const client = new Client({
    user: 'dentispark_admin',
    host: '158.220.83.23',
    database: 'dentispark_mgt',
    password: 'dr346rrffe4578thj34',
    port: 5432,
});

async function clearPermissions() {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL DB");

        // 1. Delete mapping table entries first to avoid foreign key constraints
        const resRolePerm = await client.query('DELETE FROM platform_role_permission');
        console.log(`Deleted ${resRolePerm.rowCount} rows from platform_role_permission`);

        // 2. Delete the outdated permissions
        const resPerm = await client.query('DELETE FROM platform_permission');
        console.log(`Deleted ${resPerm.rowCount} rows from platform_permission`);

    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

clearPermissions();
