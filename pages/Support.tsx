
import React from 'react';
import { Send, Instagram, Youtube, Globe, Phone, Mail, HelpCircle, ShieldCheck, ExternalLink, Copyright } from 'lucide-react';

const LOGO_URL = "https://raw.githubusercontent.com/abdurazoqov606/Hyt/main/IMG_20260201_092843.png";

const Support: React.FC = () => {
  const socialLinks = [
    { name: 'Telegram Bot', icon: <Send size={28} />, handle: '@EKO27bot', url: 'https://t.me/EKO27bot', color: 'bg-blue-500' },
    { name: 'Instagram', icon: <Instagram size={28} />, handle: '@abdurazoqov_edits', url: 'https://instagram.com/abdurazoqov_edits', color: 'bg-rose-500' },
    { name: 'YouTube', icon: <Youtube size={28} />, handle: '@abdurozoqov_edits', url: 'https://youtube.com/@abdurozoqov_edits', color: 'bg-red-600' },
    { name: 'Veb-sayt', icon: <Globe size={28} />, handle: 'eko27mk.uz', url: 'https://eko27mk.vercel.app/', color: 'bg-emerald-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto pt-4 pb-20 animate-fade-in flex flex-col min-h-[85vh]">
      
      {/* Header */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          <HelpCircle size={14} /> Markaziy Yordam Bo'limi
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">Bog'lanish va Yordam</h2>
        <p className="text-slate-500 font-medium max-w-2xl text-lg italic">Bizning jamoamiz har qanday ekologik tashabbusingizni qo'llab-quvvatlashga shay!</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10 mb-20">
        
        {/* Author Contact Card */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-slate-900 rounded-[56px] p-10 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent" />
              <div className="relative z-10 text-center">
                 <div className="relative inline-block mb-8">
                    <div className="w-44 h-44 rounded-[48px] border-4 border-emerald-500 shadow-2xl bg-white p-4 overflow-hidden flex items-center justify-center">
                       <img src={LOGO_URL} className="w-full h-full object-contain" alt="EKO 27 Logo" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white p-4 rounded-3xl shadow-2xl border-4 border-slate-900">
                       <ShieldCheck size={28} />
                    </div>
                 </div>
                 <h3 className="text-3xl font-black mb-2 tracking-tighter uppercase italic">EKO 27 Jamoasi</h3>
                 <p className="text-emerald-500 font-black uppercase text-[10px] tracking-widest mb-10">Loyiha Muallifi: Abdurazoqov Abbos</p>
                 
                 <div className="space-y-4">
                    <a href="https://t.me/vsf911" target="_blank" className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-xl">
                       <Send size={20} /> Shaxsiy Telegram
                    </a>
                    <a href="tel:+998901234567" className="w-full py-5 bg-white/5 text-slate-400 rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all border border-white/5">
                       <Phone size={20} /> Qo'ng'iroq qilish
                    </a>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[48px] p-10 shadow-xl border border-slate-50 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                 <Mail size={32} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">E-mail Manzil</h4>
              <p className="text-slate-500 font-bold mb-4 italic truncate">usarovabdurahmon71@gmail.com</p>
              <a href="mailto:usarovabdurahmon71@gmail.com" className="text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline flex items-center justify-center gap-2">
                 Xat yuborish <ExternalLink size={14} />
              </a>
           </div>
        </div>

        {/* Social Networks */}
        <div className="lg:col-span-2">
           <div className="bg-white rounded-[56px] p-10 md:p-12 shadow-xl border border-slate-50 h-full flex flex-col">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-10 italic">Ijtimoiy Sahifalarimiz</h3>
              <div className="grid sm:grid-cols-2 gap-6 flex-grow">
                 {socialLinks.map((social, i) => (
                   <a 
                    key={i} 
                    href={social.url} 
                    target="_blank"
                    className="flex items-center gap-6 p-8 bg-slate-50 rounded-[32px] hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-slate-100 group"
                   >
                     <div className={`w-16 h-16 ${social.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                        {social.icon}
                     </div>
                     <div>
                        <div className="font-black text-slate-900 text-lg leading-none mb-1">{social.name}</div>
                        <div className="text-slate-400 font-bold text-sm">{social.handle}</div>
                     </div>
                   </a>
                 ))}
              </div>
              
              <div className="mt-12 p-8 bg-slate-900 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <Copyright className="text-emerald-500" size={32} />
                    <div>
                       <h4 className="font-black text-lg tracking-tight uppercase">Mualliflik Huquqi</h4>
                       <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Barcha huquqlar himoyalangan © 2026 EKO 27</p>
                    </div>
                 </div>
                 <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                    SECURE ECOSYSTEM v2.7
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-10 border-t border-slate-200 text-center">
         <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.5em]">Tayloq tumani 27-maktab o'quvchilari loyihasi</p>
      </div>
    </div>
  );
};

export default Support;
