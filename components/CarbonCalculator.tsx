
import React, { useState } from 'react';
import { calculateCarbonFootprint } from '../services/geminiService';
import { Calculator, Loader2, RefreshCcw, Info, ArrowRight, Zap, Droplets, Trash2, Car, Utensils, Sparkles, ShieldCheck, Leaf, CheckCircle2 } from 'lucide-react';

const CarbonCalculator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    transport: 'jamoat',
    diet: 'balanced',
    energy: 'standard',
    waste: 'none',
    water: 'average'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const analysis = await calculateCarbonFootprint(formData);
      setResult(analysis || "Tahlil natijasini olib bo'lmadi.");
    } catch (err) {
      setResult("Xatolik yuz berdi. Internet ulanishini tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="bg-white rounded-[64px] p-8 md:p-14 shadow-3xl border border-emerald-50 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-[100px]" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl shadow-xl flex items-center justify-center rotate-3">
              <Calculator className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">EKO <span className="text-emerald-500">Tahlil</span></h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Professional ekologik ekspertiza</p>
            </div>
          </div>
          {!result && (
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= i ? 'bg-emerald-500' : 'bg-slate-100'}`} />
              ))}
            </div>
          )}
        </div>

        {result ? (
          <div className="animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700">
            <div className="bg-slate-50 border border-emerald-100 p-8 md:p-12 rounded-[48px] text-slate-800 mb-10 shadow-inner relative overflow-hidden">
               <div className="flex items-center gap-3 text-emerald-600 font-black uppercase text-[12px] tracking-[0.4em] mb-8">
                  <Sparkles size={18} className="animate-pulse" /> AI Tahlil Natijasi
               </div>
               
               <div className="whitespace-pre-wrap leading-relaxed text-lg font-medium text-slate-700">
                  {result}
               </div>

               <div className="mt-12 p-8 bg-white rounded-[40px] border border-emerald-100 shadow-sm flex items-start gap-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">Abbosdan Tavsiya</h4>
                    <p className="text-slate-500 font-medium text-sm italic">"Bu tahlil sizga tabiat bilan uyg'un yashashda yordam beradi."</p>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {setResult(null); setStep(1);}}
                className="flex-grow py-6 bg-slate-100 text-slate-600 rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
              >
                <RefreshCcw size={18} /> Yangi Tahlil
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="grid gap-8">
                  <div className="group">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-2">
                      <Car size={14} /> Transport
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {['avtomobil', 'jamoat', 'velosiped', 'piyoda'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, transport: type})}
                          className={`p-6 rounded-3xl border-2 transition-all font-black text-sm capitalize ${formData.transport === type ? 'border-emerald-500 bg-emerald-500 text-white shadow-xl' : 'border-slate-100 bg-white text-slate-400'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="group">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-2">
                      <Utensils size={14} /> Ovqatlanish
                    </label>
                    <select 
                      className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[32px] text-slate-900 font-black outline-none focus:border-emerald-500 transition-all"
                      value={formData.diet}
                      onChange={(e) => setFormData({...formData, diet: e.target.value})}
                    >
                      <option value="meat">Go'shtli</option>
                      <option value="balanced">Muvozanatli</option>
                      <option value="vegetarian">Vegetarian</option>
                    </select>
                  </div>
                </div>
                <button type="button" onClick={nextStep} className="w-full py-7 bg-slate-900 text-white rounded-[32px] font-black text-lg flex items-center justify-center gap-4 hover:bg-emerald-600 transition-all shadow-2xl">
                  Keyingi Qadam <ArrowRight size={24} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="grid gap-8">
                  <div className="group">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-2">
                      <Zap size={14} /> Energiya
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {['standard', 'solar'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFormData({...formData, energy: val})}
                          className={`p-6 rounded-3xl border-2 transition-all font-black text-sm ${formData.energy === val ? 'border-emerald-500 bg-emerald-500 text-white shadow-xl' : 'border-slate-100 bg-white text-slate-400'}`}
                        >
                          {val === 'standard' ? 'Tarmoq' : 'Quyosh'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="group">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-2">
                      <Droplets size={14} /> Suv Sarfi
                    </label>
                    <select 
                      className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[32px] text-slate-900 font-black outline-none focus:border-emerald-500 transition-all"
                      value={formData.water}
                      onChange={(e) => setFormData({...formData, water: e.target.value})}
                    >
                      <option value="low">Tejamkor</option>
                      <option value="average">O'rtacha</option>
                      <option value="high">Ko'p</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="px-10 py-7 bg-slate-100 text-slate-600 rounded-[32px] font-black text-lg uppercase transition-all">Orqaga</button>
                  <button type="button" onClick={nextStep} className="flex-grow py-7 bg-slate-900 text-white rounded-[32px] font-black text-lg flex items-center justify-center gap-4 hover:bg-emerald-600 transition-all shadow-2xl">Davom etish <ArrowRight size={24} /></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="group">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-2">
                    <Trash2 size={14} /> Chiqindi Saralash
                  </label>
                  <div className="grid gap-4">
                    {['none', 'partial', 'full'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setFormData({...formData, waste: item})}
                        className={`p-6 rounded-[32px] border-2 transition-all font-black text-left flex items-center justify-between ${formData.waste === item ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-100 bg-white text-slate-600'}`}
                      >
                        <span className="text-sm capitalize">{item === 'none' ? 'Saralamayman' : item === 'partial' ? 'Qisman' : 'To\'liq'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="px-10 py-7 bg-slate-100 text-slate-600 rounded-[32px] font-black text-lg uppercase transition-all">Orqaga</button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-grow py-7 bg-emerald-600 text-white rounded-[32px] font-black text-lg flex justify-center items-center gap-4 shadow-3xl shadow-emerald-100 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <>Tahlilni Yakunlash <Sparkles size={24} /></>}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default CarbonCalculator;
