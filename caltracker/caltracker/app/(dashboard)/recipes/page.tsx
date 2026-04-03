import { RecipeList } from "@/components/recipes/recipe-list";
import { CreateRecipeDialog } from "@/components/recipes/create-recipe-dialog";
import { RecipeTrashDialog } from "@/components/recipes/recipe-trash-dialog";

export default function RecipesPage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-24">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-white tracking-tighter">Mes Recettes</h1>
                <RecipeTrashDialog />
            </div>

            <CreateRecipeDialog />
            <RecipeList />
        </div>
    );
}
