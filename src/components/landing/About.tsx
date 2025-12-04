"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Server, Cpu } from "lucide-react";

const features = [
    {
        icon: <Shield className="w-6 h-6 text-blue-600" />,
        title: "Security",
        description: "Enterprise-grade encryption and threat protection built into every layer.",
        gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
        icon: <Zap className="w-6 h-6 text-amber-500" />,
        title: "Speed",
        description: "Optimized performance ensuring lightning-fast interactions and data processing.",
        gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
        icon: <Server className="w-6 h-6 text-purple-600" />,
        title: "Reliability",
        description: "99.99% uptime guarantee with redundant infrastructure and failover systems.",
        gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
        icon: <Cpu className="w-6 h-6 text-emerald-600" />,
        title: "Innovation",
        description: "Constantly evolving technology stack to keep you ahead of the curve.",
        gradient: "from-emerald-500/20 to-teal-500/20",
    },
];

export function About() {
    return (
        <section id="about" className="py-32 relative overflow-hidden">
            {/* Ambient Background Blobs for Glass Effect */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[128px] -translate-y-1/2 -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[128px] translate-y-1/4 -z-10" />

            <div className="container mx-auto px-4">
                <div className="text-center mb-20 relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight"
                    >
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Us</span>
                    </motion.h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
                        Built on a foundation of cutting-edge principles designed for the future of education.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group relative p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
                        >
                            {/* Hover Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className="mb-6 p-3 rounded-2xl bg-white/80 border border-white/50 w-fit shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-slate-900 transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-slate-600 group-hover:text-slate-800 leading-relaxed text-sm font-medium">
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
