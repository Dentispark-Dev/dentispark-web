const { Client } = require('pg');

const client = new Client({
    user: 'dentispark_admin',
    host: '158.220.83.23',
    database: 'dentispark_mgt',
    password: 'dr346rrffe4578thj34',
    port: 5432,
});

async function testDB() {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL DB");

        const studentRes = await client.query('SELECT count(*) FROM platform_student');
        console.log(`Total Students: ${studentRes.rows[0].count}`);

        const rolesRes = await client.query('SELECT id, name FROM platform_role');
        console.log("Roles in DB:");
        console.table(rolesRes.rows);

    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

testDB();
