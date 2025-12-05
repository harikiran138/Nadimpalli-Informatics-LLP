"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ListEditor } from "@/components/profile/ListEditor";
import { UserProfile, Education, ExperienceTeaching, Publication, Project, AwardItem, EventItem, Membership } from "@/types/profile";
import {
    Loader2, LogOut, User, Mail, Phone, MapPin, Clock, Briefcase, GraduationCap,
    BookOpen, Award, FileText, Users, Globe, Linkedin, Twitter, Save, Edit2, Lightbulb,
    Calendar, Share2, QrCode as QrIcon, Camera, LayoutGrid, Layers, Monitor, Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import Loader from "@/components/ui/Loader";

const supabase = createClient();

const TABS = [
    { id: "overview", label: "Identity & Bio", icon: User },
    { id: "academic", label: "Academic Info", icon: GraduationCap },
    { id: "research", label: "Research & Projects", icon: BookOpen },
    { id: "skills", label: "Skills & Expertise", icon: Monitor },
    { id: "community", label: "Events & Membership", icon: Users },
    { id: "student", label: "Student Corner", icon: Lightbulb },
];

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [showQr, setShowQr] = useState(false);

    // Form State
    const [formData, setFormData] = useState<UserProfile | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const employeeId = localStorage.getItem("user_id");
            if (!employeeId) {
                router.push("/login");
                return;
            }

            const { data: emp, error: empError } = await supabase.from('employees').select('*').eq('employee_id', employeeId).single();
            if (empError) throw empError;

            const { data: tp, error: tpError } = await supabase.from('teacher_profiles').select('*').eq('employee_id', employeeId).single();

            // Default empty if missing
            const merged: UserProfile = {
                full_name: emp.full_name,
                employee_id: emp.employee_id,
                email: tp?.email || "",
                phone: tp?.phone || "",
                username: tp?.username || emp.employee_id,
                designation: tp?.designation || "",
                program: tp?.program || "",
                bio: tp?.bio || "",
                teaching_philosophy: tp?.teaching_philosophy || "",
                gender: tp?.gender || "",
                dob: tp?.dob || "",
                doj: tp?.doj || "",
                experience_years: tp?.experience_years || "",
                office_room: tp?.office_room || "",
                availability: tp?.availability || "",
                skills: tp?.skills || "",
                address: tp?.address || "",
                education: tp?.education || [],
                experience_teaching: tp?.experience_teaching || [],
                experience_admin: tp?.experience_admin || [],
                publications: tp?.publications || [],
                projects: tp?.projects || [],
                awards: tp?.awards || [],
                events: tp?.events || [],
                memberships: tp?.memberships || [],
                student_interaction: tp?.student_interaction || { timetable_link: "", mentorship_batch: "" },
                social_links: tp?.social_links || { linkedin: "", google_scholar: "" }
            };

            setProfile(merged);
            setFormData(merged);
        } catch (error) {
            console.error("Error fetching profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData || !profile) return;
        setSaving(true);
        try {
            // Update teacher_profiles
            const { error } = await supabase.from('teacher_profiles').upsert({
                ...formData,
                updated_at: new Date().toISOString()
            });

            if (error) throw error;
            setProfile(formData);
            setIsEditing(false);
        } catch (error: any) {
            alert("Failed to save: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Cancel
            setFormData(profile);
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    if (!profile || !formData) return null;

    return (
        <div className="flex h-screen overflow-hidden font-sans text-slate-800 bg-transparent">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-80 hidden lg:flex flex-col m-4 rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border border-white/50 shadow-xl overflow-y-auto custom-scrollbar z-20"
            >
                <div className="p-8 text-center border-b border-white/20">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-white p-1 shadow-lg mb-4 relative group">
                        {/* Photo Placeholder */}
                        <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-4xl font-bold text-slate-500 overflow-hidden">
                            {/* Initials */}
                            {profile.full_name?.charAt(0)}
                        </div>
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-md hover:bg-blue-500">
                                <Camera className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">{profile.full_name}</h2>
                    <p className="text-sm text-blue-600 font-bold mt-1">{profile.designation || "Faculty Member"}</p>
                    <p className="text-xs text-slate-500 font-medium">{profile.program}</p>

                    <div className="flex justify-center gap-3 mt-4">
                        <Button size="icon" variant="ghost" className="rounded-full bg-white/50 hover:bg-white text-blue-700" title="LinkedIn">
                            <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="rounded-full bg-white/50 hover:bg-white text-slate-700" title="Website/Scholar">
                            <Globe className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="rounded-full bg-white/50 hover:bg-white text-sky-500" title="Twitter">
                            <Twitter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    {TABS.map(tab => (
                        <Button
                            key={tab.id}
                            variant="ghost"
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full justify-start h-14 rounded-2xl font-bold transition-all ${activeTab === tab.id ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-slate-600 hover:bg-white/40"}`}
                        >
                            <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`} />
                            {tab.label}
                        </Button>
                    ))}
                </nav>

                <div className="p-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => setShowQr(true)}>
                        <div className="absolute top-0 right-0 p-4 opacity-20"><QrIcon className="w-16 h-16" /></div>
                        <h4 className="font-bold relative z-10">Share Profile</h4>
                        <p className="text-xs text-indigo-100 relative z-10 opacity-80">Click to show QR Code</p>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 p-4 lg:pl-0">
                {/* Top Bar */}
                <header className="h-20 px-8 mb-4 rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border border-white/50 shadow-sm flex items-center justify-between shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{TABS.find(t => t.id === activeTab)?.label}</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Last updated: Today</p>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={() => window.open(`/profile/preview`, '_blank')} variant="ghost" className="text-slate-600 hover:bg-white/50 rounded-xl font-bold hidden md:flex">
                            <Share2 className="w-4 h-4 mr-2" /> Public View
                        </Button>
                        <Button
                            onClick={isEditing ? handleSave : toggleEdit}
                            className={`px-8 rounded-xl font-bold shadow-lg transition-all ${isEditing ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20" : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20"}`}
                        >
                            {isEditing ? (saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />) : <Edit2 className="w-4 h-4 mr-2" />}
                            {isEditing ? "Save Changes" : "Edit Profile"}
                        </Button>
                        {isEditing && (
                            <Button onClick={toggleEdit} variant="ghost" className="text-red-500 hover:bg-red-50 rounded-xl">Cancel</Button>
                        )}
                    </div>
                </header>

                {/* Scrollable Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20 space-y-6"
                >
                    {/* -- TAB: OVERVIEW -- */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Bio */}
                            <div className="bg-white/40 border border-white/50 rounded-[2rem] p-8 backdrop-blur-2xl shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-blue-500" /> Biography</h3>
                                {isEditing ? <Textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="bg-white/80 min-h-[120px] rounded-xl border-white/60" /> : <p className="text-slate-600 leading-relaxed text-lg">{formData.bio || "No biography added."}</p>}
                            </div>

                            {/* Teaching Philosophy */}
                            <div className="bg-white/40 border border-white/50 rounded-[2rem] p-8 backdrop-blur-2xl shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Heart className="w-5 h-5 text-pink-500" /> Teaching Philosophy & Mission</h3>
                                {isEditing ? <Textarea value={formData.teaching_philosophy} onChange={e => setFormData({ ...formData, teaching_philosophy: e.target.value })} className="bg-white/80 min-h-[100px] rounded-xl border-white/60" placeholder="e.g. Passionate about making learning practical..." /> : <p className="text-slate-600 italic">"{formData.teaching_philosophy || "Not specified."}"</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Details Card */}
                                <div className="bg-white/40 border border-white/50 rounded-[2rem] p-8 backdrop-blur-2xl shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-6">Personal Details</h3>
                                    <div className="space-y-4">
                                        <InfoRow label="Employee ID" value={formData.employee_id} icon={Briefcase} />
                                        <InfoRow label="Gender" value={formData.gender} icon={User} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, gender: v })} />
                                        <InfoRow label="Date of Birth" value={formData.dob} icon={Calendar} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, dob: v })} />
                                        <InfoRow label="Join Date" value={formData.doj} icon={Calendar} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, doj: v })} />
                                        <InfoRow label="Office" value={formData.office_room} icon={MapPin} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, office_room: v })} />
                                        <InfoRow label="Office Hours" value={formData.availability} icon={Clock} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, availability: v })} />
                                    </div>
                                </div>
                                {/* Contact Card (Privacy Logic Simulated) */}
                                <div className="bg-white/40 border border-white/50 rounded-[2rem] p-8 backdrop-blur-2xl shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-6">Contact Information</h3>
                                    <div className="space-y-4">
                                        <InfoRow label="Email (Official)" value={formData.email} icon={Mail} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, email: v })} />
                                        <div className="relative">
                                            <InfoRow label="Phone (Private)" value={formData.phone} icon={Phone} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, phone: v })} />
                                            {!isEditing && <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-yellow-200">Admins Only</div>}
                                        </div>
                                        <InfoRow label="Address" value={profile.address} icon={MapPin} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, address: v })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* -- TAB: ACADEMIC -- */}
                    {activeTab === 'academic' && (
                        <div className="space-y-6">
                            <ListEditor
                                title="Education & Qualifications"
                                items={formData.education || []}
                                onUpdate={items => setFormData({ ...formData, education: items })}
                                isEditing={isEditing}
                                fields={[
                                    { name: 'degree', label: 'Degree', required: true, placeholder: 'e.g. PhD Computer Science' },
                                    { name: 'institution', label: 'Institution', required: true },
                                    { name: 'year', label: 'Passing Year', required: true },
                                    { name: 'grade', label: 'Grade/CGPA', required: true },
                                ]}
                                renderItem={(item: Education) => (
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-800">{item.degree}</h4>
                                        <p className="text-slate-600">{item.institution} <span className="text-slate-400">•</span> {item.year}</p>
                                        <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded mt-2 inline-block">Grade: {item.grade}</span>
                                    </div>
                                )}
                            />

                            <ListEditor
                                title="Teaching Experience"
                                items={formData.experience_teaching || []}
                                onUpdate={items => setFormData({ ...formData, experience_teaching: items })}
                                isEditing={isEditing}
                                fields={[
                                    { name: 'role', label: 'Role / Designation', required: true },
                                    { name: 'institution', label: 'College / Organization', required: true },
                                    { name: 'duration', label: 'Duration (From-To)', required: true },
                                    { name: 'responsibilities', label: 'Key Responsibilities', type: 'textarea' },
                                ]}
                                renderItem={(item: ExperienceTeaching) => (
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-800">{item.role}</h4>
                                        <p className="font-medium text-blue-600">{item.institution}</p>
                                        <p className="text-xs text-slate-500 font-bold uppercase mt-1">{item.duration}</p>
                                        {item.responsibilities && <p className="text-sm text-slate-600 mt-2 bg-white/50 p-3 rounded-lg">{item.responsibilities}</p>}
                                    </div>
                                )}
                            />

                            <ListEditor
                                title="Administrative Roles"
                                items={formData.experience_admin || []}
                                onUpdate={items => setFormData({ ...formData, experience_admin: items })}
                                isEditing={isEditing}
                                fields={[
                                    { name: 'role', label: 'Role (e.g. HOD, Exam Cell)', required: true },
                                    { name: 'description', label: 'Description of Duties', type: 'textarea' },
                                ]}
                                renderItem={(item: any) => (
                                    <div>
                                        <h4 className="font-bold text-slate-800">{item.role}</h4>
                                        <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                                    </div>
                                )}
                            />
                        </div>
                    )}

                    {/* -- TAB: RESEARCH -- */}
                    {activeTab === 'research' && (
                        <div className="space-y-6">
                            <ListEditor
                                title="Publications"
                                items={formData.publications || []}
                                onUpdate={items => setFormData({ ...formData, publications: items })}
                                isEditing={isEditing}
                                fields={[
                                    { name: 'title', label: 'Title', required: true },
                                    { name: 'journal', label: 'Journal/Conference', required: true },
                                    { name: 'year', label: 'Year', required: true },
                                    { name: 'link', label: 'DOI / Link', placeholder: "https://..." },
                                ]}
                                renderItem={(item: Publication) => (
                                    <div>
                                        <h4 className="font-bold text-slate-800 leading-tight">"{item.title}"</h4>
                                        <div className="flex flex-wrap gap-2 mt-2 text-sm">
                                            <span className="font-bold text-indigo-600">{item.journal}</span>
                                            <span className="text-slate-400">•</span>
                                            <span>{item.year}</span>
                                        </div>
                                        {item.link && <a href={item.link} target="_blank" className="text-xs text-blue-500 hover:underline mt-2 inline-flex items-center gap-1"><ExternalLink /> View Publication</a>}
                                    </div>
                                )}
                            />

                            <ListEditor
                                title="Funded Projects"
                                items={formData.projects || []}
                                onUpdate={items => setFormData({ ...formData, projects: items })}
                                isEditing={isEditing}
                                fields={[
                                    { name: 'title', label: 'Project Title', required: true },
                                    { name: 'agency', label: 'Funding Agency' },
                                    { name: 'amount', label: 'Grant Amount' },
                                    { name: 'summary', label: 'Summary', type: 'textarea' },
                                    { name: 'year', label: 'Year' },
                                ]}
                                renderItem={(item: Project) => (
                                    <div>
                                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                                        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-slate-500 mt-1 mb-2">
                                            <span>{item.agency}</span>
                                            <span>{item.amount}</span>
                                            <span>{item.year}</span>
                                        </div>
                                        <p className="text-sm text-slate-600">{item.summary}</p>
                                    </div>
                                )}
                            />
                        </div>
                    )}

                    {/* -- TAB: SKILLS -- */}
                    {activeTab === 'skills' && (
                        <div className="space-y-6">
                            <div className="bg-white/40 border border-white/50 rounded-[2rem] p-8 backdrop-blur-2xl shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Core Competencies</h3>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-slate-600">Technical & Research Skills (Comma Separated)</label>
                                        <Textarea value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} className="bg-white/80" />
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills ? formData.skills.split(',').map((skill, i) => (
                                            <span key={i} className="px-4 py-2 rounded-xl bg-white/60 text-slate-700 text-sm font-bold border border-white/60 shadow-sm">
                                                {skill.trim()}
                                            </span>
                                        )) : <span className="text-slate-400 italic">No skills listed</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}


                    {/* -- TAB: COMMUNITY -- */}
                    {activeTab === 'community' && (
                        <div className="space-y-6">
                            <ListEditor
                                title="Awards & Achievements"
                                items={formData.awards || []}
                                onUpdate={items => setFormData({ ...formData, awards: items })}
                                isEditing={isEditing}
                                fields={[
                                    { name: 'title', label: 'Award Title', required: true },
                                    { name: 'issuer', label: 'Issuer / Organization', required: true },
                                    { name: 'year', label: 'Year', required: true },
                                ]}
                                renderItem={(item: AwardItem) => (
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full"><Award className="w-5 h-5" /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{item.title}</h4>
                                            <p className="text-sm text-slate-500">{item.issuer}, {item.year}</p>
                                        </div>
                                    </div>
                                )}
                            />
                            <ListEditor
                                title="Events & Workshops"
                                items={formData.events || []}
                                onUpdate={items => setFormData({ ...formData, events: items })}
                                isEditing={isEditing}
                                fields={[
                                    { name: 'title', label: 'Event Name', required: true },
                                    { name: 'type', label: 'Role (Attended/Organized)', required: true },
                                    { name: 'date', label: 'Date' },
                                ]}
                                renderItem={(item: EventItem) => (
                                    <div>
                                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">{item.type}</span>
                                            <span className="text-xs text-slate-500">{item.date}</span>
                                        </div>
                                    </div>
                                )}
                            />
                            <ListEditor
                                title="Memberships"
                                items={formData.memberships || []}
                                onUpdate={items => setFormData({ ...formData, memberships: items })}
                                isEditing={isEditing}
                                fields={[
                                    { name: 'organization', label: 'Organization (e.g. IEEE)', required: true },
                                    { name: 'role', label: 'Role / ID' },
                                    { name: 'year', label: 'Since Year' },
                                ]}
                                renderItem={(item: Membership) => (
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-slate-800">{item.organization}</h4>
                                        <p className="text-sm text-slate-600">Since {item.year}</p>
                                    </div>
                                )}
                            />
                        </div>
                    )}

                    {activeTab === 'student' && (
                        <div className="space-y-6">
                            <div className="bg-white/40 border border-white/50 rounded-[2rem] p-8 backdrop-blur-2xl shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 mb-6">Student Interaction</h3>
                                <div className="space-y-4">
                                    <InfoRow label="Timetable Link" value={formData.student_interaction?.timetable_link} icon={Calendar} isEditing={isEditing}
                                        onChange={(v: string) => setFormData({ ...formData, student_interaction: { ...formData.student_interaction, timetable_link: v } })}
                                        isLink
                                    />
                                    <InfoRow label="Mentorship Batch" value={formData.student_interaction?.mentorship_batch} icon={Users} isEditing={isEditing}
                                        onChange={(v: string) => setFormData({ ...formData, student_interaction: { ...formData.student_interaction, mentorship_batch: v } })}
                                    />
                                    <InfoRow label="Feedback Link" value={formData.student_interaction?.feedback_link} icon={FileText} isEditing={isEditing}
                                        onChange={(v: string) => setFormData({ ...formData, student_interaction: { ...formData.student_interaction, feedback_link: v } })}
                                        isLink
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                </motion.div>
            </main>

            {/* QR Code Modal */}
            <AnimatePresence>
                {showQr && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowQr(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Scan Profile</h3>
                            <p className="text-slate-500 mb-6">Share this code with students or colleagues.</p>
                            <div className="bg-white p-4 rounded-xl border-2 border-slate-100 inline-block">
                                {/* Use window location if available, else placeholder */}
                                <QRCode value={typeof window !== 'undefined' ? window.location.href : "https://example.com/profile"} />
                            </div>
                            <Button onClick={() => setShowQr(false)} className="mt-8 w-full rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold">Close</Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InfoRow({ label, value, icon: Icon, isEditing, onChange, isLink = false }: any) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-white/40">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm text-slate-600`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                {isEditing ? (
                    <Input value={value || ""} onChange={e => onChange(e.target.value)} className="bg-white/90 h-10 border-blue-100" />
                ) : (
                    isLink && value ? (
                        <a href={value} target="_blank" className="font-bold text-blue-600 hover:underline truncate block">{value}</a>
                    ) : (
                        <p className="font-bold text-slate-700">{value || "N/A"}</p>
                    )
                )}
            </div>
        </div>
    );
}

function ExternalLink() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
}
