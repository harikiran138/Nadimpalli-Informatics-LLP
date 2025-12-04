import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { About } from "@/components/landing/About";
import { Services } from "@/components/landing/Services";
import { Contact } from "@/components/landing/Contact";
import { ScrollVideoBackground } from "@/components/landing/ScrollVideoBackground";

export default function Home() {
  return (
    <div className="min-h-screen text-foreground selection:bg-primary/30 selection:text-white overflow-x-hidden">
      <Navbar />
      <ScrollVideoBackground />

      <main className="relative z-10">
        <Services />
        <About />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
