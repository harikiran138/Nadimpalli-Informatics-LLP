"use client";

import { useRef, useEffect } from "react";
import { useScroll, useSpring, useMotionValueEvent } from "framer-motion";

export function ScrollVideoBackground() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { scrollYProgress } = useScroll();

    // Smooth out the scroll progress to prevent jittery playback
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useMotionValueEvent(smoothProgress, "change", (latest) => {
        if (videoRef.current && videoRef.current.duration) {
            // Map scroll progress (0 to 1) to video duration
            // Ensure we don't exceed duration
            const targetTime = latest * videoRef.current.duration;

            // Check if the time difference is significant enough to update
            // This helps performance by avoiding micro-updates
            if (Math.abs(videoRef.current.currentTime - targetTime) > 0.05) {
                videoRef.current.currentTime = targetTime;
            }
        }
    });

    useEffect(() => {
        // Ensure video metadata is loaded so we have duration
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
            <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
                <source src="/hero-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {/* Optional overlay if needed for text readability, though user asked to remove "black over shard" */}
            {/* <div className="absolute inset-0 bg-black/20" /> */}
        </div>
    );
}
