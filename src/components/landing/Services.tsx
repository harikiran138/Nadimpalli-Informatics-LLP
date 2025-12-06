"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const services = [
    {
        id: "01",
        title: "AI-Driven Institutional Governance Solutions",
        description: "Comprehensive solutions tailored for modern educational institutions.",
        features: [
            "Smart automation for administrative excellence",
            "Data-driven decisions for academic leadership",
            "Streamlined workflows for efficient governance"
        ],
        shadow: "hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]",
        color: "from-cyan-400 to-blue-500"
    },
    {
        id: "02",
        title: "Comprehensive Campus Upskilling Programs",
        description: "Empowering your institution with next-generation capabilities.",
        features: [
            "Future-ready skills for students and staff",
            "Industry-aligned learning for growth",
            "Building digital capabilities for tomorrow"
        ],
        shadow: "hover:shadow-[0_0_20px_rgba(96,165,250,0.3)]",
        color: "from-blue-400 to-indigo-500"
    },
    {
        id: "03",
        title: "Industry-Integrated Teaching & Apprenticeships",
        description: "Bridging the gap between theory and practice.",
        features: [
            "Real-world exposure through strong industry ties",
            "Career-focused experiential learning pathways",
            "Professional mentoring and hands-on experience"
        ],
        shadow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]",
        color: "from-purple-400 to-fuchsia-500"
    },
    {
        id: "04",
        title: "Accreditation & Institutional Ranking Support",
        description: "Expert guidance for achieving global recognition.",
        features: [
            "Strategy and compliance for top recognition",
            "Continuous improvement for global standards",
            "Expert guidance to achieve higher ratings"
        ],
        shadow: "hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]",
        color: "from-emerald-400 to-teal-500"
    },
];

export function Services() {
    const [activeService, setActiveService] = useState(services[0]);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (isHovering) return;

        const interval = setInterval(() => {
            setActiveService((prev) => {
                const currentIndex = services.findIndex((s) => s.id === prev.id);
                const nextIndex = (currentIndex + 1) % services.length;
                return services[nextIndex];
            });
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [isHovering]);

    return (
        <section id="services" className="py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">

                    {/* Decorative Background Mesh inside the card */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                    <div className="grid lg:grid-cols-5 gap-12 relative z-10">
                        {/* LEFT: List of Services (Styled like Contact Info) */}
                        <div
                            className="lg:col-span-2 flex flex-col"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <div className="mb-10">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-500 to-black"
                                >
                                    Our Services
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                                    className="text-black text-lg font-medium leading-relaxed"
                                >
                                    Cutting-edge solutions designed to transform your educational infrastructure.
                                </motion.p>
                            </div>

                            <div className="space-y-4">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        onMouseEnter={() => setActiveService(service)}
                                        className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${activeService.id === service.id
                                            ? "bg-white/20 border-white/30 shadow-sm"
                                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/10 transition-transform duration-300 ${activeService.id === service.id
                                            ? "scale-110 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20"
                                            : "bg-white/5 group-hover:scale-110"
                                            }`}>
                                            <span className={`font-mono text-sm font-bold ${activeService.id === service.id ? "text-violet-600" : "text-slate-500 group-hover:text-slate-700"
                                                }`}>
                                                {service.id}
                                            </span>
                                        </div>
                                        <div>
                                            <p className={`font-medium transition-colors duration-300 ${activeService.id === service.id ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
                                                }`}>
                                                {service.title}
                                            </p>
                                        </div>
                                        <ArrowRight className={`w-4 h-4 ml-auto transition-all duration-300 ${activeService.id === service.id
                                            ? "text-violet-600 translate-x-0 opacity-100"
                                            : "text-slate-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                            }`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Active Service Detail Card (Styled like Contact Form) */}
                        <div className="lg:col-span-3">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeService.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="h-full rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-8 md:p-12 relative overflow-hidden flex flex-col justify-center"
                                >
                                    {/* Subtle internal glow */}
                                    <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-b ${activeService.color} opacity-10 blur-[80px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3`} />

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-20"> {/* Increased mb-8 to mb-20 for more gap */}
                                            <span className={`text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b ${activeService.color} opacity-10 select-none absolute -top-10 -left-6`}>
                                                {activeService.id}
                                            </span>
                                        </div>

                                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                            {activeService.title}
                                        </h3>

                                        <p className="text-xl text-slate-700 font-medium leading-relaxed mb-10">
                                            {activeService.description}
                                        </p>

                                        {/* Render features list if available */}
                                        {activeService.features && (
                                            <ul className="space-y-4 mb-10">
                                                {activeService.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center shrink-0 mt-0.5">
                                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeService.color}`} />
                                                        </div>
                                                        <span className="text-lg text-slate-800 font-medium">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <div className="flex items-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                                <Sparkles className="w-4 h-4 text-yellow-600" />
                                            </div>
                                            <span>Premium Solution</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
