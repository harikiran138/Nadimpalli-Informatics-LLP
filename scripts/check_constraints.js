const { Client } = require('pg');

const client = new Client({
    connectionString: "postgres://postgres.dfopqdhjltpswagmlatb:QjhjNXPRmYRArEo2@aws-1-us-east-1.pooler.supabase.com:6543/postgres",
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkConstraints() {
    try {
        await client.connect();

        // Check PK
        const pkRes = await client.query(`
            SELECT a.attname
            FROM   pg_index i
            JOIN   pg_attribute a ON a.attrelid = i.indrelid
                                 AND a.attnum = ANY(i.indkey)
            WHERE  i.indrelid = 'public.teacher_profiles'::regclass
            AND    i.indisprimary;
        `);
        console.log("Primary Key Columns:", pkRes.rows.map(r => r.attname));

        // Check Unique Constraints
        const uniqueRes = await client.query(`
            SELECT indexname, indexdef
            FROM pg_indexes
            WHERE tablename = 'teacher_profiles'
            AND indexdef LIKE '%UNIQUE%';
        `);
        console.log("Unique Indexes:", uniqueRes.rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkConstraints();
