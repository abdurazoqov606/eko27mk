import React, { useState, useRef, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { ChatMessage, User } from '../types';
import { Send, Image as ImageIcon, Camera, X, Loader2, ShieldCheck, Sparkles, User as UserIcon, CheckCheck } from 'lucide-react';

interface CommunityChatProps {
  user: User;
}

const CommunityChat: React.FC<CommunityChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, "global_chat"), orderBy("timestamp", "asc"), limit(150));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage)));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = async () => {
    if (!inputText.trim() || loading) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "global_chat"), {
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        type: 'text',
        text: inputText,
        timestamp: serverTimestamp(),
      });
      setInputText('');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const mediaUrl = event.target?.result as string;
      try {
        await addDoc(collection(db, "global_chat"), {
          senderId: user.id,
          senderName: user.name,
          senderAvatar: user.avatar,
          type: 'image',
          mediaUrl: mediaUrl,
          text: 'Rasm yuklandi 📸',
          timestamp: serverTimestamp(),
        });
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-6xl mx-auto bg-white dark:bg-slate-950 rounded-[48px] md:rounded-[64px] overflow-hidden shadow-4xl border border-slate-100 dark:border-white/5 relative">
      {/* Chat Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/leaf.png")' }} />

      {/* Modern Header */}
      <div className="relative z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl px-8 py-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl rotate-3">
              EQ
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Eko-Hamjamiyat</h3>
            <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Jonli Muloqot
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Server holati</span>
              <span className="text-xs font-black text-emerald-600 italic">OPTIMAL v2.7</span>
           </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-6 md:p-12 space-y-8 no-scrollbar relative z-10 scroll-smooth">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === user.id;
          const isAres = msg.senderName === 'ARES';
          const prevMsg = messages[idx - 1];
          const isSameSender = prevMsg?.senderId === msg.senderId;

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar with improved design */}
                {!isMe && !isSameSender && (
                  <div className="self-end mb-1">
                    <img src={msg.senderAvatar} className={`w-14 h-14 rounded-2xl object-cover border-4 shadow-2xl transition-transform hover:scale-110 ${isAres ? 'border-emerald-500 shadow-emerald-500/30' : 'border-white dark:border-slate-800'}`} />
                  </div>
                )}
                {!isMe && isSameSender && <div className="w-14" />}

                {/* Message Bubble */}
                <div className={`relative flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && !isSameSender && (
                    <div className="flex items-center gap-2 mb-2 ml-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${isAres ? 'text-emerald-500' : 'text-slate-500'}`}>
                         {msg.senderName}
                       </span>
                       {isAres && (
                         <span className="bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                           <ShieldCheck size={10} /> OWNER
                         </span>
                       )}
                    </div>
                  )}

                  <div className={`group relative p-1 rounded-[32px] transition-all shadow-xl hover:shadow-2xl ${
                    isAres ? 'ares-message rounded-bl-none text-white' : 
                    isMe ? 'bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-br-none' : 
                    'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-white/5'
                  }`}>
                    {msg.type === 'image' && (
                      <div className="rounded-[28px] overflow-hidden m-1.5 shadow-inner">
                        <img src={msg.mediaUrl} className="max-w-full max-h-[500px] object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in" alt="Media" />
                      </div>
                    )}
                    
                    <div className="px-6 py-4 pb-8 relative">
                      {isAres && <Sparkles size={16} className="absolute top-3 right-4 text-amber-400 animate-pulse" />}
                      <p className={`text-base md:text-lg font-medium leading-relaxed ${isAres ? 'italic font-bold' : ''}`}>
                        {msg.text}
                      </p>
                      
                      {/* Time and Status */}
                      <div className={`absolute bottom-3 right-6 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${isMe || isAres ? 'text-white/60' : 'text-slate-400'}`}>
                        {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                        {isMe && <CheckCheck size={12} className="text-emerald-300" />}
                      </div>
                    </div>

                    {/* Chat Bubble Tails */}
                    {!isSameSender && (
                      <div className={`absolute bottom-0 w-6 h-6 ${
                        isMe ? '-right-2 text-emerald-800' : '-left-2 text-white dark:text-slate-900'
                      } ${isAres ? 'text-[#022c22]' : ''}`}>
                         {/* SVG Tail design can be added here for even more polish */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Modern Input Bar */}
      <div className="relative z-30 p-6 md:p-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-slate-100 dark:border-white/5">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="group p-5 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-3xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-all active:scale-90 shadow-sm"
          >
            <Camera size={26} className="group-hover:rotate-12 transition-transform" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          
          <div className="flex-grow relative group">
            <input 
              type="text" 
              value={inputText} 
              onChange={e => setInputText(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleSendText()}
              placeholder="Ekologik fikr yuboring..." 
              className="w-full px-10 py-6 bg-slate-100 dark:bg-white/5 dark:text-white rounded-[32px] font-black text-lg outline-none border-4 border-transparent focus:border-emerald-500/20 transition-all shadow-inner placeholder:text-slate-400 italic"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Enter - Yuborish</span>
            </div>
          </div>

          <button 
            onClick={handleSendText} 
            disabled={loading || !inputText.trim()} 
            className="p-6 bg-emerald-600 text-white rounded-[32px] shadow-3xl hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95 group"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={26} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;