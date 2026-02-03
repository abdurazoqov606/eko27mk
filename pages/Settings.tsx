
import React, { useState } from 'react';
import { 
  Moon, Sun, User as UserIcon, Check, 
  ChevronRight, Sparkles, Trash2, RefreshCw, 
  Palette, Camera, Layout, Send, Handshake, 
  Info, Database, Heart, ExternalLink
} from 'lucide-react';
import { User } from '../types';

interface SettingsProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  user: User | null;
  onUpdateProfile: (user: User) => void;
  onLogin: () => void;
}

const ACCENT_COLORS = [
  { id: 'emerald', color: 'bg-emerald-500', name: 'Zumrad' },
  { id: 'blue', color: 'bg-blue-500', name: 'Moviy' },
  { id: 'indigo', color: 'bg-indigo-500', name: 'Siyohrang' },
  { id: 'amber', color: 'bg-amber-500', name: 'Tilla' },
  { id: 'rose', color: 'bg-rose-500', name: 'Pushti' },
];

const Settings: React.FC<SettingsProps> = ({ darkMode, setDarkMode, accentColor, setAccentColor, user, onUpdateProfile, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'collab' | 'system'>('profile');
  const [editName, setEditName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProfileUpdate = () => {
    if (!user || !editName.trim()) return;
    setIsUpdating(true);
    setTimeout(() => {
      onUpdateProfile({ ...user, name: editName });
      setIsUpdating(false);
      alert("Muvaffaqiyatli saqlandi!");
    }, 800);
  };

  const changeAvatar = (seed: string) => {
    if (!user) return;
    onUpdateProfile({ 
      ...user, 
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9` 
    });
  };

  const clearCache = () => {
    if (window.confirm("Barcha kesh ma'lumotlari o'chirilsinmi? (Tizimdan chiqishingiz mumkin)")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const openTelegram = () => {
    window.open('https://t.me/vsf911', '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto pt-4 pb-20 animate-fade-in">
      <div className="mb-12">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 italic uppercase">Sozlamalar</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic">Ilovani o'zingizga moslashtiring.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Sidebar Nav */}
        <div className="lg:col-span-4 space-y-3">
           <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<UserIcon size={20} />} label="Profil" />
           <TabButton active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} icon={<Palette size={20} />} label="Ko'rinish" />
           <TabButton active={activeTab === 'collab'} onClick={() => setActiveTab('collab')} icon={<Handshake size={20} />} label="Hamkorlik" />
           <TabButton active={activeTab === 'system'} onClick={() => setActiveTab('system')} icon={<Database size={20} />} label="Tizim" />
           
           <div className="p-8 bg-emerald-500/5 rounded-[32px] border border-emerald-500/10 mt-8 hidden lg:block">
              <Sparkles className="text-emerald-500 mb-4" />
              <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-relaxed">
                 O'zgarishlar real vaqtda qo'llaniladi.
              </p>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
           <div className="bg-white dark:bg-slate-900 rounded-[56px] p-8 md:p-14 shadow-3xl border border-slate-50 dark:border-white/5 transition-all min-h-[500px]">
              
              {activeTab === 'profile' && (
                <div className="space-y-10 animate-in slide-in-from-right-4">
                   {!user ? (
                     <div className="text-center py-20">
                        <UserIcon size={64} className="text-slate-100 mx-auto mb-6" />
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase italic">Profil yaratilmagan</h4>
                        <button onClick={onLogin} className="px-12 py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg shadow-2xl">Hozir kirish</button>
                     </div>
                   ) : (
                     <>
                        <div className="flex flex-col items-center">
                           <div className="relative group cursor-pointer">
                              <img src={user.avatar} className="w-40 h-40 rounded-[48px] border-4 border-emerald-500 shadow-3xl object-cover" alt="Profile" />
                              <div className="absolute inset-0 bg-black/40 rounded-[48px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                 <Camera className="text-white" size={32} />
                              </div>
                           </div>
                           <h4 className="mt-8 text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">{user.name}</h4>
                           <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mt-2">{user.rank}</span>
                        </div>

                        <div className="space-y-8 pt-10 border-t border-slate-50 dark:border-white/5">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-4">Ism-familiyangiz</label>
                              <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-8 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[28px] font-black text-lg text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
                           </div>

                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-4">Avatar tanlash</label>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                 {['Abbos', 'Felix', 'Aneka', 'Zoe', 'Max', 'Luna'].map(seed => (
                                   <button key={seed} onClick={() => changeAvatar(seed)} className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all hover:scale-110 active:scale-95">
                                      <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4`} className="w-full h-full object-cover" />
                                   </button>
                                 ))}
                              </div>
                           </div>

                           <button onClick={handleProfileUpdate} disabled={isUpdating} className="w-full py-6 bg-emerald-600 text-white rounded-[28px] font-black text-xl shadow-3xl flex items-center justify-center gap-4 hover:bg-emerald-500 transition-all">
                             {isUpdating ? <RefreshCw className="animate-spin" /> : <>SAQLASH <Check /></>}
                           </button>
                        </div>
                     </>
                   )}
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-12 animate-in slide-in-from-right-4">
                   <div className="space-y-6">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter flex items-center gap-3"><Sun size={24} className="text-amber-500" /> Mavzu rejimi</h3>
                      <div className="grid grid-cols-2 gap-6">
                         <ThemeCard active={!darkMode} onClick={() => setDarkMode(false)} icon={<Sun size={32} className="text-amber-500" />} label="Yorqin" />
                         <ThemeCard active={darkMode} onClick={() => setDarkMode(true)} icon={<Moon size={32} className="text-blue-500" />} label="Tungi" />
                      </div>
                   </div>

                   <div className="space-y-6 pt-10 border-t border-slate-50 dark:border-white/5">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter flex items-center gap-3"><Layout size={24} className="text-emerald-500" /> Aksent ranglar</h3>
                      <div className="flex flex-wrap gap-4">
                         {ACCENT_COLORS.map(c => (
                           <button key={c.id} onClick={() => setAccentColor(c.id)} className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all ${accentColor === c.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950' : 'border-slate-50 dark:border-white/5 text-slate-400'}`}>
                              <div className={`w-4 h-4 rounded-full ${c.color}`} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{c.name}</span>
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'collab' && (
                <div className="space-y-10 animate-in slide-in-from-right-4">
                   <div className="text-center">
                      <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl">
                         <Heart size={48} fill="currentColor" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Hamkorlik Qiling</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium mt-4 max-w-sm mx-auto">
                        Eco27 loyihasini kengaytirish, investitsiya kiritish yoki yangi g'oyalar bilan bo'lishish uchun muallif bilan bevosita bog'laning.
                      </p>
                   </div>

                   <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 space-y-6">
                      <div className="flex items-start gap-4">
                         <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-emerald-500"><Sparkles size={24} /></div>
                         <div>
                            <h4 className="font-black text-slate-900 dark:text-white text-lg">Innovatsion Takliflar</h4>
                            <p className="text-sm text-slate-500">Ekologiyani yaxshilash bo'yicha har qanday texnologik g'oyani kutib qolamiz.</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-amber-500"><Heart size={24} /></div>
                         <div>
                            <h4 className="font-black text-slate-900 dark:text-white text-lg">Mablag' Ajratish</h4>
                            <p className="text-sm text-slate-500">Loyiha rivoji uchun homiylik qilish va tabiatga hissa qo'shing.</p>
                         </div>
                      </div>
                   </div>

                   <button 
                     onClick={openTelegram} 
                     className="w-full py-7 bg-blue-600 text-white rounded-[32px] font-black text-xl shadow-2xl flex items-center justify-center gap-4 hover:bg-blue-500 hover:scale-[1.02] transition-all"
                   >
                     <Send size={28} /> @vsf911 BILAN BOG'LANISH
                   </button>
                   <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                     Javob berish vaqti: 24 soat ichida
                   </p>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="space-y-10 animate-in slide-in-from-right-4">
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Tizim haqida</h3>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-slate-100 dark:border-white/5">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ilova versiyasi</span>
                         <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-2">v2.7.0 <span className="text-emerald-500">PRO</span></h4>
                      </div>
                      <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-slate-100 dark:border-white/5">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ma'lumotlar hajmi</span>
                         <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-2">1.2 MB</h4>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <button onClick={clearCache} className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[28px] hover:bg-slate-100 transition-all border border-slate-100 dark:border-white/5">
                         <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
                            <Trash2 size={20} />
                            <span className="font-bold">Keshni tozalash</span>
                         </div>
                         <ChevronRight size={18} className="text-slate-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[28px] hover:bg-slate-100 transition-all border border-slate-100 dark:border-white/5">
                         <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
                            <Info size={20} />
                            <span className="font-bold">Qo'llab-quvvatlash</span>
                         </div>
                         <ExternalLink size={18} className="text-slate-400" />
                      </button>
                   </div>
                </div>
              )}

           </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-6 rounded-[28px] font-black transition-all ${
      active 
      ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-2xl scale-[1.02]' 
      : 'bg-white dark:bg-white/5 text-slate-500 border border-slate-50 dark:border-white/5 hover:bg-slate-50'
    }`}
  >
    <div className="flex items-center gap-4">
       {icon}
       <span className="text-sm uppercase tracking-tight">{label}</span>
    </div>
    <ChevronRight size={18} className={active ? 'opacity-100' : 'opacity-0'} />
  </button>
);

const ThemeCard = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`p-10 rounded-[40px] border-4 transition-all flex flex-col items-center justify-center gap-6 ${
      active ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950' : 'border-slate-50 dark:border-white/5 bg-slate-50 dark:bg-white/5'
    }`}
  >
    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl">{icon}</div>
    <span className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">{label}</span>
  </button>
);

export default Settings;
