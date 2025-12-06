"use client";

import { motion } from "framer-motion";

const features = [
    {
        id: "01",
        title: "Security",
        description: "Enterprise-grade encryption and threat protection built into every layer.",
        color: "bg-blue-600",
        shadow: "hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]",
        textColor: "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]",
    },
    {
        id: "02",
        title: "Speed",
        description: "Optimized performance ensuring lightning-fast interactions and data processing.",
        color: "bg-amber-500",
        shadow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]",
        textColor: "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]",
    },
    {
        id: "03",
        title: "Reliability",
        description: "99.99% uptime guarantee with redundant infrastructure and failover systems.",
        color: "bg-purple-600",
        shadow: "hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]",
        textColor: "text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]",
    },
    {
        id: "04",
        title: "Innovation",
        description: "Constantly evolving technology stack to keep you ahead of the curve.",
        color: "bg-emerald-600",
        shadow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]",
        textColor: "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    },
];

export function About() {
    return (
        <section id="about" className="pb-32 pt-0 relative overflow-hidden">
            {/* Background Elements */}
            {/* Background Elements - Removed for unified page background */}
            {/* <div className="absolute inset-0"> ... </div> */}

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
                            Empowering Institutions for the Future
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                            className="text-slate-800 text-lg md:text-xl font-medium leading-relaxed space-y-6 max-w-4xl mx-auto text-left"
                        >
                            <p>
                                We are a next-generation education technology and consulting partner committed to transforming institutions into digitally empowered, future-ready campuses. Through our AI-driven governance systems, comprehensive upskilling initiatives, strong industry collaboration, and expert accreditation support, we enable institutions to deliver excellence in academics, operations, and student success.
                            </p>
                            <p>
                                Our solutions are built to elevate every aspect of institutional performance — from administrative efficiency and faculty development to employability outcomes and global recognition. With a focus on innovation, quality, and measurable impact, we ensure that educational organizations stay competitive in a rapidly evolving world.
                            </p>
                            <p className="font-bold text-slate-900">
                                Together, we help institutions unlock their full potential and shape a smarter future for education.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="group relative h-80 p-8 rounded-[2rem] bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 hover:border-white/30 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-lg"
                            >
                                <div className="relative z-10">
                                    <span className="text-6xl font-bold transition-opacity duration-500 bg-gradient-to-b from-slate-300 via-slate-600 to-slate-900 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]">
                                        {feature.id}
                                    </span>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-b from-slate-200 via-slate-500 to-slate-800 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(255,255,255,0.1)]">
                                        {feature.title}
                                    </h3>

                                    <p className="text-black font-medium leading-relaxed drop-shadow-sm">
                                        {feature.description}
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
