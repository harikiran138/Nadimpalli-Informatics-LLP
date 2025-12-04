"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User, Briefcase, Calendar, GraduationCap, Shield, LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface UserProfile {
    full_name: string;
    employee_id: string;
    username: string;
    program: string;
    dob: string;
    doj: string;
    gender: string;
    qualification: string;
    experience_years: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const employeeId = localStorage.getItem("user_id");
                if (!employeeId) {
                    router.push("/login");
                    return;
                }

                // Fetch Employee Basic Info
                const { data: employee, error: empError } = await supabase
                    .from('employees')
                    .select('full_name, employee_id')
                    .eq('employee_id', employeeId)
                    .single();

                if (empError) throw empError;

                // Fetch Detailed Profile
                const { data: teacherProfile, error: profError } = await supabase
                    .from('teacher_profiles')
                    .select('*')
                    .eq('employee_id', employeeId)
                    .single();

                if (profError) {
                    // If no profile found, maybe redirect to onboarding?
                    // For now, just show basic info
                    console.warn("Profile not found:", profError);
                }

                setProfile({
                    full_name: employee.full_name,
                    employee_id: employee.employee_id,
                    username: teacherProfile?.username || "N/A",
                    program: teacherProfile?.program || "N/A",
                    dob: teacherProfile?.dob || "N/A",
                    doj: teacherProfile?.doj || "N/A",
                    gender: teacherProfile?.gender || "N/A",
                    qualification: teacherProfile?.qualification || "N/A",
                    experience_years: teacherProfile?.experience_years || "0"
                });

            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!profile) return null;

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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-4xl p-6"
            >
                <div className="rounded-[2.5rem] bg-black/20 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden relative">
                    {/* Header Banner */}
                    <div className="h-48 bg-gradient-to-r from-blue-600/20 to-purple-600/20 relative">
                        <div className="absolute top-6 right-6">
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                className="text-white hover:bg-white/10 hover:text-red-400 transition-colors"
                            >
                                <LogOut className="w-5 h-5 mr-2" /> Logout
                            </Button>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="px-10 pb-10 -mt-20 relative">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Avatar Card */}
                            <div className="flex flex-col items-center">
                                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-slate-800 to-black border-4 border-white/10 shadow-xl flex items-center justify-center text-5xl font-bold text-white mb-4">
                                    {profile.full_name.charAt(0)}
                                </div>
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold text-white">{profile.full_name}</h1>
                                    <p className="text-blue-400 font-medium">@{profile.username}</p>
                                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                                        <Shield className="w-3 h-3 mr-1" /> {profile.employee_id}
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="flex-1 w-full space-y-8 pt-4 md:pt-20">
                                {/* Professional Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Professional Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoCard icon={<Briefcase />} label="Department" value={profile.program} />
                                        <InfoCard icon={<GraduationCap />} label="Qualification" value={profile.qualification} />
                                        <InfoCard icon={<Briefcase />} label="Experience" value={`${profile.experience_years} Years`} />
                                        <InfoCard icon={<Calendar />} label="Joined On" value={profile.doj} />
                                    </div>
                                </div>

                                {/* Personal Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Personal Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoCard icon={<User />} label="Gender" value={profile.gender} />
                                        <InfoCard icon={<Calendar />} label="Date of Birth" value={profile.dob} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/5 text-slate-300">
                {icon}
            </div>
            <div>
                <p className="text-xs text-slate-400 font-medium">{label}</p>
                <p className="text-white font-semibold">{value}</p>
            </div>
        </div>
    );
}
