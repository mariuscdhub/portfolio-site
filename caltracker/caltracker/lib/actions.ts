import { db, auth } from "@/lib/firebase";
import type { Log } from "@/lib/types";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    Timestamp,
    updateDoc,
    serverTimestamp,
    setDoc,
    limit,
    deleteField
} from "firebase/firestore";

// --- HELPERS ---

const getUserId = () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Unauthorized");
    return user.uid;
};

// --- FOOD ACTIONS ---

export interface CustomFood {
    id: string;
    name: string;
    calories: number;
    protein: number;
    type: 'cru' | 'cuit';
    userId: string;
    createdAt?: any;
    deletedAt?: any;
}
import { INITIAL_FOODS } from "@/lib/data/initial-foods";

export async function seedInitialFoodsIfNeeded(userId: string) {
    const settingsQ = query(collection(db, "user_settings"), where("userId", "==", userId), limit(1));
    const settingsSnap = await getDocs(settingsQ);

    let hasSeeded = false;
    let settingsDocId = null;

    if (!settingsSnap.empty) {
        hasSeeded = settingsSnap.docs[0].data().hasSeededFoods;
        settingsDocId = settingsSnap.docs[0].id;
    }

    if (!hasSeeded) {
        // Run migration
        console.log("Migrating base foods to user database...");
        const promises = INITIAL_FOODS.map(f => {
            return addDoc(collection(db, "foods"), {
                userId,
                name: f.name,
                calories: f.kcal,
                protein: f.protein,
                type: f.type,
                createdAt: serverTimestamp()
            });
        });
        await Promise.all(promises);

        // Mark as seeded
        if (settingsDocId) {
            await updateDoc(doc(db, "user_settings", settingsDocId), { hasSeededFoods: true });
        } else {
            await addDoc(collection(db, "user_settings"), { userId, dailyGoal: 2500, hasSeededFoods: true });
        }
    }
}

export async function getFoods(searchQuery: string = ""): Promise<CustomFood[]> {
    const userId = getUserId();

    // Auto-seed base foods if not done yet
    await seedInitialFoodsIfNeeded(userId);

    const foodsRef = collection(db, "foods");
    const q = query(foodsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    let foods = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
            deletedAt: data.deletedAt?.toMillis ? data.deletedAt.toMillis() : null
        } as CustomFood;
    }).filter(f => !f.deletedAt); // Only return NON-DELETED foods

    if (searchQuery) {
        foods = foods.filter((food) =>
            food.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    return foods;
}

export async function getDeletedFoods(): Promise<CustomFood[]> {
    const userId = getUserId();
    const q = query(collection(db, "foods"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const returnFoods: CustomFood[] = [];

    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const deletedAtMs = data.deletedAt?.toMillis ? data.deletedAt.toMillis() : null;

        if (deletedAtMs) {
            // Auto-delete if older than 30 days
            if (now - deletedAtMs > thirtyDaysMs) {
                deleteDoc(docSnap.ref).catch(console.error);
                continue;
            }

            returnFoods.push({
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
                deletedAt: deletedAtMs
            } as CustomFood);
        }
    }

    return returnFoods.sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));
}

export async function addCustomFood(data: { name: string, calories: number, protein: number, type: 'cru' | 'cuit' }) {
    const userId = getUserId();
    await addDoc(collection(db, "foods"), {
        userId,
        ...data,
        createdAt: serverTimestamp()
    });
}

export async function deleteFood(foodId: string) {
    // Soft delete
    await updateDoc(doc(db, "foods", foodId), {
        deletedAt: serverTimestamp()
    });
}

export async function restoreFood(foodId: string) {
    await updateDoc(doc(db, "foods", foodId), {
        deletedAt: deleteField()
    });
}

export async function hardDeleteFood(foodId: string) {
    await deleteDoc(doc(db, "foods", foodId));
}

export async function emptyFoodTrash() {
    const deletedFoods = await getDeletedFoods();
    const promises = deletedFoods.map(food => deleteDoc(doc(db, "foods", food.id)));
    await Promise.all(promises);
}

// --- LOG ACTIONS ---

export async function getDailyLogs(dateStr: string) {
    const userId = getUserId();
    const logsRef = collection(db, "logs");

    const q = query(
        logsRef,
        where("userId", "==", userId),
        where("date", "==", dateStr)
    );

    const snapshot = await getDocs(q);
    const logs = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()
        } as Log;
    });

    // Sort locally to avoid Firebase composite index requirement
    return logs.sort((a, b) => {
        const timeA = (a.createdAt as number) || 0;
        const timeB = (b.createdAt as number) || 0;
        return timeB - timeA;
    });
}

export async function addLog(data: { name: string, weight: number, calories: number, protein: number, type: 'cru' | 'cuit', date: string, foodId: string }) {
    const userId = getUserId();
    await addDoc(collection(db, "logs"), {
        userId,
        ...data,
        createdAt: serverTimestamp()
    });
}

export async function deleteLog(logId: string) {
    await deleteDoc(doc(db, "logs", logId));
}

// --- SETTINGS ACTIONS ---

export async function getDailyGoal() {
    const userId = getUserId();
    const docRef = doc(db, "user_settings", userId);
    const snapshot = await getDocs(query(collection(db, "user_settings"), where("userId", "==", userId), limit(1)));

    if (snapshot.empty) return 2500;
    return snapshot.docs[0].data().dailyGoal;
}

export async function updateDailyGoal(newGoal: number) {
    const userId = getUserId();
    const userSettingsRef = collection(db, "user_settings");
    const q = query(userSettingsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        await addDoc(userSettingsRef, { userId, dailyGoal: newGoal });
    } else {
        await updateDoc(doc(db, "user_settings", snapshot.docs[0].id), { dailyGoal: newGoal });
    }
}

// --- RECIPE ACTIONS ---

export async function getRecipes() {
    const userId = getUserId();
    const q = query(collection(db, "recipes"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const recipes = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
            deletedAt: data.deletedAt?.toMillis ? data.deletedAt.toMillis() : null
        } as any;
    }).filter(recipe => !recipe.deletedAt); // Only return non-deleted recipes

    // Sort locally to avoid Firebase composite index requirement
    return recipes.sort((a: any, b: any) => {
        const timeA = (a.createdAt as number) || 0;
        const timeB = (b.createdAt as number) || 0;
        return timeB - timeA;
    });
}

export async function getDeletedRecipes() {
    const userId = getUserId();
    const q = query(collection(db, "recipes"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const returnRecipes: any[] = [];

    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const deletedAtMs = data.deletedAt?.toMillis ? data.deletedAt.toMillis() : null;

        if (deletedAtMs) {
            // Auto-delete if older than 30 days
            if (now - deletedAtMs > thirtyDaysMs) {
                deleteDoc(docSnap.ref).catch(console.error);
                continue;
            }

            returnRecipes.push({
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
                deletedAt: deletedAtMs
            });
        }
    }

    return returnRecipes.sort((a: any, b: any) => {
        const timeA = (a.deletedAt as number) || 0;
        const timeB = (b.deletedAt as number) || 0;
        return timeB - timeA;
    });
}

export async function createRecipe(data: { name: string, totalCalories: number, ingredients: any[], notes?: string }) {
    const userId = getUserId();
    await addDoc(collection(db, "recipes"), {
        userId,
        ...data,
        createdAt: serverTimestamp()
    });
}

export async function updateRecipe(recipeId: string, data: { name: string, totalCalories: number, ingredients: any[], notes?: string }) {
    await updateDoc(doc(db, "recipes", recipeId), data);
}

export async function deleteRecipe(recipeId: string) {
    // Soft delete
    await updateDoc(doc(db, "recipes", recipeId), {
        deletedAt: serverTimestamp()
    });
}

export async function restoreRecipe(recipeId: string) {
    await updateDoc(doc(db, "recipes", recipeId), {
        deletedAt: deleteField()
    });
}

export async function hardDeleteRecipe(recipeId: string) {
    await deleteDoc(doc(db, "recipes", recipeId));
}

export async function emptyRecipeTrash() {
    const deletedRecipes = await getDeletedRecipes();
    const promises = deletedRecipes.map(recipe => deleteDoc(doc(db, "recipes", recipe.id)));
    await Promise.all(promises);
}
