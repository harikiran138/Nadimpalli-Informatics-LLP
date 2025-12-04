"use client";

import { motion } from "framer-motion";
import { GraduationCap, Fingerprint, BookOpen, BarChart3, ArrowUpRight } from "lucide-react";

const services = [
    {
        icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
        title: "College ERP",
        description: "Comprehensive management system for academic institutions.",
        color: "bg-blue-50",
        borderColor: "border-blue-100",
    },
    {
        icon: <Fingerprint className="w-8 h-8 text-purple-600" />,
        title: "Smart Attendance",
        description: "Biometric and AI-driven attendance tracking solutions.",
        color: "bg-purple-50",
        borderColor: "border-purple-100",
    },
    {
        icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
        title: "Library Automation",
        description: "Digital cataloging and RFID-based inventory management.",
        color: "bg-emerald-50",
        borderColor: "border-emerald-100",
    },
    {
        icon: <BarChart3 className="w-8 h-8 text-amber-600" />,
        title: "AI Analytics",
        description: "Predictive insights and performance dashboards for admins.",
        color: "bg-amber-50",
        borderColor: "border-amber-100",
    },
];

export function Services() {
    return (
        <section id="services" className="py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold mb-6 text-slate-900"
                        >
                            Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Solutions</span>
                        </motion.h2>
                        <p className="text-slate-600 text-lg">
                            Modular components designed to integrate seamlessly into your existing infrastructure.
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 shadow-sm flex items-center gap-2 transition-colors"
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
                            className={`group relative h-64 rounded-[2rem] bg-white border ${service.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
                        >
                            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className={`p-4 rounded-2xl ${service.color} border ${service.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                                        {service.icon}
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                                        <ArrowUpRight className="w-5 h-5 text-slate-600" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:translate-x-2 transition-transform duration-300">
                                        {service.title}
                                    </h3>
                                    <p className="text-slate-600 group-hover:text-slate-900 transition-colors">
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
