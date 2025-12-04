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

      <main className="relative z-10">
        <Hero />
        <div className="relative">
          {/* Unified Background Video */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover sticky top-0"
            >
              <source src="/about-bg-unicorn.webm" type="video/webm" />
            </video>

          </div>

          <div className="relative z-10">
            <About />
            <Services />
            <Contact />
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
