"use client";

import { useState, useEffect } from "react";
import { Search, X, ChefHat, Save, Edit2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFoods, updateRecipe, type CustomFood } from "@/lib/actions";
import { Recipe } from "@/lib/types";

type FoodItem = CustomFood;

interface RecipeIngredient {
    foodId: string;
    name: string;
    type: 'cru' | 'cuit';
    weight: number;
    calories: number;
    protein: number;
}

interface EditRecipeDialogProps {
    recipe: Recipe;
}

export function EditRecipeDialog({ recipe }: EditRecipeDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Recipe fields (initialized with recipe props)
    const [recipeName, setRecipeName] = useState(recipe.name);
    const [recipeNotes, setRecipeNotes] = useState(recipe.notes || "");
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>(recipe.ingredients as any || []);

    // Reset fields when dialog is opened (in case of stale data)
    useEffect(() => {
        if (isOpen) {
            setRecipeName(recipe.name);
            setRecipeNotes(recipe.notes || "");
            setIngredients(recipe.ingredients as any || []);
        }
    }, [isOpen, recipe]);

    // Ingredient search & add fields
    const [search, setSearch] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [weightInput, setWeightInput] = useState("");
    const [caloriesInput, setCaloriesInput] = useState("");

    const queryClient = useQueryClient();

    const { data: customFoods = [] } = useQuery({
        queryKey: ['foods', search],
        queryFn: () => getFoods(search),
        enabled: search.length > 0 && isOpen,
    });

    const filteredFoods = customFoods.filter(
        (f) => f.name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 5);

    const getKcalPer100g = () => {
        if (!selectedFood) return 0;
        return selectedFood.calories || 0;
    };

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setWeightInput(val);
        const w = parseInt(val);
        if (!isNaN(w) && w > 0) {
            const cals = Math.round((getKcalPer100g() * w) / 100);
            setCaloriesInput(cals.toString());
        } else {
            setCaloriesInput("");
        }
    };

    const handleCaloriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCaloriesInput(val);
        const cals = parseInt(val);
        const currentKcalPer100g = getKcalPer100g();
        if (!isNaN(cals) && cals > 0 && currentKcalPer100g > 0) {
            const w = Math.round((cals * 100) / currentKcalPer100g);
            setWeightInput(w.toString());
        } else {
            setWeightInput("");
        }
    };

    const handleSelectFood = (food: FoodItem) => {
        setSelectedFood(food);
        setSearch("");
        setWeightInput("");
        setCaloriesInput("");
    };

    const handleAddIngredient = () => {
        if (!selectedFood || !weightInput || !caloriesInput) return;
        const w = parseInt(weightInput);
        const c = parseInt(caloriesInput);
        const p = Math.round((selectedFood.protein * w / 100) * 10) / 10;

        const newIngredient: RecipeIngredient = {
            foodId: String(selectedFood.id),
            name: selectedFood.name,
            type: selectedFood.type,
            weight: w,
            calories: c,
            protein: p,
        };

        setIngredients([...ingredients, newIngredient]);
        setSelectedFood(null);
        setWeightInput("");
        setCaloriesInput("");
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);

    const updateMutation = useMutation({
        mutationFn: (data: any) => updateRecipe(recipe.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            setIsOpen(false);
        }
    });

    const handleSaveRecipe = () => {
        if (!recipeName || ingredients.length === 0) return;
        updateMutation.mutate({
            name: recipeName,
            totalCalories,
            ingredients,
            notes: recipeNotes
        });
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="text-neutral-500 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                title="Modifier"
            >
                <Edit2 className="w-5 h-5" />
            </button>
        );
    }

    return (
        <div className="mb-8 glass-panel p-6 rounded-3xl animate-in slide-in-from-top-4 relative z-20">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <ChefHat className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-black text-white">Modifier Recette</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Recipe Name */}
                <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Nom de la recette</label>
                    <input
                        type="text"
                        placeholder="Ex: Poulet Curry Coco..."
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                    />
                </div>

                {/* Add Ingredients Section */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-4">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Ajouter un ingrédient</label>

                    {!selectedFood ? (
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                            <input
                                type="text"
                                placeholder="Rechercher un aliment..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                            />
                            {(search || isFocused) && filteredFoods.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">
                                    {filteredFoods.map(food => {
                                        const calories = food.calories;
                                        return (
                                            <button
                                                key={food.id}
                                                onClick={() => handleSelectFood(food)}
                                                className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                            >
                                                <div className="text-left flex items-center gap-2">
                                                    <span className={cn(
                                                        "w-2 h-2 rounded-full",
                                                        food.type === 'cru' ? "bg-emerald-500" : "bg-orange-500"
                                                    )} />
                                                    <span className="text-white font-medium">{food.name}</span>
                                                </div>
                                                <div className="text-xs text-neutral-500 font-mono">
                                                    {calories} kcal/100g
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in zoom-in-95">
                            <div className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "w-2 h-2 rounded-full",
                                        selectedFood.type === 'cru' ? "bg-emerald-500" : "bg-orange-500"
                                    )} />
                                    <span className="text-white font-bold">{selectedFood.name}</span>
                                </div>
                                <button onClick={() => setSelectedFood(null)} className="p-1 hover:bg-white/10 rounded-full text-neutral-500">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        type="number"
                                        placeholder="Poids"
                                        value={weightInput}
                                        onChange={handleWeightChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 text-center font-mono"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 text-xs font-bold">g</span>
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="number"
                                        placeholder="Calories"
                                        value={caloriesInput}
                                        onChange={handleCaloriesChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-emerald-400 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 text-center font-black"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 text-[10px] font-bold uppercase">Kcal</span>
                                </div>
                            </div>

                            <button
                                onClick={handleAddIngredient}
                                disabled={!weightInput || !caloriesInput}
                                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Ajouter à la recette
                            </button>
                        </div>
                    )}
                </div>

                {/* Ingredients List */}
                {ingredients.length > 0 && (
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Ingrédients</label>
                        {ingredients.map((ing, i) => (
                            <div key={i} className="flex justify-between items-center bg-black/40 p-3 rounded-xl text-sm border border-white/5">
                                <div className="flex-1">
                                    <span className="text-white font-medium">{ing.name}</span>
                                    <div className="flex gap-2 text-xs text-neutral-500 mt-0.5">
                                        <span>{ing.weight}g</span>
                                        <span>•</span>
                                        <span className="text-emerald-400/80">{ing.calories} kcal</span>
                                    </div>
                                </div>
                                <button onClick={() => handleRemoveIngredient(i)} className="p-2 hover:bg-red-500/10 hover:text-red-500 text-neutral-600 rounded-lg transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recipe Notes */}
                <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Notes / Étapes</label>
                    <textarea
                        rows={3}
                        placeholder="Ex: Préchauffer le four, mélanger les ingrédients..."
                        value={recipeNotes}
                        onChange={(e) => setRecipeNotes(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 resize-none"
                    />
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold">Total Calorique</p>
                        <p className="text-2xl font-black text-white tabular-nums">{totalCalories} <span className="text-sm font-medium text-neutral-500">kcal</span></p>
                    </div>
                    <button
                        onClick={handleSaveRecipe}
                        disabled={!recipeName || ingredients.length === 0 || updateMutation.isPending}
                        className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                        <Save className="w-5 h-5" />
                        {updateMutation.isPending ? "Sauvegarde..." : "Enregistrer"}
                    </button>
                </div>
            </div>
        </div>
    );
}
