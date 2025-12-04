"use client";

import { motion } from "framer-motion";

const logos = [
    "TechCorp", "EduSystem", "FutureLearn", "SmartCampus", "DataFlow", "CloudNine", "SecureNet", "AI-Labs"
];

export function Trust() {
    return (
        <section className="py-20 border-y border-white/5 bg-black/50 backdrop-blur-sm overflow-hidden">
            <div className="container mx-auto px-4 mb-10 text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em]">Trusted by Industry Leaders</p>
            </div>

            <div className="relative flex overflow-hidden group">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex gap-20 whitespace-nowrap py-4"
                >
                    {[...logos, ...logos].map((logo, index) => (
                        <div key={index} className="text-2xl font-bold text-white/30 hover:text-white/80 transition-colors cursor-default relative group/logo">
                            {logo}
                            {/* Metallic Reflection Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/logo:animate-shimmer" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
