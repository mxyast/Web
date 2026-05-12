"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@repo/ui/navbar";
import { Footer } from "@repo/ui/footer";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      <Navbar platform="TOPTANBOX" />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
           <div className="text-center mb-10">
              <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-slate-200">
                 <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-2">Bayi Paneli</h1>
              <p className="text-sm text-slate-500 font-medium tracking-tight">Hesabınıza erişmek için bilgilerinizi girin.</p>
           </div>

           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-100">
              <form className="space-y-6">
                 <Input 
                   label="E-Posta" 
                   type="email" 
                   placeholder="bayi@firma.com" 
                 />
                 <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Şifre</label>
                       <Link href="/auth/forgot" className="text-[10px] font-bold text-slate-400 hover:text-black uppercase tracking-widest">Şifremi Unuttum</Link>
                    </div>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                    />
                 </div>

                 <Button className="w-full h-14 bg-slate-900 text-white rounded-2xl group">
                    Giriş Yap
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </form>

              <div className="mt-10 pt-10 border-t border-slate-50 text-center">
                 <p className="text-xs text-slate-400 font-medium mb-4">Henüz bayimiz değil misiniz?</p>
                 <Link href="/auth/register">
                    <Button variant="outline" className="w-full h-12 border-slate-200 text-slate-900">
                       Hemen Başvurun
                    </Button>
                 </Link>
              </div>
           </div>

           <p className="text-center mt-12 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              ToptanBox B2B Güvencesiyle
           </p>
        </div>
      </main>

      <Footer platform="TOPTANBOX" />
    </div>
  );
}
