import React from 'react';
import { Camera, Image as ImageIcon, Plus, X, Search, Sparkles, Wand2, Loader2, ChefHat, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { detectIngredients, generateAILoadedRecipe } from '../services/geminiService';
import { Recipe, UserProfile } from '../types';

interface FridgeScannerViewProps {
  onBack?: () => void;
  onRecipeGenerated: (recipe: Recipe) => void;
  userProfile?: UserProfile;
}

export default function FridgeScannerView({ onBack, onRecipeGenerated, userProfile }: FridgeScannerViewProps) {
  const [ingredients, setIngredients] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isDetecting, setIsDetecting] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showPermissionModal, setShowPermissionModal] = React.useState(false);
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setShowPermissionModal(false);
      fileInputRef.current?.click();
    } catch (err) {
      console.error('Camera permission denied:', err);
      setHasPermission(false);
      setShowPermissionModal(true);
    }
  };

  const handleScanClick = () => {
    if (hasPermission === true) {
      fileInputRef.current?.click();
    } else {
      setShowPermissionModal(true);
    }
  };

  const addIngredient = (ing: string) => {
    const trimmed = ing.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setInputValue('');
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDetecting(true);
    try {
      const detected = await detectIngredients(file);
      setIngredients(prev => Array.from(new Set([...prev, ...detected])));
    } catch (error) {
      console.error('Detection error:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) return;
    setIsGenerating(true);
    try {
      const recipe = await generateAILoadedRecipe(ingredients, userProfile);
      onRecipeGenerated(recipe);
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-brand-primary-start font-bold uppercase tracking-widest text-[10px] transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      )}
      <div className="text-center space-y-4 py-8">
        <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 leading-tight">
          Let's see what's in your <span className="text-brand-primary-start italic">fridge!</span>
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto font-medium">
          Upload a photo or type in your ingredients. Chef Buddy will craft the perfect meal just for you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 space-y-6">
            <div className="flex gap-4">
              <button 
                onClick={handleScanClick}
                className="flex-1 flex flex-col items-center justify-center p-6 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-3xl hover:bg-emerald-100 transition-colors group"
                disabled={isDetecting}
              >
                {isDetecting ? (
                  <Loader2 size={32} className="text-brand-primary-start animate-spin" />
                ) : (
                  <Camera size={32} className="text-brand-primary-start group-hover:scale-110 transition-transform" />
                )}
                <span className="mt-2 text-xs font-bold text-emerald-800 uppercase tracking-widest">
                  {isDetecting ? 'Detecting...' : 'Scan Photo'}
                </span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  capture="environment"
                  onChange={handleFileUpload}
                />
              </button>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <ImageIcon size={32} className="text-slate-400 group-hover:scale-110 transition-transform" />
                <span className="mt-2 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Gallery</span>
              </div>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary-start transition-colors" size={20} />
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIngredient(inputValue)}
                placeholder="Type an ingredient..."
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-12 text-sm focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all font-medium"
              />
              <button 
                onClick={() => addIngredient(inputValue)}
                className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-brand-primary-start transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showPermissionModal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
              >
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl space-y-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50" />
                  
                  <div className="relative space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                      <Camera size={40} className="text-brand-primary-start" />
                    </div>
                    
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-display font-black text-slate-900">Enable Camera Access</h3>
                      <p className="text-slate-500 font-medium">To scan your fridge automatically, we need permission to use your camera. This allows Chef Buddy to see your ingredients!</p>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={requestCamera}
                        className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-primary-start transition-all shadow-xl active:scale-95"
                      >
                        Grant Permission
                      </button>
                      <button 
                        onClick={() => setShowPermissionModal(false)}
                        className="w-full bg-slate-50 text-slate-500 p-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all"
                      >
                        Maybe Later
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleGenerate}
            disabled={ingredients.length === 0 || isGenerating}
            className="w-full gradient-accent p-6 rounded-[2rem] text-white font-display font-black text-xl flex items-center justify-center gap-3 shadow-2xl glow-orange hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale cursor-pointer"
          >
            {isGenerating ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <ChefHat size={24} />
            )}
            {isGenerating ? 'Chef is thinking...' : 'Generate Recipes'}
            {!isGenerating && <Wand2 size={20} className="ml-2 animate-bounce" />}
          </button>
        </div>

        {/* List of ingredients */}
        <div className="flex flex-col h-full min-h-[400px]">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                Inventory
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg text-xs">{ingredients.length}</span>
              </h3>
              {ingredients.length > 0 && (
                <button 
                  onClick={() => setIngredients([])}
                  className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 no-scrollbar">
              <AnimatePresence initial={false}>
                {ingredients.map((ing) => (
                  <motion.div
                    key={ing}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-brand-primary-start/30 transition-all font-medium text-slate-700"
                  >
                    <span className="flex items-center gap-3">
                      <Sparkles size={14} className="text-brand-primary-start" />
                      {ing}
                    </span>
                    <button 
                      onClick={() => removeIngredient(ing)}
                      className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {ingredients.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-300 py-20">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-100 flex items-center justify-center">
                    <Plus size={32} />
                  </div>
                  <p className="font-medium">No ingredients added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
