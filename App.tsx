
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, doc, setDoc, deleteDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import News from './pages/News';
import Problems from './pages/Problems';
import Quiz from './pages/Quiz';
import EcoInfo from './pages/EcoInfo';
import RedBook from './pages/RedBook';
import NatureReserves from './pages/NatureReserves';
import VideoGuides from './pages/VideoGuides';
import NewsForum from './pages/NewsForum';
import CommunityChat from './pages/CommunityChat';
import Kids from './pages/Kids';
import Support from './pages/Support';
import AdminPanel from './pages/AdminPanel';
import EcoMarket from './pages/EcoMarket';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import AuthModal from './components/AuthModal';
import { AppSection, User, EcoArticle, GameItem } from './types';
import { MessageCircle, Menu, ShieldCheck } from 'lucide-react';

const SESSION_ID = Math.random().toString(36).substring(2, 15);

const safeStringify = (obj: any) => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    const cache = new Set();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) return;
        cache.add(value);
      }
      return value;
    });
  }
};

const ACCENT_MAP: Record<string, string> = {
  emerald: '#10b981',
  blue: '#3b82f6',
  indigo: '#6366f1',
  amber: '#f59e0b',
  rose: '#f43f5e'
};

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('eko27_dark_mode') === 'true');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('eko27_accent') || 'emerald');

  const [news, setNews] = useState<EcoArticle[]>([]);
  const [library, setLibrary] = useState<EcoArticle[]>([]);
  const [games, setGames] = useState<GameItem[]>([]);
  const [onlineCount, setOnlineCount] = useState(1);

  // Admin profilini boshqarish (ARES)
  useEffect(() => {
    if (isAdminAuthenticated) {
      const aresUser: User = {
        id: 'admin_ares_27',
        name: 'ARES',
        email: 'admin@eko27.uz',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ares&backgroundColor=b6e3f4,c0aede,d1d4f9',
        points: 999999,
        balance: 999999,
        rank: 'ADMIN / OWNER',
        level: 99,
        xp: 0,
        maxXp: 1000,
        achievements: [{ id: '1', name: 'Loyiha Muallifi', icon: '👑', date: '2024-01-01' }],
        joinedDate: '2024-01-01'
      };
      setUser(aresUser);
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    const marketQ = query(collection(db, "market_items"), orderBy("timestamp", "desc"), limit(1));
    let initialLoad = true;

    const unsubMarket = onSnapshot(marketQ, (snapshot) => {
      if (initialLoad) {
        initialLoad = false;
        return;
      }
      if (!snapshot.empty && !snapshot.metadata.hasPendingWrites) {
        const item = snapshot.docs[0].data();
        if (Notification.permission === "granted") {
          new Notification("EKO-BOZOR: Yangi e'lon!", {
            body: `${item.name} - ${item.price} UZS`,
            icon: item.image || "https://raw.githubusercontent.com/abdurazoqov606/Hyt/main/IMG_20260201_092843.png"
          });
        }
      }
    });

    return () => unsubMarket();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('eko27_dark_mode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    const colorCode = ACCENT_MAP[accentColor] || '#10b981';
    document.documentElement.style.setProperty('--accent-primary', colorCode);
    localStorage.setItem('eko27_accent', accentColor);
  }, [accentColor]);

  // Real-time Presence System
  useEffect(() => {
    const presenceRef = doc(db, "presence", SESSION_ID);
    
    const updatePresence = async () => {
      try { 
        await setDoc(presenceRef, { 
          lastSeen: serverTimestamp(), 
          active: true 
        }, { merge: true }); 
      } catch (e) {}
    };

    // Tab yopilganda o'chirish
    const handleUnload = () => {
      const data = JSON.stringify({ active: false });
      // Navigator.sendBeacon ishlatib bo'lmaydi chunki u Firestore document delete qilolmaydi, 
      // lekin bizda Firestore session o'zi o'chadi yoki cleanup trigger bo'ladi.
      deleteDoc(presenceRef).catch(() => {});
    };

    window.addEventListener('beforeunload', handleUnload);

    const interval = setInterval(updatePresence, 20000);
    updatePresence();

    const unsubPresence = onSnapshot(collection(db, "presence"), (snapshot) => {
      const now = Date.now();
      const activeUsers = snapshot.docs.filter(doc => {
        const data = doc.data();
        if (!data.lastSeen) return false;
        const lastSeenTime = data.lastSeen.toMillis ? data.lastSeen.toMillis() : now;
        // 60 soniyadan ko'p vaqt o'tgan bo'lsa online hisoblanmaydi
        return (now - lastSeenTime) < 60000;
      });
      // Minimal 1 kishi online (o'zi)
      setOnlineCount(Math.max(1, activeUsers.length));
    });

    onSnapshot(query(collection(db, "news"), orderBy("timestamp", "desc")), (s) => setNews(s.docs.map(d => ({ id: d.id, ...d.data() } as EcoArticle))));
    onSnapshot(query(collection(db, "library"), orderBy("timestamp", "desc")), (s) => setLibrary(s.docs.map(d => ({ id: d.id, ...d.data() } as EcoArticle))));
    onSnapshot(query(collection(db, "games"), orderBy("timestamp", "desc")), (s) => setGames(s.docs.map(d => ({ id: d.id, ...d.data() } as GameItem))));

    return () => {
      clearInterval(interval);
      unsubPresence();
      window.removeEventListener('beforeunload', handleUnload);
      deleteDoc(presenceRef).catch(() => {});
    };
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('eko27_user');
    if (savedUser && !isAdminAuthenticated) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { localStorage.removeItem('eko27_user'); }
    }
  }, [isAdminAuthenticated]);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('eko27_user', safeStringify(userData));
    setShowAuthModal(false);
  };

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('eko27_user', safeStringify(updatedUser));
  };

  const renderSection = () => {
    switch (activeSection) {
      case AppSection.HOME: return <Home onNavigate={setActiveSection} />;
      case AppSection.MARKET: return <EcoMarket user={user} onLogin={() => setShowAuthModal(true)} />;
      case AppSection.NEWS: return <News articles={news} user={user} />;
      case AppSection.PROBLEMS: return <Problems />;
      case AppSection.QUIZ: return <Quiz />;
      case AppSection.NEWS_FORUM: return <NewsForum user={user} onLogin={() => setShowAuthModal(true)} />;
      case AppSection.PROFILE: return <Profile user={user} onLogout={() => { setUser(null); localStorage.removeItem('eko27_user'); setIsAdminAuthenticated(false); }} onNavigate={setActiveSection} onUpdate={handleProfileUpdate} />;
      case AppSection.COMMUNITY_CHAT: 
        if (!user) return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl transition-colors">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce"><MessageCircle size={40} /></div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Muloqotga Qo'shiling</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm text-sm">Eko-hamjamiyat bilan fikr almashish uchun profil yarating.</p>
            <button onClick={() => setShowAuthModal(true)} className="px-10 py-4 bg-emerald-600 text-white rounded-[24px] font-black text-lg shadow-xl hover:scale-105 transition-all">Kirish</button>
          </div>
        );
        return <CommunityChat user={user} />;
      case AppSection.ADMIN_PANEL: return <AdminPanel isAuthenticated={isAdminAuthenticated} onAuthenticate={() => setIsAdminAuthenticated(true)} />;
      case AppSection.ECO_INFO: return <EcoInfo articles={library} />;
      case AppSection.RED_BOOK: return <RedBook />;
      case AppSection.RESERVES: return <NatureReserves />;
      case AppSection.VIDEO_GUIDES: return <VideoGuides />;
      case AppSection.GAMES: return <Kids games={games} />;
      case AppSection.SUPPORT: return <Support />;
      case AppSection.SETTINGS: return <Settings darkMode={darkMode} setDarkMode={setDarkMode} accentColor={accentColor} setAccentColor={setAccentColor} user={user} onUpdateProfile={handleProfileUpdate} onLogin={() => setShowAuthModal(true)} />;
      default: return <Home onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden font-['Plus_Jakarta_Sans'] transition-colors ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <style>{`
        :root { --accent-primary: ${ACCENT_MAP[accentColor] || '#10b981'}; }
        .bg-emerald-600, .bg-emerald-500 { background-color: var(--accent-primary) !important; }
        .text-emerald-600, .text-emerald-500 { color: var(--accent-primary) !important; }
        .border-emerald-600, .border-emerald-500 { border-color: var(--accent-primary) !important; }
        .shadow-emerald-600\/20 { --tw-shadow-color: var(--accent-primary); }
        
        /* ARES Premium Message Glow */
        @keyframes aresGlow {
          0% { box-shadow: 0 0 5px #10b981, 0 0 10px #10b981; }
          50% { box-shadow: 0 0 20px #10b981, 0 0 30px #f59e0b; }
          100% { box-shadow: 0 0 5px #10b981, 0 0 10px #10b981; }
        }
        .ares-message {
          animation: aresGlow 3s infinite;
          background: linear-gradient(135deg, #064e3b 0%, #022c22 100%) !important;
          border: 2px solid #10b981 !important;
        }
      `}</style>

      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-[60] p-3.5 bg-emerald-600 text-white rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-white/20 dark:border-slate-800/50"
      >
        <Menu size={20} />
      </button>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-[280px] h-full sidebar-animate shadow-[20px_0_60px_rgba(0,0,0,0.5)]">
             <Sidebar 
                activeSection={activeSection} 
                onNavigate={(s) => { setActiveSection(s); setIsSidebarOpen(false); }} 
                user={user} 
                onLogin={() => setShowAuthModal(true)}
                onlineCount={onlineCount}
                onClose={() => setIsSidebarOpen(false)}
             />
          </div>
        </div>
      )}
      
      <main className="flex-grow overflow-y-auto no-scrollbar relative">
        <div className="p-4 md:p-8 lg:p-16">
          {renderSection()}
        </div>
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
};

export default App;
