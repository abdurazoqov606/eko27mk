
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Video as VideoIcon, Play, X, AlertCircle, ExternalLink } from 'lucide-react';
import { EcoVideo } from '../types';

const VideoGuides: React.FC = () => {
  const [videos, setVideos] = useState<EcoVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<EcoVideo | null>(null);

  useEffect(() => {
    const unsubVideos = onSnapshot(query(collection(db, "video_guides"), orderBy("timestamp", "desc")), (s) => {
      setVideos(s.docs.map(d => ({ id: d.id, ...d.data() } as EcoVideo)));
    });
    return () => unsubVideos();
  }, []);

  // YouTube ID-sini aniq ajratib olish (Qat'iy 11 belgili format)
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]{11}).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getEmbedUrl = (url: string) => {
    const videoId = getYouTubeId(url);
    if (!videoId) return "";
    const origin = window.location.origin;
    // enablejsapi va origin parametrlari mobil brauzerlardagi xatoliklarni oldini oladi
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1&origin=${origin}`;
  };

  const handleOpenInApp = (url: string) => {
    const videoId = getYouTubeId(url);
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  return (
    <div className="pt-4 pb-20 animate-fade-in px-4 md:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-[28px] shadow-lg">
            <VideoIcon size={32} />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">EKO <span className="text-blue-600">Video Qo'llanmalar</span></h2>
            <p className="text-slate-500 font-medium mt-1 italic">Tabiatni asrash bo'yicha professional darsliklar.</p>
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[56px] p-20 text-center border-2 border-dashed border-slate-100 dark:border-white/5">
             <VideoIcon size={64} className="mx-auto text-slate-100 mb-6" />
             <p className="text-slate-400 font-black uppercase tracking-widest italic">Hozircha videolar mavjud emas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {videos.map((video) => {
               const videoId = getYouTubeId(video.videoUrl);
               return (
                 <div key={video.id} className="bg-slate-900 rounded-[48px] overflow-hidden shadow-3xl border border-white/5 flex flex-col group relative">
                    <div className="aspect-video bg-slate-800 relative flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => setSelectedVideo(video)}>
                       {videoId ? (
                         <img 
                           src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                           className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                           alt=""
                           onError={(e) => {
                             (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                           }}
                         />
                       ) : (
                         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
                       )}
                       <div className="z-10 w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white scale-110 group-hover:scale-125 transition-all duration-500 border border-white/20">
                          <Play fill="currentColor" size={32} className="ml-1" />
                       </div>
                    </div>
                    
                    <div className="p-10 flex flex-col flex-grow">
                       <h4 className="text-xl font-black text-white mb-4 italic uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{video.title}</h4>
                       <p className="text-slate-400 font-medium text-sm leading-relaxed line-clamp-2 mb-8 italic">
                          {video.description}
                       </p>
                       <div className="flex flex-col gap-3 mt-auto">
                          <button 
                            onClick={() => setSelectedVideo(video)}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 shadow-xl transition-all"
                          >
                             Tomosha qilish
                          </button>
                          <button 
                            onClick={() => handleOpenInApp(video.videoUrl)}
                            className="w-full py-4 bg-white/5 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 border border-white/5 transition-all flex items-center justify-center gap-2"
                          >
                             <ExternalLink size={14} /> YouTube-da ochish
                          </button>
                       </div>
                    </div>
                 </div>
               );
             })}
          </div>
        )}

        {/* Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10">
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in" onClick={() => setSelectedVideo(null)} />
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl animate-in zoom-in duration-500 border border-white/10 flex flex-col">
               
               <div className="absolute top-6 right-6 z-50 flex gap-2">
                 <button 
                   onClick={() => handleOpenInApp(selectedVideo.videoUrl)} 
                   className="p-4 bg-white/10 hover:bg-emerald-600 text-white rounded-full transition-all border border-white/10 backdrop-blur-md flex items-center gap-2 text-xs font-black uppercase"
                 >
                   <ExternalLink size={20} /> <span className="hidden sm:inline">Ilovada ochish</span>
                 </button>
                 <button 
                   onClick={() => setSelectedVideo(null)} 
                   className="p-4 bg-white/10 hover:bg-rose-500 text-white rounded-full transition-all border border-white/10 backdrop-blur-md"
                 >
                   <X size={24} />
                 </button>
               </div>

               {getYouTubeId(selectedVideo.videoUrl) ? (
                 <iframe 
                   src={getEmbedUrl(selectedVideo.videoUrl)}
                   className="w-full h-full border-none"
                   title={selectedVideo.title}
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                   allowFullScreen
                 />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-white p-10 text-center">
                    <AlertCircle size={64} className="text-rose-500 mb-6" />
                    <h3 className="text-2xl font-black italic uppercase">Video topilmadi</h3>
                    <p className="text-slate-400 mt-4 max-w-md">Kiritilgan havola YouTube videosiga tegishli emas. Iltimos, admin panelda to'g'ri YouTube havolasini kiriting.</p>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGuides;
