
import { Sidebar } from "@/components/layout/sidebar";
import { ProtectedRoute } from "@/lib/auth-context";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-background text-foreground selection:bg-white/20">
                {/* Sidebar Component (Handles Mobile Bottom Nav + Desktop Sidebar) */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 md:pl-64 pb-20 md:pb-0 min-h-screen relative">
                    <div className="container-centered py-6 md:py-8 animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
