
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { Newspaper, Calendar, ArrowRight, Share2, Award, X, MessageSquare, ExternalLink, Send, Loader2, User as UserIcon } from 'lucide-react';
import { EcoArticle, NewsComment, User } from '../types';

interface NewsProps {
  articles: EcoArticle[];
  user?: User | null;
}

const News: React.FC<NewsProps> = ({ articles, user }) => {
  const [selectedArticle, setSelectedArticle] = useState<EcoArticle | null>(null);
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Real-time comments listener
  useEffect(() => {
    if (!selectedArticle) {
      setComments([]);
      return;
    }

    // orderBy olib tashlandi (Index xatosini oldini olish uchun)
    const q = query(
      collection(db, "news_comments"),
      where("newsId", "==", selectedArticle.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as NewsComment));
      
      // Frontendda vaqt bo'yicha saralash
      fetchedComments.sort((a, b) => {
        const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : Date.now();
        const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : Date.now();
        return timeA - timeB;
      });

      setComments(fetchedComments);
    }, (error) => {
      console.error("Firestore error:", error);
    });

    return () => unsubscribe();
  }, [selectedArticle]);

  const handleShare = (article: EcoArticle) => {
    const text = encodeURIComponent(`EKO 27 yangiligi: ${article.title}\n\nBatafsil: https://eko27mk.vercel.app/`);
    window.open(`https://t.me/share/url?url=https://eko27mk.vercel.app/&text=${text}`, '_blank');
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedArticle || isSending) return;

    setIsSending(true);
    try {
      const userName = user ? user.name : "Mehmon";
      const userAvatar = user ? user.avatar : `https://api.dicebear.com/7.x/adventurer/svg?seed=Guest${Math.floor(Math.random() * 1000)}&backgroundColor=b6e3f4`;

      await addDoc(collection(db, "news_comments"), {
        newsId: selectedArticle.id,
        userName,
        userAvatar,
        text: commentText.trim(),
        timestamp: serverTimestamp()
      });
      setCommentText('');
    } catch (err) {
      console.error("Comment error:", err);
      alert("Xatolik yuz berdi.");
    } finally {
      setIsSending(false);
    }
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

      {/* Batafsil Modal + Comments */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setSelectedArticle(null)} />
          <div className="relative bg-white w-full max-w-4xl max-h-full overflow-y-auto no-scrollbar rounded-[64px] shadow-3xl animate-in zoom-in">
             <button onClick={() => setSelectedArticle(null)} className="absolute top-8 right-8 z-[160] p-4 bg-white/80 backdrop-blur rounded-full shadow-xl hover:bg-rose-500 hover:text-white transition-all"><X /></button>
             
             <div className="h-[400px] w-full relative">
                <img src={selectedArticle.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
             </div>
             
             <div className="p-10 md:p-20 -mt-20 relative z-10 bg-white rounded-t-[60px]">
                <div className="flex items-center gap-4 mb-8">
                  <span className="px-5 py-2 bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-widest">{selectedArticle.category}</span>
                  <span className="text-slate-400 font-bold flex items-center gap-2"><Calendar size={18} /> {selectedArticle.date}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 tracking-tighter italic leading-none">{selectedArticle.title}</h2>
                <div className="prose prose-xl max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap mb-20">
                   {selectedArticle.content || selectedArticle.excerpt}
                </div>
                
                {selectedArticle.link && (
                  <a href={selectedArticle.link} target="_blank" className="mb-20 inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-emerald-600 transition-all">
                    Tashqi manba <ExternalLink size={18} />
                  </a>
                )}

                {/* REAL-TIME COMMENTS SECTION */}
                <div className="pt-20 border-t border-slate-100">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><MessageSquare size={24} /></div>
                    <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">Fikrlar ({comments.length})</h3>
                  </div>

                  {/* Comment Form */}
                  <form onSubmit={handlePostComment} className="mb-12 flex gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl shrink-0 overflow-hidden">
                      <img 
                        src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=Me&backgroundColor=b6e3f4`} 
                        className="w-full h-full object-cover" 
                        alt="Avatar"
                      />
                    </div>
                    <div className="flex-grow relative">
                      <input 
                        type="text" 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Fikringizni yozing..." 
                        className="w-full px-8 py-5 bg-slate-50 rounded-[28px] font-bold outline-none border-2 border-transparent focus:border-emerald-500/20 transition-all"
                      />
                      <button 
                        type="submit" 
                        disabled={!commentText.trim() || isSending}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-emerald-600 text-white rounded-2xl shadow-lg hover:bg-emerald-700 disabled:opacity-50 transition-all"
                      >
                        {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-8">
                    {comments.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Birinchi bo'lib fikr qoldiring!</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex gap-6 animate-in slide-in-from-bottom-2">
                          <img src={comment.userAvatar} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-lg shrink-0" alt="" />
                          <div className="bg-slate-50 p-6 rounded-[32px] rounded-tl-none flex-grow">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-black text-emerald-600 uppercase text-[10px] tracking-widest">{comment.userName}</span>
                              <span className="text-[10px] font-bold text-slate-400">
                                {comment.timestamp?.toDate ? comment.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Hozir'}
                              </span>
                            </div>
                            <p className="text-slate-700 font-medium leading-relaxed italic">{comment.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
