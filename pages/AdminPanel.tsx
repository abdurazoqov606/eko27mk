
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ContestConfig, EcoArticle, GameItem, RedBookConfig, ContestSubmission, NatureReserve } from '../types';
import { 
  Lock, ShieldCheck, Trophy, LayoutDashboard, 
  Save, Newspaper, BookOpen, Trash2, Edit3,
  Loader2, Plus, Image as ImageIcon, Gamepad2, X, Activity, Book, FileText, Leaf, Dog, Award, Gift, MapPin, Globe, Phone, Terminal
} from 'lucide-react';

interface AdminPanelProps {
  isAuthenticated: boolean;
  onAuthenticate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isAuthenticated, onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'contest' | 'news' | 'library' | 'games' | 'red_book' | 'reserves'>('news');
  const [loading, setLoading] = useState(false);
  const [isHacking, setIsHacking] = useState(false);
  const [hackText, setHackText] = useState('INITIALIZING...');
  
  const loginAudioRef = useRef<HTMLAudioElement | null>(null);

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
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Real-time listeners
    const unsubNews = onSnapshot(query(collection(db, "news"), orderBy("timestamp", "desc")), (s) => {
      setNews(s.docs.map(d => ({ id: d.id, ...d.data() } as EcoArticle)));
    });
    const unsubLib = onSnapshot(query(collection(db, "library"), orderBy("timestamp", "desc")), (s) => {
      setLibrary(s.docs.map(d => ({ id: d.id, ...d.data() } as EcoArticle)));
    });
    const unsubGames = onSnapshot(query(collection(db, "games"), orderBy("timestamp", "desc")), (s) => {
      setGames(s.docs.map(d => ({ id: d.id, ...d.data() } as GameItem)));
    });
    const unsubReserves = onSnapshot(query(collection(db, "nature_reserves"), orderBy("timestamp", "desc")), (s) => {
      setReserves(s.docs.map(d => ({ id: d.id, ...d.data() } as NatureReserve)));
    });
    const unsubContestSubs = onSnapshot(query(collection(db, "contest_submissions"), orderBy("likes", "desc")), (s) => {
      setContestSubmissions(s.docs.map(d => ({ id: d.id, ...d.data() } as ContestSubmission)));
    });
    
    onSnapshot(doc(db, "settings", "contest_config"), (d) => {
      if (d.exists()) setContestConfig(d.data() as ContestConfig);
    });

    onSnapshot(doc(db, "settings", "red_book_config"), (d) => {
      if (d.exists()) setRedBookConfig(d.data() as RedBookConfig);
    });

    return () => { unsubNews(); unsubLib(); unsubGames(); unsubReserves(); unsubContestSubs(); };
  }, [isAuthenticated]);

  const getActiveList = () => {
    switch (activeTab) {
      case 'news': return news;
      case 'library': return library;
      case 'games': return games;
      case 'reserves': return reserves;
      default: return [];
    }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2010abbos') {
      setIsHacking(true);
      if (loginAudioRef.current) {
        loginAudioRef.current.currentTime = 0;
        loginAudioRef.current.play().catch(() => console.log("Audio blocked"));
      }

      const phrases = [
        'INITIALIZING ENCRYPTION...', 
        'BYPASSING SECURITY...', 
        'DECRYPTING ADMIN HASH...', 
        'ACCESS GRANTED: MASTER ABBOS'
      ];
      
      let i = 0;
      const interval = setInterval(() => { 
        if (i < phrases.length) { setHackText(phrases[i]); i++; } 
      }, 800);

      setTimeout(() => { 
        clearInterval(interval); 
        setIsHacking(false); 
        onAuthenticate(); 
      }, 4000);
    } else { 
      alert('Parol noto\'g\'ri!'); 
    }
  };

  const handleSaveItem = async () => {
    if (!newItem.title) { alert("Sarlavha kiriting!"); return; }
    setLoading(true);
    const collectionName = activeTab === 'news' ? "news" : activeTab === 'library' ? "library" : activeTab === 'games' ? "games" : "nature_reserves";
    try {
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), { ...newItem, updatedAt: serverTimestamp() });
        alert("Ma'lumot yangilandi!");
      } else {
        await addDoc(collection(db, collectionName), { ...newItem, timestamp: serverTimestamp() });
        alert("Yangi ma'lumot qo'shildi!");
      }
      resetForm();
    } catch (e) { alert("Xatolik!"); }
    setLoading(false);
  };

  const handleSaveContestConfig = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "contest_config"), contestConfig);
      alert("Tanlov sozlamalari saqlandi!");
    } catch (e) { alert("Xatolik!"); }
    setLoading(false);
  };

  const handleSaveRedBookConfig = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "red_book_config"), redBookConfig);
      alert("Qizil Kitob ma'lumotlari saqlandi!");
    } catch (e) { alert("Xatolik!"); }
    setLoading(false);
  };

  const handleDelete = async (id: string, collectionName: string) => {
    if (!window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      alert("Muvaffaqiyatli o'chirildi!");
    } catch (e) { alert("O'chirishda xatolik!"); }
  };

  const resetForm = () => {
    setEditingId(null);
    setNewItem({ title: '', excerpt: '', content: '', image: '', category: 'Yangiliklar', date: new Date().toISOString().split('T')[0], url: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setNewItem({ ...newItem, image: event.target?.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade-in pb-20 pt-10">
      <audio ref={loginAudioRef} src="https://raw.githubusercontent.com/abdurazoqov606/Mus/main/b1859765.mp3" preload="auto" />

      {isHacking && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black">
          <Terminal size={100} className="text-emerald-500 animate-pulse mb-8" />
          <p className="text-emerald-400 font-mono text-xl tracking-[0.3em] uppercase text-center">{hackText}</p>
        </div>
      )}

      {!isAuthenticated ? (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-slate-900 rounded-[56px] p-12 shadow-3xl border border-white/5 relative overflow-hidden group text-center">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
            <Lock size={48} className="text-emerald-500 mx-auto mb-10 group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-black text-white mb-10 italic uppercase tracking-tighter">ADMIN TERMINAL</h2>
            <form onSubmit={handleLogin} className="space-y-8">
              <input type="password" placeholder="PASSWORD..." className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-center tracking-[0.5em] outline-none focus:border-emerald-500 transition-all" value={password} onChange={e => setPassword(e.target.value)} />
              <button className="w-full py-6 bg-emerald-600 text-white rounded-[32px] font-black uppercase shadow-2xl hover:bg-emerald-500 transition-all">ENTER SYSTEM</button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-12 flex flex-col lg:flex-row justify-between items-center gap-8">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
              ADMIN <span className="text-emerald-600">PANEL</span>
            </h2>
            
            <div className="flex flex-wrap justify-center lg:justify-end bg-white p-2 rounded-[28px] shadow-3xl gap-1.5">
               <AdminTab active={activeTab === 'news'} onClick={() => {resetForm(); setActiveTab('news');}} icon={<Newspaper size={18} />} label="Yangiliklar" />
               <AdminTab active={activeTab === 'library'} onClick={() => {resetForm(); setActiveTab('library');}} icon={<BookOpen size={18} />} label="Kutubxona" />
               <AdminTab active={activeTab === 'games'} onClick={() => {resetForm(); setActiveTab('games');}} icon={<Gamepad2 size={18} />} label="O'yinlar" />
               <AdminTab active={activeTab === 'contest'} onClick={() => setActiveTab('contest')} icon={<Trophy size={18} />} label="Tanlov" />
               <AdminTab active={activeTab === 'red_book'} onClick={() => setActiveTab('red_book')} icon={<Book size={18} />} label="Qizil Kitob" />
               <AdminTab active={activeTab === 'reserves'} onClick={() => {resetForm(); setActiveTab('reserves');}} icon={<MapPin size={18} />} label="Qo'riqxonalar" />
            </div>
          </div>

          <div className="bg-white rounded-[48px] md:rounded-[64px] p-6 md:p-14 shadow-3xl border border-slate-50 transition-all">
            {activeTab === 'contest' ? (
              <div className="space-y-16 animate-in slide-in-from-bottom-4">
                <div className="space-y-10">
                  <div className="flex items-center gap-4">
                    <Trophy className="text-amber-500" size={32} />
                    <h3 className="text-3xl font-black text-slate-900 italic uppercase">Tanlov Sozlamalari</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tanlov Nomi</label>
                      <input value={contestConfig.title} onChange={e => setContestConfig({...contestConfig, title: e.target.value})} className="w-full px-8 py-5 bg-slate-50 rounded-[28px] font-black text-xl border-2 border-transparent focus:border-emerald-500 shadow-inner outline-none" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tavsif</label>
                      <textarea value={contestConfig.description} onChange={e => setContestConfig({...contestConfig, description: e.target.value})} className="w-full px-8 py-5 bg-slate-50 rounded-[28px] font-medium h-32 border-2 border-transparent focus:border-emerald-500 shadow-inner resize-none outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {contestConfig.prizes.map((prize, idx) => (
                      <div key={idx} className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-4">
                        <span className="font-black uppercase text-xs tracking-widest text-slate-400">{prize.rank}</span>
                        <input placeholder="Summa" value={prize.amount} onChange={(e) => {
                          const newPrizes = [...contestConfig.prizes];
                          newPrizes[idx].amount = e.target.value;
                          setContestConfig({...contestConfig, prizes: newPrizes});
                        }} className="w-full px-6 py-4 bg-white rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                        <input placeholder="Bonus" value={prize.bonus} onChange={(e) => {
                          const newPrizes = [...contestConfig.prizes];
                          newPrizes[idx].bonus = e.target.value;
                          setContestConfig({...contestConfig, prizes: newPrizes});
                        }} className="w-full px-6 py-4 bg-white rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                      </div>
                    ))}
                  </div>
                  <button onClick={handleSaveContestConfig} disabled={loading} className="w-full py-8 bg-emerald-600 text-white rounded-[40px] font-black text-2xl shadow-3xl hover:bg-emerald-500 transition-all">
                    {loading ? <Loader2 className="animate-spin" /> : "SOZLAMALARNI SAQLASH"}
                  </button>
                </div>
                {/* Ishtirokchilar ro'yxati */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 pt-10 border-t">
                  {contestSubmissions.map(sub => (
                    <div key={sub.id} className="bg-slate-50 p-6 rounded-[40px] relative group hover:shadow-xl transition-all">
                      <img src={sub.imageUrl} className="w-full h-40 object-cover rounded-3xl mb-4" />
                      <h4 className="font-black text-sm truncate uppercase italic">{sub.fullName}</h4>
                      <p className="text-xs text-slate-400 mb-4">{sub.phone}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-rose-500">❤️ {sub.likes}</span>
                        <button onClick={() => handleDelete(sub.id, "contest_submissions")} className="p-3 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'red_book' ? (
              <div className="space-y-12 animate-in slide-in-from-bottom-4">
                 <div className="flex items-center gap-4 mb-8">
                   <Book className="text-rose-600" size={32} />
                   <h3 className="text-3xl font-black text-slate-900 italic uppercase">Qizil Kitob Boshqaruvi</h3>
                 </div>
                 <div className="space-y-8">
                    <textarea value={redBookConfig.history} onChange={e => setRedBookConfig({...redBookConfig, history: e.target.value})} className="w-full px-8 py-5 bg-slate-50 rounded-[28px] font-medium h-48 border-none outline-none focus:ring-2 focus:ring-rose-500 shadow-inner resize-none italic" placeholder="Tarixi..." />
                    <textarea value={redBookConfig.updates} onChange={e => setRedBookConfig({...redBookConfig, updates: e.target.value})} className="w-full px-8 py-5 bg-slate-50 rounded-[28px] font-medium h-32 border-none outline-none focus:ring-2 focus:ring-rose-500 shadow-inner resize-none italic" placeholder="Yangilanishlar..." />
                    <div className="grid md:grid-cols-2 gap-10">
                      <input value={redBookConfig.plantsPdfUrl} onChange={e => setRedBookConfig({...redBookConfig, plantsPdfUrl: e.target.value})} className="w-full px-8 py-5 bg-slate-50 rounded-[28px] font-bold outline-none focus:ring-2 focus:ring-rose-500" placeholder="O'simliklar PDF Link" />
                      <input value={redBookConfig.animalsPdfUrl} onChange={e => setRedBookConfig({...redBookConfig, animalsPdfUrl: e.target.value})} className="w-full px-8 py-5 bg-slate-50 rounded-[28px] font-bold outline-none focus:ring-2 focus:ring-rose-500" placeholder="Hayvonlar PDF Link" />
                    </div>
                 </div>
                 <button onClick={handleSaveRedBookConfig} disabled={loading} className="w-full py-8 bg-rose-600 text-white rounded-[40px] font-black text-2xl shadow-3xl hover:bg-rose-500 transition-all">
                    {loading ? <Loader2 className="animate-spin" /> : "QIZIL KITOBNI YANGILASH"}
                 </button>
              </div>
            ) : (
              <div className="space-y-16">
                 <div className="bg-slate-50 p-6 md:p-14 rounded-[40px] md:rounded-[56px] shadow-inner">
                    <h3 className="text-2xl md:text-3xl font-black italic uppercase mb-10 flex items-center gap-4">
                      {editingId ? <Edit3 className="text-blue-500" /> : <Plus className="text-emerald-500" />}
                      Ma'lumot {editingId ? "Tahrirlash" : "Qo'shish"}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-10">
                       <div className="space-y-6">
                          <input value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full px-8 py-5 bg-white rounded-[28px] font-bold outline-none border-none shadow-sm" placeholder="Sarlavha..." />
                          {activeTab === 'games' && <input value={newItem.url} onChange={e => setNewItem({...newItem, url: e.target.value})} className="w-full px-8 py-5 bg-white rounded-[28px] font-black text-sm outline-none border-none shadow-sm" placeholder="O'yin havolasi (URL)..." />}
                          <div className="flex gap-4">
                            <input className="flex-grow px-8 py-5 bg-white rounded-[28px] text-sm outline-none border-none shadow-sm" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} placeholder="Rasm URL..." />
                            <button onClick={() => fileInputRef.current?.click()} className="p-5 bg-emerald-100 text-emerald-600 rounded-[24px]"><ImageIcon size={24} /></button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                          </div>
                       </div>
                       <div className="space-y-6">
                          <input value={newItem.excerpt} onChange={e => setNewItem({...newItem, excerpt: e.target.value})} className="w-full px-8 py-5 bg-white rounded-[28px] font-medium outline-none border-none shadow-sm" placeholder="Qisqa tavsif..." />
                          <textarea value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} className="w-full p-8 bg-white rounded-[32px] h-40 resize-none outline-none border-none shadow-sm" placeholder="Batafsil matn..." />
                       </div>
                    </div>
                    <button onClick={handleSaveItem} disabled={loading} className={`w-full py-7 mt-10 ${editingId ? 'bg-blue-600' : 'bg-slate-900'} text-white rounded-[32px] font-black text-xl shadow-2xl transition-all hover:opacity-90`}>
                       {loading ? <Loader2 className="animate-spin" /> : editingId ? "YANGILASH" : "QO'SHISH"}
                    </button>
                    {editingId && <button onClick={resetForm} className="w-full mt-4 py-4 text-slate-400 font-bold uppercase text-xs">Tahrirlashni bekor qilish</button>}
                 </div>
                 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {getActiveList().map((item: any) => (
                      <div key={item.id} className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col group hover:shadow-2xl transition-all">
                         <img src={item.image} className="w-full h-40 object-cover rounded-3xl mb-6 group-hover:scale-105 transition-transform" alt="" />
                         <h4 className="font-black text-slate-900 text-xl truncate mb-4 italic uppercase tracking-tighter">{item.title}</h4>
                         <div className="flex gap-4 mt-auto">
                            <button onClick={() => startEdit(item)} className="flex-grow py-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                               <Edit3 size={16} /> Tahrirlash
                            </button>
                            <button onClick={() => handleDelete(item.id, activeTab === 'news' ? 'news' : activeTab === 'library' ? (activeTab === 'games' ? 'games' : 'library') : 'nature_reserves')} className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all">
                               <Trash2 size={20} />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const AdminTab = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-3 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all ${active ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-slate-50'}`}>
    {icon} <span className="hidden sm:inline">{label}</span>
  </button>
);

export default AdminPanel;
