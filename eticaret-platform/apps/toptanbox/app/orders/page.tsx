"use client";

import React from "react";
import { FileText, Package, ChevronRight, Clock, Banknote, CreditCard } from "lucide-react";

export default function B2BOrdersPage() {
  // Mock B2B orders
  const orders = [
    {
      id: "TB-98765",
      date: "09.05.2026",
      total: 45432.00,
      status: "Onay Bekliyor",
      method: "Havale / EFT",
      isB2B: true
    }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Onay Bekliyor": return "bg-orange-50 text-orange-600 border-orange-100";
      case "Ödeme Bekliyor": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Tamamlandı": return "bg-green-50 text-green-600 border-green-100";
      default: return "bg-gray-50 text-gray-400 border-gray-100";
    }
  };

  return (
    <>
      <main className="flex-1 py-12 md:py-20 pt-36 md:pt-40">
        <div className="container mx-auto px-4">
           <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                 <h1 className="text-3xl font-black tracking-tight text-slate-900">Siparişlerim & Faturalar</h1>
                 <div className="flex gap-2 bg-white p-1 rounded-2xl border border-gray-100">
                    <button className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-widest transition-all">Tümü</button>
                    <button className="px-6 py-2 rounded-xl text-gray-400 hover:text-black text-xs font-bold uppercase tracking-widest transition-all">Aktif</button>
                    <button className="px-6 py-2 rounded-xl text-gray-400 hover:text-black text-xs font-bold uppercase tracking-widest transition-all">Faturalar</button>
                 </div>
              </div>

              {orders.length > 0 ? (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100">
                         <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Sipariş No</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Tarih</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Ödeme</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Toplam</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Durum</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">İşlem</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {orders.map((order) => (
                           <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                       <Package className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-sm text-slate-900">{order.id}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-sm text-slate-600 font-medium">{order.date}</td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                    {order.method === "Havale / EFT" ? <Banknote className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                                    {order.method}
                                 </div>
                              </td>
                              <td className="px-8 py-6 font-black text-sm text-slate-900">
                                 {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(order.total)}
                              </td>
                              <td className="px-8 py-6">
                                 <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${getStatusStyle(order.status)}`}>
                                    {order.status === "Onay Bekliyor" && <Clock className="w-3 h-3" />}
                                    {order.status}
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400" title="Detay">
                                       <ChevronRight className="w-5 h-5" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              ) : (
                <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100">
                   <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Sipariş Bulunamadı</p>
                </div>
              )}

              <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                 <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-[var(--color-toptan-orange)] rounded-2xl flex items-center justify-center shadow-xl shadow-orange-900/40">
                       <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black mb-1">Toplu Fatura İndir</h3>
                       <p className="text-slate-400 text-sm">Seçili siparişlerinizin faturalarını tek bir PDF olarak indirebilirsiniz.</p>
                    </div>
                 </div>
                 <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all relative z-10">
                    Faturaları Hazırla
                 </button>
              </div>
           </div>
        </div>
      </main>
    </>
  );
}
