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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('Adding missing columns to teacher_profiles...');

    // SQL to add columns if they don't exist
    const sql = `
    ALTER TABLE teacher_profiles 
    ADD COLUMN IF NOT EXISTS bio TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS skills TEXT,
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS designation TEXT,
    ADD COLUMN IF NOT EXISTS subjects TEXT[],
    ADD COLUMN IF NOT EXISTS office_room TEXT,
    ADD COLUMN IF NOT EXISTS availability TEXT,
    ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS experience_teaching JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS experience_admin JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS publications JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS awards JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS events JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS memberships JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS student_interaction JSONB DEFAULT '{}'::jsonb;
  `;

    // We can't run raw SQL with supabase-js client easily unless we use rpc or have direct connection.
    // However, since we are in a node script, we can try to use the 'pg' library if available, 
    // OR we can use the supabase client to call a stored procedure if one exists for running sql.
    // BUT, usually for these tasks we might not have 'pg' installed or configured.

    // Let's check if 'pg' is available in package.json or node_modules.
    // If not, we might need to ask user to run SQL in dashboard.
    // But wait, previous logs showed usage of 'pg'. Let's try to use 'pg'.

    try {
        const { Client } = require('pg');
        // We need the connection string. It's usually in .env.local as DATABASE_URL or similar, 
        // or we can construct it from supabase project ref if we had the password.
        // Let's check env for DATABASE_URL or POSTGRES_URL.

        const connectionString = env.DATABASE_URL || env.POSTGRES_URL || env.SUPABASE_DB_URL;

        if (!connectionString) {
            console.error("No direct database connection string found (DATABASE_URL). Cannot run DDL.");
            return;
        }

        const client = new Client({
            connectionString: connectionString,
            ssl: { rejectUnauthorized: false }
        });

        await client.connect();
        await client.query(sql);
        console.log("Successfully added missing columns.");
        await client.end();

    } catch (e) {
        console.error("Failed to run migration via pg:", e);
        console.log("Attempting fallback via Supabase RPC (if 'exec_sql' function exists)...");

        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
        if (error) {
            console.error("RPC failed:", error);
            console.log("Please run the following SQL in your Supabase SQL Editor:");
            console.log(sql);
        } else {
            console.log("Migration successful via RPC.");
        }
    }
}

migrate();
