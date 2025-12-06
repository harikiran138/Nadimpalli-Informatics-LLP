const { Client } = require('pg');

const client = new Client({
    connectionString: "postgres://postgres.dfopqdhjltpswagmlatb:QjhjNXPRmYRArEo2@aws-1-us-east-1.pooler.supabase.com:6543/postgres",
    ssl: {
        rejectUnauthorized: false
    }
});

async function reloadCache() {
    try {
        await client.connect();
        console.log('Connected to database. Reloading schema cache...');

        // Verify columns first just to be sure
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'teacher_profiles' 
            AND column_name = 'first_name';
        `);

        if (res.rows.length > 0) {
            console.log("✅ 'first_name' column exists in database.");
        } else {
            console.error("❌ 'first_name' column STIll MISSING in database!");
        }

        // Notify PostgREST to reload schema
        await client.query("NOTIFY pgrst, 'reload config';");
        console.log('✅ Sent NOTIFY pgrst, "reload config"');

    } catch (err) {
        console.error('❌ Failed to reload cache', err);
    } finally {
        await client.end();
    }
}

reloadCache();
