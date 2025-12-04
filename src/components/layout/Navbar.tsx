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
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
                    <span className="text-lg font-bold tracking-tight text-[#0b3a7a]">
                        Nadimpalli Informatics LLP
                    </span>
                </div>
            </div>

            {/* Login Button - Fixed top right */}
            <div className="fixed top-6 right-6 z-50 hidden md:block">
                <Link href="/login">
                    <Button variant="ghost" className="text-muted-foreground hover:text-white hover:bg-white/10 backdrop-blur-md border border-white/5">
                        Login
                    </Button>
                </Link>
            </div>

            <NavBar items={navItems} />
        </>
    );
}
