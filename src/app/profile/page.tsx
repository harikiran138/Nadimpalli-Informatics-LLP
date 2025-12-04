"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Loader2, LogOut, Shield, Briefcase, GraduationCap, Calendar, User, Mail, Phone,
    MapPin, Clock, BookOpen, Award, FileText, Users, Globe, Linkedin, Twitter,
    Plus, Trash2, Edit2, Save, ChevronRight, ExternalLink, QrCode
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const supabase = createClient();

interface Education {
    degree: string;
    institution: string;
    year: string;
    grade: string;
}

interface ExperienceTeaching {
    institution: string;
    role: string;
    duration: string;
    responsibilities?: string;
}

interface ExperienceAdmin {
    role: string;
    organization?: string;
    description: string;
}

interface Publication {
    title: string;
    journal: string;
    year: string;
    link?: string;
}

interface AwardItem {
    title: string;
    year: string;
    issuer: string;
}

interface Project {
    title: string;
    agency: string;
    amount: string;
    status: string;
}

interface Membership {
    organization: string;
    role: string;
    year: string;
}

interface StudentInteraction {
    lms_link?: string;
    scheduler_link?: string;
    mentorship_philosophy?: string;
}

interface EventItem {
    title: string;
    date: string;
    description?: string;
}

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
    education?: Education[];
    experience_teaching?: ExperienceTeaching[];
    experience_admin?: ExperienceAdmin[];
    publications?: Publication[];
    awards?: AwardItem[];
    projects?: Project[];
    events?: EventItem[];
    memberships?: Membership[];
    student_interaction?: StudentInteraction;
}

interface InfoRowProps {
    icon: React.ElementType;
    label: string;
    value?: string;
    isEditing: boolean;
    onChange?: (value: string) => void;
    editValue?: string;
    type?: string;
    placeholder?: string;
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
                // Check for custom session in localStorage
                const employeeId = localStorage.getItem("user_id");

                if (!employeeId) {
                    router.push("/login");
                    return;
                }

                // Fetch basic employee data
                const { data: employee, error: empError } = await supabase
                    .from('employees')
                    .select('*')
                    .eq('employee_id', employeeId)
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
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Failed to update profile: " + (err as Error).message);
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
        <div className="min-h-screen flex relative overflow-hidden bg-[#E0E5EC]">
            {/* Background Video */}
            <div className="fixed inset-0 z-0">
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

            {/* Sidebar Navigation */}
            <aside className="relative z-20 w-80 h-screen flex flex-col bg-white/40 backdrop-blur-xl border-r border-white/40 shadow-2xl shrink-0">
                {/* Profile Header in Sidebar */}
                <div className="p-8 flex flex-col items-center border-b border-white/20">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white to-slate-100 border-4 border-white shadow-xl flex items-center justify-center text-5xl font-bold text-slate-700 mb-4 relative group">
                        {profile.full_name.charAt(0)}
                        <div className="absolute inset-0 rounded-full bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 text-center leading-tight mb-1">{profile.full_name}</h2>
                    <p className="text-blue-600 font-medium text-center bg-blue-50/50 px-3 py-1 rounded-full text-sm border border-blue-100">
                        {profile.designation}
                    </p>

                    <div className="mt-6 flex gap-3">
                        <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full bg-white/50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Linkedin className="w-5 h-5" /></Button>
                        <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full bg-white/50 text-sky-500 hover:bg-sky-500 hover:text-white transition-all shadow-sm"><Twitter className="w-5 h-5" /></Button>
                        <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full bg-white/50 text-slate-600 hover:bg-slate-800 hover:text-white transition-all shadow-sm"><Globe className="w-5 h-5" /></Button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group ${activeTab === tab.id
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-2"
                                : "text-slate-600 hover:bg-white/50 hover:text-slate-900 hover:translate-x-1"
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`} />
                            {tab.label}
                            {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto opacity-60" />}
                        </button>
                    ))}
                </div>

                {/* Sidebar Footer */}
                <div className="p-6 border-t border-white/20 bg-white/10">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/40 shadow-sm mb-4">
                        <div className="p-2 bg-white rounded-lg">
                            <QrCode className="w-6 h-6 text-slate-800" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-700">Profile QR</p>
                            <p className="text-[10px] text-slate-500 truncate">Share your profile</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl pl-4 h-12"
                    >
                        <LogOut className="w-5 h-5 mr-3" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto relative z-10 scrollbar-hide">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 px-8 py-5 bg-white/10 backdrop-blur-md border-b border-white/20 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">Manage your professional details</p>
                    </div>
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <Button
                                    onClick={() => setIsEditing(false)}
                                    variant="ghost"
                                    className="bg-white/50 text-slate-600 hover:bg-white/80 hover:text-slate-900 rounded-xl h-11 px-6"
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="bg-blue-600 text-white hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 h-11 px-6"
                                    disabled={saving}
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="bg-white/80 text-slate-700 hover:bg-white hover:text-blue-600 rounded-xl border border-white/60 shadow-sm h-11 px-6 backdrop-blur-sm"
                            >
                                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                            </Button>
                        )}
                    </div>
                </header>

                {/* Content Container */}
                <div className="p-8 max-w-6xl mx-auto pb-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            {activeTab === "overview" && (
                                <div className="space-y-8">
                                    {/* Bio Section */}
                                    <div className="p-8 rounded-3xl bg-white/40 border border-white/60 shadow-lg backdrop-blur-sm">
                                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><User className="w-5 h-5" /></div>
                                            About Me
                                        </h3>
                                        {isEditing ? (
                                            <textarea
                                                value={editForm?.bio}
                                                onChange={e => setEditForm(prev => prev ? { ...prev, bio: e.target.value } : null)}
                                                className="w-full h-40 bg-white/60 border border-blue-200 rounded-2xl p-4 text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none text-lg leading-relaxed"
                                                placeholder="Write a professional biography..."
                                            />
                                        ) : (
                                            <p className="text-slate-700 leading-relaxed text-lg">
                                                {profile.bio || "No biography provided yet."}
                                            </p>
                                        )}
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                        <div className="p-8 rounded-3xl bg-white/40 border border-white/60 shadow-lg backdrop-blur-sm">
                                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                                <span className="w-8 h-[1px] bg-slate-400"></span> Contact Details
                                            </h3>
                                            <div className="space-y-5">
                                                <InfoRow icon={Mail} label="Email" value={profile.email} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, email: v } : null)} editValue={editForm?.email} />
                                                <InfoRow icon={Phone} label="Phone" value={profile.phone} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, phone: v } : null)} editValue={editForm?.phone} />
                                                <InfoRow icon={MapPin} label="Office" value={profile.office_room} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, office_room: v } : null)} editValue={editForm?.office_room} placeholder="e.g. Room 304, Block A" />
                                                <InfoRow icon={Clock} label="Availability" value={profile.availability} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, availability: v } : null)} editValue={editForm?.availability} placeholder="e.g. Mon-Fri, 2-4 PM" />
                                            </div>
                                        </div>

                                        <div className="p-8 rounded-3xl bg-white/40 border border-white/60 shadow-lg backdrop-blur-sm">
                                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                                <span className="w-8 h-[1px] bg-slate-400"></span> Professional Info
                                            </h3>
                                            <div className="space-y-5">
                                                <InfoRow icon={Briefcase} label="Designation" value={profile.designation} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, designation: v } : null)} editValue={editForm?.designation} />
                                                <InfoRow icon={Users} label="Department" value={profile.program} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, program: v } : null)} editValue={editForm?.program} />
                                                <InfoRow icon={GraduationCap} label="Qualification" value={profile.qualification} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, qualification: v } : null)} editValue={editForm?.qualification} />
                                                <InfoRow icon={Calendar} label="Experience" value={`${profile.experience_years} Years`} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, experience_years: v } : null)} editValue={editForm?.experience_years} type="number" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Education History */}
                                    <div className="p-8 rounded-3xl bg-white/40 border border-white/60 shadow-lg backdrop-blur-sm">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><GraduationCap className="w-5 h-5" /></div>
                                                Education History
                                            </h3>
                                            {isEditing && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        const newEdu = { degree: "", institution: "", year: "", grade: "" };
                                                        setEditForm(prev => prev ? { ...prev, education: [...(prev.education || []), newEdu] } : null);
                                                    }}
                                                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                                >
                                                    <Plus className="w-4 h-4 mr-1" /> Add
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(isEditing ? editForm?.education : profile.education)?.length === 0 && (
                                                <p className="text-slate-500 italic py-4 col-span-full">No education history listed.</p>
                                            )}

                                            {(isEditing ? editForm?.education : profile.education)?.map((edu: Education, index: number) => (
                                                <div key={index} className="relative p-5 rounded-2xl bg-white/60 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
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
                                                        <div className="space-y-3 pr-8">
                                                            <input
                                                                placeholder="Degree (e.g. PhD)"
                                                                value={edu.degree}
                                                                onChange={e => {
                                                                    const newList = [...(editForm?.education || [])];
                                                                    newList[index] = { ...newList[index], degree: e.target.value };
                                                                    setEditForm(prev => prev ? { ...prev, education: newList } : null);
                                                                }}
                                                                className="bg-white/50 border border-indigo-100 rounded-lg px-3 py-2 text-sm font-bold w-full"
                                                            />
                                                            <input
                                                                placeholder="Institution"
                                                                value={edu.institution}
                                                                onChange={e => {
                                                                    const newList = [...(editForm?.education || [])];
                                                                    newList[index] = { ...newList[index], institution: e.target.value };
                                                                    setEditForm(prev => prev ? { ...prev, education: newList } : null);
                                                                }}
                                                                className="bg-white/50 border border-indigo-100 rounded-lg px-3 py-2 text-sm w-full"
                                                            />
                                                            <div className="flex gap-2">
                                                                <input
                                                                    placeholder="Year"
                                                                    value={edu.year}
                                                                    onChange={e => {
                                                                        const newList = [...(editForm?.education || [])];
                                                                        newList[index] = { ...newList[index], year: e.target.value };
                                                                        setEditForm(prev => prev ? { ...prev, education: newList } : null);
                                                                    }}
                                                                    className="bg-white/50 border border-indigo-100 rounded-lg px-3 py-2 text-sm w-full"
                                                                />
                                                                <input
                                                                    placeholder="Grade"
                                                                    value={edu.grade}
                                                                    onChange={e => {
                                                                        const newList = [...(editForm?.education || [])];
                                                                        newList[index] = { ...newList[index], grade: e.target.value };
                                                                        setEditForm(prev => prev ? { ...prev, education: newList } : null);
                                                                    }}
                                                                    className="bg-white/50 border border-indigo-100 rounded-lg px-3 py-2 text-sm w-full"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 text-lg">{edu.degree}</h4>
                                                            <p className="text-slate-600 font-medium">{edu.institution}</p>
                                                            <div className="flex items-center gap-3 text-sm text-slate-500 mt-3 pt-3 border-t border-slate-100">
                                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {edu.year}</span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                <span className="font-bold text-indigo-600">{edu.grade}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className="p-8 rounded-3xl bg-white/40 border border-white/60 shadow-lg backdrop-blur-sm">
                                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Award className="w-5 h-5" /></div>
                                            Skills & Expertise
                                        </h3>
                                        {isEditing ? (
                                            <input
                                                value={editForm?.skills}
                                                onChange={e => setEditForm(prev => prev ? { ...prev, skills: e.target.value } : null)}
                                                className="w-full bg-white/60 border border-purple-200 rounded-2xl px-6 py-4 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-lg"
                                                placeholder="Comma separated skills..."
                                            />
                                        ) : (
                                            <div className="flex flex-wrap gap-3">
                                                {profile.skills ? profile.skills.split(',').map((skill, i) => (
                                                    <span key={i} className="px-5 py-2.5 rounded-xl bg-white/80 text-slate-700 text-sm font-bold border border-white shadow-sm hover:scale-105 transition-transform cursor-default">
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
                                    <div className="p-8 rounded-3xl bg-white/40 border border-white/60 shadow-lg backdrop-blur-sm">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Briefcase className="w-5 h-5" /></div>
                                                Teaching Experience
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

                                            {(isEditing ? editForm?.experience_teaching : profile.experience_teaching)?.map((exp: ExperienceTeaching, index: number) => (
                                                <div key={index} className="relative p-6 rounded-2xl bg-white/60 border border-white/60 shadow-sm group hover:bg-white/80 transition-colors">
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
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                                                            <input
                                                                placeholder="Institution Name"
                                                                value={exp.institution}
                                                                onChange={e => {
                                                                    const newList = [...(editForm?.experience_teaching || [])];
                                                                    newList[index] = { ...newList[index], institution: e.target.value };
                                                                    setEditForm(prev => prev ? { ...prev, experience_teaching: newList } : null);
                                                                }}
                                                                className="bg-white/50 border border-blue-100 rounded-lg px-3 py-2 text-sm font-bold w-full"
                                                            />
                                                            <input
                                                                placeholder="Role / Designation"
                                                                value={exp.role}
                                                                onChange={e => {
                                                                    const newList = [...(editForm?.experience_teaching || [])];
                                                                    newList[index] = { ...newList[index], role: e.target.value };
                                                                    setEditForm(prev => prev ? { ...prev, experience_teaching: newList } : null);
                                                                }}
                                                                className="bg-white/50 border border-blue-100 rounded-lg px-3 py-2 text-sm w-full"
                                                            />
                                                            <input
                                                                placeholder="Duration"
                                                                value={exp.duration}
                                                                onChange={e => {
                                                                    const newList = [...(editForm?.experience_teaching || [])];
                                                                    newList[index] = { ...newList[index], duration: e.target.value };
                                                                    setEditForm(prev => prev ? { ...prev, experience_teaching: newList } : null);
                                                                }}
                                                                className="bg-white/50 border border-blue-100 rounded-lg px-3 py-2 text-sm w-full"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div>
                                                                <h4 className="font-bold text-slate-800 text-lg">{exp.institution}</h4>
                                                                <p className="text-blue-600 font-medium">{exp.role}</p>
                                                            </div>
                                                            <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold whitespace-nowrap">
                                                                {exp.duration}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Administrative Experience */}
                                    <div className="p-8 rounded-3xl bg-white/40 border border-white/60 shadow-lg backdrop-blur-sm">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Shield className="w-5 h-5" /></div>
                                                Administrative Roles
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

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(isEditing ? editForm?.experience_admin : profile.experience_admin)?.length === 0 && (
                                                <p className="text-slate-500 italic text-center py-4 col-span-full">No administrative roles listed.</p>
                                            )}

                                            {(isEditing ? editForm?.experience_admin : profile.experience_admin)?.map((exp: ExperienceAdmin, index: number) => (
                                                <div key={index} className="relative p-6 rounded-2xl bg-white/60 border border-white/60 shadow-sm">
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
                                                        <div className="space-y-3 pr-8">
                                                            <input
                                                                placeholder="Role"
                                                                value={exp.role}
                                                                onChange={e => {
                                                                    const newList = [...(editForm?.experience_admin || [])];
                                                                    newList[index] = { ...newList[index], role: e.target.value };
                                                                    setEditForm(prev => prev ? { ...prev, experience_admin: newList } : null);
                                                                }}
                                                                className="bg-white/50 border border-purple-100 rounded-lg px-3 py-2 text-sm font-bold w-full"
                                                            />
                                                            <input
                                                                placeholder="Description"
                                                                value={exp.description}
                                                                onChange={e => {
                                                                    const newList = [...(editForm?.experience_admin || [])];
                                                                    newList[index] = { ...newList[index], description: e.target.value };
                                                                    setEditForm(prev => prev ? { ...prev, experience_admin: newList } : null);
                                                                }}
                                                                className="bg-white/50 border border-purple-100 rounded-lg px-3 py-2 text-sm w-full"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 text-lg">{exp.role}</h4>
                                                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{exp.description}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "research" && (
                                <div className="space-y-8">
                                    {/* Publications */}
                                    <div className="p-8 rounded-3xl bg-white/40 border border-white/60 shadow-lg backdrop-blur-sm">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BookOpen className="w-5 h-5" /></div>
                                                Publications
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
                                            {(isEditing ? editForm?.publications : profile.publications)?.map((pub: Publication, index: number) => (
                                                <div key={index} className="relative p-5 rounded-2xl bg-white/60 border border-white/60 shadow-sm">
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
                                                            <input placeholder="Title" value={pub.title} onChange={e => { const l = [...(editForm?.publications || [])]; l[index].title = e.target.value; setEditForm(prev => prev ? { ...prev, publications: l } : null); }} className="bg-white/50 border border-blue-100 rounded-lg px-3 py-2 text-sm font-bold w-full" />
                                                            <div className="flex gap-3">
                                                                <input placeholder="Journal" value={pub.journal} onChange={e => { const l = [...(editForm?.publications || [])]; l[index].journal = e.target.value; setEditForm(prev => prev ? { ...prev, publications: l } : null); }} className="bg-white/50 border border-blue-100 rounded-lg px-3 py-2 text-sm w-full" />
                                                                <input placeholder="Year" value={pub.year} onChange={e => { const l = [...(editForm?.publications || [])]; l[index].year = e.target.value; setEditForm(prev => prev ? { ...prev, publications: l } : null); }} className="bg-white/50 border border-blue-100 rounded-lg px-3 py-2 text-sm w-32" />
                                                            </div>
                                                            <input placeholder="Link" value={pub.link} onChange={e => { const l = [...(editForm?.publications || [])]; l[index].link = e.target.value; setEditForm(prev => prev ? { ...prev, publications: l } : null); }} className="bg-white/50 border border-blue-100 rounded-lg px-3 py-2 text-sm w-full" />
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 text-lg leading-tight">{pub.title}</h4>
                                                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-3">
                                                                <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{pub.journal}</span>
                                                                <span>{pub.year}</span>
                                                                {pub.link && (
                                                                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center text-blue-500 hover:text-blue-700 font-medium">
                                                                        <ExternalLink className="w-3 h-3 mr-1" /> View Paper
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
                                    <div className="p-8 rounded-3xl bg-white/40 border border-white/60 shadow-lg backdrop-blur-sm">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><FileText className="w-5 h-5" /></div>
                                                Research Projects
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
                                            {(isEditing ? editForm?.projects : profile.projects)?.map((proj: Project, index: number) => (
                                                <div key={index} className="relative p-5 rounded-2xl bg-white/60 border border-white/60 shadow-sm">
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
                                                            <input placeholder="Title" value={proj.title} onChange={e => { const l = [...(editForm?.projects || [])]; l[index].title = e.target.value; setEditForm(prev => prev ? { ...prev, projects: l } : null); }} className="bg-white/50 border border-emerald-100 rounded-lg px-3 py-2 text-sm font-bold w-full" />
                                                            <div className="grid grid-cols-3 gap-3">
                                                                <input placeholder="Agency" value={proj.agency} onChange={e => { const l = [...(editForm?.projects || [])]; l[index].agency = e.target.value; setEditForm(prev => prev ? { ...prev, projects: l } : null); }} className="bg-white/50 border border-emerald-100 rounded-lg px-3 py-2 text-sm w-full" />
                                                                <input placeholder="Amount" value={proj.amount} onChange={e => { const l = [...(editForm?.projects || [])]; l[index].amount = e.target.value; setEditForm(prev => prev ? { ...prev, projects: l } : null); }} className="bg-white/50 border border-emerald-100 rounded-lg px-3 py-2 text-sm w-full" />
                                                                <input placeholder="Status" value={proj.status} onChange={e => { const l = [...(editForm?.projects || [])]; l[index].status = e.target.value; setEditForm(prev => prev ? { ...prev, projects: l } : null); }} className="bg-white/50 border border-emerald-100 rounded-lg px-3 py-2 text-sm w-full" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 text-lg">{proj.title}</h4>
                                                            <div className="flex items-center gap-4 text-sm text-slate-500 mt-3">
                                                                <span className="font-medium text-emerald-600">{proj.agency}</span>
                                                                <span className="font-bold text-slate-700">{proj.amount}</span>
                                                                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide">{proj.status}</span>
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
                                    <div className="p-8 rounded-3xl bg-white/40 border border-white/60 shadow-lg backdrop-blur-sm">
                                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BookOpen className="w-5 h-5" /></div>
                                            Subjects Taught
                                        </h3>
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <input
                                                    value={editForm?.subjects?.join(", ")}
                                                    onChange={e => setEditForm(prev => prev ? { ...prev, subjects: e.target.value.split(",").map(s => s.trim()) } : null)}
                                                    className="w-full bg-white/60 border border-blue-200 rounded-2xl px-6 py-4 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-lg"
                                                    placeholder="Comma separated subjects..."
                                                />
                                                <p className="text-sm text-slate-400 pl-2">Separate multiple subjects with commas.</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-3">
                                                {profile.subjects && profile.subjects.length > 0 ? profile.subjects.map((subject, i) => (
                                                    <span key={i} className="px-6 py-3 rounded-2xl bg-white/80 border border-white text-slate-700 font-bold shadow-sm hover:shadow-md transition-all cursor-default">
                                                        {subject}
                                                    </span>
                                                )) : (
                                                    <p className="text-slate-500 italic">No subjects listed.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {/* Student Interaction */}
                                    <div className="p-8 rounded-3xl bg-white/40 border border-white/60 shadow-lg backdrop-blur-sm">
                                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Users className="w-5 h-5" /></div>
                                            Student Interaction
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <h4 className="font-bold text-slate-400 uppercase text-xs tracking-wider">Resources & Links</h4>
                                                <InfoRow icon={Globe} label="Course Website / LMS" value={profile.student_interaction?.lms_link} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, student_interaction: { ...prev.student_interaction, lms_link: v } } : null)} editValue={editForm?.student_interaction?.lms_link} placeholder="https://..." />
                                                <InfoRow icon={Calendar} label="Meeting Scheduler" value={profile.student_interaction?.scheduler_link} isEditing={isEditing} onChange={(v: string) => setEditForm(prev => prev ? { ...prev, student_interaction: { ...prev.student_interaction, scheduler_link: v } } : null)} editValue={editForm?.student_interaction?.scheduler_link} placeholder="Calendly Link" />
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="font-bold text-slate-400 uppercase text-xs tracking-wider">Mentorship</h4>
                                                <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
                                                    <p className="text-sm text-blue-800 mb-3 font-bold uppercase tracking-wide">Mentoring Philosophy</p>
                                                    {isEditing ? (
                                                        <textarea
                                                            value={editForm?.student_interaction?.mentorship_philosophy}
                                                            onChange={e => setEditForm(prev => prev ? { ...prev, student_interaction: { ...prev.student_interaction, mentorship_philosophy: e.target.value } } : null)}
                                                            className="w-full h-32 bg-white border border-blue-200 rounded-xl p-3 text-sm focus:outline-none resize-none"
                                                            placeholder="Describe your approach..."
                                                        />
                                                    ) : (
                                                        <p className="text-slate-700 text-sm italic leading-relaxed">
                                                            &quot;{profile.student_interaction?.mentorship_philosophy || "Not provided"}&quot;
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
                                    <div className="p-8 rounded-3xl bg-white/40 border border-white/60 shadow-lg backdrop-blur-sm">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                                <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Award className="w-5 h-5" /></div>
                                                Awards & Honors
                                            </h3>
                                            {isEditing && (
                                                <Button size="sm" variant="outline" onClick={() => { const newAward = { title: "", year: "", issuer: "" }; setEditForm(prev => prev ? { ...prev, awards: [...(prev.awards || []), newAward] } : null); }} className="text-amber-600 border-amber-200 hover:bg-amber-50"><Plus className="w-4 h-4 mr-1" /> Add</Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(isEditing ? editForm?.awards : profile.awards)?.length === 0 && <p className="text-slate-500 italic text-center py-4 col-span-full">No awards listed.</p>}
                                            {(isEditing ? editForm?.awards : profile.awards)?.map((award: AwardItem, index: number) => (
                                                <div key={index} className="relative p-5 rounded-2xl bg-white/60 border border-white/60 shadow-sm flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-inner"><Award className="w-6 h-6" /></div>
                                                    {isEditing ? (
                                                        <div className="flex-1 grid grid-cols-1 gap-2 pr-8">
                                                            <input placeholder="Title" value={award.title} onChange={e => { const l = [...(editForm?.awards || [])]; l[index].title = e.target.value; setEditForm(prev => prev ? { ...prev, awards: l } : null); }} className="bg-white/50 border border-amber-100 rounded-lg px-3 py-2 text-sm font-bold w-full" />
                                                            <input placeholder="Issuer" value={award.issuer} onChange={e => { const l = [...(editForm?.awards || [])]; l[index].issuer = e.target.value; setEditForm(prev => prev ? { ...prev, awards: l } : null); }} className="bg-white/50 border border-amber-100 rounded-lg px-3 py-2 text-sm w-full" />
                                                            <input placeholder="Year" value={award.year} onChange={e => { const l = [...(editForm?.awards || [])]; l[index].year = e.target.value; setEditForm(prev => prev ? { ...prev, awards: l } : null); }} className="bg-white/50 border border-amber-100 rounded-lg px-3 py-2 text-sm w-full" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-slate-800 text-lg">{award.title}</h4>
                                                            <p className="text-sm text-slate-500 font-medium">{award.issuer} • {award.year}</p>
                                                        </div>
                                                    )}
                                                    {isEditing && <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-red-400 hover:text-red-600" onClick={() => { const l = [...(editForm?.awards || [])]; l.splice(index, 1); setEditForm(prev => prev ? { ...prev, awards: l } : null); }}><Trash2 className="w-4 h-4" /></Button>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Memberships */}
                                    <div className="p-8 rounded-3xl bg-white/40 border border-white/60 shadow-lg backdrop-blur-sm">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Globe className="w-5 h-5" /></div>
                                                Professional Memberships
                                            </h3>
                                            {isEditing && (
                                                <Button size="sm" variant="outline" onClick={() => { const newMem = { organization: "", role: "", year: "" }; setEditForm(prev => prev ? { ...prev, memberships: [...(prev.memberships || []), newMem] } : null); }} className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"><Plus className="w-4 h-4 mr-1" /> Add</Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(isEditing ? editForm?.memberships : profile.memberships)?.length === 0 && <p className="text-slate-500 italic text-center py-4 col-span-full">No memberships listed.</p>}
                                            {(isEditing ? editForm?.memberships : profile.memberships)?.map((mem: Membership, index: number) => (
                                                <div key={index} className="relative p-5 rounded-2xl bg-white/60 border border-white/60 shadow-sm">
                                                    {isEditing && <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-red-400 hover:text-red-600" onClick={() => { const l = [...(editForm?.memberships || [])]; l.splice(index, 1); setEditForm(prev => prev ? { ...prev, memberships: l } : null); }}><Trash2 className="w-4 h-4" /></Button>}
                                                    {isEditing ? (
                                                        <div className="grid grid-cols-1 gap-2 pr-8">
                                                            <input placeholder="Organization" value={mem.organization} onChange={e => { const l = [...(editForm?.memberships || [])]; l[index].organization = e.target.value; setEditForm(prev => prev ? { ...prev, memberships: l } : null); }} className="bg-white/50 border border-indigo-100 rounded-lg px-3 py-2 text-sm font-bold w-full" />
                                                            <input placeholder="Role" value={mem.role} onChange={e => { const l = [...(editForm?.memberships || [])]; l[index].role = e.target.value; setEditForm(prev => prev ? { ...prev, memberships: l } : null); }} className="bg-white/50 border border-indigo-100 rounded-lg px-3 py-2 text-sm w-full" />
                                                            <input placeholder="Year" value={mem.year} onChange={e => { const l = [...(editForm?.memberships || [])]; l[index].year = e.target.value; setEditForm(prev => prev ? { ...prev, memberships: l } : null); }} className="bg-white/50 border border-indigo-100 rounded-lg px-3 py-2 text-sm w-full" />
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 text-lg">{mem.organization}</h4>
                                                            <p className="text-sm text-slate-500 font-medium mt-1">{mem.role} • {mem.year}</p>
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
            </main>
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
}: InfoRowProps) {
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
