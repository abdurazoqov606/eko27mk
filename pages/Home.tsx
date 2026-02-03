
import React, { useState, useEffect } from 'react';
import { AppSection } from '../types';
import { ArrowRight, Leaf, Globe, ShieldCheck, Sparkles, Users, Trophy, Calculator, Droplets, Zap, TrendingDown, Newspaper, Coins } from 'lucide-react';
import CarbonCalculator from '../components/CarbonCalculator';

interface HomeProps {
  onNavigate: (section: AppSection) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [counts, setCounts] = useState({ trees: 0, water: 0, co2: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCounts(prev => ({
        trees: prev.trees < 2450 ? prev.trees + 15 : 2450,
        water: prev.water < 12500 ? prev.water + 100 : 12500,
        co2: prev.co2 < 450 ? prev.co2 + 5 : 450
      }));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const handleFunding = () => {
    window.open('https://t.me/vsf911', '_blank');
  };

  return (
    <div className="animate-fade-in overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-slate-900" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10 animate-slide-up">
            <Sparkles size={14} /> EcoQadam Harakati
          </div>
          
          <div className="mb-12 animate-slide-up">
            <h1 className="text-[120px] md:text-[220px] font-black text-white leading-[0.7] tracking-tighter mb-4 italic">
              EKO <span className="text-emerald-500">27</span>
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-emerald-500/50" />
              <p className="text-emerald-400 font-black text-sm md:text-xl uppercase tracking-[0.5em] italic">
                powered by Abdurazoqov Abbos
              </p>
              <div className="h-px w-12 bg-emerald-500/50" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up delay-200">
            <button 
              onClick={() => onNavigate(AppSection.COMMUNITY_CHAT)}
              className="w-full sm:w-auto px-12 py-6 bg-emerald-600 text-white rounded-[32px] font-black text-xl hover:bg-emerald-500 transition-all shadow-2xl flex items-center justify-center gap-3 group"
            >
              Hozir qo'shiling <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={handleFunding}
              className="w-full sm:w-auto px-12 py-6 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-[32px] font-black text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 group"
            >
              Mablag' ajratish <Coins className="text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Loyihamiz Imkoniyatlari</h2>
            <div className="w-24 h-2 bg-emerald-500 mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Users />} 
              title="Eko-Chat" 
              desc="Eko-hamjamiyat bilan fikr almashish." 
              onClick={() => onNavigate(AppSection.COMMUNITY_CHAT)}
              color="bg-blue-50 text-blue-600"
            />
            <FeatureCard 
              icon={<Trophy />} 
              title="Forum" 
              desc="Tanlovlar va forumlarda qatnashing." 
              onClick={() => onNavigate(AppSection.NEWS_FORUM)}
              color="bg-amber-50 text-amber-600"
            />
            <FeatureCard 
              icon={<ShieldCheck />} 
              title="Muammolar" 
              desc="Hududdagi ekologik tahlillar." 
              onClick={() => onNavigate(AppSection.PROBLEMS)}
              color="bg-rose-50 text-rose-600"
            />
            <FeatureCard 
              icon={<Newspaper />} 
              title="Yangiliklar" 
              desc="So'nggi ekologik voqealar." 
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
    className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group"
  >
    <div className={`w-20 h-20 ${color} rounded-3xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform`}>
      {React.cloneElement(icon, { size: 36 })}
    </div>
    <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter italic">{title}</h4>
    <p className="text-slate-500 font-medium mb-8 text-sm leading-relaxed italic">{desc}</p>
    <div className="flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase tracking-widest group-hover:text-emerald-600">
      Kirish <ArrowRight size={16} />
    </div>
  </div>
);

export default Home;
