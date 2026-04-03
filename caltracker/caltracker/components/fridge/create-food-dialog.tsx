
"use client";

import { useState } from "react";
import { Plus, X, Flame, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCustomFood } from "@/lib/actions";

export function CreateFoodDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [type, setType] = useState<'cru' | 'cuit'>('cru');

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: addCustomFood,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['foods'] });
            setIsOpen(false);
            setName("");
            setCalories("");
            setProtein("");
            setType("cru");
        },
    });

    const handleSubmit = () => {
        if (!name || !calories || !protein) return;
        mutation.mutate({
            name,
            calories: parseInt(calories),
            protein: parseFloat(protein),
            type,
        });
    };

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="glass-panel p-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors group"
            >
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Nouvel Aliment</h3>
                    <p className="text-sm text-neutral-400">Ajouter un produit personnalisé</p>
                </div>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-panel w-full max-w-md p-6 rounded-3xl relative animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-black text-white mb-6">Créer un Aliment</h2>

                        <div className="space-y-4">
                            {/* Type Toggle */}
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                <button
                                    onClick={() => setType('cru')}
                                    className={cn(
                                        "flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                                        type === 'cru' ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "text-neutral-500 hover:text-neutral-300"
                                    )}
                                >
                                    CRU
                                </button>
                                <button
                                    onClick={() => setType('cuit')}
                                    className={cn(
                                        "flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                                        type === 'cuit' ? "bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "text-neutral-500 hover:text-neutral-300"
                                    )}
                                >
                                    CUIT
                                </button>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom de l'aliment (ex: Pâtes Complètes)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                                />
                                <div className="flex gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="number"
                                            placeholder="Kcal"
                                            value={calories}
                                            onChange={(e) => setCalories(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-500 font-bold uppercase">/100g</span>
                                    </div>
                                    <div className="flex-1 relative">
                                        <input
                                            type="number"
                                            placeholder="Prot"
                                            value={protein}
                                            onChange={(e) => setProtein(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-500 font-bold uppercase">/100g</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!name || !calories || !protein || mutation.isPending}
                                className="w-full bg-white text-black font-black text-lg py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {mutation.isPending ? "CRÉATION..." : "ENREGISTRER"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
