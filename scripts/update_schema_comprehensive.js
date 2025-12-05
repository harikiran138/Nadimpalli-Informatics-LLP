const { Client } = require('pg');

const client = new Client({
    connectionString: "postgres://postgres.dfopqdhjltpswagmlatb:QjhjNXPRmYRArEo2@aws-1-us-east-1.pooler.supabase.com:6543/postgres",
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    try {
        await client.connect();
        console.log('Connected to database for Comprehensive Update...');

        const query = `
      -- 1. Personal Details
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS gender TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS dob TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS doj TEXT; -- Date of Joining
      
      -- 2. Bio & Philosophy
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS teaching_philosophy TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS bio TEXT; -- Ensure it exists
      
      -- 3. Contact & Socials
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS phone TEXT; -- Ensure it exists
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS address TEXT; -- Ensure it exists
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;
      
      -- 4. Gallery & Media
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
      
      -- 5. Ensure JSONB Arrays for Lists (Just in case)
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS experience_teaching JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS experience_admin JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS publications JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS awards JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS events JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS memberships JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS student_interaction JSONB DEFAULT '{}'::jsonb;

      -- 6. Skills
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS skills TEXT; -- CSV or string
    `;

        await client.query(query);
        console.log('✅ Comprehensive Schema Update completed successfully');
    } catch (err) {
        console.error('❌ Migration failed', err);
    } finally {
        await client.end();
    }
}

migrate();
