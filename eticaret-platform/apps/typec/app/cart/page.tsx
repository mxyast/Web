"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

export default function CartPage() {
   const [isMounted, setIsMounted] = useState(false);
   const items = useCartStore((state) => state.items);
   const updateQuantity = useCartStore((state) => state.updateQuantity);
   const removeItem = useCartStore((state) => state.removeItem);
   const subtotal = useCartStore((state) => state.getSubtotal());

   useEffect(() => {
      setIsMounted(true);
   }, []);

   if (!isMounted) return null; // Avoid hydration mismatch

   const shipping = subtotal > 500 || subtotal === 0 ? 0 : 49.90;
   const total = subtotal + shipping;

   return (
      <>
         <main className="flex-1 py-12 md:py-20 pt-32">
            <div className="container mx-auto px-4">
               <h1 className="text-3xl font-black mb-12 tracking-tight">Sepetim</h1>

               {items.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                     {/* Items List */}
                     <div className="lg:col-span-8 space-y-6">
                        {items.map((item) => (
                           <div key={item.id} className="flex items-center gap-6 p-6 rounded-3xl bg-[#F9F9F9] border border-[var(--color-typec-border)]">
                              <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                                 <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                              </div>

                              <div className="flex-1 min-w-0">
                                 <h3 className="font-bold text-sm truncate">{item.name}</h3>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.variantName}</p>

                                 <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center gap-3 bg-white rounded-full p-1 border border-gray-100">
                                       <button
                                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                          aria-label="Adet Azalt"
                                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                                       >
                                          <Minus className="w-3 h-3" aria-hidden="true" />
                                       </button>
                                       <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                       <button
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          aria-label="Adet Arttır"
                                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                                       >
                                          <Plus className="w-3 h-3" aria-hidden="true" />
                                       </button>
                                    </div>
                                    <button
                                       onClick={() => removeItem(item.id)}
                                       aria-label="Ürünü Sil"
                                       className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                       <Trash2 className="w-4 h-4" aria-hidden="true" />
                                    </button>
                                 </div>
                              </div>

                              <div className="text-right">
                                 <p className="font-black text-lg">
                                    {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(item.price * item.quantity)}
                                 </p>
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Summary */}
                     <div className="lg:col-span-4">
                        <div className="bg-white rounded-[2.5rem] border border-[var(--color-typec-border)] p-8 shadow-2xl shadow-gray-100">
                           <h2 className="text-xl font-black mb-8 tracking-tight">Sipariş Özeti</h2>

                           <div className="space-y-4 mb-8">
                              <div className="flex justify-between text-sm">
                                 <span className="text-gray-500 font-medium">Ara Toplam</span>
                                 <span className="font-bold">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(subtotal)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                 <span className="text-gray-500 font-medium">Kargo</span>
                                 <span className="font-bold text-green-600">{shipping === 0 ? "Ücretsiz" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(shipping)}</span>
                              </div>
                              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                 <span className="font-black text-lg">Toplam</span>
                                 <span className="font-black text-2xl text-typec-red">
                                    {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(total)}
                                 </span>
                              </div>
                           </div>

                           <Link href="/checkout">
                              <Button size="lg" className="w-full text-lg group text-typec-black bg-gray-100">
                                 Ödemeye Geç
                                 <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                           </Link>

                           <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center gap-6">
                              <img src="https://cdn.paytr.com/logos/visa.svg" alt="Visa" className="h-4 opacity-40 grayscale" />
                              <img src="https://cdn.paytr.com/logos/mastercard.svg" alt="Mastercard" className="h-4 opacity-40 grayscale" />
                              <img src="https://cdn.paytr.com/logos/troy.svg" alt="Troy" className="h-4 opacity-40 grayscale" />
                           </div>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="text-center py-24">
                     <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <ShoppingBag className="w-10 h-10 text-gray-300" />
                     </div>
                     <h2 className="text-2xl font-black mb-4">Sepetiniz Boş</h2>
                     <p className="text-gray-500 mb-10 max-w-sm mx-auto">Sepetinizde henüz ürün bulunmuyor. Keşfetmeye başlayın!</p>
                     <Link href="/products">
                        <Button className="text-typec-red" size="lg">Ürünleri İncele</Button>
                     </Link>
                  </div>
               )}
            </div>
         </main>
      </>
   );
}
