"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles } from "lucide-react";

export function Contact() {
    return (
        <section id="contact" className="py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">

                    {/* Decorative Background Mesh inside the card */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                    <div className="grid lg:grid-cols-5 gap-12 relative z-10">
                        {/* Left Column: Info & Context */}
                        <div className="lg:col-span-2 flex flex-col justify-between">
                            <div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-500 to-black"
                                >
                                    Initialize <br /> Connection
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                                    className="text-black text-lg font-medium leading-relaxed mb-8"
                                >
                                    Ready to deploy intelligent solutions? Establish a direct line to our engineering team.
                                </motion.p>
                            </div>

                            <div className="space-y-6">
                                <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                        <Send className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct Channel</p>
                                        <p className="text-slate-800 font-medium">contact@nadimpalli.info</p>
                                    </div>
                                </div>

                                <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                        <Sparkles className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">HQ Coordinates</p>
                                        <p className="text-slate-800 font-medium">Hyderabad, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: The Interface (Form) */}
                        <div className="lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="relative rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-8 md:p-10"
                            >
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Identity</label>
                                            <Input
                                                placeholder="Full Name"
                                                className="h-14 rounded-xl bg-white/50 border-white/40 focus:bg-white/80 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-slate-900 placeholder:text-slate-400 px-5 shadow-sm font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Communication</label>
                                            <Input
                                                placeholder="Email Address"
                                                className="h-14 rounded-xl bg-white/50 border-white/40 focus:bg-white/80 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-slate-900 placeholder:text-slate-400 px-5 shadow-sm font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Transmission</label>
                                        <Textarea
                                            placeholder="Enter your message parameters..."
                                            className="min-h-[160px] rounded-2xl bg-white/50 border-white/40 focus:bg-white/80 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-slate-900 placeholder:text-slate-400 p-5 resize-none shadow-sm font-medium"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button className="group relative w-44 h-14 rounded-full flex justify-center items-center gap-3 bg-[#1C1A1C] cursor-pointer transition-all duration-450 hover:bg-gradient-to-t hover:from-[#8B5CF6] hover:to-[#EC4899] hover:shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.4),inset_0px_-4px_0px_0px_rgba(0,0,0,0.2),0px_0px_0px_4px_rgba(255,255,255,0.2),0px_0px_180px_0px_#EC4899] hover:-translate-y-0.5">
                                            <span className="text-[#AAAAAA] font-semibold text-sm transition-colors duration-450 group-hover:text-white">Send Message</span>
                                            <Send className="w-4 h-4 text-[#AAAAAA] transition-all duration-800 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
