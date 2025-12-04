"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Calendar, GraduationCap, Briefcase, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
                throw new Error("No user session found. Please login again.");
            }

            const { error: insertError } = await supabase
                .from('teacher_profiles')
                .insert([
                    {
                        employee_id: employeeId,
                        username: formData.username,
                        program: formData.program,
                        dob: formData.dob,
                        doj: formData.doj,
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

            router.push("/profile");
        } catch (err: any) {
            console.error("Onboarding error:", err);
            // Ideally show error to user, but for now just log
            alert("Failed to save profile: " + err.message);
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
                className="relative z-10 w-full max-w-2xl p-6"
            >
                <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-2xl border border-white/60 shadow-2xl overflow-hidden relative">
                    {/* Header */}
                    <div className="p-8 border-b border-white/20 bg-white/40">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Complete Your Profile</h1>
                        <p className="text-slate-600 font-medium">Please provide your professional details to continue.</p>

                        {/* Progress Bar */}
                        <div className="mt-6 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-600"
                                initial={{ width: "0%" }}
                                animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                            <Input
                                                required
                                                placeholder="@username"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                className="h-12 pl-12 rounded-xl bg-white/50 border-white/60 text-slate-800 placeholder:text-slate-400 focus:bg-white/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
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
                                                className="w-full h-12 px-4 rounded-xl bg-white/50 border border-white/60 text-slate-800 focus:outline-none focus:bg-white/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer font-medium transition-all"
                                            >
                                                <option value="" disabled>Select Program</option>
                                                {programs.map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Date of Birth</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                            <Input
                                                required
                                                type="date"
                                                value={formData.dob}
                                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                className="h-12 pl-12 rounded-xl bg-white/50 border-white/60 text-slate-800 focus:bg-white/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Date of Joining</label>
                                        <div className="relative group">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                            <Input
                                                required
                                                type="date"
                                                value={formData.doj}
                                                onChange={(e) => setFormData({ ...formData, doj: e.target.value })}
                                                className="h-12 pl-12 rounded-xl bg-white/50 border-white/60 text-slate-800 focus:bg-white/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                            />
                                        </div>
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
                                                <div className="h-12 rounded-xl bg-white/50 border border-white/60 flex items-center justify-center text-slate-500 peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-blue-600/20 transition-all font-bold hover:bg-white/80">
                                                    {g}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full h-14 rounded-xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 shadow-xl shadow-slate-900/20"
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
                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            required
                                            placeholder="e.g. M.Tech in Computer Science"
                                            value={formData.qualification}
                                            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                            className="h-12 pl-12 rounded-xl bg-white/50 border-white/60 text-slate-800 placeholder:text-slate-400 focus:bg-white/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Total Teaching Experience (Years)</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            required
                                            type="number"
                                            placeholder="e.g. 5"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                            className="h-12 pl-12 rounded-xl bg-white/50 border-white/60 text-slate-800 placeholder:text-slate-400 focus:bg-white/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setStep(1)}
                                        className="flex-1 h-14 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-bold"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="flex-[2] h-14 rounded-xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-900/20 transition-all"
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
                                        className="w-full h-24 p-4 rounded-xl bg-white/50 border border-white/60 text-slate-800 placeholder:text-slate-400 focus:bg-white/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                        <Input
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="h-12 rounded-xl bg-white/50 border-white/60 text-slate-800 placeholder:text-slate-400 focus:bg-white/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="h-12 rounded-xl bg-white/50 border-white/60 text-slate-800 placeholder:text-slate-400 focus:bg-white/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Skills (Comma Separated)</label>
                                    <Input
                                        placeholder="React, Python, Machine Learning..."
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        className="h-12 rounded-xl bg-white/50 border-white/60 text-slate-800 placeholder:text-slate-400 focus:bg-white/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                    />
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setStep(2)}
                                        className="flex-1 h-14 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-bold"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] h-14 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-600/30 transition-all"
                                    >
                                        {loading ? (
                                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving Profile...</>
                                        ) : (
                                            <><CheckCircle2 className="w-5 h-5 mr-2" /> Complete Profile</>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
