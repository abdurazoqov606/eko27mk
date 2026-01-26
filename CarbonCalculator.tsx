
import React, { useState, useRef } from 'react';
import { calculateCarbonFootprint, generateEcoSpeech } from '../services/geminiService';
import { Calculator, Loader2, RefreshCcw, TrendingDown, Info, ArrowRight, Zap, Droplets, Trash2, Car, Utensils, Sparkles, CheckCircle2, Volume2, Pause, Play, ShieldCheck, Leaf } from 'lucide-react';

// Audio decoding utilities
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

const CarbonCalculator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechLoading, setSpeechLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

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
    const analysis = await calculateCarbonFootprint(formData);
    setResult(analysis);
    setLoading(false);
  };

  const handleSpeech = async () => {
    if (isSpeaking) {
      audioSourceRef.current?.stop();
      setIsSpeaking(false);
      return;
    }

    if (!result) return;
    setSpeechLoading(true);
    
    const base64Audio = await generateEcoSpeech(result);
    if (base64Audio) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const audioData = decodeBase64(base64Audio);
      const buffer = await decodeAudioData(audioData, audioContextRef.current);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsSpeaking(false);
      
      audioSourceRef.current = source;
      source.start();
      setIsSpeaking(true);
    }
    setSpeechLoading(false);
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="bg-slate-950 rounded-[64px] p-8 md:p-14 shadow-3xl border border-white/10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-[100px] group-hover:bg-emerald-500/20 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center rotate-3">
              <Calculator className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white tracking-tighter italic">EKO 27 <span className="text-emerald-500">Tahlil</span></h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">powered by Abdurazoqov Abbos</p>
            </div>
          </div>
          {!result && (
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= i ? 'bg-emerald-500' : 'bg-white/10'}`} />
              ))}
            </div>
          )}
        </div>

        {result ? (
          <div className="animate-in zoom-in slide-in-from-bottom-8 duration-700">
            {/* Audio Control Bar */}
            <div className="mb-8 flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
               <div className="flex items-center gap-4">
                 <button 
                  onClick={handleSpeech}
                  disabled={speechLoading}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSpeaking ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white hover:scale-110'}`}
                 >
                   {speechLoading ? <Loader2 className="animate-spin" size={20} /> : isSpeaking ? <Pause size={20} /> : <Volume2 size={20} />}
                 </button>
                 <div>
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">AI Ovozli Hisobot</p>
                   <p className="text-xs text-slate-400 font-bold">{isSpeaking ? 'AI tahlilni o\'qimoqda...' : 'Hisobotni tinglash uchun bosing'}</p>
                 </div>
               </div>
               {isSpeaking && (
                 <div className="flex items-end gap-1 h-4 px-4">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className="w-1 bg-emerald-500 rounded-full animate-bounce" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                   ))}
                 </div>
               )}
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[48px] text-slate-200 leading-relaxed mb-10 prose prose-invert prose-emerald max-w-none">
              <div className="flex items-center gap-3 text-emerald-400 font-black uppercase text-[12px] tracking-[0.4em] mb-8">
                <Sparkles size={18} className="animate-pulse" /> Expert Tahlil Natijasi
              </div>
              <div className="whitespace-pre-wrap font-medium text-lg leading-relaxed mb-12">
                {result}
              </div>

              {/* Nature Protection Instructions Block */}
              <div className="mt-12 p-8 bg-slate-900/50 rounded-[40px] border border-emerald-500/20">
                 <h4 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                   <ShieldCheck className="text-emerald-500" /> Tabiatni asrash ko'rsatmalari
                 </h4>
                 <div className="grid md:grid-cols-2 gap-6">
                    <InstructionItem icon={<Leaf size={16} />} text="Chiqindini saralash - kelajak asosi." />
                    <InstructionItem icon={<Droplets size={16} />} text="Suvni har bir tomchisini qadrlang." />
                    <InstructionItem icon={<Zap size={16} />} text="Energiyani tejash - yashil hayot." />
                    <InstructionItem icon={<Trash2 size={16} />} text="Plastikdan voz keching, matoga o'ting." />
                 </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {setResult(null); setStep(1); setIsSpeaking(false); audioSourceRef.current?.stop();}}
                className="flex-grow py-6 bg-white/5 border border-white/10 text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
              >
                <RefreshCcw size={18} /> Yangi Tahlil
              </button>
              <button 
                onClick={() => window.open(`https://t.me/share/url?url=https://eko27mk.vercel.app/&text=Men EKO 27 tahlilidan o'tdim! Mening natijamni ko'ring...`, '_blank')}
                className="flex-grow py-6 bg-emerald-600 text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-600/20"
              >
                Natijani ulashish
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="grid gap-6">
                  <div className="group">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2 group-hover:text-emerald-500 transition-colors">
                      <Car size={14} /> Transport Odati
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {['avtomobil', 'jamoat', 'velosiped', 'piyoda'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, transport: type})}
                          className={`p-5 rounded-3xl border-2 transition-all font-bold text-sm capitalize ${formData.transport === type ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/20'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="group">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2 group-hover:text-emerald-500 transition-colors">
                      <Utensils size={14} /> Ovqatlanish
                    </label>
                    <select 
                      className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                      value={formData.diet}
                      onChange={(e) => setFormData({...formData, diet: e.target.value})}
                    >
                      <option value="meat_heavy" className="bg-slate-900">Ko'p go'sht iste'moli</option>
                      <option value="balanced" className="bg-slate-900">Muvozanatli (Me'yorida)</option>
                      <option value="vegetarian" className="bg-slate-900">Vegetarian (Faqat o'simlik)</option>
                    </select>
                  </div>
                </div>
                <button type="button" onClick={nextStep} className="w-full py-6 bg-white text-slate-950 rounded-[28px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-500 hover:text-white transition-all">
                  Keyingi Qadam <ArrowRight size={20} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="grid gap-6">
                  <div className="group">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2 group-hover:text-emerald-500 transition-colors">
                      <Zap size={14} /> Uy Energiyasi
                    </label>
                    <select 
                      className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                      value={formData.energy}
                      onChange={(e) => setFormData({...formData, energy: e.target.value})}
                    >
                      <option value="standard" className="bg-slate-900">Oddiy elektr tarmog'i</option>
                      <option value="solar" className="bg-slate-900">Quyosh panellari (Eko)</option>
                      <option value="mixed" className="bg-slate-900">Aralash energiya</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2 group-hover:text-emerald-500 transition-colors">
                      <Droplets size={14} /> Suv Sarfi
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {['tejamkor', 'o\'rtacha', 'ko\'p', 'nazoratsiz'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFormData({...formData, water: val})}
                          className={`p-5 rounded-3xl border-2 transition-all font-bold text-sm capitalize ${formData.water === val ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/20'}`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="px-10 py-6 bg-white/5 text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">Orqaga</button>
                  <button type="button" onClick={nextStep} className="flex-grow py-6 bg-white text-slate-950 rounded-[28px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-500 hover:text-white transition-all">Davom etish <ArrowRight size={20} /></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="group">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2 group-hover:text-emerald-500 transition-colors">
                    <Trash2 size={14} /> Chiqindi Saralash
                  </label>
                  <div className="grid gap-4">
                    {[
                      { id: 'none', label: 'Umuman saralamayman', icon: '❌' },
                      { id: 'partial', label: 'Qisman saralayman', icon: '⚖️' },
                      { id: 'full', label: 'To\'liq eko-saralash', icon: '✅' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFormData({...formData, waste: item.id})}
                        className={`p-6 rounded-[32px] border-2 transition-all font-bold text-left flex items-center justify-between ${formData.waste === item.id ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/20'}`}
                      >
                        <span className="text-sm">{item.label}</span>
                        <span className="text-xl">{item.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="px-10 py-6 bg-white/5 text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">Orqaga</button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-grow py-6 bg-emerald-600 text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all flex justify-center items-center gap-3 shadow-2xl shadow-emerald-900/40 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <>Tahlilni Yakunlash <Sparkles size={20} /></>}
                  </button>
                </div>
              </div>
            )}

            <p className="text-[10px] text-slate-600 font-bold text-center flex items-center justify-center gap-2 opacity-50">
              <Info size={12} /> Ma'lumotlaringiz Abdurazoqov Abbos AI-modeli tomonidan xavfsiz tahlil qilinadi.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

const InstructionItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
    <div className="text-emerald-500">{icon}</div>
    <p className="text-xs font-bold text-slate-300">{text}</p>
  </div>
);

export default CarbonCalculator;
