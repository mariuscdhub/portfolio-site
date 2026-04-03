
export interface Food {
    id: string;
    userId: string;
    name: string;
    calories: number;
    protein: number;
    type: 'cru' | 'cuit';
    createdAt?: any;
    deletedAt?: any;
}

export interface Log {
    id: string;
    userId: string;
    foodId: string;
    name: string;
    type: 'cru' | 'cuit';
    weight: number;
    calories: number;
    protein: number;
    date: string;
    createdAt?: any;
}

export interface Recipe {
    id: string;
    userId: string;
    name: string;
    totalCalories: number;
    ingredients: any[];
    notes?: string;
    createdAt?: any;
    deletedAt?: any;
}
