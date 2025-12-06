const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function createNotificationsTable() {
    // Use POSTGRES_URL from .env.local
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('❌ POSTGRES_URL not found in .env.local');
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
            CREATE TABLE IF NOT EXISTS public.notifications (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                recipient_id TEXT NOT NULL, -- employee_id of receiver
                sender_id TEXT NOT NULL,    -- employee_id of admin
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                type TEXT DEFAULT 'individual', -- individual, broadcast
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMPTZ DEFAULT now()
            );

            -- Indexes for performance
            CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
            CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

            -- Enable RLS
            ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

            -- Policies
            -- 1. Admins can insert (We'll use Service Role mostly, but good to have)
            -- 2. Recipients can select their own notifications
            -- 3. Recipients can update 'is_read' on their own notifications

            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies 
                    WHERE tablename = 'notifications' 
                    AND policyname = 'Users can view their own notifications'
                ) THEN
                    CREATE POLICY "Users can view their own notifications" ON public.notifications 
                    FOR SELECT 
                    USING (recipient_id = auth.uid()::text OR recipient_id = (select employee_id from employees where id = auth.uid())); 
                    -- Note: Mapping auth.uid() to employee_id might be tricky in pure SQL relying on 'employees' table join.
                    -- Simplification: We will trust the Server Actions to enforce visibility. 
                    -- But let's add a basic one matching recipient_id if we store UUID there. 
                    -- Wait, implementation plan said recipient_id is TEXT (employee_id). 
                    -- So RLS based on auth.uid() needs a join or matching if we stored UUID.
                    -- For now, we will rely on Server Actions (Service Role) for fetching to ensure correctness easily.
                    -- We can skip complex RLS logic here and just enable it to default-deny public access.
                END IF;
            END
            $$;
        `;

        await client.query(createTableSQL);
        console.log('✅ Table "notifications" created successfully.');

    } catch (err) {
        console.error('❌ Error creating table:', err);
    } finally {
        await client.end();
    }
}

createNotificationsTable();
