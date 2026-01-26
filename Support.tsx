
import React from 'react';
import { Send, Instagram, Youtube, Globe, MessageSquare, Phone, Mail, HelpCircle, ArrowRight, Sparkles, User, ShieldCheck } from 'lucide-react';

const Support: React.FC = () => {
  const socialLinks = [
    { name: 'Telegram', icon: <Send size={28} />, handle: '@vsf911', url: 'https://t.me/vsf911', color: 'bg-blue-500' },
    { name: 'Instagram', icon: <Instagram size={28} />, handle: '@eco_qadam', url: '#', color: 'bg-rose-500' },
    { name: 'YouTube', icon: <Youtube size={28} />, handle: 'EcoQadam TV', url: '#', color: 'bg-red-600' },
    { name: 'Veb-sayt', icon: <Globe size={28} />, handle: 'eko27mk.uz', url: 'https://eko27mk.vercel.app/', color: 'bg-emerald-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto pt-4 pb-20 animate-fade-in">
      
      {/* Header */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          <HelpCircle size={14} /> Markaziy Yordam Bo'limi
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">Bog'lanish va Yordam</h2>
        <p className="text-slate-500 font-medium max-w-2xl text-lg">Bizning jamoamiz har qanday ekologik tashabbusingizni qo'llab-quvvatlashga shay!</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Author Contact Card */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-slate-900 rounded-[56px] p-10 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent" />
              <div className="relative z-10 text-center">
                 <div className="relative inline-block mb-8">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abbos" className="w-40 h-40 rounded-[48px] border-4 border-emerald-500 shadow-2xl object-cover bg-white p-2" alt="Author" />
                    <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white p-4 rounded-3xl shadow-2xl">
                       <ShieldCheck size={28} />
                    </div>
                 </div>
                 <h3 className="text-3xl font-black mb-2 tracking-tighter">Abdurazoqov Abbos</h3>
                 <p className="text-emerald-500 font-black uppercase text-[10px] tracking-widest mb-10">Loyiha Muallifi va Rahbari</p>
                 
                 <div className="space-y-4">
                    <a href="https://t.me/vsf911" target="_blank" className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-xl">
                       <Send size={20} /> Telegram orqali yozish
                    </a>
                    <button className="w-full py-5 bg-white/5 text-slate-400 rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all border border-white/5">
                       <Phone size={20} /> Qo'ng'iroq qilish
                    </button>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[48px] p-10 shadow-xl border border-slate-50 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                 <Mail size={32} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">E-mail Manzil</h4>
              <p className="text-slate-500 font-bold mb-4">abbos@ecoqadam.uz</p>
              <button className="text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline">Xat yuborish</button>
           </div>
        </div>

        {/* Social Networks & FAQ */}
        <div className="lg:col-span-2 space-y-10">
           {/* Social Grid */}
           <div className="bg-white rounded-[56px] p-10 md:p-12 shadow-xl border border-slate-50">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-10">Bizning Ijtimoiy Sahifalarimiz</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                 {socialLinks.map((social, i) => (
                   <a 
                    key={i} 
                    href={social.url} 
                    target="_blank"
                    className="flex items-center gap-6 p-6 bg-slate-50 rounded-[32px] hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-slate-100 group"
                   >
                     <div className={`w-16 h-16 ${social.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                        {social.icon}
                     </div>
                     <div>
                        <div className="font-black text-slate-900 text-lg leading-none mb-1">{social.name}</div>
                        <div className="text-slate-400 font-bold text-sm">{social.handle}</div>
                     </div>
                     <ArrowRight className="ml-auto text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all" />
                   </a>
                 ))}
              </div>
           </div>

           {/* AI Help Section */}
           <div className="bg-emerald-600 rounded-[56px] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                 <div className="flex-grow text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                       <Sparkles size={14} /> AI Support
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tighter">Savollaringizga <br /> darhol javob oling!</h3>
                    <p className="text-emerald-50 text-xl font-medium mb-10 leading-relaxed">Bizning ixtisoslashgan AI yordamchimiz 24/7 sizga xizmat qiladi. Ekologiya, loyiha va muammolar bo'yicha yozishingiz mumkin.</p>
                    <button className="px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl">
                       AI bilan suhbat <MessageSquare size={20} />
                    </button>
                 </div>
                 <div className="hidden md:block w-72 h-72 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 p-10 animate-spin-slow">
                    <HelpCircle size={192} className="text-white/30" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
