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
                    className="relative rounded-[3rem] bg-white border border-purple-100 shadow-2xl shadow-purple-900/5 p-8 md:p-16 overflow-hidden"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-slate-900">Start Your Transformation</h2>
                        <p className="text-slate-600 text-lg">
                            Ready to upgrade your campus? Get in touch with our engineering team.
                        </p>
                    </div>

                    <form className="space-y-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-4">Name</label>
                                <Input
                                    placeholder="John Doe"
                                    className="h-14 rounded-full bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 px-6"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-4">Email</label>
                                <Input
                                    placeholder="john@example.com"
                                    className="h-14 rounded-full bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 px-6"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-4">Message</label>
                            <Textarea
                                placeholder="Tell us about your requirements..."
                                className="min-h-[150px] rounded-3xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 p-6 resize-none"
                            />
                        </div>

                        <Button className="w-full h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-medium shadow-lg shadow-blue-600/20">
                            Send Message
                        </Button>
                    </form>

                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] pointer-events-none -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-[80px] pointer-events-none -z-10" />
                </motion.div>
            </div>
        </section>
    );
}
