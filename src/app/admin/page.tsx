"use client";

import { motion } from "framer-motion";
import { Users, Activity, Server, LogOut, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const stats = [
    {
        title: "Total Employees",
        value: "1,234",
        change: "+12%",
        icon: <Users className="w-6 h-6 text-blue-600" />,
        bg: "bg-blue-50",
    },
    {
        title: "Active Sessions",
        value: "856",
        change: "+5%",
        icon: <Activity className="w-6 h-6 text-emerald-600" />,
        bg: "bg-emerald-50",
    },
    {
        title: "System Status",
        value: "99.9%",
        change: "Stable",
        icon: <Server className="w-6 h-6 text-purple-600" />,
        bg: "bg-purple-50",
    },
];

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar (Mock) */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-20">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
                        <span className="text-lg font-bold text-slate-900">Admin Panel</span>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-blue-600 bg-blue-50 font-medium">
                        <Activity className="w-4 h-4 mr-2" /> Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-blue-600 hover:bg-slate-50">
                        <Users className="w-4 h-4 mr-2" /> Employees
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-blue-600 hover:bg-slate-50">
                        <Server className="w-4 h-4 mr-2" /> Settings
                    </Button>
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input placeholder="Search..." className="pl-10 bg-slate-50 border-slate-200" />
                        </div>
                        <Button size="icon" variant="ghost" className="text-slate-500">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300" />
                    </div>
                </header>

                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        {stat.icon}
                                    </div>
                                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
                                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Recent Activity (Mock) */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
                                            JD
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-900 font-medium">John Doe logged in</p>
                                            <p className="text-slate-500 text-sm">2 minutes ago</p>
                                        </div>
                                        <div className="text-sm text-slate-400">IP: 192.168.1.1</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
