
import React, { useState } from 'react';
import { MapPin, Map as MapIcon, ShieldAlert, CheckCircle2, Navigation, Layers, Sparkles, LocateFixed } from 'lucide-react';

const MAP_POINTS = [
  { id: 1, type: 'issue', title: 'Chiqindi uyumi', lat: 39.58, lng: 67.12, description: 'Tayloq markazi, bozor yaqinida.' },
  { id: 2, type: 'clean', title: 'Tozalangan hudud', lat: 39.60, lng: 67.15, description: 'Navzandak ko\'chasi, 27-maktab yonida.' },
  { id: 3, type: 'action', title: 'Daraxt ekish', lat: 39.57, lng: 67.10, description: 'Tuman hokimiyati bog\'ida aksiya bo\'ladi.' },
];

const EcoMap: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  return (
    <div className="animate-fade-in flex flex-col h-full space-y-8">
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          <Sparkles size={14} /> Shahrimizni birga kuzatamiz
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">Eko-Xarita</h2>
        <p className="text-slate-500 font-medium max-w-2xl">Tayloq tumanidagi ekologik vaziyatni onlayn kuzating. Muammoli joylarni belgilang yoki tozalangan hududlar bilan tanishing.</p>
      </div>

      <div className="flex-grow grid lg:grid-cols-4 gap-8">
         {/* Map Visualization Area */}
         <div className="lg:col-span-3 bg-slate-200 rounded-[48px] overflow-hidden relative shadow-inner border border-slate-300 min-h-[500px]">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/67.12,39.58,11,0/1200x800?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2p6YjI1cmkwMWRtMnZxbzR6Ym56Ym56In0=')] bg-cover bg-center opacity-50 grayscale" />
            
            {/* Interactive Grid Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />

            {/* Mock Points */}
            <div className="absolute inset-0 flex items-center justify-center p-20">
               {MAP_POINTS.map(point => (
                 <button 
                  key={point.id}
                  onClick={() => setSelectedPoint(point)}
                  className={`absolute p-4 rounded-3xl shadow-2xl transition-all hover:scale-125 hover:z-50 ${
                    point.type === 'issue' ? 'bg-rose-500 text-white animate-pulse' : 
                    point.type === 'clean' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
                  }`}
                  style={{ 
                    top: `${40 + (point.lat - 39.58) * 1000}%`, 
                    left: `${50 + (point.lng - 67.12) * 1000}%` 
                  }}
                 >
                    {point.type === 'issue' ? <ShieldAlert size={20} /> : point.type === 'clean' ? <CheckCircle2 size={20} /> : <MapPin size={20} />}
                 </button>
               ))}
            </div>

            {/* Map Controls */}
            <div className="absolute top-8 left-8 flex flex-col gap-2">
               <button className="p-4 bg-white rounded-2xl shadow-xl text-slate-900 hover:bg-slate-50 transition-colors"><LocateFixed size={20} /></button>
               <button className="p-4 bg-white rounded-2xl shadow-xl text-slate-900 hover:bg-slate-50 transition-colors"><Layers size={20} /></button>
            </div>

            {/* Detail Popup */}
            {selectedPoint && (
              <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-96 bg-white rounded-[32px] p-8 shadow-3xl border border-slate-100 animate-in slide-in-from-bottom-10">
                 <button onClick={() => setSelectedPoint(null)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-900">×</button>
                 <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl ${selectedPoint.type === 'issue' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                       {selectedPoint.type === 'issue' ? <ShieldAlert size={24} /> : <CheckCircle2 size={24} />}
                    </div>
                    <div>
                       <h4 className="font-black text-slate-900 leading-none">{selectedPoint.title}</h4>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedPoint.type}</span>
                    </div>
                 </div>
                 <p className="text-slate-500 font-medium mb-6 text-sm leading-relaxed">{selectedPoint.description}</p>
                 <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors">Yonalish olish</button>
              </div>
            )}
         </div>

         {/* Sidebar Info */}
         <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-50">
               <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2"><Layers size={20} className="text-blue-500" /> Afsonalar</h3>
               <div className="space-y-4">
                  <LegendItem icon={<ShieldAlert className="text-rose-500" />} label="Muammolar" count={12} color="bg-rose-50" />
                  <LegendItem icon={<CheckCircle2 className="text-emerald-500" />} label="Tozalanganlar" count={45} color="bg-emerald-50" />
                  <LegendItem icon={<MapPin className="text-blue-500" />} label="Aksiyalar" count={3} color="bg-blue-50" />
               </div>
            </div>

            <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                  <h4 className="text-2xl font-black mb-4 tracking-tighter">O'z hududingizda muammo ko'rdingizmi?</h4>
                  <p className="text-slate-400 text-sm font-medium mb-6">Telegram botimiz orqali rasm va manzilni yuboring, biz xaritaga qo'shamiz.</p>
                  <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all">Botga o'tish</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const LegendItem = ({ icon, label, count, color }: any) => (
  <div className={`flex items-center justify-between p-4 ${color} rounded-2xl border border-white`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-bold text-slate-700 text-sm">{label}</span>
    </div>
    <span className="font-black text-slate-900">{count}</span>
  </div>
);

export default EcoMap;
