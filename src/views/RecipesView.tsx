import React from 'react';
import { 
  Search, 
  Filter, 
  ChefHat, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Flame, 
  Star,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recipe, Cuisine, Category, UserProfile } from '../types';
import { searchRecipes } from '../services/geminiService';

interface RecipesViewProps {
  onBack: () => void;
  onRecipeClick: (recipe: Recipe) => void;
  userProfile?: UserProfile;
  initialCuisine?: Cuisine;
  initialSearch?: string;
}

const CUISINES: Cuisine[] = [
  'Italian', 'Indian', 'Chinese', 'Mexican', 'Thai', 'Japanese', 
  'Mediterranean', 'American', 'French', 'Korean', 'Spanish', 
  'Vietnamese', 'Turkish', 'Middle Eastern', 'African'
];

const DIETS: Category[] = ['Veg', 'Non-Veg', 'Vegan Desserts'];

export default function RecipesView({ onBack, onRecipeClick, userProfile, initialCuisine, initialSearch }: RecipesViewProps) {
  const [ingredients, setIngredients] = React.useState<string[]>(
    initialSearch ? initialSearch.split(',').map(s => s.trim()).filter(s => s.length > 0) : []
  );
  const [inputValue, setInputValue] = React.useState('');
  const [selectedCuisine, setSelectedCuisine] = React.useState<Cuisine | 'All'>(initialCuisine || 'All');
  const [selectedDiet, setSelectedDiet] = React.useState<Category | 'All'>('All');
  const [isSearching, setIsSearching] = React.useState(false);
  const [results, setResults] = React.useState<Recipe[]>([]);

  React.useEffect(() => {
    if (ingredients.length > 0) {
      handleSearch();
    }
  }, []);

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) return;
    setIsSearching(true);
    try {
      const recipes = await searchRecipes(
        ingredients, 
        selectedCuisine === 'All' ? undefined : selectedCuisine, 
        selectedDiet === 'All' ? undefined : selectedDiet,
        userProfile
      );
      setResults(recipes);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900">Discover Recipes</h1>
          <p className="text-slate-500 font-medium">Search by ingredients you already have</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-900 mb-2">
              <Filter size={18} />
              <h2 className="font-bold uppercase text-xs tracking-widest">Filters</h2>
            </div>

            {/* Cuisine Filter */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cuisine</label>
              <select 
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value as any)}
                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#FF6B35]/20 appearance-none"
              >
                <option value="All">All Cuisines</option>
                {CUISINES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Diet Filter */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dietary Need</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedDiet('All')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${selectedDiet === 'All' ? 'bg-[#FF6B35] text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  All
                </button>
                {DIETS.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDiet(d)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${selectedDiet === d ? 'bg-[#FF6B35] text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-2">
              <h3 className="font-display font-black text-xl leading-tight">Smart Search</h3>
              <p className="text-indigo-100 text-xs font-medium leading-relaxed">
                Enter ingredients you have on hand, and our AI will find perfect dishes for you.
              </p>
            </div>
            <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-indigo-500 opacity-20" />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Ingredient Selector */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#FF6B35]" size={20} />
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                placeholder="What's in your pantry? (e.g. Chicken, Spinach, Onion)"
                className="w-full pl-12 pr-24 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
              />
              <button 
                onClick={addIngredient}
                className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <AnimatePresence initial={false}>
                {ingredients.map((ing) => (
                  <motion.div
                    key={ing}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 pl-4 pr-2 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl font-bold text-xs"
                  >
                    {ing}
                    <button 
                      onClick={() => removeIngredient(ing)}
                      className="p-1 hover:bg-emerald-100 rounded-md transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {ingredients.length === 0 && (
                <p className="text-slate-400 text-sm font-medium italic">Your ingredient list is empty...</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSearch}
                disabled={ingredients.length === 0 || isSearching}
                className="flex items-center gap-2 px-10 py-4 bg-[#FF6B35] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-[#e85a27] transition-all disabled:opacity-50 disabled:translate-y-0 active:scale-95"
              >
                {isSearching ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Finding Recipes...
                  </>
                ) : (
                  <>
                    <ChefHat size={16} />
                    Get Recommendations
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-display font-black text-slate-900 px-1">
              {results.length > 0 ? 'Recommended for You' : results.length === 0 && !isSearching && ingredients.length > 0 ? 'No recipes found' : ''}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((recipe, idx) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => onRecipeClick(recipe)}
                  className="bg-white rounded-[2.5rem] border border-slate-50 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                >
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&sig=${idx}`} 
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#FF6B35] shadow-lg border border-white">
                      {recipe.cuisine}
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-display font-black text-slate-900 group-hover:text-[#FF6B35] transition-colors leading-tight">
                        {recipe.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-[#FF6B35]" />
                          <span>{recipe.prepTime + recipe.cookTime} Min</span>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <div className="flex items-center gap-1.5">
                          <Flame size={14} className="text-orange-500" />
                          <span>{recipe.difficulty}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-slate-900">New</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {!isSearching && results.length === 0 && ingredients.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 opacity-30 grayscale saturate-0">
                <ChefHat size={80} className="text-slate-300" />
                <div className="space-y-2">
                   <h3 className="text-xl font-display font-black text-slate-400">Hungry?</h3>
                   <p className="text-sm font-medium text-slate-400">Add some ingredients above to start searching</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
