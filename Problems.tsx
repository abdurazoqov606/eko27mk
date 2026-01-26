
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Droplets, Wind, Factory, ArrowRight } from 'lucide-react';

const data = [
  { year: '1960', level: 53 },
  { year: '1980', level: 36 },
  { year: '2000', level: 20 },
  { year: '2024', level: 9 },
];

const Problems: React.FC = () => {
  return (
    <div className="pt-24 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Muammolar (namuna)</h2>
          <p className="text-xl text-slate-600">Ekologik vaziyat bo'yicha tahliliy ma'lumotlar (namuna).</p>
        </div>

        {/* Aral Sea Focus */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-bold">
              <AlertTriangle size={14} /> Dolzarb (namuna)
            </div>
            <h3 className="text-3xl font-black text-slate-800 leading-tight">Orol dengizi: Oqibatlar (namuna)</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Orol dengizining qurishi oqibatida yuzaga kelgan o'zgarishlar (namuna).
            </p>
            <div className="p-8 bg-white rounded-[32px] border-l-8 border-rose-500 shadow-xl shadow-rose-100/50">
              <h4 className="font-black text-slate-800 mb-4">Muammolar (namuna):</h4>
              <ul className="space-y-3 text-sm text-slate-600 font-bold">
                <li className="flex items-center gap-2 text-rose-600">● Tuz bo'ronlari (namuna)</li>
                <li className="flex items-center gap-2 text-rose-600">● Suv yetishmovchiligi (namuna)</li>
              </ul>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl">
             <h4 className="text-lg font-black text-slate-800 mb-6 text-center">Sath o'zgarishi (namuna)</h4>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                   <Tooltip 
                     contentStyle={{borderRadius: '16px', border: 'none'}} 
                   />
                   <Bar dataKey="level" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
             <p className="mt-6 text-[10px] text-slate-400 text-center font-black uppercase tracking-widest">Ma'lumotlar: Statistik namunalar</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           <IssueCard icon={<Droplets />} title="Suv taqchilligi (namuna)" color="text-blue-600" />
           <IssueCard icon={<Wind />} title="Havo (namuna)" color="text-slate-600" />
           <IssueCard icon={<Factory />} title="Chiqindilar (namuna)" color="text-rose-600" />
        </div>
      </div>
    </div>
  );
};

const IssueCard = ({ icon, title, color }: any) => (
  <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
    <div className={`w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 ${color}`}>
      {icon}
    </div>
    <h4 className="text-2xl font-black text-slate-800 mb-4">{title}</h4>
    <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">Ushbu muammo bo'yicha tahliliy ma'lumotlar namunasi.</p>
    <button className={`${color} font-black hover:underline flex items-center gap-2`}>Batafsil (namuna) <ArrowRight size={16} /></button>
  </div>
);

export default Problems;
