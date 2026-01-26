
import React, { useState } from 'react';
import { TREE_ACTIONS } from '../constants';
import { MapPin, Calendar, Users, Camera, PlayCircle, Trophy, UserPlus, Send, CheckCircle, Gift, Info, Trash2, Share2, Award, Newspaper, X } from 'lucide-react';
import { EcoArticle } from '../types';

interface NewsProps {
  articles: EcoArticle[];
}

const News: React.FC<NewsProps> = ({ articles }) => {
  const [showRegForm, setShowRegForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

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
    }, 3000);
  };

  const handleShareOnTelegram = () => {
    const message = encodeURIComponent("Salom! Men 27-maktabning EcoQadam loyihasiga qo'shildim. Siz ham tabiatni asrashda yordam bering! 🌿 Batafsil: https://eko27mk.vercel.app/");
    window.open(`https://t.me/share/url?url=https://eko27mk.vercel.app/&text=${message}`, '_blank');
  };

  const openReg = (actionTitle?: string) => {
    if (actionTitle) setSelectedAction(actionTitle);
    setShowRegForm(true);
  };

  return (
    <div className="pt-2 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Newspaper size={14} /> Dolzarb Xabarlar
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">Ekologik Yangiliklar</h2>
            <p className="text-xl text-slate-500 font-medium">Tayloq va 27-maktab hayotidagi eng so'nggi voqealar.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleShareOnTelegram}
              className="px-8 py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl flex items-center gap-2 group"
            >
              <Share2 size={20} /> Ulashish
            </button>
          </div>
        </div>

        {/* Major News / Hero Section */}
        <section className="mb-20">
          <div className="bg-slate-900 rounded-[56px] p-8 md:p-16 text-white shadow-3xl relative overflow-hidden border border-emerald-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                  <Award size={14} className="text-amber-300" /> Bosh Yangilik
                </div>
                <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tighter">Maktabimiz "Yashil Chempion" nominatsiyasiga yuborildi!</h3>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                  27-maktab o'quvchilarining faolligi sababli tuman miqyosida eng ekologik ta'lim muassasasi deb tan olindi.
                </p>
                <div className="flex flex-wrap gap-4">
                   <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                      <div className="text-2xl font-black text-emerald-500">2500+</div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">Daraxt ekildi</div>
                   </div>
                   <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                      <div className="text-2xl font-black text-emerald-500">12 ta</div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">Aksiya o'tdi</div>
                   </div>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-[40px] h-full min-h-[300px]">
                <img src={schoolImages[0]} className="w-full h-full object-cover shadow-2xl transition-transform duration-700 group-hover:scale-110" alt="News" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Upcoming Events / News Feed */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tighter">
               <Calendar className="text-emerald-600" /> Yangi Maqolalar
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map(art => (
                <div key={art.id} className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-xl hover:border-emerald-300 transition-all flex flex-col group">
                  <div className="h-48 rounded-3xl overflow-hidden mb-6">
                    <img src={art.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={art.title} />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4 leading-tight">{art.title}</h4>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2">{art.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">{art.date}</span>
                    <button className="text-emerald-600 font-black text-xs uppercase tracking-widest">Batafsil</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Reports Sidebar */}
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tighter">
               <Camera className="text-rose-500" /> Foto-Hisobotlar
            </h3>
            <div className="p-8 bg-blue-600 rounded-[40px] text-white shadow-xl relative overflow-hidden">
                <h4 className="text-2xl font-black mb-4">Navzandak tozaligi</h4>
                <p className="text-blue-50 text-sm mb-6 leading-relaxed font-bold">O'tgan haftadagi aksiya natijalari foto-jamlamada.</p>
                <div className="mt-8 relative h-56 rounded-3xl overflow-hidden group border-2 border-white/30">
                  <img src={schoolImages[1]} className="w-full h-full object-cover" alt="Cleaning" />
                </div>
            </div>
          </div>
        </div>
      </div>

      {showRegForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowRegForm(false)} />
          <div className="relative bg-white rounded-[48px] p-8 md:p-12 w-full max-w-xl shadow-2xl animate-in zoom-in duration-500">
             <div className="flex justify-between items-start mb-8">
                <h3 className="text-3xl font-black">Ro'yxatdan o'tish</h3>
                <button onClick={() => setShowRegForm(false)}><X /></button>
             </div>
             <form onSubmit={handleRegister} className="space-y-6">
                <input required className="w-full px-6 py-4 bg-slate-50 rounded-2xl" placeholder="Ismingiz" />
                <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black">Yuborish</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
