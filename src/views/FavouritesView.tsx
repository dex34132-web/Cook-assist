import React from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Clock, 
  Flame, 
  Star,
  Search,
  Grid,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recipe } from '../types';

interface FavouritesViewProps {
  onBack: () => void;
  onRecipeClick: (r: Recipe) => void;
  recipes: Recipe[];
  onRemove: (r: Recipe) => void;
}

export default function FavouritesView({ 
  onBack, 
  onRecipeClick, 
  recipes, 
  onRemove 
}: FavouritesViewProps) {
  const [layout, setLayout] = React.useState<'grid' | 'list'>('grid');

  const handleRemove = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(recipe);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-2">
          <button onClick={onBack} className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 flex items-center gap-2 mb-2 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Kitchen
          </button>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 leading-tight">
            Curated <span className="text-rose-500">Favourites</span>
          </h2>
          <p className="text-slate-500 font-medium italic">Your personal hall of fame for recipes.</p>
        </div>

        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-100">
           <button 
            onClick={() => setLayout('grid')}
            className={`p-3 rounded-xl transition-all ${layout === 'grid' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
            <Grid size={20} />
           </button>
           <button 
            onClick={() => setLayout('list')}
            className={`p-3 rounded-xl transition-all ${layout === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
            <List size={20} />
           </button>
        </div>
      </div>

      <div className="relative mb-12">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Search your library..."
          className="w-full bg-white border border-slate-100 rounded-[2rem] py-6 pl-16 pr-8 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-rose-500/10 shadow-xl transition-all placeholder:text-slate-300"
        />
      </div>

      <div className={`
        ${layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'flex flex-col gap-4'}
      `}>
        <AnimatePresence>
            {recipes.map((recipe, idx) => (
                <motion.div 
                    key={recipe.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => onRecipeClick(recipe)}
                    className={`
                        group relative bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer
                        ${layout === 'list' && 'flex gap-6 h-40 p-4'}
                    `}
                >
                    <div className={`
                        relative bg-slate-100 overflow-hidden
                        ${layout === 'grid' ? 'aspect-[4/3]' : 'w-48 h-full rounded-2xl'}
                    `}>
                        <img 
                            src={recipe.image || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            alt={recipe.title}
                            referrerPolicy="no-referrer"
                        />
                        <button 
                            onClick={(e) => handleRemove(recipe, e)}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-rose-500 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
                        >
                            <Heart size={20} fill="currentColor" />
                        </button>
                    </div>

                    <div className={`flex flex-col justify-between ${layout === 'grid' ? 'p-8' : 'flex-1 py-2 pr-4'}`}>
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-1 rounded-md">
                                {recipe.cuisine} • {recipe.category}
                            </span>
                            <h3 className="text-xl font-display font-black text-slate-900 leading-tight group-hover:text-rose-500 transition-colors">
                                {recipe.title}
                            </h3>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
                                <div className="flex items-center gap-1"><Clock size={14} className="text-rose-400" /> {recipe.cookTime}m</div>
                                <div className="flex items-center gap-1"><Flame size={14} className="text-orange-400" /> {recipe.calories}c</div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                <span className="text-xs font-bold text-slate-900">4.9</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {recipes.length === 0 && (
        <div className="bg-slate-50 rounded-[3rem] p-20 text-center space-y-4 border-2 border-dashed border-slate-100">
          <Heart size={64} className="mx-auto text-rose-200" />
          <h3 className="text-2xl font-display font-black text-slate-900">No Favourites Yet</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto italic">Start exploring recipes and hit the heart icon to build your collection.</p>
          <button onClick={onBack} className="text-rose-500 font-bold underline">Explore Recipes</button>
        </div>
      )}
    </div>
  );
}
