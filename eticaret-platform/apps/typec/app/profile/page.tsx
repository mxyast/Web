"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { User, MapPin, Shield, Bell, LogOut, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  return (
    <>
      <main className="flex-1 py-12 md:py-20 pt-32">
        <div className="container mx-auto px-4 max-w-5xl">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Sidebar Links */}
              <aside className="lg:col-span-4 space-y-2">
                 <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm mb-6">
                    <div className="flex items-center gap-4 mb-2">
                       <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white font-black text-lg">
                          A
                       </div>
                       <div>
                          <h2 className="font-black text-lg">Ahmet Yılmaz</h2>
                          <p className="text-xs text-gray-400">ahmet@example.com</p>
                       </div>
                    </div>
                 </div>

                 <nav className="space-y-1">
                    {[
                      { name: "Hesap Bilgileri", icon: <User />, active: true },
                      { name: "Adreslerim", icon: <MapPin />, active: false },
                      { name: "Siparişlerim", icon: <Shield />, active: false },
                      { name: "Bildirim Ayarları", icon: <Bell />, active: false },
                    ].map((item, i) => (
                      <button 
                        key={i} 
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${item.active ? "bg-black text-white shadow-xl shadow-gray-200" : "hover:bg-gray-50 text-gray-500 hover:text-black"}`}
                      >
                         <div className="flex items-center gap-4">
                            <span className="w-5 h-5">{React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5" })}</span>
                            <span className="text-sm font-bold">{item.name}</span>
                         </div>
                         <ChevronRight className={`w-4 h-4 ${item.active ? "text-white/40" : "text-gray-200"}`} />
                      </button>
                    ))}
                    <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all mt-4">
                       <LogOut className="w-5 h-5" />
                       <span className="text-sm font-bold">Çıkış Yap</span>
                    </button>
                 </nav>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-8">
                 <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 md:p-12">
                    <div className="mb-10">
                       <h1 className="text-2xl font-black mb-2">Hesap Bilgileri</h1>
                       <p className="text-sm text-gray-400 font-medium">Kişisel bilgilerinizi buradan güncelleyebilirsiniz.</p>
                    </div>

                    <form className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="Ad Soyad" defaultValue="Ahmet Yılmaz" />
                          <Input label="E-Posta" defaultValue="ahmet@example.com" disabled />
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="Telefon" defaultValue="0532 123 45 67" />
                          <Input label="Doğum Tarihi" type="date" defaultValue="1990-01-01" />
                       </div>

                       <div className="pt-8 border-t border-gray-50">
                          <h3 className="text-lg font-black mb-6">Şifre Değiştir</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <Input label="Yeni Şifre" type="password" placeholder="••••••••" />
                             <Input label="Yeni Şifre (Tekrar)" type="password" placeholder="••••••••" />
                          </div>
                       </div>

                       <div className="pt-8">
                          <Button size="lg" className="px-10">Değişiklikleri Kaydet</Button>
                       </div>
                    </form>
                 </div>
              </div>

           </div>
        </div>
      </main>

    </>
  );
}
