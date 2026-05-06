import React from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Sparkles, 
  Info, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  ArrowUpRight,
  RefreshCcw,
  CalendarDays,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, MealPlan, Cuisine } from '../types';

import { generateMealPlan } from '../services/geminiService';

interface MealPlannerViewProps {
  onBack: () => void;
  onPlanCreated?: () => void;
  hasPlan?: boolean;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const CUISINES: Cuisine[] = [
  'Italian', 'Indian', 'Chinese', 'Mexican', 'Thai', 'Japanese', 'Mediterranean', 'American',
  'French', 'Korean', 'Spanish', 'Greek', 'Turkish', 'Vietnamese', 'Lebanese', 'Brazilian',
  'Moroccan', 'Cajun', 'British', 'German', 'Ethiopian', 'Peruvian'
];

const DIET_TYPES = [
  { id: 'Standard', name: 'Standard Balanced', desc: 'Balanced macronutrients for daily wellness', icon: '🥗' },
  { id: 'Mediterranean', name: 'Mediterranean', desc: 'Heart-healthy fats, whole grains, lean protein', icon: '🐟' },
  { id: 'Keto', name: 'Keto', desc: 'High-fat, very low-carb for ketosis', icon: '🥑' },
  { id: 'Paleo', name: 'Paleo', desc: 'Whole foods only, no processed ingredients', icon: '🥩' },
  { id: 'Vegan', name: 'Vegan', desc: 'Strictly 100% plant-based diet', icon: '🌱' },
  { id: 'Vegetarian', name: 'Vegetarian', desc: 'Plant-based with dairy & eggs', icon: '🧀' },
  { id: 'Carnivore', name: 'Carnivore', desc: 'Meat, fish, & animal products only', icon: '🍖' },
  { id: 'Pescetarian', name: 'Pescetarian', desc: 'Vegetarian diet + seafood & fish', icon: '🍤' },
  { id: 'DASH', name: 'DASH', desc: 'Dietary approaches to stop hypertension', icon: '❤️' },
  { id: 'Whole30', name: 'Whole30', desc: '30-day reset avoiding inflammatory foods', icon: '✨' },
];

export default function MealPlannerView({ onBack, onPlanCreated, hasPlan, userProfile, setUserProfile }: MealPlannerViewProps) {
  const [step, setStep] = React.useState(0);
  const [savedPlan, setSavedPlan] = React.useState<MealPlan | null>(null);
  const [showReturnToast, setShowReturnToast] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  const [planMode, setPlanMode] = React.useState('Maintenance');
  const [planDuration, setPlanDuration] = React.useState(7);

  // Mifflin-St Jeor Equation
  const calculateBMR = () => {
    const { age, gender, height, weight } = userProfile;
    if (gender === 'Male') {
      return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    }
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  };

  const calculateTDEE = (bmr: number) => {
    return Math.round(bmr * 1.375); // Assuming light exercise
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => Math.max(0, prev - 1));

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const plan = await generateMealPlan(userProfile, planMode, planDuration);
      setSavedPlan(plan);
      onPlanCreated?.();
    } catch (error) {
      console.error("Failed to generate plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const recoverPlan = () => {
    setShowReturnToast(false);
    handleGeneratePlan(); // In a real app we'd fetch it
  };

  if (savedPlan) {
    return <PlanDashboard plan={savedPlan} onReset={() => setSavedPlan(null)} onBack={onBack} />;
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 pt-10">
      <AnimatePresence>
        {showReturnToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm"
          >
            <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-primary-start">
                <CalendarDays size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold">Welcome back!</p>
                <p className="text-xs text-white/50">You have an active 7-day plan.</p>
              </div>
              <button 
                onClick={recoverPlan}
                className="bg-brand-primary-start text-slate-900 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Restore
              </button>
              <button onClick={() => setShowReturnToast(false)} className="text-white/30 hover:text-white">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
          >
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-brand-primary-start font-bold uppercase tracking-widest text-[10px] transition-colors mb-4 mx-auto"
            >
              <ArrowLeft size={16} />
              Back to Home
            </button>
            <div className="w-24 h-24 gradient-accent rounded-[2rem] mx-auto flex items-center justify-center text-white shadow-2xl glow-orange">
              <CalendarDays size={48} />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 leading-tight">
                Your health journey, <span className="text-brand-accent-start italic underline decoration-brand-accent-start/20 underline-offset-8">automated.</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-lg mx-auto">
                No two bodies are the same. Get a 7-day meal plan perfectly tuned to your vitals and preferences.
              </p>
            </div>
            <button 
              onClick={handleNext}
              className="gradient-accent px-12 py-5 rounded-[2rem] text-white font-display font-black text-xl shadow-2xl glow-orange hover:scale-105 active:scale-95 transition-all"
            >
              Create My Plan
            </button>
          </motion.div>
        )}

        {step > 0 && step <= 4 && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100 space-y-10"
          >
             {/* Progress Bar */}
             <div className="flex gap-2">
               {[1, 2, 3, 4].map(s => (
                 <div key={s} className={`flex-1 h-2 rounded-full transition-all duration-500 ${step >= s ? 'gradient-primary' : 'bg-slate-100'}`} />
               ))}
             </div>

             {/* Plan Goal & Vitals Step */}
             {step === 1 && (
               <div className="space-y-8">
                 <div className="space-y-2">
                   <h3 className="text-3xl font-display font-black text-slate-900">Health Fundamentals</h3>
                   <p className="text-slate-500 font-medium italic">"Precision starts with measurement."</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6 mb-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Plan Mode</label>
                     <div className="grid grid-cols-1 gap-2">
                       {['Maintenance', 'Dieting', 'Bulking'].map(mode => (
                         <button
                            key={mode}
                            onClick={() => setPlanMode(mode)}
                            className={`py-3 px-4 rounded-2xl text-sm font-bold transition-all border-2 text-left
                              ${planMode === mode ? 'border-brand-primary-start bg-brand-primary-start/10 text-brand-primary-start' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}
                            `}
                         >
                            {mode}
                         </button>
                       ))}
                     </div>
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Duration</label>
                     <div className="grid grid-cols-2 gap-2">
                       {[
                         { val: 1, label: '1 Day' },
                         { val: 3, label: '3 Days' },
                         { val: 7, label: '1 Week' },
                         { val: 30, label: '1 Month' }
                       ].map(d => (
                         <button
                            key={d.val}
                            onClick={() => setPlanDuration(d.val)}
                            className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all border-2 flex items-center justify-center
                              ${planDuration === d.val ? 'border-brand-primary-start bg-brand-primary-start/10 text-brand-primary-start' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}
                            `}
                         >
                            {d.label}
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Age</label>
                     <input 
                        type="number" 
                        value={userProfile.age}
                        onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value) || 0})}
                        placeholder="24" 
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all font-bold" 
                      />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Gender</label>
                     <select 
                        value={userProfile.gender}
                        onChange={(e) => setUserProfile({...userProfile, gender: e.target.value as any})}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all font-bold appearance-none"
                      >
                       <option>Male</option>
                       <option>Female</option>
                       <option>Other</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Height (cm)</label>
                     <input 
                        type="number" 
                        value={userProfile.height}
                        onChange={(e) => setUserProfile({...userProfile, height: parseInt(e.target.value) || 0})}
                        placeholder="180" 
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all font-bold" 
                      />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Weight (kg)</label>
                     <input 
                        type="number" 
                        value={userProfile.weight}
                        onChange={(e) => setUserProfile({...userProfile, weight: parseInt(e.target.value) || 0})}
                        placeholder="75" 
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all font-bold" 
                      />
                   </div>
                 </div>
               </div>
             )}

             {/* Diet Preference Step */}
             {step === 2 && (
               <div className="space-y-8">
                 <div className="space-y-2">
                   <h3 className="text-3xl font-display font-black text-slate-900">Dietary Compass</h3>
                   <p className="text-slate-500 font-medium italic">What defines your plate?</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto px-1 pb-4 no-scrollbar">
                   {DIET_TYPES.map(type => (
                    <button 
                      key={type.id}
                      onClick={() => setUserProfile({...userProfile, dietType: type.id as any})}
                      className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-start text-left gap-3 group relative overflow-hidden ${userProfile.dietType === type.id ? 'border-brand-primary-start bg-emerald-50' : 'border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-white'}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-3xl">{type.icon}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${userProfile.dietType === type.id ? 'border-brand-primary-start bg-brand-primary-start text-white' : 'border-slate-300'}`}>
                          {userProfile.dietType === type.id && <CheckCircle2 size={12} />}
                        </div>
                      </div>
                      <div>
                        <span className={`text-md block font-bold mb-1 ${userProfile.dietType === type.id ? 'text-brand-primary-start' : 'text-slate-800'}`}>{type.name}</span>
                        <p className={`text-xs ${userProfile.dietType === type.id ? 'text-emerald-700/80' : 'text-slate-400'} font-medium leading-tight`}>{type.desc}</p>
                      </div>
                    </button>
                  ))}
                 </div>
                 
                 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 mt-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Allow Dairy?</h4>
                        <p className="text-[10px] text-slate-500 font-medium tracking-tight">Milk, cheese, etc.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setUserProfile({ ...userProfile, dairyAllowed: !userProfile.dairyAllowed })}
                      className={`w-14 h-8 rounded-full transition-all relative p-1 ${userProfile.dairyAllowed ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all transform ${userProfile.dairyAllowed ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
               </div>
             )}

             {/* Cuisine & Location */}
             {step === 3 && (
               <div className="space-y-8">
                  <div className="space-y-2">
                   <h3 className="text-3xl font-display font-black text-slate-900">Origin & Taste</h3>
                   <p className="text-slate-500 font-medium italic">Where are you from, Daksh?</p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex bg-slate-50 p-4 rounded-3xl items-center gap-4">
                      <MapPin className="text-brand-accent-start" size={24} />
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase text-slate-400">Current Location</p>
                        <p className="font-bold text-slate-900">San Francisco, CA, USA</p>
                      </div>
                      <button className="text-xs font-bold text-brand-primary-start hover:underline">Change</button>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Favorite Cuisines</label>
                      <div className="flex flex-wrap gap-2">
                        {CUISINES.map(c => (
                          <button 
                            key={c} 
                            onClick={() => {
                              const current = userProfile.cuisinePreferences;
                              if (current.includes(c)) {
                                setUserProfile({ ...userProfile, cuisinePreferences: current.filter(item => item !== c) });
                              } else {
                                setUserProfile({ ...userProfile, cuisinePreferences: [...current, c] });
                              }
                            }}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${userProfile.cuisinePreferences.includes(c) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
               </div>
             )}

             {/* Allergies & Final */}
             {step === 4 && (
               <div className="space-y-8">
                  <div className="space-y-2">
                   <h3 className="text-3xl font-display font-black text-slate-900">Safety First</h3>
                   <p className="text-slate-500 font-medium italic">Any ingredients to avoid?</p>
                  </div>
                  <div className="grid gap-6">
                    <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-4">
                      <AlertTriangle className="text-red-500 mt-1" size={24} />
                      <div>
                        <h4 className="font-bold text-red-900">Allergies & Intolerances</h4>
                        <input 
                          type="text" 
                          placeholder="Peanuts, Shellfish, Gluten..." 
                          value={userProfile.allergies.join(', ')}
                          onChange={(e) => setUserProfile({...userProfile, allergies: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)})}
                          className="mt-2 w-full bg-transparent border-b-2 border-red-200 outline-none p-2 text-sm text-red-900 placeholder:text-red-300 font-bold"
                        />
                      </div>
                    </div>
                    
                    <button className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border-2 border-slate-100 hover:border-brand-primary-start transition-all font-bold text-slate-700">
                      <span>No Allergies</span>
                      <CheckCircle2 size={24} className="text-slate-300" />
                    </button>
                  </div>
               </div>
             )}

             {/* Nav Buttons */}
             <div className="flex gap-4 pt-10 border-t border-slate-100">
               <button 
                  onClick={handleBack}
                  className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
               >
                 <ArrowLeft size={18} />
                 Back
               </button>
               <button 
                  onClick={step === 4 ? handleGeneratePlan : handleNext}
                  disabled={isGenerating}
                  className="flex-1 gradient-accent py-4 rounded-2xl text-white font-display font-black text-lg flex items-center justify-center gap-2 shadow-xl glow-orange disabled:opacity-50"
               >
                 {isGenerating ? (
                    <RefreshCcw className="animate-spin" size={18} />
                 ) : (
                    <>
                      {step === 4 ? 'Build My Menu' : 'Continue'}
                      <ChevronRight size={18} />
                    </>
                 )}
               </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlanDashboard({ plan, onReset, onBack }: { plan: MealPlan, onReset: () => void, onBack: () => void }) {
  const [mode, setMode] = React.useState(plan.mode);

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <button onClick={onBack} className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 flex items-center gap-2 mb-2 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Return
          </button>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 leading-tight">
            Your Premium <span className="text-brand-primary-start">{plan.days.length}-Day</span> Plan
          </h2>
          <p className="text-slate-500 font-medium italic">Target: {mode} • Weekly Burn: ~14,500 kcal</p>
        </div>

        <div className="flex gap-4">
          <div className="relative group">
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value as any)}
              className="bg-white border-2 border-slate-100 px-6 py-4 rounded-2xl font-display font-black text-slate-700 outline-none shadow-sm hover:border-brand-primary-start transition-all appearance-none pr-12"
            >
              <option>Dieting</option>
              <option>Bulking</option>
              <option>Maintenance</option>
            </select>
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary-start group-hover:animate-spin" size={18} />
          </div>
          <button onClick={onReset} className="p-4 bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-900 rounded-2xl transition-all">
            <RefreshCcw size={22} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-7 gap-6">
        {plan.days.map((dayPlan, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`
              flex flex-col h-[520px] rounded-[2.5rem] border overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]
              ${idx === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-100'}
            `}
          >
            <div className={`p-6 text-center border-b ${idx === 0 ? 'border-white/10' : 'border-slate-50'}`}>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${idx === 0 ? 'text-brand-accent-start' : 'text-slate-400'}`}>
                Day {dayPlan.day}
              </p>
              <h4 className="text-2xl font-display font-black tracking-tight underline decoration-brand-primary-start underline-offset-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
              </h4>
            </div>

            <div className="flex-1 p-4 space-y-8 overflow-y-auto no-scrollbar">
              {dayPlan.meals.map((meal, mIdx) => (
                <div key={mIdx} className="space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${idx === 0 ? 'text-white/40' : 'text-slate-300'}`}>
                      {meal.type}
                    </span>
                    <div className={`flex items-center gap-1 text-[9px] font-black ${idx === 0 ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        <Flame size={10} />
                        {meal.calories} kcal
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl border transition-all ${idx === 0 ? 'bg-white/5 border-white/10 group-hover:bg-white/10' : 'bg-slate-50 border-slate-100 group-hover:bg-slate-100'}`}>
                    <p className="text-sm font-bold truncate">{meal.recipeName || 'Discovery Meal'}</p>
                    <ArrowUpRight size={14} className="absolute top-10 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-4 text-center text-[10px] font-black tracking-tighter italic border-t ${idx === 0 ? 'bg-brand-accent-start text-white border-none shadow-[0_-10px_20px_rgba(0,0,0,0.2)]' : 'bg-slate-50 text-slate-400 border-slate-50'}`}>
              Complete Nutrition Tracker • Active
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
