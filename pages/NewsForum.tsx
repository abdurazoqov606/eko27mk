
import React, { useState, useRef } from 'react';
import { EcoArticle } from '../types';
import { 
  Newspaper, Trophy, Calendar, Rocket, ArrowRight, Award, Gift, 
  Clock, CheckCircle, Coins, Camera, Upload, X, ShieldCheck, 
  Sparkles, TrendingUp, Medal, Share2, Heart, Send, 
  Image as ImageIcon, Banknote, Eye, Maximize2 
} from 'lucide-react';

const LEADERBOARD = [
  { name: 'Abbos A.', points: 1250, rank: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abbos' },
  { name: 'Lola K.', points: 1100, rank: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lola' },
];

const FORUM_GALLERY = [
  { 
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000", 
    title: "Yashil Konferensiya", 
    desc: "Tayloq tumanida o'tkazilgan yirik eko-forumdan lavha.",
    tag: "MAHALLIY"
  },
  { 
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2000", 
    title: "Yosh Ko'ngillilar", 
    desc: "27-maktab o'quvchilarining jamoaviy eko-tashabbusi.",
    tag: "FAOL YOSHLAR"
  },
  { 
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000", 
    title: "Eko-Texnologiyalar", 
    desc: "Innovatsion g'oyalar taqdimoti jarayoni.",
    tag: "INNOVATSIYA"
  },
  { 
    url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2000", 
    title: "Maktab Bog'i", 
    desc: "O'quvchilar tomonidan ekilgan mevali daraxtlar.",
    tag: "NATIJA"
  }
];

const PRIZES = [
  { 
    rank: "1-o'rin", 
    amount: "1 000 000", 
    bonus: "Oltin Sertifikat", 
    color: "from-amber-400 to-amber-600", 
    shadow: "shadow-amber-200",
    icon: <Trophy size={40} className="text-white" />
  },
  { 
    rank: "2-o'rin", 
    amount: "700 000", 
    bonus: "Kumush Sertifikat", 
    color: "from-slate-300 to-slate-500", 
    shadow: "shadow-slate-200",
    icon: <Medal size={40} className="text-white" />
  },
  { 
    rank: "3-o'rin", 
    amount: "500 000", 
    bonus: "Bronza Sertifikat", 
    color: "from-orange-400 to-orange-600", 
    shadow: "shadow-orange-200",
    icon: <Award size={40} className="text-white" />
  }
];

interface NewsForumProps {
  articles: EcoArticle[];
}

const NewsForum: React.FC<NewsForumProps> = ({ articles }) => {
  const [activeTab, setActiveTab] = useState<'news' | 'contests' | 'leaderboard'>('contests');
  const [showContestModal, setShowContestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [likes, setLikes] = useState<Record<string, { count: number, active: boolean }>>({});

  const handleLike = (id: string) => {
    setLikes(prev => {
      const current = prev[id] || { count: 24, active: false };
      return {
        ...prev,
        [id]: {
          count: current.active ? current.count - 1 : current.count + 1,
          active: !current.active
        }
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPreviewImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitContest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowContestModal(false);
      setPreviewImage(null);
      alert("Arizangiz qabul qilindi! Abdurazoqov Abbos va hakamlar uni tez orada ko'rib chiqishadi.");
    }, 2000);
  };

  const handleShareItem = (title: string) => {
    const message = encodeURIComponent(`🌿 EcoQadam Harakati Yangiligi:\n\n"${title}"\n\nBatafsil: https://eko27mk.vercel.app/`);
    window.open(`https://t.me/share/url?url=https://eko27mk.vercel.app/&text=${message}`, '_blank');
  };

  const handleFunding = () => {
    window.open('https://t.me/vsf911', '_blank');
  };

  return (
    <div className="animate-fade-in pb-12">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-sm border border-emerald-200/50">
            <Sparkles size={14} className="animate-pulse" /> EcoQadam Harakati
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-4 leading-none">Forum <span className="text-emerald-600">&</span> Tanlovlar</h2>
          <p className="text-slate-500 font-medium max-w-2xl text-lg italic">Abdurazoqov Abbos boshchiligidagi yashil inqilob maydoni.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleShareItem('EcoQadam Platformasi')}
            className="px-8 py-5 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-200 hover:bg-blue-500 transition-all hover:scale-105 active:scale-95"
          >
            <Share2 size={20} /> Ulashish
          </button>
          <button 
            onClick={handleFunding}
            className="px-8 py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
          >
            <Coins size={20} className="text-amber-400" /> Mablag' ajratish
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-4 mb-16 no-scrollbar pb-2">
        <TabButton active={activeTab === 'news'} onClick={() => setActiveTab('news')} icon={<Newspaper size={18} />} label="Yangiliklar" />
        <TabButton active={activeTab === 'contests'} onClick={() => setActiveTab('contests')} icon={<Trophy size={18} />} label="Musobaqalar" />
        <TabButton active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} icon={<Medal size={18} />} label="Reyting" />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'news' && (
          <div className="grid lg:grid-cols-2 gap-10">
            {articles.map((art) => {
              const postLike = likes[art.id] || { count: 24, active: false };
              return (
                <div key={art.id} className="bg-white rounded-[56px] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-slate-50 hover:border-emerald-200 transition-all group relative">
                  <div className="md:w-2/5 h-72 md:h-auto overflow-hidden">
                    <img src={art.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={art.title} />
                  </div>
                  <div className="p-10 md:w-3/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">{art.category}</span>
                        <span className="text-slate-400 text-xs font-bold flex items-center gap-1.5"><Calendar size={14} /> {art.date}</span>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-6 leading-tight tracking-tight group-hover:text-emerald-600 transition-colors">{art.title}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between mt-8">
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => handleLike(art.id)}
                          className={`flex items-center gap-2.5 transition-all hover:scale-110 ${postLike.active ? 'text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-400'}`}
                        >
                          <Heart size={24} fill={postLike.active ? "currentColor" : "none"} />
                          <span className="text-sm font-black">{postLike.count}</span>
                        </button>
                        <button 
                          onClick={() => handleShareItem(art.title)}
                          className="text-slate-400 hover:text-blue-500 transition-all hover:scale-110"
                        >
                          <Send size={22} />
                        </button>
                      </div>
                      <button className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 group/btn transition-all">
                        O'qish <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'contests' && (
          <div className="space-y-24 pb-20">
            {/* Contest Main Banner */}
            <div className="bg-slate-950 rounded-[72px] p-10 md:p-20 text-white shadow-3xl relative overflow-hidden border border-white/5 group">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full -mr-64 -mt-64 blur-[140px] group-hover:bg-emerald-600/20 transition-all duration-1000" />
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 backdrop-blur-md text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-emerald-500/30">
                    <Rocket size={16} className="animate-bounce" /> Eng yirik musobaqa
                  </div>
                  <h3 className="text-6xl md:text-8xl font-black mb-10 leading-[0.85] tracking-tighter">
                    Toza Hudud <br /> <span className="text-emerald-500 italic">"27-MAK"</span>
                  </h3>
                  <p className="text-slate-400 text-2xl mb-12 leading-relaxed font-medium max-w-lg">
                    Hududni tozalab, <span className="text-white font-black underline decoration-emerald-500 decoration-4 underline-offset-8">"27" raqami</span> bilan ijodiy rasmga tushing va pul yuting!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6">
                    <button 
                      onClick={() => setShowContestModal(true)}
                      className="px-14 py-7 bg-emerald-600 text-white rounded-[32px] font-black text-xl hover:bg-emerald-500 transition-all shadow-3xl shadow-emerald-600/30 flex items-center justify-center gap-4 hover:scale-105 active:scale-95 group/arixa"
                    >
                      Hozir qatnashish <ArrowRight className="group-hover/arixa:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
                
                <div className="relative h-[400px] md:h-[500px] bg-white/5 rounded-[56px] border border-white/10 flex items-center justify-center overflow-hidden group/reward shadow-inner">
                   <div className="text-center p-12 relative z-10">
                      <div className="w-24 h-24 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30 shadow-2xl">
                        <Banknote size={48} className="text-emerald-400 animate-pulse" />
                      </div>
                      <h4 className="text-2xl font-bold mb-4 tracking-widest text-slate-400 uppercase">Mukofot Jamg'armasi</h4>
                      <div className="flex flex-col">
                        <span className="text-emerald-500 font-black text-7xl md:text-8xl tracking-tighter mb-2">2.2 mln</span>
                        <span className="text-slate-500 font-black text-xl uppercase tracking-[0.4em]">O'zbek so'mi</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Pul Mukofotlari Jadvali */}
            <div>
              <div className="flex items-center justify-center gap-4 mb-16 text-center">
                 <div className="h-px flex-grow bg-slate-200" />
                 <div className="px-8 py-3 bg-white border border-slate-100 rounded-full shadow-sm flex items-center gap-3">
                    <Coins size={20} className="text-amber-500" />
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Mukofotlar Shkalasi</h3>
                 </div>
                 <div className="h-px flex-grow bg-slate-200" />
              </div>
              <div className="grid md:grid-cols-3 gap-10">
                {PRIZES.map((p, i) => (
                  <div key={i} className={`bg-white rounded-[60px] p-12 border border-slate-50 ${p.shadow} hover:-translate-y-4 transition-all duration-500 flex flex-col items-center text-center relative group overflow-hidden`}>
                     <div className={`w-28 h-28 bg-gradient-to-br ${p.color} rounded-[36px] flex items-center justify-center mb-10 shadow-2xl group-hover:rotate-12 transition-transform duration-500 scale-110`}>
                        {p.icon}
                     </div>
                     <span className="text-xs font-black uppercase text-slate-400 tracking-[0.3em] mb-4">{p.rank}</span>
                     <h4 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">{p.amount} <span className="text-lg text-emerald-500">so'm</span></h4>
                     <p className="px-6 py-2.5 bg-slate-50 rounded-full text-[11px] font-black uppercase text-emerald-600 tracking-widest border border-slate-100">
                       + {p.bonus}
                     </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Estetik Forum Galereyasi */}
            <div className="mt-20">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-[24px] shadow-lg shadow-blue-100/50">
                       <ImageIcon size={32} />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Forum Galereyasi</h3>
                       <p className="text-slate-400 font-bold text-sm tracking-wide">Tarixga muhrlangan yashil lahzalar</p>
                    </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {FORUM_GALLERY.map((img, i) => (
                  <div 
                    key={i} 
                    className={`group relative rounded-[48px] overflow-hidden shadow-2xl transition-all duration-700 bg-slate-100 border-4 border-white ${
                      i % 3 === 0 ? 'lg:col-span-2 lg:row-span-2 h-[400px] lg:h-[600px]' : 'h-[300px] lg:h-[288px]'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      className="w-full h-full object-cover transition-all duration-[2000ms] group-hover:scale-125 group-hover:rotate-2" 
                      alt={img.title} 
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                       <div className="inline-flex self-start px-4 py-1.5 bg-emerald-500/20 backdrop-blur-md border border-white/30 rounded-full text-[9px] font-black text-white uppercase tracking-widest mb-4">
                         {img.tag}
                       </div>
                       <h4 className="text-2xl font-black text-white tracking-tighter mb-2">{img.title}</h4>
                       <p className="text-slate-300 text-xs font-medium leading-relaxed line-clamp-2">{img.desc}</p>
                       <div className="mt-6 flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                          <Eye size={14} /> Ko'rish
                       </div>
                    </div>

                    {/* Static Tag */}
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-[8px] font-black text-white uppercase tracking-widest group-hover:opacity-0 transition-opacity">
                       {img.tag}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-[64px] p-10 md:p-20 shadow-2xl border border-slate-50 relative overflow-hidden">
             <div className="flex items-center gap-6 mb-16 relative z-10">
               <div className="p-5 bg-amber-50 text-amber-600 rounded-[32px] shadow-lg shadow-amber-100/50">
                 <TrendingUp size={40} />
               </div>
               <div>
                 <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Eko-Reyting</h3>
                 <p className="text-slate-400 font-bold tracking-[0.2em] uppercase text-xs mt-1">27-Maktab faollari</p>
               </div>
             </div>

             <div className="space-y-6 relative z-10 max-w-4xl">
                {LEADERBOARD.map((user) => (
                  <div key={user.rank} className="flex items-center justify-between p-8 bg-slate-50 rounded-[40px] hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-emerald-100 group cursor-pointer">
                    <div className="flex items-center gap-8">
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl ${
                        user.rank === 1 ? 'bg-amber-400 text-white shadow-xl shadow-amber-200' : 'bg-slate-300 text-slate-700'
                      }`}>
                        {user.rank}
                      </div>
                      <img src={user.avatar} className="w-20 h-20 rounded-[24px] border-4 border-white shadow-xl" alt={user.name} />
                      <div>
                        <div className="font-black text-2xl text-slate-800 tracking-tight">{user.name}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Ko'ngilli Eko-Faol</div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-3xl font-black text-emerald-600 tracking-tighter">{user.points}</div>
                       <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Eco-Points</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {showContestModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setShowContestModal(false)} />
          <div className="relative bg-white w-full max-w-3xl rounded-[64px] shadow-3xl overflow-hidden animate-in zoom-in duration-500 p-10 md:p-16 border-t-[12px] border-emerald-600">
             <div className="flex justify-between items-center mb-12">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">Musobaqa Isboti</h3>
                <button onClick={() => setShowContestModal(false)} className="p-4 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X size={28} /></button>
             </div>
             
             <form onSubmit={handleSubmitContest} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <input required type="text" className="w-full px-8 py-5 bg-slate-50 border-none rounded-3xl font-bold text-slate-800" placeholder="Ismingiz..." />
                    <input required type="text" className="w-full px-8 py-5 bg-slate-50 border-none rounded-3xl font-bold text-slate-800" placeholder="@telegram_username..." />
                  </div>
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className={`border-4 border-dashed rounded-[48px] flex flex-col items-center justify-center cursor-pointer min-h-[250px] transition-all overflow-hidden ${
                      previewImage ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:border-emerald-300'
                    }`}
                  >
                    {previewImage ? (
                      <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mb-4 shadow-xl">
                          <Camera size={32} />
                        </div>
                        <p className="text-slate-400 font-black text-xs uppercase tracking-widest text-center px-4">Rasmni yuklang</p>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>
                </div>
                
                <button 
                  disabled={isSubmitting || !previewImage} 
                  className="w-full py-7 bg-emerald-600 text-white rounded-[32px] font-black text-2xl hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:bg-slate-100 disabled:text-slate-300 flex items-center justify-center gap-4"
                >
                  {isSubmitting ? "Yuborilmoqda..." : <>Qatnashish <Rocket size={24} /></>}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shrink-0 transition-all duration-300 ${
      active 
        ? 'bg-slate-950 text-white shadow-2xl scale-105' 
        : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
    }`}
  >
    {icon} {label}
  </button>
);

export default NewsForum;
