import React from 'react';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Scale, 
  Ruler, 
  Activity, 
  Heart, 
  AlertCircle,
  Pizza,
  CheckCircle2,
  Trash2,
  Plus,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Cuisine } from '../types';
import { toast } from 'react-hot-toast';

interface SettingsViewProps {
  onBack: () => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const CUISINES: Cuisine[] = [
  'Italian', 'Indian', 'Chinese', 'Mexican', 'Thai', 'Japanese', 'Mediterranean', 'American',
  'French', 'Korean', 'Spanish', 'Greek', 'Turkish', 'Vietnamese', 'Lebanese', 'Brazilian',
  'Moroccan', 'Cajun', 'British', 'German', 'Ethiopian', 'Peruvian'
];

export default function SettingsView({ onBack, userProfile, setUserProfile }: SettingsViewProps) {
  const [localProfile, setLocalProfile] = React.useState<UserProfile>({ ...userProfile });
  const [allergyInput, setAllergyInput] = React.useState('');

  const handleSave = () => {
    setUserProfile(localProfile);
    toast.success('Profile updated successfully!');
    onBack();
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !localProfile.allergies.includes(allergyInput.trim())) {
      setLocalProfile({
        ...localProfile,
        allergies: [...localProfile.allergies, allergyInput.trim()]
      });
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setLocalProfile({
      ...localProfile,
      allergies: localProfile.allergies.filter(a => a !== allergy)
    });
  };

  const toggleCuisine = (cuisine: Cuisine) => {
    const current = localProfile.cuisinePreferences;
    if (current.includes(cuisine)) {
      setLocalProfile({
        ...localProfile,
        cuisinePreferences: current.filter(c => c !== cuisine)
      });
    } else {
      setLocalProfile({
        ...localProfile,
        cuisinePreferences: [...current, cuisine]
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-display font-black text-slate-900">Health Profile</h1>
            <p className="text-slate-500 font-medium">Personalize your Chef Buddy experience</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Vitals */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <h2 className="text-xl font-display font-black text-slate-900 flex items-center gap-2">
              <User className="text-brand-primary-start" size={20} />
              Personal Vitals
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Age (Years)</label>
                <div className="relative">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="number"
                    value={localProfile.age}
                    onChange={(e) => setLocalProfile({ ...localProfile, age: parseInt(e.target.value) || 0 })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Gender</label>
                <div className="flex bg-slate-50 p-1 rounded-2xl">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setLocalProfile({ ...localProfile, gender: g as any })}
                      className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${localProfile.gender === g ? 'bg-white shadow-sm text-brand-primary-start' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Height (cm)</label>
                <div className="relative">
                  <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="number"
                    value={localProfile.height}
                    onChange={(e) => setLocalProfile({ ...localProfile, height: parseInt(e.target.value) || 0 })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Weight (kg)</label>
                <div className="relative">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="number"
                    value={localProfile.weight}
                    onChange={(e) => setLocalProfile({ ...localProfile, weight: parseInt(e.target.value) || 0 })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary-start/20 outline-none transition-all font-bold"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <h2 className="text-xl font-display font-black text-slate-900 flex items-center gap-2">
              <Pizza className="text-[#FF6B35]" size={20} />
              Dietary Preferences
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Diet Type</label>
                <div className="grid grid-cols-3 gap-4">
                  {['Veg', 'Non-veg', 'Both'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setLocalProfile({ ...localProfile, dietType: d as any })}
                      className={`py-4 rounded-2xl border-2 transition-all font-bold text-sm ${localProfile.dietType === d ? 'border-[#FF6B35] bg-[#FFF2EE] text-[#FF6B35]' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Dairy Consumption</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Includes milk, cheese, and yogurt</p>
                  </div>
                </div>
                <button 
                  onClick={() => setLocalProfile({ ...localProfile, dairyAllowed: !localProfile.dairyAllowed })}
                  className={`w-14 h-8 rounded-full transition-all relative p-1 ${localProfile.dairyAllowed ? 'bg-emerald-500' : 'bg-slate-200'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all transform ${localProfile.dairyAllowed ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
             <h2 className="text-xl font-display font-black text-slate-900 flex items-center gap-2">
              <Heart className="text-pink-500" size={20} />
              Cuisine Favorites
            </h2>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCuisine(c)}
                  className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${localProfile.cuisinePreferences.includes(c) ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Allergies */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-red-50 rounded-[2.5rem] p-8 border border-red-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-red-900">
              <AlertCircle size={24} />
              <h2 className="text-xl font-display font-black">Allergies</h2>
            </div>
            
            <div className="space-y-4">
              <div className="relative group">
                <input 
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addAllergy()}
                  placeholder="e.g. Peanuts"
                  className="w-full pr-12 pl-4 py-4 bg-white/50 border-2 border-red-100 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-200 outline-none transition-all font-bold placeholder:text-red-200"
                />
                <button 
                  onClick={addAllergy}
                  className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                <AnimatePresence initial={false}>
                  {localProfile.allergies.map((allergy) => (
                    <motion.div
                      key={allergy}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-red-100"
                    >
                      <span className="font-bold text-red-900 text-sm">{allergy}</span>
                      <button 
                        onClick={() => removeAllergy(allergy)}
                        className="text-red-300 hover:text-red-600 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {localProfile.allergies.length === 0 && (
                  <div className="py-12 text-center space-y-3 opacity-20">
                    <div className="w-12 h-12 border-2 border-red-400 rounded-full flex items-center justify-center mx-auto">
                      <Heart size={24} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest">No Allergies Listed</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-2">
              <h3 className="font-display font-black text-2xl">AI Sync Active</h3>
              <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                Your profile data is strictly used by our AI to ensure every recipe generated is safe and personalized for you.
              </p>
            </div>
            <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500 opacity-20 group-hover:rotate-12 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
