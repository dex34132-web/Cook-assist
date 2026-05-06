/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Cuisine = 
  | 'Italian' | 'Indian' | 'Chinese' | 'Mexican' | 'Thai' | 'Japanese' 
  | 'American' | 'Mediterranean' | 'French' | 'Korean' | 'Greek' 
  | 'Spanish' | 'Vietnamese' | 'Turkish' | 'Middle Eastern' | 'Caribbean' 
  | 'African' | 'British' | 'German' | 'Brazilian' | 'Lebanese' | 'Moroccan' | 'Cajun' | 'Ethiopian' | 'Peruvian';

export type Category = 'Veg' | 'Non-Veg' | 'Desserts' | 'Vegan Desserts';

export interface Ingredient {
  name: string;
  amount: string;
  isCompleted?: boolean;
  substitutes?: string[];
  findInStore?: string;
  isOptional?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  cuisine: Cuisine;
  category: Category;
  tags: string[];
  youtubeId?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  isBought: boolean;
  category?: string;
}

export interface UserProfile {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number;
  weight: number;
  dietType: string;
  dairyAllowed: boolean;
  allergies: string[];
  preferences: string[];
  cuisinePreferences: Cuisine[];
  location?: {
    country: string;
    state: string;
    city: string;
  };
}

export interface MealPlan {
  id: string;
  userId: string;
  mode: 'Dieting' | 'Bulking' | 'Maintenance';
  days: {
    day: number; // 1-7
    meals: {
      type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
      recipeId: string;
      recipeName?: string;
      calories: number;
    }[];
  }[];
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
