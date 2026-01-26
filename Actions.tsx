
import React, { useState } from 'react';
import { TREE_ACTIONS, FORUM_EVENTS } from '../constants';
import { MapPin, Calendar, Users, Camera, PlayCircle, Trophy, UserPlus, Send, CheckCircle, Gift, Info, Trash2, Share2, Award } from 'lucide-react';

const Actions: React.FC = () => {
  const [showRegForm, setShowRegForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState('');

  const schoolImages = [
    "https://raw.githubusercontent.com/abdurazoqov606/Maktab-rasm/main/rasm1.jpg",
    "https://raw.githubusercontent.com/abdurazoqov606/Maktab-rasm/main/rasm2.jpg",
    "https://raw.githubusercontent.com/abdurazoqov606/Maktab-rasm/main/rasm3.jpg",
    "https://raw.githubusercontent.com/abdurazoqov606/Maktab-rasm/main/rasm4.jpg",
    "https://raw.githubusercontent.com/abdurazoqov606/Maktab-rasm/main/rasm5.jpg"
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowRegForm(false);
      setSelectedAction(null);
      setSubmitted(false);
      setPhone('');
    }, 3000);
  };

  const handleShareOnTelegram = () => {
    const message = encodeURIComponent("Salom! Men 27-maktabning EcoQadam loyihasiga qo'shildim (namuna). Siz ham tabiatni asrashda yordam bering! 🌿 Batafsil: https://eko27mk.vercel.app/");
    window.open(`https://t.me/share/url?url=https://eko27mk.vercel.app/&text=${message}`, '_blank');
  };

  const openReg = (actionTitle?: string) => {
    if (actionTitle) setSelectedAction(actionTitle);
    setShowRegForm(true);
  };

  return (
    <div className="pt-24 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Eko-Harakatlar 2026 (namuna)</h2>
            <p className="text-xl text-slate-600">Tayloq va Samarqand yoshlari birlashgan platforma (namuna).</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleShareOnTelegram}
              className="px-8 py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-blue-200 flex items-center gap-2 group"
            >
              <Share2 size={20} className="group-hover:rotate-12 transition-transform" /> Loyihani ulashish (namuna)
            </button>
            <button 
              onClick={() => openReg("Umumiy Ko'ngillilik (namuna)")}
              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center gap-2 group"
            >
              <UserPlus size={20} className="group-hover:scale-110 transition-transform" /> Ishtirok etish (namuna)
            </button>
          </div>
        </div>

        {/* Advocacy/Referral Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[48px] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full text-xs font-black uppercase tracking-widest mb-6">
                  <Award size={14} className="text-amber-300" /> Mukofotlar (namuna)
                </div>
                <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Asrang va yuting! (namuna)</h3>
                <p className="text-emerald-50 text-lg mb-10 leading-relaxed font-medium">
                  Eng ko'p do'stini taklif qilgan 10 ta ishtirokchi yil yakunida taqdirlanadi (namuna).
                </p>
                <div className="flex flex-wrap gap-4">
                   <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                      <div className="text-2xl font-black">100+</div>
                      <div className="text-[10px] uppercase font-bold opacity-70">Takliflar (namuna)</div>
                   </div>
                   <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                      <div className="text-2xl font-black">Smartfon</div>
                      <div className="text-[10px] uppercase font-bold opacity-70">Mukofot (namuna)</div>
                   </div>
                </div>
              </div>
              <div className="bg-white rounded-[40px] p-8 text-slate-900 shadow-3xl">
                <h4 className="text-2xl font-black mb-6">Ulashish (namuna)</h4>
                <p className="text-slate-500 mb-8 font-medium">Do'stlaringizga xabar yuboring (namuna):</p>
                <button 
                  onClick={handleShareOnTelegram}
                  className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-100 group"
                >
                  <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Telegram'da tarqatish
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Forum Section */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 animate-pulse">
              <Trophy size={32} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{FORUM_EVENTS[0].title}</h3>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-4">
                {FORUM_EVENTS[0].prizes.map((p, i) => (
                  <div key={i} className="flex items-start gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="text-5xl group-hover:rotate-12 transition-transform">{p.icon}</div>
                    <div>
                      <h4 className="text-xl font-black text-emerald-700 flex items-center gap-2">
                        {p.rank} <Gift size={16} className="text-amber-500" />
                      </h4>
                      <p className="text-slate-900 font-bold mb-1">{p.prize} (namuna)</p>
                      <p className="text-slate-500 text-sm">{p.description} (namuna)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
              <img src={schoolImages[0]} className="w-full h-full object-cover min-h-[500px] group-hover:scale-110 transition-transform duration-1000" alt="Forum" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/20 to-transparent flex items-end p-10">
                <div className="text-white">
                  <h4 className="text-4xl font-black mb-3">Forum (namuna)</h4>
                  <p className="opacity-90 text-lg leading-relaxed font-medium">Tayloq tumani 27-maktab hovlisida tashkil etilishi kutilmoqda (namuna).</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Action List */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <Calendar className="text-emerald-600" /> Rejadagi Aksiyalar (namuna)
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {TREE_ACTIONS.map(action => (
                <div key={action.id} className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-xl hover:border-emerald-300 transition-all flex flex-col group">
                  <h4 className="text-2xl font-black text-slate-900 mb-4 leading-tight">{action.title}</h4>
                  <div className="space-y-3 mb-8 flex-grow">
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                      <Calendar size={18} className="text-emerald-500" /> {action.date} (namuna)
                    </div>
                  </div>
                  <button 
                    onClick={() => openReg(action.title)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all"
                  >
                    Qo'shiling (namuna)
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cleaning Reports Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <Trash2 className="text-rose-500" /> Tozalik (namuna)
            </h3>
            <div className="p-8 bg-blue-600 rounded-[40px] text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                <h4 className="text-2xl font-black mb-4">Tozalaymiz! (namuna)</h4>
                <p className="text-blue-50 text-sm mb-6 leading-relaxed font-bold">Har hafta Navzandakda tadbirlar o'tkazamiz (namuna).</p>
                <div className="mt-8 relative h-56 rounded-3xl overflow-hidden group border-2 border-white/30">
                  <img src={schoolImages[1]} className="w-full h-full object-cover" alt="Cleaning" />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Registration Modal */}
      {showRegForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowRegForm(false)} />
          <div className="relative bg-white rounded-[48px] p-8 md:p-12 w-full max-w-xl shadow-2xl animate-in zoom-in duration-500 border-t-8 border-emerald-600">
            {submitted ? (
              <div className="text-center py-16 animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <CheckCircle size={56} />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4">Rahmat! (namuna)</h3>
                <p className="text-slate-600 text-lg font-medium leading-relaxed">
                  Bu shunchaki ro'yxatdan o'tish namunasi edi. Loyiha real ishga tushganda haqiqiy ro'yxatga olish bo'ladi.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Ko'ngilli (namuna)</h3>
                  <button onClick={() => setShowRegForm(false)} className="p-2 font-black">✕</button>
                </div>
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Ismingiz (namuna)</label>
                    <input required type="text" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold" placeholder="Abbos (namuna)" />
                  </div>
                  <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xl">Tasdiqlash (namuna)</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Actions;
