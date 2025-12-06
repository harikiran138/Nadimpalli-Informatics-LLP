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
CREATE POLICY "Allow public insert" ON public.contact_submissions 
    FOR INSERT 
    WITH CHECK (true);

-- Only admins/authenticated staff should read submissions (adjust as per actual auth logic later)
-- For now, maybe allow anon read for debug, or restrict to auth
-- CREATE POLICY "Allow auth read" ON public.contact_submissions FOR SELECT USING (auth.role() = 'authenticated');
-- For simplicity in this demo phase/tasks, we'll keep it open or restrict to service role usage in server actions (which bypass RLS if using service key, but standard client uses anon key). 
-- If using anon key insert, RLS is fine. If we need to read from admin panel later, we'll add a read policy.
