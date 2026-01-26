
import React from 'react';
import { EcoArticle } from '../types';
import { BookOpen, Calendar, ArrowRight, Newspaper, Globe, Info } from 'lucide-react';

interface EcoInfoProps {
  articles: EcoArticle[];
}

const EcoInfo: React.FC<EcoInfoProps> = ({ articles }) => {
  return (
    <div className="pt-24 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-4">
            <Newspaper size={16} /> Axborot Markazi
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Ekologik Bilimlar Bazasi</h2>
          <p className="text-xl text-slate-600">Dunyo va O'zbekistondagi eng so'nggi ekologik o'zgarishlar va maqolalar.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row">
                <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8 md:w-2/3">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">{article.category}</span>
                    <span className="flex items-center gap-1 text-slate-400 text-xs font-bold"><Calendar size={14} /> {article.date}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-emerald-600 transition-colors">{article.title}</h3>
                  <p className="text-slate-500 mb-6 leading-relaxed font-medium">{article.excerpt}</p>
                  <button className="flex items-center gap-2 text-emerald-600 font-black hover:gap-4 transition-all uppercase text-xs tracking-widest">
                    To'liq o'qish <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="p-8 bg-slate-900 text-white rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Globe size={120} />
              </div>
              <h4 className="text-xl font-black mb-6 relative z-10 flex items-center gap-2">
                <Info size={20} className="text-emerald-500" /> Qisqa Faktlar
              </h4>
              <ul className="space-y-6 relative z-10">
                <li className="border-l-4 border-emerald-500 pl-4">
                  <p className="text-xs font-bold text-emerald-400 uppercase mb-1">Daraxtlar</p>
                  <p className="text-sm font-medium">Bitta katta daraxt yiliga 22 kg karbonat angidridni yuta oladi.</p>
                </li>
                <li className="border-l-4 border-blue-500 pl-4">
                  <p className="text-xs font-bold text-blue-400 uppercase mb-1">Suv</p>
                  <p className="text-sm font-medium">Dunyo suvining faqat 2.5% qismi ichishga yaroqli chuchuk suvdir.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoInfo;
