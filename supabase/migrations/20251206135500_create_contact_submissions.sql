-- Create Contact Submissions Table
-- This table stores messages from the "Contact Us" form on the landing page.

CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- new, read, responded
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies for Contact Submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon) to insert contact submissions
-- We use DO block to prevent errors if policy already exists
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
