"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@repo/ui/navbar";
import { Footer } from "@repo/ui/footer";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { ShieldCheck, Building2, FileText, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar platform="TOPTANBOX" />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
          
          {/* Left Side: Info */}
          <div className="bg-slate-900 p-12 lg:p-20 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div>
               <div className="w-12 h-12 bg-[var(--color-toptan-orange)] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-900/40">
                  <ShieldCheck className="w-6 h-6 text-white" />
               </div>
               <h1 className="text-4xl font-black mb-6 leading-tight">
                 ToptanBox <br/>
                 <span className="text-[var(--color-toptan-orange)]">Bayi Başvurusu</span>
               </h1>
               <p className="text-slate-400 text-lg mb-12">
                 Türkiye'nin en hızlı büyüyen teknoloji platformuna katılın, size özel avantajlardan hemen yararlanmaya başlayın.
               </p>

               <div className="space-y-6">
                  {[
                    { t: "Kademeli İskonto", d: "Alım hacminize göre otomatikleşen indirim oranları.", i: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
                    { t: "Anlık Stok Takibi", d: "Merkez depomuzdaki stokları 7/24 canlı izleyin.", i: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
                    { t: "Hızlı Sevkiyat", d: "Saat 16:00'ya kadar olan tüm siparişlerde aynı gün çıkış.", i: <CheckCircle2 className="w-5 h-5 text-green-500" /> }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="shrink-0 mt-1">{item.i}</div>
                       <div>
                          <p className="font-bold text-sm">{item.t}</p>
                          <p className="text-xs text-slate-500">{item.d}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="mt-12 pt-12 border-t border-white/5 text-xs text-slate-500">
               © 2026 ToptanBox B2B Ecosystem. <br/> Tüm başvurular 24 saat içinde sonuçlandırılır.
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-12 lg:p-20">
             <div className="mb-10">
                <h2 className="text-2xl font-black mb-2">Başvuru Formu</h2>
                <p className="text-sm text-slate-500 font-medium">Lütfen firmanıza ait bilgileri eksiksiz doldurunuz.</p>
             </div>

             <form className="space-y-6">
                {/* Honeypot field - Bots will fill this, humans won't see it */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <Input label="Yetkili Ad Soyad" placeholder="Örn: Ahmet Yılmaz" />
                   <Input label="E-Posta Adresi" type="email" placeholder="ahmet@firma.com" />
                </div>
                
                <Input label="Firma Ünvanı" placeholder="Örn: Yılmaz Teknoloji Ltd. Şti." />

                <div className="grid grid-cols-2 gap-4">
                   <Input label="Vergi Dairesi" placeholder="Örn: Zincirlikuyu" />
                   <Input label="Vergi Numarası" placeholder="10 haneli vergi no" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <Input label="Telefon Numarası" placeholder="05xx xxx xx xx" />
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Firma Faaliyet Alanı</label>
                      <select className="w-full bg-slate-50 border border-transparent rounded-2xl px-5 py-3.5 text-sm outline-none focus:bg-white focus:border-slate-200 transition-all">
                         <option>Perakende Mağaza</option>
                         <option>Online Pazaryeri Satıcısı</option>
                         <option>Kurumsal Tedarikçi</option>
                         <option>Diğer</option>
                      </select>
                   </div>
                </div>

                <div className="pt-4">
                   <Button size="lg" className="w-full bg-[var(--color-toptan-orange)] hover:bg-[var(--color-toptan-orange-hover)] text-white shadow-xl shadow-orange-500/20">
                      Başvuruyu Gönder
                   </Button>
                   <p className="text-center mt-6 text-xs text-slate-500">
                      Zaten bayimiz misiniz? <Link href="/auth/login" className="text-black font-bold hover:underline">Giriş Yapın</Link>
                   </p>
                </div>
             </form>
          </div>
        </div>
      </main>

      <Footer platform="TOPTANBOX" />
    </div>
  );
}
