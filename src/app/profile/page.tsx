"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Loader2, LogOut, Shield, Briefcase, GraduationCap, Calendar, User, Mail, Phone,
    MapPin, Clock, BookOpen, Award, FileText, Users, Globe, Linkedin, Twitter,
    Plus, Trash2, Edit2, Save, X, ChevronRight, ExternalLink, QrCode
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    bio?: string;
    phone?: string;
    email?: string;
    skills?: string;
    address?: string;

    // New Fields
    designation?: string;
    subjects?: string[];
    office_room?: string;
    availability?: string;

    // JSONB Lists
    education?: any[];
    experience_teaching?: any[];
    experience_admin?: any[];
    publications?: any[];
    awards?: any[];
    projects?: any[];
    events?: any[];
    memberships?: any[];
    student_interaction?: any;
}

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<UserProfile | null>(null);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push("/login");
                    return;
                }

                // Fetch basic employee data
                const { data: employee, error: empError } = await supabase
                    .from('employees')
                    .select('*')
                    .eq('employee_id', user.user_metadata.employee_id)
                    .single();

                if (empError) throw empError;

                // Fetch detailed teacher profile
                const { data: teacherProfile, error: profileError } = await supabase
                    .from('teacher_profiles')
                    .select('*')
                    .eq('employee_id', employee.employee_id)
                    .single();

                if (profileError && profileError.code !== 'PGRST116') {
                    throw profileError;
                }

                const profileData: UserProfile = {
                    full_name: employee.full_name,
                    employee_id: employee.employee_id,
                    username: teacherProfile?.username || "N/A",
                    program: teacherProfile?.program || "N/A",
                    dob: teacherProfile?.dob || "N/A",
                    doj: teacherProfile?.doj || "N/A",
                    gender: teacherProfile?.gender || "N/A",
                    qualification: teacherProfile?.qualification || "N/A",
                    experience_years: teacherProfile?.experience_years || "0",
                    bio: teacherProfile?.bio || "",
                    phone: teacherProfile?.phone || "",
                    email: teacherProfile?.email || "",
                    skills: teacherProfile?.skills || "",
                    address: teacherProfile?.address || "",
                    designation: teacherProfile?.designation || "Faculty",
                    subjects: teacherProfile?.subjects || [],
                    office_room: teacherProfile?.office_room || "",
                    availability: teacherProfile?.availability || "",
                    education: teacherProfile?.education || [],
                    experience_teaching: teacherProfile?.experience_teaching || [],
                    experience_admin: teacherProfile?.experience_admin || [],
                    publications: teacherProfile?.publications || [],
                    awards: teacherProfile?.awards || [],
                    projects: teacherProfile?.projects || [],
                    events: teacherProfile?.events || [],
                    memberships: teacherProfile?.memberships || [],
                    student_interaction: teacherProfile?.student_interaction || {}
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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.clear();
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
                    experience_years: editForm.experience_years,
                    bio: editForm.bio,
                    phone: editForm.phone,
                    email: editForm.email,
                    skills: editForm.skills,
                    address: editForm.address,
                    designation: editForm.designation,
                    subjects: editForm.subjects,
                    office_room: editForm.office_room,
                    availability: editForm.availability,
                    education: editForm.education,
                    experience_teaching: editForm.experience_teaching,
                    experience_admin: editForm.experience_admin,
                    publications: editForm.publications,
                    awards: editForm.awards,
                    projects: editForm.projects,
                    events: editForm.events,
                    memberships: editForm.memberships,
                    student_interaction: editForm.student_interaction
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

    const tabs = [
        { id: "overview", label: "Overview", icon: User },
        { id: "experience", label: "Experience", icon: Briefcase },
        { id: "research", label: "Research", icon: BookOpen },
        { id: "teaching", label: "Teaching", icon: Users },
        { id: "achievements", label: "Achievements", icon: Award },
    ];

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
                className="relative z-10 w-full max-w-7xl p-4 md:p-6 h-[95vh] flex flex-col"
            >
                <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-2xl border border-white/60 shadow-2xl overflow-hidden flex flex-col h-full">
                    {/* Header Banner */}
                    <div className="h-40 bg-gradient-to-r from-blue-100/50 to-purple-100/50 relative border-b border-white/20 shrink-0">
                        <div className="absolute top-6 right-6 flex gap-3 z-20">
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
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                        Save Changes
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white/50 text-slate-700 hover:bg-white/80 hover:text-blue-600 rounded-xl border border-white/60 shadow-sm"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
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

                    <div className="flex flex-col md:flex-row h-full overflow-hidden">
                        {/* Sidebar / Tabs */}
                        <div className="w-full md:w-64 bg-white/30 border-r border-white/40 p-4 flex flex-col gap-2 shrink-0 overflow-y-auto">
                            {/* Avatar (Mobile/Sidebar) */}
                            <div className="flex flex-col items-center mb-6 -mt-16 relative z-10">
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-white to-slate-100 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-bold text-slate-700 mb-3 relative group">
                                    {profile.full_name.charAt(0)}
                                </div>
                                <h2 className="text-lg font-bold text-slate-800 text-center leading-tight">{profile.full_name}</h2>
                                <p className="text-blue-600 text-sm font-medium text-center">{profile.designation}</p>
                                <div className="mt-2 flex gap-2">
                                    <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full bg-blue-100/50 text-blue-600 hover:bg-blue-100"><Linkedin className="w-4 h-4" /></Button>
                                    <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full bg-sky-100/50 text-sky-500 hover:bg-sky-100"><Twitter className="w-4 h-4" /></Button>
                                    <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full bg-slate-100/50 text-slate-600 hover:bg-slate-100"><Globe className="w-4 h-4" /></Button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                            : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* QR Code Placeholder */}
                            <div className="mt-auto pt-6 flex flex-col items-center">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <QrCode className="w-20 h-20 text-slate-800" />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider">Scan Profile</p>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-8 max-w-4xl mx-auto"
                                >
                                    {activeTab === "overview" && (
                                        <div className="space-y-8">
                                            {/* Bio */}
                                            <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                    <User className="w-5 h-5 text-blue-600" /> About Me
                                                </h3>
                                                {isEditing ? (
                                                    <textarea
                                                        value={editForm?.bio}
                                                        onChange={e => setEditForm(prev => prev ? { ...prev, bio: e.target.value } : null)}
                                                        className="w-full h-32 bg-white/80 border border-blue-200 rounded-xl p-3 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                                        placeholder="Write a professional biography..."
                                                    />
                                                ) : (
                                                    <p className="text-slate-600 leading-relaxed">
                                                        {profile.bio || "No biography provided yet."}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Basic Info Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Details</h3>
                                                    <div className="space-y-4">
                                                        <InfoRow icon={Mail} label="Email" value={profile.email} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, email: v } : null)} editValue={editForm?.email} />
                                                        <InfoRow icon={Phone} label="Phone" value={profile.phone} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, phone: v } : null)} editValue={editForm?.phone} />
                                                        <InfoRow icon={MapPin} label="Office" value={profile.office_room} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, office_room: v } : null)} editValue={editForm?.office_room} placeholder="e.g. Room 304, Block A" />
                                                        <InfoRow icon={Clock} label="Availability" value={profile.availability} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, availability: v } : null)} editValue={editForm?.availability} placeholder="e.g. Mon-Fri, 2-4 PM" />
                                                    </div>
                                                </div>

                                                <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Professional Info</h3>
                                                    <div className="space-y-4">
                                                        <InfoRow icon={Briefcase} label="Designation" value={profile.designation} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, designation: v } : null)} editValue={editForm?.designation} />
                                                        <InfoRow icon={Users} label="Department" value={profile.program} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, program: v } : null)} editValue={editForm?.program} />
                                                        <InfoRow icon={GraduationCap} label="Qualification" value={profile.qualification} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, qualification: v } : null)} editValue={editForm?.qualification} />
                                                        <InfoRow icon={Calendar} label="Experience" value={`${profile.experience_years} Years`} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, experience_years: v } : null)} editValue={editForm?.experience_years} type="number" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Education History */}
                                            <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                        <GraduationCap className="w-5 h-5 text-blue-600" /> Education History
                                                    </h3>
                                                    {isEditing && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                const newEdu = { degree: "", institution: "", year: "", grade: "" };
                                                                setEditForm(prev => prev ? { ...prev, education: [...(prev.education || []), newEdu] } : null);
                                                            }}
                                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                        >
                                                            <Plus className="w-4 h-4 mr-1" /> Add
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    {(isEditing ? editForm?.education : profile.education)?.length === 0 && (
                                                        <p className="text-slate-500 italic text-center py-4">No education history listed.</p>
                                                    )}

                                                    {(isEditing ? editForm?.education : profile.education)?.map((edu: any, index: number) => (
                                                        <div key={index} className="relative p-4 rounded-xl bg-white/60 border border-white/60 shadow-sm">
                                                            {isEditing && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => {
                                                                        const newList = [...(editForm?.education || [])];
                                                                        newList.splice(index, 1);
                                                                        setEditForm(prev => prev ? { ...prev, education: newList } : null);
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}

                                                            {isEditing ? (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                                                                    <input
                                                                        placeholder="Degree (e.g. PhD, M.Tech)"
                                                                        value={edu.degree}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.education || [])];
                                                                            newList[index] = { ...newList[index], degree: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, education: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-blue-100 rounded px-3 py-2 text-sm font-semibold w-full"
                                                                    />
                                                                    <input
                                                                        placeholder="Institution / University"
                                                                        value={edu.institution}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.education || [])];
                                                                            newList[index] = { ...newList[index], institution: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, education: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-blue-100 rounded px-3 py-2 text-sm w-full"
                                                                    />
                                                                    <input
                                                                        placeholder="Year of Completion"
                                                                        value={edu.year}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.education || [])];
                                                                            newList[index] = { ...newList[index], year: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, education: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-blue-100 rounded px-3 py-2 text-sm w-full"
                                                                    />
                                                                    <input
                                                                        placeholder="Grade / Percentage"
                                                                        value={edu.grade}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.education || [])];
                                                                            newList[index] = { ...newList[index], grade: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, education: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-blue-100 rounded px-3 py-2 text-sm w-full"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <h4 className="font-bold text-slate-800">{edu.degree}</h4>
                                                                    <p className="text-sm text-slate-600">{edu.institution}</p>
                                                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                                        <span>{edu.year}</span>
                                                                        <span>•</span>
                                                                        <span className="font-medium text-blue-600">{edu.grade}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Skills */}
                                            <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                    <Award className="w-5 h-5 text-purple-600" /> Skills & Expertise
                                                </h3>
                                                {isEditing ? (
                                                    <input
                                                        value={editForm?.skills}
                                                        onChange={e => setEditForm(prev => prev ? { ...prev, skills: e.target.value } : null)}
                                                        className="w-full bg-white/80 border border-blue-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                        placeholder="Comma separated skills..."
                                                    />
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {profile.skills ? profile.skills.split(',').map((skill, i) => (
                                                            <span key={i} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold border border-blue-200">
                                                                {skill.trim()}
                                                            </span>
                                                        )) : (
                                                            <span className="text-slate-400 italic">No skills listed</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "experience" && (
                                        <div className="space-y-8">
                                            {/* Teaching Experience */}
                                            <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                        <Briefcase className="w-5 h-5 text-blue-600" /> Teaching Experience
                                                    </h3>
                                                    {isEditing && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                const newExp = { institution: "", role: "", duration: "", responsibilities: "" };
                                                                setEditForm(prev => prev ? { ...prev, experience_teaching: [...(prev.experience_teaching || []), newExp] } : null);
                                                            }}
                                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                        >
                                                            <Plus className="w-4 h-4 mr-1" /> Add
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    {(isEditing ? editForm?.experience_teaching : profile.experience_teaching)?.length === 0 && (
                                                        <p className="text-slate-500 italic text-center py-4">No teaching experience listed.</p>
                                                    )}

                                                    {(isEditing ? editForm?.experience_teaching : profile.experience_teaching)?.map((exp: any, index: number) => (
                                                        <div key={index} className="relative p-4 rounded-xl bg-white/60 border border-white/60 shadow-sm group">
                                                            {isEditing && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => {
                                                                        const newList = [...(editForm?.experience_teaching || [])];
                                                                        newList.splice(index, 1);
                                                                        setEditForm(prev => prev ? { ...prev, experience_teaching: newList } : null);
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}

                                                            {isEditing ? (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                                                                    <input
                                                                        placeholder="Institution Name"
                                                                        value={exp.institution}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.experience_teaching || [])];
                                                                            newList[index] = { ...newList[index], institution: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, experience_teaching: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-blue-100 rounded px-3 py-2 text-sm font-semibold w-full"
                                                                    />
                                                                    <input
                                                                        placeholder="Role / Designation"
                                                                        value={exp.role}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.experience_teaching || [])];
                                                                            newList[index] = { ...newList[index], role: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, experience_teaching: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-blue-100 rounded px-3 py-2 text-sm w-full"
                                                                    />
                                                                    <input
                                                                        placeholder="Duration (e.g. 2018 - 2022)"
                                                                        value={exp.duration}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.experience_teaching || [])];
                                                                            newList[index] = { ...newList[index], duration: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, experience_teaching: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-blue-100 rounded px-3 py-2 text-sm w-full"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <h4 className="font-bold text-slate-800">{exp.institution}</h4>
                                                                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                                        <span className="font-medium text-blue-600">{exp.role}</span>
                                                                        <span>•</span>
                                                                        <span>{exp.duration}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Administrative Experience */}
                                            <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                        <Shield className="w-5 h-5 text-purple-600" /> Administrative Roles
                                                    </h3>
                                                    {isEditing && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                const newExp = { role: "", organization: "", description: "" };
                                                                setEditForm(prev => prev ? { ...prev, experience_admin: [...(prev.experience_admin || []), newExp] } : null);
                                                            }}
                                                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                                        >
                                                            <Plus className="w-4 h-4 mr-1" /> Add
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    {(isEditing ? editForm?.experience_admin : profile.experience_admin)?.length === 0 && (
                                                        <p className="text-slate-500 italic text-center py-4">No administrative roles listed.</p>
                                                    )}

                                                    {(isEditing ? editForm?.experience_admin : profile.experience_admin)?.map((exp: any, index: number) => (
                                                        <div key={index} className="relative p-4 rounded-xl bg-white/60 border border-white/60 shadow-sm">
                                                            {isEditing && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => {
                                                                        const newList = [...(editForm?.experience_admin || [])];
                                                                        newList.splice(index, 1);
                                                                        setEditForm(prev => prev ? { ...prev, experience_admin: newList } : null);
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}

                                                            {isEditing ? (
                                                                <div className="grid grid-cols-1 gap-3 pr-8">
                                                                    <input
                                                                        placeholder="Role (e.g. Exam Coordinator)"
                                                                        value={exp.role}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.experience_admin || [])];
                                                                            newList[index] = { ...newList[index], role: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, experience_admin: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-purple-100 rounded px-3 py-2 text-sm font-semibold w-full"
                                                                    />
                                                                    <input
                                                                        placeholder="Description / Event"
                                                                        value={exp.description}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.experience_admin || [])];
                                                                            newList[index] = { ...newList[index], description: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, experience_admin: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-purple-100 rounded px-3 py-2 text-sm w-full"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <h4 className="font-bold text-slate-800">{exp.role}</h4>
                                                                    <p className="text-sm text-slate-500 mt-1">{exp.description}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Other tabs placeholders... */}
                                    {activeTab === "research" && (
                                        <div className="space-y-8">
                                            {/* Publications */}
                                            <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                        <BookOpen className="w-5 h-5 text-blue-600" /> Publications
                                                    </h3>
                                                    {isEditing && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                const newPub = { title: "", journal: "", year: "", link: "" };
                                                                setEditForm(prev => prev ? { ...prev, publications: [...(prev.publications || []), newPub] } : null);
                                                            }}
                                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                        >
                                                            <Plus className="w-4 h-4 mr-1" /> Add
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    {(isEditing ? editForm?.publications : profile.publications)?.length === 0 && (
                                                        <p className="text-slate-500 italic text-center py-4">No publications listed.</p>
                                                    )}

                                                    {(isEditing ? editForm?.publications : profile.publications)?.map((pub: any, index: number) => (
                                                        <div key={index} className="relative p-4 rounded-xl bg-white/60 border border-white/60 shadow-sm">
                                                            {isEditing && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => {
                                                                        const newList = [...(editForm?.publications || [])];
                                                                        newList.splice(index, 1);
                                                                        setEditForm(prev => prev ? { ...prev, publications: newList } : null);
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}

                                                            {isEditing ? (
                                                                <div className="grid grid-cols-1 gap-3 pr-8">
                                                                    <input
                                                                        placeholder="Paper Title"
                                                                        value={pub.title}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.publications || [])];
                                                                            newList[index] = { ...newList[index], title: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, publications: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-blue-100 rounded px-3 py-2 text-sm font-semibold w-full"
                                                                    />
                                                                    <div className="flex gap-3">
                                                                        <input
                                                                            placeholder="Journal / Conference"
                                                                            value={pub.journal}
                                                                            onChange={e => {
                                                                                const newList = [...(editForm?.publications || [])];
                                                                                newList[index] = { ...newList[index], journal: e.target.value };
                                                                                setEditForm(prev => prev ? { ...prev, publications: newList } : null);
                                                                            }}
                                                                            className="bg-white/50 border border-blue-100 rounded px-3 py-2 text-sm w-full"
                                                                        />
                                                                        <input
                                                                            placeholder="Year"
                                                                            value={pub.year}
                                                                            onChange={e => {
                                                                                const newList = [...(editForm?.publications || [])];
                                                                                newList[index] = { ...newList[index], year: e.target.value };
                                                                                setEditForm(prev => prev ? { ...prev, publications: newList } : null);
                                                                            }}
                                                                            className="bg-white/50 border border-blue-100 rounded px-3 py-2 text-sm w-32"
                                                                        />
                                                                    </div>
                                                                    <input
                                                                        placeholder="Link (DOI / URL)"
                                                                        value={pub.link}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.publications || [])];
                                                                            newList[index] = { ...newList[index], link: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, publications: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-blue-100 rounded px-3 py-2 text-sm w-full"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <h4 className="font-bold text-slate-800 leading-tight">{pub.title}</h4>
                                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mt-2">
                                                                        <span className="font-medium text-blue-600">{pub.journal}</span>
                                                                        <span>•</span>
                                                                        <span>{pub.year}</span>
                                                                        {pub.link && (
                                                                            <a href={pub.link} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center text-blue-500 hover:text-blue-700">
                                                                                <ExternalLink className="w-3 h-3 mr-1" /> View
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Projects */}
                                            <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-emerald-600" /> Research Projects
                                                    </h3>
                                                    {isEditing && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                const newProj = { title: "", agency: "", amount: "", status: "" };
                                                                setEditForm(prev => prev ? { ...prev, projects: [...(prev.projects || []), newProj] } : null);
                                                            }}
                                                            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                                        >
                                                            <Plus className="w-4 h-4 mr-1" /> Add
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    {(isEditing ? editForm?.projects : profile.projects)?.length === 0 && (
                                                        <p className="text-slate-500 italic text-center py-4">No projects listed.</p>
                                                    )}

                                                    {(isEditing ? editForm?.projects : profile.projects)?.map((proj: any, index: number) => (
                                                        <div key={index} className="relative p-4 rounded-xl bg-white/60 border border-white/60 shadow-sm">
                                                            {isEditing && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => {
                                                                        const newList = [...(editForm?.projects || [])];
                                                                        newList.splice(index, 1);
                                                                        setEditForm(prev => prev ? { ...prev, projects: newList } : null);
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}

                                                            {isEditing ? (
                                                                <div className="grid grid-cols-1 gap-3 pr-8">
                                                                    <input
                                                                        placeholder="Project Title"
                                                                        value={proj.title}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.projects || [])];
                                                                            newList[index] = { ...newList[index], title: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, projects: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-emerald-100 rounded px-3 py-2 text-sm font-semibold w-full"
                                                                    />
                                                                    <div className="grid grid-cols-3 gap-3">
                                                                        <input
                                                                            placeholder="Funding Agency"
                                                                            value={proj.agency}
                                                                            onChange={e => {
                                                                                const newList = [...(editForm?.projects || [])];
                                                                                newList[index] = { ...newList[index], agency: e.target.value };
                                                                                setEditForm(prev => prev ? { ...prev, projects: newList } : null);
                                                                            }}
                                                                            className="bg-white/50 border border-emerald-100 rounded px-3 py-2 text-sm w-full"
                                                                        />
                                                                        <input
                                                                            placeholder="Amount"
                                                                            value={proj.amount}
                                                                            onChange={e => {
                                                                                const newList = [...(editForm?.projects || [])];
                                                                                newList[index] = { ...newList[index], amount: e.target.value };
                                                                                setEditForm(prev => prev ? { ...prev, projects: newList } : null);
                                                                            }}
                                                                            className="bg-white/50 border border-emerald-100 rounded px-3 py-2 text-sm w-full"
                                                                        />
                                                                        <input
                                                                            placeholder="Status"
                                                                            value={proj.status}
                                                                            onChange={e => {
                                                                                const newList = [...(editForm?.projects || [])];
                                                                                newList[index] = { ...newList[index], status: e.target.value };
                                                                                setEditForm(prev => prev ? { ...prev, projects: newList } : null);
                                                                            }}
                                                                            className="bg-white/50 border border-emerald-100 rounded px-3 py-2 text-sm w-full"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <h4 className="font-bold text-slate-800">{proj.title}</h4>
                                                                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                                                                        <span className="font-medium text-emerald-600">{proj.agency}</span>
                                                                        <span>{proj.amount}</span>
                                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">{proj.status}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === "teaching" && (
                                        <div className="space-y-8">
                                            {/* Subjects Taught */}
                                            <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                    <BookOpen className="w-5 h-5 text-blue-600" /> Subjects Taught
                                                </h3>
                                                {isEditing ? (
                                                    <div className="space-y-3">
                                                        <input
                                                            value={editForm?.subjects?.join(", ")}
                                                            onChange={e => setEditForm(prev => prev ? { ...prev, subjects: e.target.value.split(",").map(s => s.trim()) } : null)}
                                                            className="w-full bg-white/80 border border-blue-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                            placeholder="Comma separated subjects (e.g. Data Structures, Algorithms)..."
                                                        />
                                                        <p className="text-xs text-slate-400">Separate multiple subjects with commas.</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {profile.subjects && profile.subjects.length > 0 ? profile.subjects.map((subject, i) => (
                                                            <span key={i} className="px-4 py-2 rounded-xl bg-white/60 border border-white/60 text-slate-700 font-bold shadow-sm">
                                                                {subject}
                                                            </span>
                                                        )) : (
                                                            <p className="text-slate-500 italic">No subjects listed.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Student Interaction */}
                                            <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                    <Users className="w-5 h-5 text-purple-600" /> Student Interaction
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <h4 className="font-bold text-slate-600 uppercase text-xs tracking-wider">Resources & Links</h4>
                                                        <InfoRow
                                                            icon={Globe}
                                                            label="Course Website / LMS"
                                                            value={profile.student_interaction?.lms_link}
                                                            isEditing={isEditing}
                                                            onChange={(v: string) => setEditForm(prev => prev ? { ...prev, student_interaction: { ...prev.student_interaction, lms_link: v } } : null)}
                                                            editValue={editForm?.student_interaction?.lms_link}
                                                            placeholder="https://..."
                                                        />
                                                        <InfoRow
                                                            icon={Calendar}
                                                            label="Meeting Scheduler"
                                                            value={profile.student_interaction?.scheduler_link}
                                                            isEditing={isEditing}
                                                            onChange={(v: string) => setEditForm(prev => prev ? { ...prev, student_interaction: { ...prev.student_interaction, scheduler_link: v } } : null)}
                                                            editValue={editForm?.student_interaction?.scheduler_link}
                                                            placeholder="Calendly / Google Calendar Link"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <h4 className="font-bold text-slate-600 uppercase text-xs tracking-wider">Mentorship</h4>
                                                        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                                            <p className="text-sm text-slate-600 mb-2 font-medium">Mentoring Philosophy</p>
                                                            {isEditing ? (
                                                                <textarea
                                                                    value={editForm?.student_interaction?.mentorship_philosophy}
                                                                    onChange={e => setEditForm(prev => prev ? { ...prev, student_interaction: { ...prev.student_interaction, mentorship_philosophy: e.target.value } } : null)}
                                                                    className="w-full h-24 bg-white border border-blue-200 rounded-lg p-2 text-sm focus:outline-none resize-none"
                                                                    placeholder="Briefly describe your approach to student mentorship..."
                                                                />
                                                            ) : (
                                                                <p className="text-slate-700 text-sm italic">
                                                                    "{profile.student_interaction?.mentorship_philosophy || "Not provided"}"
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "achievements" && (
                                        <div className="space-y-8">
                                            {/* Awards */}
                                            <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                        <Award className="w-5 h-5 text-amber-500" /> Awards & Honors
                                                    </h3>
                                                    {isEditing && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                const newAward = { title: "", year: "", issuer: "" };
                                                                setEditForm(prev => prev ? { ...prev, awards: [...(prev.awards || []), newAward] } : null);
                                                            }}
                                                            className="text-amber-600 border-amber-200 hover:bg-amber-50"
                                                        >
                                                            <Plus className="w-4 h-4 mr-1" /> Add
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    {(isEditing ? editForm?.awards : profile.awards)?.length === 0 && (
                                                        <p className="text-slate-500 italic text-center py-4">No awards listed.</p>
                                                    )}

                                                    {(isEditing ? editForm?.awards : profile.awards)?.map((award: any, index: number) => (
                                                        <div key={index} className="relative p-4 rounded-xl bg-white/60 border border-white/60 shadow-sm flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                                                <Award className="w-5 h-5" />
                                                            </div>

                                                            {isEditing ? (
                                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                                                                    <input
                                                                        placeholder="Award Title"
                                                                        value={award.title}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.awards || [])];
                                                                            newList[index] = { ...newList[index], title: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, awards: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-amber-100 rounded px-3 py-2 text-sm font-semibold w-full"
                                                                    />
                                                                    <input
                                                                        placeholder="Issuer / Organization"
                                                                        value={award.issuer}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.awards || [])];
                                                                            newList[index] = { ...newList[index], issuer: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, awards: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-amber-100 rounded px-3 py-2 text-sm w-full"
                                                                    />
                                                                    <input
                                                                        placeholder="Year"
                                                                        value={award.year}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.awards || [])];
                                                                            newList[index] = { ...newList[index], year: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, awards: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-amber-100 rounded px-3 py-2 text-sm w-full"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="flex-1">
                                                                    <h4 className="font-bold text-slate-800">{award.title}</h4>
                                                                    <p className="text-sm text-slate-500">{award.issuer} • {award.year}</p>
                                                                </div>
                                                            )}

                                                            {isEditing && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => {
                                                                        const newList = [...(editForm?.awards || [])];
                                                                        newList.splice(index, 1);
                                                                        setEditForm(prev => prev ? { ...prev, awards: newList } : null);
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Memberships */}
                                            <div className="p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                        <Globe className="w-5 h-5 text-indigo-600" /> Professional Memberships
                                                    </h3>
                                                    {isEditing && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                const newMem = { organization: "", role: "", year: "" };
                                                                setEditForm(prev => prev ? { ...prev, memberships: [...(prev.memberships || []), newMem] } : null);
                                                            }}
                                                            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                                        >
                                                            <Plus className="w-4 h-4 mr-1" /> Add
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    {(isEditing ? editForm?.memberships : profile.memberships)?.length === 0 && (
                                                        <p className="text-slate-500 italic text-center py-4">No memberships listed.</p>
                                                    )}

                                                    {(isEditing ? editForm?.memberships : profile.memberships)?.map((mem: any, index: number) => (
                                                        <div key={index} className="relative p-4 rounded-xl bg-white/60 border border-white/60 shadow-sm">
                                                            {isEditing && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => {
                                                                        const newList = [...(editForm?.memberships || [])];
                                                                        newList.splice(index, 1);
                                                                        setEditForm(prev => prev ? { ...prev, memberships: newList } : null);
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}

                                                            {isEditing ? (
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                                                                    <input
                                                                        placeholder="Organization"
                                                                        value={mem.organization}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.memberships || [])];
                                                                            newList[index] = { ...newList[index], organization: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, memberships: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-indigo-100 rounded px-3 py-2 text-sm font-semibold w-full"
                                                                    />
                                                                    <input
                                                                        placeholder="Role / Type"
                                                                        value={mem.role}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.memberships || [])];
                                                                            newList[index] = { ...newList[index], role: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, memberships: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-indigo-100 rounded px-3 py-2 text-sm w-full"
                                                                    />
                                                                    <input
                                                                        placeholder="Year / Duration"
                                                                        value={mem.year}
                                                                        onChange={e => {
                                                                            const newList = [...(editForm?.memberships || [])];
                                                                            newList[index] = { ...newList[index], year: e.target.value };
                                                                            setEditForm(prev => prev ? { ...prev, memberships: newList } : null);
                                                                        }}
                                                                        className="bg-white/50 border border-indigo-100 rounded px-3 py-2 text-sm w-full"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <h4 className="font-bold text-slate-800">{mem.organization}</h4>
                                                                    <p className="text-sm text-slate-500">{mem.role} • {mem.year}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
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
    icon: React.ReactNode;
    label: string;
    value: string;
    isEditing?: boolean;
    editValue?: string;
    onChange?: (val: string) => void;
    options?: string[];
    type?: string;
}) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/50">
            <div className="p-2 rounded-lg bg-white/60 text-slate-500">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 font-bold uppercase">{label}</p>
                {isEditing && onChange ? (
                    options ? (
                        <select
                            value={editValue}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full bg-white/80 border border-blue-200 rounded px-2 py-1 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Select {label}</option>
                            {options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
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
                    <p className="text-slate-800 font-bold truncate">{value || "Not provided"}</p>
                )}
            </div>
        </div>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
    isEditing,
    onChange,
    editValue,
    type = "text",
    placeholder
}: any) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/60 text-slate-500"><Icon className="w-4 h-4" /></div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 font-bold uppercase">{label}</p>
                {isEditing && onChange ? (
                    <input
                        type={type}
                        value={editValue}
                        onChange={e => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-white/80 border border-blue-200 rounded px-2 py-1 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                ) : (
                    <p className="text-slate-800 font-bold truncate">{value || "Not provided"}</p>
                )}
            </div>
        </div>
    );
}
