/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Sidebar from './components/layout/Sidebar';
import TopNav from './components/layout/TopNav';
import HomeView from './views/HomeView';
import FridgeScannerView from './views/FridgeScannerView';
import RecipeDetailView from './views/RecipeDetailView';
import MealPlannerView from './views/MealPlannerView';
import ShoppingListView from './views/ShoppingListView';
import FavouritesView from './views/FavouritesView';
import FoodScannerView from './views/FoodScannerView';
import StoreLocatorView from './views/StoreLocatorView';
import SettingsView from './views/SettingsView';
import RecipesView from './views/RecipesView';
import { AnimatePresence, motion } from 'motion/react';
import { Recipe, ShoppingItem, UserProfile } from './types';
import { toast, Toaster } from 'react-hot-toast';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [currentRecipe, setCurrentRecipe] = React.useState<Recipe | null>(null);
  const [hasMealPlan, setHasMealPlan] = React.useState(false);
  const [shoppingList, setShoppingList] = React.useState<ShoppingItem[]>([]);
  const [favourites, setFavourites] = React.useState<Recipe[]>([]);
  const [preSelectedCuisine, setPreSelectedCuisine] = React.useState<string | undefined>(undefined);
  const [preSelectedSearch, setPreSelectedSearch] = React.useState<string | undefined>(undefined);
  const [userProfile, setUserProfile] = React.useState<UserProfile>({
    age: 24,
    gender: 'Male',
    height: 180,
    weight: 75,
    dietType: 'Standard',
    dairyAllowed: true,
    allergies: [],
    preferences: [],
    cuisinePreferences: [],
  });

  const handleRecipeGenerated = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setActiveTab('recipe-detail');
  };

  const toggleFavourite = (recipe: Recipe) => {
    setFavourites(prev => {
      const exists = prev.find(r => r.id === recipe.id);
      if (exists) {
        toast.success(`Removed ${recipe.title} from favourites`);
        return prev.filter(r => r.id !== recipe.id);
      }
      toast.success(`Added ${recipe.title} to favourites!`);
      return [...prev, recipe];
    });
  };

  const addToShoppingList = (items: { name: string, amount: string }[]) => {
    const newItems: ShoppingItem[] = items.map(item => ({
      id: Math.random().toString(36).substring(7),
      name: item.name,
      amount: item.amount,
      isBought: false,
    }));
    setShoppingList(prev => [...prev, ...newItems]);
    toast.success(`${items.length} items added to shopping list`);
  };

  const removeFromShoppingList = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, isBought: !item.isBought } : item
    ));
  };

  const handleCuisineSelect = (cuisine: string) => {
    setPreSelectedCuisine(cuisine);
    setPreSelectedSearch(undefined);
    setActiveTab('recipes');
  };

  const handleSearch = (query: string) => {
    setPreSelectedSearch(query);
    setPreSelectedCuisine(undefined);
    setActiveTab('recipes');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-light">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'recipes') {
            setPreSelectedCuisine(undefined);
            setPreSelectedSearch(undefined);
          }
        }}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Toaster position="top-right" />
        <TopNav 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onSettingsClick={() => setActiveTab('settings')}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              {activeTab === 'home' && (
                <HomeView 
                  onScanClick={() => setActiveTab('scan-fridge')} 
                  onPlannerClick={() => setActiveTab('meal-planner')}
                  onCuisineClick={handleCuisineSelect}
                  onActionClick={(tab) => {
                    setActiveTab(tab);
                    if (tab !== 'recipes') {
                      setPreSelectedCuisine(undefined);
                      setPreSelectedSearch(undefined);
                    }
                  }}
                />
              )}
              {activeTab === 'recipes' && (
                <RecipesView 
                  onBack={() => setActiveTab('home')}
                  onRecipeClick={handleRecipeGenerated}
                  userProfile={userProfile}
                  initialCuisine={preSelectedCuisine as any}
                  initialSearch={preSelectedSearch}
                />
              )}
              {activeTab === 'scan-fridge' && (
                <FridgeScannerView 
                  onBack={() => setActiveTab('home')}
                  onRecipeGenerated={handleRecipeGenerated} 
                  userProfile={userProfile} 
                />
              )}
              {activeTab === 'recipe-detail' && currentRecipe && (
                <RecipeDetailView 
                  recipe={currentRecipe} 
                  onBack={() => setActiveTab('scan-fridge')} 
                  onAddToShoppingList={addToShoppingList}
                  onToggleFavourite={toggleFavourite}
                  isFavourite={favourites.some(r => r.id === currentRecipe.id)}
                />
              )}
              {activeTab === 'meal-planner' && (
                <MealPlannerView 
                  onBack={() => setActiveTab('home')} 
                  onPlanCreated={() => setHasMealPlan(true)}
                  hasPlan={hasMealPlan}
                  userProfile={userProfile}
                  setUserProfile={setUserProfile}
                />
              )}
              {activeTab === 'shopping-list' && (
                <ShoppingListView 
                  onBack={() => setActiveTab('home')} 
                  items={shoppingList}
                  onRemove={removeFromShoppingList}
                  onToggle={toggleShoppingItem}
                  onClear={() => setShoppingList([])}
                />
              )}
              {(activeTab === 'favourites' || activeTab === 'my-recipes') && (
                <FavouritesView 
                  onBack={() => setActiveTab('home')} 
                  onRecipeClick={handleRecipeGenerated}
                  recipes={favourites}
                  onRemove={toggleFavourite}
                />
              )}
              {activeTab === 'food-scanner' && (
                <FoodScannerView 
                  onBack={() => setActiveTab('home')} 
                  onRecipeGenerated={handleRecipeGenerated}
                  userProfile={userProfile}
                />
              )}
              {activeTab === 'store-locator' && (
                <StoreLocatorView onBack={() => setActiveTab('home')} />
              )}
              {activeTab === 'settings' && (
                <SettingsView 
                  onBack={() => setActiveTab('home')} 
                  userProfile={userProfile}
                  setUserProfile={setUserProfile}
                />
              )}
              
              {!['home', 'recipes', 'scan-fridge', 'recipe-detail', 'meal-planner', 'shopping-list', 'favourites', 'my-recipes', 'food-scanner', 'store-locator', 'settings'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                  <div className="w-24 h-24 gradient-primary rounded-[2.5rem] flex items-center justify-center text-white shadow-xl glow-orange">
                    <span className="text-4xl">🚀</span>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-display font-black text-slate-900 capitalize">
                      {activeTab.replace('-', ' ')}
                    </h2>
                    <p className="text-slate-500 font-medium max-w-sm">
                      Our chefs are currently refining this module. Stay tuned for a delicious update!
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('home')}
                    className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                  >
                    Back to Home
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

