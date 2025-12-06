const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
let envConfig = '';
try {
    envConfig = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    console.error("Could not read .env.local");
    process.exit(1);
}

const env = {};
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim().replace(/"/g, '');
    }
});

// Try to get connection string for direct PG execution if possible
const connectionString = env.DATABASE_URL || env.POSTGRES_URL || env.SUPABASE_DB_URL;

async function migrate() {
    console.log('Updating schema for teacher_profiles...');

    const sql = `
    ALTER TABLE teacher_profiles 
    ADD COLUMN IF NOT EXISTS personal_email TEXT,
    ADD COLUMN IF NOT EXISTS official_email TEXT,
    ADD COLUMN IF NOT EXISTS dor DATE, -- Date of Retirement
    ADD COLUMN IF NOT EXISTS aadhar_number TEXT,
    ADD COLUMN IF NOT EXISTS pan_number TEXT,
    ADD COLUMN IF NOT EXISTS apaar_id TEXT,
    ADD COLUMN IF NOT EXISTS blood_group TEXT,
    ADD COLUMN IF NOT EXISTS communication_address TEXT,
    ADD COLUMN IF NOT EXISTS permanent_address TEXT,
    ADD COLUMN IF NOT EXISTS post_mtech_experience TEXT,
    ADD COLUMN IF NOT EXISTS teaching_experience_years TEXT, -- Storing as text to be safe or flexible, user said integer/decimal but schema had experience_years as text
    ADD COLUMN IF NOT EXISTS post_teaching_experience TEXT;
    
    -- Ensure experience_years is present (it was in previous schema but good to double check)
    ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS experience_years TEXT;
  `;

    if (connectionString) {
        try {
            const { Client } = require('pg');
            const client = new Client({
                connectionString: connectionString,
                ssl: { rejectUnauthorized: false }
            });
            await client.connect();
            await client.query(sql);
            console.log("Successfully updated schema via PG driver.");
            await client.end();
            return;
        } catch (e) {
            console.error("PG driver failed, trying RPC...", e.message);
        }
    }

    // Fallback to Supabase RPC if PG fails or no connection string
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase credentials');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        console.error("RPC failed. Please run this SQL manually:", error.message);
        console.log(sql);
    } else {
        console.log("Schema update successful via RPC.");
    }
}

migrate();
