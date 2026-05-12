import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { prisma } from "@eticaret/database";
import { CreditCard, TrendingUp, Package, Clock, Bell, ChevronRight, Zap, Target } from "lucide-react";
import Link from "next/link";

export default async function DealerDashboard() {
  const session = await auth();

  if (!session || session.user.role !== "DEALER") {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { b2bProfile: true }
  });

  const profile = user?.b2bProfile;

  return (
    <>
      <main className="flex-1 py-12 pt-36 md:pt-40">
        <div className="container mx-auto px-4">
           {/* Welcome Header */}
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hoş Geldiniz, {user?.name}</h1>
                 <p className="text-sm text-gray-500 font-medium">{profile?.companyName}</p>
              </div>
              <div className="flex items-center gap-3">
                 <button className="w-10 h-10 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-orange-500 transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                 </button>
                 <Link href="/profile">
                    <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-sm">
                       {user?.name.charAt(0)}
                    </div>
                 </Link>
              </div>
           </div>

           {/* Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Cari Bakiye</p>
                 <p className="text-3xl font-black text-slate-900 mb-4">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(profile?.balance || 0))}</p>
                 <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-tight">
                    <TrendingUp className="w-3 h-3" />
                    Limit: {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(profile?.creditLimit || 0))}
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Aktif Siparişler</p>
                 <p className="text-3xl font-black text-slate-900 mb-4">3</p>
                 <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-tight">
                    <Clock className="w-3 h-3" />
                    1 Sipariş Hazırlanıyor
                 </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Bayi Grubu</p>
                 <p className="text-3xl font-black text-[var(--color-toptan-orange)] mb-4">{profile?.priceList?.replace('_', ' ') || "LISTE A"}</p>
                 <div className="flex items-center gap-2 text-[10px] font-black text-white/60 uppercase tracking-tight">
                    <Target className="w-3 h-3" />
                    Sonraki Seviye: Platin
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Quick Actions & News */}
              <div className="lg:col-span-8 space-y-8">
                 {/* Specialized Campaigns */}
                 <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[3rem] p-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                       <div>
                          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Bayiye Özel</span>
                          <h2 className="text-3xl font-black mb-2 leading-tight">Baseus Ürünlerinde <br/> Ekstra %5 İskonto!</h2>
                          <p className="text-white/70 text-sm font-medium mb-8">Bu hafta yapacağınız 25.000 TL ve üzeri alımlarda geçerlidir.</p>
                          <Link href="/products?brand=baseus">
                             <Button className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-2xl font-black text-sm">Fırsatı Yakala</Button>
                          </Link>
                       </div>
                       <Zap className="w-32 h-32 text-white/20" />
                    </div>
                 </div>

                 {/* Recent Orders Table */}
                 <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-lg font-black tracking-tight">Son Siparişler</h3>
                       <Link href="/orders" className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:underline">Tümünü Gör</Link>
                    </div>
                    <div className="space-y-4">
                       {[
                         { id: "TB-98765", date: "09.05.2026", total: "45.432 TL", status: "Onay Bekliyor" },
                         { id: "TB-98700", date: "02.05.2026", total: "12.800 TL", status: "Tamamlandı" }
                       ].map((order, i) => (
                         <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                  <Package className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="font-bold text-sm">{order.id}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">{order.date}</p>
                               </div>
                            </div>
                            <div className="text-right flex items-center gap-6">
                               <p className="font-black text-sm">{order.total}</p>
                               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${order.status === 'Tamamlandı' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                  {order.status}
                               </span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Quick Links & Info */}
              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-black mb-8 tracking-tight">Hızlı Bağlantılar</h3>
                    <div className="grid grid-cols-2 gap-4">
                       {[
                         { name: "Yeni Sipariş", icon: <Package />, href: "/products" },
                         { name: "Hesap Hareketleri", icon: <TrendingUp />, href: "/finance" },
                         { name: "Fiyat Listeleri", icon: <FileText />, href: "/catalogs" },
                         { name: "Destek Talebi", icon: <Clock />, href: "/support" }
                       ].map((link, i) => (
                         <Link key={i} href={link.href} className="p-4 rounded-3xl bg-gray-50 hover:bg-slate-900 hover:text-white transition-all group text-center flex flex-col items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                               {React.cloneElement(link.icon as React.ReactElement, { className: "w-6 h-6" })}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tight">{link.name}</span>
                         </Link>
                       ))}
                    </div>
                 </div>

                 {/* Representative Card */}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Müşteri Temsilciniz</p>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-black">
                          M
                       </div>
                       <div>
                          <p className="font-black text-sm">Murat Özkan</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bölge Sorumlusu</p>
                       </div>
                    </div>
                    <button className="w-full mt-6 py-4 rounded-2xl bg-slate-900 text-white font-black text-xs hover:bg-black transition-all">
                       Hızlı İletişime Geç
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </>
  );
}

import { FileText } from "lucide-react";
