import { GoogleGenAI } from "@google/genai";
import { Recipe, UserProfile, MealPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
const MODEL_NAME = "gemini-flash-latest";

async function fileToGenerativePart(file: File) {
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
  const base64Content = base64Data.split(',')[1];
  return {
    inlineData: {
      data: base64Content,
      mimeType: file.type
    },
  };
}

function parseJSON(text: string, fallback: any = {}): any {
  try {
    const cleaned = text.replace(/```json\n?|```/g, '').trim();
    // Find the first { or [ and the last } or ]
    const startIdx = Math.min(
      cleaned.indexOf('{') === -1 ? Infinity : cleaned.indexOf('{'),
      cleaned.indexOf('[') === -1 ? Infinity : cleaned.indexOf('[')
    );
    const endIdx = Math.max(
      cleaned.lastIndexOf('}'),
      cleaned.lastIndexOf(']')
    );

    if (startIdx === Infinity || endIdx === -1) {
      return fallback;
    }

    return JSON.parse(cleaned.substring(startIdx, endIdx + 1));
  } catch (error) {
    console.error("JSON Parse Error:", error, "Text:", text);
    return fallback;
  }
}

export async function detectIngredients(input: string | File): Promise<string[]> {
  const prompt = "List all food ingredients or items visible in this image or text. Return purely a JSON array of strings like [\"apple\", \"milk\"]. No preamble.";
  
  let contents;
  if (typeof input === 'string') {
    contents = [{ role: 'user', parts: [{ text: prompt + ": " + input }] }];
  } else {
    const imagePart = await fileToGenerativePart(input);
    contents = [{ role: 'user', parts: [{ text: prompt }, imagePart] }];
  }

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents
  });

  const text = response.text || '';
  const result = parseJSON(text, []);
  
  return Array.isArray(result) ? result : [];
}

export async function generateRecipeFromIngredients(ingredients: string[], userProfile?: UserProfile, preferences?: string): Promise<Recipe> {
  const profileContext = userProfile ? `
    User Profile:
    - Diet: ${userProfile.dietType}
    - Dairy Allowed: ${userProfile.dairyAllowed ? 'Yes' : 'No'}
    - Allergies: ${userProfile.allergies.join(', ') || 'None'}
    - Preferences: ${userProfile.preferences.join(', ') || 'None'}
    - Cuisines liked: ${userProfile.cuisinePreferences.join(', ') || 'None'}
  ` : '';

  const prompt = `Create a professional cooking recipe using these ingredients: ${ingredients.join(', ')}. 
    ${profileContext}
    ${preferences ? `Consider these extra preferences: ${preferences}` : ''}
    Return exactly this JSON structure:
    {
      "title": "Recipe Name",
      "description": "Short appetizing description",
      "ingredients": [{"name": "item", "amount": "quantity", "isOptional": false, "substitutes": ["alt1"]}],
      "instructions": ["Step 1", "Step 2"],
      "prepTime": 15,
      "cookTime": 30,
      "servings": 4,
      "calories": 450,
      "difficulty": "Easy",
      "cuisine": "Italian",
      "category": "Main Course",
      "tags": ["healthy", "quick"],
      "youtubeId": "dQw4w9WgXcQ"
    }
    Ensure the recipe is creative and respects all dietary restrictions (allergies, dairy, etc.) and uses the provided ingredients. Difficulty must be 'Easy', 'Medium', or 'Hard'.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });

  const recipeData = parseJSON(response.text || '{}');
  
  return {
    ...recipeData,
    id: Math.random().toString(36).substring(7),
  };
}

export async function generateMealPlan(userProfile: UserProfile, mode: string, duration: number = 7): Promise<MealPlan> {
  const prompt = `Create a ${duration}-day meal plan for a user with these vitals:
    - Age: ${userProfile.age}
    - Gender: ${userProfile.gender}
    - Height: ${userProfile.height}cm
    - Weight: ${userProfile.weight}kg
    - Diet: ${userProfile.dietType}
    - Dairy Allowed: ${userProfile.dairyAllowed}
    - Allergies: ${userProfile.allergies.join(', ')}
    - Mode: ${mode} (Bulking, Dieting, Maintenance)
    
    Return exactly this JSON structure:
    {
      "id": "unique_id",
      "mode": "${mode}",
      "days": [
        {
          "day": 1,
          "meals": [
            { "type": "Breakfast", "recipeName": "Dish Name", "calories": 400 },
            { "type": "Lunch", "recipeName": "Dish Name", "calories": 600 },
            { "type": "Dinner", "recipeName": "Dish Name", "calories": 500 }
          ]
        }
      ]
    }
    Generate for all ${duration} days. Ensure calorie targets are realistic for the mode. No preamble.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });

  const planData = parseJSON(response.text || '{}');
  
  if (!planData.days) {
      throw new Error("Failed to generate real meal plan from AI.");
  }
  
  return {
    ...planData,
    mode: mode,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
  };
}

export async function searchRecipes(ingredients: string[], cuisine?: string, dietaryNeeds?: string, userProfile?: UserProfile): Promise<Recipe[]> {
  const profileContext = userProfile ? `
    User Profile:
    - Diet: ${userProfile.dietType}
    - Dairy Allowed: ${userProfile.dairyAllowed ? "Yes" : "No"}
    - Allergies: ${userProfile.allergies.join(", ") || "None"}
  ` : "";

  const prompt = `Find 3 relevant recipe suggestions based on these ingredients: ${ingredients.join(", ")}.
    ${cuisine ? `Cuisine preference: ${cuisine}` : ""}
    ${dietaryNeeds ? `Dietary constraints: ${dietaryNeeds}` : ""}
    ${profileContext}
    Return exactly a JSON array of 3 recipe objects. Each object must follow this structure:
    {
      "id": "unique_string",
      "title": "Recipe Name",
      "description": "Short description",
      "ingredients": [{"name": "item", "amount": "quantity", "isOptional": false, "substitutes": []}],
      "instructions": ["Step 1", "Step 2"],
      "prepTime": 15,
      "cookTime": 30,
      "servings": 4,
      "calories": 450,
      "difficulty": "Easy",
      "cuisine": "Cuisine",
      "category": "Category",
      "tags": ["tag1"],
      "youtubeId": "dQw4w9WgXcQ"
    }
    No preamble. Pure JSON array. Ensure all dietary restrictions are respected.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });

  const recipes = parseJSON(response.text || '', []);
  
  return Array.isArray(recipes) ? recipes.map((r: any) => ({
    ...r,
    id: r.id || Math.random().toString(36).substring(7),
  })) : [];
}

export const generateAILoadedRecipe = generateRecipeFromIngredients;

export async function getSubstitutes(ingredient: string): Promise<string[]> {
  const prompt = `Provide 3 common kitchen substitutes for: ${ingredient}. Return only a JSON array of strings. No preamble.`;
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });

  return parseJSON(response.text || '', ["Option A", "Option B", "Option C"]);
}

export async function* streamChat(history: any[]) {
    if (!history || history.length === 0) return;
    
    const lastMessage = history[history.length - 1]?.parts?.[0]?.text || "";
    const formattedHistory = history.length > 1 ? history.slice(0, -1).map((h: any) => ({
      role: h.role,
      parts: (Array.isArray(h.parts) ? h.parts : [h.parts]).map((p: any) => ({ text: p.text || "" }))
    })) : [];

    const response = await ai.models.generateContentStream({
        model: MODEL_NAME,
        contents: [
          ...formattedHistory,
          { role: 'user', parts: [{ text: lastMessage }] }
        ]
    });

    for await (const chunk of response) {
        if (chunk.text) {
          yield chunk.text;
        }
    }
}

export async function scanFood(input: string | File): Promise<any> {
  const prompt = `Identify the food in this image. 
  Return exactly this JSON structure:
  {
    "isFood": true,
    "name": "Dish Name",
    "calories": 250,
    "cuisine": "Cuisine Type",
    "ingredients": ["ing1", "ing2"],
    "healthScore": 85,
    "weightImpact": {
      "kg": "estimate in kg",
      "lbs": "estimate in lbs",
      "description": "Short explanation of impact"
    },
    "funFact": "Interesting fact about this dish"
  }
  If it is not food, return { \"isFood\": false }. 
  No preamble. Pure JSON.`;
  
  let contents;
  if (typeof input === 'string') {
    contents = [{ role: 'user', parts: [{ text: prompt + ": " + input }] }];
  } else {
    const imagePart = await fileToGenerativePart(input);
    contents = [{ role: 'user', parts: [{ text: prompt }, imagePart] }];
  }

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents
  });

  return parseJSON(response.text || '', { isFood: false });
}

