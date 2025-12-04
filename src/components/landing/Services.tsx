"use client";

import { motion } from "framer-motion";
import { GraduationCap, Fingerprint, BookOpen, BarChart3, ArrowUpRight } from "lucide-react";

const services = [
    {
        icon: <GraduationCap className="w-8 h-8 text-cyan-400" />,
        title: "College ERP",
        description: "Comprehensive management system for academic institutions.",
        color: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20",
        shadow: "hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]",
    },
    {
        icon: <Fingerprint className="w-8 h-8 text-blue-400" />,
        title: "Smart Attendance",
        description: "Biometric and AI-driven attendance tracking solutions.",
        color: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        shadow: "hover:shadow-[0_0_20px_rgba(96,165,250,0.3)]",
    },
    {
        icon: <BookOpen className="w-8 h-8 text-purple-400" />,
        title: "Library Automation",
        description: "Digital cataloging and RFID-based inventory management.",
        color: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        shadow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    },
    {
        icon: <BarChart3 className="w-8 h-8 text-emerald-400" />,
        title: "AI Analytics",
        description: "Predictive insights and performance dashboards for admins.",
        color: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        shadow: "hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]",
    },
];

export function Services() {
    return (
        <section id="services" className="py-32 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[#0B0F18]" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold mb-6 text-white"
                        >
                            Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Solutions</span>
                        </motion.h2>
                        <p className="text-slate-400 text-lg">
                            Modular components designed to integrate seamlessly into your existing infrastructure.
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm flex items-center gap-2 transition-colors"
                    >
                        View All Services <ArrowUpRight className="w-4 h-4" />
                    </motion.button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`group relative h-64 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden transition-all duration-300 ${service.shadow} hover:border-white/20`}
                        >
                            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className={`p-4 rounded-2xl ${service.color} border ${service.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                                        {service.icon}
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                                        <ArrowUpRight className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                                        {service.title}
                                    </h3>
                                    <p className="text-slate-400 group-hover:text-slate-200 transition-colors">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
