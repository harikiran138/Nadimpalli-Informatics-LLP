import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Services } from "@/components/landing/Services";
import { Trust } from "@/components/landing/Trust";
import { Contact } from "@/components/landing/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white overflow-x-hidden">
      <Navbar />

      <main>
        <Hero />
        <Trust />
        <About />
        <Services />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
