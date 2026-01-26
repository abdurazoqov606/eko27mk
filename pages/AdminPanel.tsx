
import React, { useState } from 'react';
import { Lock, ShieldCheck, Plus, Trash2, Save, Newspaper, Settings, AlertCircle, CheckCircle, ArrowRight, LayoutDashboard, Database } from 'lucide-react';
import { EcoArticle } from '../types';

interface AdminPanelProps {
  isAuthenticated: boolean;
  onAuthenticate: () => void;
  news: EcoArticle[];
  onAddNews: (article: EcoArticle) => void;
  onDeleteNews: (id: string) => void;
  siteConfig: { heroTitle: string; heroDesc: string };
  onUpdateConfig: (config: any) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isAuthenticated, 
  onAuthenticate, 
  news, 
  onAddNews, 
  onDeleteNews, 
  siteConfig, 
  onUpdateConfig 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'config'>('news');

  // News Form State
  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000',
    category: 'Yangiliklar'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2010abbos') {
      onAuthenticate();
      setError('');
    } else {
      setError('Kod noto\'g\'ri! Iltimos, qaytadan urinib ko\'ring.');
    }
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    const article: EcoArticle = {
      ...newArticle,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: newArticle.excerpt // Simplified for mock
    };
    onAddNews(article);
    setNewArticle({
      title: '',
      excerpt: '',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000',
      category: 'Yangiliklar'
    });
    alert("Yangilik muvaffaqiyatli qo'shildi!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 rounded-[48px] p-10 md:p-14 shadow-3xl border border-slate-800 animate-in zoom-in">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-10 shadow-xl shadow-emerald-900/50 rotate-3">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-black text-white text-center mb-4 tracking-tighter italic">ADMIN PANEL</h2>
          <p className="text-slate-500 text-center font-bold text-xs uppercase tracking-widest mb-10">Faqat Abdurazoqov Abbos uchun ruxsat beriladi</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input 
                type="password" 
                placeholder="Xavfsizlik kodi..."
                className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black outline-none focus:border-emerald-500 transition-all text-center tracking-[0.5em]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-rose-500 text-[10px] font-black uppercase text-center flex items-center justify-center gap-2"><AlertCircle size={14} /> {error}</div>}
            <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40">
              Kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <ShieldCheck size={14} className="text-emerald-500" /> Boshqaruv Tizimi
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">Admin Dashboard</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">Xush kelibsiz, Abbos!</p>
        </div>
        
        <div className="flex gap-2">
           <button 
            onClick={() => setActiveTab('news')}
            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'news' ? 'bg-emerald-600 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100'}`}
           >
             <Newspaper size={18} /> Yangiliklar
           </button>
           <button 
            onClick={() => setActiveTab('config')}
            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'config' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100'}`}
           >
             <Settings size={18} /> Sozlamalar
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {activeTab === 'news' ? (
          <>
            {/* Create News Form */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[48px] p-8 md:p-10 shadow-xl border border-slate-50 sticky top-24">
                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <Plus className="text-emerald-600" /> Yangi kiritish
                </h3>
                <form onSubmit={handleAddNews} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Sarlavha</label>
                    <input 
                      required
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-emerald-500/30 font-bold text-slate-800"
                      placeholder="Masalan: Yangi bog' tashkil etildi"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Qisqa tavsif</label>
                    <textarea 
                      required
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-emerald-500/30 font-bold text-slate-800 h-32"
                      placeholder="Asosiy mazmunni yozing..."
                      value={newArticle.excerpt}
                      onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Rasm URL (Unsplash)</label>
                    <input 
                      required
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-emerald-500/30 font-bold text-slate-800"
                      value={newArticle.image}
                      onChange={(e) => setNewArticle({...newArticle, image: e.target.value})}
                    />
                  </div>
                  <button className="w-full py-6 bg-emerald-600 text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3">
                    Nashr qilish <CheckCircle size={20} />
                  </button>
                </form>
              </div>
            </div>

            {/* News List Control */}
            <div className="lg:col-span-7">
               <div className="bg-white rounded-[48px] p-8 md:p-10 shadow-xl border border-slate-50">
                  <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <LayoutDashboard className="text-blue-600" /> Boshqaruv
                  </h3>
                  <div className="space-y-4">
                    {news.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-200 transition-all group">
                         <div className="flex items-center gap-4">
                           <img src={item.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="" />
                           <div className="max-w-md">
                             <h4 className="font-black text-slate-800 truncate">{item.title}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.date} • {item.category}</p>
                           </div>
                         </div>
                         <button 
                          onClick={() => onDeleteNews(item.id)}
                          className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                         >
                           <Trash2 size={20} />
                         </button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-12">
             <div className="bg-white rounded-[56px] p-12 shadow-xl border border-slate-50">
                <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-3">
                  <Database className="text-purple-600" /> Tizim Sozlamalari
                </h3>
                <div className="grid md:grid-cols-2 gap-10">
                   <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Loyiha Nomi (Hero)</label>
                        <input 
                          className="w-full px-8 py-6 bg-slate-50 rounded-[32px] border-2 border-transparent focus:border-purple-500/30 outline-none font-black text-3xl italic"
                          value={siteConfig.heroTitle}
                          onChange={(e) => onUpdateConfig({...siteConfig, heroTitle: e.target.value})}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Loyiha Tavsifi</label>
                        <textarea 
                          className="w-full px-8 py-6 bg-slate-50 rounded-[32px] border-2 border-transparent focus:border-purple-500/30 outline-none font-bold text-slate-600 h-40"
                          value={siteConfig.heroDesc}
                          onChange={(e) => onUpdateConfig({...siteConfig, heroDesc: e.target.value})}
                        />
                      </div>
                      <button className="flex items-center gap-3 px-10 py-6 bg-slate-900 text-white rounded-[32px] font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl">
                        O'zgarishlarni saqlash <Save size={20} />
                      </button>
                   </div>
                   <div className="bg-slate-50 rounded-[40px] p-10 flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-6 shadow-inner">
                        <Settings size={48} className="animate-spin-slow" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 mb-2">Platforma Ma'lumotlari</h4>
                      <p className="text-slate-500 text-sm font-medium mb-8">Ushbu bo'limda siz saytning asosiy matnlarini real vaqt rejimida o'zgartirishingiz mumkin.</p>
                      <div className="flex gap-4">
                         <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="text-2xl font-black text-emerald-600">{news.length}</div>
                            <div className="text-[8px] font-black uppercase text-slate-400">Maqolalar</div>
                         </div>
                         <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="text-2xl font-black text-blue-600">542</div>
                            <div className="text-[8px] font-black uppercase text-slate-400">Online</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
