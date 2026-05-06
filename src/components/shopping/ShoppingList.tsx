import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, ShoppingBag, Plus, Trash2, Scissors, Share2 } from 'lucide-react';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  amount: string;
  checked: boolean;
}

const CATEGORIES = ['Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Pantry', 'Grains', 'Other'];

export default function ShoppingList() {
  const [items, setItems] = React.useState<GroceryItem[]>([
    { id: '1', name: 'Fresh Spinach', category: 'Produce', amount: '200g', checked: false },
    { id: '2', name: 'Almond Milk', category: 'Dairy & Eggs', amount: '1L', checked: true },
    { id: '3', name: 'Chicken Breast', category: 'Meat & Seafood', amount: '500g', checked: false },
    { id: '4', name: 'Olive Oil', category: 'Pantry', amount: '1 Bottle', checked: false },
  ]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl serif font-bold text-stone-900">Grocery List</h1>
          <p className="text-stone-500 font-serif italic text-lg">Gathering ingredients for the week ahead.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 bg-white border border-stone-200 rounded-2xl text-stone-600 hover:bg-stone-50 transition-colors">
            <Share2 size={20} />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-brand-olive text-white rounded-2xl font-bold shadow-lg hover:bg-stone-700 transition-all">
            <Plus size={20} />
            Add Item
          </button>
        </div>
      </header>

      <div className="space-y-10 py-6">
        {CATEGORIES.map((category) => {
          const categoryItems = items.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <section key={category} className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 flex items-center gap-4">
                {category}
                <div className="flex-1 h-[1px] bg-stone-100" />
              </h2>
              <div className="grid gap-2">
                <AnimatePresence initial={false}>
                  {categoryItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className={`group flex items-center justify-between p-4 rounded-3xl border transition-all duration-300 ${
                        item.checked 
                          ? 'bg-stone-50/50 border-transparent opacity-50 grayscale' 
                          : 'bg-white border-stone-200 shadow-sm hover:border-brand-olive/30 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => toggleItem(item.id)}
                          className={`transition-colors ${item.checked ? 'text-emerald-500' : 'text-stone-300 hover:text-stone-400'}`}
                        >
                          {item.checked ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>
                        <div>
                          <span className={`text-lg font-medium transition-all ${item.checked ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                            {item.name}
                          </span>
                          <span className="ml-2 py-0.5 px-2 bg-stone-100 text-stone-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                            {item.amount}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="p-2 text-stone-300 hover:bg-red-50 hover:text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          );
        })}

        {items.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-300">
              <ShoppingBag size={40} />
            </div>
            <p className="text-stone-400 serif text-xl italic font-serif">Your basket is currently empty.</p>
          </div>
        )}
      </div>

      {items.some(i => i.checked) && (
        <div className="text-center pt-8">
          <button 
            onClick={() => setItems(items.filter(i => !i.checked))}
            className="text-stone-400 text-sm hover:text-red-500 transition-colors inline-flex items-center gap-2"
          >
            <Scissors size={14} />
            Clear Completed Items
          </button>
        </div>
      )}
    </div>
  );
}
