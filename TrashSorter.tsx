
import React, { useState } from 'react';
import { Trash2, Recycle, CheckCircle2, AlertCircle } from 'lucide-react';

const ITEMS = [
  { id: 1, name: 'Plastik idish', type: 'plastic', emoji: '🥤' },
  { id: 2, name: 'Eski gazeta', type: 'paper', emoji: '📰' },
  { id: 3, name: 'Shisha butilka', type: 'glass', emoji: '🍾' },
  { id: 4, name: 'Polietilen paket', type: 'plastic', emoji: '🛍️' },
  { id: 5, name: 'Karton quti', type: 'paper', emoji: '📦' },
  { id: 6, name: 'Singan oyna', type: 'glass', emoji: '🍷' },
];

const TrashSorter: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);

  const handleSort = (type: string) => {
    if (feedback) return;

    if (ITEMS[currentIndex].type === type) {
      setScore(s => s + 20);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < ITEMS.length - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border-b-[12px] border-blue-100 min-h-[500px] flex flex-col items-center justify-center">
      {!finished ? (
        <>
          <div className="flex justify-between w-full mb-10">
            <span className="font-black text-blue-600 uppercase tracking-widest">Progress: {currentIndex + 1}/{ITEMS.length}</span>
            <span className="font-black text-emerald-600">Ball: {score}</span>
          </div>

          <div className="mb-12 text-center animate-in zoom-in duration-300">
             <div className="text-8xl mb-6 transform transition-transform hover:scale-110">{ITEMS[currentIndex].emoji}</div>
             <h3 className="text-3xl font-black text-slate-800">{ITEMS[currentIndex].name}</h3>
             <p className="text-slate-400 font-bold uppercase mt-2">Qaysi qutiga tashlash kerak?</p>
          </div>

          <div className="grid grid-cols-3 gap-6 w-full">
            <Bin color="bg-emerald-500" label="Plastik" onClick={() => handleSort('plastic')} icon="🥤" />
            <Bin color="bg-blue-500" label="Qog'oz" onClick={() => handleSort('paper')} icon="📄" />
            <Bin color="bg-amber-500" label="Shisha" onClick={() => handleSort('glass')} icon="🏺" />
          </div>

          {feedback && (
            <div className={`mt-10 p-4 rounded-2xl flex items-center gap-3 font-black animate-in slide-in-from-bottom-4 ${feedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {feedback === 'correct' ? <CheckCircle2 /> : <AlertCircle />}
              {feedback === 'correct' ? "To'g'ri! Rahmat." : "Xato! Bu boshqa turdagi chiqindi."}
            </div>
          )}
        </>
      ) : (
        <div className="text-center animate-in zoom-in">
           <Recycle className="w-24 h-24 text-emerald-600 mx-auto mb-6 animate-spin-slow" />
           <h3 className="text-4xl font-black text-slate-900 mb-4">Ajoyib saralash!</h3>
           <p className="text-xl text-slate-500 mb-10 font-bold">Siz {score} ball to'pladingiz va tabiatni toza saqladingiz.</p>
           <button onClick={onExit} className="px-12 py-5 bg-emerald-600 text-white rounded-3xl font-black text-xl shadow-xl hover:scale-105 transition-all">Glavniyga qaytish</button>
        </div>
      )}
    </div>
  );
};

const Bin = ({ color, label, onClick, icon }: any) => (
  <button onClick={onClick} className={`${color} p-6 rounded-[32px] text-white flex flex-col items-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95 group relative overflow-hidden`}>
    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    <span className="text-4xl relative z-10">{icon}</span>
    <span className="font-black uppercase tracking-widest text-xs relative z-10">{label}</span>
  </button>
);

export default TrashSorter;
