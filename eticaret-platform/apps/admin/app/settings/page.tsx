"use client";

import { useState, useEffect } from "react";
import { Settings, Shield, Bell, Globe, Database, Save, Key, Lock, AlertTriangle, RefreshCw, Download, Trash2 } from "lucide-react";
import { Header } from "../../components/Header";
import { getAllowedRoles, updateAllowedRoles } from "./actions";

type TabType = "general" | "security" | "notifications" | "localization" | "database";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [allowedRoles, setAllowedRoles] = useState<string[]>(["ADMIN"]);

  useEffect(() => {
    getAllowedRoles().then(setAllowedRoles);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAllowedRoles(allowedRoles);
      alert("Ayarlar başarıyla kaydedildi.");
    } catch (err: any) {
      alert(err.message || "Ayarlar kaydedilirken hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "Genel", icon: Settings },
    { id: "security", label: "Güvenlik", icon: Shield },
    { id: "notifications", label: "Bildirimler", icon: Bell },
    { id: "localization", label: "Lokalizasyon", icon: Globe },
    { id: "database", label: "Veritabanı", icon: Database }
  ];

  return (
    <div className="flex flex-col h-full">
      <Header title="Sistem Ayarları" />

      <main className="flex-1 overflow-y-auto p-8">
         <div className="max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {/* Settings Sidebar */}
               <div className="md:col-span-1 space-y-2">
                  {tabs.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                      <button 
                        key={item.id} 
                        onClick={() => setActiveTab(item.id as TabType)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-gray-500 hover:bg-gray-100'}`}
                      >
                         <Icon className="w-5 h-5" /> {item.label}
                      </button>
                    );
                  })}
               </div>

               {/* Settings Content */}
               <div className="md:col-span-3 space-y-8">
                  
                  {activeTab === "general" && (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <h3 className="text-xl font-black tracking-tight mb-8 text-slate-900">Genel Yapılandırma</h3>
                       
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Site Başlığı</label>
                             <input type="text" defaultValue="Eticaret Platformu" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                          </div>

                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Yönetici E-Posta</label>
                             <input type="email" defaultValue="admin@example.com" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">B2C Rezervasyon Modu</label>
                                <select className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none">
                                   <option>Otomatik (Akıllı Kalkan)</option>
                                   <option>Manuel Oran Belirleme</option>
                                   <option>Kapalı</option>
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Varsayılan Para Birimi</label>
                                <select className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none">
                                   <option>TRY (₺)</option>
                                   <option>USD ($)</option>
                                   <option>EUR (€)</option>
                                </select>
                             </div>
                          </div>

                          <div className="pt-6 border-t border-gray-50 flex justify-end">
                             <button onClick={handleSave} disabled={isSaving} className="bg-slate-900 text-white text-xs font-bold px-10 py-4 rounded-2xl hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-900/20 disabled:opacity-70">
                                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                             </button>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <h3 className="text-xl font-black tracking-tight mb-8 text-slate-900">Güvenlik Ayarları</h3>
                       
                       <div className="space-y-8">
                          <div className="space-y-4">
                             <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                               <Key className="w-4 h-4 text-gray-400" /> Şifre Politikası
                             </h4>
                             <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                                   <span className="text-sm font-bold text-slate-700">Karmaşık Şifre Zorunluluğu</span>
                                   <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </label>
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                                   <span className="text-sm font-bold text-slate-700">Şifre Süresi (90 Gün)</span>
                                   <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </label>
                             </div>
                          </div>

                          <div className="space-y-4 pt-6 border-t border-gray-50">
                              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-gray-400" /> Admin Paneli Erişim Yetkileri
                              </h4>
                              <p className="text-xs text-gray-500 mb-2">Admin paneline giriş izni verilecek kullanıcı rollerini seçin (En az bir rol seçilmelidir).</p>
                              <div className="grid grid-cols-3 gap-4">
                                 {["ADMIN", "DEALER", "CUSTOMER"].map((role) => (
                                    <label key={role} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                                       <span className="text-sm font-bold text-slate-700">{role}</span>
                                       <input
                                          type="checkbox"
                                          checked={allowedRoles.includes(role)}
                                          onChange={(e) => {
                                             if (e.target.checked) {
                                                setAllowedRoles([...allowedRoles, role]);
                                             } else {
                                                setAllowedRoles(allowedRoles.filter(r => r !== role));
                                             }
                                          }}
                                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                       />
                                    </label>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-4 pt-6 border-t border-gray-50">
                              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-gray-400" /> İki Aşamalı Doğrulama (2FA)
                              </h4>
                              <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
                                 <Shield className="w-6 h-6 text-blue-600 shrink-0" />
                                 <div>
                                    <p className="text-sm font-bold text-blue-900 mb-1">Tüm yöneticiler için 2FA zorunlu yap</p>
                                    <p className="text-xs text-blue-700 mb-4">Bu ayar etkinleştirildiğinde, sisteme giriş yapan tüm admin yetkili kullanıcılar Google Authenticator veya SMS ile doğrulanmak zorundadır.</p>
                                    <button className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">Aktifleştir</button>
                                 </div>
                              </div>
                           </div>

                          <div className="pt-6 border-t border-gray-50 flex justify-end">
                             <button onClick={handleSave} disabled={isSaving} className="bg-slate-900 text-white text-xs font-bold px-10 py-4 rounded-2xl hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-900/20 disabled:opacity-70">
                                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSaving ? "Kaydediliyor..." : "Güvenlik Ayarlarını Kaydet"}
                             </button>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === "notifications" && (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <h3 className="text-xl font-black tracking-tight mb-8 text-slate-900">Bildirim Tercihleri</h3>
                       
                       <div className="space-y-6">
                          {[
                            { title: "Yeni Sipariş Bildirimleri", desc: "Sisteme yeni bir B2B veya B2C sipariş düştüğünde e-posta al.", checked: true },
                            { title: "Kritik Stok Uyarıları", desc: "Akıllı kalkan devreye girdiğinde veya stok 10'un altına düştüğünde bildir.", checked: true },
                            { title: "Yeni Bayi Başvurusu", desc: "ToptanBox üzerinden yeni bir bayi kayıt olduğunda hemen uyar.", checked: true },
                            { title: "Günlük Satış Özeti", desc: "Her gün saat 23:59'da günün satış özetini e-posta ile gönder.", checked: false },
                            { title: "Sistem Hata Logları", desc: "Ödeme geçitlerinde veya API'lerde hata olduğunda anında bildir.", checked: true }
                          ].map((notif, idx) => (
                             <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
                                <div>
                                   <p className="text-sm font-bold text-slate-800">{notif.title}</p>
                                   <p className="text-xs text-gray-500 mt-1">{notif.desc}</p>
                                </div>
                                {/* Toggle Switch Mock */}
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" defaultChecked={notif.checked} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                             </div>
                          ))}

                          <div className="pt-6 border-t border-gray-50 flex justify-end">
                             <button onClick={handleSave} disabled={isSaving} className="bg-slate-900 text-white text-xs font-bold px-10 py-4 rounded-2xl hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-900/20 disabled:opacity-70">
                                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSaving ? "Kaydediliyor..." : "Tercihleri Kaydet"}
                             </button>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === "localization" && (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <h3 className="text-xl font-black tracking-tight mb-8 text-slate-900">Lokalizasyon Ayarları</h3>
                       
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Sistem Dili</label>
                             <select className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none">
                                <option>Türkçe</option>
                                <option>English</option>
                             </select>
                          </div>

                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Zaman Dilimi (Timezone)</label>
                             <select className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none">
                                <option>Europe/Istanbul (UTC+03:00)</option>
                                <option>Europe/London (UTC+00:00)</option>
                                <option>America/New_York (UTC-05:00)</option>
                             </select>
                          </div>

                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Tarih / Saat Formatı</label>
                             <select className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none">
                                <option>DD.MM.YYYY HH:mm (24 Saat)</option>
                                <option>MM/DD/YYYY hh:mm A (12 Saat)</option>
                             </select>
                          </div>

                          <div className="pt-6 border-t border-gray-50 flex justify-end">
                             <button onClick={handleSave} disabled={isSaving} className="bg-slate-900 text-white text-xs font-bold px-10 py-4 rounded-2xl hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-900/20 disabled:opacity-70">
                                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSaving ? "Kaydediliyor..." : "Lokalizasyonu Kaydet"}
                             </button>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === "database" && (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <h3 className="text-xl font-black tracking-tight mb-8 text-slate-900">Veritabanı & Sistem Yönetimi</h3>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                          <div className="p-6 border border-gray-100 bg-gray-50 rounded-3xl flex flex-col items-start">
                             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                                <Download className="w-6 h-6" />
                             </div>
                             <h4 className="font-bold text-slate-800 mb-1">Veritabanı Yedeği Al</h4>
                             <p className="text-xs text-gray-500 mb-6">Tüm müşteri, ürün ve sipariş verilerini SQL formatında indir.</p>
                             <button className="mt-auto px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 transition-all w-full">
                                Yedek Oluştur
                             </button>
                          </div>

                          <div className="p-6 border border-gray-100 bg-gray-50 rounded-3xl flex flex-col items-start">
                             <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                                <RefreshCw className="w-6 h-6" />
                             </div>
                             <h4 className="font-bold text-slate-800 mb-1">Sistem Önbelleğini Temizle</h4>
                             <p className="text-xs text-gray-500 mb-6">Vercel Edge ve Next.js önbelleğini sıfırlayarak verileri günceller.</p>
                             <button className="mt-auto px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 transition-all w-full">
                                Cache Temizle
                             </button>
                          </div>
                       </div>

                       <div className="bg-red-50 rounded-3xl border border-red-100 p-8">
                          <div className="flex items-start gap-4">
                             <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                             <div>
                                <h3 className="text-base font-black tracking-tight mb-1 text-red-900">Tehlikeli Bölge</h3>
                                <p className="text-xs text-red-700 mb-6 font-medium">Sistemdeki tüm pasif kullanıcıları ve sepette bırakılmış iptal siparişleri kalıcı olarak siler. Bu işlem geri alınamaz.</p>
                                <button className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-red-600/20 hover:bg-red-700 transition-all flex items-center gap-2">
                                   <Trash2 className="w-4 h-4" /> Gereksiz Verileri Temizle
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
            </div>
         </div>
      </main>
    </div>
  );
}
