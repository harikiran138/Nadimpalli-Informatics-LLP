"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles } from "lucide-react";

export function Contact() {
    return (
        <section id="contact" className="py-32 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] -translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[100px] translate-x-1/4" />
            </div>

            <div className="container mx-auto px-4 max-w-5xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Get in Touch</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 tracking-tight">
                        Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Transformation</span>
                    </h2>
                    <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Ready to upgrade your campus with intelligent solutions? Our engineering team is here to help you build the future.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* Glass Card */}
                    <div className="relative rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 overflow-hidden">

                        {/* Decorative Gradient Border Effect */}
                        <div className="absolute inset-0 border border-white/50 rounded-[2.5rem] pointer-events-none" />
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-[2.5rem] -z-10 blur-sm" />

                        <form className="space-y-8 relative z-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                                    <Input
                                        placeholder="John Doe"
                                        className="h-14 rounded-2xl bg-white/50 border-slate-200/60 focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-slate-900 placeholder:text-slate-400 px-6 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                    <Input
                                        placeholder="john@example.com"
                                        className="h-14 rounded-2xl bg-white/50 border-slate-200/60 focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-slate-900 placeholder:text-slate-400 px-6 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Your Message</label>
                                <Textarea
                                    placeholder="Tell us about your requirements..."
                                    className="min-h-[180px] rounded-3xl bg-white/50 border-slate-200/60 focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-slate-900 placeholder:text-slate-400 p-6 resize-none shadow-sm"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button className="h-14 px-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-medium shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 group">
                                    Send Message
                                    <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
