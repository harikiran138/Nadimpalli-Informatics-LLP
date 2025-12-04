"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);

    const navLinks = [
        { href: "#features", label: "Solutions" },
        { href: "#about", label: "About" },
        { href: "#contact", label: "Contact" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
                    <span className="text-lg font-bold tracking-tight text-white">
                        Nadimpalli Informatics LLP
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Button className="bg-white text-black hover:bg-zinc-200">
                        Get Started
                    </Button>
                </nav>

                {/* Mobile Nav */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-zinc-400">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="border-zinc-800 bg-black text-white">
                        <div className="flex flex-col gap-8 pt-10">
                            <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
                                <span className="text-lg font-bold">Nadimpalli Informatics LLP</span>
                            </Link>
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-lg font-medium text-zinc-400 hover:text-white"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Button className="mt-4 bg-white text-black hover:bg-zinc-200 w-full">
                                    Get Started
                                </Button>
                            </nav>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
