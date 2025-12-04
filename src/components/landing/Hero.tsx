"use client";

import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const TypingText = ({ text, className }: { text: string, className?: string }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 50); // Typing speed
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text]);

    return (
        <span className={className}>
            {displayedText}
            <span className="animate-pulse">|</span>
        </span>
    );
};

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Video */}
            {/* Background Video - Removed to use global video */}
            {/* <div className="absolute inset-0 z-0"> ... </div> */}

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-400/30 backdrop-blur-md mb-6"
                        >
                            <Sparkles className="w-3 h-3 text-slate-300" />
                            <span className="text-xs font-medium text-slate-300 tracking-wider uppercase">Next Gen Education Tech</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight min-h-[160px] md:min-h-[240px]">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-500 to-black">
                                <TypingText text="Engineering the Future of Digital Education." />
                            </span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.5, duration: 1.5 }}
                            className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl leading-relaxed font-medium"
                        >
                            We build intelligent, scalable, and secure platforms that empower institutions to thrive in the digital age.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 3, duration: 1 }}
                            className="flex flex-wrap gap-4 justify-start"
                        >
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
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
