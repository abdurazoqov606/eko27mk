
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc, serverTimestamp, increment, addDoc } from 'firebase/firestore';
import { ContestSubmission, ContestConfig, User } from '../types';
import { 
  Trophy, Rocket, Award, Camera, X, Heart, 
  Search, Phone, User as UserIcon, Send, Loader2, Sparkles, Medal, ShieldAlert 
} from 'lucide-react';

interface NewsForumProps {
  user: User | null;
  onLogin: () => void;
}

const NewsForum: React.FC<NewsForumProps> = ({ user, onLogin }) => {
  const [submissions, setSubmissions] = useState<ContestSubmission[]>([]);
  const [config, setConfig] = useState<ContestConfig>({
    title: '27',
    description: 'Hududni tozalang, "27" yozuvi bilan rasmga tushing va haqiqiy pul mukofotlarini yuting!',
    prizes: [
      { rank: "1-o'rin", amount: "2 000 000", bonus: "Oltin mukofoti" },
      { rank: "2-o'rin", amount: "700 000", bonus: "Kumush mukofoti" },
      { rank: "3-o'rin", amount: "500 000", bonus: "Bronza mukofoti" }
    ]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ fullName: '', phone: '' });
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('eko27_voted_ids') || '[]');
    setLikedPosts(savedLikes);

    const qSub = query(collection(db, "contest_submissions"), orderBy("likes", "desc"));
    const unsubSub = onSnapshot(qSub, (snapshot) => {
      setSubmissions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ContestSubmission)));
    });

    const unsubConfig = onSnapshot(doc(db, "settings", "contest_config"), (d) => {
      if (d.exists()) setConfig(d.data() as ContestConfig);
    });

    return () => { unsubSub(); unsubConfig(); };
  }, []);

  const handleLike = async (id: string) => {
    // Aytilganidek: Ovoz berish uchun profil so'raladi
    if (!user) {
      onLogin();
      return;
    }

    const currentLikes = JSON.parse(localStorage.getItem('eko27_voted_ids') || '[]');
    if (currentLikes.includes(id) || likedPosts.includes(id)) {
      alert("Siz ushbu ishtirokchiga allaqachon ovoz bergansiz!");
      return;
    }

    try {
      const docRef = doc(db, "contest_submissions", id);
      await updateDoc(docRef, { likes: increment(1) });
      const updatedLikes = [...currentLikes, id];
      setLikedPosts(updatedLikes);
      localStorage.setItem('eko27_voted_ids', JSON.stringify(updatedLikes));
    } catch (err) { 
      alert("Xatolik yuz berdi.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) { alert("Rasm hajmi juda katta! 800KB dan kichik rasm yuklang."); return; }
      const reader = new FileReader();
      reader.onload = (event) => setPreviewImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { onLogin(); return; }
    if (!previewImage || isSubmitting) return;
    
    const alreadySubmitted = localStorage.getItem('eko27_contest_submitted');
    if (alreadySubmitted) {
      alert("Siz allaqachon ushbu tanlovga ariza topshirgansiz!");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "contest_submissions"), {
        fullName: formData.fullName,
        phone: formData.phone,
        imageUrl: previewImage,
        likes: 0,
        timestamp: serverTimestamp()
      });
      localStorage.setItem('eko27_contest_submitted', 'true');
      setShowJoinModal(false);
      setFormData({ fullName: '', phone: '' });
      setPreviewImage(null);
      alert("Arizangiz qabul qilindi! Omad tilaymiz.");
    } catch (err) { alert("Xatolik yuz berdi. Qayta urinib ko'ring."); }
    setIsSubmitting(false);
  };

  const filteredSubmissions = submissions.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 shadow-2xl">
          <Rocket size={16} className="text-emerald-500" /> TANLOV 2026
        </div>
        <h2 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter mb-6 italic uppercase leading-none">
          TOZA HUDUD <span className="text-emerald-600">"{config.title}"</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-xl italic max-w-2xl leading-relaxed">
          {config.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {config.prizes.map((p, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 shadow-xl flex items-center gap-6 group hover:scale-105 transition-transform">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg ${
              i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : 'bg-orange-600'
            }`}>
              {i === 0 ? <Trophy size={32} /> : i === 1 ? <Medal size={32} /> : <Award size={32} />}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{p.rank}</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">{p.amount} <span className="text-xs">sum</span></div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase mt-1 tracking-wider">{p.bonus}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Ishtirokchilarni qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-sm font-bold outline-none dark:text-white" />
        </div>
        <button 
          onClick={() => user ? setShowJoinModal(true) : onLogin()} 
          className="w-full md:w-auto px-12 py-5 bg-emerald-600 text-white rounded-[32px] font-black text-lg shadow-3xl flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          Ishtirok etish <Camera size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredSubmissions.map((sub, idx) => {
          const hasVoted = likedPosts.includes(sub.id);
          return (
            <div key={sub.id} className="bg-white dark:bg-slate-900 rounded-[56px] overflow-hidden shadow-2xl border border-slate-50 dark:border-white/5 flex flex-col group">
              <div className="h-80 relative overflow-hidden bg-slate-100">
                <img src={sub.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[2000ms]" />
                <div className="absolute top-6 left-6 px-5 py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-black">
                  #{idx + 1} REYTINGDA
                </div>
              </div>
              <div className="p-10 flex flex-col flex-grow">
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2 truncate italic uppercase">{sub.fullName}</h4>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-emerald-600 leading-none">{sub.likes}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">OVOZLAR</span>
                  </div>
                  <button 
                    onClick={() => handleLike(sub.id)}
                    className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${
                      hasVoted ? 'bg-rose-500 text-white shadow-lg' : 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white'
                    }`}
                  >
                    <Heart size={32} fill={hasVoted ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showJoinModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setShowJoinModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[64px] shadow-3xl p-10 md:p-14 border-t-[12px] border-emerald-600">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Ishtirokchi Arizasi</h3>
              <button onClick={() => setShowJoinModal(false)} className="p-3 bg-slate-100 dark:bg-white/10 rounded-full dark:text-white"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block ml-2 mb-2">To'liq ism (F.I.SH)</label>
                    <input required type="text" placeholder="Ismingiz..." value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl font-bold outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block ml-2 mb-2">Telefon raqamingiz</label>
                    <input required type="tel" placeholder="+998" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl font-bold outline-none dark:text-white" />
                  </div>
                </div>
                <div onClick={() => fileInputRef.current?.click()} className={`border-4 border-dashed rounded-[40px] flex flex-col items-center justify-center cursor-pointer transition-all h-full min-h-[220px] ${previewImage ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5'}`}>
                  {previewImage ? <img src={previewImage} className="w-full h-full object-cover rounded-[36px]" /> : <div className="text-center p-6"><Camera className="mx-auto text-emerald-500 mb-3" size={40} /><p className="text-[10px] font-black uppercase text-slate-400">Rasm (Isbot) yuklang</p></div>}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
              </div>
              <button disabled={isSubmitting || !previewImage} className="w-full py-6 bg-emerald-600 text-white rounded-[32px] font-black text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <>Arizani Yuborish <Send size={24} /></>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsForum;
