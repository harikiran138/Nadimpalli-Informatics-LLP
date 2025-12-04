"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollVideoBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Parallax effect: Move the video slower than the scroll
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.8, 0]);

    return (
        <div ref={containerRef} className="fixed inset-0 z-[-1] overflow-hidden bg-black h-[150vh]">
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 w-full h-full"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Subtle overlay for better text contrast */}
                <div className="absolute inset-0 bg-black/30" />
            </motion.div>
        </div>
    );
}
