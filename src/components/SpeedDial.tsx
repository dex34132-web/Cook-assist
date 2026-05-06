import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ScanLine, ChefHat, Plus, ClipboardList } from 'lucide-react';

interface SpeedDialProps {
  onOptionClick: (option: string) => void;
}

export default function SpeedDial({ onOptionClick }: SpeedDialProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const actions = [
    { name: 'Meal Planner', icon: ClipboardList, id: 'meal-planner', color: 'text-blue-500 bg-blue-50' },
    { name: 'Food Scanner', icon: ScanLine, id: 'food-scanner', color: 'text-purple-500 bg-purple-50' },
    { name: 'Fridge Chef', icon: ChefHat, id: 'scan-fridge', color: 'text-orange-500 bg-orange-50' },
    { name: 'Settings', icon: Calendar, id: 'settings', color: 'text-emerald-500 bg-emerald-50' },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[60]" 
            onClick={() => setIsOpen(false)} 
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-10 right-10 z-[70]">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              key="actions"
              className="absolute bottom-24 right-0 flex flex-col items-end gap-4 min-w-[200px]">
              {actions.map((action, index) => (
                <motion.button
                  key={action.name}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    onOptionClick(action.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-2xl border border-slate-100 ${action.color} transition-all hover:scale-105 active:scale-95`}
                >
                  <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">{action.name}</span>
                  <action.icon size={20} />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          onClick={() => setIsOpen(!isOpen)}
          animate={isOpen ? { 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            scale: 1 
          } : { 
            boxShadow: [
              "0 0 20px rgba(255, 107, 53, 0.6)", 
              "0 0 40px rgba(255, 107, 53, 0.8)", 
              "0 0 20px rgba(255, 107, 53, 0.6)"
            ] 
          }}
          transition={{ duration: isOpen ? 0.3 : 2, repeat: isOpen ? 0 : Infinity, ease: "easeInOut" }}
          className="w-16 h-16 bg-white text-[#FF6B35] rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all relative z-10 border border-slate-100"
        >
          <motion.div animate={{ rotate: isOpen ? 45 : 0 }}>
            <Plus size={28} />
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}
