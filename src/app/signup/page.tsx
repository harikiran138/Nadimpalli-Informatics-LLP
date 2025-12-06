"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User, Loader2, ArrowLeft, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Loader from "@/components/ui/Loader";
import { AuthBackground } from "@/components/ui/AuthBackground";

const supabase = createClient();

export default function SignupPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        employeeId: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            // Insert into employees table
            const { error: insertError } = await supabase
                .from('employees')
                .insert([
                    {
                        full_name: formData.fullName,
                        employee_id: formData.employeeId,
                        password_hash: formData.password // Note: In production, use proper hashing!
                    }
                ]);

            if (insertError) throw insertError;

            // Success
            router.push("/login");
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#E0E5EC]">
            {/* Background from Login Page */}
            <AuthBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md p-8"
            >
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-slate-800 mb-8 transition-colors absolute top-0 left-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Link>

                {/* Enhanced Glass Card */}
                <div className="mt-12 rounded-[2rem] bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] p-10 overflow-hidden relative">
                    {/* Inner shine/reflection */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

                    <div className="text-center mb-8 relative z-10">
                        <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">Create Account</h1>
                        <p className="text-slate-700 font-medium">Join the engineering team</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4 relative z-10">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-black transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                    className="h-12 pl-12 rounded-xl bg-white/20 border-white/30 focus:bg-white/40 focus:border-black/20 focus:ring-4 focus:ring-black/5 text-black placeholder:text-slate-500 transition-all shadow-sm font-medium backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black ml-1">Employee ID</label>
                            <div className="relative group">
                                <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-black transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="EMP12345"
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    required
                                    className="h-12 pl-12 rounded-xl bg-white/20 border-white/30 focus:bg-white/40 focus:border-black/20 focus:ring-4 focus:ring-black/5 text-black placeholder:text-slate-500 transition-all shadow-sm font-medium backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-black transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="h-12 pl-12 rounded-xl bg-white/20 border-white/30 focus:bg-white/40 focus:border-black/20 focus:ring-4 focus:ring-black/5 text-black placeholder:text-slate-500 transition-all shadow-sm font-medium backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-black transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    className="h-12 pl-12 rounded-xl bg-white/20 border-white/30 focus:bg-white/40 focus:border-black/20 focus:ring-4 focus:ring-black/5 text-black placeholder:text-slate-500 transition-all shadow-sm font-medium backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50/80 border border-red-100 text-red-600 text-sm text-center backdrop-blur-sm font-medium">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-black hover:bg-slate-900 text-white text-lg font-bold shadow-lg shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center relative z-10">
                        <p className="text-sm text-slate-700 font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-black hover:text-slate-800 font-bold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
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
