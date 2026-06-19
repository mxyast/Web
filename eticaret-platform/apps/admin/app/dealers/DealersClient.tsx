"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Search, Edit, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createDealerAction, updateDealerAction, DealerInput } from "./actions";

export function DealersClient({ initialDealers }: { initialDealers: any[] }) {
  const [dealers, setDealers] = useState(initialDealers);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDealerId, setEditingDealerId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<DealerInput>({
    name: "",
    email: "",
    password: "",
    companyName: "",
    taxOffice: "",
    taxNumber: "",
    priceList: "LIST_A",
    creditLimit: 0,
    isApproved: false,
  });

  const filteredDealers = dealers.filter((d) => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.b2bProfile?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenNew = () => {
    setEditingDealerId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      companyName: "",
      taxOffice: "",
      taxNumber: "",
      priceList: "LIST_A",
      creditLimit: 0,
      isApproved: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dealer: any) => {
    setEditingDealerId(dealer.id);
    setFormData({
      name: dealer.name || "",
      email: dealer.email || "",
      password: "", // Leave blank for edit unless changing
      companyName: dealer.b2bProfile?.companyName || "",
      taxOffice: dealer.b2bProfile?.taxOffice || "",
      taxNumber: dealer.b2bProfile?.taxNumber || "",
      priceList: dealer.b2bProfile?.priceList || "LIST_A",
      creditLimit: Number(dealer.b2bProfile?.creditLimit) || 0,
      isApproved: dealer.b2bProfile?.isApproved || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = editingDealerId 
        ? await updateDealerAction(editingDealerId, formData)
        : await createDealerAction(formData);

      if (res.success) {
        setIsModalOpen(false);
        // Refresh page to get latest data from server component
        window.location.reload();
      } else {
        alert(res.error);
      }
    } catch (err) {
      alert("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Toplam Bayi</p>
            <p className="text-3xl font-black">{dealers.length}</p>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Onay Bekleyen</p>
            <p className="text-3xl font-black text-orange-500">{dealers.filter(d => !d.b2bProfile?.isApproved).length}</p>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Aktif Bayiler</p>
            <p className="text-3xl font-black text-green-500">{dealers.filter(d => d.b2bProfile?.isApproved).length}</p>
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex items-center justify-between flex-wrap gap-4">
            <div className="relative">
               <input 
                 type="text" 
                 placeholder="Bayi veya firma ara..." 
                 className="bg-gray-100 rounded-full py-2.5 px-10 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-72"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button 
              onClick={handleOpenNew}
              className="bg-blue-600 text-white text-xs font-black px-6 py-3 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <span>+</span> Yeni Bayi Ekle
            </button>
         </div>

         <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                 <tr>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Bayi Bilgisi</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Firma / Vergi No</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Grup / Limit</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Durum</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Eylem</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {filteredDealers.map((dealer) => (
                   <tr key={dealer.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                               {dealer.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                               <p className="font-bold text-sm text-slate-800">{dealer.name}</p>
                               <p className="text-xs text-gray-400">{dealer.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-sm font-bold text-slate-800">{dealer.b2bProfile?.companyName}</p>
                         <p className="text-xs text-gray-400">{dealer.b2bProfile?.taxOffice} - {dealer.b2bProfile?.taxNumber}</p>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-sm font-black text-blue-600">{dealer.b2bProfile?.priceList}</p>
                         <p className="text-xs font-bold text-gray-400">{new Intl.NumberFormat("tr-TR", { style: 'currency', currency: 'TRY' }).format(Number(dealer.b2bProfile?.creditLimit) || 0)} Limit</p>
                      </td>
                      <td className="px-8 py-6">
                         {dealer.b2bProfile?.isApproved ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                               <CheckCircle2 className="w-3 h-3" /> Aktif
                            </div>
                         ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                               <Clock className="w-3 h-3" /> Onay Bekliyor
                            </div>
                         )}
                      </td>
                      <td className="px-8 py-6">
                         <button 
                           onClick={() => handleOpenEdit(dealer)}
                           className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-all font-bold text-xs flex items-center gap-2"
                         >
                            <Edit className="w-4 h-4" /> Düzenle
                         </button>
                      </td>
                   </tr>
                 ))}
                 
                 {filteredDealers.length === 0 && (
                   <tr>
                     <td colSpan={5} className="px-8 py-12 text-center text-gray-400 text-sm font-bold">
                       Aranan kriterlere uygun bayi bulunamadı.
                     </td>
                   </tr>
                 )}
              </tbody>
           </table>
         </div>
      </div>

      {/* Bayi Ekle / Düzenle Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-black text-slate-800">
                  {editingDealerId ? "Bayi Profilini Düzenle" : "Yeni B2B Bayi Ekle"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar">
                <form id="dealerForm" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Yetkili Bilgileri */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4 flex items-center gap-2">
                      <span className="w-5 h-px bg-blue-100"></span> Yetkili Bilgileri
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Ad Soyad</label>
                        <input required type="text" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">E-Posta Adresi</label>
                        <input required type="email" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">
                          Giriş Şifresi {editingDealerId && <span className="text-gray-400 normal-case font-medium">(Değiştirmek istemiyorsanız boş bırakın)</span>}
                        </label>
                        <input required={!editingDealerId} type="text" placeholder={editingDealerId ? "Yeni şifre belirle (opsiyonel)" : "Güçlü bir şifre belirleyin"} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* Firma Bilgileri */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-4 mt-8 flex items-center gap-2">
                      <span className="w-5 h-px bg-orange-100"></span> Firma Bilgileri (B2B Profile)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Firma Unvanı</label>
                        <input required type="text" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Vergi Dairesi</label>
                        <input required type="text" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all" value={formData.taxOffice} onChange={e => setFormData({...formData, taxOffice: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Vergi / TCKN No</label>
                        <input required type="text" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all" value={formData.taxNumber} onChange={e => setFormData({...formData, taxNumber: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* ToptanBox Ayarları */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-4 mt-8 flex items-center gap-2">
                      <span className="w-5 h-px bg-green-100"></span> ToptanBox Satış Ayarları
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Fiyat Listesi Grubu</label>
                        <select className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-green-500 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all" value={formData.priceList} onChange={e => setFormData({...formData, priceList: e.target.value})}>
                          <option value="LIST_A">Liste A (Standart B2B)</option>
                          <option value="LIST_B">Liste B (Gümüş Bayi)</option>
                          <option value="LIST_C">Liste C (Altın Bayi)</option>
                          <option value="LIST_D">Liste D (Platin Bayi)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-1.5 block">Açık Hesap (Cari) Limiti (TL)</label>
                        <input required type="number" min="0" step="1000" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-green-500 rounded-xl px-4 py-2.5 text-sm font-black text-slate-700 outline-none transition-all" value={formData.creditLimit} onChange={e => setFormData({...formData, creditLimit: Number(e.target.value)})} />
                      </div>
                      <div className="md:col-span-2 mt-2">
                        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors border border-transparent">
                          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isApproved ? "bg-green-500" : "bg-gray-300"}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.isApproved ? "translate-x-4" : "translate-x-0"}`} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">Bayi Aktif ve Onaylı</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Kapalıysa bayi sisteme giriş yapamaz ve sipariş veremez.</p>
                          </div>
                          <input type="checkbox" className="hidden" checked={formData.isApproved} onChange={e => setFormData({...formData, isApproved: e.target.checked})} />
                        </label>
                      </div>
                    </div>
                  </div>

                </form>
              </div>

              <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
                  İptal
                </button>
                <button 
                  type="submit" 
                  form="dealerForm" 
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-slate-900 text-white text-xs font-black rounded-full hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Kaydediliyor..." : (editingDealerId ? "Değişiklikleri Kaydet" : "Bayiyi Sisteme Ekle")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
