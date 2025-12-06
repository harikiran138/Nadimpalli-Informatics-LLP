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
    { id: "community", label: "Memberships & Awards", icon: Users },
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

            const { data: tp, error: tpError } = await supabase.from('teacher_profiles').select('*').eq('employee_id', employeeId).maybeSingle();

            if (!tp || !tp.program) {
                // If no profile exists or is incomplete, redirect to onboarding
                router.push("/onboarding");
                return;
            }

            // Default empty if missing
            const merged: UserProfile = {
                full_name: emp.full_name,
                employee_id: emp.employee_id,
                email: emp.email || "", // Base email

                // New Emails
                official_email: tp?.official_email || tp?.email || "",
                personal_email: tp?.personal_email || "",

                phone: tp?.phone || "",
                username: tp?.username || emp.employee_id,
                designation: tp?.designation || "",
                program: tp?.program || "",
                bio: tp?.bio || "",
                teaching_philosophy: tp?.teaching_philosophy || "",
                gender: tp?.gender || "",
                dob: tp?.dob || "",
                doj: tp?.doj || "",
                dor: tp?.dor || "", // Date of Retirement

                // Identity
                blood_group: tp?.blood_group || "",
                aadhar_number: tp?.aadhar_number || "",
                pan_number: tp?.pan_number || "",
                apaar_id: tp?.apaar_id || "",

                // Addresses
                address: tp?.address || "",
                communication_address: tp?.communication_address || tp?.address || "",
                permanent_address: tp?.permanent_address || "",

                // Experience
                experience_years: tp?.experience_years || "",
                teaching_experience_years: tp?.teaching_experience_years || "",
                post_mtech_experience: tp?.post_mtech_experience || "",
                post_teaching_experience: tp?.post_teaching_experience || "",

                office_room: tp?.office_room || "",
                availability: tp?.availability || "",
                skills: tp?.skills || "",
                qualification: tp?.qualification || "",

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
                        <Button
                            onClick={() => {
                                document.cookie = "employee_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                localStorage.removeItem("user_id");
                                localStorage.removeItem("user_name");
                                supabase.auth.signOut();
                                router.push("/login");
                            }}
                            variant="ghost"
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold hidden md:flex"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </Button>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Details Card */}
                                <div className="bg-white/40 border border-white/50 rounded-[2rem] p-8 backdrop-blur-2xl shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-6">Personal & Service Details</h3>
                                    <div className="space-y-4">
                                        <InfoRow label="Employee ID" value={formData.employee_id} icon={Briefcase} />
                                        <InfoRow label="Program" value={formData.program} icon={Layers} />
                                        <InfoRow
                                            label="Designation"
                                            value={formData.designation}
                                            icon={Award}
                                            isEditing={isEditing}
                                            onChange={(v: string) => setFormData({ ...formData, designation: v })}
                                            type="select"
                                            options={["Professor", "Associate Professor", "Assistant Professor"]}
                                        />
                                        <InfoRow
                                            label="Qualification"
                                            value={formData.qualification}
                                            icon={GraduationCap}
                                            isEditing={isEditing}
                                            onChange={(v: string) => setFormData({ ...formData, qualification: v })}
                                            type="select"
                                            options={["PhD", "M.Tech", "Other"]}
                                        />
                                        <InfoRow label="Department" value={formData.program} icon={Layers} />
                                        <InfoRow
                                            label="Gender"
                                            value={formData.gender}
                                            icon={User}
                                            isEditing={isEditing}
                                            onChange={(v: string) => setFormData({ ...formData, gender: v })}
                                            type="select"
                                            options={["Male", "Female", "Other"]}
                                        />
                                        <InfoRow
                                            label="Blood Group"
                                            value={formData.blood_group}
                                            icon={Heart}
                                            isEditing={isEditing}
                                            onChange={(v: string) => setFormData({ ...formData, blood_group: v })}
                                            type="select"
                                            options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                                        />
                                        <InfoRow label="Date of Birth" value={formData.dob} icon={Calendar} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, dob: v })} />
                                        <InfoRow label="Join Date" value={formData.doj} icon={Calendar} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, doj: v })} />
                                        <InfoRow label="Retirement Date" value={formData.dor} icon={Calendar} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, dor: v })} />
                                    </div>
                                </div>

                                {/* Identity Card (New) */}
                                <div className="bg-white/40 border border-white/50 rounded-[2rem] p-8 backdrop-blur-2xl shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-6">Identity Information</h3>
                                    <div className="space-y-4">
                                        <InfoRow label="Aadhar Number" value={formData.aadhar_number} icon={FileText} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, aadhar_number: v })} />
                                        <InfoRow label="PAN Number" value={formData.pan_number} icon={FileText} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, pan_number: v })} />
                                        <InfoRow label="APAAR ID" value={formData.apaar_id} icon={FileText} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, apaar_id: v })} />

                                        <div className="h-px bg-white/50 my-4" />
                                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Experience</h4>
                                        <InfoRow label="Total Experience" value={formData.experience_years} icon={Clock} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, experience_years: v })} />
                                        <InfoRow label="Teaching Exp (Yrs)" value={formData.teaching_experience_years} icon={Briefcase} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, teaching_experience_years: v })} />
                                        <InfoRow label="Post M.Tech Exp" value={formData.post_mtech_experience} icon={GraduationCap} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, post_mtech_experience: v })} />
                                    </div>
                                </div>

                                {/* Contact Card */}
                                <div className="bg-white/40 border border-white/50 rounded-[2rem] p-8 backdrop-blur-2xl shadow-sm md:col-span-2">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-6">Contact & Address</h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <InfoRow label="Official Email" value={formData.official_email} icon={Mail} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, official_email: v })} />
                                            <InfoRow label="Personal Email" value={formData.personal_email} icon={Mail} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, personal_email: v })} />
                                            <InfoRow label="Mobile" value={formData.phone} icon={Phone} isEditing={isEditing} onChange={(v: string) => setFormData({ ...formData, phone: v })} />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Communication Address</label>
                                                {isEditing ? (
                                                    <Textarea value={formData.communication_address} onChange={e => setFormData({ ...formData, communication_address: e.target.value })} className="bg-white/80" />
                                                ) : <p className="text-sm font-medium text-slate-700">{formData.communication_address || "N/A"}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Permanent Address</label>
                                                {isEditing ? (
                                                    <Textarea value={formData.permanent_address} onChange={e => setFormData({ ...formData, permanent_address: e.target.value })} className="bg-white/80" />
                                                ) : <p className="text-sm font-medium text-slate-700">{formData.permanent_address || "N/A"}</p>}
                                            </div>
                                        </div>
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
                                    { name: 'title', label: 'Title of Paper', required: true },
                                    { name: 'journal_name', label: 'Journal/Conference Name', required: true },
                                    { name: 'indexing', label: 'Indexing', type: 'select', options: ['Scopus', 'SCI', 'Others'], required: true },
                                    { name: 'quartile', label: 'Quartile', type: 'select', options: ['Q1', 'Q2', 'Q3', 'Q4'], required: true },
                                    { name: 'volume', label: 'Volume' },
                                    { name: 'issue_number', label: 'Issue Number' },
                                    { name: 'year_of_publication', label: 'Year', required: true },
                                    { name: 'doi_link', label: 'DOI / Article Link', placeholder: "https://..." },
                                    { name: 'paper_file', label: 'Paper File (URL)', type: 'file', placeholder: "Upload/Paste Link to PDF" },
                                ]}
                                renderItem={(item: Publication) => (
                                    <div>
                                        <h4 className="font-bold text-slate-800 leading-tight">"{item.title}"</h4>
                                        <div className="flex flex-wrap gap-2 mt-2 text-sm">
                                            <span className="font-bold text-indigo-600">{item.journal_name}</span>
                                            <span className="text-xs font-bold bg-slate-200 px-2 py-0.5 rounded">{item.indexing}</span>
                                            {item.quartile && <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded">{item.quartile}</span>}
                                            <span className="text-slate-400">•</span>
                                            <span>{item.year_of_publication}</span>
                                        </div>
                                        <div className="flex gap-4 mt-2">
                                            {item.doi_link && <a href={item.doi_link} target="_blank" className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1"><ExternalLink /> View Article</a>}
                                            {item.paper_file && <a href={item.paper_file} target="_blank" className="text-xs text-emerald-600 hover:underline inline-flex items-center gap-1"><ExternalLink /> View PDF</a>}
                                        </div>
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
                                title="Professional Memberships"
                                items={formData.memberships || []}
                                onUpdate={items => setFormData({ ...formData, memberships: items })}
                                isEditing={isEditing}
                                fields={[
                                    {
                                        name: 'organization',
                                        label: 'Organization',
                                        type: 'select',
                                        options: ['ISTE', 'ICE', 'CSI', 'ACM', 'IEEE', 'ASME', 'ASCE', 'IETE', 'SAE India', 'Other'],
                                        required: true
                                    },
                                    { name: 'id', label: 'Membership ID' },
                                    { name: 'year', label: 'Since Year' },
                                ]}
                                renderItem={(item: Membership) => (
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-slate-800">{item.organization}</h4>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-blue-600">{item.id}</p>
                                            <p className="text-xs text-slate-500">Since {item.year}</p>
                                        </div>
                                    </div>
                                )}
                            />

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

function InfoRow({ label, value, icon: Icon, isEditing, onChange, isLink = false, type = 'text', options = [] }: any) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-white/40">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm text-slate-600`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                {isEditing ? (
                    type === 'select' ? (
                        <div className="relative">
                            <select
                                value={value || ""}
                                onChange={e => onChange(e.target.value)}
                                className="w-full h-10 px-3 rounded-md bg-white/90 border border-blue-100 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 appearance-none font-medium cursor-pointer"
                            >
                                <option value="" disabled>Select {label}</option>
                                {options.map((opt: string) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <Input value={value || ""} onChange={e => onChange(e.target.value)} className="bg-white/90 h-10 border-blue-100" />
                    )
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
