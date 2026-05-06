import React from 'react';
import { 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Info,
  Clock,
  ChevronRight,
  RefreshCcw,
  ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { scanFood, generateRecipeFromIngredients } from '../services/geminiService';
import { Recipe, UserProfile } from '../types';

export default function FoodScannerView({ onBack, onRecipeGenerated, userProfile }: { onBack: () => void, onRecipeGenerated: (recipe: Recipe) => void, userProfile?: UserProfile }) {
  const [scanning, setScanning] = React.useState(false);
  const [result, setResult] = React.useState<any | null>(null);
  const [isNotFood, setIsNotFood] = React.useState(false);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string>("https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleGenerateRecipe = async () => {
    if (!result || !result.ingredients) return;
    setIsGeneratingRecipe(true);
    try {
      const recipe = await generateRecipeFromIngredients(result.ingredients, userProfile);
      onRecipeGenerated(recipe);
    } catch (error) {
      console.error("Failed to generate recipe:", error);
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    handleScan(file);
  };

  const handleScan = async (file?: File) => {
    setScanning(true);
    setResult(null);
    setIsNotFood(false);

    try {
      const data = await scanFood(file || "Current image analysis request");
      setScanning(false);
      if (data.isFood) {
        setResult(data);
      } else {
        setIsNotFood(true);
      }
    } catch (error) {
      console.error("Scan error:", error);
      setScanning(false);
      setIsNotFood(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        capture="environment"
        onChange={handleFileChange} 
      />
      
      <div className="space-y-2 mb-12">
        <button onClick={onBack} className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 flex items-center gap-2 mb-2 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Vibe Check
        </button>
        <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 leading-tight">
          Snap & <span className="text-brand-primary-start">Learn</span>
        </h2>
        <p className="text-slate-500 font-medium italic">Instant identification, calories, and nutrition.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Scanner Side */}
        <div className="relative group">
          <div className={`
            relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white transition-all duration-700
            ${scanning ? 'scale-95 blur-[1px]' : 'scale-100'}
          `}>
            <img 
              src={previewUrl}
              className="w-full h-full object-cover"
              alt="Food to scan"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/20" />
            
            {scanning && (
              <motion.div 
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-brand-primary-start shadow-[0_0_20px_#22c55e]"
              />
            )}

            <AnimatePresence>
                {scanning && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-2xl shadow-2xl space-y-2 text-center">
                            <div className="flex gap-1 justify-center">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="w-2 h-2 rounded-full bg-brand-primary-start" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-brand-primary-start" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-brand-primary-start" />
                            </div>
                            <p className="font-black uppercase tracking-widest text-[10px] text-slate-900">Analyzing Components...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={scanning}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 gradient-accent px-12 py-5 rounded-[2.5rem] text-white font-display font-black text-xl shadow-2xl glow-orange hover:scale-110 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
          >
            <ScanLine size={28} />
            Scan Item
          </button>
        </div>

        {/* Results Side */}
        <div className="space-y-8">
            <AnimatePresence mode="wait">
                {result ? (
                    <motion.div 
                        key="result"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary-start">Detection Successful</span>
                            <h3 className="text-4xl font-display font-black text-slate-900">{result.name}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 space-y-1 text-center">
                                <Flame className="mx-auto text-orange-500 mb-2" size={24} />
                                <p className="text-[10px] uppercase font-black text-slate-400">Calories</p>
                                <p className="font-display font-black text-2xl text-slate-900">{result.calories}</p>
                            </div>
                            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-1 text-center">
                                <Clock className="mx-auto text-blue-500 mb-2" size={24} />
                                <p className="text-[10px] uppercase font-black text-slate-400">Cuisine</p>
                                <p className="font-display font-black text-2xl text-slate-900">{result.cuisine}</p>
                            </div>
                        </div>

                        <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 space-y-4">
                           <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black uppercase tracking-widest text-emerald-800">Weight Impact Estimate</h4>
                              <div className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-emerald-600 shadow-sm">AI Estimate</div>
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-tighter mb-1">KG Increase</p>
                                <p className="text-2xl font-black text-emerald-900">{result.weightImpact?.kg}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-tighter mb-1">LBS Increase</p>
                                <p className="text-2xl font-black text-emerald-900">{result.weightImpact?.lbs}</p>
                              </div>
                           </div>
                           <p className="text-xs text-emerald-700 leading-relaxed font-medium bg-white/50 p-3 rounded-xl italic">"{result.weightImpact?.description}"</p>
                        </div>

                        <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                            <h4 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                                Detected Ingredients
                                <div className="h-[2px] flex-1 bg-slate-50 rounded-full" />
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {result.ingredients?.map((ing: string) => (
                                    <div key={ing} className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                        <CheckCircle2 size={16} className="text-brand-primary-start" />
                                        {ing}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {result.funFact && (
                          <div className="bg-slate-900 text-white p-6 rounded-[2rem] flex gap-4 items-start shadow-2xl">
                             <div className="bg-white/10 p-2 rounded-xl">
                                <Info size={18} className="text-indigo-400" />
                             </div>
                             <p className="text-xs font-medium leading-relaxed opacity-90"><span className="font-black text-indigo-300 mr-1 uppercase tracking-widest text-[10px]">Fun Fact:</span> {result.funFact}</p>
                          </div>
                        )}

                        <button 
                          onClick={handleGenerateRecipe}
                          disabled={isGeneratingRecipe}
                          className="w-full py-4 gradient-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isGeneratingRecipe ? <RefreshCcw className="animate-spin" size={18} /> : "Generate Recipe for This"}
                            {!isGeneratingRecipe && <ChevronRight size={18} />}
                        </button>
                    </motion.div>
                ) : !scanning && !isNotFood ? (
                    <motion.div 
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-12 text-center space-y-6 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200"
                    >
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto text-slate-300 shadow-sm">
                            <Camera size={40} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-display font-bold text-slate-900">Ready to Scan?</p>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-[240px] mx-auto">Click the button below the image to analyze your meal instantly.</p>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            <div className="flex items-center gap-1"><Info size={12} /> Nutrition</div>
                            <div className="flex items-center gap-1"><Info size={12} /> Allergens</div>
                            <div className="flex items-center gap-1"><Info size={12} /> Origin</div>
                        </div>
                    </motion.div>
                ) : null}

                {/* Edibility Warning */}
                {isNotFood && (
                    <motion.div 
                        key="not-food"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="p-10 bg-red-50 rounded-[3rem] border-2 border-red-100 text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto text-red-500 shadow-sm">
                            <AlertTriangle size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-display font-black text-red-900">Edibility Warning</h3>
                            <p className="text-red-700 font-medium">This is not an edible item.</p>
                        </div>
                        <button 
                            onClick={() => setIsNotFood(false)}
                            className="w-full py-4 bg-white text-red-500 rounded-2xl font-bold shadow-sm hover:bg-red-100 transition-colors"
                        >
                            Try Another Item
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
