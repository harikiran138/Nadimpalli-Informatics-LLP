"use client";

import { motion } from "framer-motion";

const features = [
    {
        id: "01",
        title: "Security",
        description: "Enterprise-grade encryption and threat protection built into every layer.",
        color: "bg-blue-600",
        shadow: "hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]",
    },
    {
        id: "02",
        title: "Speed",
        description: "Optimized performance ensuring lightning-fast interactions and data processing.",
        color: "bg-amber-500",
        shadow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    },
    {
        id: "03",
        title: "Reliability",
        description: "99.99% uptime guarantee with redundant infrastructure and failover systems.",
        color: "bg-purple-600",
        shadow: "hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]",
    },
    {
        id: "04",
        title: "Innovation",
        description: "Constantly evolving technology stack to keep you ahead of the curve.",
        color: "bg-emerald-600",
        shadow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    },
];

export function About() {
    return (
        <section id="about" className="pb-32 pt-0 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <video
                    muted
                    playsInline
                    onLoadedMetadata={(e) => e.currentTarget.currentTime = 1}
                    className="w-full h-full object-cover scale-x-[-1]"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
            </div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight"
                    >
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Us</span>
                    </motion.h2>
                    <p className="text-slate-400 max-w-3xl mx-auto text-xl md:text-2xl font-medium leading-relaxed">
                        Built on a foundation of cutting-edge principles designed for the future of education.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={`group relative h-80 p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-500 flex flex-col justify-between overflow-hidden ${feature.shadow}`}
                        >
                            {/* Hover Accent Background */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${feature.color.replace('bg-', 'bg-')}`} />

                            {/* Top Accent Line */}
                            <div className={`absolute top-0 left-0 w-full h-1 ${feature.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />

                            <div className="relative z-10">
                                <span className={`text-6xl font-bold opacity-10 group-hover:opacity-20 transition-opacity duration-500 text-white`}>
                                    {feature.id}
                                </span>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold mb-4 text-white group-hover:translate-x-2 transition-transform duration-300">
                                    {feature.title}
                                </h3>

                                <p className="text-slate-400 font-medium leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
