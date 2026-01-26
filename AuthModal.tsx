
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Loader2, ArrowRight, CheckCircle2, Leaf, Sparkles, Camera, Smartphone } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    code: '',
    interest: 'Planting'
  });

  const interests = [
    { id: 'Planting', label: 'Daraxt ekish', icon: '🌳' },
    { id: 'Recycling', label: 'Qayta ishlash', icon: '♻️' },
    { id: 'Education', label: 'Eko-ta\'lim', icon: '📚' },
    { id: 'Energy', label: 'Yashil energiya', icon: '☀️' }
  ];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const mockUser: User = {
        id: Date.now().toString(),
        name: formData.name || 'Eko-Qadamchi',
        email: formData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
        points: 50, // Welcome points
        balance: 0,
        rank: 'Yangi Eko-Qadamchi',
        level: 1,
        xp: 0,
        maxXp: 100,
        achievements: [],
        joinedDate: new Date().toISOString().split('T')[0]
      };
      onLoginSuccess(mockUser);
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-[50px] shadow-3xl overflow-hidden animate-in zoom-in duration-500 border border-emerald-50">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-slate-50">
          <div className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <div className="p-10 md:p-14">
          <button onClick={onClose} className="absolute top-8 right-8 p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all">
            <X size={24} />
          </button>

          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
               <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-xl shadow-emerald-100/50">
                    <UserIcon size={40} />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">O'zingizni tanishtiring</h2>
                  <p className="text-slate-500 font-medium mt-3">EcoQadam oilasining yangi a'zosi bo'ling</p>
               </div>
               
               <div className="space-y-4">
                  <div className="relative">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text"
                      placeholder="To'liq ismingiz"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500/30 outline-none font-bold text-slate-700 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <button 
                    onClick={nextStep}
                    disabled={!formData.name}
                    className="w-full py-6 bg-emerald-600 text-white rounded-[28px] font-black text-lg shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    Davom etish <ArrowRight />
                  </button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
               <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-xl shadow-blue-100/50">
                    <Smartphone size={40} />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Kontakt ma'lumotlari</h2>
                  <p className="text-slate-500 font-medium mt-3">Xavfsizlik va xabarlar uchun kerak bo'ladi</p>
               </div>
               
               <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="email"
                      placeholder="Email manzilingiz"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500/30 outline-none font-bold text-slate-700 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="password"
                      placeholder="Maxfiy kod (Password)"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500/30 outline-none font-bold text-slate-700 transition-all"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button onClick={prevStep} className="px-8 py-6 bg-slate-100 text-slate-500 rounded-[28px] font-black hover:bg-slate-200 transition-all">Orqaga</button>
                    <button 
                      onClick={nextStep}
                      disabled={!formData.email || !formData.code}
                      className="flex-grow py-6 bg-emerald-600 text-white rounded-[28px] font-black text-lg shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      Oxirgi qadam <ArrowRight />
                    </button>
                  </div>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
               <div className="text-center">
                  <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-600 mx-auto mb-6 shadow-xl shadow-amber-100/50">
                    <Leaf size={40} />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Sizning yo'nalishingiz?</h2>
                  <p className="text-slate-500 font-medium mt-3">O'zingizga mos eko-persona tanlang</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  {interests.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => setFormData({...formData, interest: item.id})}
                      className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-3 ${
                        formData.interest === item.id 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : 'border-slate-100 bg-white hover:border-emerald-200'
                      }`}
                    >
                      <span className="text-4xl">{item.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </button>
                  ))}
               </div>

               <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black text-lg shadow-2xl flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Akkaunt ochish <Sparkles size={20} /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
