import React from 'react';
import { 
  Home, 
  Camera, 
  BookOpen, 
  Calendar, 
  ShoppingCart, 
  Heart, 
  UtensilsCrossed, 
  ScanLine, 
  Settings,
  X,
  LogOut,
  MapPin,
  ChefHat
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'scan-fridge', icon: Camera, label: 'Scan Fridge' },
  { id: 'recipes', icon: BookOpen, label: 'Recipes' },
  { id: 'meal-planner', icon: Calendar, label: 'Meal Planner' },
  { id: 'shopping-list', icon: ShoppingCart, label: 'Shopping List' },
  { id: 'favourites', icon: Heart, label: 'Favourites' },
  { id: 'my-recipes', icon: UtensilsCrossed, label: 'My Recipes' },
  { id: 'food-scanner', icon: ScanLine, label: 'Food Scanner' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose, activeTab, setActiveTab }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 z-50 transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8 pb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center text-white shadow-lg">
                <ChefHat size={22} fill="white" />
              </div>
              <span className="text-xl font-display font-black tracking-tighter text-slate-900 flex items-center gap-1">
                CookBuddy <span className="text-[#FF6B35]">AI</span>
              </span>
            </div>
            <button onClick={onClose} className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={({ currentTarget }) => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${activeTab === item.id 
                    ? 'bg-[#FFF2EE] text-[#FF6B35]' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <div className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <item.icon size={20} className={activeTab === item.id ? 'text-[#FF6B35]' : 'text-slate-400'} />
                </div>
                <span className={`font-bold text-sm tracking-tight ${activeTab === item.id ? 'text-[#FF6B35]' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Lower Sidebar Card */}
          <div className="px-6 py-6 border-t border-slate-100">
            <div className="bg-[#FFF2EE] rounded-[2rem] p-6 space-y-4">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                Create your personalized meal plan
              </p>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Get a plan based on your goals, diet & preferences.
              </p>
              <button 
                onClick={() => setActiveTab('meal-planner')}
                className="w-full bg-[#FF6B35] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg hover:bg-[#e85a27] transition-all"
              >
                Create Meal Plan
              </button>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#FF6B35]/20 rounded-full flex items-center justify-center text-[#FF6B35]">
                <ChefHat size={14} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Daksh’s Studio</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
