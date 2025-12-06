-- Add missing columns to teacher_profiles table

-- Detailed Name
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS middle_name text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS last_name text;

-- New Emails
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS official_email text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS personal_email text;

-- Personal (New)
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS dob text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS dor text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS blood_group text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS aadhar_number text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS pan_number text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS apaar_id text;

-- Addresses
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS communication_address text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS permanent_address text;

-- Experience
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS teaching_experience_years text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS post_mtech_experience text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS post_teaching_experience text;

-- Office/Professional
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS office_room text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS availability text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS teaching_philosophy text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS qualification text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS subjects text[]; -- Array of text

-- Complex Lists (JSONB)
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS education jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS experience_teaching jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS experience_admin jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS publications jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS projects jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS awards jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS events jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS memberships jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS gallery jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS student_interaction jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb;

-- Text Lists
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS skills text;
