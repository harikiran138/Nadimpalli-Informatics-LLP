"use client";

import { useRef, useEffect } from "react";

export function ScrollVideoBackground() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const requestRef = useRef<number | undefined>(undefined);
    const targetTimeRef = useRef(0);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        const updateMaxScroll = () => {
            maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        };

        const handleScroll = () => {
            const scrollFraction = window.scrollY / maxScroll;
            if (video.duration) {
                // Clamp fraction between 0 and 1
                const fraction = Math.max(0, Math.min(1, scrollFraction));
                targetTimeRef.current = fraction * video.duration;
            }
        };

        const tick = () => {
            if (video && !isNaN(video.duration) && video.duration > 0) {
                const diff = targetTimeRef.current - video.currentTime;
                video.currentTime += diff * 0.1; // Lower easing for smoother visual flow
            }
            requestRef.current = requestAnimationFrame(tick);
        };

        // Initialize
        updateMaxScroll();

        // Event Listeners
        window.addEventListener("resize", updateMaxScroll);
        window.addEventListener("scroll", handleScroll);

        // Start loop
        requestRef.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("resize", updateMaxScroll);
            window.removeEventListener("scroll", handleScroll);
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
            <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/hero-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
