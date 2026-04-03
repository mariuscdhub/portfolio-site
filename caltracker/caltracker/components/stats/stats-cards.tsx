
"use client";

import { Flame, Trophy, TrendingUp, Calendar } from "lucide-react";

export function StatsCards({ streak }: { streak: number }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-neutral-400 text-xs font-bold uppercase">Série actuelle</p>
                    <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-3xl font-black text-white">{streak} <span className="text-sm font-medium text-neutral-500">Jours</span></h3>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-colors" />
            </div>

            <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-neutral-400 text-xs font-bold uppercase">Record</p>
                    <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="text-3xl font-black text-white">{streak} <span className="text-sm font-medium text-neutral-500">Jours</span></h3>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-colors" />
            </div>
        </div>
    );
}
