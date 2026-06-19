"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Package, ChevronDown, ChevronUp, Clock, CheckCircle2, Box } from "lucide-react";

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState("Tümü");

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Mock orders
  const allOrders = [
    {
      id: "ORD-12345",
      date: "08.05.2026",
      total: 1249.00,
      status: "Kargoya Verildi",
      type: "Devam Eden",
      items: [
        { 
          id: "item-1",
          name: "Baseus GaN5 Pro 100W Hızlı Şarj Cihazı", 
          variant: "Siyah", 
          quantity: 1, 
          price: 1249.00, 
          image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=600" 
        }
      ]
    },
    {
      id: "ORD-12346",
      date: "01.05.2026",
      total: 599.00,
      status: "İptal Edildi",
      type: "İptal/İade",
      items: [
        { 
          id: "item-2",
          name: "Baseus Type-C Örgülü Kablo 100W", 
          variant: "Beyaz, 2 Metre", 
          quantity: 2, 
          price: 299.50, 
          image: "https://images.unsplash.com/photo-1546868831-71cd00a21960?q=80&w=600" 
        }
      ]
    }
  ];

  const orders = allOrders.filter((order) => {
    if (activeTab === "Tümü") return true;
    return order.type === activeTab;
  });

  const tabs = ["Tümü", "Devam Eden", "İptal/İade"];

  return (
    <>
      <main className="flex-1 py-12 md:py-20 pt-32">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="flex items-center justify-between mb-12">
              <h1 className="text-3xl font-black tracking-tight">Siparişlerim</h1>
              <div className="flex gap-4">
                 {tabs.map((tab) => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`text-[10px] font-black uppercase tracking-widest pb-1 transition-all ${activeTab === tab ? "text-black border-b-2 border-black" : "text-gray-400 hover:text-black"}`}
                   >
                     {tab}
                   </button>
                 ))}
              </div>
           </div>

           {orders.length > 0 ? (
             <div className="space-y-6">
                {orders.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  
                  return (
                    <div key={order.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 hover:border-gray-200 transition-all overflow-hidden group">
                       <div 
                         className="flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                         onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                       >
                          <div className="flex items-center gap-6">
                             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${order.type === 'İptal/İade' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-[var(--color-neon-blue)]'}`}>
                                <Package className="w-8 h-8" />
                             </div>
                             <div>
                                <p className="font-black text-sm mb-1">{order.id}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.date} • {order.items.length} Ürün</p>
                             </div>
                          </div>

                          <div className="flex items-center gap-12">
                             <div className="text-right hidden md:block">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Durum</p>
                                <div className={`flex items-center gap-2 ${order.type === 'İptal/İade' ? 'text-red-500' : 'text-green-600'}`}>
                                   {order.type === 'İptal/İade' ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                   <span className="text-xs font-bold">{order.status}</span>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Toplam</p>
                                <p className="font-black text-lg">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(order.total)}</p>
                             </div>
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-black text-white' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                             </div>
                          </div>
                       </div>
                       
                       {/* Expanded Order Details */}
                       {isExpanded && (
                         <div className="mt-8 pt-8 border-t border-gray-100 animate-in slide-in-from-top-4 fade-in duration-300">
                           <h4 className="text-sm font-black mb-6">Sipariş Detayı</h4>
                           <div className="space-y-4">
                             {order.items.map((item) => (
                               <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50">
                                 <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 overflow-hidden shrink-0">
                                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                   <p className="font-bold text-sm truncate">{item.name}</p>
                                   <p className="text-[11px] text-gray-500 mt-1">{item.variant}</p>
                                 </div>
                                 <div className="text-right shrink-0">
                                   <p className="text-xs font-black">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(item.price)}</p>
                                   <p className="text-[10px] text-gray-400 font-bold mt-1">Adet: {item.quantity}</p>
                                 </div>
                               </div>
                             ))}
                           </div>
                           
                           {/* Action Buttons for the order */}
                           <div className="flex items-center justify-end gap-3 mt-6">
                             {order.type === 'Devam Eden' && (
                               <button className="px-6 py-2.5 rounded-full border border-gray-200 text-xs font-bold hover:border-black transition-colors">
                                 Kargomu Takip Et
                               </button>
                             )}
                             <button className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors">
                               Faturayı İndir
                             </button>
                           </div>
                         </div>
                       )}
                    </div>
                  );
                })}
             </div>
           ) : (
             <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-6" />
                <h2 className="text-xl font-bold mb-2">Henüz Siparişiniz Yok</h2>
                <p className="text-gray-500 text-sm mb-8">Bu kategoride gösterilecek sipariş bulunamadı.</p>
                <Link href="/" className="inline-block px-8 py-3 bg-black text-white rounded-full font-bold text-sm">
                   Alışverişe Başla
                </Link>
             </div>
           )}
        </div>
      </main>
    </>
  );
}
