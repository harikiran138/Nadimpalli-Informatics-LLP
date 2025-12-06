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
