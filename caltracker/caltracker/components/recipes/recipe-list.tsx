
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecipes, deleteRecipe } from "@/lib/actions";
import { Trash2, ChefHat } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { Recipe } from "@/lib/types";
import { EditRecipeDialog } from "./edit-recipe-dialog";

export function RecipeList() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
        queryKey: ['recipes'],
        queryFn: () => getRecipes() as Promise<Recipe[]>,
        enabled: !!user,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });

    if (isLoading) return <div className="text-center text-neutral-600 py-10">Chargement...</div>;

    if (recipes.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChefHat className="w-8 h-8 text-neutral-500" />
                </div>
                <p className="text-neutral-400">Aucune recette créée.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-32">
            {recipes.map((recipe) => (
                <div key={recipe.id} className="glass-panel p-5 rounded-2xl group relative overflow-hidden transition-all hover:bg-white/5">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-white text-lg">{recipe.name}</h3>
                        <div className="flex gap-1">
                            <EditRecipeDialog recipe={recipe} />
                            <button
                                onClick={() => deleteMutation.mutate(recipe.id)}
                                className="text-neutral-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <div className="text-3xl font-black text-white tabular-nums">
                                {recipe.totalCalories}
                                <span className="text-lg font-bold text-neutral-500 ml-1">kcal</span>
                            </div>
                            <p className="text-xs text-neutral-500">
                                {/* @ts-ignore */}
                                {(recipe.ingredients as any[]).length} ingrédients
                            </p>
                        </div>
                    </div>

                    {/* Decor */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
                </div>
            ))}
        </div>
    );
}
