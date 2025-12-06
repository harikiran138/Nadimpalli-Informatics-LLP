"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, User, Activity, Shield, LogOut, Search, Plus, Save, X, Trash2, Edit2, CheckCircle, AlertCircle, Eye, FileText, Phone, Mail, Briefcase, GraduationCap, Award, Calendar, BookOpen, LayoutGrid, List, MapPin, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types/profile";


const supabase = createClient();


interface Employee {
    id: string;
    employee_id: string;
    full_name: string;
    password_hash: string;
    created_at: string;
    profile?: UserProfile; // Joined profile data
}

export default function AdminDashboard() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"dashboard" | "employees">("dashboard");

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Employee>>({});

    // View Details State
    const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

    // Create State
    const [showCreate, setShowCreate] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        fullName: "",
        employeeId: "",
        password: "",
        isAdmin: false
    });

    // Fetch Data
    const fetchData = useCallback(async () => {
        try {
            // 1. Fetch Basic Employees
            const { data: emps, error: empError } = await supabase
                .from('employees')
                .select('*')
                .order('created_at', { ascending: false });

            if (empError) throw empError;

            // 2. Fetch Detailed Profiles
            const { data: profiles, error: profError } = await supabase
                .from('teacher_profiles')
                .select('*');

            if (profError) throw profError;

            // 3. Fetch Admins
            const { data: adms, error: admError } = await supabase
                .from('admins')
                .select('employee_id');

            if (admError) throw admError;

            // 4. Merge Data
            const mergedEmployees = emps?.map(emp => ({
                ...emp,
                profile: profiles?.find(p => p.employee_id === emp.employee_id)
            })) || [];

            setEmployees(mergedEmployees);
            setAdminIds(new Set(adms?.map(a => a.employee_id) || []));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Fetch & Subscription
    useEffect(() => {
        fetchData();

        const empChannel = supabase
            .channel('public:employees')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, (payload) => {
                // Handle Real-time events
                if (payload.eventType === 'INSERT') {
                    fetchData(); // Simplest way to get the merged data is to refetch
                } else if (payload.eventType === 'DELETE') {
                    // Real-time remove
                    setEmployees(prev => prev.filter(e => e.id !== payload.old.id));
                } else if (payload.eventType === 'UPDATE') {
                    fetchData();
                }
            })
            .subscribe();

        const profileChannel = supabase
            .channel('public:teacher_profiles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'teacher_profiles' }, fetchData)
            .subscribe();

        const admChannel = supabase
            .channel('public:admins')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'admins' }, fetchData)
            .subscribe();

        return () => {
            supabase.removeChannel(empChannel);
            supabase.removeChannel(profileChannel);
            supabase.removeChannel(admChannel);
        };
    }, [fetchData]);

    // Handlers
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 0. Check for duplicate ID
            const { data: existing } = await supabase
                .from('employees')
                .select('id')
                .eq('employee_id', newEmployee.employeeId)
                .maybeSingle();

            if (existing) {
                alert("Error: Employee ID '" + newEmployee.employeeId + "' already exists.");
                return;
            }

            const { error: empError } = await supabase.from('employees').insert([{
                full_name: newEmployee.fullName,
                employee_id: newEmployee.employeeId,
                password_hash: newEmployee.password
            }]);
            if (empError) throw empError;

            // Also create a skeleton profile entry with defaults
            await supabase.from('teacher_profiles').insert([{
                employee_id: newEmployee.employeeId,
                email: newEmployee.employeeId + "@example.com", // Placeholder
                full_name: newEmployee.fullName,
                designation: 'Staff',
                program: 'General',
                username: newEmployee.employeeId, // Required field
                dob: '1900-01-01', // Placeholder
                doj: new Date().toISOString().split('T')[0], // Today's date
                address: 'N/A', // Placeholder
                gender: 'Not Specified', // Placeholder
                skills: '', // Placeholder
                qualification: 'N/A', // Placeholder
                experience_years: '0' // Placeholder
            }]);

            if (newEmployee.isAdmin) {
                await supabase.from('admins').insert([{ employee_id: newEmployee.employeeId }]);
            }

            setNewEmployee({ fullName: "", employeeId: "", password: "", isAdmin: false });
            setShowCreate(false);
            // Switch to employees tab to see new addition
            setActiveTab("employees");
            // Force fetch to ensure UI is in sync
            fetchData();
        } catch (error: any) {
            console.error("Creation error:", error);
            if (error.code === '23505') { // Postgres unique constraint error code
                alert("Error: This Employee ID is already registered.");
            } else {
                alert("Error creating employee: " + error.message);
            }
        }
    };

    const handleUpdate = async (id: string) => {
        try {
            const { error } = await supabase
                .from('employees')
                .update({
                    full_name: editForm.full_name,
                    employee_id: editForm.employee_id
                })
                .eq('id', id);

            if (error) throw error;
            setEditingId(null);
        } catch (error: any) {
            alert("Error updating: " + error.message);
        }
    };

    const handleDelete = async (id: string, employeeId: string) => {
        if (!confirm("Are you sure? This action cannot be undone and will delete all profile data.")) return;

        // OPTIMISTIC UPDATE: Remove immediately from UI
        setEmployees(prev => prev.filter(e => e.id !== id));

        try {
            // 1. Delete Profile Data FIRST
            await supabase.from('teacher_profiles').delete().eq('employee_id', employeeId);

            // 2. Delete Admin Status
            await supabase.from('admins').delete().eq('employee_id', employeeId);

            // 3. Delete User Account
            const { error: empError } = await supabase.from('employees').delete().eq('id', id);

            if (empError) {
                // Revert optimistic update if failed (optional, but good practice)
                throw empError;
            }

        } catch (error: any) {
            alert("Error deleting: " + error.message);
            fetchData(); // Re-fetch to restore state if error occurred
        }
    };

    const filteredEmployees = employees.filter(e =>
        e.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <div className="flex h-screen overflow-hidden font-sans relative text-slate-800">

            {/* 3D Floating Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{ rotate: 360, y: [0, -20, 0] }}
                    transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                    className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full border-[40px] border-white/40 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] opacity-40"
                />
                <motion.div
                    animate={{ y: [0, 30, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[10%] w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 shadow-[10px_10px_30px_#bebebe,-10px_-10px_30px_#ffffff] opacity-60"
                />
                <motion.div
                    animate={{ rotate: -360, x: [0, 20, 0] }}
                    transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, x: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
                    className="absolute bottom-[-5%] left-[-5%] w-80 h-80 rounded-full border-[30px] border-white/30 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] opacity-30"
                />
            </div>

            {/* Sidebar - Matching Profile Page */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-80 hidden lg:flex flex-col m-4 rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border border-white/50 shadow-xl overflow-y-auto custom-scrollbar z-20"
            >
                <div className="p-8 text-center border-b border-white/20">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-white p-1 shadow-lg mb-4 relative flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-slate-200/50 flex items-center justify-center text-blue-600">
                            <Shield className="w-12 h-12" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">Admin<span className="text-blue-600">Panel</span></h2>
                    <p className="text-sm text-slate-500 font-bold mt-1">Management System</p>
                    <p className="text-xs text-blue-500 font-medium">Administrator Access</p>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("dashboard")}
                        className={`w-full justify-start h-14 rounded-2xl font-bold transition-all ${activeTab === "dashboard" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-slate-600 hover:bg-white/40"}`}
                    >
                        <Activity className={`w-5 h-5 mr-3 ${activeTab === "dashboard" ? "text-white" : "text-slate-400"}`} />
                        Live Dashboard
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("employees")}
                        className={`w-full justify-start h-14 rounded-2xl font-bold transition-all ${activeTab === "employees" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-slate-600 hover:bg-white/40"}`}
                    >
                        <Users className={`w-5 h-5 mr-3 ${activeTab === "employees" ? "text-white" : "text-slate-400"}`} />
                        Employees
                    </Button>
                </nav>

                <div className="p-6">
                    <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start h-14 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 font-bold">
                            <LogOut className="w-5 h-5 mr-3" /> Logout
                        </Button>
                    </Link>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 p-4 lg:pl-0">
                {/* Header - Matching Profile Page */}
                <header className="h-20 px-8 mb-4 rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border border-white/50 shadow-sm flex items-center justify-between shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {activeTab === "dashboard" ? "Dashboard Overview" : "Employee Database"}
                        </h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            System Online
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group/search hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 w-64 rounded-xl bg-white/50 border-white/60 focus:bg-white/90 shadow-sm transition-all"
                            />
                        </div>
                        <Button
                            onClick={() => setShowCreate(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 font-bold px-6"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add New
                        </Button>
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
                    {/* Create Form (Always visible if toggled) */}
                    <AnimatePresence>
                        {showCreate && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mb-6"
                            >
                                <div className="bg-white/40 border border-white/50 rounded-[2rem] p-8 backdrop-blur-2xl shadow-sm relative overflow-hidden">
                                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-blue-500" /> New Employee Registration</h3>
                                    <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                                <Input
                                                    placeholder="e.g. John Doe"
                                                    value={newEmployee.fullName}
                                                    onChange={e => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
                                                    className="h-10 rounded-xl bg-white/90 border-white/60"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Employee ID</label>
                                                <Input
                                                    placeholder="e.g. EMP001"
                                                    value={newEmployee.employeeId}
                                                    onChange={e => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
                                                    className="h-10 rounded-xl bg-white/90 border-white/60"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={newEmployee.password}
                                                    onChange={e => setNewEmployee({ ...newEmployee, password: e.target.value })}
                                                    className="h-10 rounded-xl bg-white/90 border-white/60"
                                                    required
                                                />
                                            </div>
                                            <div className="pt-6">
                                                <label className="flex items-center gap-4 p-3 rounded-xl bg-white/50 border border-white/60 cursor-pointer hover:bg-white/80 transition-all">
                                                    <input
                                                        type="checkbox"
                                                        checked={newEmployee.isAdmin}
                                                        onChange={e => setNewEmployee({ ...newEmployee, isAdmin: e.target.checked })}
                                                        className="w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm font-bold text-slate-700">Grant Admin Privileges</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                            <Button type="button" variant="ghost" onClick={() => setShowCreate(false)} className="rounded-xl text-red-500 hover:bg-red-50 font-bold">Cancel</Button>
                                            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20">Create Account</Button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {activeTab === "dashboard" ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard
                                    title="Total Employees"
                                    value={employees.length}
                                    icon={<Users className="w-5 h-5 text-blue-600" />}
                                    color="text-blue-600"
                                    delay={0}
                                />
                                <StatCard
                                    title="Administrators"
                                    value={adminIds.size}
                                    icon={<Shield className="w-5 h-5 text-purple-600" />}
                                    color="text-purple-600"
                                    delay={0.1}
                                />
                                <StatCard
                                    title="System Status"
                                    value="Active"
                                    icon={<Activity className="w-5 h-5 text-emerald-600" />}
                                    color="text-emerald-600"
                                    delay={0.2}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredEmployees.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12 bg-white/40 rounded-[2rem] border border-white/50">
                                    <div className="p-4 bg-white/50 rounded-full mb-4 shadow-sm">
                                        <Search className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">No employees found</h3>
                                    <p className="text-slate-500 font-medium">Try adjusting your search.</p>
                                </div>
                            ) : (
                                <div className="pb-20">
                                    {/* Profile-Style Table Container */}
                                    <div className="bg-white/40 backdrop-blur-2xl border border-white/50 shadow-sm rounded-[2rem] overflow-hidden flex flex-col relative z-20">

                                        {/* Table Header */}
                                        <div className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-white/30 bg-white/20 text-xs font-bold uppercase tracking-widest text-slate-500">
                                            <div className="col-span-4 pl-2">Employee</div>
                                            <div className="col-span-2">ID</div>
                                            <div className="col-span-3">Designation</div>
                                            <div className="col-span-2">Contact</div>
                                            <div className="col-span-1 text-right">Action</div>
                                        </div>

                                        {/* Table Body */}
                                        <div className="divide-y divide-white/30">
                                            {filteredEmployees.map((emp, index) => (
                                                <motion.div
                                                    key={emp.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: index * 0.02 }}
                                                    className="grid grid-cols-12 gap-4 px-8 py-5 hover:bg-white/40 transition-colors duration-200 group items-center"
                                                >
                                                    {/* Avatar & Name */}
                                                    <div className="col-span-4 flex items-center gap-4">
                                                        <div className="relative shrink-0">
                                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-sm font-bold text-slate-700">
                                                                {emp.full_name.charAt(0)}
                                                            </div>
                                                            {adminIds.has(emp.employee_id) && (
                                                                <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white border border-white rounded-full p-0.5 shadow-sm">
                                                                    <Shield className="w-2 h-2" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="text-sm font-bold text-slate-800 truncate">{emp.full_name}</h3>
                                                            {adminIds.has(emp.employee_id) && (
                                                                <span className="text-[10px] font-bold text-purple-600 block leading-tight">Admin</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* ID */}
                                                    <div className="col-span-2">
                                                        <span className="font-mono text-xs font-bold text-slate-500">
                                                            {emp.employee_id}
                                                        </span>
                                                    </div>

                                                    {/* Designation */}
                                                    <div className="col-span-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-slate-700 truncate">{emp.profile?.designation || "-"}</span>
                                                            <span className="text-[10px] font-medium text-slate-500 truncate mt-0.5">
                                                                {emp.profile?.program || "General"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Contact */}
                                                    <div className="col-span-2">
                                                        <div className="flex flex-col gap-1">
                                                            {(emp.profile?.email) ? (
                                                                <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate group/link">
                                                                    <Mail className="w-3 h-3 text-slate-400" />
                                                                    <span className="truncate max-w-[140px] opacity-80 group-hover:opacity-100 transition-opacity">{emp.profile.email}</span>
                                                                </div>
                                                            ) : <span className="text-[10px] text-slate-400 italic">No Email</span>}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="col-span-1 flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => setViewingEmployee(emp)}
                                                            className="h-8 w-8 rounded-lg hover:bg-white text-slate-500 hover:text-blue-600 transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleDelete(emp.id, emp.employee_id)}
                                                            className="h-8 w-8 rounded-lg hover:bg-white text-slate-500 hover:text-red-500 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </main>

            {/* View Full Profile Modal */}
            <AnimatePresence>
                {viewingEmployee && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
                        onClick={() => setViewingEmployee(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-4xl bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[85vh] relative"
                        >
                            {/* Modal Header */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-600 to-purple-600 opacity-10 z-0" />
                            <div className="relative z-10 px-8 py-6 flex justify-between items-start">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center text-3xl font-black text-slate-700 border-4 border-white transform rotate-3">
                                        {viewingEmployee.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">{viewingEmployee.full_name}</h2>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
                                                {viewingEmployee.profile?.designation || "Staff"}
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-slate-100/80 text-slate-600 text-xs font-bold uppercase tracking-wider border border-slate-200">
                                                {viewingEmployee.profile?.program || "General"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setViewingEmployee(null)}
                                    className="rounded-full bg-white/50 hover:bg-white text-slate-500 hover:text-red-500 transition-all shadow-sm"
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            {/* Modal Content - Tabbed View */}
                            <TabsContent viewingEmployee={viewingEmployee} />

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TabsContent({ viewingEmployee }: { viewingEmployee: Employee }) {
    const [activeTab, setActiveTab] = useState<"identity" | "academic" | "research" | "skills" | "memberships" | "student">("identity");

    const tabs = [
        { id: "identity", label: "Identity & Bio", icon: <User className="w-4 h-4" /> },
        { id: "academic", label: "Academic Info", icon: <GraduationCap className="w-4 h-4" /> },
        { id: "research", label: "Research & Projects", icon: <BookOpen className="w-4 h-4" /> },
        { id: "skills", label: "Skills & Expertise", icon: <Activity className="w-4 h-4" /> },
        { id: "memberships", label: "Memberships & Awards", icon: <Award className="w-4 h-4" /> },
        { id: "student", label: "Student Corner", icon: <Users className="w-4 h-4" /> },
    ];

    return (
        <div className="flex-1 flex flex-col min-h-0 relative z-10">
            {/* Tab Navigation */}
            <div className="px-8 border-b border-slate-200/60 flex items-center gap-1 overflow-x-auto custom-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab.id ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        {tab.icon}
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white/30">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8"
                    >
                        {activeTab === "identity" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 shadow-sm">
                                        <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4">Professional Bio</h3>
                                        <p className="text-slate-700 leading-relaxed font-medium">
                                            {viewingEmployee.profile?.bio || "No biography available."}
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-white/60 border border-white shadow-sm space-y-4">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Personal Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InfoRow label="First Name" value={viewingEmployee.profile?.first_name} />
                                            <InfoRow label="Middle Name" value={viewingEmployee.profile?.middle_name} />
                                            <InfoRow label="Last Name" value={viewingEmployee.profile?.last_name} />
                                            <InfoRow label="Gender" value={viewingEmployee.profile?.gender} />
                                            <InfoRow label="DOB" value={viewingEmployee.profile?.dob} />
                                            <InfoRow label="Blood Group" value={viewingEmployee.profile?.blood_group} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-6 rounded-[2rem] bg-white border border-white shadow-sm space-y-4">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Contact Information</h3>
                                        <InfoRow label="Phone" value={viewingEmployee.profile?.phone} icon={<Phone className="w-4 h-4 text-emerald-500" />} />
                                        <InfoRow label="Office Email" value={viewingEmployee.profile?.official_email} icon={<Mail className="w-4 h-4 text-indigo-500" />} />
                                        <InfoRow label="Personal Email" value={viewingEmployee.profile?.personal_email} icon={<Mail className="w-4 h-4 text-sky-500" />} />
                                        <InfoRow label="Legacy Email" value={viewingEmployee.profile?.email} icon={<Mail className="w-4 h-4 text-slate-500" />} />
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-white border border-white shadow-sm space-y-4">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Government IDs</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            <InfoRow label="Aadhar Number" value={viewingEmployee.profile?.aadhar_number} icon={<Shield className="w-4 h-4 text-orange-500" />} />
                                            <InfoRow label="PAN Number" value={viewingEmployee.profile?.pan_number} icon={<CreditCard className="w-4 h-4 text-blue-500" />} />
                                            <InfoRow label="APAAR ID" value={viewingEmployee.profile?.apaar_id} icon={<FileText className="w-4 h-4 text-purple-500" />} />
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-white border border-white shadow-sm space-y-4">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Addresses</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Communication Address</p>
                                                <p className="text-sm font-medium text-slate-700">{viewingEmployee.profile?.communication_address || viewingEmployee.profile?.address || "N/A"}</p>
                                            </div>
                                            <div className="h-px bg-slate-100" />
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Permanent Address</p>
                                                <p className="text-sm font-medium text-slate-700">{viewingEmployee.profile?.permanent_address || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "academic" && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-[2rem] bg-white border border-white shadow-sm">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Core Info</h3>
                                        <div className="space-y-3">
                                            <InfoRow label="Designation" value={viewingEmployee.profile?.designation} />
                                            <InfoRow label="Department/Program" value={viewingEmployee.profile?.program} />
                                            <InfoRow label="Date of Joining" value={viewingEmployee.profile?.doj} />
                                            <InfoRow label="Date of Retirement" value={viewingEmployee.profile?.dor} />
                                            <InfoRow label="Office Room" value={viewingEmployee.profile?.office_room} />
                                            <InfoRow label="Availability" value={viewingEmployee.profile?.availability} />
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-blue-50/50 border border-blue-100 shadow-sm">
                                        <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-4">Teaching Philosophy</h3>
                                        <p className="text-slate-700 italic font-medium">"{viewingEmployee.profile?.teaching_philosophy || "No philosophy statement."}"</p>
                                    </div>
                                </div>

                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 mb-4">
                                        <GraduationCap className="w-5 h-5 text-blue-500" /> Education History
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {viewingEmployee.profile?.education?.length ? (
                                            viewingEmployee.profile.education.map((edu, i) => (
                                                <div key={i} className="p-5 rounded-2xl bg-white/50 border border-white hover:bg-white transition-colors shadow-sm">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">{edu.degree}</h4>
                                                            <p className="text-sm text-slate-600 font-medium">{edu.institution}</p>
                                                            {edu.specialization && <p className="text-xs text-slate-500 mt-1">Spec: {edu.specialization}</p>}
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold block mb-1">{edu.year}</span>
                                                            {edu.grade && <span className="text-xs font-bold text-emerald-600">Grade: {edu.grade}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : <div className="text-slate-400 italic px-4">No education records.</div>}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 mb-4">
                                        <Briefcase className="w-5 h-5 text-emerald-500" /> Professional Experience
                                    </h3>
                                    <div className="space-y-4">
                                        {viewingEmployee.profile?.experience_teaching?.length ? (
                                            viewingEmployee.profile.experience_teaching.map((exp, i) => (
                                                <div key={i} className="p-5 rounded-2xl bg-white/50 border border-white hover:bg-white transition-colors shadow-sm">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">{exp.role}</h4>
                                                            <p className="text-sm text-slate-600 font-medium">{exp.institution}</p>
                                                            {exp.responsibilities && <p className="text-xs text-slate-500 mt-2 max-w-xl">{exp.responsibilities}</p>}
                                                        </div>
                                                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold whitespace-nowrap">{exp.duration}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : <div className="text-slate-400 italic px-4">No teaching experience records.</div>}
                                    </div>
                                </section>
                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 mb-4">
                                        <Shield className="w-5 h-5 text-purple-500" /> Component Authority / Admin Experience
                                    </h3>
                                    <div className="space-y-4">
                                        {viewingEmployee.profile?.experience_admin?.length ? (
                                            viewingEmployee.profile.experience_admin.map((exp, i) => (
                                                <div key={i} className="p-5 rounded-2xl bg-white/50 border border-white hover:bg-white transition-colors shadow-sm">
                                                    <h4 className="font-bold text-slate-800">{exp.role}</h4>
                                                    <p className="text-sm text-slate-600 font-medium mt-1">{exp.description}</p>
                                                </div>
                                            ))
                                        ) : <div className="text-slate-400 italic px-4">No administrative experience records.</div>}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === "research" && (
                            <div className="space-y-8">
                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 mb-4">
                                        <BookOpen className="w-5 h-5 text-purple-500" /> Publications
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {viewingEmployee.profile?.publications?.length ? (
                                            viewingEmployee.profile.publications.map((pub, i) => (
                                                <div key={i} className="p-5 rounded-2xl bg-white/50 border border-white hover:bg-white transition-colors shadow-sm">
                                                    <div className="flex gap-4">
                                                        <span className="text-2xl opacity-20 font-black text-slate-400">{(i + 1).toString().padStart(2, '0')}</span>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-slate-800 leading-snug">{pub.title}</h4>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded">{pub.journal_name}</span>
                                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded">{pub.year_of_publication}</span>
                                                                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded">{pub.indexing}</span>
                                                                <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase rounded">{pub.quartile}</span>
                                                            </div>
                                                            {pub.doi_link && <a href={pub.doi_link} target="_blank" className="text-xs text-blue-500 hover:underline mt-2 inline-block">DOI Link</a>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : <div className="text-slate-400 italic px-4">No publications listed.</div>}
                                    </div>
                                </section>
                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 mb-4">
                                        <LayoutGrid className="w-5 h-5 text-indigo-500" /> Research Projects
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {viewingEmployee.profile?.projects?.length ? (
                                            viewingEmployee.profile.projects.map((proj, i) => (
                                                <div key={i} className="p-5 rounded-2xl bg-white/50 border border-white hover:bg-white transition-colors shadow-sm">
                                                    <h4 className="font-bold text-slate-800">{proj.title}</h4>
                                                    <p className="text-sm text-slate-600 mt-2">{proj.summary}</p>
                                                    <div className="mt-3 flex gap-2">
                                                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded">{proj.year}</span>
                                                        {proj.amount && <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded">{proj.amount}</span>}
                                                        {proj.agency && <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded">{proj.agency}</span>}
                                                        {proj.outcome && <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded">{proj.outcome}</span>}
                                                    </div>
                                                </div>
                                            ))
                                        ) : <div className="text-slate-400 italic px-4">No projects listed.</div>}
                                    </div>
                                </section>
                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 mb-4">
                                        <Calendar className="w-5 h-5 text-pink-500" /> Events (Attended/Organized)
                                    </h3>
                                    <div className="space-y-4">
                                        {viewingEmployee.profile?.events?.length ? (
                                            viewingEmployee.profile.events.map((evt, i) => (
                                                <div key={i} className="p-4 rounded-xl bg-pink-50/30 border border-pink-100 flex justify-between items-center">
                                                    <div>
                                                        <span className="font-bold text-slate-800 text-sm block">{evt.title}</span>
                                                        <span className="text-xs text-slate-500">{evt.location}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs font-bold text-pink-600 bg-white px-2 py-1 rounded shadow-sm block mb-1">{evt.type}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium">{evt.date}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : <div className="text-slate-400 italic px-4">No events listed.</div>}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === "skills" && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-[2rem] bg-emerald-50/50 border border-emerald-100 shadow-sm">
                                        <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest mb-3">Technical Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingEmployee.profile?.skills ? viewingEmployee.profile.skills.split(',').map((skill, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-white rounded-xl text-xs font-bold text-slate-600 border border-emerald-100 shadow-sm">
                                                    {skill.trim()}
                                                </span>
                                            )) : <span className="text-slate-400 italic text-sm">No skills added</span>}
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-sky-50/50 border border-sky-100 shadow-sm">
                                        <h3 className="text-sm font-black text-sky-500 uppercase tracking-widest mb-3">Subjects Taught</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingEmployee.profile?.subjects?.length ? viewingEmployee.profile.subjects.map((sub, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-white rounded-xl text-xs font-bold text-slate-600 border border-sky-100 shadow-sm">
                                                    {sub}
                                                </span>
                                            )) : <span className="text-slate-400 italic text-sm">No subjects listed</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-white border border-white shadow-sm">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Experience Overview</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                            <div className="text-2xl font-black text-slate-800">{viewingEmployee.profile?.experience_years || 0}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Years</div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                            <div className="text-2xl font-black text-slate-800">{viewingEmployee.profile?.teaching_experience_years || 0}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Teaching</div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                            <div className="text-2xl font-black text-slate-800">{viewingEmployee.profile?.post_mtech_experience || 0}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Post M.Tech</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "memberships" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 mb-4">
                                        <Award className="w-5 h-5 text-amber-500" /> Awards & Recognitions
                                    </h3>
                                    <div className="space-y-3">
                                        {viewingEmployee.profile?.awards?.length ? (
                                            viewingEmployee.profile.awards.map((award, i) => (
                                                <div key={i} className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 flex justify-between items-center hover:bg-amber-50 transition-colors">
                                                    <div>
                                                        <span className="font-bold text-slate-800 text-sm block">{award.title}</span>
                                                        <span className="text-xs text-slate-500 font-medium">{award.issuer}</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-amber-600 bg-white px-3 py-1 rounded-lg shadow-sm">{award.year}</span>
                                                </div>
                                            ))
                                        ) : <div className="text-slate-400 italic px-4">No awards listed.</div>}
                                    </div>
                                </section>
                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 mb-4">
                                        <Users className="w-5 h-5 text-cyan-500" /> Professional Memberships
                                    </h3>
                                    <div className="space-y-3">
                                        {viewingEmployee.profile?.memberships?.length ? (
                                            viewingEmployee.profile.memberships.map((mem, i) => (
                                                <div key={i} className="p-5 rounded-2xl bg-cyan-50/50 border border-cyan-100 flex justify-between items-center hover:bg-cyan-50 transition-colors">
                                                    <div>
                                                        <span className="font-bold text-slate-800 text-sm block">{mem.organization}</span>
                                                        <span className="text-xs text-slate-500 font-medium">{mem.type}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        {mem.id && <span className="text-[10px] text-slate-400 block mb-1">ID: {mem.id}</span>}
                                                        <span className="text-xs font-bold text-cyan-600 bg-white px-3 py-1 rounded-lg shadow-sm">{mem.year}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : <div className="text-slate-400 italic px-4">No memberships listed.</div>}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === "student" && (
                            <div className="space-y-8">
                                <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                    <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 mb-6 relative z-10">
                                        <Users className="w-5 h-5 text-indigo-600" /> Student Interactions
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                        <div className="p-5 bg-white rounded-2xl border border-indigo-100 shadow-sm">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mentorship Batch</p>
                                            <p className="text-lg font-bold text-slate-800">{viewingEmployee.profile?.student_interaction?.mentorship_batch || "Not assigned"}</p>
                                        </div>
                                        <div className="p-5 bg-white rounded-2xl border border-indigo-100 shadow-sm">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Availability</p>
                                            <p className="text-lg font-bold text-slate-800">{viewingEmployee.profile?.availability || "Not specified"}</p>
                                        </div>
                                        <div className="p-5 bg-white rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-300 transition-colors">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time Table</p>
                                                <p className="text-sm font-bold text-indigo-600 group-hover:underline">View Schedule Document</p>
                                            </div>
                                            <BookOpen className="w-5 h-5 text-indigo-300 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                        <div className="p-5 bg-white rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-300 transition-colors">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Student Feedback</p>
                                                <p className="text-sm font-bold text-indigo-600 group-hover:underline">View Feedback Reports</p>
                                            </div>
                                            <Activity className="w-5 h-5 text-indigo-300 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function InfoRow({ label, value, icon }: { label: string, value?: string, icon?: React.ReactNode }) {
    if (!value) return null;
    return (
        <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, delay }: { title: string, value: number | string, icon: React.ReactNode, color: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-[2rem] bg-white/40 border border-white/50 backdrop-blur-2xl relative overflow-hidden group hover:bg-white/50 transition-all duration-300 shadow-sm hover:shadow-lg`}
        >
            <div className={`absolute -right-6 -top-6 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl group-hover:bg-${color}-500/20 transition-colors`} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className={`p-3.5 rounded-2xl bg-white/60 border border-white/60 shadow-sm text-${color}-600 group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-${color}-50 text-${color}-600 border border-${color}-100`}>
                        Live
                    </span>
                </div>
                <h3 className="text-slate-500 text-sm font-bold mb-1 uppercase tracking-wide">{title}</h3>
                <p className="text-4xl font-extrabold text-slate-800 tracking-tight">{value}</p>
            </div>
        </motion.div>
    );
}
