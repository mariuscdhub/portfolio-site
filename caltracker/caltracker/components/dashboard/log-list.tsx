"use client";

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDailyLogs, deleteLog } from "@/lib/actions";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { Log } from "@/lib/types";

interface LogListProps {
    currentDate: string;
}

export function LogList({ currentDate }: LogListProps) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: logs, isLoading } = useQuery<Log[]>({
        queryKey: ['logs', currentDate],
        queryFn: () => getDailyLogs(currentDate) as Promise<Log[]>,
        enabled: !!user,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteLog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['logs', currentDate] });
        },
    });

    if (isLoading) {
        return <div className="text-center py-10 text-neutral-600">Chargement...</div>;
    }

    if (!logs || logs.length === 0) {
        return (
            <div className="text-center py-10 text-neutral-600">
                Aucun aliment journalisé aujourd'hui.
            </div>
        );
    }

    const isToday = currentDate === format(new Date(), 'yyyy-MM-dd');

    return (
        <div className="space-y-3 pb-32 animate-fade-in">
            <h3 className="text-lg font-bold text-white px-1 mt-6">
                {isToday ? "Aujourd'hui" : "Historique du " + format(new Date(currentDate), 'dd/MM/yyyy')}
            </h3>

            {logs.map((log) => (
                <div
                    key={log.id}
                    className={cn(
                        "glass-panel p-4 rounded-xl flex items-center justify-between group transition-transform active:scale-[0.99]",
                        log.type === 'cru' ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-orange-500"
                    )}
                >
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white text-base">{log.name}</h4>
                            <div className="flex flex-col items-end">
                                <span className="text-neutral-500 text-xs font-mono">{format(new Date(log.createdAt || Date.now()), 'HH:mm')}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 text-sm mt-1">
                            <span className="text-white font-bold">{log.calories} <span className="text-xs font-normal text-neutral-500">kcal</span></span>
                            <span className="text-neutral-400">{log.weight}g</span>
                            <span className="text-emerald-400/80 font-medium">{log.protein}g <span className="text-xs text-neutral-600">prot</span></span>
                        </div>
                    </div>

                    <button
                        onClick={() => deleteMutation.mutate(log.id)}
                        disabled={deleteMutation.isPending}
                        className="ml-4 p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    );
}
