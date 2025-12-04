import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
    return (
        <footer className="bg-black py-12 text-zinc-400">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-gradient-to-br from-blue-500 to-purple-600" />
                            <span className="text-lg font-bold text-white">Nadimpalli Informatics</span>
                        </div>
                        <p className="text-sm">
                            Innovating the future of digital solutions. Building tomorrow, today.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-white">Solutions</h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link href="#" className="hover:text-white">Software Development</Link></li>
                            <li><Link href="#" className="hover:text-white">Cloud Architecture</Link></li>
                            <li><Link href="#" className="hover:text-white">Data Analytics</Link></li>
                            <li><Link href="#" className="hover:text-white">AI Integration</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-white">Company</h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link href="#" className="hover:text-white">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-white">Legal</h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 bg-zinc-800" />

                <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-xs">
                    <p>&copy; {new Date().getFullYear()} Nadimpalli Informatics LLP. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-white">Twitter</Link>
                        <Link href="#" className="hover:text-white">LinkedIn</Link>
                        <Link href="#" className="hover:text-white">GitHub</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
