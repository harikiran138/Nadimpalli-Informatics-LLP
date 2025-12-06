const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function createContactTable() {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL; // Direct connection string usually available or constructed
    // Sometimes Supabase standard .env has DATABASE_URL or POSTGRES_URL.
    // If not, we might fail, but let's try.

    if (!connectionString) {
        console.error('❌ DATABASE_URL not found in .env.local');
        // Fallback: Try constructing from specific vars if standard ones missing, but DATABASE_URL is standard.
        process.exit(1);
    }

    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false } // Required for Supabase/Neon usually
    });

    try {
        await client.connect();
        console.log('🔌 Connected to database...');

        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS public.contact_submissions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'new',
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now()
            );

            -- Enable RLS
            ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

            -- Create Policy (Drop existing if exists to avoid error, or use DO block)
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies 
                    WHERE tablename = 'contact_submissions' 
                    AND policyname = 'Allow public insert'
                ) THEN
                    CREATE POLICY "Allow public insert" ON public.contact_submissions 
                    FOR INSERT 
                    WITH CHECK (true);
                END IF;
            END
            $$;
        `;

        await client.query(createTableSQL);
        console.log('✅ Table "contact_submissions" created or verified successfully.');

    } catch (err) {
        console.error('❌ Error creating table:', err);
    } finally {
        await client.end();
    }
}

createContactTable();
