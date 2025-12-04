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
        icon: <Zap className="w-8 h-8 text-accent-foreground" />,
        title: "Speed",
        description: "Optimized performance ensuring lightning-fast interactions and data processing.",
    },
    {
        icon: <Server className="w-8 h-8 text-purple-600" />,
        title: "Reliability",
        description: "99.99% uptime guarantee with redundant infrastructure and failover systems.",
    },
    {
        icon: <Cpu className="w-8 h-8 text-blue-600" />,
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
                        className="text-3xl md:text-5xl font-bold mb-6 text-slate-900"
                    >
                        Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Architecture</span>
                    </motion.h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
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
                            whileHover={{ y: -5 }}
                            className="group relative p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100 w-fit group-hover:bg-primary/5 transition-colors duration-300">
                                {feature.icon}
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
