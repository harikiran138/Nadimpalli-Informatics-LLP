"use client";

import { useEffect, useRef } from "react";

interface BackgroundVideoProps {
    src: string;
    className?: string;
    poster?: string;
}

export default function BackgroundVideo({ src, className, poster }: BackgroundVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Robust video playback for Safari with Interaction Fallback
        const playVideo = async () => {
            if (videoRef.current) {
                // FAST FIX: Directly set attributes for Safari (React sometimes lags)
                videoRef.current.setAttribute('muted', '');
                videoRef.current.setAttribute('playsinline', '');
                videoRef.current.setAttribute('autoplay', '');

                videoRef.current.muted = true;

                // Wait a tick for the DOM to update attributes
                await new Promise(resolve => setTimeout(resolve, 50));

                // Only set playback rate if supported
                if (videoRef.current.readyState >= 1) {
                    videoRef.current.playbackRate = 0.75;
                }

                try {
                    const playPromise = videoRef.current.play();
                    if (playPromise !== undefined) {
                        await playPromise;
                    }
                } catch (err) {
                    console.warn("Autoplay prevented by browser. Waiting for interaction.");

                    const enableVideo = () => {
                        if (videoRef.current) {
                            videoRef.current.play().catch(e => console.error("Interaction play failed:", e));
                        }
                        ['touchstart', 'click', 'keydown'].forEach(evt =>
                            document.removeEventListener(evt, enableVideo)
                        );
                    };

                    ['touchstart', 'click', 'keydown'].forEach(evt =>
                        document.addEventListener(evt, enableVideo)
                    );
                }
            }
        };

        playVideo();
    }, [src]); // Re-run if src changes

    return (
        <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="auto"
            className={className || "w-full h-full object-cover"}
            // Adding standard attributes for React as well
            autoPlay
            poster={poster}
        >
            <source src={src} type={src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
        </video>
    );
}
