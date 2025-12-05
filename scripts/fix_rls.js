const { Client } = require('pg');

// Reusing the connection string found in scripts/update_schema_comprehensive.js
const client = new Client({
    connectionString: "postgres://postgres.dfopqdhjltpswagmlatb:QjhjNXPRmYRArEo2@aws-1-us-east-1.pooler.supabase.com:6543/postgres",
    ssl: {
        rejectUnauthorized: false
    }
});

async function fixPolicies() {
    try {
        await client.connect();
        console.log('Connected to database to Fix RLS Policies...');

        const query = `
        -- 1. Enable RLS (Ensure it is on)
        ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

        -- 2. Drop existing restrictive policies if any (to avoid conflicts)
        DROP POLICY IF EXISTS "Public Access" ON public.teacher_profiles;
        DROP POLICY IF EXISTS "Public Access Employees" ON public.employees;
        DROP POLICY IF EXISTS "Public Access Admins" ON public.admins;
        
        DROP POLICY IF EXISTS "Enable read access for all users" ON public.teacher_profiles;
        
        -- 3. Create Permissive Policies
        -- Since we handle Auth in the app logic (custom auth), we need the DB to be open to the app client (anon role)
        
        CREATE POLICY "Public Access" ON public.teacher_profiles FOR ALL USING (true) WITH CHECK (true);
        CREATE POLICY "Public Access Employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);
        CREATE POLICY "Public Access Admins" ON public.admins FOR ALL USING (true) WITH CHECK (true);
        
        -- Grant usage just in case
        GRANT USAGE ON SCHEMA public TO anon;
        GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
        GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
    `;

        await client.query(query);
        console.log('✅ RLS Policies Updated: Data should now be visible.');
    } catch (err) {
        console.error('❌ Policy Update Failed:', err);
    } finally {
        await client.end();
    }
}

fixPolicies();
