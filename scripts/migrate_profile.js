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
        console.log('Connected to database');

        const query = `
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS designation TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS subjects TEXT[];
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS office_room TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS availability TEXT;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS experience_teaching JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS experience_admin JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS publications JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS awards JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS events JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS memberships JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS student_interaction JSONB DEFAULT '{}'::jsonb;
    `;

        await client.query(query);
        console.log('Migration completed successfully');
    } catch (err) {
        console.error('Migration failed', err);
    } finally {
        await client.end();
    }
}

migrate();
