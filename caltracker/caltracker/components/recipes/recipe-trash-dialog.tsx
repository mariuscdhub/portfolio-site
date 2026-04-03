"use client";

import { useState } from "react";
import { Trash2, X, RefreshCcw, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDeletedRecipes, restoreRecipe, hardDeleteRecipe, emptyRecipeTrash } from "@/lib/actions";

export function RecipeTrashDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: deletedRecipes = [], isLoading } = useQuery<any[]>({
        queryKey: ['recipes', 'trash'],
        queryFn: () => getDeletedRecipes(),
        enabled: isOpen,
    });

    const restoreMutation = useMutation({
        mutationFn: restoreRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });

    const hardDeleteMutation = useMutation({
        mutationFn: hardDeleteRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes', 'trash'] });
        },
    });

    const emptyTrashMutation = useMutation({
        mutationFn: emptyRecipeTrash,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes', 'trash'] });
        },
    });

    const getDaysRemaining = (deletedAt: number) => {
        const remaining = 30 * 24 * 60 * 60 * 1000 - (Date.now() - deletedAt);
        const days = Math.ceil(remaining / (1000 * 60 * 60 * 24));
        return Math.max(0, days);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-3 bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all relative group"
                title="Corbeille Recettes"
            >
                <Trash2 className="w-6 h-6" />
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-panel w-full max-w-2xl p-6 rounded-3xl relative animate-slide-up max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-6 top-6 p-2 text-neutral-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6 pr-10 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <Trash2 className="text-red-500" />
                                    Corbeille Recettes
                                </h2>
                                <p className="text-neutral-400 mt-1">
                                    Les recettes sont supprimées définitivement après 30 jours.
                                </p>
                            </div>

                            {deletedRecipes.length > 0 && (
                                <button
                                    onClick={() => emptyTrashMutation.mutate()}
                                    disabled={emptyTrashMutation.isPending}
                                    className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                                >
                                    <AlertTriangle className="w-4 h-4" />
                                    Tout vider
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {isLoading ? (
                                <div className="text-center py-10 text-neutral-500">Chargement...</div>
                            ) : deletedRecipes.length === 0 ? (
                                <div className="text-center py-20 text-neutral-500">
                                    La corbeille est vide.
                                </div>
                            ) : (
                                deletedRecipes.map((recipe) => (
                                    <div key={recipe.id} className="glass-panel border-red-500/10 p-4 rounded-xl flex items-center justify-between group">
                                        <div>
                                            <h4 className="font-bold text-neutral-300 line-through">{recipe.name}</h4>
                                            <p className="text-xs text-red-400 mt-1">
                                                Supprimé définitivement dans {getDaysRemaining(recipe.deletedAt)} jours
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => restoreMutation.mutate(recipe.id)}
                                                disabled={restoreMutation.isPending}
                                                className="p-2 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors font-semibold"
                                                title="Restaurer"
                                            >
                                                <RefreshCcw className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => hardDeleteMutation.mutate(recipe.id)}
                                                disabled={hardDeleteMutation.isPending}
                                                className="p-2 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-semibold"
                                                title="Supprimer définitivement"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
