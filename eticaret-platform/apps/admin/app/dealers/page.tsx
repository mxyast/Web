import { prisma } from "@eticaret/database";
import { CheckCircle2, Clock, Search, Eye, MoreVertical } from "lucide-react";
import { Header } from "../../components/Header";

export default async function DealersPage() {
  const dealers = await prisma.user.findMany({
    where: { role: "DEALER" },
    include: { b2bProfile: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <Header title="Bayi Yönetimi" />
      
      <main className="flex-1 overflow-y-auto p-8">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Toplam Bayi</p>
               <p className="text-3xl font-black">{dealers.length}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Onay Bekleyen</p>
               <p className="text-3xl font-black text-orange-500">{dealers.filter(d => !d.b2bProfile?.isApproved).length}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Aktif Bayiler</p>
               <p className="text-3xl font-black text-green-500">{dealers.filter(d => d.b2bProfile?.isApproved).length}</p>
            </div>
         </div>

         <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
               <div className="relative">
                  <input type="text" placeholder="Bayi veya firma ara..." className="bg-gray-100 rounded-full py-2 px-10 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64" />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               </div>
               <button className="bg-blue-600 text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">Yeni Bayi Ekle</button>
            </div>

            <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Bayi Bilgisi</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Firma / Vergi No</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Grup / Limit</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Durum</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Eylem</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {dealers.map((dealer) => (
                    <tr key={dealer.id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                {dealer.name.charAt(0)}
                             </div>
                             <div>
                                <p className="font-bold text-sm">{dealer.name}</p>
                                <p className="text-xs text-gray-400">{dealer.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-sm font-bold">{dealer.b2bProfile?.companyName}</p>
                          <p className="text-xs text-gray-400">{dealer.b2bProfile?.taxNumber}</p>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-sm font-bold text-blue-600">{dealer.b2bProfile?.priceList}</p>
                          <p className="text-xs text-gray-400">{new Intl.NumberFormat("tr-TR").format(Number(dealer.b2bProfile?.creditLimit) || 0)} TL Limit</p>
                       </td>
                       <td className="px-8 py-6">
                          {dealer.b2bProfile?.isApproved ? (
                             <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                                <CheckCircle2 className="w-3 h-3" />
                                Aktif
                             </div>
                          ) : (
                             <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                                <Clock className="w-3 h-3" />
                                Onay Bekliyor
                             </div>
                          )}
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Detaylar">
                                <Eye className="w-4 h-4 text-gray-400" />
                             </button>
                             <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </main>
    </>
  );
}
