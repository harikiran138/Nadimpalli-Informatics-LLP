"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";

export function Hero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((error) => {
                console.log("Video autoplay failed:", error);
            });
        }
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-left"
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
                        <span className="text-slate-300">Engineering the</span> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-slate-400 to-slate-500">
                            Future of Digital
                        </span>
                        <br />
                        <span className="text-black drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            Education.
                        </span>
                    </h1>

                    <p className="text-xl text-slate-300 max-w-lg mb-8 leading-relaxed">
                        Seamless technology for the smartest campuses. Precision-built modules for the modern educational ecosystem.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Button size="lg" className="h-14 px-8 rounded-full bg-black hover:bg-black/80 text-slate-200 text-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-slate-700">
                            Get a Demo
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-slate-600 bg-slate-900/50 hover:bg-slate-900/70 text-slate-300 text-lg backdrop-blur-md">
                            Our Solutions
                        </Button>
                    </div>
                </motion.div>

                {/* 3D Abstract Glass Visual */}
                <div className="relative h-[600px] w-full flex items-center justify-center perspective-1000">
                    <motion.div
                        style={{ y: y2, rotateX: 10, rotateY: -10 }}
                        className="relative w-80 h-80 md:w-96 md:h-96"
                    >
                        {/* Layer 1: Back Plate */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-[3rem] border border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl"
                        />

                        {/* Layer 2: Middle Ring */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-8 rounded-full border-2 border-dashed border-white/10"
                        />

                        {/* Layer 3: Core Lens */}
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-20 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(20,123,255,0.2)] flex items-center justify-center"
                        >
                            <div className="w-32 h-32 rounded-full bg-black/80 border border-white/10 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-transparent border border-white/30" />
                            </div>
                        </motion.div>

                        {/* Floating Elements Removed */}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
