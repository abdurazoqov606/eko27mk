
import React from 'react';
import { AppSection, User } from '../types';
import { Leaf, Home, Trophy, MessageSquare, BookOpen, User as UserIcon, LogIn, AlertCircle, Gamepad2, ShoppingBag, Map, Newspaper, HelpCircle, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  user: User | null;
  onLogin: () => void;
  onlineCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate, user, onLogin, onlineCount }) => {
  const menuItems = [
    { id: AppSection.HOME, label: 'Bosh sahifa', icon: <Home size={22} /> },
    { id: AppSection.NEWS_FORUM, label: 'Forum & Tanlovlar', icon: <Trophy size={22} /> },
    { id: AppSection.COMMUNITY_CHAT, label: 'Eko-Chat', icon: <MessageSquare size={22} /> },
    { id: AppSection.NEWS, label: 'Yangiliklar', icon: <Newspaper size={22} /> },
    { id: AppSection.MAP, label: 'Eko-Xarita', icon: <Map size={22} /> },
    { id: AppSection.GAMES, label: 'O\'yinlar Olami', icon: <Gamepad2 size={22} /> },
    { id: AppSection.MARKET, label: 'Eko-Market', icon: <ShoppingBag size={22} /> },
    { id: AppSection.ECO_INFO, label: 'Kutubxona', icon: <BookOpen size={22} /> },
    { id: AppSection.PROBLEMS, label: 'Muammolar', icon: <AlertCircle size={22} /> },
    { id: AppSection.SUPPORT, label: 'Yordam va Aloqa', icon: <HelpCircle size={22} /> },
  ];

  return (
    <aside className="w-[320px] h-full bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 hidden lg:flex">
      {/* Logo */}
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 rotate-3">
          <Leaf className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">EKO 27</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">{onlineCount} online</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl font-bold transition-all ${
              activeSection === item.id 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/10' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className={`${activeSection === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
              {item.icon}
            </div>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Admin Panel Entry */}
      <div className="p-8 border-t border-slate-800 bg-black/20">
        <button
          onClick={() => onNavigate(AppSection.ADMIN_PANEL)}
          className={`w-full flex items-center gap-4 p-5 rounded-[24px] font-black transition-all border-2 ${
            activeSection === AppSection.ADMIN_PANEL 
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl' 
              : 'border-white/10 text-slate-400 hover:border-emerald-500/50 hover:text-white'
          }`}
        >
          <ShieldAlert size={24} />
          <span className="text-sm uppercase tracking-[0.2em]">Admin Panel</span>
        </button>
        
        {!user && (
          <button 
            onClick={onLogin}
            className="w-full mt-4 py-3 bg-white/5 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Tizimga kirish
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
