const { Resend } = require('resend');

const resend = new Resend('re_UioJViGA_6GXqxtC756XLiig62Cdnp3Ro');

async function testEmail() {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Nadimpalli Informatics <onboarding@resend.dev>',
            to: 'nadimpalliinformatics@gmail.com',
            subject: 'Test Email - Resend API Key Verification',
            html: `
                <h2>Test Email Successful!</h2>
                <p>This is a test email to verify that the new Resend API key is working correctly.</p>
                <p><strong>API Key:</strong> re_UioJViGA_6GXqxtC756XLiig62Cdnp3Ro</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                <hr/>
                <p>If you're receiving this email, the integration is working perfectly!</p>
            `
        });

        if (error) {
            console.error('❌ Email send failed:', error);
            return;
        }

        console.log('✅ Email sent successfully!');
        console.log('📧 Email ID:', data.id);
        console.log('📬 Sent to: nadimpalliinformatics@gmail.com');
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

testEmail();
