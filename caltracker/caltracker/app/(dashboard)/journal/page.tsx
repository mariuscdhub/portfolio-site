"use client";

import { useState, Suspense } from "react";
import { format, subDays, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { DailyProgress } from "@/components/dashboard/daily-progress";
import { AddFoodForm } from "@/components/dashboard/add-food-form";
import { LogList } from "@/components/dashboard/log-list";

export default function JournalPage() {
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const handlePrevDay = () => {
        setSelectedDate(format(subDays(new Date(selectedDate), 1), 'yyyy-MM-dd'));
    };

    const handleNextDay = () => {
        setSelectedDate(format(addDays(new Date(selectedDate), 1), 'yyyy-MM-dd'));
    };

    const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

    // Formatting the display date 
    const displayDate = isToday
        ? "Aujourd'hui"
        : format(new Date(selectedDate), 'EEEE d MMMM', { locale: fr });

    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-24">
            {/* Date Navigation Header */}
            <div className="flex items-center justify-between glass-panel p-3 rounded-2xl mb-6">
                <button
                    onClick={handlePrevDay}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-neutral-400 hover:text-white"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="relative flex items-center gap-2 group cursor-pointer">
                    <CalendarIcon className="w-5 h-5 text-emerald-400" />
                    <h2 className="font-bold text-white text-lg capitalize">{displayDate}</h2>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                </div>

                <button
                    onClick={handleNextDay}
                    disabled={isToday}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            <DailyProgress currentDate={selectedDate} />
            <Suspense fallback={<div className="h-64 rounded-3xl animate-pulse bg-white/5" />}>
                <AddFoodForm currentDate={selectedDate} />
            </Suspense>
            <LogList currentDate={selectedDate} />
        </div>
    );
}
