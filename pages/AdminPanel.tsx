
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ContestConfig, EcoArticle, GameItem, RedBookConfig, NatureReserve, ContestSubmission } from '../types';
import { 
  Lock, Trophy, LayoutDashboard, Save, Newspaper, BookOpen, Trash2, Edit3,
  Loader2, Image as ImageIcon, Gamepad2, X, Book, Leaf, Dog, MapPin, Terminal, Upload, Camera, Users, Phone, Heart, Calendar
} from 'lucide-react';

interface AdminPanelProps {
  isAuthenticated: boolean;
  onAuthenticate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isAuthenticated, onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'contest' | 'news' | 'library' | 'games' | 'red_book' | 'reserves'>('news');
  const [contestSubTab, setContestSubTab] = useState<'settings' | 'submissions'>('submissions');
  const [loading, setLoading] = useState(false);
  const [isHacking, setIsHacking] = useState(false);
  const [hackText, setHackText] = useState('INITIALIZING...');
  
  const loginAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<any>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: 'Yangiliklar',
    date: new Date().toISOString().split('T')[0],
    url: ''
  });
  
  const [contestConfig, setContestConfig] = useState<ContestConfig>({
    title: '27',
    description: '',
    prizes: [
      { rank: "1-o'rin", amount: "", bonus: "" },
      { rank: "2-o'rin", amount: "", bonus: "" },
      { rank: "3-o'rin", amount: "", bonus: "" }
    ]
  });

  const [redBookConfig, setRedBookConfig] = useState<RedBookConfig>({
    history: '',
    updates: '',
    plantsPdfUrl: '',
    animalsPdfUrl: '',
    lastUpdated: '2024'
  });
  
  const [news, setNews] = useState<EcoArticle[]>([]);
  const [library, setLibrary] = useState<EcoArticle[]>([]);
  const [games, setGames] = useState<GameItem[]>([]);
  const [reserves, setReserves] = useState<NatureReserve[]>([]);
  const [contestSubmissions, setContestSubmissions] = useState<ContestSubmission[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubNews = onSnapshot(query(collection(db, "news"), orderBy("timestamp", "desc")), (s) => setNews(s.docs.map(d => ({ id: d.id, ...d.data() } as EcoArticle))));
    const unsubLib = onSnapshot(query(collection(db, "library"), orderBy("timestamp", "desc")), (s) => setLibrary(s.docs.map(d => ({ id: d.id, ...d.data() } as EcoArticle))));
    const unsubGames = onSnapshot(query(collection(db, "games"), orderBy("timestamp", "desc")), (s) => setGames(s.docs.map(d => ({ id: d.id, ...d.data() } as GameItem))));
    const unsubReserves = onSnapshot(query(collection(db, "nature_reserves"), orderBy("timestamp", "desc")), (s) => setReserves(s.docs.map(d => ({ id: d.id, ...d.data() } as NatureReserve))));
    const unsubContestSub = onSnapshot(query(collection(db, "contest_submissions"), orderBy("timestamp", "desc")), (s) => {
      setContestSubmissions(s.docs.map(d => ({ id: d.id, ...d.data() } as ContestSubmission)));
    });
    
    onSnapshot(doc(db, "settings", "contest_config"), (d) => { if (d.exists()) setContestConfig(d.data() as ContestConfig); });
    onSnapshot(doc(db, "settings", "red_book_config"), (d) => { if (d.exists()) setRedBookConfig(d.data() as RedBookConfig); });

    return () => {};
  }, [isAuthenticated]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { 
        alert("Rasm hajmi juda katta! 1MB dan kichik rasm yuklang.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewItem({ ...newItem, image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRedBookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) { 
        alert("Rasm hajmi juda katta! 800KB dan kichik rasm yuklang.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setRedBookConfig({ ...redBookConfig, history: redBookConfig.history, updates: redBookConfig.updates, lastUpdated: redBookConfig.lastUpdated, plantsPdfUrl: redBookConfig.plantsPdfUrl, animalsPdfUrl: redBookConfig.animalsPdfUrl, ...({coverImage: event.target?.result as string}) });
      };
      reader.readAsDataURL(file);
    }
  };

  const getActiveList = () => {
    switch (activeTab) {
      case 'news': return news;
      case 'library': return library;
      case 'games': return games;
      case 'reserves': return reserves;
      default: return [];
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2010abbos') {
      setIsHacking(true);
      if (loginAudioRef.current) {
        loginAudioRef.current.currentTime = 0;
        loginAudioRef.current.play().catch(() => {});
      }
      const phrases = ['INITIALIZING...', 'BYPASSING SECURITY...', 'ACCESS GRANTED: ABBOS'];
      let i = 0;
      const interval = setInterval(() => { if (i < phrases.length) { setHackText(phrases[i]); i++; } }, 800);
      setTimeout(() => { clearInterval(interval); setIsHacking(false); onAuthenticate(); }, 4000);
    } else { alert('Xato!'); }
  };

  const handleSaveItem = async () => {
    if (!newItem.title) return alert("Sarlavha kerak!");
    setLoading(true);
    let colName = "";
    switch(activeTab) {
      case 'news': colName = "news"; break;
      case 'library': colName = "library"; break;
      case 'games': colName = "games"; break;
      case 'reserves': colName = "nature_reserves"; break;
    }
    
    try {
      if (editingId) {
        await updateDoc(doc(db, colName, editingId), { ...newItem, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, colName), { ...newItem, timestamp: serverTimestamp() });
      }
      resetForm();
      alert("Muvaffaqiyatli saqlandi!");
    } catch (e) { alert("Xato yuz berdi!"); }
    setLoading(false);
  };

  const handleSaveContestConfig = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "contest_config"), contestConfig);
      alert("Tanlov sozlamalari yangilandi!");
    } catch (e) { alert("Xato!"); }
    setLoading(false);
  };

  const handleSaveRedBookConfig = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "red_book_config"), redBookConfig);
      alert("Qizil Kitob sozlamalari yangilandi!");
    } catch (e) { alert("Xato!"); }
    setLoading(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setNewItem({ title: '', excerpt: '', content: '', image: '', category: 'Yangiliklar', date: new Date().toISOString().split('T')[0], url: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setNewItem({ ...item });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("O'chirilsinmi?")) return;
    let colName = "";
    switch(activeTab) {
      case 'news': colName = "news"; break;
      case 'library': colName = "library"; break;
      case 'games': colName = "games"; break;
      case 'reserves': colName = "nature_reserves"; break;
    }
    await deleteDoc(doc(db, colName, id));
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm("Ushbu ishtirokchini o'chirishni xohlaysizmi?")) return;
    try {
      await deleteDoc(doc(db, "contest_submissions", id));
      alert("O'chirildi!");
    } catch (e) {
      alert("Xatolik!");
    }
  };

  return (
    <div className="animate-fade-in pb-20 pt-10 px-4 md:px-0">
      <audio ref={loginAudioRef} src="https://raw.githubusercontent.com/abdurazoqov606/Mus/main/b1859765.mp3" preload="auto" />

      {isHacking && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black">
          <Terminal size={100} className="text-emerald-500 animate-pulse mb-8" />
          <p className="text-emerald-400 font-mono text-lg tracking-widest text-center">{hackText}</p>
        </div>
      )}

      {!isAuthenticated ? (
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-full max-w-md bg-slate-900 rounded-[40px] p-10 text-center border border-white/5 shadow-3xl">
            <Lock size={48} className="text-emerald-500 mx-auto mb-8" />
            <h2 className="text-2xl font-black text-white mb-8 uppercase italic tracking-tighter">ADMIN TERMINAL ACCESS</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <input type="password" placeholder="Maxfiy kod..." className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500 text-center font-black tracking-widest" value={password} onChange={e => setPassword(e.target.value)} />
              <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all">Tizimga kirish</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-xl"><LayoutDashboard /></div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Boshqaruv <span className="text-emerald-600">Paneli</span></h2>
            </div>
            <div className="flex flex-wrap justify-center gap-2 bg-white p-2.5 rounded-[32px] shadow-2xl border border-slate-50">
               <AdminTab active={activeTab === 'news'} onClick={() => {resetForm(); setActiveTab('news');}} icon={<Newspaper size={18} />} label="Yangilik" />
               <AdminTab active={activeTab === 'library'} onClick={() => {resetForm(); setActiveTab('library');}} icon={<BookOpen size={18} />} label="Kutubxona" />
               <AdminTab active={activeTab === 'games'} onClick={() => {resetForm(); setActiveTab('games');}} icon={<Gamepad2 size={18} />} label="O'yin" />
               <AdminTab active={activeTab === 'contest'} onClick={() => setActiveTab('contest')} icon={<Trophy size={18} />} label="Tanlov" />
               <AdminTab active={activeTab === 'red_book'} onClick={() => setActiveTab('red_book')} icon={<Book size={18} />} label="Qizil Kitob" />
               <AdminTab active={activeTab === 'reserves'} onClick={() => {resetForm(); setActiveTab('reserves');}} icon={<MapPin size={18} />} label="Hudud" />
            </div>
          </div>

          <div className="bg-white rounded-[56px] p-8 md:p-12 shadow-3xl border border-slate-50 transition-all">
            {activeTab === 'contest' ? (
              <div className="space-y-12 animate-in slide-in-from-bottom-4">
                 <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-8 gap-6">
                    <div className="flex items-center gap-4">
                       <Trophy className="text-amber-500" size={32} />
                       <h3 className="text-3xl font-black italic uppercase">Tanlov Boshqaruvi</h3>
                    </div>
                    <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[20px]">
                       <button 
                         onClick={() => setContestSubTab('submissions')} 
                         className={`px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${contestSubTab === 'submissions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                       >
                         Ishtirokchilar ({contestSubmissions.length})
                       </button>
                       <button 
                         onClick={() => setContestSubTab('settings')} 
                         className={`px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${contestSubTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                       >
                         Sozlamalar
                       </button>
                    </div>
                 </div>

                 {contestSubTab === 'settings' ? (
                   <div className="animate-in fade-in slide-in-from-right-4 space-y-8">
                      <div className="grid gap-8">
                         <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-4 mb-2">Tanlov nomi</label>
                           <input value={contestConfig.title} onChange={e => setContestConfig({...contestConfig, title: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[28px] outline-none font-bold" placeholder="Tanlov sarlavhasi..." />
                         </div>
                         <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-4 mb-2">Tanlov tavsifi</label>
                           <textarea value={contestConfig.description} onChange={e => setContestConfig({...contestConfig, description: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[28px] h-40 outline-none font-medium italic" placeholder="Qoidalar va tavsif..." />
                         </div>
                         <div className="grid md:grid-cols-3 gap-6">
                            {contestConfig.prizes.map((prize, idx) => (
                              <div key={idx} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                                 <h4 className="font-black text-emerald-600 mb-4">{prize.rank}</h4>
                                 <input value={prize.amount} onChange={e => {
                                    const newPrizes = [...contestConfig.prizes];
                                    newPrizes[idx].amount = e.target.value;
                                    setContestConfig({...contestConfig, prizes: newPrizes});
                                 }} className="w-full p-4 bg-white rounded-xl mb-3 outline-none font-bold" placeholder="Summa..." />
                                 <input value={prize.bonus} onChange={e => {
                                    const newPrizes = [...contestConfig.prizes];
                                    newPrizes[idx].bonus = e.target.value;
                                    setContestConfig({...contestConfig, prizes: newPrizes});
                                 }} className="w-full p-4 bg-white rounded-xl outline-none text-xs" placeholder="Bonus matni..." />
                              </div>
                            ))}
                         </div>
                      </div>
                      <button onClick={handleSaveContestConfig} disabled={loading} className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xl shadow-2xl hover:bg-emerald-600 transition-all">
                         {loading ? <Loader2 className="animate-spin mx-auto" /> : "SOZLAMALARNI SAQLASH"}
                      </button>
                   </div>
                 ) : (
                   <div className="animate-in fade-in slide-in-from-left-4">
                      {contestSubmissions.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                           <Users size={64} className="mx-auto text-slate-200 mb-4" />
                           <p className="text-slate-400 font-black uppercase tracking-widest italic">Hozircha ishtirokchilar yo'q</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           {contestSubmissions.map((sub, idx) => (
                             <div key={sub.id} className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-lg group relative flex flex-col">
                                <div className="h-64 relative overflow-hidden bg-slate-100">
                                   <img src={sub.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={sub.fullName} />
                                   <div className="absolute top-4 left-4 px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-black">
                                      #{idx + 1} REYTINGDA
                                   </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                   <h4 className="font-black text-slate-900 text-xl mb-4 italic truncate uppercase">{sub.fullName}</h4>
                                   
                                   <div className="space-y-3 mb-8">
                                      <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                         <Phone size={16} className="text-emerald-500" /> {sub.phone}
                                      </div>
                                      <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                         <Heart size={16} className="text-rose-500" /> {sub.likes} ovoz
                                      </div>
                                      <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase">
                                         <Calendar size={14} /> {sub.timestamp?.toDate ? sub.timestamp.toDate().toLocaleDateString() : 'Yaqinda'}
                                      </div>
                                   </div>

                                   <button 
                                     onClick={() => handleDeleteSubmission(sub.id)} 
                                     className="w-full py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                   >
                                      <Trash2 size={16} /> Ishtirokchini o'chirish
                                   </button>
                                </div>
                             </div>
                           ))}
                        </div>
                      )}
                   </div>
                 )}
              </div>
            ) : activeTab === 'red_book' ? (
              <div className="space-y-12 animate-in slide-in-from-bottom-4">
                 <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
                    <Book className="text-rose-600" size={32} />
                    <h3 className="text-3xl font-black italic uppercase text-rose-600">Qizil Kitob Moduli</h3>
                 </div>
                 <div className="grid gap-8">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-4 mb-2">Tarixi va Ma'lumot</label>
                          <textarea value={redBookConfig.history} onChange={e => setRedBookConfig({...redBookConfig, history: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[28px] h-60 outline-none font-medium italic" placeholder="Qizil kitob haqida..." />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-4 mb-2">Oxirgi yangilanishlar</label>
                          <textarea value={redBookConfig.updates} onChange={e => setRedBookConfig({...redBookConfig, updates: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[28px] h-60 outline-none font-medium italic" placeholder="Statistika..." />
                       </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                          <Leaf className="text-emerald-500 mb-4" />
                          <input value={redBookConfig.plantsPdfUrl} onChange={e => setRedBookConfig({...redBookConfig, plantsPdfUrl: e.target.value})} className="w-full p-4 bg-white rounded-xl outline-none text-sm mb-4" placeholder="O'simliklar PDF havolasi..." />
                          <div 
                              onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = (e: any) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setRedBookConfig({...redBookConfig, ...({plantsImage: ev.target?.result as string})}); reader.readAsDataURL(file); } }; input.click(); }}
                              className="border-2 border-dashed border-emerald-300 rounded-xl p-4 text-center cursor-pointer hover:bg-emerald-50"
                          >
                             <p className="text-[10px] font-black uppercase text-emerald-600">O'simliklar rasm tanlash</p>
                          </div>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                          <Dog className="text-rose-500 mb-4" />
                          <input value={redBookConfig.animalsPdfUrl} onChange={e => setRedBookConfig({...redBookConfig, animalsPdfUrl: e.target.value})} className="w-full p-4 bg-white rounded-xl outline-none text-sm mb-4" placeholder="Hayvonlar PDF havolasi..." />
                          <div 
                              onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = (e: any) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setRedBookConfig({...redBookConfig, ...({animalsImage: ev.target?.result as string})}); reader.readAsDataURL(file); } }; input.click(); }}
                              className="border-2 border-dashed border-rose-300 rounded-xl p-4 text-center cursor-pointer hover:bg-rose-50"
                          >
                             <p className="text-[10px] font-black uppercase text-rose-600">Hayvonlar rasm tanlash</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 <button onClick={handleSaveRedBookConfig} disabled={loading} className="w-full py-6 bg-rose-600 text-white rounded-[32px] font-black text-xl shadow-2xl hover:bg-rose-500 transition-all">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "KITOBNI YANGILASH"}
                 </button>
              </div>
            ) : (
              <div className="space-y-16">
                 {/* Item Editor */}
                 <div className="bg-slate-50 p-8 md:p-12 rounded-[48px] shadow-sm border border-slate-100 space-y-8">
                    <div className="flex items-center justify-between">
                       <h3 className="text-2xl font-black italic uppercase tracking-tighter">{editingId ? 'Ma\'lumotni Tahrirlash' : 'Yangi Kontent Qo\'shish'}</h3>
                       {editingId && <button onClick={resetForm} className="text-rose-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><X size={14} /> Bekor qilish</button>}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-10">
                       <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase block ml-4 mb-2">Sarlavha</label>
                            <input value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full p-5 bg-white rounded-2xl outline-none font-bold shadow-sm" placeholder="Mavzu nomi..." />
                          </div>

                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-400 uppercase block ml-4">Rasm yuklash (Galereyadan)</label>
                             <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`h-56 border-4 border-dashed rounded-[40px] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${newItem.image ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                             >
                                {newItem.image ? (
                                   <>
                                      <img src={newItem.image} className="w-full h-full object-cover" alt="Preview" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                         <Camera className="text-white" size={40} />
                                      </div>
                                   </>
                                ) : (
                                   <div className="text-center p-8">
                                      <Upload className="mx-auto text-emerald-500 mb-3" size={48} />
                                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Rasm tanlash</p>
                                   </div>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                             </div>
                             <p className="text-[9px] text-slate-400 px-4 italic">Faqat 1MB gacha hajmdagi rasmlarni yuklang.</p>
                          </div>
                          
                          {activeTab === 'games' && (
                             <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase block ml-4 mb-2">O'yin URL</label>
                               <input value={newItem.url} onChange={e => setNewItem({...newItem, url: e.target.value})} className="w-full p-5 bg-white rounded-2xl outline-none font-medium shadow-sm" placeholder="O'yin havolasi..." />
                             </div>
                          )}
                       </div>

                       <div className="space-y-6">
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase block ml-4 mb-2">Tavsif / Kontent</label>
                             <textarea 
                                value={newItem.content || newItem.excerpt} 
                                onChange={e => setNewItem({...newItem, content: e.target.value, excerpt: e.target.value})} 
                                className="w-full p-6 bg-white rounded-[32px] h-[340px] outline-none font-medium italic shadow-sm resize-none" 
                                placeholder="Batafsil ma'lumot kiriting..." 
                             />
                          </div>
                       </div>
                    </div>

                    <button 
                       onClick={handleSaveItem} 
                       disabled={loading} 
                       className="w-full py-7 bg-slate-900 text-white rounded-[32px] font-black text-xl shadow-2xl flex items-center justify-center gap-4 hover:bg-emerald-600 transition-all active:scale-95"
                    >
                       {loading ? <Loader2 className="animate-spin" /> : <><Save size={24} /> SAQLASH VA NASHR QILISH</>}
                    </button>
                 </div>

                 {/* Items List */}
                 <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-4">
                       Mavjud Ma'lumotlar <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{getActiveList().length}</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                       {getActiveList().map((item: any) => (
                         <div key={item.id} className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-md group hover:shadow-2xl transition-all flex flex-col">
                            <div className="h-44 relative overflow-hidden bg-slate-50">
                               <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                               <h4 className="font-black text-slate-900 text-lg mb-4 truncate italic">{item.title}</h4>
                               <div className="flex gap-3 mt-auto">
                                  <button onClick={() => startEdit(item)} className="flex-grow py-3.5 bg-blue-50 text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                                     <Edit3 size={16} /> TAHRIR
                                  </button>
                                  <button onClick={() => handleDelete(item.id)} className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all">
                                     <Trash2 size={18} />
                                  </button>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminTab = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${active ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-slate-50'}`}>
    {icon} <span className="hidden sm:inline">{label}</span>
  </button>
);

export default AdminPanel;
