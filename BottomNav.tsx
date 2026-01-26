
import React from 'react';
import { AppSection } from '../types';
import { Home, Trophy, MessageSquare, Newspaper, ShieldAlert } from 'lucide-react';

interface BottomNavProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeSection, onNavigate }) => {
  const navItems = [
    { id: AppSection.HOME, icon: <Home size={24} />, label: 'Asosiy' },
    { id: AppSection.NEWS_FORUM, icon: <Trophy size={24} />, label: 'Forum' },
    { id: AppSection.COMMUNITY_CHAT, icon: <MessageSquare size={24} />, label: 'Chat' },
    { id: AppSection.NEWS, icon: <Newspaper size={24} />, label: 'Xabarlar' },
    { id: AppSection.ADMIN_PANEL, icon: <ShieldAlert size={24} />, label: 'Admin' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 pb-8 flex justify-between items-center z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeSection === item.id 
              ? 'text-emerald-600 scale-110' 
              : 'text-slate-400'
          }`}
        >
          <div className={`${activeSection === item.id ? 'bg-emerald-50 p-2 rounded-xl' : ''}`}>
            {item.icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
