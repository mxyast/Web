import { prisma } from "@eticaret/database";
import { ShoppingCart, Search, Filter, Monitor, Box, Eye, Clock, CheckCircle2, Truck, AlertCircle, Package } from "lucide-react";
import Link from "next/link";
import { Header } from "../../components/Header";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-50 text-yellow-600 border-yellow-100";
      case "PAID": return "bg-blue-50 text-blue-600 border-blue-100";
      case "SHIPPED": return "bg-purple-50 text-purple-600 border-purple-100";
      case "DELIVERED": return "bg-green-50 text-green-600 border-green-100";
      case "CANCELLED": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <>
      <Header title="Sipariş Yönetimi" />

      <main className="flex-1 overflow-y-auto p-8">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Yeni Sipariş", value: "12", color: "text-blue-600", icon: <Clock className="w-5 h-5" /> },
              { label: "Hazırlanan", value: "8", color: "text-yellow-600", icon: <AlertCircle className="w-5 h-5" /> },
              { label: "Kargolanan", value: "24", color: "text-purple-600", icon: <Truck className="w-5 h-5" /> },
              { label: "Tamamlanan", value: "156", color: "text-green-600", icon: <CheckCircle2 className="w-5 h-5" /> }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                 </div>
                 <div className={`p-3 rounded-2xl bg-gray-50 ${stat.color}`}>{stat.icon}</div>
              </div>
            ))}
         </div>

         <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Sipariş No / Tarih</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Müşteri / Platform</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Ürünler</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Tutar</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Durum</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">İşlem</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-8 py-6">
                          <p className="font-bold text-sm">#{order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</p>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                             <p className="font-bold text-sm leading-tight">{order.user.name}</p>
                             <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter w-fit ${order.platform === "TYPEC" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-orange-50 text-orange-600 border border-orange-100"}`}>
                                {order.platform === "TYPEC" ? <Monitor className="w-2.5 h-2.5" /> : <Box className="w-2.5 h-2.5" />}
                                {order.platform}
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <div className="flex -space-x-2 justify-center">
                             {order.items.slice(0, 3).map((item, idx) => (
                               <div key={idx} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold overflow-hidden" title={item.variant.product.name}>
                                  {idx === 2 && order.items.length > 3 ? `+${order.items.length - 2}` : <Package className="w-4 h-4 text-gray-400" />}
                               </div>
                             ))}
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <p className="font-black text-sm">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(order.totalAmount))}</p>
                       </td>
                       <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${getStatusColor(order.status)}`}>
                             {order.status}
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <Link href={`/orders/${order.id}`} className="p-2 hover:bg-gray-100 rounded-full inline-block transition-colors">
                             <Eye className="w-4 h-4 text-gray-400" />
                          </Link>
                       </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-medium">
                         Henüz hiç sipariş bulunmuyor.
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </main>
    </>
  );
}
