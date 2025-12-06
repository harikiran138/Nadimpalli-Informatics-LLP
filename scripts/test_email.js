const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

async function sendTestEmail() {
    console.log('📧 Attempting to send test email...');

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error('❌ RESEND_API_KEY is missing from .env.local');
        return;
    }

    const resend = new Resend(apiKey);

    try {
        const data = await resend.emails.send({
            from: 'Nadimpalli Informatics <onboarding@resend.dev>',
            to: 'harikiran1388@gmail.com',
            subject: 'Test Email from Your Admin System',
            html: '<strong>It works!</strong><br/>Your email integration is successfully configured. 🚀'
        });

        if (data.error) {
            console.error('❌ Resend API Error:', data.error);
        } else {
            console.log('✅ Email sent successfully!');
            console.log('ID:', data.data?.id);
        }
    } catch (err) {
        console.error('❌ Exception:', err);
    }
}

sendTestEmail();
