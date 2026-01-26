
import React from 'react';
import { AppSection, User } from '../types';
import { Leaf, Menu, X, MessageSquare, User as UserIcon, LogIn } from 'lucide-react';

interface NavbarProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  user: User | null;
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, user, onLogin }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: AppSection.HOME, label: 'Bosh sahifa' },
    { id: AppSection.NEWS_FORUM, label: 'Forum' },
    { id: AppSection.COMMUNITY_CHAT, label: 'Eko-Chat' },
    { id: AppSection.ECO_INFO, label: 'Kutubxona' },
    { id: AppSection.NEWS, label: 'Aksiyalar' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate(AppSection.HOME)}
          >
            <div className="p-2.5 bg-emerald-600 rounded-2xl group-hover:rotate-12 transition-all shadow-lg shadow-emerald-200/50">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">EKO 27</span>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-bold transition-all px-4 py-2 rounded-xl ${
                  activeSection === item.id 
                    ? 'text-emerald-700 bg-emerald-50' 
                    : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="h-6 w-px bg-slate-200 mx-2" />

            {user ? (
              <button 
                onClick={() => onNavigate(AppSection.PROFILE)}
                className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl border transition-all ${
                  activeSection === AppSection.PROFILE ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <img src={user.avatar} className="w-9 h-9 rounded-xl object-cover" alt="Profile" />
                <div className="text-left">
                  <div className="text-xs font-black text-slate-900 leading-none truncate max-w-[100px]">{user.name}</div>
                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{user.points} ball</div>
                </div>
              </button>
            ) : (
              <button 
                onClick={onLogin}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all"
              >
                <LogIn size={16} /> Kirish
              </button>
            )}
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2 bg-slate-50 rounded-xl">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-50 p-4 space-y-2 shadow-xl animate-in fade-in slide-in-from-top-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-6 py-4 rounded-2xl font-bold ${
                activeSection === item.id ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
          {!user ? (
            <button 
              onClick={() => {
                onLogin();
                setIsOpen(false);
              }} 
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black"
            >
              Kirish
            </button>
          ) : (
            <button 
              onClick={() => {
                onNavigate(AppSection.PROFILE);
                setIsOpen(false);
              }} 
              className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black flex items-center justify-center gap-3"
            >
              <img src={user.avatar} className="w-8 h-8 rounded-lg" /> {user.name}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
