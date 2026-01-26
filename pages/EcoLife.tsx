
import React from 'react';
import { ECO_TIPS } from '../constants';
import CarbonCalculator from '../components/CarbonCalculator';
import { Lightbulb, Droplets, Trash2, Zap } from 'lucide-react';

const EcoLife: React.FC = () => {
  return (
    <div className="pt-24 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Yashil Hayot</h2>
          <p className="text-xl text-slate-600">Kundalik odatlaringiz orqali sayyoramizni asrang.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Tips Section */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Foydali maslahatlar</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {ECO_TIPS.map((tip) => (
                <div key={tip.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-2xl">
                    {tip.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{tip.title}</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">{tip.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-emerald-600 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-emerald-100">
               <div className="relative z-10">
                 <h4 className="text-2xl font-bold mb-4">Plastikdan voz kechishning 5 yo‘li</h4>
                 <ul className="space-y-3 opacity-90 font-medium">
                   <li>• Shaxsiy matoli sumka bilan harid qiling</li>
                   <li>• Qayta ishlatiladigan shisha idishlardan foydalaning</li>
                   <li>• Bir marta ishlatiladigan idishlardan voz keching</li>
                   <li>• Qadoqsiz mahsulotlarni tanlang</li>
                   <li>• Plastikni saralab topshirishni odat qiling</li>
                 </ul>
               </div>
               <div className="absolute right-[-20px] bottom-[-20px] opacity-20 scale-150">
                 <Trash2 size={200} />
               </div>
            </div>
          </div>

          {/* Calculator Section */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CarbonCalculator />
            <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Lightbulb size={20} /> Bilasizmi?
              </h4>
              <p className="text-blue-800 text-sm leading-relaxed font-medium">
                O‘rtacha bir kishi yiliga 4.5 tonna CO2 chiqaradi. Bu 200 ta katta daraxt bir yil davomida yutadigan karbonat angidrid miqdoriga teng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoLife;
