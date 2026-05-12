"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { MapPin, CreditCard, ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success

  const cartTotal = 1249.00;

  return (
    <>
      <main className="flex-1 py-12 md:py-20 pt-32">
        <div className="container mx-auto px-4 max-w-6xl">
           
           {step < 3 && (
             <div className="flex items-center justify-center gap-4 mb-16">
                <div className={`flex items-center gap-2 ${step >= 1 ? "text-black" : "text-gray-300"}`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-black text-white" : "bg-gray-100"}`}>1</div>
                   <span className="text-sm font-bold uppercase tracking-widest">Teslimat</span>
                </div>
                <div className="w-12 h-px bg-gray-100" />
                <div className={`flex items-center gap-2 ${step >= 2 ? "text-black" : "text-gray-300"}`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-black text-white" : "bg-gray-100"}`}>2</div>
                   <span className="text-sm font-bold uppercase tracking-widest">Ödeme</span>
                </div>
             </div>
           )}

           {step === 1 && (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-8 space-y-8">
                   <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                         <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <MapPin className="w-6 h-6 text-[var(--color-neon-blue)]" />
                            Teslimat Bilgileri
                         </h2>
                         <button className="text-[10px] font-black uppercase tracking-widest text-[var(--color-neon-blue)] hover:underline">Yeni Adres Ekle</button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="p-6 rounded-3xl border-2 border-black bg-gray-50/50 relative cursor-pointer">
                            <div className="absolute top-4 right-4 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                               <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                            <p className="font-bold text-sm mb-2">Ev Adresim</p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                               Meşrutiyet Mah. Halaskargazi Cad. No:123 <br/>
                               Şişli / İstanbul
                            </p>
                         </div>
                         <div className="p-6 rounded-3xl border border-gray-100 hover:border-gray-200 transition-all cursor-pointer">
                            <p className="font-bold text-sm mb-2">Ofis</p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                               Maslak Mah. Dereboyu Cad. Sun Plaza <br/>
                               Sarıyer / İstanbul
                            </p>
                         </div>
                      </div>
                   </div>

                   <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm">
                      <h2 className="text-xl font-black mb-8 tracking-tight">İletişim Bilgileri</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Input label="Telefon Numarası" placeholder="05xx xxx xx xx" defaultValue="0532 123 45 67" />
                         <Input label="E-Posta" placeholder="email@adresiniz.com" defaultValue="ahmet@example.com" />
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                   <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-2xl shadow-gray-100">
                      <h3 className="text-lg font-black mb-6">Özet</h3>
                      <div className="space-y-4 mb-8">
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">Toplam</span>
                            <span className="font-bold">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(cartTotal)}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">Kargo</span>
                            <span className="font-bold text-green-600">Ücretsiz</span>
                         </div>
                      </div>
                      <Button size="lg" className="w-full" onClick={() => setStep(2)}>Devam Et</Button>
                   </div>
                </div>
             </div>
           )}

           {step === 2 && (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-8 space-y-8">
                   <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm">
                      <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 mb-8">
                         <CreditCard className="w-6 h-6 text-[var(--color-neon-purple)]" />
                         Ödeme Yöntemi
                      </h2>

                      <div className="space-y-6">
                         <div className="p-8 rounded-[2rem] border-2 border-black bg-gray-50/50">
                            <div className="flex items-center justify-between mb-8">
                               <div className="flex items-center gap-4">
                                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                     <div className="w-2 h-2 bg-white rounded-full" />
                                  </div>
                                  <span className="font-bold">Kredi Kartı</span>
                               </div>
                               <div className="flex gap-2">
                                  <img src="https://cdn.paytr.com/logos/visa.svg" alt="Visa" className="h-4" />
                                  <img src="https://cdn.paytr.com/logos/mastercard.svg" alt="Mastercard" className="h-4" />
                               </div>
                            </div>

                            <div className="space-y-6">
                               <Input label="Kart Üzerindeki İsim" placeholder="Örn: AHMET YILMAZ" />
                               <Input label="Kart Numarası" placeholder="0000 0000 0000 0000" />
                               <div className="grid grid-cols-2 gap-4">
                                  <Input label="S.K.T" placeholder="AA / YY" />
                                  <Input label="CVV" placeholder="123" />
                               </div>
                            </div>
                         </div>

                         <div className="p-8 rounded-[2rem] border border-gray-100 hover:border-gray-200 transition-all cursor-pointer flex items-center gap-4">
                            <div className="w-6 h-6 border-2 border-gray-200 rounded-full" />
                            <span className="font-bold text-gray-500">Havale / EFT</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-4">
                   <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-2xl shadow-gray-100">
                      <Button size="lg" className="w-full bg-[var(--color-neon-purple)] hover:opacity-90 shadow-xl shadow-purple-500/20" onClick={() => setStep(3)}>
                         Ödemeyi Tamamla
                      </Button>
                      <p className="text-[10px] text-center mt-6 text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                         <ShieldCheck className="w-3 h-3" />
                         256-Bit SSL Güvenli Ödeme
                      </p>
                   </div>
                </div>
             </div>
           )}

           {step === 3 && (
             <div className="text-center py-24">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-100">
                   <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h1 className="text-4xl font-black mb-4 tracking-tight">Siparişiniz Alındı!</h1>
                <p className="text-gray-500 mb-12 max-w-md mx-auto">#TYC-12345 nolu siparişiniz başarıyla oluşturuldu. En kısa sürede kargoya teslim edilecektir.</p>
                <div className="flex justify-center gap-4">
                   <Link href="/orders">
                      <Button variant="outline">Siparişlerime Git</Button>
                   </Link>
                   <Link href="/">
                      <Button>Alışverişe Devam Et</Button>
                   </Link>
                </div>
             </div>
           )}

        </div>
      </main>

    </>
  );
}
