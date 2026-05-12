import { prisma } from "@eticaret/database";
import { notFound } from "next/navigation";
import { Package, MapPin, CreditCard, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "../../../components/Header";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      shippingAddress: true,
      items: {
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });

  if (!order) notFound();

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
           <Link href="/orders" className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
           </Link>
           <h1 className="text-xl font-black tracking-tight">Sipariş Detayı #{order.id.slice(-6).toUpperCase()}</h1>
        </div>
        <div className="flex items-center gap-3">
           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white`}>
              {order.status}
           </div>
           <button className="bg-slate-900 text-white text-xs font-bold px-6 py-2 rounded-full hover:bg-black transition-all">Durumu Güncelle</button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-8">
               {/* Order Items */}
               <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                     <h2 className="text-lg font-black tracking-tight">Sipariş İçeriği</h2>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.items.length} Kalem Ürün</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                     {order.items.map((item) => (
                       <div key={item.id} className="p-8 flex items-center gap-6">
                          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                             <Package className="w-8 h-8 text-gray-300" />
                          </div>
                          <div className="flex-1">
                             <p className="font-bold text-sm mb-1">{item.variant.product.name}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SKU: {item.variant.sku} | {item.quantity} Adet</p>
                          </div>
                          <div className="text-right">
                             <p className="font-black text-sm">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(item.unitPrice))}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Timeline / History (Mock) */}
               <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                  <h2 className="text-lg font-black tracking-tight mb-10">İşlem Geçmişi</h2>
                  <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                     <div className="flex gap-6 relative">
                        <div className="w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow-sm shrink-0" />
                        <div>
                           <p className="text-sm font-bold">Sipariş Oluşturuldu</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(order.createdAt).toLocaleString("tr-TR")}</p>
                        </div>
                     </div>
                     <div className="flex gap-6 relative">
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-4 border-white shadow-sm shrink-0" />
                        <div>
                           <p className="text-sm font-bold text-gray-400">Ödeme Onayı Bekleniyor</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
               {/* Customer Info */}
               <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Müşteri Bilgileri</h3>
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black">
                        {order.user.name.charAt(0)}
                     </div>
                     <div>
                        <p className="font-black text-sm">{order.user.name}</p>
                        <p className="text-xs text-gray-400">{order.user.email}</p>
                     </div>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-gray-50">
                     <div className="flex gap-3">
                        <MapPin className="w-4 h-4 text-gray-300 mt-1" />
                        <div>
                           <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Teslimat Adresi</p>
                           <p className="text-xs font-medium text-slate-600 leading-relaxed">
                              {order.shippingAddress ? `${order.shippingAddress.addressLine}, ${order.shippingAddress.district}/${order.shippingAddress.city}` : "Adres bilgisi girilmemiş."}
                           </p>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <CreditCard className="w-4 h-4 text-gray-300 mt-1" />
                        <div>
                           <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Ödeme Yöntemi</p>
                           <p className="text-xs font-medium text-slate-600">Kredi Kartı (PayTR)</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Order Total Summary */}
               <div className="bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200 p-8 text-white">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white/40 mb-6">Özet</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between text-sm">
                        <span className="text-white/40">Ara Toplam</span>
                        <span className="font-bold">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(order.totalAmount))}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-white/40">KDV (%20)</span>
                        <span className="font-bold text-white/60">Dahil</span>
                     </div>
                     <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                        <span className="text-lg font-black">Genel Toplam</span>
                        <span className="text-2xl font-black text-[var(--color-toptan-orange)]">
                           {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(order.totalAmount))}
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>
    </>
  );
}
