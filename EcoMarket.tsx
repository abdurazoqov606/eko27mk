
import React from 'react';
import { User } from '../types';
import { ShoppingBag, Coins, Sparkles, Gift, Package, ShieldCheck, ArrowRight, Star } from 'lucide-react';

const MARKET_ITEMS = [
  { id: 1, name: "27-Maktab Eko-Sumkasi", price: 500, category: "Aksesuar", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600", stock: 12 },
  { id: 2, name: "Yashil Dunyo Kitobi", price: 300, category: "Bilim", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600", stock: 5 },
  { id: 3, name: "Eko-Stikerlar To'plami", price: 100, category: "Aksesuar", image: "https://images.unsplash.com/photo-1572375927902-1c09e4d5d5cc?q=80&w=600", stock: 45 },
  { id: 4, name: "Daraxt Ekish Sertifikati", price: 200, category: "Harakat", image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600", stock: 100 },
];

interface MarketProps {
  user: User | null;
}

const EcoMarket: React.FC<MarketProps> = ({ user }) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          <Sparkles size={14} /> Mehnat qil, ball to'pla, sovg'a yut!
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">Eko-Market</h2>
              <p className="text-slate-500 font-medium max-w-2xl">To'plagan ballaringizni real eko-mahsulotlarga va 27-maktabning esdalik sovg'alariga almashtiring.</p>
           </div>
           <div className="bg-slate-900 text-white p-6 rounded-[32px] flex items-center gap-6 shadow-2xl border border-slate-800">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                 <Coins size={28} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Sizning balingiz</p>
                 <h4 className="text-3xl font-black text-emerald-500">{user?.points || 0} ball</h4>
              </div>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
         {MARKET_ITEMS.map((item) => (
           <div key={item.id} className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl hover:border-emerald-300 transition-all group flex flex-col">
              <div className="h-56 relative overflow-hidden">
                 <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                 <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[9px] font-black uppercase text-slate-900 tracking-widest shadow-sm">
                       {item.category}
                    </span>
                 </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                 <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{item.name}</h3>
                 <div className="flex items-center gap-1.5 mb-6">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-400">Qolgan: {item.stock} ta</span>
                 </div>
                 <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="text-2xl font-black text-emerald-600">{item.price} <span className="text-[10px] uppercase">ball</span></div>
                    <button 
                      disabled={(user?.points || 0) < item.price}
                      className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        (user?.points || 0) >= item.price 
                          ? 'bg-slate-900 text-white hover:bg-emerald-600' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Almashtirish
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      <div className="mt-20 p-12 bg-emerald-600 rounded-[56px] text-white relative overflow-hidden shadow-3xl">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
         <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
               <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tighter">Yaqinda: Premium Sovg'alar</h3>
               <p className="text-emerald-50 text-xl font-medium mb-10 leading-relaxed">
                  Yil yakunida eng faol 3 ta o'quvchi uchun noutbuk va planshetlar tayyorlab qo'yilgan! Harakatni hozirdan boshlang.
               </p>
               <button className="px-10 py-5 bg-white text-emerald-600 rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl">
                  Musobaqalarga o'tish <ArrowRight size={20} />
               </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-8 bg-white/10 backdrop-blur rounded-[40px] border border-white/20">
                  <Package size={48} className="text-amber-400 mb-4" />
                  <h4 className="text-2xl font-black">Eko-Box</h4>
                  <p className="text-emerald-100 text-xs font-medium">1500 ball</p>
               </div>
               <div className="p-8 bg-white/10 backdrop-blur rounded-[40px] border border-white/20">
                  <ShieldCheck size={48} className="text-blue-400 mb-4" />
                  <h4 className="text-2xl font-black">V.I.P Card</h4>
                  <p className="text-emerald-100 text-xs font-medium">3000 ball</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default EcoMarket;
