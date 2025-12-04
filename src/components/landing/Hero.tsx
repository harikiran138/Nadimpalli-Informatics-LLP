"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";

export function Hero() {

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Video - Removed for global page background */}

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
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-400/30 backdrop-blur-md mb-6"
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
                        <button className="group relative w-44 h-14 rounded-full flex justify-center items-center gap-3 bg-[#1C1A1C] cursor-pointer transition-all duration-450 hover:bg-gradient-to-t hover:from-[#8B5CF6] hover:to-[#EC4899] hover:shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.4),inset_0px_-4px_0px_0px_rgba(0,0,0,0.2),0px_0px_0px_4px_rgba(255,255,255,0.2),0px_0px_180px_0px_#EC4899] hover:-translate-y-0.5">
                            <span className="text-[#AAAAAA] font-semibold text-sm transition-colors duration-450 group-hover:text-white">Get a Demo</span>
                            <ChevronRight className="w-5 h-5 text-[#AAAAAA] transition-all duration-800 group-hover:text-white group-hover:scale-120" />
                        </button>
                        <button className="group relative w-44 h-14 rounded-full flex justify-center items-center gap-3 bg-[#1C1A1C] cursor-pointer transition-all duration-450 hover:bg-gradient-to-t hover:from-[#8B5CF6] hover:to-[#EC4899] hover:shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.4),inset_0px_-4px_0px_0px_rgba(0,0,0,0.2),0px_0px_0px_4px_rgba(255,255,255,0.2),0px_0px_180px_0px_#EC4899] hover:-translate-y-0.5">
                            <svg height={20} width={20} fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="fill-[#AAAAAA] transition-all duration-800 group-hover:fill-white group-hover:scale-120">
                                <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
                            </svg>
                            <span className="text-[#AAAAAA] font-semibold text-sm transition-colors duration-450 group-hover:text-white">Our Solutions</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
