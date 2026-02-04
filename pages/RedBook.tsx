
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { Book, ShieldAlert, FileText, Info, History, Calendar, ExternalLink, Sparkles, AlertCircle, Leaf, Dog, Globe, ShieldCheck, MapPin, ArrowRight, X } from 'lucide-react';
import { RedBookConfig, NatureReserve } from '../types';

const RedBook: React.FC = () => {
  const [config, setConfig] = useState<RedBookConfig>({
    history: "O'zbekiston Qizil kitobi 1979-yil 23-iyunda O'zbekiston SSR Vazirlar Kengashining qarori bilan tashkil etilgan. Ushbu hujjat mamlakatimiz hududidagi noyob va yo'qolib ketish xavfi ostida turgan hayvonlar va o'simlik turlarini muhofaza qilishning huquqiy asosidir.",
    updates: "Ilk nashr 1983-yilda (hayvonlar) va 1984-yilda (o'simliklar) chop etilgan. Keyinchalik 1993, 2003, 2009 va 2019-yillarda yangilangan. Oxirgi 2019-yilgi nashrda 209 tur hayvon va 314 tur o'simlik kiritilgan.",
    plantsPdfUrl: "https://eco.gov.uz/oz/site/red-book",
    animalsPdfUrl: "https://eco.gov.uz/oz/site/red-book",
    lastUpdated: "2024"
  });

  const [reserves, setReserves] = useState<NatureReserve[]>([]);
  const [selectedReserve, setSelectedReserve] = useState<NatureReserve | null>(null);

  useEffect(() => {
    // Red Book Config
    const unsubConfig = onSnapshot(doc(db, "settings", "red_book_config"), (d) => {
      if (d.exists()) {
        const data = d.data() as RedBookConfig;
        setConfig(prev => ({ ...prev, ...data }));
      }
    });

    // Nature Reserves
    const q = query(collection(db, "nature_reserves"), orderBy("timestamp", "desc"));
    const unsubReserves = onSnapshot(q, (snapshot) => {
      setReserves(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as NatureReserve)));
    });

    return () => { unsubConfig(); unsubReserves(); };
  }, []);

  const openUrl = (url: string) => {
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      alert("Havola kiritilmagan yoki noto'g'ri formatda.");
    }
  };

  return (
    <div className="pt-4 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 shadow-sm">
            <ShieldAlert size={16} /> DAVLAT MUHOFAZASI
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div>
              <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 italic leading-none uppercase">Qizil <span className="text-rose-600">Kitob</span></h2>
              <p className="text-xl text-slate-500 font-medium italic max-w-2xl leading-relaxed">
                Tabiat genofondini asrashning ilmiy va huquqiy asosi.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
               <button 
                onClick={() => openUrl(config.plantsPdfUrl)}
                className="flex items-center justify-center gap-4 px-10 py-6 bg-emerald-600 text-white rounded-[32px] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-emerald-500 transition-all border-b-4 border-emerald-800"
               >
                 <Leaf size={24} /> O'SIMLIKLAR (PDF) <ExternalLink size={16} />
               </button>
               <button 
                onClick={() => openUrl(config.animalsPdfUrl)}
                className="flex items-center justify-center gap-4 px-10 py-6 bg-rose-600 text-white rounded-[32px] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-rose-500 transition-all border-b-4 border-rose-800"
               >
                 <Dog size={24} /> HAYVONLAR (PDF) <ExternalLink size={16} />
               </button>
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid lg:grid-cols-2 gap-10 mb-24">
          <div className="bg-white rounded-[64px] p-12 md:p-16 shadow-3xl border border-slate-50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform text-slate-900">
              <History size={200} />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-10 shadow-lg">
                <History size={40} />
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 italic uppercase tracking-tighter leading-none">Tashkil etilish <br/> tarixi va maqsadi</h3>
              <div className="prose prose-xl text-slate-600 font-medium leading-relaxed italic space-y-4">
                <p>{config.history}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[64px] p-12 md:p-16 shadow-3xl border border-slate-50 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform text-rose-600">
               <Calendar size={200} />
             </div>
             <div className="relative z-10">
                <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-10 shadow-lg">
                   <Calendar size={40} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 italic uppercase tracking-tighter leading-none">Nashrlar va <br/> yangilanishlar</h3>
                <div className="prose prose-xl text-slate-600 font-medium leading-relaxed italic">
                   {config.updates}
                </div>
             </div>
          </div>
        </div>

        {/* Nature Reserves Section */}
        <div className="mt-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-[24px] shadow-lg">
              <MapPin size={32} />
            </div>
            <div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Tabiat <span className="text-emerald-600">Qo'riqxonalari</span></h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">O'zbekistonning eng go'zal va muhofaza qilinadigan go'shalari</p>
            </div>
          </div>

          {reserves.length === 0 ? (
            <div className="bg-white rounded-[64px] p-24 text-center border-2 border-dashed border-slate-100">
              <MapPin size={80} className="mx-auto text-slate-100 mb-6" />
              <p className="text-slate-400 font-black uppercase tracking-widest italic">Hozircha qo'riqxonalar haqida ma'lumot yo'q</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {reserves.map((reserve) => (
                <div 
                  key={reserve.id}
                  className="bg-white rounded-[56px] overflow-hidden shadow-2xl border border-slate-50 flex flex-col group hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="h-64 relative overflow-hidden">
                    <img src={reserve.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-10 flex flex-col flex-grow">
                    <h4 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tighter uppercase truncate">{reserve.title}</h4>
                    <p className="text-slate-500 font-medium mb-8 line-clamp-2 italic">{reserve.excerpt}</p>
                    <button 
                      onClick={() => setSelectedReserve(reserve)}
                      className="mt-auto flex items-center gap-3 text-emerald-600 font-black uppercase text-[10px] tracking-widest hover:gap-6 transition-all"
                    >
                      Batafsil ma'lumot <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for Reserve Details */}
        {selectedReserve && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in" onClick={() => setSelectedReserve(null)} />
            <div className="relative bg-white w-full max-w-4xl max-h-full overflow-y-auto no-scrollbar rounded-[64px] shadow-3xl animate-in zoom-in duration-500">
               <button onClick={() => setSelectedReserve(null)} className="absolute top-8 right-8 z-50 p-4 bg-slate-100 text-slate-500 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-xl"><X size={24} /></button>
               
               <div className="h-[400px] w-full relative">
                  <img src={selectedReserve.image} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
               </div>
               
               <div className="p-10 md:p-20 -mt-20 relative z-10 bg-white rounded-t-[60px]">
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full font-black text-xs uppercase tracking-widest mb-10">
                    <ShieldCheck size={18} /> DAVLAT MUHOFAZASIDAGI HUDUD
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 tracking-tighter italic leading-none uppercase">{selectedReserve.title}</h2>
                  <div className="prose prose-xl max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap italic">
                     {selectedReserve.content}
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedBook;
