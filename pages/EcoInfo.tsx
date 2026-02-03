
import React, { useState } from 'react';
import { EcoArticle } from '../types';
import { BookOpen, Calendar, ArrowRight, Globe, Info, X, Search, Bookmark } from 'lucide-react';

interface EcoInfoProps {
  articles: EcoArticle[];
}

const EcoInfo: React.FC<EcoInfoProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<EcoArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-4 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 shadow-sm">
            <BookOpen size={16} /> BILIMLAR XAZINASI
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div>
              <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 italic leading-none">Eko <span className="text-blue-600">Kutubxona</span></h2>
              <p className="text-xl text-slate-500 font-medium italic">Tabiatni asrash bo'yicha eng muhim qo'llanmalar to'plami.</p>
            </div>
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Mavzu qidirish..." 
                className="w-full pl-16 pr-8 py-5 bg-white rounded-[32px] border border-slate-100 shadow-xl font-bold text-slate-800 outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[64px] border-2 border-dashed border-slate-100">
             <BookOpen size={80} className="mx-auto text-slate-100 mb-6" />
             <p className="text-slate-400 font-black uppercase tracking-widest">Ma'lumot topilmadi</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {filteredArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="bg-white rounded-[56px] overflow-hidden border border-slate-50 shadow-2xl hover:shadow-blue-100 transition-all group flex flex-col md:flex-row h-full md:h-80"
                >
                  <div className="md:w-1/3 h-64 md:h-auto overflow-hidden relative">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <button className="absolute top-6 left-6 p-3 bg-white/90 backdrop-blur rounded-full text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                      <Bookmark size={18} />
                    </button>
                  </div>
                  <div className="p-10 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">{article.category}</span>
                        <span className="flex items-center gap-1 text-slate-400 text-xs font-bold"><Calendar size={14} /> {article.date || 'Nashr'}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors italic">{article.title}</h3>
                      <p className="text-slate-500 mb-6 leading-relaxed font-medium line-clamp-2">{article.excerpt}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedArticle(article)}
                      className="flex items-center gap-3 text-blue-600 font-black hover:gap-6 transition-all uppercase text-[10px] tracking-widest"
                    >
                      Batafsil ma'lumot <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <div className="p-10 bg-slate-950 text-white rounded-[56px] shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                  <Globe size={180} strokeWidth={0.5} />
                </div>
                <h4 className="text-2xl font-black mb-10 relative z-10 flex items-center gap-3 italic">
                  <Info size={24} className="text-blue-500" /> Qisqa Faktlar
                </h4>
                <div className="space-y-8 relative z-10">
                  <FactCard title="Daraxtlar" text="Bitta katta daraxt yiliga 22 kg karbonat angidridni yuta oladi." color="border-emerald-500" />
                  <FactCard title="Suv" text="Dunyo suvining faqat 2.5% qismi ichishga yaroqli chuchuk suvdir." color="border-blue-500" />
                  <FactCard title="Plastik" text="Har yili okeanlarga 8 million tonna plastik chiqindi tushadi." color="border-rose-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Batafsil Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setSelectedArticle(null)} />
          <div className="relative bg-white w-full max-w-4xl max-h-full overflow-y-auto no-scrollbar rounded-[64px] shadow-3xl animate-in zoom-in">
             <button onClick={() => setSelectedArticle(null)} className="absolute top-8 right-8 z-50 p-4 bg-white/80 backdrop-blur rounded-full shadow-xl"><X /></button>
             
             <div className="h-[400px] w-full relative">
                <img src={selectedArticle.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
             </div>
             
             <div className="p-10 md:p-20 -mt-20 relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <span className="px-5 py-2 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest">{selectedArticle.category}</span>
                  <span className="text-slate-400 font-bold flex items-center gap-2"><Calendar size={18} /> {selectedArticle.date}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 tracking-tighter italic leading-none">{selectedArticle.title}</h2>
                <div className="prose prose-xl max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                   {selectedArticle.content || selectedArticle.excerpt}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FactCard = ({ title, text, color }: any) => (
  <div className={`border-l-4 ${color} pl-6`}>
    <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">{title}</p>
    <p className="text-sm font-bold text-slate-300 italic">{text}</p>
  </div>
);

export default EcoInfo;
