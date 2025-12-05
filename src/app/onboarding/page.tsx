"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, GraduationCap, Briefcase, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { SmartDateInput } from "@/components/ui/smart-date-input";
import Loader from "@/components/ui/Loader";

const supabase = createClient();

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: "",
        program: "",
        dob: "",
        doj: "",
        gender: "",
        qualification: "",
        experience: "",
        bio: "",
        phone: "",
        email: "",
        skills: ""
    });

    const programs = ["CSE", "CSM", "AI&ML", "ECE", "EEE", "CIVIL", "MECH"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const employeeId = localStorage.getItem("user_id");
            if (!employeeId) {
                toast.error("Session expired", { description: "Please login again." });
                router.push("/login");
                return;
            }

            // Validate dates
            if (!formData.dob || !formData.doj) {
                toast.error("Missing Information", { description: "Please select both Date of Birth and Date of Joining." });
                setLoading(false);
                return;
            }

            const { error: insertError } = await supabase
                .from('teacher_profiles')
                .insert([
                    {
                        employee_id: employeeId,
                        username: formData.username,
                        program: formData.program,
                        dob: formData.dob || null,
                        doj: formData.doj || null,
                        gender: formData.gender,
                        qualification: formData.qualification,
                        experience_years: formData.experience,
                        bio: formData.bio,
                        phone: formData.phone,
                        email: formData.email,
                        skills: formData.skills
                    }
                ]);

            if (insertError) throw insertError;

            toast.success("Profile Completed!", { description: "Redirecting to your profile..." });
            setTimeout(() => router.push("/profile"), 1500);

        } catch (err: any) {
            console.error("Onboarding error:", err);
            toast.error("Failed to save profile", { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#E0E5EC]">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/about-bg-unicorn.webm" type="video/webm" />
                </video>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-3xl p-6"
            >
                <div className="rounded-[2.5rem] bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] overflow-hidden relative">
                    {/* Inner shine */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

                    {/* Header */}
                    <div className="p-8 border-b border-white/20 bg-white/10 relative z-10">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Complete Your Profile</h1>
                        <p className="text-slate-600 font-medium">Please provide your professional details to continue.</p>

                        {/* Progress Bar */}
                        <div className="mt-6 h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                initial={{ width: "0%" }}
                                animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6 relative z-10">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Unique Username</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
                                            <Input
                                                required
                                                placeholder="@username"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                className="h-12 pl-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Program / Department</label>
                                        <div className="relative">
                                            <select
                                                required
                                                value={formData.program}
                                                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                                                className="w-full h-12 px-4 rounded-xl bg-white/20 border border-white/30 text-slate-800 focus:outline-none focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer font-medium transition-all backdrop-blur-sm shadow-sm"
                                            >
                                                <option value="" disabled>Select Program</option>
                                                {programs.map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-4 h-4 text-slate-500 rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <SmartDateInput
                                            label="Date of Birth"
                                            value={formData.dob ? new Date(formData.dob) : undefined}
                                            onSelect={(date) => setFormData({ ...formData, dob: date ? format(date, "yyyy-MM-dd") : "" })}
                                            fromDate={new Date(1960, 0, 1)}
                                            toDate={new Date(2030, 11, 31)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <SmartDateInput
                                            label="Date of Joining"
                                            value={formData.doj ? new Date(formData.doj) : undefined}
                                            onSelect={(date) => setFormData({ ...formData, doj: date ? format(date, "yyyy-MM-dd") : "" })}
                                            fromDate={new Date(1980, 0, 1)}
                                            toDate={new Date(2030, 11, 31)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Gender</label>
                                    <div className="flex gap-4">
                                        {["Male", "Female", "Other"].map((g) => (
                                            <label key={g} className="flex-1 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value={g}
                                                    checked={formData.gender === g}
                                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                    className="peer sr-only"
                                                />
                                                <div className="h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-slate-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-blue-600/20 transition-all font-bold hover:bg-white/40 hover:scale-[1.02] backdrop-blur-sm shadow-sm">
                                                    {g}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full h-14 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 shadow-xl shadow-blue-600/20"
                                >
                                    Next Step <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Highest Qualification</label>
                                    <div className="relative group">
                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            required
                                            placeholder="e.g. M.Tech in Computer Science"
                                            value={formData.qualification}
                                            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                            className="h-12 pl-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Total Teaching Experience (Years)</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            required
                                            type="number"
                                            placeholder="e.g. 5"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                            className="h-12 pl-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setStep(1)}
                                        className="flex-1 h-14 rounded-xl text-slate-500 hover:bg-white/40 hover:text-slate-800 font-bold border border-transparent hover:border-white/30"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="flex-[2] h-14 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-600/20 transition-all"
                                    >
                                        Next Step <ChevronRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Bio / About Me</label>
                                    <textarea
                                        placeholder="Tell us a bit about yourself..."
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full h-24 p-4 rounded-xl bg-white/20 border border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none backdrop-blur-sm shadow-sm"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                        <Input
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Skills (Comma Separated)</label>
                                    <Input
                                        placeholder="React, Python, Machine Learning..."
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        className="h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm"
                                    />
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setStep(2)}
                                        className="flex-1 h-14 rounded-xl text-slate-500 hover:bg-white/40 hover:text-slate-800 font-bold border border-transparent hover:border-white/30"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 rounded-xl bg-black hover:bg-slate-900 text-white text-lg font-bold shadow-lg shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {loading ? "Saving..." : "Complete Profile"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>
            </motion.div>

            {/* Full Screen Loader Overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="scale-75">
                        <Loader />
                    </div>
                </div>
            )}
        </div>
    );
}
