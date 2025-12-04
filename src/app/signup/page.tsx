"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User, Loader2, ArrowLeft, BadgeCheck } from "lucide-react";
import Link from "next/link";

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

        // Mock signup for build/demo purposes
        setTimeout(() => {
            setLoading(false);
            router.push("/login");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md p-8"
            >
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>

                <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-8 overflow-hidden">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
                        <p className="text-slate-500">Join the engineering team</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                    className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Employee ID</label>
                            <div className="relative">
                                <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="EMP12345"
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    required
                                    className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-medium shadow-lg shadow-blue-600/20 transition-all mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating Account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
