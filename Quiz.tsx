
import React, { useState } from 'react';
import { ECO_QUIZ } from '../constants';
import { BrainCircuit, Trophy, RotateCcw, CheckCircle2, AlertCircle, ArrowRight, Star } from 'lucide-react';

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(index);
    const correct = index === ECO_QUIZ[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentQuestion + 1 < ECO_QUIZ.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <BrainCircuit size={16} /> Eco-Intelligence
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Bilimingizni Sinab Ko'ring</h2>
          <p className="text-slate-500 font-medium mt-2">Ekologiya sohasidagi darajangizni aniqlang</p>
        </div>

        {showScore ? (
          <div className="bg-white rounded-[48px] p-12 text-center shadow-2xl border border-emerald-50 animate-in zoom-in duration-500">
            <div className="w-32 h-32 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <Trophy size={64} />
            </div>
            <h3 className="text-5xl font-black text-slate-900 mb-4">Ajoyib natija!</h3>
            <p className="text-2xl text-slate-500 mb-8">Siz {ECO_QUIZ.length} tadan <span className="text-emerald-600 font-black">{score} ta</span> to'g'ri javob berdingiz.</p>
            
            <div className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
               <div className="p-4 bg-emerald-50 rounded-2xl">
                 {/* Fixed typo: ECO_QUI_length was corrected to ECO_QUIZ.length */}
                 <div className="text-emerald-600 font-black text-xl">{(score/ECO_QUIZ.length * 100).toFixed(0)}%</div>
                 <div className="text-[10px] uppercase font-bold text-emerald-700">Aniqlik</div>
               </div>
               <div className="p-4 bg-blue-50 rounded-2xl">
                 <div className="text-blue-600 font-black text-xl">{score * 10}</div>
                 <div className="text-[10px] uppercase font-bold text-blue-700">Eco-Points</div>
               </div>
               <div className="p-4 bg-purple-50 rounded-2xl">
                 <div className="text-purple-600 font-black text-xl">{score > 7 ? 'Ekspert' : 'Hovaskor'}</div>
                 <div className="text-[10px] uppercase font-bold text-purple-700">Daraja</div>
               </div>
            </div>

            <button 
              onClick={resetQuiz}
              className="px-12 py-5 bg-emerald-600 text-white rounded-[24px] font-black text-xl hover:bg-emerald-700 transition-all flex items-center gap-3 mx-auto shadow-xl shadow-emerald-200"
            >
              <RotateCcw /> Qayta urinish
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Progress Bar */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Savol {currentQuestion + 1} / {ECO_QUIZ.length}</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {ECO_QUIZ[currentQuestion].level}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${((currentQuestion + 1) / ECO_QUIZ.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-50 animate-in slide-in-from-bottom-8">
              <h3 className="text-3xl font-black text-slate-800 mb-10 leading-tight">
                {ECO_QUIZ[currentQuestion].question}
              </h3>
              
              <div className="grid gap-4">
                {ECO_QUIZ[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={selectedOption !== null}
                    className={`p-6 rounded-2xl text-left font-bold transition-all border-2 flex justify-between items-center ${
                      selectedOption === index
                        ? index === ECO_QUIZ[currentQuestion].correctAnswer
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'bg-rose-50 border-rose-500 text-rose-700'
                        : selectedOption !== null && index === ECO_QUIZ[currentQuestion].correctAnswer
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-white border-slate-100 hover:border-emerald-200 text-slate-600'
                    }`}
                  >
                    <span>{option}</span>
                    {selectedOption === index && (
                      index === ECO_QUIZ[currentQuestion].correctAnswer ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />
                    )}
                  </button>
                ))}
              </div>

              {selectedOption !== null && (
                <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 animate-in fade-in duration-500">
                  <div className="flex items-center gap-2 text-emerald-700 font-black text-sm uppercase tracking-widest mb-2">
                    <Star size={16} /> Izoh
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {ECO_QUIZ[currentQuestion].explanation}
                  </p>
                  <button 
                    onClick={nextQuestion}
                    className="mt-8 w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                  >
                    {currentQuestion + 1 === ECO_QUIZ.length ? 'Natijani ko\'rish' : 'Keyingi savol'} <ArrowRight size={20} />
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
