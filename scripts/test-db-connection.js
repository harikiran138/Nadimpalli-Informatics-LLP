
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase environment variables in .env.local');
        console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
        console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Missing');
        return;
    }

    console.log('🔄 Testing connection to:', supabaseUrl);

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data, error } = await supabase
            .from('employees')
            .select('*')
            .eq('employee_id', 'ADMIN001')
            .single();

        if (error) {
            console.error('❌ Query failed:', error.message);
            console.log('Error details:', error);
        } else if (!data) {
            console.log('⚠️ Query successful but no data returned. (Possible RLS issue or user missing)');
        } else {
            console.log('✅ Found Admin User:', data.full_name);
        }
    }
    catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
}

testConnection();
