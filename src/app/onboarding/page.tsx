"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, GraduationCap, Briefcase, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import { AuthBackground } from "@/components/ui/AuthBackground";
import { DateSelector } from "@/components/ui/date-selector";
import { useRef } from "react";

const supabase = createClient();

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        program: "",
        dob: "",
        doj: "",
        dor: "", // Added
        gender: "",
        qualification: "",

        // Experience
        experience: "", // Total Teaching Experience
        teaching_experience_years: "", // Explicit field
        post_mtech_experience: "",
        post_teaching_experience: "",

        bio: "",
        phone: "",
        email: "",
        official_email: "",
        personal_email: "",

        // Identity
        aadhar_number: "",
        pan_number: "",
        apaar_id: "",
        blood_group: "",

        // Address
        communication_address: "",
        permanent_address: "",

        skills: "",
        designation: ""
    });

    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const validateStep = (currentStep: number) => {
        const newErrors: Record<string, boolean> = {};
        let isValid = true;

        if (currentStep === 1) {
            if (!formData.first_name) newErrors.first_name = true;
            if (!formData.last_name) newErrors.last_name = true;
            if (!formData.username) newErrors.username = true;
            if (!formData.gender) newErrors.gender = true;
            if (!formData.blood_group) newErrors.blood_group = true;
            if (!formData.dob) newErrors.dob = true;
            if (!formData.aadhar_number) newErrors.aadhar_number = true;
            if (!formData.pan_number) newErrors.pan_number = true;
            if (!formData.apaar_id) newErrors.apaar_id = true;
        }

        if (currentStep === 2) {
            if (!formData.phone) newErrors.phone = true;
            if (!formData.official_email) newErrors.official_email = true;
            // Personal email is optional? Let's make it required as per user implied "all fields"
            if (!formData.personal_email) newErrors.personal_email = true;
            if (!formData.communication_address) newErrors.communication_address = true;
            if (!formData.permanent_address) newErrors.permanent_address = true;
        }

        if (currentStep === 3) {
            if (!formData.program) newErrors.program = true;
            if (!formData.designation) newErrors.designation = true;
            if (!formData.qualification) newErrors.qualification = true;
            if (!formData.doj) newErrors.doj = true;
            if (!formData.dor) newErrors.dor = true;
            if (!formData.teaching_experience_years) newErrors.teaching_experience_years = true;
            if (!formData.post_mtech_experience) newErrors.post_mtech_experience = true;
            if (!formData.post_teaching_experience) newErrors.post_teaching_experience = true;
        }

        if (currentStep === 4) {
            if (!formData.bio) newErrors.bio = true;
            if (!formData.skills) newErrors.skills = true;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Missing Information", { description: "Please fill in all required fields highlighted in red." });
            isValid = false;
        } else {
            setErrors({});
        }

        return isValid;
    };

    const handleNext = (nextStep: number) => {
        if (validateStep(step)) {
            setStep(nextStep);
            window.scrollTo(0, 0);
        }
    };

    useEffect(() => {
        checkOnboardingStatus();
    }, []);

    const checkOnboardingStatus = async () => {
        const employeeId = localStorage.getItem("user_id");
        if (!employeeId) return;

        // Check if profile exists AND is complete (has program)
        const { data } = await supabase.from('teacher_profiles').select('program').eq('employee_id', employeeId).maybeSingle();

        if (data && data.program) {
            router.push("/profile");
        }
    };

    const programs = ["CIVIL ENGINEERING", "CSE", "CSM", "CSD", "ECE", "EEE", "MECH", "MBA", "MCA", "BS", "BS & H"];
    const designations = ["Professor", "Associate Professor", "Assistant Professor"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const employeeId = localStorage.getItem("user_id");
            if (!employeeId) {
                toast.error("Session expired", { description: "Please login again." });
                router.push("/login");
                return;
            }

            // Final Validation before submit
            if (!validateStep(4)) {
                setLoading(false);
                return;
            }

            // Validate dates
            if (!formData.dob || !formData.doj) {
                toast.error("Missing Information", { description: "Please select both Date of Birth and Date of Joining." });
                setLoading(false);
                return;
            }

            const fullName = `${formData.first_name || ""} ${formData.middle_name || ""} ${formData.last_name || ""}`.replace(/\s+/g, " ").trim();

            const { error: insertError } = await supabase
                .from('teacher_profiles')
                .insert([
                    {
                        employee_id: employeeId,
                        username: formData.username,
                        full_name: fullName,
                        first_name: formData.first_name,
                        middle_name: formData.middle_name || null,
                        last_name: formData.last_name,
                        program: formData.program,
                        dob: formData.dob,
                        doj: formData.doj,
                        dor: formData.dor,
                        gender: formData.gender,
                        qualification: formData.qualification,
                        experience_years: formData.teaching_experience_years, // Mapping teaching exp as main exp
                        teaching_experience_years: formData.teaching_experience_years,
                        post_mtech_experience: formData.post_mtech_experience,
                        post_teaching_experience: formData.post_teaching_experience,
                        bio: formData.bio,
                        phone: formData.phone,
                        email: formData.official_email, // Using official email as primary
                        official_email: formData.official_email,
                        personal_email: formData.personal_email,
                        skills: formData.skills,
                        designation: formData.designation,

                        blood_group: formData.blood_group,
                        aadhar_number: formData.aadhar_number,
                        pan_number: formData.pan_number,
                        apaar_id: formData.apaar_id,
                        communication_address: formData.communication_address,
                        permanent_address: formData.permanent_address,

                        // Default empty arrays for complex lists to avoid null issues
                        education: [],
                        publications: [],
                        memberships: [],
                        awards: [],
                        projects: []
                    }
                ]);

            if (insertError) throw insertError;

            toast.success("Profile Completed!", { description: "Redirecting to your profile..." });
            setTimeout(() => router.push("/profile"), 1500);

        } catch (err: any) {
            console.error("Onboarding error:", err);
            toast.error("Failed to save profile", { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#E0E5EC]">
            {/* Background from Login Page */}
            <AuthBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-3xl p-6"
            >
                <div className="rounded-[2.5rem] bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] overflow-hidden relative">
                    {/* Inner shine */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

                    {/* Header */}
                    <div className="p-8 border-b border-white/20 bg-white/10 relative z-10">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Complete Your Profile</h1>
                        <p className="text-slate-600 font-medium">Please provide your professional details to continue.</p>

                        {/* Progress Bar - Updated for 4 Steps */}
                        <div className="mt-6 h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(step / 4) * 100}%` }}
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6 relative z-10">

                        {/* STEP 1: Basic Identity & Personal */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Identity & Personal Details</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                                        <Input
                                            required
                                            placeholder="John"
                                            value={formData.first_name || ""}
                                            onChange={(e) => {
                                                setFormData({ ...formData, first_name: e.target.value });
                                                if (errors.first_name) setErrors({ ...errors, first_name: false });
                                            }}
                                            className={cn(
                                                "h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm",
                                                errors.first_name && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                                        <Input
                                            required
                                            placeholder="Doe"
                                            value={formData.last_name || ""}
                                            onChange={(e) => {
                                                setFormData({ ...formData, last_name: e.target.value });
                                                if (errors.last_name) setErrors({ ...errors, last_name: false });
                                            }}
                                            className={cn(
                                                "h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm",
                                                errors.last_name && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Middle Name (Optional)</label>
                                    <Input
                                        placeholder=""
                                        value={formData.middle_name || ""}
                                        onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                                        className="h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Unique Username</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
                                            <Input
                                                required
                                                placeholder="@username"
                                                value={formData.username}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, username: e.target.value });
                                                    if (errors.username) setErrors({ ...errors, username: false });
                                                }}
                                                className={cn(
                                                    "h-12 pl-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm",
                                                    errors.username && "border-red-500 focus:border-red-500 ring-red-500/20"
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Gender</label>
                                        <select
                                            required
                                            value={formData.gender}
                                            onChange={(e) => {
                                                setFormData({ ...formData, gender: e.target.value });
                                                if (errors.gender) setErrors({ ...errors, gender: false });
                                            }}
                                            className={cn(
                                                "w-full h-12 px-4 rounded-xl bg-white/20 border border-white/30 text-slate-800 focus:outline-none focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 appearance-none font-medium font-sans transition-all backdrop-blur-sm shadow-sm",
                                                errors.gender && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        >
                                            <option value="" disabled className="text-slate-500 font-sans">Select Gender</option>
                                            <option value="Male" className="text-slate-800 font-sans">Male</option>
                                            <option value="Female" className="text-slate-800 font-sans">Female</option>
                                            <option value="Other" className="text-slate-800 font-sans">Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Blood Group</label>
                                        <select
                                            value={formData.blood_group}
                                            onChange={(e) => {
                                                setFormData({ ...formData, blood_group: e.target.value });
                                                if (errors.blood_group) setErrors({ ...errors, blood_group: false });
                                            }}
                                            className={cn(
                                                "w-full h-12 px-4 rounded-xl bg-white/20 border border-white/30 text-slate-800 focus:outline-none focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 appearance-none font-medium font-sans transition-all backdrop-blur-sm shadow-sm",
                                                errors.blood_group && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        >
                                            <option value="" disabled className="text-slate-500 font-sans">Select Blood Group</option>
                                            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Other"].map(bg => (
                                                <option key={bg} value={bg} className="text-slate-800 font-sans">{bg}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Date of Birth</label>
                                        <DateSelector
                                            value={formData.dob}
                                            onChange={(date) => {
                                                setFormData({ ...formData, dob: date });
                                                if (date) setErrors({ ...errors, dob: false });
                                            }}
                                            minYear={1950}
                                            maxYear={new Date().getFullYear()}
                                            error={!!errors.dob}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Aadhar Number</label>
                                        <Input
                                            placeholder="XXXX XXXX XXXX"
                                            value={formData.aadhar_number}
                                            onChange={(e) => {
                                                setFormData({ ...formData, aadhar_number: e.target.value });
                                                if (errors.aadhar_number) setErrors({ ...errors, aadhar_number: false });
                                            }}
                                            className={cn(
                                                "h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm",
                                                errors.aadhar_number && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">PAN Number</label>
                                        <Input
                                            placeholder="ABCDE1234F"
                                            value={formData.pan_number}
                                            onChange={(e) => {
                                                setFormData({ ...formData, pan_number: e.target.value.toUpperCase() });
                                                if (errors.pan_number) setErrors({ ...errors, pan_number: false });
                                            }}
                                            className={cn(
                                                "h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm uppercase",
                                                errors.pan_number && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">APAAR ID</label>
                                        <Input
                                            placeholder="APAAR ID"
                                            value={formData.apaar_id}
                                            onChange={(e) => {
                                                setFormData({ ...formData, apaar_id: e.target.value });
                                                if (errors.apaar_id) setErrors({ ...errors, apaar_id: false });
                                            }}
                                            className={cn(
                                                "h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm",
                                                errors.apaar_id && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    onClick={() => handleNext(2)}
                                    className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600/90 hover:to-indigo-600/90 text-white font-bold text-lg backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all mt-4"
                                >
                                    Next: Contact & Address <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                        )}

                        {/* STEP 2: Contact & Address */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Contact Information</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Contact Number</label>
                                        <Input
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            required
                                            onChange={(e) => {
                                                setFormData({ ...formData, phone: e.target.value });
                                                if (errors.phone) setErrors({ ...errors, phone: false });
                                            }}
                                            className={cn(
                                                "h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm",
                                                errors.phone && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Official Email</label>
                                        <Input
                                            type="email"
                                            required
                                            placeholder="official@institute.edu"
                                            value={formData.official_email}
                                            onChange={(e) => {
                                                setFormData({ ...formData, official_email: e.target.value });
                                                if (errors.official_email) setErrors({ ...errors, official_email: false });
                                            }}
                                            className={cn(
                                                "h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm",
                                                errors.official_email && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Personal Email</label>
                                        <Input
                                            type="email"
                                            placeholder="personal@gmail.com"
                                            value={formData.personal_email}
                                            onChange={(e) => {
                                                setFormData({ ...formData, personal_email: e.target.value });
                                                if (errors.personal_email) setErrors({ ...errors, personal_email: false });
                                            }}
                                            className={cn(
                                                "h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm",
                                                errors.personal_email && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Communication Address</label>
                                    <textarea
                                        className={cn(
                                            "w-full h-20 p-4 rounded-xl bg-white/20 border border-white/30 text-slate-800 focus:outline-none focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm",
                                            errors.communication_address && "border-red-500 focus:border-red-500 ring-red-500/20"
                                        )}
                                        value={formData.communication_address}
                                        onChange={(e) => {
                                            setFormData({ ...formData, communication_address: e.target.value });
                                            if (errors.communication_address) setErrors({ ...errors, communication_address: false });
                                        }}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Permanent Address</label>
                                    <textarea
                                        className={cn(
                                            "w-full h-20 p-4 rounded-xl bg-white/20 border border-white/30 text-slate-800 focus:outline-none focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm",
                                            errors.permanent_address && "border-red-500 focus:border-red-500 ring-red-500/20"
                                        )}
                                        value={formData.permanent_address}
                                        onChange={(e) => {
                                            setFormData({ ...formData, permanent_address: e.target.value });
                                            if (errors.permanent_address) setErrors({ ...errors, permanent_address: false });
                                        }}
                                    />
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1 h-14 rounded-xl font-bold text-slate-900 bg-white/20 hover:bg-white/40 hover:text-black border border-white/20 backdrop-blur-md shadow-sm transition-all text-lg">Back</Button>
                                    <Button type="button" onClick={() => handleNext(3)} className="flex-[2] h-14 rounded-xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600/90 hover:to-indigo-600/90 text-white font-bold backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all">Next: Professional Details</Button>
                                </div>
                            </motion.div>
                        )}


                        {/* STEP 3: Professional Info */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Professional Information</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Program / Department</label>
                                        <select
                                            required
                                            value={formData.program}
                                            onChange={(e) => {
                                                setFormData({ ...formData, program: e.target.value });
                                                if (errors.program) setErrors({ ...errors, program: false });
                                            }}
                                            className={cn(
                                                "w-full h-12 px-4 rounded-xl bg-white/20 border border-white/30 text-slate-800 focus:outline-none focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 appearance-none font-medium font-sans transition-all backdrop-blur-sm shadow-sm",
                                                errors.program && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        >
                                            <option value="" disabled className="text-slate-500 font-sans">Select Program</option>
                                            {programs.map(p => (
                                                <option key={p} value={p} className="text-slate-800 font-sans">{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Designation</label>
                                        <select
                                            required
                                            value={formData.designation}
                                            onChange={(e) => {
                                                setFormData({ ...formData, designation: e.target.value });
                                                if (errors.designation) setErrors({ ...errors, designation: false });
                                            }}
                                            className={cn(
                                                "w-full h-12 px-4 rounded-xl bg-white/20 border border-white/30 text-slate-800 focus:outline-none focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 appearance-none font-medium font-sans transition-all backdrop-blur-sm shadow-sm",
                                                errors.designation && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        >
                                            <option value="" disabled className="text-slate-500 font-sans">Select Designation</option>
                                            {designations.map(d => (
                                                <option key={d} value={d} className="text-slate-800 font-sans">{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Highest Qualification</label>
                                        <select
                                            required
                                            value={formData.qualification}
                                            onChange={(e) => {
                                                setFormData({ ...formData, qualification: e.target.value });
                                                if (errors.qualification) setErrors({ ...errors, qualification: false });
                                            }}
                                            className={cn(
                                                "w-full h-12 px-4 rounded-xl bg-white/20 border border-white/30 text-slate-800 focus:outline-none focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 appearance-none font-medium font-sans transition-all backdrop-blur-sm shadow-sm",
                                                errors.qualification && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        >
                                            <option value="" disabled className="text-slate-500 font-sans">Select Qualification</option>
                                            <option value="PhD" className="text-slate-800 font-sans">PhD</option>
                                            <option value="M.Tech" className="text-slate-800 font-sans">M.Tech</option>
                                            <option value="Other" className="text-slate-800 font-sans">Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Date of Joining</label>
                                        <DateSelector
                                            value={formData.doj}
                                            onChange={(date) => {
                                                setFormData({ ...formData, doj: date });
                                                if (date) setErrors({ ...errors, doj: false });
                                            }}
                                            minYear={1980}
                                            maxYear={2030}
                                            error={!!errors.doj}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Date of Retirement</label>
                                        <DateSelector
                                            value={formData.dor}
                                            onChange={(date) => {
                                                setFormData({ ...formData, dor: date });
                                                if (date) setErrors({ ...errors, dor: false });
                                            }}
                                            minYear={2020}
                                            maxYear={2060}
                                            error={!!errors.dor}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Teaching Exp (Years)</label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 5"
                                            value={formData.teaching_experience_years}
                                            onChange={(e) => {
                                                setFormData({ ...formData, teaching_experience_years: e.target.value, experience: e.target.value });
                                                if (errors.teaching_experience_years) setErrors({ ...errors, teaching_experience_years: false });
                                            }}
                                            className={cn(
                                                "h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm",
                                                errors.teaching_experience_years && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Post M.Tech Exp</label>
                                        <select
                                            value={formData.post_mtech_experience}
                                            onChange={(e) => {
                                                setFormData({ ...formData, post_mtech_experience: e.target.value });
                                                if (errors.post_mtech_experience) setErrors({ ...errors, post_mtech_experience: false });
                                            }}
                                            className={cn(
                                                "w-full h-12 px-4 rounded-xl bg-white/20 border border-white/30 text-slate-800 focus:outline-none focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 appearance-none font-medium font-sans transition-all backdrop-blur-sm shadow-sm",
                                                errors.post_mtech_experience && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        >
                                            <option value="" className="text-slate-500 font-sans">Select...</option>
                                            <option value="< 1 year" className="text-slate-800 font-sans">&lt; 1 year</option>
                                            <option value="1-3 years" className="text-slate-800 font-sans">1-3 years</option>
                                            <option value="3-5 years" className="text-slate-800 font-sans">3-5 years</option>
                                            <option value="5+ years" className="text-slate-800 font-sans">5+ years</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Post Teaching Exp</label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 2"
                                            value={formData.post_teaching_experience}
                                            onChange={(e) => {
                                                setFormData({ ...formData, post_teaching_experience: e.target.value });
                                                if (errors.post_teaching_experience) setErrors({ ...errors, post_teaching_experience: false });
                                            }}
                                            className={cn(
                                                "h-12 rounded-xl bg-white/20 border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm",
                                                errors.post_teaching_experience && "border-red-500 focus:border-red-500 ring-red-500/20"
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <Button type="button" variant="ghost" onClick={() => setStep(2)} className="flex-1 h-14 rounded-xl font-bold text-slate-900 bg-white/20 hover:bg-white/40 hover:text-black border border-white/20 backdrop-blur-md shadow-sm transition-all text-lg">Back</Button>
                                    <Button type="button" onClick={() => handleNext(4)} className="flex-[2] h-14 rounded-xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600/90 hover:to-indigo-600/90 text-white font-bold backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all">Next: Bio & Philosophy</Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: Bio & Finish */}
                        {step === 4 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Final Touches</h3>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Bio / About Me</label>
                                    <textarea
                                        placeholder="Tell us a bit about yourself..."
                                        value={formData.bio}
                                        onChange={(e) => {
                                            setFormData({ ...formData, bio: e.target.value });
                                            if (errors.bio) setErrors({ ...errors, bio: false });
                                        }}
                                        className={cn(
                                            "w-full h-24 p-4 rounded-xl bg-white/20 border border-white/30 text-slate-800 placeholder:text-slate-500 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none backdrop-blur-sm shadow-sm",
                                            errors.bio && "border-red-500 focus:border-red-500 ring-red-500/20"
                                        )}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Skills (Comma Separated)</label>
                                    <textarea
                                        placeholder="React, Python, Machine Learning..."
                                        value={formData.skills}
                                        onChange={(e) => {
                                            setFormData({ ...formData, skills: e.target.value });
                                            if (errors.skills) setErrors({ ...errors, skills: false });
                                        }}
                                        className={cn(
                                            "w-full h-20 p-4 rounded-xl bg-white/20 border border-white/30 text-slate-800 focus:bg-white/40 font-medium resize-none backdrop-blur-sm shadow-sm placeholder:text-slate-500",
                                            errors.skills && "border-red-500 focus:border-red-500 ring-red-500/20"
                                        )}
                                    />
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setStep(3)}
                                        className="flex-1 h-14 rounded-xl font-bold text-slate-900 bg-white/20 hover:bg-white/40 hover:text-black border border-white/20 backdrop-blur-md shadow-sm transition-all text-lg"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] h-14 rounded-xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600/90 hover:to-indigo-600/90 text-white font-bold backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all"
                                    >
                                        {loading ? "Creating Profile..." : "Complete Setup"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>
            </motion.div >

            {/* Full Screen Loader Overlay */}
            {
                loading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                        <div className="scale-75">
                            <Loader />
                        </div>
                    </div>
                )
            }
        </div >
    );
}
