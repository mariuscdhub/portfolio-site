import { FoodList } from "@/components/fridge/food-list";
import { CreateFoodDialog } from "@/components/fridge/create-food-dialog";
import { FoodTrashDialog } from "@/components/fridge/food-trash-dialog";

export default function FridgePage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-24">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-white tracking-tighter">Mon Frigo</h1>
                <FoodTrashDialog />
            </div>

            <CreateFoodDialog />
            <FoodList />
        </div>
    );
}
