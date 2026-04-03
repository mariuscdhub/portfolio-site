
import { StatsCards } from "@/components/stats/stats-cards";
import { WeeklyChart } from "@/components/stats/weekly-chart";
import { StreakCard } from "@/components/stats/streak-card";

export default function StatsPage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-24 animate-fade-in relative z-10">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-white tracking-tighter">Statistiques</h1>
            </div>

            {/* Streak Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StreakCard />
                <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center">
                    <p className="text-neutral-400 text-sm font-bold uppercase mb-1">Moyenne Hebdo</p>
                    <h3 className="text-3xl font-black text-white">2150 <span className="text-sm font-medium text-neutral-500">kcal</span></h3>
                </div>
            </div>

            {/* Charts */}
            <WeeklyChart />

            {/* Calendar Placeholder */}
            <div className="glass-panel p-6 rounded-3xl h-64 flex flex-col items-center justify-center text-neutral-500 border-dashed border-neutral-800">
                <p>Calendrier Mensuel (Bientôt disponible)</p>
            </div>
        </div>
    );
}
