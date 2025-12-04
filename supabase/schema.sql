-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL, -- In a real app, use Supabase Auth or proper hashing
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT NOT NULL REFERENCES public.employees(employee_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(employee_id)
);

-- Create RLS Policies (Optional but recommended)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone for demo purposes (Adjust for production)
CREATE POLICY "Allow public read access" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.admins FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.admins FOR INSERT WITH CHECK (true);

-- Create Teacher Profiles Table
CREATE TABLE IF NOT EXISTS public.teacher_profiles (
    employee_id TEXT PRIMARY KEY REFERENCES public.employees(employee_id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    program TEXT NOT NULL, -- CSE, CSM, AI&ML, etc.
    dob DATE NOT NULL,
    doj DATE NOT NULL,
    gender TEXT NOT NULL,
    qualification TEXT NOT NULL,
    experience_years TEXT NOT NULL,
    is_profile_complete BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Profiles
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.teacher_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON public.teacher_profiles FOR UPDATE USING (true);
CREATE POLICY "Allow public insert" ON public.teacher_profiles FOR INSERT WITH CHECK (true);
