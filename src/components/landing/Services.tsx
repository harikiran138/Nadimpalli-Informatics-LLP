"use client";

import { motion } from "framer-motion";
import { GraduationCap, Fingerprint, BookOpen, BarChart3, ArrowUpRight } from "lucide-react";

const services = [
    {
        icon: <GraduationCap className="w-10 h-10" />,
        title: "College ERP",
        description: "Comprehensive management system for academic institutions.",
        color: "from-blue-500 to-cyan-500",
    },
    {
        icon: <Fingerprint className="w-10 h-10" />,
        title: "Smart Attendance",
        description: "Biometric and AI-driven attendance tracking solutions.",
        color: "from-purple-500 to-pink-500",
    },
    {
        icon: <BookOpen className="w-10 h-10" />,
        title: "Library Automation",
        description: "Digital cataloging and RFID-based inventory management.",
        color: "from-emerald-500 to-teal-500",
    },
    {
        icon: <BarChart3 className="w-10 h-10" />,
        title: "AI Analytics",
        description: "Predictive insights and performance dashboards for admins.",
        color: "from-orange-500 to-yellow-500",
    },
];

export function Services() {
    return (
        <section id="services" className="py-32 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold mb-6"
                        >
                            Intelligent <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Solutions</span>
                        </motion.h2>
                        <p className="text-muted-foreground text-lg">
                            Modular components designed to integrate seamlessly into your existing infrastructure.
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md flex items-center gap-2 transition-colors"
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
                            className="group relative h-64 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl overflow-hidden"
                        >
                            {/* Hover Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:scale-110 transition-transform duration-300`}>
                                        {service.icon}
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                                        <ArrowUpRight className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                                        {service.title}
                                    </h3>
                                    <p className="text-muted-foreground group-hover:text-white/80 transition-colors">
                                        {service.description}
                                    </p>
                                </div>
                            </div>

                            {/* Tech Lines */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
