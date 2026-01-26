
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, User } from '../types';
import { Send, Image as ImageIcon, Video, MoreVertical, Smile, CheckCheck, Camera, Paperclip, X } from 'lucide-react';

interface CommunityChatProps {
  user: User | null;
  onLoginRequest: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    senderId: 'other1',
    senderName: 'Dilshod Erkinov',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dilshod',
    type: 'text',
    text: 'Hammaga salom! Bugun 27-maktab hovlisiga yangi ko‘chatlar keldi. Kim yordamga kela oladi? 🌿',
    timestamp: '14:20',
    isMe: false
  },
  {
    id: '2',
    senderId: 'other2',
    senderName: 'Lola Karimboyeva',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lola',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000',
    text: 'Men tayyorman! Mana asboblarim ham shay 😊',
    timestamp: '14:22',
    isMe: false
  }
];

const CommunityChat: React.FC<CommunityChatProps> = ({ user, onLoginRequest }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'video' | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendText = () => {
    if (!user) {
      onLoginRequest();
      return;
    }
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      type: 'text',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const mediaUrl = event.target?.result as string;
      const type = file.type.startsWith('video') ? 'video' : 'image';

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        type: type as any,
        mediaUrl: mediaUrl,
        text: type === 'image' ? 'Rasm yuklandi 📸' : 'Video yuklandi 🎥',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };

      setMessages([...messages, newMessage]);
    };
    reader.readAsDataURL(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileSelect = (type: 'image' | 'video') => {
    if (!user) {
      onLoginRequest();
      return;
    }
    setSelectedFileType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : 'video/*';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="pt-20 flex flex-col h-[100dvh] bg-[#e5ddd5] relative overflow-hidden">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Chat Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]" />

      {/* Chat Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black shadow-md shrink-0">
            EQ
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-slate-900 leading-none truncate text-sm md:text-base">Eco-Channel</h3>
            <span className="text-[9px] md:text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mt-1">524 a'zo • onlayn</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 text-slate-400">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-grow overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 relative z-10 no-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-200`}
          >
            <div className={`flex gap-2 max-w-[90%] md:max-w-[70%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              {!msg.isMe && (
                <img src={msg.senderAvatar} className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-cover border-2 border-white shadow-sm self-end mb-1 shrink-0" alt={msg.senderName} />
              )}
              
              <div className={`relative p-1 rounded-2xl md:rounded-[24px] shadow-sm ${
                msg.isMe 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 rounded-bl-none'
              }`}>
                {!msg.isMe && (
                  <div className="px-3 pt-1 text-[9px] font-black uppercase text-emerald-500 mb-0.5">{msg.senderName}</div>
                )}
                
                {msg.type === 'image' && (
                  <div className="rounded-xl md:rounded-[20px] overflow-hidden mb-1">
                    <img src={msg.mediaUrl} className="w-full h-auto object-cover max-h-[50vh] min-w-[150px]" alt="Shared" />
                  </div>
                )}

                {msg.type === 'video' && (
                  <div className="rounded-xl md:rounded-[20px] overflow-hidden mb-1 bg-black">
                    <video controls className="w-full h-auto max-h-[50vh] min-w-[150px]">
                      <source src={msg.mediaUrl} />
                    </video>
                  </div>
                )}

                <div className="px-3 py-1.5 pb-5">
                  {msg.text && <p className="text-xs md:text-sm font-medium leading-relaxed">{msg.text}</p>}
                  <div className={`absolute bottom-1 right-3 flex items-center gap-1 text-[8px] md:text-[9px] font-bold ${msg.isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {msg.timestamp}
                    {msg.isMe && <CheckCheck size={11} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 md:px-6 md:py-4 border-t border-slate-200 z-20 flex items-center gap-2 md:gap-4 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <div className="flex gap-1 md:gap-2">
          <button 
            onClick={() => triggerFileSelect('image')}
            className="p-2.5 md:p-3 bg-slate-50 text-slate-400 rounded-xl md:rounded-2xl hover:text-emerald-600 hover:bg-emerald-50 transition-all shrink-0"
            title="Galereyadan rasm tanlash"
          >
            <Camera size={20} className="md:w-[22px] md:h-[22px]" />
          </button>
          <button 
            onClick={() => triggerFileSelect('video')}
            className="p-2.5 md:p-3 bg-slate-50 text-slate-400 rounded-xl md:rounded-2xl hover:text-emerald-600 hover:bg-emerald-50 transition-all shrink-0"
            title="Galereyadan video tanlash"
          >
            <Video size={20} className="md:w-[22px] md:h-[22px]" />
          </button>
        </div>

        <div className="flex-grow relative min-w-0">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            placeholder="Xabar..."
            className="w-full pl-4 pr-10 py-3 md:py-4 bg-slate-100 rounded-xl md:rounded-[24px] border-none outline-none font-medium text-slate-700 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors">
            <Smile size={20} />
          </button>
        </div>

        <button 
          onClick={handleSendText}
          disabled={!inputText.trim()}
          className={`w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-[24px] flex items-center justify-center transition-all shrink-0 shadow-lg ${
            inputText.trim() 
            ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 active:scale-95' 
            : 'bg-slate-100 text-slate-300 shadow-none'
          }`}
        >
          <Send size={20} className="md:w-[22px] md:h-[22px]" />
        </button>
      </div>

      {/* Date Sticky Header */}
      <div className="absolute top-[88px] left-1/2 -translate-x-1/2 px-3 py-1 bg-white/40 backdrop-blur-md rounded-full border border-white/40 text-[8px] font-black uppercase text-slate-500 tracking-widest z-0 pointer-events-none">
        {new Date().toLocaleDateString('uz-UZ', { month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
};

export default CommunityChat;
