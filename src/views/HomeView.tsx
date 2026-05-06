import React from 'react';
import { 
  Camera, 
  Search, 
  ChevronRight, 
  Clock, 
  Star, 
  Flame, 
  Calendar, 
  ShoppingCart, 
  ScanLine,
  Settings,
  ChefHat,
  Apple,
  Leaf,
  SlidersHorizontal,
  MapPin,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Cuisine, Category } from '../types';
import SpeedDial from '../components/SpeedDial';

const CUISINES: Cuisine[] = [
  'Italian', 'Indian', 'Chinese', 'Mexican', 'Thai', 'Japanese', 'Mediterranean', 'American',
  'French', 'Korean', 'Spanish', 'Greek', 'Turkish', 'Vietnamese', 'Lebanese', 'Brazilian',
  'Moroccan', 'Cajun', 'British', 'German', 'Ethiopian', 'Peruvian'
];

const CATEGORIES: { label: string; id: Category; icon: string }[] = [
  { label: 'Veg', id: 'Veg', icon: '🥗' },
  { label: 'Non-Veg', id: 'Non-Veg', icon: '🍗' },
  { label: 'Desserts', id: 'Desserts', icon: '🧁' },
  { label: 'Vegan Desserts', id: 'Vegan Desserts', icon: '🌱' },
];

const HERO_BANNERS = [
  {
    id: 'scan-fridge',
    title: 'Turn your fridge into',
    highlight: 'amazing',
    suffix: 'meals.',
    desc: 'Scan your ingredients, get AI-powered recipes instantly.',
    img: 'https://images.unsplash.com/photo-1590772229666-4f6921bc462e?auto=format&fit=crop&q=80&w=1600',
    btn: 'Scan Fridge',
    action: 'scan',
    icon: Camera
  },
  {
    id: 'meal-planner',
    title: 'Plan your weekly',
    highlight: 'healthy',
    suffix: 'diet.',
    desc: 'Build personalized meal plans tailored to your vitals and goals.',
    img: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=1600',
    btn: 'Create Plan',
    action: 'planner',
    icon: Calendar
  },
  {
    id: 'ai-recipes',
    title: 'Discover endless',
    highlight: 'delicious',
    suffix: 'recipes.',
    desc: 'Explore AI-curated culinary masterpieces from around the world.',
    img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1600',
    btn: 'Explore Recipes',
    action: 'recipes',
    icon: ChefHat
  },
  {
    id: 'shopping',
    title: 'Find ingredients',
    highlight: 'nearby',
    suffix: 'easily.',
    desc: 'Locate supermarkets and specialty stores right in your neighborhood.',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600',
    btn: 'Find Stores',
    action: 'store-locator',
    icon: MapPin
  }
];

interface HomeViewProps {
  onScanClick?: () => void;
  onPlannerClick?: () => void;
  onCuisineClick?: (cuisine: Cuisine) => void;
  onActionClick?: (tab: string) => void;
}

const HOME_CUISINES: Array<{ name: Cuisine, img: string }> = [
  { name: 'Italian', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=200' },
  { name: 'Mexican', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=200' },
  { name: 'Japanese', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=200' },
  { name: 'Indian', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=200' },
  { name: 'Thai', img: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80&w=200' },
  { name: 'American', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200' },
  { name: 'French', img: 'https://images.unsplash.com/photo-1502301103665-0b95cc738daf?auto=format&fit=crop&q=80&w=200' },
  { name: 'Mediterranean', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200' },
];

export default function HomeView({ onScanClick, onPlannerClick, onCuisineClick, onActionClick }: HomeViewProps) {
  const [selectedCuisine, setSelectedCuisine] = React.useState<Cuisine | null>(null);
  const [vegModal, setVegModal] = React.useState(false);
  const [activeBanner, setActiveBanner] = React.useState(0);
  const [isBannerHovered, setIsBannerHovered] = React.useState(false);

  React.useEffect(() => {
    if (isBannerHovered) return;
    const intervalTime = 5000;
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % HERO_BANNERS.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isBannerHovered, activeBanner]); // Reset timer on banner change or hover

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 30; // Lower threshold
    const swipeVelocity = 100; // More sensitive
    
    if (info.offset.x < -swipeThreshold || info.velocity.x < -swipeVelocity) {
      setActiveBanner((prev) => (prev + 1) % HERO_BANNERS.length);
    } else if (info.offset.x > swipeThreshold || info.velocity.x > swipeVelocity) {
      setActiveBanner((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
    }
  };

  const handleCuisineClick = (cuisine: Cuisine) => {
    setSelectedCuisine(cuisine);
    onCuisineClick?.(cuisine);
  };

  const handleCategoryClick = (cat: Category) => {
    if (cat === 'Veg') {
      setVegModal(true);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-20">
      {/* Main Content Column */}
      <div className="flex-1 space-y-10 min-w-0">
        {/* Banner Carousel */}
        <section 
          className="relative overflow-hidden rounded-[3rem] text-white shadow-2xl flex items-center min-h-[300px] sm:min-h-[350px] touch-pan-y bg-gradient-to-br from-orange-500 to-amber-600"
          onMouseEnter={() => setIsBannerHovered(true)}
          onMouseLeave={() => setIsBannerHovered(false)}
          onTouchStart={() => setIsBannerHovered(true)}
          onTouchEnd={() => setIsBannerHovered(false)}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={activeBanner}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 40,
                mass: 0.5,
                restDelta: 0.001
              }}
              className="absolute inset-0 flex items-center p-8 md:p-12 pl-10 cursor-grab active:cursor-grabbing origin-center group"
            >
              {/* Context-Aware Background */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <img 
                  src={HERO_BANNERS[activeBanner].img} 
                  alt={HERO_BANNERS[activeBanner].title} 
                  className="w-full h-full object-cover transition-transform duration-[10s] scale-105 group-hover:scale-100"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-slate-900/10 to-transparent" />
              </div>

              <div className="relative z-10 max-w-lg space-y-5 pointer-events-none">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-display font-black leading-[1.1] text-white"
                >
                  {HERO_BANNERS[activeBanner].title} <span className="text-amber-300">{HERO_BANNERS[activeBanner].highlight}</span> {HERO_BANNERS[activeBanner].suffix}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm md:text-base text-white/95 font-medium max-w-[280px] sm:max-w-sm leading-relaxed"
                >
                  {HERO_BANNERS[activeBanner].desc}
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-3 pt-2 pointer-events-auto"
                >
                  <button 
                    onClick={() => {
                      const action = HERO_BANNERS[activeBanner].action;
                      if (action === 'scan') onScanClick?.();
                      else if (action === 'planner') onPlannerClick?.();
                      else onActionClick?.(action);
                    }}
                    className="bg-white text-[#C2410C] px-6 py-3 md:px-8 md:py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    {React.createElement(HERO_BANNERS[activeBanner].icon, { size: 18 })}
                    {HERO_BANNERS[activeBanner].btn}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
            {HERO_BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBanner(idx)}
                className={`transition-all duration-300 rounded-full h-2 pointer-events-auto ${
                  idx === activeBanner ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Cuisine Browser */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-black text-slate-900 px-1">Browse by Cuisine</h2>
            <button onClick={() => onActionClick?.('recipes')} className="text-[11px] font-black text-[#FF6B35] hover:underline uppercase tracking-widest">View all</button>
          </div>
          
          <div className="flex gap-10 overflow-x-auto pb-4 px-1 no-scrollbar scroll-smooth">
            {HOME_CUISINES.map((cuisine, idx) => (
              <motion.button
                key={cuisine.name}
                onClick={() => handleCuisineClick(cuisine.name)}
                className="flex-shrink-0 group flex flex-col items-center gap-3"
              >
                <div className={`w-20 h-20 rounded-full overflow-hidden border-2 bg-white shadow-sm transition-all duration-300 ${selectedCuisine === cuisine.name ? 'border-[#FF6B35] ring-4 ring-[#FF6B35]/10' : 'border-slate-100'}`}>
                  <img 
                    src={cuisine.img} 
                    alt={cuisine.name}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${selectedCuisine === cuisine.name ? 'text-[#FF6B35]' : 'text-slate-500'}`}>{cuisine.name}</span>
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 px-1">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => handleCategoryClick(cat.id)}
                className="group bg-white border border-slate-200 hover:border-[#FF6B35]/40 pl-1.5 pr-3 py-1.5 rounded-full text-[9px] min-[375px]:text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-700 hover:bg-[#FFF2EE] hover:text-[#FF6B35] transition-all flex items-center gap-2 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_14px_-6px_rgba(255,107,53,0.4)] active:scale-95 mx-auto w-full max-w-full"
              >
                <div className="bg-slate-50 group-hover:bg-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-inner transition-colors shrink-0">
                  {cat.icon}
                </div>
                <span className="truncate text-left leading-none pt-0.5">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Popular Recipes */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-black text-slate-900 px-1">Popular Recipes</h2>
            <button onClick={() => onActionClick?.('recipes')} className="text-[11px] font-black text-[#FF6B35] hover:underline uppercase tracking-widest">View all</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Creamy Garlic Pasta', type: 'Veg', time: '25 min', diff: 'Easy', rating: 4.6, img: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=600', color: 'text-green-600 bg-green-50' },
              { title: 'Butter Chicken', type: 'Non-Veg', time: '40 min', diff: 'Medium', rating: 4.7, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600', color: 'text-red-600 bg-red-50' },
              { title: 'Veggie Stir Fry', type: 'Veg', time: '20 min', diff: 'Easy', rating: 4.5, img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', color: 'text-green-600 bg-green-50' },
              { title: 'Chocolate Lava Cake', type: 'Dessert', time: '30 min', diff: 'Easy', rating: 4.6, img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=600', color: 'text-purple-600 bg-purple-50' },
            ].map((recipe, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  <img 
                    src={recipe.img} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={recipe.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-sm`}>
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    {recipe.rating}
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-lg font-display font-black text-slate-900 group-hover:text-[#FF6B35] transition-colors leading-tight">{recipe.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">{recipe.type}</span>
                    <span>•</span>
                    <span>{recipe.time}</span>
                    <span>•</span>
                    <span>{recipe.diff}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          {[
            { title: 'Smart Substitutes', sub: 'Find the best ingredient replacements instantly.', icon: RefreshCcw, color: 'bg-[#F2F0FF]', iconColor: 'text-indigo-600', icBg: 'bg-indigo-100' },
            { title: 'Shopping List', sub: 'Automatically add ingredients to list.', icon: ShoppingCart, color: 'bg-[#FFF2EE]', iconColor: 'text-[#FF6B35]', icBg: 'bg-orange-100' },
            { title: 'Food Scanner', sub: 'Identify dishes, calories & nutrition info.', icon: ScanLine, color: 'bg-[#FFF8E7]', iconColor: 'text-amber-600', icBg: 'bg-amber-100' },
          ].map((feat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className={`${feat.color} p-8 rounded-[2.5rem] space-y-4 border border-white shadow-sm`}
            >
              <div className={`w-12 h-12 ${feat.icBg} rounded-2xl flex items-center justify-center ${feat.iconColor}`}>
                <feat.icon size={24} />
              </div>
              <div className="space-y-1">
                <p className="font-black text-slate-800 tracking-tight leading-tight">{feat.title}</p>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{feat.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Column: Widgets */}
      <div className="w-full xl:w-[380px] space-y-8">
        {/* Meal Planner Widget */}
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 space-y-8 relative overflow-hidden text-center">
            <div className="flex justify-center">
               <div className="w-16 h-16 bg-[#FFF2EE] rounded-3xl flex items-center justify-center text-[#FF6B35] shadow-inner mb-2">
                  <Calendar size={32} />
               </div>
            </div>
            
            <div className="space-y-3">
               <h3 className="text-2xl font-display font-black text-slate-900 leading-tight">Meal Planner</h3>
               <div className="relative py-4">
                  <div className="w-32 h-40 bg-white border-4 border-amber-50 rounded-2xl mx-auto shadow-xl flex flex-col p-4 space-y-3">
                     <div className="w-full h-2 bg-slate-100 rounded-full"></div>
                     <div className="w-full h-2 bg-slate-100 rounded-full"></div>
                     <div className="w-2/3 h-2 bg-slate-100 rounded-full"></div>
                     <div className="pt-2 flex flex-wrap gap-2">
                        <div className="w-4 h-4 bg-orange-200 rounded-md"></div>
                        <div className="w-4 h-4 bg-red-200 rounded-md"></div>
                        <div className="w-4 h-4 bg-emerald-200 rounded-md"></div>
                     </div>
                  </div>
                  <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-lg">
                    <Apple size={20} fill="currentColor" />
                  </div>
                  <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-lg rotate-12">
                    <Leaf size={20} fill="currentColor" />
                  </div>
               </div>
               <p className="text-sm font-bold text-slate-900">You don't have a meal plan yet.</p>
               <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  Create your personalized plan based on your goals, diet, allergies and preferences.
               </p>
            </div>

            <button 
              onClick={onPlannerClick}
              className="w-full bg-[#FF6B35] py-5 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#e85a27] transition-all"
            >
              Create Meal Plan
            </button>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <SpeedDial onOptionClick={(tab) => onActionClick?.(tab)} />
    </div>
  );
}
