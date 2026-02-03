
import React, { useState } from 'react';
import EcoRunnerGame from '../components/EcoRunnerGame';
import { Play, Rocket, Sparkles, Trophy, Zap, Gamepad2, Star, Gamepad } from 'lucide-react';
import { GameItem } from '../types';

interface KidsProps {
  games: GameItem[];
}

const Kids: React.FC<KidsProps> = ({ games }) => {
  const [activeGameUrl, setActiveGameUrl] = useState<string | null>(null);

  if (activeGameUrl) {
    return (
      <div className="fixed inset-0 z-[150] bg-black flex flex-col">
        <div className="h-20 bg-slate-950 border-b border-white/5 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <Gamepad className="text-emerald-500" />
            <h2 className="text-white font-black uppercase italic tracking-widest text-sm">Eko-Sarguzasht Faol</h2>
          </div>
          <button 
            onClick={() => setActiveGameUrl(null)}
            className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
          >
            Chiqish
          </button>
        </div>
        <div className="flex-grow">
          <iframe src={activeGameUrl} className="w-full h-full border-none" title="Game" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-6 shadow-sm">
            <Sparkles size={16} /> O'YIN ORQALI TA'LIM
          </div>
          <h2 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter italic leading-none">O'yinlar <span className="text-indigo-600">Olami</span></h2>
          <p className="text-slate-500 font-medium text-xl mt-6 italic">Ekologik bilimlarni qiziqarli o'yinlarda mustahkamlang.</p>
        </div>

        {/* Bosh o'yin (Fixed Eco-Runner) */}
        <div className="bg-slate-950 rounded-[80px] overflow-hidden shadow-3xl border border-white/5 relative group mb-16">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="relative z-10 p-12 md:p-24 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-emerald-600 text-white rounded-[32px] flex items-center justify-center mb-10 shadow-3xl shadow-emerald-500/20 group-hover:rotate-12 transition-transform duration-500">
              <Rocket size={48} />
            </div>
            <h3 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter italic leading-none">Eco-Runner <span className="text-emerald-500">3D</span></h3>
            <p className="text-slate-400 text-2xl font-medium leading-relaxed mb-12 max-w-2xl italic">
              Tayloq ko'chalarini tozalang, to'siqlardan o'ting va dunyoni asrashda o'z hissangizni qo'shing.
            </p>
            <button 
              onClick={() => setActiveGameUrl('https://abdurazoqov606.github.io/Uyx/')}
              className="px-16 py-8 bg-emerald-600 text-white rounded-[40px] font-black text-2xl shadow-3xl shadow-emerald-600/30 hover:bg-emerald-500 hover:scale-110 transition-all flex items-center gap-6"
            >
              HOZIR O'YNA <Play fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Qo'shimcha o'yinlar (Dinamik) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {games.map((game) => (
            <div key={game.id} className="bg-white rounded-[56px] overflow-hidden shadow-2xl border border-slate-50 flex flex-col hover:-translate-y-2 transition-all group">
               <div className="h-64 relative overflow-hidden">
                  <img src={game.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                  <div className="absolute inset-0 bg-black/20" />
               </div>
               <div className="p-10 flex flex-col flex-grow">
                  <h4 className="text-2xl font-black text-slate-900 mb-4 italic leading-tight">{game.title}</h4>
                  <p className="text-slate-500 font-medium mb-10 line-clamp-2">{game.description}</p>
                  <button 
                    onClick={() => setActiveGameUrl(game.url)}
                    className="mt-auto w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl"
                  >
                    O'ynash <Gamepad size={20} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kids;
