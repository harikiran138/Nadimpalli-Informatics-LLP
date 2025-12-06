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
      -- 0. Detailed Name (CRITICAL MISSING FIELDS)
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS first_name text;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS middle_name text;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS last_name text;

      -- 1. Emails
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS official_email text;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS personal_email text;

      -- 2. Personal Details
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS gender TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS dob TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS dor TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS blood_group TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS aadhar_number TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS pan_number TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS apaar_id TEXT;
      
      -- 3. Bio & Philosophy
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS teaching_philosophy TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS bio TEXT; 
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS doj TEXT; 
      
      -- 4. Contact & Socials
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS address TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS communication_address TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS permanent_address TEXT;

      -- 5. Professional
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS office_room TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS availability TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS qualification TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS teaching_experience_years TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS post_mtech_experience TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS post_teaching_experience TEXT;
      
      -- 6. JSONB Arrays
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS experience_teaching JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS experience_admin JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS publications JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS awards JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS events JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS memberships JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS student_interaction JSONB DEFAULT '{}'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

      -- 7. Skills
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS skills TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS subjects text[];

      -- Reload Config
      NOTIFY pgrst, 'reload config';
    `;

        await client.query(query);
        console.log('✅ Comprehensive Schema Update completed and Config Reloaded');
    } catch (err) {
        console.error('❌ Migration failed', err);
    } finally {
        await client.end();
    }
}

migrate();
