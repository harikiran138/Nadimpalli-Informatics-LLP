"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactForm(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
        return { error: "All fields are required." };
    }

    const { error } = await supabase
        .from("contact_submissions")
        .insert({
            full_name: name,
            email: email,
            message: message,
        });

    if (error) {
        console.error("Error submitting contact form:", error);
        return { error: "Failed to submit message. Please try again." };
    }

    return { success: "Message sent successfully!" };
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
