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
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
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
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-xs font-medium text-accent tracking-wider uppercase">Next Gen Education Tech</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                        Engineering the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
                            Future of Digital
                        </span>
                        <br />
                        <span className="text-primary drop-shadow-[0_0_30px_rgba(20,123,255,0.5)]">
                            Education.
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed">
                        Seamless technology for the smartest campuses. Precision-built modules for the modern educational ecosystem.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Button size="lg" className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white text-lg shadow-[0_0_20px_rgba(20,123,255,0.3)] border border-white/10">
                            Get a Demo
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-lg backdrop-blur-md">
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

                        {/* Floating Elements */}
                        <motion.div
                            style={{ y: y1 }}
                            className="absolute -top-10 -right-10 p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-mono text-white/80">System Active</span>
                            </div>
                        </motion.div>

                        <motion.div
                            style={{ y: y2 }}
                            className="absolute -bottom-5 -left-10 p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-1 bg-primary/50 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="w-1/2 h-full bg-primary"
                                    />
                                </div>
                                <span className="text-sm font-mono text-white/80">Processing...</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
