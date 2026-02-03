
import React, { useState } from 'react';
import { Newspaper, Calendar, ArrowRight, Share2, Award, X, MessageSquare, ExternalLink } from 'lucide-react';
import { EcoArticle } from '../types';

interface NewsProps {
  articles: EcoArticle[];
}

const News: React.FC<NewsProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<EcoArticle | null>(null);

  const handleShare = (article: EcoArticle) => {
    const text = encodeURIComponent(`EKO 27 yangiligi: ${article.title}\n\nBatafsil: https://eko27mk.vercel.app/`);
    window.open(`https://t.me/share/url?url=https://eko27mk.vercel.app/&text=${text}`, '_blank');
  };

  return (
    <div className="pt-2 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Newspaper size={14} /> JAMIYAT VA TABIAT
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">Ekologik Yangiliklar</h2>
            <p className="text-xl text-slate-500 font-medium italic">Tayloq tumanining eng dolzarb eko-voqealari.</p>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[60px] border-2 border-dashed border-slate-100">
            <Newspaper size={64} className="mx-auto text-slate-200 mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-widest">Hozircha yangiliklar yo'q</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {articles.map((art, idx) => (
              <div 
                key={art.id} 
                className={`group relative bg-white rounded-[56px] overflow-hidden shadow-2xl border border-slate-50 flex flex-col ${idx === 0 ? 'lg:col-span-2 lg:flex-row' : ''}`}
              >
                <div className={`${idx === 0 ? 'lg:w-1/2 h-80 lg:h-auto' : 'h-72'} overflow-hidden relative`}>
                  <img src={art.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={art.title} />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    {art.category}
                  </div>
                </div>
                
                <div className={`p-10 flex flex-col justify-between ${idx === 0 ? 'lg:w-1/2' : ''}`}>
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                      <Calendar size={14} /> {art.date || 'Bugun'}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight italic">{art.title}</h3>
                    <p className="text-slate-500 font-medium mb-8 line-clamp-3">{art.excerpt}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <button 
                      onClick={() => setSelectedArticle(art)}
                      className="flex items-center gap-2 text-emerald-600 font-black uppercase text-xs tracking-widest hover:gap-4 transition-all"
                    >
                      To'liq o'qish <ArrowRight size={18} />
                    </button>
                    <button onClick={() => handleShare(art)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-500 transition-colors">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                  <span className="px-5 py-2 bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-widest">{selectedArticle.category}</span>
                  <span className="text-slate-400 font-bold flex items-center gap-2"><Calendar size={18} /> {selectedArticle.date}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 tracking-tighter italic leading-none">{selectedArticle.title}</h2>
                <div className="prose prose-xl max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                   {selectedArticle.content || selectedArticle.excerpt}
                </div>
                
                {selectedArticle.link && (
                  <a href={selectedArticle.link} target="_blank" className="mt-12 inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-emerald-600 transition-all">
                    Tashqi manba <ExternalLink size={18} />
                  </a>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
