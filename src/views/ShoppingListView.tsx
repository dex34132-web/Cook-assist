import React from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  CheckCircle2, 
  Download,
  Share2,
  ShoppingCart,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Recipe, ShoppingItem } from '../types';

interface ShoppingListViewProps {
  onBack: () => void;
  items: ShoppingItem[];
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onClear: () => void;
}

export default function ShoppingListView({ 
  onBack, 
  items, 
  onRemove, 
  onToggle, 
  onClear 
}: ShoppingListViewProps) {
  const categories = Array.from(new Set(items.map(item => item.category || 'Kitchen Essentials')));

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <button onClick={onBack} className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 flex items-center gap-2 mb-2 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Store
          </button>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 leading-tight">
            Smart <span className="text-brand-accent-start">Shopping</span> List
          </h2>
          <p className="text-slate-500 font-medium italic">Organized by aisle for your efficiency.</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClear}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-red-500 transition-all shadow-sm group"
          >
            <Trash2 size={22} className="text-slate-400 group-hover:text-red-500" />
          </button>
          <button className="px-6 py-4 gradient-accent text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl glow-orange hover:scale-105 transition-transform active:scale-95">
            <Plus size={20} />
            Add Item
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {categories.map(category => (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-display font-bold text-slate-900 border-b border-slate-100 pb-2">{category}</h3>
            <div className="grid gap-3">
              <AnimatePresence>
                {items.filter(item => (item.category || 'Kitchen Essentials') === category).map(item => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`
                      flex items-center justify-between p-5 rounded-2xl border transition-all duration-300
                      ${item.isBought ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => onToggle(item.id)}
                        className={`
                          w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all
                          ${item.isBought ? 'bg-brand-primary-start border-brand-primary-start text-white' : 'border-slate-200 text-transparent'}
                        `}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <div>
                        <p className={`font-bold transition-all ${item.isBought ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">{item.amount}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="bg-slate-50 rounded-[2rem] p-12 text-center space-y-4 border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-sm">
              <ShoppingCart size={32} />
            </div>
            <p className="text-slate-500 font-bold">Your shopping list is currently empty.</p>
            <button className="text-brand-primary-start font-bold underline">Add your first item</button>
          </div>
        )}
      </div>
    </div>
  );
}
