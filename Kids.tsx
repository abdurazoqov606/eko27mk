
import React, { useState } from 'react';
import EcoGameRunner from '../components/EcoGameRunner';
import TrashSorter from '../components/TrashSorter';
import { Gamepad2, Trophy, Star, Play, ArrowLeft, Recycle, Zap, TreeDeciduous, Rocket } from 'lucide-react';

type GameMode = 'launcher' | 'runner' | 'sorter' | 'garden';

const Kids: React.FC = () => {
  const [mode, setMode] = useState<GameMode>('launcher');
  const [globalScore, setGlobalScore] = useState(1250); // Simulating progress

  const renderContent = () => {
    switch (mode) {
      case 'runner':
        return <EcoGameRunner onExit={() => setMode('launcher')} />;
      case 'sorter':
        return <TrashSorter onExit={() => setMode('launcher')} />;
      default:
        return (
          <div className="animate-fade-in space-y-12">
            {/* Header / Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
                 <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Sizning Unvoningiz</span>
                    <h3 className="text-3xl font-black mt-2">Tabiat Qiroli 👑</h3>
                    <div className="mt-6 flex items-center gap-2">
                      <div className="h-2 flex-grow bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 w-3/4 animate-pulse"></div>
                      </div>
                      <span className="text-xs font-black">75%</span>
                    </div>
                 </div>
                 <Zap className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600">
                  <Trophy size={32} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Ball</span>
                  <div className="text-3xl font-black text-slate-900">{globalScore.toLocaleString()}</div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl flex items-center gap-6">
                <div className="w-16 h-16 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-600">
                  <Star size={32} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yutuqlar</span>
                  <div className="text-3xl font-black text-slate-900">12 ta</div>
                </div>
              </div>
            </div>

            {/* Game Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <GameCard 
                title="Eco-Runner 3D" 
                desc="Tayloq yo'llari bo'ylab yugurib, tabiatni tozalang!"
                icon={<Rocket className="w-10 h-10" />}
                color="from-emerald-500 to-emerald-700"
                onClick={() => setMode('runner')}
                tag="HIT"
              />
              <GameCard 
                title="Trash Sorter Pro" 
                desc="Chiqindilarni saralash bo'yicha chempion bo'ling!"
                icon={<Recycle className="w-10 h-10" />}
                color="from-blue-500 to-blue-700"
                onClick={() => setMode('sorter')}
                tag="POPULAR"
              />
              <GameCard 
                title="Green Garden" 
                desc="O'z virtual bog'ingizni yarating va daraxt o'stiring."
                icon={<TreeDeciduous className="w-10 h-10" />}
                color="from-purple-500 to-purple-700"
                onClick={() => {}}
                tag="SOON"
                disabled
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-16">
          <div>
             <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Game Center</h2>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">O'ynang, o'rganing va tabiatni qutqaring!</p>
          </div>
          {mode !== 'launcher' && (
            <button 
              onClick={() => setMode('launcher')}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl font-black text-slate-900 shadow-xl hover:bg-slate-50 transition-all border border-slate-100"
            >
              <ArrowLeft size={20} /> Orqaga
            </button>
          )}
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

const GameCard = ({ title, desc, icon, color, onClick, tag, disabled }: any) => (
  <div 
    onClick={!disabled ? onClick : undefined}
    className={`group relative h-[450px] rounded-[56px] overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 ${disabled ? 'opacity-60 grayscale' : 'hover:scale-[1.02] hover:-translate-y-2'}`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color} transition-all duration-700 group-hover:scale-110`} />
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
    
    <div className="relative h-full p-10 flex flex-col justify-between text-white">
      <div>
        {tag && (
          <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
            {tag}
          </span>
        )}
        <div className="mt-8 bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform">
          {icon}
        </div>
      </div>

      <div>
        <h3 className="text-4xl font-black mb-4 leading-none">{title}</h3>
        <p className="text-white/70 font-bold text-sm mb-8 leading-relaxed line-clamp-2">{desc}</p>
        <div className="flex items-center gap-4">
          <div className="px-8 py-4 bg-white text-slate-900 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl flex items-center gap-2 group-hover:gap-4 transition-all">
            {disabled ? 'Tez kunda' : 'Play Now'} <Play size={16} fill="currentColor" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Kids;
