
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Refrigerator, ChefHat, LogOut, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const navigation = [
    { name: "Journal", href: "/journal", icon: Home },
    { name: "Frigo", href: "/fridge", icon: Refrigerator },
    { name: "Recettes", href: "/recipes", icon: ChefHat },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    return (
        <>
            {/* Mobile Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/90 backdrop-blur-xl border-t border-white/10 md:hidden pb-safe">
                <div className="flex justify-around items-center h-16 relative">
                    {navigation.slice(0, 2).map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                    isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                                )}
                            >
                                <item.icon className={cn("h-6 w-6", isActive && "stroke-2")} strokeWidth={1.5} />
                                <span className="text-[10px] font-medium">{item.name}</span>
                            </Link>
                        );
                    })}

                    <div className="flex flex-col items-center justify-center w-full h-full relative">
                        <Link
                            href="/journal?camera=true"
                            className="absolute -top-6 flex items-center justify-center bg-emerald-500 w-14 h-14 rounded-full border-[6px] border-neutral-900 text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                        >
                            <Camera className="w-6 h-6" strokeWidth={2.5} />
                        </Link>
                    </div>

                    {navigation.slice(2).map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                    isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                                )}
                            >
                                <item.icon className={cn("h-6 w-6", isActive && "stroke-2")} strokeWidth={1.5} />
                                <span className="text-[10px] font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-50 bg-neutral-900 border-r border-white/5">
                <div className="flex items-center justify-center h-16 border-b border-white/5">
                    <h1 className="text-xl font-black tracking-tighter text-white">CALTRACKER</h1>
                </div>
                <div className="flex-1 overflow-y-auto py-6">
                    <nav className="space-y-1 px-3">
                        {navigation.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                            : "text-neutral-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <item.icon className="mr-3 h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-left group"
                    >
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 transition-colors">
                            <LogOut className="w-4 h-4 text-neutral-400 group-hover:text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate group-hover:text-red-400">Se déconnecter</p>
                            <p className="text-xs text-neutral-500 truncate">Terminer la session</p>
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}
