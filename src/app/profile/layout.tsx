export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            {/* Background Video */}
            <div className="fixed inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/about-bg-unicorn.webm" type="video/webm" />
                </video>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
}
