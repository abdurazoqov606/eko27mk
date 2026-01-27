
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import EcoLife from './pages/EcoLife';
import News from './pages/News';
import Problems from './pages/Problems';
import Quiz from './pages/Quiz';
import EcoInfo from './pages/EcoInfo';
import NewsForum from './pages/NewsForum';
import CommunityChat from './pages/CommunityChat';
import Kids from './pages/Kids';
import EcoMarket from './pages/EcoMarket';
import EcoMap from './pages/EcoMap';
import Support from './pages/Support';
import AdminPanel from './pages/AdminPanel';
import AuthModal from './components/AuthModal';
import { AppSection, User, EcoArticle } from './types';
import { ECO_ARTICLES as INITIAL_ARTICLES } from './constants';
import { Send, MessageCircle, X, Sparkles, Leaf } from 'lucide-react';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [onlineCount, setOnlineCount] = useState(542);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [news, setNews] = useState<EcoArticle[]>(INITIAL_ARTICLES);
  const [siteConfig, setSiteConfig] = useState({
    heroTitle: "EKO 27",
    heroDesc: "Kelajakni bugun, 27-maktab o'quvchilari bilan birga quring. Har bir qadam tabiat uchun muhim."
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [messageCount, setMessageCount] = useState(0);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const userText = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setChatMessage('');

    if (messageCount === 0) {
      // 1-xabar: Loyiha va muallif haqida
      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          role: 'bot', 
          text: "Salom! Men EKO 27 loyihasining yordamchisiman. Meni Abdurazoqov Abbos yaratgan. Sizga qanday yordam bera olaman?" 
        }]);
        setMessageCount(1);
      }, 600);
    } else {
      // 2-xabar: ChatGPT redirect
      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          role: 'bot', 
          text: "Batafsil ma'lumot olishingiz uchun sizni ChatGPT xizmatiga yo'naltirmoqdaman..." 
        }]);
        setTimeout(() => {
          window.open('https://chatgpt.com', '_blank');
        }, 1200);
      }, 600);
    }
  };

  const addNews = (article: EcoArticle) => setNews([article, ...news]);
  const deleteNews = (id: string) => setNews(news.filter(n => n.id !== id));

  const renderSection = () => {
    switch (activeSection) {
      case AppSection.HOME: return <Home onNavigate={setActiveSection} />;
      case AppSection.ECO_LIFE: return <EcoLife />;
      case AppSection.NEWS: return <News articles={news} />;
      case AppSection.PROBLEMS: return <Problems />;
      case AppSection.QUIZ: return <Quiz />;
      case AppSection.NEWS_FORUM: return <NewsForum articles={news} />;
      case AppSection.COMMUNITY_CHAT: return <CommunityChat user={user} onLoginRequest={() => setShowAuthModal(true)} />;
      case AppSection.ADMIN_PANEL: 
      case AppSection.PROFILE:
        return (
          <AdminPanel 
            isAuthenticated={isAdminAuthenticated} 
            onAuthenticate={() => setIsAdminAuthenticated(true)}
            news={news}
            onAddNews={addNews}
            onDeleteNews={deleteNews}
            siteConfig={siteConfig}
            onUpdateConfig={setSiteConfig}
          />
        );
      case AppSection.ECO_INFO: return <EcoInfo articles={news} />;
      case AppSection.GAMES: return <Kids />;
      case AppSection.MARKET: return <EcoMarket user={user} />;
      case AppSection.MAP: return <EcoMap />;
      case AppSection.SUPPORT: return <Support />;
      default: return <Home onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Plus_Jakarta_Sans']">
      <Sidebar 
        activeSection={activeSection} 
        onNavigate={setActiveSection} 
        user={user} 
        onLogin={() => setShowAuthModal(true)}
        onlineCount={onlineCount}
      />
      
      <main className="flex-grow overflow-y-auto relative no-scrollbar pb-24 lg:pb-0">
        <div className="p-4 md:p-8">
          {renderSection()}
        </div>
      </main>

      <BottomNav activeSection={activeSection} onNavigate={setActiveSection} />

      {/* Faqat matnli chat */}
      <div className="fixed bottom-24 lg:bottom-8 right-6 lg:right-8 z-[100] flex flex-col gap-4">
        {isChatOpen && (
          <div className="bg-white rounded-[40px] shadow-2xl border border-emerald-100 w-[380px] max-w-[90vw] mb-4 animate-in slide-in-from-bottom-5 flex flex-col h-[500px] overflow-hidden">
             <div className="p-6 bg-emerald-600 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <span className="font-black text-[10px] block opacity-70 uppercase tracking-widest">A. Abbos tomonidan</span>
                    <span className="font-black text-sm uppercase tracking-widest">Eko-Yordamchi</span>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all relative z-10">
                  <X size={20} />
                </button>
             </div>
             <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50 no-scrollbar">
                {chatHistory.length === 0 && (
                   <div className="text-center py-10 opacity-50">
                      <Leaf className="mx-auto mb-4 text-emerald-500" size={40} />
                      <p className="text-xs font-bold uppercase tracking-widest">Savolingizni yozing</p>
                   </div>
                )}
                {chatHistory.map((chat, i) => (
                  <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-medium shadow-sm leading-relaxed ${
                      chat.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-br-none' 
                        : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                    }`}>
                      {chat.text}
                    </div>
                  </div>
                ))}
             </div>
             <div className="p-4 bg-white border-t border-slate-50 flex gap-2">
                <input 
                  value={chatMessage} 
                  onChange={e => setChatMessage(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                  className="flex-grow bg-slate-50 rounded-2xl px-5 py-4 text-xs outline-none font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all" 
                  placeholder="Xabar yozing..." 
                />
                <button 
                  onClick={handleSendMessage} 
                  className="p-4 bg-emerald-600 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <Send size={18} />
                </button>
             </div>
          </div>
        )}

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className="w-16 h-16 bg-emerald-600 text-white rounded-[24px] shadow-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        >
          {isChatOpen ? <X size={28} /> : <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />}
        </button>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onLoginSuccess={(u) => {setUser(u); setShowAuthModal(false);}} />
      )}
    </div>
  );
};

export default App;
