
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  AlertTriangle, Droplets, Wind, Factory, ArrowRight, ShieldAlert, 
  X, Info, TrendingUp, MapPin, Leaf, Car, Trash2, 
  CheckCircle2, ArrowLeft, Recycle, Sprout
} from 'lucide-react';

const data = [
  { year: '1960', level: 53 },
  { year: '1980', level: 36 },
  { year: '2000', level: 20 },
  { year: '2024', level: 9 },
];

interface AdviceItem {
  icon: React.ReactNode;
  title: string;
  text: string;
}

interface ProblemAnalysis {
  id: string;
  title: string;
  shortDesc: string;
  fullAnalysis: string;
  stats: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  advice: AdviceItem[];
}

const ShoppingBagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

const PROBLEMS_DATA: ProblemAnalysis[] = [
  {
    id: 'air',
    title: "Toshkent Havo Sifati",
    shortDesc: "PM2.5 zarralari va transport chiqindilari darajasi keskin ortishi.",
    fullAnalysis: `Toshkent shahridagi havo ifloslanishi bugungi kunda mintaqaviy darajadagi eng dolzarb muammoga aylandi. IQAir ma'lumotlariga ko'ra, Toshkent tez-tez dunyoning havosi eng iflos shaharlari reytingida TOP-10 talikka kirmoqda. 

Asosiy sabablar:
1. Transport vositalari: Shaharda 800 mingdan ortiq avtomobil harakatlanadi.
2. Qurilish sur'atlari: Nazoratsiz qurilishlar va yashil hududlarning qisqarishi.
3. Issiqlik tizimi: Kuz-qish mavsumida ko'mir va mazutdan foydalanish.

PM2.5 zarralari o'ta kichik bo'lib, ular insonning o'pka va qon aylanish tizimiga chuqur kirib boradi.`,
    stats: "PM2.5 konsentratsiyasi JSST me'yoridan 15-20 baravar yuqori.",
    icon: <Wind />,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    advice: [
      { icon: <Car />, title: "Jamoat transporti", text: "Haftada kamida 2 kun shaxsiy avtomobildan voz keching yoki velosipeddan foydalanishga harakat qiling." },
      { icon: <Leaf />, title: "Yashil devor", text: "Xonadoningiz balkonida yoki hovlisida ko'proq havo tozalovchi o'simliklar yetishtirishni boshlang." },
      { icon: <CheckCircle2 />, title: "Maskadan foydalanish", text: "Havo sifati 'Qizil' darajaga chiqqanda, maxsus filtrli maskalardan foydalanish tavsiya etiladi." }
    ]
  },
  {
    id: 'water',
    title: "Suv Taqchilligi",
    shortDesc: "Markaziy Osiyoda muzliklar erishi va transchegaraviy daryolar muammosi.",
    fullAnalysis: `O'zbekiston suv taqchilligi bo'yicha global darajada "yuqori xavf" zonasida turibdi. 2030-yilga borib mamlakatimizda 7 milliard kub metr suv tanqisligi yuzaga kelishi bashorat qilinmoqda.

Tahliliy ma'lumotlar:
- Muzliklar erishi: Oxirgi 50 yilda muzliklar 30% ga qisqargan.
- Sug'orish tizimi: Suvning 90% qismi qishloq xo'jaligida isrof bilan ishlatiladi.
- Iqlim o'zgarishi: Haroratning ko'tarilishi bug'lanishni oshirmoqda.`,
    stats: "O'zbekistonning 80% suv resurslari qo'shni davlatlarda shakllanadi.",
    icon: <Droplets />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    advice: [
      { icon: <Droplets />, title: "Tejamkor kranlar", text: "Aeratorli kranlardan foydalaning, bu suv sarfini 50% gacha kamaytirishga yordam beradi." },
      { icon: <Sprout />, title: "Aqlli sug'orish", text: "Hovli uyingizda tomchilatib sug'orish tizimini o'rnating, suv isrofini to'xtating." },
      { icon: <CheckCircle2 />, title: "Odatni o'zgartirish", text: "Tish yuvayotganda suvni ochiq qoldirmang — bu har safar 6-10 litr suvni tejaydi." }
    ]
  },
  {
    id: 'waste',
    title: "Chiqindi Inqirozi",
    shortDesc: "Plastik chiqindilar va qayta ishlash tizimining past samaradorligi.",
    fullAnalysis: `O'zbekistonda yiliga 7 million tonnadan ortiq maishiy chiqindi hosil bo'ladi. Ularning faqatgina 15-20% qismi qayta ishlanadi.

Muammoning ko'lami:
1. Plastik ifloslanish: Plastik parchalanishi uchun 500 yil talab etiladi.
2. Saralash madaniyati: Aholi orasida saralash tizimi hali shakllanmagan.
3. Metan gazi: Poligonlardagi organik chiqindilar global isishni kuchaytiradi.`,
    stats: "Har kuni Toshkent shahrining o'zida 2000 tonnadan ortiq chiqindi yig'iladi.",
    icon: <Factory />,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    advice: [
      { icon: <Recycle />, title: "3R Tamoyili", text: "Reduce (kamaytirish), Reuse (qayta ishlatish), Recycle (qayta ishlash) qoidasiga amal qiling." },
      { icon: <Trash2 />, title: "Saralash", text: "Chiqindilarni hech bo'lmaganda plastik, qog'oz va organik turlarga ajratib tashlashni odat qiling." },
      { icon: <ShoppingBagIcon />, title: "Eko-sumka", text: "Polietilen paketlardan butunlay voz keching va matoli sumkalardan foydalaning." }
    ]
  }
];

const Problems: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<ProblemAnalysis | null>(null);
  const [showAdvice, setShowAdvice] = useState(false);

  const handleOpenModal = (problem: ProblemAnalysis) => {
    setSelectedProblem(problem);
    setShowAdvice(false);
  };

  const handleCloseModal = () => {
    setSelectedProblem(null);
    setShowAdvice(false);
  };

  return (
    <div className="pt-24 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <ShieldAlert size={14} /> Global va Mintaqaviy xavflar
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter italic leading-none">Vaziyat <span className="text-rose-600">Tahlili</span></h2>
          <p className="text-xl text-slate-500 font-medium italic max-w-3xl leading-relaxed">
            Bizning atrofimizdagi ekologik holat qanday? Ushbu bo'limda eng og'riqli nuqtalar bo'yicha ilmiy tahlillarni o'rganasiz.
          </p>
        </div>

        {/* Orol Dengizi Tahlili Section */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-xs font-black uppercase tracking-widest">
              <AlertTriangle size={16} /> ASLIY FOJIA: OROL DENGIZI
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter italic">Dengizning <br /> O'lik Sahroga <br /> Aylanishi</h3>
            <p className="text-slate-500 leading-relaxed font-medium text-lg italic">
              Orol fojiasi insoniyat tarixidagi eng yirik ekologik halokatdir. Bir paytlar dunyodagi to'rtinchi yirik ko'l bo'lgan Orol bugun 90% suvidan ayrildi.
            </p>
            <div className="bg-white p-10 rounded-[48px] border-l-[12px] border-rose-500 shadow-3xl shadow-rose-100/50">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600"><Info size={24} /></div>
                 <h4 className="font-black text-slate-900 text-xl italic uppercase tracking-tighter">Oqibatlar tahlili:</h4>
               </div>
               <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full mt-2" />
                    <p className="text-slate-600 font-bold italic text-sm">Har yili Orol tubidan 75 million tonna zaharli tuz va chang atmosferaga ko'tariladi.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full mt-2" />
                    <p className="text-slate-600 font-bold italic text-sm">Iqlim kontinentallashib bormoqda: yoz yanada issiq, qish yanada sovuq.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full mt-2" />
                    <p className="text-slate-600 font-bold italic text-sm">Hududda yashovchi aholi orasida nafas yo'llari va onkologik kasalliklar ko'paygan.</p>
                  </div>
               </div>
            </div>
          </div>
          <div className="bg-white p-10 md:p-14 rounded-[64px] border border-slate-50 shadow-3xl relative">
             <div className="absolute top-8 right-12 flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest">
                <TrendingUp size={14} /> Inqiroz dinamikasi
             </div>
             <h4 className="text-2xl font-black text-slate-900 mb-12 text-center italic tracking-tighter">Suv sathining kamayishi (mlrd m³)</h4>
             <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'black', fontSize: 12}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'black'}} />
                   <Tooltip 
                     cursor={{fill: '#f8fafc'}}
                     contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', padding: '20px'}} 
                   />
                   <Bar dataKey="level" fill="#0ea5e9" radius={[15, 15, 0, 0]} barSize={60} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
             <p className="mt-10 text-[10px] text-slate-400 text-center font-black uppercase tracking-[0.3em]">Manba: O'zgidromet va Xalqaro monitoring markazi</p>
          </div>
        </div>

        {/* Boshqa Muammolar Grid */}
        <div className="grid md:grid-cols-3 gap-10">
           {PROBLEMS_DATA.map((problem) => (
             <div 
              key={problem.id}
              className="p-12 bg-white rounded-[56px] border border-slate-50 shadow-sm hover:shadow-3xl hover:-translate-y-2 transition-all group flex flex-col"
             >
                <div className={`w-20 h-20 ${problem.bgColor} rounded-3xl flex items-center justify-center mb-10 ${problem.color} group-hover:rotate-12 transition-transform shadow-sm`}>
                  {React.cloneElement(problem.icon as React.ReactElement, { size: 40 })}
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tighter">{problem.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium italic">{problem.shortDesc}</p>
                <button 
                  onClick={() => handleOpenModal(problem)}
                  className={`mt-auto ${problem.color} font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-3 group-hover:gap-6 transition-all`}
                >
                  Vaziyat tahlili <ArrowRight size={18} />
                </button>
             </div>
           ))}
        </div>
      </div>

      {/* Batafsil Tahlil va Maslahat Modali */}
      {selectedProblem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in" onClick={handleCloseModal} />
           <div className="relative bg-white w-full max-w-4xl max-h-full overflow-y-auto no-scrollbar rounded-[64px] shadow-3xl animate-in zoom-in duration-500">
              <button 
                onClick={handleCloseModal} 
                className="absolute top-8 right-8 z-50 p-4 bg-slate-100 text-slate-500 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-xl"
              >
                <X size={24} />
              </button>

              <div className="p-12 md:p-20">
                 <div className={`w-24 h-24 ${selectedProblem.bgColor} ${selectedProblem.color} rounded-[32px] flex items-center justify-center mb-10 shadow-xl`}>
                    {React.cloneElement(selectedProblem.icon as React.ReactElement, { size: 48 })}
                 </div>
                 
                 <div className="flex items-center gap-3 mb-6">
                    <div className="px-5 py-2 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em]">
                      {showAdvice ? 'EKO-MASLAHATLAR' : 'EKSPERT TAHLILI'}
                    </div>
                    {!showAdvice && <div className="flex items-center gap-2 text-slate-400 font-bold text-xs"><MapPin size={14} /> Mintaqaviy Vaziyat</div>}
                 </div>

                 <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-12 tracking-tighter italic leading-none">{selectedProblem.title}</h2>
                 
                 {!showAdvice ? (
                   <div className="animate-in fade-in slide-in-from-right-4">
                     <div className="bg-rose-50 p-8 rounded-[40px] mb-12 border-l-8 border-rose-500 flex items-center gap-6">
                        <AlertTriangle className="text-rose-600 shrink-0" size={32} />
                        <p className="text-rose-900 font-black italic text-lg">{selectedProblem.stats}</p>
                     </div>

                     <div className="prose prose-xl max-w-none text-slate-600 font-medium leading-relaxed italic whitespace-pre-wrap">
                        {selectedProblem.fullAnalysis}
                     </div>

                     <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Harakatga tushing</p>
                           <p className="text-slate-900 font-black text-xl italic">Siz nima qila olasiz?</p>
                        </div>
                        <button 
                          onClick={() => setShowAdvice(true)}
                          className="px-12 py-6 bg-emerald-600 text-white rounded-[32px] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-emerald-500 transition-all flex items-center gap-4"
                        >
                           Eko-Maslahatlarni ko'rish <ArrowRight size={20} />
                        </button>
                     </div>
                   </div>
                 ) : (
                   <div className="animate-in fade-in slide-in-from-left-4">
                      <div className="grid gap-6 mb-12">
                        {selectedProblem.advice.map((item, idx) => (
                          <div key={idx} className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 flex flex-col md:flex-row items-center gap-8 group hover:bg-white hover:shadow-2xl transition-all">
                             <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                                {React.cloneElement(item.icon as React.ReactElement, { size: 32 })}
                             </div>
                             <div>
                                <h4 className="text-2xl font-black text-slate-900 mb-2 italic tracking-tighter">{item.title}</h4>
                                <p className="text-slate-600 font-medium leading-relaxed italic">{item.text}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => setShowAdvice(false)}
                        className="px-12 py-6 bg-slate-100 text-slate-900 rounded-[32px] font-black uppercase text-xs tracking-[0.3em] hover:bg-slate-200 transition-all flex items-center gap-4"
                      >
                         <ArrowLeft size={20} /> Tahlilga qaytish
                      </button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Problems;
