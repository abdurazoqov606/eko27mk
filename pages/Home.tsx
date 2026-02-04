
import React, { useState, useEffect } from 'react';
import { AppSection } from '../types';
import { ArrowRight, Leaf, Globe, ShieldCheck, Sparkles, Users, Trophy, Calculator, Droplets, Zap, TrendingDown, Newspaper, Coins } from 'lucide-react';

interface HomeProps {
  onNavigate: (section: AppSection) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const handleFunding = () => {
    window.open('https://t.me/vsf911', '_blank');
  };

  return (
    <div className="animate-fade-in overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-screen flex items-center pt-10 bg-slate-900 rounded-b-[40px] md:rounded-b-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-slate-900" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-6 md:mb-10 animate-slide-up">
            <Sparkles size={12} /> EcoQadam Harakati
          </div>
          
          <div className="mb-8 md:mb-12 animate-slide-up">
            <h1 className="text-6xl md:text-[160px] lg:text-[220px] font-black text-white leading-[0.85] tracking-tighter mb-4 italic">
              EKO <span className="text-emerald-500">27</span>
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 md:w-12 bg-emerald-500/50" />
              <p className="text-emerald-400 font-black text-[10px] md:text-xl uppercase tracking-[0.4em] italic">
                Abdurazoqov Abbos
              </p>
              <div className="h-px w-8 md:w-12 bg-emerald-500/50" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-slide-up delay-200">
            <button 
              onClick={() => onNavigate(AppSection.COMMUNITY_CHAT)}
              className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-emerald-600 text-white rounded-2xl md:rounded-[32px] font-black text-lg md:text-xl hover:bg-emerald-500 transition-all shadow-xl flex items-center justify-center gap-3 group"
            >
              Qo'shiling <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={handleFunding}
              className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-2xl md:rounded-[32px] font-black text-lg md:text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 group"
            >
              Homiy bo'ling <Coins size={20} className="text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="py-16 md:py-32 bg-white dark:bg-slate-950 rounded-t-[40px] -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Imkoniyatlarimiz</h2>
            <div className="w-16 md:w-24 h-2 bg-emerald-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <FeatureCard 
              icon={<Users />} 
              title="Eko-Chat" 
              desc="Hamjamiyat bilan muloqot." 
              onClick={() => onNavigate(AppSection.COMMUNITY_CHAT)}
              color="bg-blue-50 text-blue-600"
            />
            <FeatureCard 
              icon={<Trophy />} 
              title="Tanlovlar" 
              desc="Yutuqli eko-aksiyalar." 
              onClick={() => onNavigate(AppSection.NEWS_FORUM)}
              color="bg-amber-50 text-amber-600"
            />
            <FeatureCard 
              icon={<ShieldCheck />} 
              title="Muammolar" 
              desc="Ekologik vaziyat tahlili." 
              onClick={() => onNavigate(AppSection.PROBLEMS)}
              color="bg-rose-50 text-rose-600"
            />
            <FeatureCard 
              icon={<Newspaper />} 
              title="Yangiliklar" 
              desc="So'nggi eko-xabarlar." 
              onClick={() => onNavigate(AppSection.NEWS)}
              color="bg-emerald-50 text-emerald-600"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, onClick, color }: any) => (
  <div 
    onClick={onClick}
    className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
  >
    <div className={`w-14 h-14 md:w-20 md:h-20 ${color} rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 group-hover:rotate-12 transition-transform`}>
      {React.cloneElement(icon, { className: 'w-8 h-8 md:w-9 md:h-9' })}
    </div>
    <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2 md:mb-4 tracking-tighter italic uppercase">{title}</h4>
    <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 md:mb-8 text-xs md:text-sm leading-relaxed italic">{desc}</p>
    <div className="flex items-center gap-2 text-slate-900 dark:text-emerald-500 font-black text-[8px] md:text-[10px] uppercase tracking-widest">
      Batafsil <ArrowRight size={14} />
    </div>
  </div>
);

export default Home;
