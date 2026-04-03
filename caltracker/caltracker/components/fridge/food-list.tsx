"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFoods, deleteFood, addCustomFood } from "@/lib/actions";
import { generateFoodNutritionAI } from "@/lib/ai-actions";
import { Trash2, Search, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { Food } from "@/lib/types";
import { useState } from "react";

export function FoodList() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");

    const { data: foods = [], isLoading, isError, error } = useQuery<Food[]>({
        queryKey: ['foods', 'all'],
        queryFn: () => getFoods("") as Promise<Food[]>,
        enabled: !!user,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteFood,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['foods'] });
        },
    });

    const aiMutation = useMutation({
        mutationFn: async (foodName: string) => {
            const data = await generateFoodNutritionAI(foodName);
            await addCustomFood({ name: data.displayName, calories: data.raw.calories, protein: data.raw.protein, type: 'cru' });
            await addCustomFood({ name: data.displayName, calories: data.cooked.calories, protein: data.cooked.protein, type: 'cuit' });
            return data.displayName;
        },
        onSuccess: (displayName) => {
            queryClient.invalidateQueries({ queryKey: ['foods'] });
            setSearch("");
            alert(`${displayName} ajouté avec succès (Versions Cru & Cuit) !`);
        },
        onError: (err: any) => {
            alert(err.message || "Impossible de trouver cet aliment via l'IA");
        }
    });

    const filteredFoods = foods.filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div className="text-center text-neutral-600 py-10">Chargement...</div>;
    if (isError) return (
        <div className="text-center py-10 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <p className="text-red-400 font-bold mb-2">Erreur de base de données 🚨</p>
            <p className="text-red-300 text-sm">{error instanceof Error ? error.message : 'Impossible de récupérer les aliments.'}</p>
            <p className="text-neutral-400 text-xs mt-4">Vérifiez les règles de sécurité Firebase ou votre connexion.</p>
        </div>
    );

    return (
        <div className="space-y-6 pb-32">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                    type="text"
                    placeholder="Rechercher un aliment dans le frigo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 focus:bg-black/70 transition-all"
                />
            </div>

            {filteredFoods.length === 0 ? (
                <div className="text-center py-10 flex flex-col items-center gap-5">
                    <p className="text-neutral-500 text-lg">Aucun aliment trouvé pour "{search}".</p>

                    {search.length > 2 && (
                        <button
                            onClick={() => aiMutation.mutate(search)}
                            disabled={aiMutation.isPending}
                            className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-6 py-3 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] active:scale-95 disabled:opacity-50 disabled:cursor-wait font-bold"
                        >
                            {aiMutation.isPending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Sparkles className="w-5 h-5 text-amber-400" />
                            )}
                            {aiMutation.isPending ? "Analyse IA de l'aliment..." : "Rechercher avec l'IA"}
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredFoods.map((food) => {
                        // @ts-ignore
                        const calories = food.kcal || food.calories;

                        return (
                            <div key={food.id} className="glass-panel p-4 rounded-xl flex justify-between items-center group">
                                <div>
                                    <h4 className="font-bold text-white">{food.name}</h4>
                                    <div className="flex gap-2 text-xs text-neutral-400 mt-1 items-center">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded uppercase font-bold",
                                            food.type === 'cru' ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                                        )}>
                                            {food.type}
                                        </span>
                                        <span className="text-white/60 font-mono">{calories} kcal / 100g</span>
                                        <span className="text-blue-400 font-mono">{food.protein}g Prot</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteMutation.mutate(food.id as string)}
                                    disabled={deleteMutation.isPending}
                                    className="text-neutral-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
