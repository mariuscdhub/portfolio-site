
export function StreakCard() {
    const currentStreak = 5; // Mock data for preview

    return (
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden text-center transition-transform hover:scale-[1.02]">
            <div className="relative z-10">
                <div className="text-6xl mb-4 animate-bounce">🔥</div>
                <div className="text-7xl font-black tabular-nums text-transparent bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text mb-2 drop-shadow-sm">
                    {currentStreak}
                </div>
                <div className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
                    Jours Consécutifs
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />
        </div>
    );
}
