
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, MarketItem } from '../types';
import { 
  ShoppingBag, Sparkles, Package, 
  ArrowRight, Plus, X, Camera, Phone, 
  Search, Loader2, Tag, Smartphone, ExternalLink
} from 'lucide-react';

interface MarketProps {
  user: User | null;
  onLogin: () => void;
}

const EcoMarket: React.FC<MarketProps> = ({ user, onLogin }) => {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    phone: '',
    description: '',
    category: 'Boshqa'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time data sync with Firestore
  useEffect(() => {
    const q = query(collection(db, "market_items"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MarketItem)));
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) { // 800KB limit
        alert("Rasm hajmi juda katta! 800KB dan kichik rasm yuklang. Pastdagi havoladan foydalanib rasmni kichraytirishingiz mumkin.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => setPreviewImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { onLogin(); return; }
    if (!previewImage) { alert("Iltimos, mahsulot rasmini yuklang!"); return; }

    setLoading(true);
    try {
      await addDoc(collection(db, "market_items"), {
        name: formData.name,
        price: formData.price,
        phone: formData.phone,
        description: formData.description,
        category: formData.category,
        image: previewImage,
        sellerName: user.name,
        sellerId: user.id,
        timestamp: serverTimestamp()
      });
      setShowAddModal(false);
      setFormData({ name: '', price: '', phone: '', description: '', category: 'Boshqa' });
      setPreviewImage(null);
      alert("E'loningiz barcha uchun muvaffaqiyatli joylandi!");
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    }
    setLoading(false);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in pb-20 pt-4">
      {/* Header Section */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 shadow-sm">
          <Sparkles size={16} /> OCHIQ EKO-SAVDO PLATFORMASI
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
           <div className="max-w-3xl">
              <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 italic leading-none">Eko <span className="text-emerald-600">Bozor</span></h2>
              <p className="text-slate-500 font-medium text-xl italic leading-relaxed">
                Har bir foydalanuvchi o'z e'lonini qoldirishi mumkin. Tabiatga foydali mahsulotlarni soting va sotib oling.
              </p>
           </div>
           <button 
             onClick={() => user ? setShowAddModal(true) : onLogin()}
             className="px-12 py-6 bg-emerald-600 text-white rounded-[32px] font-black text-xl shadow-2xl hover:scale-105 transition-all flex items-center gap-4 group"
           >
             E'lon joylash <Plus size={28} className="group-hover:rotate-90 transition-transform" />
           </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        <div className="relative w-full md:max-w-xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Mahsulot yoki xizmat qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white rounded-[32px] border border-slate-100 shadow-xl font-bold text-slate-800 outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-[32px] shadow-lg border border-slate-50">
           <Package className="text-emerald-500" />
           <span className="font-black text-slate-900 italic uppercase text-xs tracking-widest">{items.length} ta e'lon faol</span>
        </div>
      </div>

      {/* Market Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[64px] border-2 border-dashed border-slate-100">
           <ShoppingBag size={80} className="mx-auto text-slate-100 mb-6" />
           <p className="text-slate-400 font-black uppercase tracking-[0.4em]">Hozircha e'lonlar mavjud emas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
           {filteredItems.map((item) => (
             <div key={item.id} className="bg-white rounded-[56px] overflow-hidden border border-slate-50 shadow-2xl hover:shadow-emerald-100 transition-all group flex flex-col h-full animate-in fade-in zoom-in">
                <div className="h-72 relative overflow-hidden bg-slate-50">
                   <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt={item.name} />
                   <div className="absolute top-6 left-6">
                      <span className="px-5 py-2 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-white tracking-widest shadow-lg">
                         {item.category}
                      </span>
                   </div>
                </div>
                <div className="p-10 flex-grow flex flex-col">
                   <h3 className="text-2xl font-black text-slate-900 leading-tight italic truncate mb-4 uppercase tracking-tighter">{item.name}</h3>
                   <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3 italic">
                     {item.description}
                   </p>
                   
                   <div className="mt-auto space-y-6">
                      <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Narxi</span>
                            <span className="text-3xl font-black text-emerald-600 leading-none">{item.price} <span className="text-[10px] uppercase">uzs</span></span>
                         </div>
                         <div className="text-right">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Sotuvchi</span>
                            <span className="font-bold text-slate-800 text-sm italic">{item.sellerName}</span>
                         </div>
                      </div>
                      <a 
                        href={`tel:${item.phone}`}
                        className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
                      >
                        <Phone size={18} /> {item.phone}
                      </a>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Add Ad Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-3xl rounded-[64px] shadow-3xl p-10 md:p-14 border-t-[12px] border-emerald-600 overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><Tag size={24} /></div>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">E'lon Berish</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-3 bg-slate-100 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-10">
                {/* Photo Upload Area */}
                <div className="flex flex-col gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-4 border-dashed rounded-[48px] flex flex-col items-center justify-center cursor-pointer transition-all h-[360px] relative overflow-hidden group ${
                      previewImage ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    {previewImage ? (
                      <>
                        <img src={previewImage} className="w-full h-full object-cover rounded-[40px]" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                           <Camera size={48} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-8">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <Camera size={40} />
                        </div>
                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest leading-relaxed">Rasm yuklash<br/>(800KB gacha)</p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>
                  
                  {/* Image Compressor Helper */}
                  <a 
                    href="https://mgkbares.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-all"
                  >
                    <ExternalLink size={14} /> Rasm hajmi kattami? Bu yerda kichraytiring
                  </a>
                </div>

                {/* Form Details */}
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2 mb-2">Mahsulot nomi</label>
                    <input required type="text" placeholder="Masalan: Uy ko'chati..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-500/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2 mb-2">Narxi</label>
                      <input required type="text" placeholder="50 000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-500/20" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2 mb-2">Turkum</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-black text-xs outline-none border-2 border-transparent focus:border-emerald-500/20">
                         <option>Ko'chatlar</option>
                         <option>Ikkinchi hayot</option>
                         <option>Eko-hunarmandchilik</option>
                         <option>Qayta ishlanadiganlar</option>
                         <option>Boshqa</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2 mb-2">Telefon raqam</label>
                    <div className="relative">
                       <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input required type="tel" placeholder="+998" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-500/20" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2 mb-2">Tavsif va holati</label>
                <textarea 
                  required 
                  rows={4} 
                  placeholder="Mahsulot haqida batafsil ma'lumot qoldiring..." 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full px-8 py-6 bg-slate-50 rounded-[32px] font-medium outline-none border-2 border-transparent focus:border-emerald-500/20 resize-none shadow-inner italic"
                />
              </div>

              <button disabled={loading || !previewImage} className="w-full py-7 bg-emerald-600 text-white rounded-[32px] font-black text-xl shadow-3xl flex items-center justify-center gap-4 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <>E'LONNI NASHR QILISH <ArrowRight size={24} /></>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoMarket;
