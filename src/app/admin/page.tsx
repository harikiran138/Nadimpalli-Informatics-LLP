"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Activity, Shield, LogOut, Search, Plus, Save, X, Trash2, Edit2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface Employee {
    id: string;
    employee_id: string;
    full_name: string;
    password_hash: string;
    created_at: string;
}

export default function AdminDashboard() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Employee>>({});

    // Create State
    const [showCreate, setShowCreate] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        fullName: "",
        employeeId: "",
        password: "",
        isAdmin: false
    });

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.75;
        }
    }, []);

    // Fetch Data
    const fetchData = useCallback(async () => {
        try {
            const { data: emps, error: empError } = await supabase
                .from('employees')
                .select('*')
                .order('created_at', { ascending: false });

            if (empError) throw empError;

            const { data: adms, error: admError } = await supabase
                .from('admins')
                .select('employee_id');

            if (admError) throw admError;

            setEmployees(emps || []);
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
            .on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, fetchData)
            .subscribe();

        const admChannel = supabase
            .channel('public:admins')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'admins' }, fetchData)
            .subscribe();

        return () => {
            supabase.removeChannel(empChannel);
            supabase.removeChannel(admChannel);
        };
    }, [fetchData]);

    // Handlers
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error: empError } = await supabase.from('employees').insert([{
                full_name: newEmployee.fullName,
                employee_id: newEmployee.employeeId,
                password_hash: newEmployee.password
            }]);
            if (empError) throw empError;

            if (newEmployee.isAdmin) {
                await supabase.from('admins').insert([{ employee_id: newEmployee.employeeId }]);
            }

            setNewEmployee({ fullName: "", employeeId: "", password: "", isAdmin: false });
            setShowCreate(false);
        } catch (error: any) {
            alert("Error creating: " + error.message);
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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        try {
            await supabase.from('employees').delete().eq('id', id);
        } catch (error: any) {
            alert("Error deleting: " + error.message);
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
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
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

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-72 hidden md:flex flex-col h-full m-4 rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] relative z-20"
            >
                <div className="p-8 border-b border-white/20">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-800">Admin<span className="text-blue-600">Panel</span></h1>
                            <p className="text-xs text-slate-500 font-medium">Management System</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-6 space-y-3">
                    <Button variant="ghost" className="w-full justify-start h-12 rounded-xl bg-blue-600/10 text-blue-700 font-bold hover:bg-blue-600/20 transition-all hover:scale-105 active:scale-95">
                        <Activity className="w-5 h-5 mr-3" /> Live Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start h-12 rounded-xl text-slate-600 font-medium hover:bg-white/40 hover:text-slate-900 transition-all hover:scale-105 active:scale-95">
                        <Users className="w-5 h-5 mr-3" /> Employees
                    </Button>
                </nav>
                <div className="p-6 border-t border-white/20">
                    <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start h-12 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 font-medium transition-all hover:scale-105 active:scale-95">
                            <LogOut className="w-5 h-5 mr-3" /> Logout
                        </Button>
                    </Link>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative z-10 p-4 pl-0">
                {/* Header */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-24 px-8 mb-4 rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/50 shadow-sm flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                        <p className="text-slate-500 text-sm">Welcome back, Admin</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-72 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                placeholder="Search employees..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 bg-white/50 border-white/60 text-slate-800 placeholder:text-slate-400 focus:bg-white/80 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 rounded-2xl transition-all shadow-sm hover:shadow-md"
                            />
                        </div>
                        <Button
                            onClick={() => setShowCreate(!showCreate)}
                            className="h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-6 shadow-lg shadow-blue-600/20 font-medium transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Add Employee
                        </Button>
                    </div>
                </motion.header>

                {/* Scrollable Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar"
                >
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Employees"
                            value={employees.length}
                            icon={<Users className="w-6 h-6 text-blue-600" />}
                            color="blue"
                            delay={0}
                        />
                        <StatCard
                            title="Administrators"
                            value={adminIds.size}
                            icon={<Shield className="w-6 h-6 text-purple-600" />}
                            color="purple"
                            delay={0.1}
                        />
                        <StatCard
                            title="System Status"
                            value="Active"
                            icon={<Activity className="w-6 h-6 text-emerald-600" />}
                            color="emerald"
                            delay={0.2}
                        />
                    </div>

                    {/* Create Form (Collapsible) */}
                    <AnimatePresence>
                        {showCreate && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, scale: 0.95 }}
                                animate={{ height: "auto", opacity: 1, scale: 1 }}
                                exit={{ height: 0, opacity: 0, scale: 0.95 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-white/60 border border-white/60 rounded-[2rem] p-8 backdrop-blur-xl shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800 relative z-10">
                                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        New Employee Details
                                    </h3>
                                    <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-6 relative z-10">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                                <Input
                                                    placeholder="e.g. John Doe"
                                                    value={newEmployee.fullName}
                                                    onChange={e => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
                                                    className="h-12 rounded-xl bg-white/50 border-white/60 focus:bg-white/80 transition-all hover:bg-white/70"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">Employee ID</label>
                                                <Input
                                                    placeholder="e.g. EMP001"
                                                    value={newEmployee.employeeId}
                                                    onChange={e => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
                                                    className="h-12 rounded-xl bg-white/50 border-white/60 focus:bg-white/80 transition-all hover:bg-white/70"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={newEmployee.password}
                                                    onChange={e => setNewEmployee({ ...newEmployee, password: e.target.value })}
                                                    className="h-12 rounded-xl bg-white/50 border-white/60 focus:bg-white/80 transition-all hover:bg-white/70"
                                                    required
                                                />
                                            </div>
                                            <div className="pt-8">
                                                <label className="flex items-center gap-4 p-4 rounded-xl bg-white/50 border border-white/60 cursor-pointer hover:bg-white/80 transition-all group hover:shadow-sm">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={newEmployee.isAdmin}
                                                            onChange={e => setNewEmployee({ ...newEmployee, isAdmin: e.target.checked })}
                                                            className="peer sr-only"
                                                        />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Grant Admin Privileges</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                            <Button type="button" variant="ghost" onClick={() => setShowCreate(false)} className="h-12 px-6 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100">Cancel</Button>
                                            <Button type="submit" className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 font-bold hover:scale-105 active:scale-95 transition-all">Create Account</Button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Employee List */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/40 border border-white/50 rounded-[2rem] overflow-hidden backdrop-blur-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="p-8 border-b border-white/20 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Employee Directory</h2>
                                <p className="text-sm text-slate-500">Manage your team members</p>
                            </div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full">
                                {filteredEmployees.length} Records
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/30 text-slate-500 text-xs uppercase tracking-wider font-bold">
                                    <tr>
                                        <th className="p-6">Employee</th>
                                        <th className="p-6">ID</th>
                                        <th className="p-6">Role</th>
                                        <th className="p-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20">
                                    {filteredEmployees.map((emp, index) => (
                                        <motion.tr
                                            key={emp.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-white/40 transition-colors group"
                                        >
                                            <td className="p-6">
                                                {editingId === emp.id ? (
                                                    <Input
                                                        value={editForm.full_name}
                                                        onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                                                        className="h-10 bg-white/80 border-blue-200"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-white border border-white shadow-sm flex items-center justify-center text-sm font-bold text-slate-600 group-hover:scale-110 transition-transform">
                                                            {emp.full_name.charAt(0)}
                                                        </div>
                                                        <span className="font-bold text-slate-700">{emp.full_name}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-6 text-slate-500 font-mono text-sm font-medium">
                                                {editingId === emp.id ? (
                                                    <Input
                                                        value={editForm.employee_id}
                                                        onChange={e => setEditForm({ ...editForm, employee_id: e.target.value })}
                                                        className="h-10 bg-white/80 border-blue-200"
                                                    />
                                                ) : (
                                                    emp.employee_id
                                                )}
                                            </td>
                                            <td className="p-6">
                                                {adminIds.has(emp.employee_id) ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-purple-600 text-xs font-bold border border-purple-200 shadow-sm">
                                                        <Shield className="w-3 h-3" /> Admin
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200 shadow-sm">
                                                        <Users className="w-3 h-3" /> User
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-6 text-right">
                                                {editingId === emp.id ? (
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="ghost" onClick={() => handleUpdate(emp.id)} className="h-9 w-9 bg-green-100 text-green-600 hover:bg-green-200 rounded-full hover:scale-110 transition-transform">
                                                            <CheckCircle className="w-5 h-5" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-9 w-9 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full hover:scale-110 transition-transform">
                                                            <X className="w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                setEditingId(emp.id);
                                                                setEditForm(emp);
                                                            }}
                                                            className="h-9 w-9 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-full hover:scale-110 transition-transform"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleDelete(emp.id)}
                                                            className="h-9 w-9 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-full hover:scale-110 transition-transform"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredEmployees.length === 0 && (
                                <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-full bg-slate-100">
                                        <Search className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p>No employees found matching your search.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, color, delay }: { title: string, value: number | string, icon: React.ReactNode, color: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`p-6 rounded-[2rem] bg-white/40 border border-white/50 backdrop-blur-xl relative overflow-hidden group hover:bg-white/60 transition-all duration-300 shadow-sm hover:shadow-xl`}
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
