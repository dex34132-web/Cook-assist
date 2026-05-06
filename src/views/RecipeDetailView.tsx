import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Flame, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  RefreshCcw, 
  Store,
  Sparkles,
  Info,
  Youtube,
  ShoppingCart,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recipe, Ingredient } from '../types';
import { getSubstitutes } from '../services/geminiService';

interface RecipeDetailViewProps {
  recipe: Recipe;
  onBack: () => void;
  onAddToShoppingList: (items: { name: string, amount: string }[]) => void;
  onToggleFavourite: (recipe: Recipe) => void;
  isFavourite: boolean;
}

export default function RecipeDetailView({ 
  recipe, 
  onBack, 
  onAddToShoppingList, 
  onToggleFavourite, 
  isFavourite 
}: RecipeDetailViewProps) {
  const [cookingMode, setCookingMode] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completedIngredients, setCompletedIngredients] = React.useState<string[]>([]);
  const [substituteMenu, setSubstituteMenu] = React.useState<{ing: string, options: string[]} | null>(null);

  const toggleIngredient = (name: string) => {
    if (completedIngredients.includes(name)) {
      setCompletedIngredients(prev => prev.filter(i => i !== name));
    } else {
      setCompletedIngredients(prev => [...prev, name]);
    }
  };

  const handleAddToShoppingList = () => {
    const itemsToAdd = recipe.ingredients.map(ing => ({
      name: ing.name,
      amount: ing.amount
    }));
    onAddToShoppingList(itemsToAdd);
  };

  const handleDoubleClickIngredient = async (ing: string) => {
    // Show substitutes modal
    const subs = await getSubstitutes(ing);
    setSubstituteMenu({ ing, options: subs });
  };

  if (cookingMode) {
    return (
      <CookingMode 
        recipe={recipe} 
        currentStep={currentStep} 
        onStepChange={setCurrentStep}
        onExit={() => setCookingMode(false)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm mb-8 transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Results
      </button>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visuals & Header */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-8">
          <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl group">
            <img 
              src={recipe.image || `https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              alt={recipe.title}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
              <div className="space-y-1">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/30">
                  {recipe.cuisine} • {recipe.difficulty}
                </span>
                <h1 className="text-3xl md:text-5xl font-display font-black text-white leading-tight">
                  {recipe.title}
                </h1>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => onToggleFavourite(recipe)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl backdrop-blur-md border border-white/30 ${isFavourite ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                >
                  <Heart size={28} className={isFavourite ? 'fill-current' : ''} />
                </button>
                <button 
                  onClick={() => setCookingMode(true)}
                  className="w-16 h-16 gradient-accent rounded-full text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl glow-orange shrink-0"
                >
                  <Play size={28} className="ml-1" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center space-y-1">
              <Clock className="mx-auto text-brand-primary-start mb-2" size={24} />
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Time</p>
              <p className="font-bold text-slate-900">{recipe.prepTime + recipe.cookTime}m</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center space-y-1">
              <Users className="mx-auto text-brand-accent-start mb-2" size={24} />
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Servings</p>
              <p className="font-bold text-slate-900">{recipe.servings}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center space-y-1">
              <Flame className="mx-auto text-orange-500 mb-2" size={24} />
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Calories</p>
              <p className="font-bold text-slate-900">{recipe.calories} kcal</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed italic">
              "{recipe.description}"
            </p>
          </div>

          <div className="space-y-6 pt-4 sm:hidden lg:block xl:hidden">
            <h3 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
              Preparation
              <div className="h-[2px] flex-1 bg-slate-100 rounded-full" />
            </h3>
            <div className="space-y-6">
              {recipe.instructions.map((step, idx) => (
                <div key={idx} className="flex gap-6">
                  <span className="flex-shrink-0 w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    {idx + 1}
                  </span>
                  <div className="space-y-2 flex-1">
                    <p className="text-slate-700 leading-relaxed font-medium pt-1">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Ingredients (Checklist) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-8 h-fit lg:sticky lg:top-24">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-display font-bold text-slate-900">Ingredients</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                <Info size={12} />
                Double tap for substitutes
              </div>
            </div>

            <div className="space-y-3">
              {recipe.ingredients.map((ing, idx) => (
                <div 
                  key={idx}
                  onClick={() => toggleIngredient(ing.name)}
                  onDoubleClick={() => handleDoubleClickIngredient(ing.name)}
                  className={`
                    group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none
                    ${completedIngredients.includes(ing.name) 
                      ? 'bg-emerald-50 border-transparent opacity-60' 
                      : 'bg-white border-slate-100 hover:border-brand-primary-start/30 shadow-xs hover:shadow-md'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                      ${completedIngredients.includes(ing.name) 
                        ? 'bg-brand-primary-start border-brand-primary-start text-white scale-110 shadow-lg' 
                        : 'border-slate-200 group-hover:border-brand-primary-start text-transparent'}
                    `}>
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className={`font-bold transition-all ${completedIngredients.includes(ing.name) ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {ing.name}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">{ing.amount}</p>
                    </div>
                  </div>
                  
                  {ing.isOptional && (
                    <span className="text-[9px] font-black uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                      Optional
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={handleAddToShoppingList}
              className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-primary-start transition-all shadow-xl"
            >
              <ShoppingCart size={18} />
              Add all to Shopping List
            </button>
          </div>

          <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden hidden xl:block">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Store size={24} />
              </div>
              <h4 className="text-xl font-display font-bold">Find Ingredients Nearby</h4>
              <p className="text-sm text-indigo-100 leading-relaxed">
                Connect your location to find verified stores where you can pick up these fresh ingredients today.
              </p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform">
                Open Store Locator
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>

        {/* Only visible on Desktop/Large Screens beside ingredients */}
        <div className="hidden lg:block xl:hidden col-span-12 space-y-8">
           {/* Step details duplicated for responsive control if needed, but I handled above */}
        </div>

        {/* Regular Mobile Stack Preparation */}
        <div className="lg:hidden col-span-12 space-y-6 pt-4">
            <h3 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
              Preparation
              <div className="h-[2px] flex-1 bg-slate-100 rounded-full" />
            </h3>
            <div className="space-y-6">
              {recipe.instructions.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {idx + 1}
                  </span>
                  <div className="space-y-2 flex-1 pt-0.5">
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Substitutes Modal */}
      <AnimatePresence>
        {substituteMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setSubstituteMenu(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-display font-bold text-slate-900">AI Substitutes</h4>
                    <p className="text-sm text-slate-500">For {substituteMenu.ing}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                    <Sparkles size={24} />
                  </div>
                </div>

                <div className="space-y-3">
                  {substituteMenu.options.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => setSubstituteMenu(null)}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-brand-primary-start hover:text-white transition-all duration-300"
                    >
                      <span className="font-bold">{opt}</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setSubstituteMenu(null)}
                  className="w-full mt-4 flex items-center justify-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-900 transition-colors"
                >
                  <RefreshCcw size={16} />
                  Keep original
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CookingMode({ recipe, currentStep, onStepChange, onExit }: { 
  recipe: Recipe, 
  currentStep: number, 
  onStepChange: (s: number) => void,
  onExit: () => void 
}) {
  const [isPaused, setIsPaused] = React.useState(true);

  // Note: Full YouTube API integration would be here. 
  // We simulate "Auto Preview" logic.
  
  const handleStepCompleted = () => {
    if (currentStep < recipe.instructions.length - 1) {
      onStepChange(currentStep + 1);
      setIsPaused(true); // Auto pause on next step simulation
    } else {
      onExit();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900 text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl h-full flex flex-col md:flex-row">
        {/* Video Side */}
        <div className="flex-1 bg-black relative flex items-center justify-center p-4">
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl relative">
            {recipe.youtubeId ? (
               <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${recipe.youtubeId}?autoplay=1&mute=0&controls=1`}
                title="Cooking Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="no-referrer"
               />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 space-y-4">
                    <Youtube size={64} className="text-red-500 grayscale opacity-50" />
                    <p className="text-slate-500 font-bold">Chef is prepping the tutorial...</p>
                </div>
            )}
            
            {isPaused && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-8 text-center"
                >
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-brand-accent-start rounded-full flex items-center justify-center mx-auto shadow-2xl glow-orange">
                            <CheckCircle2 size={40} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-display font-black uppercase tracking-wider mb-2">Step {currentStep + 1} Ready</h4>
                            <p className="text-slate-300 max-w-sm mx-auto">Click "Resume" when you are done with the current preparations.</p>
                        </div>
                        <button 
                            onClick={() => setIsPaused(false)}
                            className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
                        >
                            Resume Workshop
                        </button>
                    </div>
                </motion.div>
            )}
          </div>
          <button 
            onClick={onExit}
            className="absolute top-10 left-10 p-4 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold opacity-0 group-hover:opacity-100 transition-opacity">Exit Mode</span>
          </button>
        </div>

        {/* Steps Side */}
        <div className="w-full md:w-[400px] bg-slate-800/50 backdrop-blur-xl border-l border-white/10 flex flex-col">
          <div className="p-8 border-b border-white/5 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary-start">Tutorial Flow</span>
            <h3 className="text-xl font-display font-bold">Interactive Cooking</h3>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / recipe.instructions.length) * 100}%` }}
                    className="h-full gradient-primary"
                />
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto space-y-12 no-scrollbar">
            {recipe.instructions.map((step, idx) => (
                <div 
                    key={idx} 
                    className={`transition-all duration-500 space-y-4 ${idx === currentStep ? 'opacity-100 scale-100' : 'opacity-20 scale-95 blur-[2px]'}`}
                >
                    <div className="flex items-center gap-4">
                        <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${idx === currentStep ? 'gradient-accent shadow-xl glow-orange text-white' : 'bg-white/10 text-white/50'}`}>
                            {idx + 1}
                        </span>
                        {idx < currentStep && <CheckCircle2 size={24} className="text-emerald-500" />}
                    </div>
                    <p className="text-lg leading-relaxed font-medium">
                        {step}
                    </p>
                    
                    {idx === currentStep && (
                        <div className="flex flex-wrap gap-2 pt-4">
                            <button 
                                onClick={handleStepCompleted}
                                className="flex-1 gradient-primary py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg"
                            >
                                Step Completed
                                <ChevronRight size={16} />
                            </button>
                            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                                <RefreshCcw size={16} />
                            </button>
                        </div>
                    )}
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
