"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { User, MapPin, Shield, Bell, LogOut, ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";

import { updateProfileAction } from "../actions";

interface ProfileClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export function ProfileClient({ user }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState("Hesap Bilgileri");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const tabs = [
    { name: "Hesap Bilgileri", icon: User },
    { name: "Adreslerim", icon: MapPin },
    { name: "Siparişlerim", icon: Shield, href: "/orders" },
    { name: "Bildirim Ayarları", icon: Bell },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Sidebar Links */}
      <aside className="lg:col-span-4 space-y-2">
         <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center gap-4 mb-2">
               <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white font-black text-lg">
                  {user.name.charAt(0).toUpperCase()}
               </div>
               <div>
                  <h2 className="font-black text-lg">{user.name}</h2>
                  <p className="text-xs text-gray-400">{user.email}</p>
               </div>
            </div>
         </div>

         <nav className="space-y-1">
            {tabs.map((item, i) => (
              item.href ? (
                <Link 
                  key={i} 
                  href={item.href}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === item.name ? "bg-black text-white shadow-xl shadow-gray-200" : "hover:bg-gray-50 text-gray-500 hover:text-black"}`}
                >
                   <div className="flex items-center gap-4">
                      <span className="w-5 h-5"><item.icon className="w-5 h-5" /></span>
                      <span className="text-sm font-bold">{item.name}</span>
                   </div>
                   <ChevronRight className={`w-4 h-4 ${activeTab === item.name ? "text-white/40" : "text-gray-200"}`} />
                </Link>
              ) : (
                <button 
                  key={i} 
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === item.name ? "bg-black text-white shadow-xl shadow-gray-200" : "hover:bg-gray-50 text-gray-500 hover:text-black"}`}
                >
                   <div className="flex items-center gap-4">
                      <span className="w-5 h-5"><item.icon className="w-5 h-5" /></span>
                      <span className="text-sm font-bold">{item.name}</span>
                   </div>
                   <ChevronRight className={`w-4 h-4 ${activeTab === item.name ? "text-white/40" : "text-gray-200"}`} />
                </button>
              )
            ))}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all mt-4"
            >
               <LogOut className="w-5 h-5" />
               <span className="text-sm font-bold">Çıkış Yap</span>
            </button>
         </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:col-span-8">
         <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 md:p-12">
            {activeTab === "Hesap Bilgileri" && (
              <>
                <div className="mb-10">
                   <h1 className="text-2xl font-black mb-2">Hesap Bilgileri</h1>
                   <p className="text-sm text-gray-400 font-medium">Kişisel bilgilerinizi buradan güncelleyebilirsiniz.</p>
                </div>

                <form className="space-y-8" onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);
                  setSuccess(null);
                  setIsUpdating(true);
                  try {
                    const formData = new FormData(e.currentTarget);
                    const result = await updateProfileAction(formData);
                    if (result?.error) {
                      setError(result.error);
                      setSuccess(null);
                    } else if (result?.success) {
                      setSuccess(result.success);
                      setError(null);
                      // Clear password fields
                      const passInput = e.currentTarget.querySelector('input[name="password"]') as HTMLInputElement;
                      const passConfirmInput = e.currentTarget.querySelector('input[name="passwordConfirm"]') as HTMLInputElement;
                      if (passInput) passInput.value = "";
                      if (passConfirmInput) passConfirmInput.value = "";
                    } else {
                      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
                      setSuccess(null);
                    }
                  } catch (err) {
                    setError("Bir hata oluştu. Lütfen tekrar deneyin.");
                    setSuccess(null);
                  } finally {
                    setIsUpdating(false);
                  }
                }}>
                   {error ? (
                     <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold">
                       {error}
                     </div>
                   ) : success ? (
                     <div className="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-2xl text-sm font-bold">
                       {success}
                     </div>
                   ) : null}

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Ad Soyad" name="name" defaultValue={user.name} required />
                      <Input 
                        label="E-Posta (Değiştirilemez)" 
                        defaultValue={user.email} 
                        disabled 
                        className="bg-gray-100/80 cursor-not-allowed text-gray-400 font-medium" 
                      />
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Telefon" name="phone" defaultValue={user.phone || ""} placeholder="05xx xxx xx xx" />
                      <Input label="Doğum Tarihi" type="date" />
                   </div>

                   <div className="pt-8 border-t border-gray-50">
                      <h3 className="text-lg font-black mb-6">Şifre Değiştir</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Input label="Yeni Şifre" name="password" type="password" placeholder="••••••••" />
                         <Input label="Yeni Şifre (Tekrar)" name="passwordConfirm" type="password" placeholder="••••••••" />
                      </div>
                   </div>

                   <div className="pt-8">
                      <Button size="lg" type="submit" disabled={isUpdating} className="px-10">
                        {isUpdating ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                      </Button>
                   </div>
                </form>
              </>
            )}

            {activeTab === "Adreslerim" && (
              <div className="text-center py-20">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Kayıtlı Adresiniz Yok</h2>
                <p className="text-gray-500 mb-6">Siparişleriniz için adres ekleyebilirsiniz.</p>
                <Button>Yeni Adres Ekle</Button>
              </div>
            )}

            {activeTab === "Bildirim Ayarları" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-black mb-6">Bildirim Ayarları</h1>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="font-bold">E-Posta Kampanyaları</p>
                    <p className="text-xs text-gray-500">İndirim ve fırsatlardan e-posta ile haberdar olmak istiyorum.</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-black" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="font-bold">SMS Bilgilendirmeleri</p>
                    <p className="text-xs text-gray-500">Sipariş durumum ile ilgili SMS almak istiyorum.</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-black" defaultChecked />
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
