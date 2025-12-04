-- Insert Default Admin User
INSERT INTO public.employees (employee_id, full_name, password_hash)
VALUES ('ADMIN001', 'System Admin', 'admin123')
ON CONFLICT (employee_id) DO NOTHING;

-- Grant Admin Access
INSERT INTO public.admins (employee_id)
VALUES ('ADMIN001')
ON CONFLICT (employee_id) DO NOTHING;
