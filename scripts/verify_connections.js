const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function verifyConnections() {
    console.log('🔍 Starting Connection Verification...');

    // 1. Check Env Vars
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('❌ Error: POSTGRES_URL is missing in .env.local');
        return;
    }
    console.log('✅ Environment variables found.');

    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        // 2. Connect
        await client.connect();
        console.log('✅ Database connection established.');

        // 3. Check Table Existence
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'notifications'
            );
        `);

        if (tableCheck.rows[0].exists) {
            console.log('✅ Table "notifications" exists.');
        } else {
            console.error('❌ Table "notifications" does NOT exist.');
            return;
        }

        // 4. Test Write (Insert)
        const testId = 'test-connection-' + Date.now();
        const insertRes = await client.query(`
            INSERT INTO notifications (recipient_id, sender_id, title, message, type)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `, ['test-user', 'system-verify', 'Connection Test', 'This is a test message.', 'test']);

        const newRowId = insertRes.rows[0].id;
        console.log(`✅ Write operation successful. Created notification ID: ${newRowId}`);

        // 5. Test Read
        const readRes = await client.query(`
            SELECT * FROM notifications WHERE id = $1;
        `, [newRowId]);

        if (readRes.rows.length > 0 && readRes.rows[0].message === 'This is a test message.') {
            console.log('✅ Read operation successful.');
        } else {
            console.error('❌ Read operation failed.');
        }

        // 6. Clean up
        await client.query(`DELETE FROM notifications WHERE id = $1`, [newRowId]);
        console.log('✅ Cleanup successful.');

        console.log('\n🎉 ALL CHECKS PASSED. The internal communication system is backend-ready.');

    } catch (err) {
        console.error('❌ Connection or Query Error:', err);
    } finally {
        await client.end();
    }
}

verifyConnections();
