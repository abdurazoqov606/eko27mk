
import React, { useState } from 'react';
import { BrainCircuit, Trophy, RotateCcw, CheckCircle2, AlertCircle, ArrowRight, Star, Sparkles, BookOpen } from 'lucide-react';

const HARD_ECO_QUIZ = [
  {
    question: "Atmosferadagi metan (CH4) gazining global isishga ta'siri CO2 dan necha barobar kuchliroq?",
    options: ["2 barobar", "10 barobar", "28 barobar", "100 barobar"],
    correctAnswer: 2,
    explanation: "Metan qisqa muddatda CO2 ga qaraganda 28 barobardan 80 barobargacha ko'proq issiqlikni saqlab qoladi.",
    level: 'Hard'
  },
  {
    question: "Nima uchun plastik tabiatga zararli?",
    options: ["Chunki u hidsiz", "Chunki u 500 yil davomida parchalanmaydi", "Chunki u qimmat", "Chunki u suvda eriydi"],
    correctAnswer: 1,
    explanation: "Plastik mahsulotlar tabiatda juda uzoq vaqt saqlanib qoladi va zaharli mikroplastiklar hosil qiladi.",
    level: 'Basic'
  },
  {
    question: "1 tonna qog'oz qancha daraxtni saqlaydi?",
    options: ["1 ta", "5 ta", "17 ta", "50 ta"],
    correctAnswer: 2,
    explanation: "Qog'ozni qayta ishlash har yili millionlab daraxtlarni kesilishdan asrab qoladi.",
    level: 'Medium'
  },
  {
    question: "Okeanlarning kislotalashishi asosan qaysi gazning suvda erishi natijasida sodir bo'ladi?",
    options: ["Azot", "Kislorod", "Karbonat angidrid", "Vodorod"],
    correctAnswer: 2,
    explanation: "Okeanlar atmosferadagi CO2 ning 30% ini yutadi, bu esa suv pH darajasini pasaytiradi.",
    level: 'Extreme'
  },
  {
    question: "Qaysi xalqaro shartnoma ozon qatlamini himoya qilishga qaratilgan?",
    options: ["Parij kelishuvi", "Kyoto protokoli", "Monreal protokoli", "Rio deklaratsiyasi"],
    correctAnswer: 2,
    explanation: "1987-yilda imzolangan Monreal protokoli CFC gazlarini taqiqlash orqali ozonni asrab qoldi.",
    level: 'Hard'
  }
];

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === HARD_ECO_QUIZ[currentQuestion].correctAnswer) setScore(score + 1);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    if (currentQuestion + 1 < HARD_ECO_QUIZ.length) setCurrentQuestion(currentQuestion + 1);
    else setShowScore(true);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 shadow-2xl">
            <BrainCircuit size={16} className="text-emerald-500" /> ECO-EXPERTISE PRO
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic">Eko-Savollar <span className="text-emerald-600">Akademiyasi</span></h2>
          <p className="text-slate-500 font-medium text-lg mt-6 italic">Bilimingizni sinang va darajangizni oshiring.</p>
        </div>

        {showScore ? (
          <div className="bg-white rounded-[64px] p-16 text-center shadow-3xl animate-in zoom-in border border-slate-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
            <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto mb-8 flex items-center justify-center text-emerald-600 shadow-inner">
               <Trophy size={64} className="animate-bounce" />
            </div>
            <h3 className="text-7xl font-black text-slate-900 mb-4 tracking-tighter">{score}/{HARD_ECO_QUIZ.length}</h3>
            <p className="text-slate-500 font-bold mb-10 text-xl uppercase tracking-widest">Sizning natijangiz</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button onClick={() => window.location.reload()} className="px-12 py-6 bg-emerald-600 text-white rounded-[32px] font-black text-xl flex items-center justify-center gap-4 shadow-2xl hover:scale-105 transition-all">
                  <RotateCcw /> Qayta urinish
               </button>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-bottom-10 duration-700">
            {/* Progress Card */}
            <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><BookOpen size={20} /></div>
                   <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Savol: <span className="text-slate-900">{currentQuestion + 1}</span> / {HARD_ECO_QUIZ.length}</span>
                </div>
                <div className="flex items-center gap-2">
                   <Sparkles size={16} className="text-amber-500" />
                   <span className="text-xs font-black text-rose-500 uppercase tracking-widest">{HARD_ECO_QUIZ[currentQuestion].level}</span>
                </div>
              </div>
              <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div className="h-full bg-emerald-500 transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${((currentQuestion + 1) / HARD_ECO_QUIZ.length) * 100}%` }} />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-[64px] p-12 md:p-16 shadow-3xl border border-slate-50 relative overflow-hidden">
              <div className="absolute top-10 right-10 text-slate-50/50 -z-0">
                <BrainCircuit size={150} />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-12 leading-tight tracking-tight italic relative z-10">"{HARD_ECO_QUIZ[currentQuestion].question}"</h3>
              
              <div className="grid gap-5 relative z-10">
                {HARD_ECO_QUIZ[currentQuestion].options.map((option, index) => (
                  <button
                    key={index} onClick={() => handleOptionClick(index)} disabled={selectedOption !== null}
                    className={`p-8 rounded-[36px] text-left font-black transition-all border-4 flex justify-between items-center text-sm md:text-lg ${
                      selectedOption === index 
                        ? (index === HARD_ECO_QUIZ[currentQuestion].correctAnswer ? 'bg-emerald-50 border-emerald-500 text-emerald-700 scale-[1.02] shadow-xl shadow-emerald-100' : 'bg-rose-50 border-rose-500 text-rose-700 scale-[1.02] shadow-xl shadow-rose-100') 
                        : (selectedOption !== null && index === HARD_ECO_QUIZ[currentQuestion].correctAnswer ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-50 hover:border-emerald-200 text-slate-600')
                    }`}
                  >
                    <span className="flex items-center gap-4">
                       <span className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${selectedOption === index ? 'border-current' : 'border-slate-100'}`}>{String.fromCharCode(65 + index)}</span>
                       {option}
                    </span>
                    {selectedOption === index && (index === HARD_ECO_QUIZ[currentQuestion].correctAnswer ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />)}
                  </button>
                ))}
              </div>
              
              {selectedOption !== null && (
                <div className="mt-12 p-10 bg-slate-900 rounded-[48px] animate-in fade-in slide-in-from-top-4 border-l-[12px] border-emerald-500 shadow-2xl">
                  <div className="flex items-center gap-3 text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-6"><Star size={20} /> Ekspert Izohi</div>
                  <p className="text-slate-300 font-medium text-lg leading-relaxed italic">{HARD_ECO_QUIZ[currentQuestion].explanation}</p>
                  <button onClick={nextQuestion} className="mt-12 w-full py-7 bg-emerald-600 text-white rounded-[32px] font-black text-xl flex items-center justify-center gap-4 shadow-3xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all hover:scale-[1.02]">
                    Keyingi savolga o'tish <ArrowRight size={24} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
