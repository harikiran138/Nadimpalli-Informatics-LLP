"use client";

import { motion } from "framer-motion";

// Features data removed

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
                            About Us
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                            className="text-slate-800 text-lg md:text-xl font-medium leading-relaxed space-y-6 max-w-4xl mx-auto text-left"
                        >
                            <p>
                                We transform institutions into digitally empowered, future-ready leaders. By integrating AI-driven governance, expert accreditation, and industry-aligned upskilling, we elevate every aspect of campus performance.
                            </p>
                            <p className="font-bold text-slate-900">
                                From administrative efficiency to student success, we ensure you stay competitive. Unlock high-impact growth and shape a smarter future with us.
                            </p>
                        </motion.div>
                    </div>

                    {/* Features grid removed as per request */}
                </div>
            </div>
        </section>
    );
}
