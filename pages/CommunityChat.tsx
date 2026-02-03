
import React, { useState, useRef, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { ChatMessage, User } from '../types';
import { Send, Image as ImageIcon, Video, MoreVertical, Smile, CheckCheck, Camera, X, Loader2 } from 'lucide-react';

interface CommunityChatProps {
  user: User;
}

const CommunityChat: React.FC<CommunityChatProps> = ({ user }) => {
  // Fixed: Replaced any[] with ChatMessage[] for better type safety
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with Firestore
  useEffect(() => {
    const q = query(collection(db, "global_chat"), orderBy("timestamp", "asc"), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Cast documents to ChatMessage type
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
    <div className="flex flex-col h-[80vh] md:h-[85vh] bg-[#f8fafc] rounded-[60px] overflow-hidden shadow-3xl border border-slate-100 relative">
      {/* Header */}
      <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-slate-50 z-20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-emerald-100">EQ</div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tighter">Global Eko-Chat</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">A'zolar Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6 md:p-10 space-y-6 no-scrollbar bg-white/50">
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && <img src={msg.senderAvatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xl self-end" />}
                <div className={`relative p-1 rounded-[32px] shadow-sm ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-50'}`}>
                  {!isMe && <div className="px-5 pt-3 text-[10px] font-black uppercase text-emerald-500 mb-1">{msg.senderName}</div>}
                  {msg.type === 'image' && (
                    <div className="rounded-[28px] overflow-hidden m-1">
                      <img src={msg.mediaUrl} className="max-w-full max-h-[400px] object-cover" />
                    </div>
                  )}
                  <div className="px-5 py-3 pb-8">
                    <p className="text-sm md:text-base font-medium leading-relaxed">{msg.text}</p>
                    <div className={`absolute bottom-2 right-5 text-[9px] font-bold ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                      {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Hozir'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-6 border-t border-slate-50 flex items-center gap-4">
        <button onClick={() => fileInputRef.current?.click()} className="p-5 bg-slate-50 text-slate-400 rounded-3xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
          <Camera size={24} />
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        <div className="flex-grow relative">
          <input 
            type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendText()}
            placeholder="Xabar yozing..." className="w-full px-8 py-5 bg-slate-50 rounded-[32px] font-bold outline-none border-2 border-transparent focus:border-emerald-500/20 transition-all"
          />
        </div>
        <button onClick={handleSendText} disabled={loading || !inputText.trim()} className="p-5 bg-emerald-600 text-white rounded-3xl shadow-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all">
          {loading ? <Loader2 className="animate-spin" /> : <Send size={24} />}
        </button>
      </div>
    </div>
  );
};

export default CommunityChat;
