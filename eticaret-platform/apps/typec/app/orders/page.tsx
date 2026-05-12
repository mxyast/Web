"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Package, ChevronRight, Clock, CheckCircle2 } from "lucide-react";

export default function MyOrdersPage() {
  // Mock orders
  const orders = [
    {
      id: "ORD-12345",
      date: "08.05.2026",
      total: 1249.00,
      status: "Kargoya Verildi",
      items: [
        { name: "Baseus GaN5 Pro 100W", quantity: 1 }
      ]
    }
  ];

  return (
    <>
      <main className="flex-1 py-12 md:py-20 pt-32">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="flex items-center justify-between mb-12">
              <h1 className="text-3xl font-black tracking-tight">Siparişlerim</h1>
              <div className="flex gap-4">
                 <button className="text-[10px] font-black uppercase tracking-widest text-black border-b-2 border-black pb-1">Tümü</button>
                 <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 pb-1">Devam Eden</button>
                 <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 pb-1">İptal/İade</button>
              </div>
           </div>

           {orders.length > 0 ? (
             <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-[2rem] border border-gray-100 p-8 hover:shadow-2xl hover:shadow-gray-100 transition-all group">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-[var(--color-neon-blue)]">
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
                              <div className="flex items-center gap-2 text-green-600">
                                 <CheckCircle2 className="w-4 h-4" />
                                 <span className="text-xs font-bold">{order.status}</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Toplam</p>
                              <p className="font-black text-lg">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(order.total)}</p>
                           </div>
                           <Link href={`/orders/${order.id}`} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                              <ChevronRight className="w-5 h-5" />
                           </Link>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-6" />
                <h2 className="text-xl font-bold mb-2">Henüz Siparişiniz Yok</h2>
                <p className="text-gray-500 text-sm mb-8">Haydi, yeni bir şeyler keşfedelim!</p>
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
