"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Server, Cpu } from "lucide-react";

const features = [
    {
        icon: <Shield className="w-8 h-8 text-primary" />,
        title: "Security",
        description: "Enterprise-grade encryption and threat protection built into every layer.",
    },
    {
        icon: <Zap className="w-8 h-8 text-accent" />,
        title: "Speed",
        description: "Optimized performance ensuring lightning-fast interactions and data processing.",
    },
    {
        icon: <Server className="w-8 h-8 text-purple-400" />,
        title: "Reliability",
        description: "99.99% uptime guarantee with redundant infrastructure and failover systems.",
    },
    {
        icon: <Cpu className="w-8 h-8 text-blue-400" />,
        title: "Innovation",
        description: "Constantly evolving technology stack to keep you ahead of the curve.",
    },
];

export function About() {
    return (
        <section id="about" className="py-32 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6"
                    >
                        Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Architecture</span>
                    </motion.h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Built on a foundation of cutting-edge principles designed for the future of education.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="group relative h-64 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden"
                        >
                            {/* Internal Glow Lines */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                                <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
                                <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
                            </div>

                            <div className="relative z-10">
                                <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/10 w-fit group-hover:border-primary/50 transition-colors duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20 rounded-tl-xl" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 rounded-br-xl" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
