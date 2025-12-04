"use client";

import Link from "next/link";
import { Home, User, Briefcase, Phone } from 'lucide-react';
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const navItems = [
        { name: 'Home', url: '/', icon: Home },
        { name: 'About', url: '#about', icon: User },
        { name: 'Solutions', url: '#services', icon: Briefcase },
        { name: 'Contact', url: '#contact', icon: Phone }
    ]

    return (
        <>
            {/* Logo - kept separate as TubelightNavbar is centered */}
            <div className="fixed top-6 left-6 z-50 hidden md:block">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-tight text-[#0b3a7a]">
                        Nadimpalli Informatics LLP
                    </span>
                </div>
            </div>

            {/* Login Button - Fixed top right */}
            <div className="fixed top-6 right-6 z-50 hidden md:block">
                <Link href="/login">
                    <button className="relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 group">
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-all duration-300 group-hover:bg-slate-900">
                            Login
                        </span>
                    </button>
                </Link>
            </div>

            <NavBar items={navItems} />
        </>
    );
}
