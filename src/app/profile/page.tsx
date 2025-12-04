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
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<UserProfile | null>(null);
    const [saving, setSaving] = useState(false);

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
                    console.warn("Profile not found:", profError);
                }

                const profileData = {
                    full_name: employee.full_name,
                    employee_id: employee.employee_id,
                    username: teacherProfile?.username || "N/A",
                    program: teacherProfile?.program || "N/A",
                    dob: teacherProfile?.dob || "N/A",
                    doj: teacherProfile?.doj || "N/A",
                    gender: teacherProfile?.gender || "N/A",
                    qualification: teacherProfile?.qualification || "N/A",
                    experience_years: teacherProfile?.experience_years || "0"
                };

                setProfile(profileData);
                setEditForm(profileData);

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

    const handleSave = async () => {
        if (!editForm || !profile) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('teacher_profiles')
                .update({
                    username: editForm.username,
                    program: editForm.program,
                    dob: editForm.dob,
                    gender: editForm.gender,
                    qualification: editForm.qualification,
                    experience_years: editForm.experience_years
                })
                .eq('employee_id', profile.employee_id);

            if (error) throw error;

            setProfile(editForm);
            setIsEditing(false);
        } catch (err: any) {
            console.error("Error updating profile:", err);
            alert("Failed to update profile: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#E0E5EC]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
                    className="w-full h-full object-cover opacity-30"
                >
                    <source src="/about-bg-unicorn.webm" type="video/webm" />
                </video>
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-4xl p-6"
            >
                <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-2xl border border-white/60 shadow-2xl overflow-hidden relative">
                    {/* Header Banner */}
                    <div className="h-48 bg-gradient-to-r from-blue-100/50 to-purple-100/50 relative border-b border-white/20">
                        <div className="absolute top-6 right-6 flex gap-3">
                            {isEditing ? (
                                <>
                                    <Button
                                        onClick={() => setIsEditing(false)}
                                        variant="ghost"
                                        className="bg-white/50 text-slate-600 hover:bg-white/80 hover:text-slate-900 rounded-xl"
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        className="bg-blue-600 text-white hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20"
                                        disabled={saving}
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Save Changes
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white/50 text-slate-700 hover:bg-white/80 hover:text-blue-600 rounded-xl border border-white/60 shadow-sm"
                                >
                                    Edit Profile
                                </Button>
                            )}
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl"
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
                                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-white to-slate-100 border-4 border-white shadow-xl flex items-center justify-center text-5xl font-bold text-slate-700 mb-4 relative group">
                                    {profile.full_name.charAt(0)}
                                    <div className="absolute inset-0 rounded-full border border-slate-200/50" />
                                </div>
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold text-slate-800">{profile.full_name}</h1>
                                    {isEditing ? (
                                        <input
                                            value={editForm?.username}
                                            onChange={e => setEditForm(prev => prev ? { ...prev, username: e.target.value } : null)}
                                            className="mt-1 text-center bg-white/50 border border-white/60 rounded-lg px-2 py-1 text-blue-600 font-medium w-full max-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    ) : (
                                        <p className="text-blue-600 font-medium">@{profile.username}</p>
                                    )}
                                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
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
                                        <InfoCard
                                            icon={<Briefcase />}
                                            label="Department"
                                            value={profile.program}
                                            isEditing={isEditing}
                                            editValue={editForm?.program}
                                            onChange={(val) => setEditForm(prev => prev ? { ...prev, program: val } : null)}
                                            options={["CSE", "CSM", "AI&ML", "ECE", "EEE", "CIVIL", "MECH"]}
                                        />
                                        <InfoCard
                                            icon={<GraduationCap />}
                                            label="Qualification"
                                            value={profile.qualification}
                                            isEditing={isEditing}
                                            editValue={editForm?.qualification}
                                            onChange={(val) => setEditForm(prev => prev ? { ...prev, qualification: val } : null)}
                                        />
                                        <InfoCard
                                            icon={<Briefcase />}
                                            label="Experience (Years)"
                                            value={profile.experience_years}
                                            isEditing={isEditing}
                                            editValue={editForm?.experience_years}
                                            onChange={(val) => setEditForm(prev => prev ? { ...prev, experience_years: val } : null)}
                                            type="number"
                                        />
                                        <InfoCard
                                            icon={<Calendar />}
                                            label="Joined On"
                                            value={profile.doj}
                                        // DOJ is usually not editable by employee
                                        />
                                    </div>
                                </div>

                                {/* Personal Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Personal Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoCard
                                            icon={<User />}
                                            label="Gender"
                                            value={profile.gender}
                                            isEditing={isEditing}
                                            editValue={editForm?.gender}
                                            onChange={(val) => setEditForm(prev => prev ? { ...prev, gender: val } : null)}
                                            options={["Male", "Female", "Other"]}
                                        />
                                        <InfoCard
                                            icon={<Calendar />}
                                            label="Date of Birth"
                                            value={profile.dob}
                                            isEditing={isEditing}
                                            editValue={editForm?.dob}
                                            onChange={(val) => setEditForm(prev => prev ? { ...prev, dob: val } : null)}
                                            type="date"
                                        />
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

function InfoCard({
    icon,
    label,
    value,
    isEditing = false,
    editValue,
    onChange,
    options,
    type = "text"
}: {
    icon: React.ReactNode,
    label: string,
    value: string,
    isEditing?: boolean,
    editValue?: string,
    onChange?: (val: string) => void,
    options?: string[],
    type?: string
}) {
    return (
        <div className="p-4 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 transition-colors flex items-center gap-4 shadow-sm group">
            <div className="p-2 rounded-lg bg-white/60 text-slate-500 group-hover:text-blue-600 transition-colors shadow-sm">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-0.5">{label}</p>
                {isEditing && onChange ? (
                    options ? (
                        <select
                            value={editValue}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full bg-white/80 border border-blue-200 rounded px-2 py-1 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    ) : (
                        <input
                            type={type}
                            value={editValue}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full bg-white/80 border border-blue-200 rounded px-2 py-1 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    )
                ) : (
                    <p className="text-slate-800 font-bold truncate">{value}</p>
                )}
            </div>
        </div>
    );
}
