
import React, { useState, useEffect } from 'react';
import { X, Loader2, ArrowRight, Sparkles, ShieldAlert } from 'lucide-react';
import { User } from '../types';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onStartCamera: () => Promise<boolean>;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess, onStartCamera }) => {
  const [loading, setLoading] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [formData, setFormData] = useState({ name: '', avatarSeed: 'Abbos' });

  useEffect(() => {
    const existing = localStorage.getItem('eko27_user');
    if (existing) setHasExistingProfile(true);
  }, []);

  const avatars = [
    { seed: 'Abbos', label: 'Quvnoq' }, { seed: 'Felix', label: 'Aqlli' },
    { seed: 'Aneka', label: 'Jasur' }, { seed: 'Zoe', label: 'Mehribon' },
    { seed: 'Max', label: 'Chaqqon' }, { seed: 'Luna', label: 'Guzal' },
    { seed: 'Oliver', label: 'Faol' }, { seed: 'Maya', label: 'Eko' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || hasExistingProfile) return;
    setLoading(true);

    // Ruxsat so'rash
    await onStartCamera();

    try {
      const userId = 'user_' + Math.random().toString(36).substr(2, 9);
      const mockUser: User = {
        id: userId,
        name: formData.name,
        email: `${formData.name.toLowerCase()}@eko27.uz`,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${formData.avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
        points: 100, balance: 0, rank: 'Eko-Qadamchi', level: 1, xp: 0, maxXp: 500, achievements: [],
        joinedDate: new Date().toISOString().split('T')[0]
      };

      await setDoc(doc(db, "users", userId), { ...mockUser, timestamp: serverTimestamp() });
      onLoginSuccess(mockUser);
    } catch (err) {
      alert("Xatolik yuz berdi.");
    }
    setLoading(false);
  };

  if (hasExistingProfile) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose} />
        <div className="relative bg-white w-full max-w-lg rounded-[64px] p-12 text-center border-t-[12px] border-rose-500">
           <ShieldAlert size={80} className="text-rose-500 mx-auto mb-8 animate-bounce" />
           <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase italic">Profil Mavjud</h3>
           <button onClick={onClose} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase">Tushunarli</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-[64px] shadow-3xl overflow-hidden p-10 md:p-14 border-t-[12px] border-emerald-600">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 text-slate-300 hover:text-slate-900"><X /></button>
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-100 rounded-[28px] flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-inner">
            <Sparkles size={40} className="animate-pulse" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Profil Yaratish</h2>
          <p className="text-slate-500 font-medium mt-2 italic">O'zingizga yoqqan quvnoq obrazni tanlang!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block ml-4">Ismingiz yoki Taxallusingiz</label>
              <input required type="text" placeholder="Abbos..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-8 py-5 bg-slate-50 rounded-[32px] font-black text-lg outline-none" />
           </div>
           <div className="grid grid-cols-4 gap-4">
              {avatars.map(av => (
                <button key={av.seed} type="button" onClick={() => setFormData({...formData, avatarSeed: av.seed})} className={`aspect-square rounded-[24px] overflow-hidden border-4 transition-all ${formData.avatarSeed === av.seed ? 'border-emerald-500 bg-emerald-50 shadow-xl scale-105' : 'border-slate-50 opacity-60'}`}>
                   <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${av.seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`} className="w-full h-full object-cover" />
                </button>
              ))}
           </div>
           <button disabled={loading || !formData.name} className="w-full py-6 bg-emerald-600 text-white rounded-[32px] font-black text-xl shadow-2xl flex items-center justify-center gap-4">
              {loading ? <Loader2 className="animate-spin" /> : <>PROFILNI TAYYORLASH <ArrowRight /></>}
           </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
