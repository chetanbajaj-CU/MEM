export type User = {
  id: string;
  name: string;
  email: string;
};

export type WorkoutPlan = {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  description: string;
};

export type MealPlan = {
  id: string;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};
