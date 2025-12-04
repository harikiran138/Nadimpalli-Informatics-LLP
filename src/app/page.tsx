import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Services } from "@/components/landing/Services";
import { Contact } from "@/components/landing/Contact";


export default function Home() {
  return (
    <div className="min-h-screen text-foreground selection:bg-primary/30 selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="relative min-h-screen">
        {/* Global Fixed Background Video */}
        <div className="fixed inset-0 z-0">
          <video
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
