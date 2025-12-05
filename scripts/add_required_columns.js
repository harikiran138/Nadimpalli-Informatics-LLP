
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim().replace(/"/g, '');
    }
});

async function migrate() {
    console.log('Adding missing columns...');

    const sql = `
    ALTER TABLE employees ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'employee';
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin';
    ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS department TEXT;
    ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
    ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS experience INTEGER DEFAULT 0;
    
    NOTIFY pgrst, 'reload config';
    `;

    try {
        const { Client } = require('pg');
        const connectionString = env.DATABASE_URL || env.POSTGRES_URL || env.SUPABASE_DB_URL;

        if (!connectionString) {
            console.error("❌ No direct database connection string found (DATABASE_URL). Cannot run DDL.");
            return;
        }

        const client = new Client({
            connectionString: connectionString,
            ssl: { rejectUnauthorized: false }
        });

        await client.connect();
        await client.query(sql);
        console.log("✅ Successfully added missing columns.");
        await client.end();

    } catch (e) {
        console.error("❌ Failed to run migration via pg:", e.message);
        console.log("If 'pg' is not installed or connection fails, please run this SQL in Supabase Dashboard:");
        console.log(sql);
    }
}

migrate();
