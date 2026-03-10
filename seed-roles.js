const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

const client = new Client({
    user: 'dentispark_admin',
    host: '158.220.83.23',
    database: 'dentispark_mgt',
    password: 'dr346rrffe4578thj34',
    port: 5432,
});

const roles = [
    { name: 'Admin', description: 'Platform Administrator' },
    { name: 'Moderator', description: 'Content and Community Moderator' },
    { name: 'Mentors', description: 'Platform Mentors' },
    { name: 'Students', description: 'Platform Students' }
];

async function seedRoles() {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL DB");

        for (const role of roles) {
            // Check if role exists
            const checkRes = await client.query('SELECT id FROM platform_role WHERE name = $1', [role.name]);

            if (checkRes.rows.length === 0) {
                const insertRes = await client.query(
                    'INSERT INTO platform_role (guid, name, description, users, created_at, updated_at) VALUES ($1, $2, $3, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id',
                    [uuidv4(), role.name, role.description]
                );
                console.log(`Created role: ${role.name} with ID: ${insertRes.rows[0].id}`);
            } else {
                console.log(`Role already exists: ${role.name}`);
            }
        }

        const allRoles = await client.query('SELECT id, name FROM platform_role');
        console.table(allRoles.rows);

    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

seedRoles();
