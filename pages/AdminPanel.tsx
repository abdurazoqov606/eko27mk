
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ContestConfig, EcoArticle, GameItem } from '../types';
import { 
  Lock, ShieldCheck, Trophy, LayoutDashboard, 
  Save, Newspaper, BookOpen, Trash2, Edit3,
  Loader2, Plus, Image as ImageIcon, Gamepad2, X, Activity, Coins, Music, Volume2
} from 'lucide-react';

interface AdminPanelProps {
  isAuthenticated: boolean;
  onAuthenticate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isAuthenticated, onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'contest' | 'news' | 'library' | 'games'>('news');
  const [loading, setLoading] = useState(false);
  const [isHacking, setIsHacking] = useState(false);
  const [hackText, setHackText] = useState('INITIALIZING...');
  
  // Audio uchun ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    description: 'Hududni tozalang, "27" yozuvi bilan rasmga tushing va haqiqiy pul mukofotlarini yuting!',
    prizes: [
      { rank: "1-o'rin", amount: "2 000 000", bonus: "Oltin mukofoti" },
      { rank: "2-o'rin", amount: "700 000", bonus: "Kumush mukofoti" },
      { rank: "3-o'rin", amount: "500 000", bonus: "Bronza mukofoti" }
    ]
  });
  
  const [news, setNews] = useState<EcoArticle[]>([]);
  const [library, setLibrary] = useState<EcoArticle[]>([]);
  const [games, setGames] = useState<GameItem[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubNews = onSnapshot(query(collection(db, "news"), orderBy("timestamp", "desc")), (s) => {
      setNews(s.docs.map(d => ({ id: d.id, ...d.data() } as EcoArticle)));
    });
    const unsubLib = onSnapshot(query(collection(db, "library"), orderBy("timestamp", "desc")), (s) => {
      setLibrary(s.docs.map(d => ({ id: d.id, ...d.data() } as EcoArticle)));
    });
    const unsubGames = onSnapshot(query(collection(db, "games"), orderBy("timestamp", "desc")), (s) => {
      setGames(s.docs.map(d => ({ id: d.id, ...d.data() } as GameItem)));
    });
    
    const unsubConfig = onSnapshot(doc(db, "settings", "contest_config"), (d) => {
      if (d.exists()) setContestConfig(d.data() as ContestConfig);
    });

    return () => { unsubNews(); unsubLib(); unsubGames(); unsubConfig(); };
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2010abbos') {
      setIsHacking(true);
      
      // Musiqani ijro etish
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => console.log("Audio play error:", err));
      }

      const phrases = [
        'BYPASSING FIREWALL...', 
        'DECRYPTING ACCESS CODES...', 
        'CONNECTING TO CLOUD SERVER...', 
        'AUTHORIZING ADMIN PRIVILEGES...', 
        'WELCOME MASTER ABBOS'
      ];
      
      let i = 0;
      const interval = setInterval(() => {
        if (i < phrases.length) { 
          setHackText(phrases[i]); 
          i++; 
        }
      }, 800);

      setTimeout(() => { 
        clearInterval(interval); 
        setIsHacking(false); 
        onAuthenticate(); 
      }, 4500);
    } else {
      alert('Parol noto\'g\'ri!');
    }
  };

  const handleSaveContestConfig = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "contest_config"), contestConfig);
      alert("Tanlov sozlamalari muvaffaqiyatli saqlandi!");
    } catch (e) {
      alert("Xatolik yuz berdi!");
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setNewItem({ ...newItem, image: event.target?.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItem = async () => {
    if (!newItem.title) { alert("Sarlavha kiriting!"); return; }
    setLoading(true);
    const collectionName = activeTab === 'news' ? "news" : activeTab === 'library' ? "library" : "games";
    try {
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), { ...newItem, updatedAt: serverTimestamp() });
        alert("Muvaffaqiyatli yangilandi!");
      } else {
        await addDoc(collection(db, collectionName), { ...newItem, timestamp: serverTimestamp() });
        alert("Yangi ma'lumot qo'shildi!");
      }
      resetForm();
    } catch (e) { alert("Xatolik!"); }
    setLoading(false);
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setNewItem({
      title: item.title || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      image: item.image || '',
      category: item.category || 'Yangiliklar',
      date: item.date || new Date().toISOString().split('T')[0],
      url: item.url || ''
    });
    // Formga fokus qilish uchun tepaga skroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, collectionName: string) => {
    if (!window.confirm("Haqiqatdan ham ushbu ma'lumotni o'chirmoqchimisiz?")) return;
    try { 
      await deleteDoc(doc(db, collectionName, id)); 
      alert("O'chirildi!");
    } catch (e) { alert("Xatolik!"); }
  };

  const resetForm = () => {
    setEditingId(null);
    setNewItem({ 
      title: '', 
      excerpt: '', 
      content: '', 
      image: '', 
      category: 'Yangiliklar', 
      date: new Date().toISOString().split('T')[0], 
      url: '' 
    });
  };

  return (
    <div className="animate-fade-in pb-20 pt-10">
      {/* Yashirin audio element - Cyber Sound */}
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3" preload="auto" />

      {isHacking && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black">
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-12">
               <Activity size={128} className="text-emerald-500 absolute inset-0 animate-ping opacity-20" />
               <Activity size={128} className="text-emerald-500 relative animate-pulse" />
            </div>
            <p className="text-emerald-400 font-mono text-xl tracking-[0.3em] uppercase animate-pulse">{hackText}</p>
            <div className="mt-8 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 animate-[loading_4.5s_ease-in-out_forwards]" />
            </div>
          </div>
          <style>{`
            @keyframes loading { from { width: 0%; } to { width: 100%; } }
          `}</style>
        </div>
      )}

      {!isAuthenticated ? (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-slate-900 rounded-[56px] p-12 shadow-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
            <Lock size={48} className="text-emerald-500 mx-auto mb-10 group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-black text-white text-center mb-10 italic uppercase tracking-tighter">ADMIN LOGIN</h2>
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="KODNI KIRITING..." 
                  className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-center tracking-[0.5em] outline-none focus:border-emerald-500/50 transition-all" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>
              <button className="w-full py-5 bg-emerald-600 text-white rounded-[32px] font-black uppercase shadow-2xl shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95 transition-all">SISTEMAGA KIRISH</button>
            </form>
            <p className="mt-8 text-center text-[10px] text-white/20 font-bold uppercase tracking-widest">ECO SYSTEM v2.7 Secure Access</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-16 flex flex-col lg:flex-row justify-between items-center gap-10">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">NAZORAT <span className="text-emerald-600">PANELI</span></h2>
            <div className="flex bg-white p-2.5 rounded-[32px] shadow-3xl overflow-x-auto no-scrollbar">
               <AdminTab active={activeTab === 'news'} onClick={() => {resetForm(); setActiveTab('news');}} icon={<Newspaper size={20} />} label="Yangiliklar" />
               <AdminTab active={activeTab === 'library'} onClick={() => {resetForm(); setActiveTab('library');}} icon={<BookOpen size={20} />} label="Kutubxona" />
               <AdminTab active={activeTab === 'games'} onClick={() => {resetForm(); setActiveTab('games');}} icon={<Gamepad2 size={20} />} label="O'yinlar" />
               <AdminTab active={activeTab === 'contest'} onClick={() => setActiveTab('contest')} icon={<Trophy size={20} />} label="Tanlov" />
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-12">
               <div className="bg-white rounded-[64px] p-10 md:p-14 shadow-3xl border border-slate-50">
                  
                  {activeTab === 'contest' ? (
                    <div className="space-y-12 animate-in slide-in-from-bottom-4">
                      <div className="flex items-center gap-4 mb-8">
                        <Trophy className="text-amber-500" size={32} />
                        <h3 className="text-3xl font-black text-slate-900 italic uppercase">Tanlov Sozlamalari</h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tanlov Nomi (Sarlavha)</label>
                          <input 
                            value={contestConfig.title} 
                            onChange={e => setContestConfig({...contestConfig, title: e.target.value})} 
                            className="w-full px-8 py-5 bg-slate-50 rounded-[28px] font-black text-xl border-2 border-transparent focus:border-emerald-500 shadow-inner"
                          />
                        </div>
                        <div className="space-y-6">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tanlov Tavsifi</label>
                          <textarea 
                            value={contestConfig.description} 
                            onChange={e => setContestConfig({...contestConfig, description: e.target.value})} 
                            className="w-full px-8 py-5 bg-slate-50 rounded-[28px] font-medium h-32 border-2 border-transparent focus:border-emerald-500 shadow-inner resize-none"
                          />
                        </div>
                      </div>

                      <div className="pt-10 border-t border-slate-100">
                        <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 italic"><Coins className="text-emerald-500" /> Mukofotlar</h4>
                        <div className="grid md:grid-cols-3 gap-8">
                           {contestConfig.prizes.map((prize, idx) => (
                             <div key={idx} className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">{idx + 1}</div>
                                   <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest">{prize.rank}</span>
                                </div>
                                <input value={prize.amount} onChange={e => {
                                  const newPrizes = [...contestConfig.prizes];
                                  newPrizes[idx].amount = e.target.value;
                                  setContestConfig({...contestConfig, prizes: newPrizes});
                                }} className="w-full px-6 py-4 bg-white rounded-2xl font-black text-emerald-600 outline-none shadow-sm" />
                                <input value={prize.bonus} onChange={e => {
                                  const newPrizes = [...contestConfig.prizes];
                                  newPrizes[idx].bonus = e.target.value;
                                  setContestConfig({...contestConfig, prizes: newPrizes});
                                }} className="w-full px-6 py-4 bg-white rounded-2xl font-bold text-slate-700 outline-none shadow-sm" />
                             </div>
                           ))}
                        </div>
                      </div>

                      <button onClick={handleSaveContestConfig} disabled={loading} className="w-full py-8 bg-emerald-600 text-white rounded-[40px] font-black text-2xl shadow-3xl flex items-center justify-center gap-4 hover:bg-emerald-500 transition-all">
                        {loading ? <Loader2 className="animate-spin" /> : <>SAQLASH <Save size={28} /></>}
                      </button>
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-1 gap-16">
                       {/* Form Section */}
                       <div className="bg-slate-50 p-10 md:p-14 rounded-[56px] border border-slate-100">
                          <div className="flex items-center justify-between mb-10">
                             <h3 className="text-3xl font-black italic uppercase flex items-center gap-4">
                               {editingId ? <Edit3 className="text-blue-500" /> : <Plus className="text-emerald-500" />}
                               {editingId ? 'Ma\'lumotni Tahrirlash' : 'Yangi Qo\'shish'}
                             </h3>
                             {editingId && <button onClick={resetForm} className="p-3 bg-rose-100 text-rose-600 rounded-2xl"><X /></button>}
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-10">
                             <div className="space-y-6">
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Sarlavha</label>
                                   <input value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full px-8 py-5 bg-white rounded-[28px] font-bold border-2 border-transparent focus:border-emerald-500 shadow-sm" placeholder="Sarlavha yozing..." />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Rasm (URL yoki Fayl)</label>
                                   <div className="flex gap-4">
                                      <input className="flex-grow px-8 py-5 bg-white rounded-[28px] text-sm border-2 border-transparent focus:border-emerald-500 shadow-sm" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} placeholder="https://..." />
                                      <button onClick={() => fileInputRef.current?.click()} className="p-5 bg-emerald-100 text-emerald-600 rounded-[24px] hover:bg-emerald-600 hover:text-white transition-all"><ImageIcon size={24} /></button>
                                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                   </div>
                                </div>
                                {activeTab === 'games' && (
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">O'yin URL manzili</label>
                                     <input value={newItem.url} onChange={e => setNewItem({...newItem, url: e.target.value})} className="w-full px-8 py-5 bg-white rounded-[28px] font-bold border-2 border-transparent focus:border-emerald-500 shadow-sm" placeholder="O'yin manzili..." />
                                  </div>
                                )}
                             </div>
                             
                             <div className="space-y-6">
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Qisqacha tavsif (Excerpt)</label>
                                   <input value={newItem.excerpt} onChange={e => setNewItem({...newItem, excerpt: e.target.value})} className="w-full px-8 py-5 bg-white rounded-[28px] font-medium border-2 border-transparent focus:border-emerald-500 shadow-sm" placeholder="Qisqacha matn..." />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">To'liq matn (Content)</label>
                                   <textarea value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} className="w-full p-8 bg-white rounded-[32px] h-40 resize-none outline-none border-2 border-transparent focus:border-emerald-500 shadow-sm" placeholder="To'liq batafsil matn..." />
                                </div>
                             </div>
                          </div>

                          <button onClick={handleSaveItem} disabled={loading} className={`w-full py-7 mt-10 ${editingId ? 'bg-blue-600' : 'bg-slate-900'} text-white rounded-[32px] font-black text-xl shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.01] transition-all`}>
                             {loading ? <Loader2 className="animate-spin" /> : editingId ? <>YANGILASH <Save /></> : <>SAQLASH <Plus /></>}
                          </button>
                       </div>

                       {/* List Section */}
                       <div className="space-y-8">
                          <h3 className="text-3xl font-black italic uppercase flex items-center gap-4 px-4">
                             <LayoutDashboard className="text-slate-400" />
                             Mavjud Ro'yxat ({activeTab === 'news' ? news.length : activeTab === 'library' ? library.length : games.length} ta)
                          </h3>
                          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                             {(activeTab === 'news' ? news : activeTab === 'library' ? library : games).map((item) => (
                               <div key={item.id} className="p-6 bg-white rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-xl transition-all group">
                                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                                     <img src={item.image} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <div className="flex-grow min-w-0">
                                     <h4 className="font-black text-slate-900 truncate italic">{item.title}</h4>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.date || 'Sana yo\'q'}</p>
                                  </div>
                                  <div className="flex gap-2">
                                     <button onClick={() => startEdit(item)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={18} /></button>
                                     <button onClick={() => handleDelete(item.id, activeTab === 'news' ? 'news' : activeTab === 'library' ? 'library' : 'games')} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  )}

               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AdminTab = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-4 px-8 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all shrink-0 ${active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
    {icon} {label}
  </button>
);

export default AdminPanel;
