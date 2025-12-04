"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Contact() {
    return (
        <section id="contact" className="py-32 relative">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3rem] bg-black/40 border border-white/10 backdrop-blur-xl p-8 md:p-16 overflow-hidden"
                >
                    {/* Neon Glow Borders */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(20,123,255,0.5)]" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(20,123,255,0.5)]" />

                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Start Your Transformation</h2>
                        <p className="text-muted-foreground">
                            Ready to upgrade your campus? Get in touch with our engineering team.
                        </p>
                    </div>

                    <form className="space-y-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground ml-4">Name</label>
                                <Input
                                    placeholder="John Doe"
                                    className="h-14 rounded-full bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-white/20 px-6"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground ml-4">Email</label>
                                <Input
                                    placeholder="john@example.com"
                                    className="h-14 rounded-full bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-white/20 px-6"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground ml-4">Message</label>
                            <Textarea
                                placeholder="Tell us about your requirements..."
                                className="min-h-[150px] rounded-3xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-white/20 p-6 resize-none"
                            />
                        </div>

                        <Button className="w-full h-14 rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-lg font-medium shadow-[0_0_30px_rgba(20,123,255,0.3)]">
                            Send Message
                        </Button>
                    </form>

                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
                </motion.div>
            </div>
        </section>
    );
}
