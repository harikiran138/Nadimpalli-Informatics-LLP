import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPolicies() {
    console.log("Applying RLS policies via SQL (using rpc if available, or just testing access)...");

    // Checking if we can read
    const { data, error } = await supabase.from('teacher_profiles').select('count', { count: 'exact', head: true });

    if (error) {
        console.log("Read check failed (Expected if RLS blocks):", error.message);
    } else {
        console.log("Read check passed. Count:", data); // If null/0, might just be empty or blocked.
    }

    console.log("\nIMPORTANT: Since I cannot run raw SQL directly without a specialized function or connection string,");
    console.log("I will assume the missing visibility is due to strict RLS or missing data.");
    console.log("Please run the following SQL in your Supabase Dashboard SQL Editor to FIX visibility:\n");

    const sql = `
-- Enable RLS (good practice to have it on, even if policies are open for now)
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;

-- Allow ALL operations for now (since we use custom auth)
-- DROP POLICY IF EXISTS "Public Policy" ON teacher_profiles;
CREATE POLICY "Public Access" ON teacher_profiles FOR ALL USING (true) WITH CHECK (true);

-- Also ensure 'employees' table is readable
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access Employees" ON employees FOR ALL USING (true) WITH CHECK (true);

-- Also 'admins'
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access Admins" ON admins FOR ALL USING (true) WITH CHECK (true);
  `;

    console.log(sql);
}

fixPolicies();
