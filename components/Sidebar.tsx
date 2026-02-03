
import React from 'react';
import { AppSection, User } from '../types';
import { Home, Trophy, MessageSquare, BookOpen, AlertCircle, Gamepad2, Newspaper, HelpCircle, ShieldAlert, X, Globe, ShoppingBag, Settings } from 'lucide-react';

interface SidebarProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  user: User | null;
  onLogin: () => void;
  onlineCount: number;
  onClose: () => void;
}

const LOGO_URL = "https://raw.githubusercontent.com/abdurazoqov606/Hyt/main/IMG_20260201_092843.png";

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate, user, onLogin, onlineCount, onClose }) => {
  const menuItems = [
    { id: AppSection.HOME, label: 'Bosh sahifa', icon: <Home size={22} /> },
    { id: AppSection.MARKET, label: 'Eko-Bozor', icon: <ShoppingBag size={22} /> },
    { id: AppSection.NEWS_FORUM, label: 'Forum & Tanlov', icon: <Trophy size={22} /> },
    { id: AppSection.COMMUNITY_CHAT, label: 'Eko-Chat', icon: <MessageSquare size={22} /> },
    { id: AppSection.NEWS, label: 'Yangiliklar', icon: <Newspaper size={22} /> },
    { id: AppSection.GAMES, label: 'O\'yinlar', icon: <Gamepad2 size={22} /> },
    { id: AppSection.ECO_INFO, label: 'Kutubxona', icon: <BookOpen size={22} /> },
    { id: AppSection.PROBLEMS, label: 'Muammolar', icon: <AlertCircle size={22} /> },
    { id: AppSection.SUPPORT, label: 'Yordam', icon: <HelpCircle size={22} /> },
    { id: AppSection.SETTINGS, label: 'Sozlamalar', icon: <Settings size={22} /> },
  ];

  return (
    <aside className="w-[320px] h-full bg-slate-950 text-white flex flex-col shrink-0 border-r border-slate-800 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
        <div className="animate-spin-slow duration-[120s]">
          <Globe size={600} strokeWidth={0.5} className="text-emerald-500" />
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-950 pointer-events-none z-0" />

      <button onClick={onClose} className="absolute top-8 right-6 p-2 bg-white/10 rounded-full lg:hidden z-20"><X size={20} /></button>
      
      <div className="p-8 flex items-center gap-4 relative z-10">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg rotate-3 border-2 border-emerald-600 overflow-hidden">
          <img src={LOGO_URL} className="w-full h-full object-cover" alt="Logo" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">EKO <span className="text-emerald-500">27</span></h1>
          <div className="flex items-center gap-2 mt-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
            <span className="text-[9px] font-black uppercase text-emerald-500 tracking-[0.15em]">{onlineCount} ONLINE</span>
          </div>
        </div>
      </div>

      <nav className="flex-grow p-4 space-y-1 overflow-y-auto no-scrollbar relative z-10">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group/item ${
              activeSection === item.id 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 translate-x-2' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className={`transition-transform duration-500 ${activeSection === item.id ? 'scale-110' : 'group-hover/item:scale-110 group-hover/item:rotate-12'}`}>
              {item.icon}
            </span>
            <span className="text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-slate-800 bg-black/40 relative z-10">
        <button
          onClick={() => onNavigate(AppSection.ADMIN_PANEL)}
          className={`w-full flex items-center gap-4 p-5 rounded-[24px] font-black transition-all border-2 ${
            activeSection === AppSection.ADMIN_PANEL 
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/20' 
              : 'border-white/5 text-slate-500 hover:border-emerald-500/30 hover:text-white hover:bg-emerald-600/5'
          }`}
        >
          <ShieldAlert size={24} />
          <span className="text-xs uppercase tracking-widest font-black">Admin Panel</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
