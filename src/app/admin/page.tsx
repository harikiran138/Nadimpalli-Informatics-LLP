"use client";

import { motion } from "framer-motion";
import { Users, Activity, Server, LogOut, Bell, Search, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const supabase = createClient();

const stats = [
    {
        title: "Total Employees",
        value: "1,234",
        change: "+12%",
        icon: <Users className="w-6 h-6 text-cyan-400" />,
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        text: "text-cyan-400"
    },
    {
        title: "Active Sessions",
        value: "856",
        change: "+5%",
        icon: <Activity className="w-6 h-6 text-blue-400" />,
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        text: "text-blue-400"
    },
    {
        title: "System Status",
        value: "99.9%",
        change: "Stable",
        icon: <Server className="w-6 h-6 text-purple-400" />,
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        text: "text-purple-400"
    },
];

export default function AdminDashboard() {
    const [loading, setLoading] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        fullName: "",
        employeeId: "",
        password: "",
        isAdmin: false
    });

    const handleCreateEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Employee
            const { error: empError } = await supabase
                .from('employees')
                .insert([{
                    full_name: newEmployee.fullName,
                    employee_id: newEmployee.employeeId,
                    password_hash: newEmployee.password
                }]);

            if (empError) throw empError;

            // 2. Grant Admin Access if checked
            if (newEmployee.isAdmin) {
                const { error: adminError } = await supabase
                    .from('admins')
                    .insert([{
                        employee_id: newEmployee.employeeId
                    }]);

                if (adminError) throw adminError;
            }

            // Reset form
            setNewEmployee({ fullName: "", employeeId: "", password: "", isAdmin: false });
            alert("Employee created successfully!");

        } catch (error: any) {
            console.error("Error creating employee:", error);
            alert("Failed to create employee: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Glass Sidebar */}
            <aside className="w-64 hidden md:flex flex-col h-full bg-black/20 backdrop-blur-xl border-r border-white/10 relative z-20">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-wide">Admin Panel</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-white bg-white/10 font-medium hover:bg-white/20 hover:text-white transition-all">
                        <Activity className="w-4 h-4 mr-3 text-blue-400" /> Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <Users className="w-4 h-4 mr-3" /> Employees
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <Settings className="w-4 h-4 mr-3" /> Settings
                    </Button>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                            <LogOut className="w-4 h-4 mr-3" /> Logout
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10">
                {/* Glass Header */}
                <header className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between bg-black/10 backdrop-blur-md border-b border-white/5">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search..."
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-blue-500/50 transition-all rounded-xl"
                            />
                        </div>
                        <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 border border-white/20 shadow-lg" />
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* Create Employee Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-400" />
                                Create New Employee
                            </h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCreateEmployee} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Full Name</label>
                                        <Input
                                            required
                                            placeholder="e.g. Alice Smith"
                                            value={newEmployee.fullName}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
                                            className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:bg-black/40"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Employee ID</label>
                                        <Input
                                            required
                                            placeholder="e.g. EMP001"
                                            value={newEmployee.employeeId}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
                                            className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:bg-black/40"
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Password</label>
                                        <Input
                                            required
                                            type="password"
                                            placeholder="••••••••"
                                            value={newEmployee.password}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                                            className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:bg-black/40"
                                        />
                                    </div>
                                    <div className="flex items-end pb-2">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={newEmployee.isAdmin}
                                                    onChange={(e) => setNewEmployee({ ...newEmployee, isAdmin: e.target.checked })}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-10 h-6 bg-slate-700 rounded-full peer-checked:bg-blue-500 transition-colors"></div>
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                                            </div>
                                            <span className="text-slate-300 font-medium group-hover:text-white transition-colors">Grant Admin Access</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold"
                                    >
                                        {loading ? "Creating..." : "Create Employee"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-md hover:bg-opacity-20 transition-all duration-300`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl bg-black/20 border border-white/5`}>
                                        {stat.icon}
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-black/20 border border-white/5 ${stat.text}`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.title}</h3>
                                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5">View All</Button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 pb-6 border-b border-white/5 last:border-0 last:pb-0 group">
                                        <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 font-medium group-hover:bg-white/10 transition-colors">
                                            JD
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium group-hover:text-blue-400 transition-colors">John Doe logged in</p>
                                            <p className="text-slate-500 text-sm">2 minutes ago</p>
                                        </div>
                                        <div className="text-sm text-slate-500 font-mono bg-black/20 px-2 py-1 rounded">IP: 192.168.1.1</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
