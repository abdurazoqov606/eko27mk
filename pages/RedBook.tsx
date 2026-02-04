
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { ShieldAlert, Leaf, Dog } from 'lucide-react';
import { RedBookConfig } from '../types';

const RedBook: React.FC = () => {
  const [config, setConfig] = useState<RedBookConfig>({
    history: "O'zbekiston Qizil kitobi 1979-yil 23-iyunda O'zbekiston SSR Vazirlar Kengashining qarori bilan tashkil etilgan.",
    updates: "Oxirgi 2019-yilgi nashrda 209 tur hayvon va 314 tur o'simlik kiritilgan.",
    plantsPdfUrl: "https://eco.gov.uz/oz/site/red-book",
    animalsPdfUrl: "https://eco.gov.uz/oz/site/red-book",
    lastUpdated: "2024"
  });

  useEffect(() => {
    onSnapshot(doc(db, "settings", "red_book_config"), (d) => { if (d.exists()) setConfig(prev => ({ ...prev, ...d.data() })); });
  }, []);

  const openUrl = (url: string) => { if (url) window.open(url, '_blank'); };

  return (
    <div className="pt-4 pb-20 animate-fade-in px-4 md:px-0">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 shadow-sm">
            <ShieldAlert size={16} /> DAVLAT MUHOFAZASI
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div>
              <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 italic leading-none uppercase">Qizil <span className="text-rose-600">Kitob</span></h2>
              <p className="text-xl text-slate-500 font-medium italic max-w-2xl leading-relaxed">Tabiat genofondini asrashning ilmiy va huquqiy asosi.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
               <button onClick={() => openUrl(config.plantsPdfUrl)} className="flex items-center justify-center gap-4 px-8 py-5 bg-emerald-600 text-white rounded-[28px] font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-emerald-500 transition-all">
                 <Leaf size={20} /> O'SIMLIKLAR (PDF)
               </button>
               <button onClick={() => openUrl(config.animalsPdfUrl)} className="flex items-center justify-center gap-4 px-8 py-5 bg-rose-600 text-white rounded-[28px] font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-rose-500 transition-all">
                 <Dog size={20} /> HAYVONLAR (PDF)
               </button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          <div className="bg-white dark:bg-slate-900 rounded-[48px] p-10 md:p-14 shadow-2xl border border-slate-50 dark:border-white/5 relative overflow-hidden group">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 italic uppercase tracking-tighter">Tarixi va Maqsadi</h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic text-lg">{config.history}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[48px] p-10 md:p-14 shadow-2xl border border-slate-50 dark:border-white/5 relative overflow-hidden group">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 italic uppercase tracking-tighter">Yangilanishlar</h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic text-lg">{config.updates}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RedBook;
