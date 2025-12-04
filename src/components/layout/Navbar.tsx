"use client";

import { Home, User, Briefcase, Phone, FileText } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

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
                    <span className="text-lg font-bold tracking-tight text-white drop-shadow-md">
                        Nadimpalli Informatics LLP
                    </span>
                </div>
            </div>

            <NavBar items={navItems}>
                {/* Additional items not part of the main navItems array, placed at the end of the navbar */}
                <Link href="/login">
                    <Button variant="ghost" className="text-muted-foreground hover:text-white hover:bg-white/10">
                        Login
                    </Button>
                </Link>
            </NavBar>
        </>
    );
}
```
