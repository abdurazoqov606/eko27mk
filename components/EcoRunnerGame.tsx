
import React from 'react';
import { ArrowLeft, Rocket } from 'lucide-react';

interface EcoRunnerGameProps {
  onExit: () => void;
}

const EcoRunnerGame: React.FC<EcoRunnerGameProps> = ({ onExit }) => {
  return (
    <div className="fixed inset-0 z-[150] bg-black flex flex-col animate-in fade-in zoom-in duration-500">
      {/* Dynamic Header - Minimalist */}
      <div className="h-20 bg-slate-950 border-b border-white/5 flex items-center justify-between px-8 md:px-12 shrink-0">
        <div className="flex items-center gap-8">
          <button 
            onClick={onExit}
            className="flex items-center gap-3 px-8 py-3.5 bg-white/5 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all border border-white/10 hover:shadow-2xl hover:shadow-emerald-600/30 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> Orqaga qaytish
          </button>
          <div className="h-8 w-px bg-white/10 hidden md:block" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Rocket size={20} />
            </div>
            <h2 className="text-white font-black text-2xl tracking-tighter italic">ECO-RUNNER <span className="text-emerald-500 uppercase">Pro</span></h2>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-6">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">O'yin Faol</span>
           </div>
        </div>
      </div>

      {/* Main Game Frame - Full Width/Height */}
      <div className="flex-grow relative overflow-hidden bg-black shadow-[inset_0_0_150px_rgba(0,0,0,1)]">
        <iframe 
          src="https://abdurazoqov606.github.io/Uyx/" 
          className="w-full h-full border-none"
          title="Eco Runner Game"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        
        {/* Mobile Control Info Tooltip - Subtle */}
        <div className="absolute bottom-8 left-8 pointer-events-none group hidden md:block">
           <div className="bg-slate-950/80 backdrop-blur-2xl p-6 rounded-[32px] border border-white/10 text-white shadow-3xl opacity-40 hover:opacity-100 transition-opacity">
              <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-emerald-500 border-b border-white/10 pb-2">Klaviatura Boshqaruvi</p>
              <div className="flex gap-4 font-bold text-sm">
                 <div className="flex flex-col items-center gap-1">
                    <span className="px-3 py-1 bg-white/10 rounded-lg">A</span>
                    <span className="text-[8px] uppercase">Chapga</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                    <span className="px-3 py-1 bg-white/10 rounded-lg">D</span>
                    <span className="text-[8px] uppercase">O'ngga</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                    <span className="px-3 py-1 bg-white/10 rounded-lg">W</span>
                    <span className="text-[8px] uppercase">Sakrash</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EcoRunnerGame;
