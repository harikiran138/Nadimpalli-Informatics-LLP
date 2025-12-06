import { AuthBackground } from "@/components/ui/AuthBackground";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen text-slate-900 overflow-hidden">
            {/* Background from Login Page */}
            <AuthBackground />

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
}
