
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { MapPin, X } from 'lucide-react';
import { NatureReserve } from '../types';

const NatureReserves: React.FC = () => {
  const [reserves, setReserves] = useState<NatureReserve[]>([]);
  const [selectedReserve, setSelectedReserve] = useState<NatureReserve | null>(null);

  useEffect(() => {
    const unsubReserves = onSnapshot(query(collection(db, "nature_reserves"), orderBy("timestamp", "desc")), (s) => {
      setReserves(s.docs.map(d => ({ id: d.id, ...d.data() } as NatureReserve)));
    });
    return () => unsubReserves();
  }, []);

  return (
    <div className="pt-4 pb-20 animate-fade-in px-4 md:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3.5 bg-emerald-100 text-emerald-600 rounded-2xl shadow-lg"><MapPin size={28} /></div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Tabiat <span className="text-emerald-600">Hududlari</span></h2>
            <p className="text-slate-500 font-medium mt-1 italic">Vatanimizning eng go'zal va muhofaza etiladigan maskanlari.</p>
          </div>
        </div>

        {reserves.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[48px] p-20 text-center border-2 border-dashed border-slate-100 dark:border-white/5">
             <MapPin size={64} className="mx-auto text-slate-200 mb-6" />
             <p className="text-slate-400 font-black uppercase tracking-widest">Ma'lumotlar mavjud emas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reserves.map((reserve) => (
              <div key={reserve.id} onClick={() => setSelectedReserve(reserve)} className="bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden shadow-xl border border-slate-50 dark:border-white/5 flex flex-col group cursor-pointer hover:-translate-y-2 transition-all">
                <img src={reserve.image} className="w-full h-56 object-cover" alt="" />
                <div className="p-8">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 italic uppercase truncate">{reserve.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium line-clamp-2 text-sm italic">{reserve.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedReserve && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setSelectedReserve(null)} />
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[48px] overflow-hidden shadow-3xl animate-in zoom-in max-h-[90vh] flex flex-col">
               <button onClick={() => setSelectedReserve(null)} className="absolute top-6 right-6 z-50 p-3 bg-white/80 rounded-full text-slate-900"><X size={24} /></button>
               <img src={selectedReserve.image} className="w-full h-64 object-cover" alt="" />
               <div className="p-10 overflow-y-auto no-scrollbar">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 italic uppercase tracking-tighter">{selectedReserve.title}</h2>
                  <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
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

export default NatureReserves;
