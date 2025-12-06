"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import dynamic from 'next/dynamic';
import { Hero } from "@/components/landing/Hero";
import { useEffect, useRef } from "react";

const About = dynamic(() => import('@/components/landing/About').then(mod => mod.About));
const Services = dynamic(() => import('@/components/landing/Services').then(mod => mod.Services));
const Contact = dynamic(() => import('@/components/landing/Contact').then(mod => mod.Contact));


export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Robust video playback for Safari with Interaction Fallback
    const playVideo = async () => {
      if (videoRef.current) {
        // Explicitly set muted to true for strict browsers
        videoRef.current.muted = true;
        videoRef.current.playbackRate = 0.75;
        try {
          await videoRef.current.play();
        } catch (err) {
          console.warn("Autoplay prevented by browser. Waiting for user interaction.");

          // Fallback: Play on the first user interaction
          const enableVideo = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.error("Interaction play failed:", e));
            }
            // Remove listeners after first attempt
            document.removeEventListener('touchstart', enableVideo);
            document.removeEventListener('click', enableVideo);
            document.removeEventListener('keydown', enableVideo);
          };

          document.addEventListener('touchstart', enableVideo);
          document.addEventListener('click', enableVideo);
          document.addEventListener('keydown', enableVideo);
        }
      }
    };

    playVideo();
  }, []);

  return (
    <div className="min-h-screen text-foreground selection:bg-primary/30 selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="relative min-h-screen">
        {/* Global Fixed Background Video */}
        <div className="fixed inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

        </div>

        {/* Content */}
        <div className="relative z-10">
          <Hero />
          <About />
          <Services />
          <Contact />
          <Footer />
        </div>
      </main>
    </div>
  );
}
