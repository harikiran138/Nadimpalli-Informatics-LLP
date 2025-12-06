const { Resend } = require('resend');

const resend = new Resend('re_UioJViGA_6GXqxtC756XLiig62Cdnp3Ro');

async function testContactFormEmail() {
    console.log('🧪 Testing Direct Email Delivery for Contact Form...\n');

    const testData = {
        name: 'Test User',
        email: 'testuser@example.com',
        message: 'This is a test message to verify the new direct email delivery system.\n\nMultiple lines should be preserved correctly!'
    };

    try {
        const { data, error } = await resend.emails.send({
            from: 'Nadimpalli Informatics <onboarding@resend.dev>',
            to: 'nadimpalliinformatics@gmail.com',
            subject: `New Contact Form Submission from ${testData.name}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .field { margin-bottom: 20px; }
                        .label { font-weight: bold; color: #667eea; text-transform: uppercase; font-size: 12px; }
                        .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #667eea; }
                        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0;">📬 New Contact Form Submission</h1>
                            <p style="margin: 10px 0 0 0; opacity: 0.9;">You have received a new message from your website</p>
                        </div>
                        <div class="content">
                            <div class="field">
                                <div class="label">From</div>
                                <div class="value">${testData.name}</div>
                            </div>
                            <div class="field">
                                <div class="label">Email Address</div>
                                <div class="value"><a href="mailto:${testData.email}" style="color: #667eea;">${testData.email}</a></div>
                            </div>
                            <div class="field">
                                <div class="label">Message</div>
                                <div class="value">${testData.message.replace(/\n/g, '<br>')}</div>
                            </div>
                            <div class="footer">
                                <p>📅 Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                                <p>💡 You can reply directly to ${testData.email}</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
New Contact Form Submission

From: ${testData.name}
Email: ${testData.email}
Message: ${testData.message}

Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            `
        });

        if (error) {
            console.error('❌ Email send failed:', error);
            return;
        }

        console.log('✅ Direct Email Delivery Test PASSED!');
        console.log('📧 Email ID:', data.id);
        console.log('📬 Sent to: nadimpalliinformatics@gmail.com');
        console.log('💡 Check your inbox for a beautifully formatted email!\n');
        console.log('📋 Test Data:');
        console.log('   Name:', testData.name);
        console.log('   Email:', testData.email);
        console.log('   Message:', testData.message.substring(0, 50) + '...');

    } catch (err) {
        console.error('❌ Test Failed:', err.message);
    }
}

testContactFormEmail();
