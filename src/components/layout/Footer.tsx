import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
    return (
        <footer className="w-full bg-white/5 backdrop-blur-md border-t border-white/10 py-8 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 via-gray-500 to-black bg-clip-text text-transparent">
                                Nadimpalli Informatics
                            </span>
                        </div>
                        <p className="text-black font-medium leading-relaxed text-sm max-w-xs">
                            Innovating the future of digital solutions. Building tomorrow, today.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-gray-800 via-gray-500 to-black bg-clip-text text-transparent">
                            Solutions
                        </h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link href="#" className="text-slate-800 hover:text-black font-medium transition-colors">Software Development</Link></li>
                            <li><Link href="#" className="text-slate-800 hover:text-black font-medium transition-colors">Cloud Architecture</Link></li>
                            <li><Link href="#" className="text-slate-800 hover:text-black font-medium transition-colors">Data Analytics</Link></li>
                            <li><Link href="#" className="text-slate-800 hover:text-black font-medium transition-colors">AI Integration</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-gray-800 via-gray-500 to-black bg-clip-text text-transparent">
                            Company
                        </h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link href="#" className="text-slate-800 hover:text-black font-medium transition-colors">About Us</Link></li>
                            <li><Link href="#" className="text-slate-800 hover:text-black font-medium transition-colors">Careers</Link></li>
                            <li><Link href="#" className="text-slate-800 hover:text-black font-medium transition-colors">Blog</Link></li>
                            <li><Link href="#" className="text-slate-800 hover:text-black font-medium transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-gray-800 via-gray-500 to-black bg-clip-text text-transparent">
                            Legal
                        </h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link href="#" className="text-slate-800 hover:text-black font-medium transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-slate-800 hover:text-black font-medium transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-6 bg-slate-200/20" />

                <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-xs font-medium text-slate-600">
                    <p>&copy; {new Date().getFullYear()} Nadimpalli Informatics LLP. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-black transition-colors">Twitter</Link>
                        <Link href="#" className="hover:text-black transition-colors">LinkedIn</Link>
                        <Link href="#" className="hover:text-black transition-colors">GitHub</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
