
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAdmin() {
    const newAdmin = {
        employee_id: 'ADMIN002',
        full_name: 'New Admin User',
        password_hash: 'admin123' // Using plain text as per current auth implementation
    };

    console.log(`🔄 Adding new admin: ${newAdmin.employee_id}...`);

    // 1. Insert into employees
    const { error: empError } = await supabase
        .from('employees')
        .insert([newAdmin])
        .select();

    if (empError) {
        if (empError.code === '23505') { // Unique violation
            console.log('⚠️ User already exists in employees table.');
        } else {
            console.error('❌ Error adding employee:', empError.message);
            return;
        }
    } else {
        console.log('✅ Added to employees table.');
    }

    // 2. Insert into admins
    const { error: adminError } = await supabase
        .from('admins')
        .insert([{ employee_id: newAdmin.employee_id }])
        .select();

    if (adminError) {
        if (adminError.code === '23505') {
            console.log('⚠️ User already exists in admins table.');
        } else {
            console.error('❌ Error granting admin access:', adminError.message);
            return;
        }
    } else {
        console.log('✅ Granted admin access.');
    }

    console.log('\n🎉 Admin added successfully!');
    console.log('🆔 Employee ID: ADMIN002');
    console.log('🔑 Password: admin123');
}

addAdmin();
