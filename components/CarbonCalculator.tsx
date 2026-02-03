
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Calculator, Loader2, Sparkles, ArrowRight, Car, Zap, Trash2, Leaf, Utensils, Home, ShoppingBag, Droplets } from 'lucide-react';

const CarbonCalculator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    transport: 'jamoat',
    energy: 'standard',
    diet: 'mixed',
    housing: 'apartment',
    waste: 'none',
    shopping: 'average',
    water: 'careful'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Siz dunyo darajasidagi professional ekologiya ekspertisiz. 
      Foydalanuvchi turmush tarzi haqida ma'lumotlar:
      - Transport: ${formData.transport} (avtomobil, jamoat, velosiped, piyoda)
      - Energiya: ${formData.energy} (standard tarmoq, quyosh paneli)
      - Ratsion/Ovqatlanish: ${formData.diet} (go'shtli, aralash, vegetarian, vegan)
      - Uy turi: ${formData.housing} (kvartira, hovli uy)
      - Chiqindi nazorati: ${formData.waste} (saralamaydi, qisman, to'liq saralaydi)
      - Xarid qilish odati: ${formData.shopping} (minimalist, o'rtacha, ko'p xarid qiladi)
      - Suv iste'moli: ${formData.water} (isrof qiladi, ehtiyotkor, juda tejamkor)
      
      Vazifa: Ushbu ma'lumotlarni tahlil qiling va foydalanuvchiga shaxsiy Eko-Hisobot tayyorlang.
      Javob quyidagi bo'limlardan iborat bo'lsin:
      1. Ekologik baho (100 balldan necha ball berishingiz).
      2. Ijobiy tomonlari: Uning qaysi odatlari tabiatga foydali.
      3. Salbiy ta'sir: Qaysi odatlari eng ko'p zarar yetkazmoqda.
      4. TOP-3 Shaxsiy maslahat: Aynan uning hayot tarzi uchun eng samarali 3 ta o'zgarish.
      5. Kelajak uchun motivatsiya.
      
      Javobni o'zbek tilida, professional, chiroyli va qisqa (bullet points bilan) formatda bering.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setResult(response.text || "AI tahlil bera olmadi.");
    } catch (err) {
      setResult("AI tahlil qilishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const OptionButton = ({ value, label, current, icon: Icon, type }: any) => (
    <button 
      type="button" 
      onClick={() => setFormData({...formData, [type]: value})} 
      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group ${
        current === value ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg' : 'border-slate-100 bg-white hover:border-emerald-200'
      }`}
    >
      <Icon size={24} className={current === value ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="bg-white rounded-[64px] p-8 md:p-14 shadow-3xl border border-emerald-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-[100px]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center rotate-3 shadow-lg shadow-emerald-200"><Calculator className="text-white" size={28} /></div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">EKO <span className="text-emerald-500">Tahlil v2.0</span></h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Gemini AI Expert System</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 w-6 rounded-full transition-all ${step >= s ? 'bg-emerald-500' : 'bg-slate-100'}`} />
            ))}
          </div>
        </div>

        {result ? (
          <div className="animate-in fade-in zoom-in slide-in-from-bottom-8">
            <div className="bg-slate-950 text-emerald-50 p-10 rounded-[48px] mb-10 shadow-3xl border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Sparkles size={120} /></div>
               <div className="flex items-center gap-3 text-emerald-400 font-black uppercase text-[12px] tracking-[0.4em] mb-8 animate-pulse">
                 <Sparkles size={18} /> Shaxsiy Tahlil Natijasi
               </div>
               <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-sm md:text-base font-medium text-slate-300 italic">
                 {result}
               </div>
            </div>
            <button onClick={() => {setResult(null); setStep(1);}} className="w-full py-6 bg-emerald-600 text-white rounded-[32px] font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-2xl">Yangi Tahlil Boshlash</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-8">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block ml-2">Transport va Uy turi</label>
                  <div className="grid grid-cols-2 gap-4">
                    <OptionButton type="transport" value="avtomobil" label="Mashina" icon={Car} current={formData.transport} />
                    <OptionButton type="transport" value="jamoat" label="Jamoat" icon={Users} current={formData.transport} />
                    <OptionButton type="housing" value="apartment" label="Kvartira" icon={Home} current={formData.housing} />
                    <OptionButton type="housing" value="house" label="Hovli uy" icon={Leaf} current={formData.housing} />
                  </div>
                </div>
                <button type="button" onClick={() => setStep(2)} className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-lg flex items-center justify-center gap-4 hover:bg-emerald-600 transition-all">Keyingi qadam <ArrowRight size={24} /></button>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-8">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block ml-2">Ovqatlanish va Iste'mol</label>
                  <div className="grid grid-cols-2 gap-4">
                    <OptionButton type="diet" value="mixed" label="Aralash" icon={Utensils} current={formData.diet} />
                    <OptionButton type="diet" value="vegan" label="Vegan" icon={Leaf} current={formData.diet} />
                    <OptionButton type="shopping" value="minimalist" label="Minimalist" icon={ShoppingBag} current={formData.shopping} />
                    <OptionButton type="shopping" value="heavy" label="Ko'p xarid" icon={ShoppingBag} current={formData.shopping} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="px-8 py-6 bg-slate-100 rounded-[32px] font-black uppercase text-xs">Orqaga</button>
                  <button type="button" onClick={() => setStep(3)} className="flex-grow py-6 bg-slate-900 text-white rounded-[32px] font-black text-lg flex justify-center items-center gap-4">Davom etish <ArrowRight size={24} /></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-8">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block ml-2">Resurslar va Chiqindi</label>
                  <div className="grid grid-cols-2 gap-4">
                    <OptionButton type="energy" value="standard" label="Standard" icon={Zap} current={formData.energy} />
                    <OptionButton type="energy" value="solar" label="Quyosh" icon={Sparkles} current={formData.energy} />
                    <OptionButton type="water" value="careful" label="Tejamkor" icon={Droplets} current={formData.water} />
                    <OptionButton type="waste" value="full" label="Saralash" icon={Trash2} current={formData.waste} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="px-8 py-6 bg-slate-100 rounded-[32px] font-black uppercase text-xs">Orqaga</button>
                  <button type="submit" disabled={loading} className="flex-grow py-6 bg-emerald-600 text-white rounded-[32px] font-black text-lg flex justify-center items-center gap-4 shadow-2xl">
                    {loading ? <Loader2 className="animate-spin" /> : <>Tahlilni olish <Sparkles size={24} /></>}
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

const Users = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default CarbonCalculator;
