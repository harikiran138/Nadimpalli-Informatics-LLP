"use client";

import { motion } from "framer-motion";
import { GraduationCap, Fingerprint, BookOpen, BarChart3, ArrowUpRight } from "lucide-react";

const services = [
    {
        id: "01",
        title: "College ERP",
        description: "Comprehensive management system for academic institutions.",
        shadow: "hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]",
    },
    {
        id: "02",
        title: "Smart Attendance",
        description: "Biometric and AI-driven attendance tracking solutions.",
        shadow: "hover:shadow-[0_0_20px_rgba(96,165,250,0.3)]",
    },
    {
        id: "03",
        title: "Library Automation",
        description: "Digital cataloging and RFID-based inventory management.",
        shadow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    },
    {
        id: "04",
        title: "AI Analytics",
        description: "Predictive insights and performance dashboards for admins.",
        shadow: "hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]",
    },
];

export function Services() {
    return (
        <section id="services" className="py-32 relative overflow-hidden">
            {/* Background Elements */}
            {/* Background Elements - Removed for unified page background */}

            <div className="container mx-auto px-4 relative z-10">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-500 to-black"
                        >
                            Services
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                            className="text-black max-w-3xl mx-auto text-xl md:text-2xl font-medium leading-relaxed"
                        >
                            Modular components designed to integrate seamlessly into your existing infrastructure.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className={`group relative h-80 p-8 rounded-[2rem] bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 hover:border-white/30 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-lg`}
                            >
                                <div className="relative z-10">
                                    <span className="text-6xl font-bold transition-opacity duration-500 bg-gradient-to-b from-slate-300 via-slate-600 to-slate-900 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]">
                                        {service.id}
                                    </span>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-b from-slate-200 via-slate-500 to-slate-800 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(255,255,255,0.1)]">
                                        {service.title}
                                    </h3>

                                    <p className="text-black font-medium leading-relaxed drop-shadow-sm">
                                        {service.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
