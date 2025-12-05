
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function seedData() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase environment variables in .env.local');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🌱 Starting seed process...');

    // 1. Seed Employees
    const employees = [
        { employee_id: 'ADMIN001', full_name: 'System Admin', password_hash: 'password', role: 'admin' },
        { employee_id: 'EMP001', full_name: 'John Doe', password_hash: 'password', role: 'employee' },
        { employee_id: 'EMP002', full_name: 'Jane Smith', password_hash: 'password', role: 'employee' },
        { employee_id: 'EMP003', full_name: 'Alice Johnson', password_hash: 'password', role: 'employee' },
        { employee_id: 'EMP004', full_name: 'Bob Brown', password_hash: 'password', role: 'employee' },
        { employee_id: 'EMP005', full_name: 'Charlie Davis', password_hash: 'password', role: 'employee' },
    ];

    console.log('... Seeding Employees table');
    const { error: empError } = await supabase
        .from('employees')
        .upsert(employees, { onConflict: 'employee_id' });

    if (empError) {
        console.error('❌ Error seeding employees:', empError.message);
    } else {
        console.log('✅ Employees seeded successfully');
    }

    // 2. Seed Admins (Link to ADMIN001)
    console.log('... Seeding Admins table');
    const { error: adminError } = await supabase
        .from('admins')
        .upsert([{ employee_id: 'ADMIN001', role: 'super_admin' }], { onConflict: 'employee_id' });

    if (adminError) {
        console.error('❌ Error seeding admins:', adminError.message);
    } else {
        console.log('✅ Admins seeded successfully');
    }

    // 3. Seed Teacher Profiles (Link to Employees)
    console.log('... Seeding Teacher Profiles');
    const profiles = employees
        .filter(e => e.role === 'employee')
        .map(e => ({
            employee_id: e.employee_id,
            full_name: e.full_name,
            username: e.employee_id.toLowerCase(),
            email: `${e.employee_id.toLowerCase()}@example.com`,
            phone: '123-456-7890',
            department: 'General',
            program: 'B.Tech',
            dob: '1990-01-01',
            doj: '2023-01-01',
            gender: 'Male',
            qualification: 'Ph.D',
            experience_years: 5
        }));

    const { error: profileError } = await supabase
        .from('teacher_profiles')
        .upsert(profiles, { onConflict: 'employee_id' });

    if (profileError) {
        console.error('❌ Error seeding profiles:', profileError.message);
    } else {
        console.log('✅ Teacher Profiles seeded successfully');
    }

    console.log('🏁 Seed process completed.');
}

seedData();
