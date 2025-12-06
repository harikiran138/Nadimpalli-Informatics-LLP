"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
        return { error: "All fields are required." };
    }

    // Send Email FIRST - This is the primary delivery method
    let emailSent = false;
    try {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY not configured");
        }

        const { data, error } = await resend.emails.send({
            from: 'Nadimpalli Informatics <onboarding@resend.dev>',
            to: 'nadimpalliinformatics@gmail.com',
            subject: `New Contact Form Submission from ${name}`,
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
                                <div class="value">${name}</div>
                            </div>
                            <div class="field">
                                <div class="label">Email Address</div>
                                <div class="value"><a href="mailto:${email}" style="color: #667eea;">${email}</a></div>
                            </div>
                            <div class="field">
                                <div class="label">Message</div>
                                <div class="value">${message.replace(/\n/g, '<br>')}</div>
                            </div>
                            <div class="footer">
                                <p>📅 Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                                <p>💡 You can reply directly to ${email}</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            // Also include plain text version
            text: `
New Contact Form Submission

From: ${name}
Email: ${email}
Message: ${message}

Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            `
        });

        if (error) {
            console.error("Resend API error:", error);
            throw error;
        }

        console.log("✅ Email sent successfully! ID:", data?.id);
        emailSent = true;

    } catch (emailError: any) {
        console.error("❌ Critical: Failed to send email notification:", emailError);
        // If email fails, we should notify the user
        return {
            error: "Failed to send your message. Please try again or email us directly at nadimpalliinformatics@gmail.com"
        };
    }

    // Store in database as backup/archive (secondary operation)
    try {
        const supabase = await createClient();
        const { error: dbError } = await supabase
            .from("contact_submissions")
            .insert({
                full_name: name,
                email: email,
                message: message,
            });

        if (dbError) {
            console.error("⚠️ Database storage failed (email was sent):", dbError);
            // Email was sent successfully, so we still return success
        }
    } catch (dbError) {
        console.error("⚠️ Database error (email was sent):", dbError);
        // Email was sent successfully, so we still return success
    }

    return {
        success: "Message sent successfully! We'll get back to you soon."
    };
}

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Admin Actions
const adminClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getContactSubmissions() {
    const { data, error } = await adminClient
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching submissions:", error);
        return [];
    }

    return data;
}

export async function updateSubmissionStatus(id: string, status: string) {
    const { error } = await adminClient
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);

    if (error) {
        console.error("Error updating status:", error);
        return { error: "Failed to update status" };
    }

    return { success: true };
}

// Notification Actions
export async function sendNotification(recipients: string[], title: string, message: string, senderId: string) {
    if (!recipients.length) return { error: "No recipients selected" };

    const notifications = recipients.map(recipientId => ({
        recipient_id: recipientId,
        sender_id: senderId,
        title,
        message,
        type: recipients.length > 1 ? 'broadcast' : 'individual'
    }));

    const { error } = await adminClient
        .from('notifications')
        .insert(notifications);

    if (error) {
        console.error("Error sending notification:", error);
        return { error: "Failed to send notification" };
    }

    return { success: true };
}

export async function getMyNotifications(employeeId: string) {
    const { data, error } = await adminClient
        .from('notifications')
        .select('*')
        .eq('recipient_id', employeeId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }

    return data;
}

export async function markNotificationRead(notificationId: string) {
    const { error } = await adminClient
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

    if (error) {
        console.error("Error marking read:", error);
        return { error: "Failed to update" };
    }

    return { success: true };
}
