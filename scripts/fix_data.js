const { Client } = require('pg');

const client = new Client({
    connectionString: "postgres://postgres.dfopqdhjltpswagmlatb:QjhjNXPRmYRArEo2@aws-1-us-east-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
});

async function fixData() {
    try {
        await client.connect();
        console.log('Connected to fix data...');

        // 1. Check if profile exists for 12134
        const res = await client.query("SELECT * FROM teacher_profiles WHERE employee_id = '12134'");

        if (res.rows.length === 0) {
            console.log("Profile missing for 12134. Creating it...");
            await client.query(`
                INSERT INTO teacher_profiles (employee_id, full_name, email, designation, program, phone, bio, username, dob, doj, address, gender, skills, qualification, experience_years)
                VALUES ('12134', 'Hari', 'hari@example.com', 'Professor', 'Computer Science', '9876543210', 'Senior Lecturer', 'hari_12134', '1980-01-01', '2023-01-01', 'University Campus', 'Male', 'Java, Python', 'PhD', '10')
            `);
            console.log("Created profile for 12134.");
        } else {
            console.log("Profile exists for 12134. Updating empty fields...");
            await client.query(`
                UPDATE teacher_profiles 
                SET designation = COALESCE(NULLIF(designation, ''), 'Professor'),
                    program = COALESCE(NULLIF(program, ''), 'Computer Science'),
                    phone = COALESCE(NULLIF(phone, ''), '9876543210'),
                    username = COALESCE(NULLIF(username, ''), 'hari_12134'),
                    dob = COALESCE(NULLIF(dob, ''), '1980-01-01'),
                    doj = COALESCE(NULLIF(doj, ''), '2023-01-01'),
                    address = COALESCE(NULLIF(address, ''), 'University Campus'),
                    gender = COALESCE(NULLIF(gender, ''), 'Not Specified'),
                    skills = COALESCE(NULLIF(skills, ''), 'N/A'),
                    qualification = COALESCE(NULLIF(qualification, ''), 'Not Specified'),
                    experience_years = COALESCE(NULLIF(experience_years, ''), '0')
                WHERE employee_id = '12134'
            `);
            console.log("Updated profile for 12134.");
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

fixData();
