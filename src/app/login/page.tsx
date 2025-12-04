"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function LoginPage() {
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Verify Credentials
            const { data: employee, error: loginError } = await supabase
                .from('employees')
                .select('*')
                .eq('employee_id', employeeId)
                .eq('password_hash', password) // Note: In production, verify hash
                .single();

            if (loginError || !employee) {
                throw new Error("Invalid credentials");
            }

            // 2. Store session info (Mock session)
            localStorage.setItem("user_id", employee.employee_id);
            localStorage.setItem("user_name", employee.full_name);

            // 3. Check for Profile
            const { data: profile } = await supabase
                .from('teacher_profiles')
                .select('*')
                .eq('employee_id', employee.employee_id)
                .single();

            if (profile) {
                router.push("/admin");
            } else {
                router.push("/onboarding");
            }

        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#E0E5EC]">
            {/* 3D Floating Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Large Ring */}
                <motion.div
                    animate={{ rotate: 360, y: [0, -20, 0] }}
                    transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                    className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full border-[40px] border-slate-200/60 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] z-0 opacity-60"
                />

                {/* Small Sphere Top Left */}
                <motion.div
                    animate={{ y: [0, 30, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[10%] w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 shadow-[10px_10px_30px_#bebebe,-10px_-10px_30px_#ffffff] z-0"
                />

                {/* Sphere Bottom Right */}
                <motion.div
                    animate={{ y: [0, -40, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[10%] right-[20%] w-40 h-40 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 shadow-[15px_15px_45px_#bebebe,-15px_-15px_45px_#ffffff] z-0"
                />

                {/* Donut/Torus Shape Bottom Left */}
                <motion.div
                    animate={{ rotate: -360, x: [0, 20, 0] }}
                    transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, x: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
                    className="absolute bottom-[-5%] left-[-5%] w-80 h-80 rounded-full border-[30px] border-slate-200/50 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] z-0 opacity-50"
                />
            </div>

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
                        <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-700 font-medium">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black ml-1">Employee ID</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-black transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="EMP12345"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            className="w-full h-12 rounded-xl bg-black hover:bg-slate-900 text-white text-lg font-bold shadow-lg shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center relative z-10">
                        <p className="text-sm text-slate-700 font-medium">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-black hover:text-slate-800 font-bold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
