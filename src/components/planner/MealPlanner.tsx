import React from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Users, ArrowRight, Trash2 } from 'lucide-react';
import { Recipe, MealPlan } from '../../types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MealPlanner() {
  const [plans, setPlans] = React.useState<MealPlan[]>(
    DAYS.map((day, i) => ({
      id: `plan-${i}`,
      date: day,
      meals: {}
    }))
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl serif font-bold text-stone-900">Your Weekly Menu</h1>
          <p className="text-stone-500 italic mt-1 font-serif text-lg">"A week of intentional eating begins with a clear plan."</p>
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-2 bg-white border border-stone-200 rounded-full text-sm font-medium hover:bg-stone-50 transition-colors">
            Share Plan
          </button>
          <button className="px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-brand-olive transition-colors">
            Generate List
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-7 gap-4">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="flex flex-col h-[500px] bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
          >
            <div className={`p-4 text-center border-b border-stone-100 ${idx === 0 ? 'bg-brand-olive text-white' : 'bg-stone-50'}`}>
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">Day {idx + 1}</span>
              <h3 className="text-xl serif font-bold">{plan.date}</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {['breakfast', 'lunch', 'dinner'].map((mealType) => (
                <div key={mealType} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{mealType}</span>
                  </div>
                  
                  {plan.meals[mealType as keyof typeof plan.meals] ? (
                    <div className="group relative p-3 bg-stone-50 rounded-2xl border border-stone-100 hover:border-brand-olive/50 transition-all">
                      <h4 className="text-sm font-bold text-stone-800 line-clamp-2 leading-tight">
                        {plan.meals[mealType as keyof typeof plan.meals]?.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-stone-400">
                        <Clock size={10} />
                        <span>{plan.meals[mealType as keyof typeof plan.meals]?.cookTime}m</span>
                      </div>
                      <button className="absolute -top-1 -right-1 p-1 bg-white border border-stone-200 rounded-full text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ) : (
                    <button className="w-full py-4 border-2 border-dashed border-stone-100 rounded-2xl flex flex-col items-center justify-center text-stone-300 hover:border-stone-200 hover:text-stone-400 transition-all gap-1">
                      <PlusIcon size={16} />
                      <span className="text-[10px] font-medium">Add Meal</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-stone-50/50 border-t border-stone-100 italic text-[10px] text-stone-400 text-center">
              Total: ~1,450 kcal
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PlusIcon({ className, size = 20 }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
