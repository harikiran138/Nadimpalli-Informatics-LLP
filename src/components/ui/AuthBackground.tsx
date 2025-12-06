"use client";

import { motion } from "framer-motion";

export function AuthBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Background Color */}
            <div className="absolute inset-0 bg-[#E0E5EC]" />

            {/* Large Ring */}
            <motion.div
                animate={{ rotate: 360, y: [0, -20, 0] }}
                transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full border-[40px] border-slate-200/60 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] z-0 opacity-60"
            />

            {/* Small Sphere Top Left */}
            <motion.div
                animate={{ y: [0, 30, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[10%] w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 shadow-[10px_10px_30px_#bebebe,-10px_-10px_30px_#ffffff] z-0"
            />

            {/* Sphere Bottom Right */}
            <motion.div
                animate={{ y: [0, -40, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[10%] right-[20%] w-40 h-40 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 shadow-[15px_15px_45px_#bebebe,-15px_-15px_45px_#ffffff] z-0"
            />

            {/* Donut/Torus Shape Bottom Left */}
            <motion.div
                animate={{ rotate: -360, x: [0, 20, 0] }}
                transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, x: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute bottom-[-5%] left-[-5%] w-80 h-80 rounded-full border-[30px] border-slate-200/50 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] z-0 opacity-50"
            />
        </div>
    );
}
