"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Building2, CreditCard, ShieldCheck, Truck, CheckCircle2, FileText, Banknote } from "lucide-react";

export default function B2BCheckoutPage() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("transfer");

  const subtotal = 45000.00;
  const discount = 5400.00; // %12 Platin İskonto
  const tax = (subtotal - discount) * 0.20;
  const total = (subtotal - discount) + tax;

  return (
    <>
      <main className="flex-1 py-12 md:py-20 pt-36 md:pt-40">
        <div className="container mx-auto px-4 max-w-6xl">
           
           {step < 3 && (
             <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="flex-1 space-y-8">
                   {/* Progress */}
                   <div className="flex items-center gap-4 mb-8">
                      <div className={`flex items-center gap-3 ${step >= 1 ? "text-slate-900" : "text-gray-300"}`}>
                         <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black ${step >= 1 ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "bg-white border border-gray-100"}`}>1</div>
                         <span className="text-xs font-black uppercase tracking-widest">Sevkiyat</span>
                      </div>
                      <div className="w-12 h-px bg-gray-200" />
                      <div className={`flex items-center gap-3 ${step >= 2 ? "text-slate-900" : "text-gray-300"}`}>
                         <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black ${step >= 2 ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "bg-white border border-gray-100"}`}>2</div>
                         <span className="text-xs font-black uppercase tracking-widest">Ödeme</span>
                      </div>
                   </div>

                   {step === 1 && (
                     <div className="space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                           <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                              <Building2 className="w-6 h-6 text-[var(--color-toptan-orange)]" />
                              Firma ve Sevkiyat Adresi
                           </h2>

                           <div className="space-y-4">
                              <div className="p-8 rounded-[2rem] border-2 border-[var(--color-toptan-orange)] bg-orange-50/20 relative">
                                 <div className="absolute top-6 right-8">
                                    <CheckCircle2 className="w-6 h-6 text-[var(--color-toptan-orange)]" />
                                 </div>
                                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Varsayılan Adres</p>
                                 <p className="text-lg font-black text-slate-900 mb-1">ABC Teknoloji Ltd. Şti.</p>
                                 <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                                    Büyükdere Cad. No:123/A Kağıthane / İstanbul <br/>
                                    Vergi No: 1234567890 | VD: Zincirlikuyu
                                 </p>
                              </div>
                              <button className="w-full py-6 rounded-[2rem] border border-dashed border-gray-200 text-gray-400 font-bold text-sm hover:bg-white hover:border-gray-300 transition-all">
                                 + Farklı Sevkiyat Adresi Ekle
                              </button>
                           </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                           <h2 className="text-xl font-black mb-6">Lojistik Tercihi</h2>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-6 rounded-2xl border-2 border-slate-900 bg-slate-50">
                                 <p className="font-bold text-sm mb-1">Aras Kargo (Anlaşmalı)</p>
                                 <p className="text-xs text-gray-500">Tahmini Teslimat: 1-2 İş Günü</p>
                              </div>
                              <div className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all cursor-pointer">
                                 <p className="font-bold text-sm mb-1">Ambar / Karşı Ödemeli</p>
                                 <p className="text-xs text-gray-400">Belirttiğiniz ambar noktasına teslim edilir.</p>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {step === 2 && (
                     <div className="space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                           <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                              <Banknote className="w-6 h-6 text-green-600" />
                              Ödeme Yöntemi
                           </h2>

                           <div className="grid grid-cols-1 gap-4">
                              <div 
                                className={`p-8 rounded-[2rem] border-2 transition-all cursor-pointer ${paymentMethod === 'transfer' ? 'border-slate-900 bg-slate-50' : 'border-gray-100 hover:border-gray-200'}`}
                                onClick={() => setPaymentMethod('transfer')}
                              >
                                 <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-slate-900 bg-slate-900' : 'border-gray-300'}`}>
                                          {paymentMethod === 'transfer' && <div className="w-2 h-2 bg-white rounded-full" />}
                                       </div>
                                       <span className="font-black text-lg">Havale / EFT</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase bg-green-100 text-green-700 px-2 py-1 rounded">Ekstra %2 İndirim</span>
                                 </div>
                                 <p className="text-sm text-gray-500 ml-10">Sipariş sonrası paylaşılan banka hesaplarına ödeme yapılır.</p>
                              </div>

                              <div 
                                className={`p-8 rounded-[2rem] border-2 transition-all cursor-pointer ${paymentMethod === 'credit' ? 'border-slate-900 bg-slate-50' : 'border-gray-100 hover:border-gray-200'}`}
                                onClick={() => setPaymentMethod('credit')}
                              >
                                 <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'credit' ? 'border-slate-900 bg-slate-900' : 'border-gray-300'}`}>
                                       {paymentMethod === 'credit' && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <span className="font-black text-lg">Cari Hesap</span>
                                 </div>
                                 <p className="text-sm text-gray-500 ml-10">Tanımlı limitinizden düşülerek vadeli işlem yapılır.</p>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}
                </div>

                {/* Sticky Summary Card */}
                <div className="w-full lg:w-[400px] sticky top-24">
                   <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl shadow-slate-200">
                      <h3 className="text-xl font-black mb-8 tracking-tight text-slate-900">Sipariş Özeti</h3>
                      
                      <div className="space-y-4 mb-8">
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Ara Toplam</span>
                            <span className="font-bold text-slate-600">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(subtotal)}</span>
                         </div>
                         <div className="flex justify-between text-sm items-center">
                            <div className="flex flex-col">
                               <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Bayi İskontosu</span>
                               <span className="text-[9px] font-black text-orange-600 uppercase">Platin Tier (%12)</span>
                            </div>
                            <span className="font-bold text-orange-600">-{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(discount)}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">KDV (%20)</span>
                            <span className="font-bold text-slate-600">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(tax)}</span>
                         </div>
                         <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                            <span className="font-black text-slate-900">Genel Toplam</span>
                            <span className="font-black text-2xl text-slate-900">
                               {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(total)}
                            </span>
                         </div>
                      </div>

                      <Button size="lg" className="w-full h-16 bg-slate-900 text-white rounded-2xl text-lg shadow-xl shadow-slate-300" onClick={() => step === 1 ? setStep(2) : setStep(3)}>
                         {step === 1 ? "Ödeme Seçimine Geç" : "Siparişi Onayla"}
                      </Button>

                      <div className="mt-8 flex flex-col gap-4">
                         <div className="flex items-center gap-3 text-gray-400">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span className="text-[10px] font-black uppercase tracking-tight">Güvenli B2B İşlem</span>
                         </div>
                         <div className="flex items-center gap-3 text-gray-400">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-tight">E-Fatura Mükellefi</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {step === 3 && (
             <div className="text-center py-24">
                <div className="w-28 h-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-300">
                   <CheckCircle2 className="w-14 h-14 text-[var(--color-toptan-orange)]" />
                </div>
                <h1 className="text-4xl font-black mb-4 tracking-tight text-slate-900">Siparişiniz İletildi!</h1>
                <p className="text-gray-500 mb-12 max-w-md mx-auto font-medium text-lg">
                   #TB-98765 nolu toptan siparişiniz başarıyla alındı. Finans onayından sonra sevkiyat birimine aktarılacaktır.
                </p>
                <div className="flex justify-center gap-4">
                   <Link href="/orders">
                      <Button variant="outline" className="h-14 px-10 rounded-2xl border-slate-200">Sipariş Detayı</Button>
                   </Link>
                   <Link href="/">
                      <Button className="h-14 px-10 rounded-2xl bg-slate-900 text-white">Panele Dön</Button>
                   </Link>
                </div>
             </div>
           )}

        </div>
      </main>
    </>
  );
}
