"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";

export function Hero() {

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>

            </div>

            {/* Gradient Overlay for Blending */}


            <div className="container mx-auto px-4 z-10 flex flex-col items-start justify-center text-left">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl flex flex-col items-start"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-400/30 bg-slate-900/50 backdrop-blur-md mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                        <span className="text-xs font-medium text-slate-300 tracking-wider uppercase">Next Gen Education Tech</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-500 to-black">Engineering the</span> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-500 to-black">
                            Future of Digital
                        </span>
                        <br />
                        <span className="text-black drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            Education.
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 max-w-lg mb-8 leading-relaxed">
                        Seamless technology for the smartest campuses. Precision-built modules for the modern educational ecosystem.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-start">
                        <Button size="lg" className="h-14 px-8 rounded-full bg-black hover:bg-black/80 text-slate-200 text-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-slate-700">
                            Get a Demo
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-slate-600 bg-slate-900/50 hover:bg-slate-900/70 text-slate-300 text-lg backdrop-blur-md">
                            Our Solutions
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
