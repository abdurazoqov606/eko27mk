
import React from 'react';
import { AppSection, User } from '../types';
import { Award, Trophy, LogOut, ShieldCheck, Star, Mail, Wallet, TrendingUp, Calendar, Zap, User as UserIcon, CheckCircle2, Clock, ArrowRight, Settings, Camera, HelpCircle, Sparkles } from 'lucide-react';

interface ProfileProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (section: AppSection) => void;
}

const MOCK_ACTIVITY = [
  { id: 1, action: "Toza Hudud 27", detail: "Isbot yuklandi", date: "Bugun", status: "Checking", points: "+50" },
  { id: 2, action: "Daraxt ekish", detail: "Tayloq markazida", date: "Kecha", status: "Verified", points: "+100" },
  { id: 3, action: "Eko-Quiz", detail: "90% natija", date: "2 kun avval", status: "Verified", points: "+20" },
];

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onNavigate }) => {
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center flex-col animate-fade-in text-center p-6">
      <div className="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center mb-8">
        <UserIcon size={48} className="text-slate-300" />
      </div>
      <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Shaxsingizni tasdiqlang</h2>
      <p className="text-slate-500 font-medium mb-10 max-w-sm">Eko-yutuqlaringizni saqlash va reytingda ko'rinish uchun tizimga kiring.</p>
      <button className="px-12 py-5 bg-emerald-600 text-white rounded-[24px] font-black text-xl shadow-2xl">Kirish / Ro'yxatdan o'tish</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-20 lg:pb-8">
      
      {/* 1. Header Hero - Modern Glassmorphism */}
      <div className="relative mb-24 pt-10">
        <div className="h-64 md:h-80 bg-slate-900 rounded-[60px] overflow-hidden relative border border-slate-800">
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/40 via-emerald-900/40 to-slate-900" />
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]" />
           <div className="absolute bottom-8 right-8 flex gap-4">
              <button className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white hover:bg-white/20 transition-all border border-white/10">
                 <Settings size={20} />
              </button>
           </div>
        </div>
        
        <div className="absolute -bottom-16 left-8 md:left-20 flex flex-col md:flex-row items-end gap-8">
           <div className="relative group">
              <img src={user.avatar} className="w-40 h-40 md:w-56 md:h-56 rounded-[56px] border-[10px] border-white shadow-3xl object-cover" alt="Avatar" />
              <button className="absolute bottom-4 right-4 bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl border-4 border-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                <Camera size={20} />
              </button>
           </div>
           <div className="pb-4 text-left">
              <div className="flex items-center gap-3 mb-2">
                 <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">{user.name}</h2>
                 <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg" title="Tasdiqlangan foydalanuvchi">
                    <CheckCircle2 size={18} />
                 </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                 <span className="px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   <TrendingUp size={12} /> {user.rank}
                 </span>
                 <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   <Mail size={12} /> {user.email}
                 </span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Left Column: Stats & XP */}
        <div className="lg:col-span-4 space-y-10">
           {/* Level & XP Card */}
           <div className="bg-white rounded-[48px] p-10 shadow-xl border border-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16" />
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                 <Zap className="text-emerald-500" /> Eko-Daraja
              </h3>
              <div className="flex items-center justify-between mb-4">
                 <span className="text-6xl font-black text-emerald-600 tracking-tighter">{user.level}</span>
                 <div className="text-right">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Keyingi daraja</div>
                    <div className="text-lg font-black text-slate-800">{user.level + 1}</div>
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: `${(user.xp / user.maxXp) * 100}%` }} />
                 </div>
                 <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <span>{user.xp} XP</span>
                    <span>{user.maxXp} XP</span>
                 </div>
              </div>
           </div>

           {/* Wallet Card */}
           <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl"><Wallet size={28} /></div>
                <button className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">Yechib olish</button>
              </div>
              <div className="relative z-10">
                 <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em] mb-2">Eko-Hamyon Balansi</p>
                 <h3 className="text-5xl font-black mb-2 tracking-tighter">{user.balance.toLocaleString()} <span className="text-emerald-500 text-2xl">so'm</span></h3>
                 <p className="text-emerald-500/80 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={12} /> Real yutuq mablag'i
                 </p>
              </div>
           </div>

           {/* Achievements List */}
           <div className="bg-white rounded-[48px] p-10 shadow-xl border border-slate-50">
              <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                 <Trophy size={20} className="text-amber-500" /> Kolleksiya
              </h4>
              <div className="grid grid-cols-4 gap-4">
                 {user.achievements.map((ach) => (
                   <div key={ach.id} className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner hover:scale-110 transition-transform cursor-pointer border border-transparent hover:border-emerald-200" title={`${ach.name} - ${ach.date}`}>
                     {ach.icon}
                   </div>
                 ))}
                 {[...Array(4)].map((_, i) => (
                   <div key={i} className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-100">🔒</div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column: History & Quick Links */}
        <div className="lg:col-span-8 space-y-10">
           {/* Stats Grid */}
           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <StatCard icon={<Zap className="text-amber-500" />} label="Jami ball" value={user.points} color="bg-amber-50" />
              <StatCard icon={<TrendingUp className="text-emerald-500" />} label="Reyting" value="#42" color="bg-emerald-50" />
              <StatCard icon={<Calendar className="text-blue-500" />} label="A'zolik" value="May 2024" color="bg-blue-50" />
           </div>

           {/* Activity History */}
           <div className="bg-white rounded-[56px] p-10 md:p-12 shadow-xl border border-slate-50">
              <div className="flex justify-between items-center mb-10">
                 <h4 className="text-3xl font-black text-slate-900 tracking-tighter">Harakatlar Tarixi</h4>
                 <button className="text-[10px] font-black uppercase text-emerald-600 hover:underline">Hammasini ko'rish</button>
              </div>
              <div className="space-y-5">
                 {MOCK_ACTIVITY.map((act) => (
                   <div key={act.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-emerald-100">
                     <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${act.status === 'Verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                           {act.status === 'Verified' ? <CheckCircle2 size={28} /> : <Clock size={28} />}
                        </div>
                        <div>
                           <div className="font-black text-slate-800 text-lg leading-none mb-2">{act.action}</div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{act.detail} • {act.date}</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-xl font-black text-emerald-600">{act.points}</div>
                        <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest">ball qo'shildi</div>
                     </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Help & Support Card */}
           <div className="bg-blue-600 rounded-[56px] p-10 md:p-12 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-150 duration-700" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                 <div className="p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20">
                    <HelpCircle size={48} />
                 </div>
                 <div className="flex-grow text-center md:text-left">
                    <h4 className="text-3xl font-black mb-4 tracking-tighter">Yordam kerakmi?</h4>
                    <p className="text-blue-50 text-lg font-medium mb-8 leading-relaxed">Abdurazoqov Abbos va bizning jamoamiz sizga yordam berishga tayyor.</p>
                    <button onClick={() => onNavigate(AppSection.SUPPORT)} className="px-10 py-5 bg-white text-blue-600 rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all mx-auto md:mx-0">
                       Bog'lanish <ArrowRight size={20} />
                    </button>
                 </div>
              </div>
           </div>

           {/* Logout Button */}
           <button 
             onClick={onLogout}
             className="w-full py-6 bg-rose-50 text-rose-600 rounded-[40px] font-black text-xl flex items-center justify-center gap-4 hover:bg-rose-600 hover:text-white transition-all shadow-xl"
           >
             <LogOut size={28} /> Tizimdan chiqish
           </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className={`${color} p-8 rounded-[48px] border border-white shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all`}>
    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-transform">
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
    <h5 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h5>
  </div>
);

export default Profile;
