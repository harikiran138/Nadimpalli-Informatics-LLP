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
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
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
