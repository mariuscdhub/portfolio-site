
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDailyLogs, getDailyGoal, updateDailyGoal } from "@/lib/actions";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { Log } from "@/lib/types";
import { useState } from "react";

interface DailyProgressProps {
    currentDate: string;
}

export function DailyProgress({ currentDate }: DailyProgressProps) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");

    const { data: logs = [] } = useQuery<Log[]>({
        queryKey: ['logs', currentDate],
        queryFn: () => getDailyLogs(currentDate) as Promise<Log[]>,
        enabled: !!user,
    });

    const { data: goal = 2500 } = useQuery({
        queryKey: ['goal'],
        queryFn: () => getDailyGoal(),
        enabled: !!user,
    });

    const updateGoalMutation = useMutation({
        mutationFn: updateDailyGoal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goal'] });
            setIsEditing(false);
        }
    });

    const current = logs.reduce((acc, log) => acc + log.calories, 0);
    const percentage = Math.min((current / goal) * 100, 100);
    const remaining = Math.max(0, goal - current);

    const handleGoalClick = () => {
        setEditValue(goal.toString());
        setIsEditing(true);
    };

    const handleGoalSubmit = () => {
        const newGoal = parseInt(editValue, 10);
        if (!isNaN(newGoal) && newGoal > 0) {
            updateGoalMutation.mutate(newGoal);
        } else {
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleGoalSubmit();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    return (
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden transition-all hover:border-white/20">
            <div className="flex justify-between items-end mb-4 relative z-10">
                <div>
                    <p className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-1">Calories Restantes</p>
                    <h2 className="text-4xl font-black text-white tracking-tight tabular-nums">{remaining}</h2>
                </div>
                <div className="text-right">
                    <p className="text-sm text-neutral-400">Objectif</p>
                    {isEditing ? (
                        <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleGoalSubmit}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="bg-black/50 border border-neutral-700 rounded px-2 py-1 text-white font-bold tabular-nums w-20 text-right outline-none focus:border-emerald-500"
                        />
                    ) : (
                        <p
                            className="font-bold tabular-nums text-white cursor-pointer hover:text-emerald-400 transition-colors"
                            onClick={handleGoalClick}
                            title="Modifier l'objectif"
                        >
                            {goal}
                        </p>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 relative z-10">
                <div
                    className="h-full transition-all duration-1000 ease-out bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-400"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Background Decor */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        </div>
    );
}
