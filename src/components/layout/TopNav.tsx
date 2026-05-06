import React from 'react';
import { Menu, Search, Bell, Settings, SlidersHorizontal } from 'lucide-react';

interface TopNavProps {
  onMenuClick: () => void;
  onSettingsClick?: () => void;
}

export default function TopNav({ onMenuClick, onSettingsClick }: TopNavProps) {
  const [showNotifications, setShowNotifications] = React.useState(false);

  const notifications = [
    { id: 1, title: 'Plan Ready', desc: 'Your 7-day meal plan has been generated.', time: '2m ago' },
    { id: 2, title: 'Food Scanned', desc: 'We found 5 ingredients in your fridge photo!', time: '1h ago' },
  ];

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu size={24} className="text-slate-600" />
        </button>

        <div className="relative flex-1 group hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary-start transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search recipes, ingredients, cuisines..."
            className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-12 text-sm focus:ring-2 focus:ring-brand-primary-start/20 focus:bg-white transition-all outline-none"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
            <SlidersHorizontal size={16} className="text-slate-500" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 ml-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative"
          >
            <Bell size={22} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-accent-start rounded-full border-2 border-white" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
              <div className="p-4 border-b border-slate-100">
                <h4 className="font-bold text-slate-900">Notifications</h4>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-bold text-slate-900">{n.title}</p>
                      <span className="text-[10px] text-slate-400 font-bold">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Mark all as read</span>
              </div>
            </div>
          )}
        </div>
        <button 
          onClick={onSettingsClick}
          className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Settings size={22} />
        </button>
        <div className="hidden md:flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-black text-slate-900 tracking-tight">Daksh</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">Premium Chef</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-brand-primary-start to-brand-primary-end flex items-center justify-center text-white font-black text-lg ring-4 ring-emerald-50 shadow-lg shadow-emerald-200/50">
            D
          </div>
        </div>
      </div>
    </header>
  );
}
