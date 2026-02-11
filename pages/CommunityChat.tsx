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
    <div className="flex flex-col h-[82vh] md:h-[calc(100vh-140px)] max-w-5xl mx-auto bg-white dark:bg-slate-950 rounded-[32px] md:rounded-[64px] overflow-hidden shadow-4xl border border-slate-100 dark:border-white/5 relative">
      {/* Chat Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/leaf.png")' }} />

      {/* Responsive Header */}
      <div className="relative z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl px-5 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="relative">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-2xl shadow-xl rotate-3">
              EQ
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-5 md:h-5 bg-emerald-500 border-2 md:border-4 border-white dark:border-slate-900 rounded-full animate-pulse shadow-lg" />
          </div>
          <div>
            <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Eko-Hamjamiyat</h3>
            <p className="text-[8px] md:text-[10px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Jonli
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Server</span>
              <span className="text-xs font-black text-emerald-600 italic">OPTIMAL v2.7</span>
           </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 md:p-12 space-y-5 md:space-y-8 no-scrollbar relative z-10 scroll-smooth">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === user.id;
          const isAres = msg.senderName === 'ARES';
          const prevMsg = messages[idx - 1];
          const isSameSender = prevMsg?.senderId === msg.senderId;

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex gap-2 md:gap-4 max-w-[92%] md:max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                {!isMe && !isSameSender && (
                  <div className="self-end mb-1">
                    <img src={msg.senderAvatar} className={`w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl object-cover border-2 md:border-4 shadow-xl ${isAres ? 'border-emerald-500' : 'border-white dark:border-slate-800'}`} />
                  </div>
                )}
                {!isMe && isSameSender && <div className="w-8 md:w-14" />}

                {/* Message Bubble */}
                <div className={`relative flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && !isSameSender && (
                    <div className="flex items-center gap-2 mb-1 md:mb-2 ml-1 md:ml-2">
                       <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${isAres ? 'text-emerald-500' : 'text-slate-500'}`}>
                         {msg.senderName}
                       </span>
                       {isAres && (
                         <span className="bg-emerald-600 text-white text-[7px] md:text-[8px] font-black px-1.5 md:py-0.5 rounded-full flex items-center gap-1">
                           <ShieldCheck size={8} /> ADMIN
                         </span>
                       )}
                    </div>
                  )}

                  <div className={`group relative p-0.5 rounded-[20px] md:rounded-[32px] transition-all shadow-md md:shadow-xl ${
                    isAres ? 'ares-message rounded-bl-none text-white' : 
                    isMe ? 'bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-br-none' : 
                    'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-white/5'
                  }`}>
                    {msg.type === 'image' && (
                      <div className="rounded-[18px] md:rounded-[28px] overflow-hidden m-1 shadow-inner">
                        <img src={msg.mediaUrl} className="max-w-full max-h-[300px] md:max-h-[500px] object-cover cursor-zoom-in" alt="Media" />
                      </div>
                    )}
                    
                    <div className="px-4 md:px-6 py-2.5 md:py-4 pb-6 md:pb-8 relative">
                      {isAres && <Sparkles size={12} className="absolute top-2 right-3 text-amber-400" />}
                      <p className={`text-sm md:text-lg font-medium leading-relaxed ${isAres ? 'italic font-bold' : ''}`}>
                        {msg.text}
                      </p>
                      
                      {/* Time and Status */}
                      <div className={`absolute bottom-1.5 md:bottom-3 right-4 md:right-6 flex items-center gap-1 text-[7px] md:text-[9px] font-black uppercase tracking-widest ${isMe || isAres ? 'text-white/60' : 'text-slate-400'}`}>
                        {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                        {isMe && <CheckCheck size={10} className="text-emerald-300" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Compact Responsive Input Bar */}
      <div className="relative z-30 p-3 md:p-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-slate-100 dark:border-white/5">
        <div className="max-w-4xl mx-auto flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="p-3 md:p-5 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-2xl md:rounded-3xl hover:text-emerald-600 transition-all active:scale-90"
          >
            <Camera size={20} md:size={26} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          
          <div className="flex-grow relative">
            <input 
              type="text" 
              value={inputText} 
              onChange={e => setInputText(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleSendText()}
              placeholder="Fikr yuboring..." 
              className="w-full px-5 md:px-10 py-3 md:py-6 bg-slate-100 dark:bg-white/5 dark:text-white rounded-[20px] md:rounded-[32px] font-bold md:font-black text-sm md:text-lg outline-none border-2 border-transparent focus:border-emerald-500/20 transition-all"
            />
          </div>

          <button 
            onClick={handleSendText} 
            disabled={loading || !inputText.trim()} 
            className="p-3 md:p-6 bg-emerald-600 text-white rounded-[20px] md:rounded-[32px] shadow-xl hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={20} md:size={26} /> : <Send size={20} md:size={26} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;