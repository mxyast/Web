import { CreditCard, Search, Filter, CheckCircle2, Clock, XCircle, MoreVertical, DollarSign } from "lucide-react";
import { Header } from "../../components/Header";

export default async function AdminPaymentsPage() {
  return (
    <>
      <Header title="Ödeme ve Tahsilat" />

      <main className="flex-1 overflow-y-auto p-8">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Bekleyen Tahsilat", value: "45.200 ₺", color: "text-orange-500" },
              { label: "Bugünkü Tahsilat", value: "12.800 ₺", color: "text-green-600" },
              { label: "Hatalı İşlemler", value: "3", color: "text-red-500" },
              { label: "Net Bakiye", value: "784.000 ₺", color: "text-slate-900" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
                 <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
         </div>

         <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
               <div className="relative">
                  <input type="text" placeholder="İşlem No veya Bayi ara..." className="bg-gray-100 rounded-full py-2 px-10 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64" />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               </div>
               <div className="flex gap-3">
                  <button className="p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all">
                     <Filter className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="bg-blue-600 text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">Excel Çıktısı</button>
               </div>
            </div>

            <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">İşlem Tarihi</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Bayi / Müşteri</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Yöntem / Gateway</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Tutar</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Durum</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {[
                    { id: "TRX-4501", date: "10.05.2024 14:20", name: "Ahmet Yılmaz", type: "Kredi Kartı", gw: "PayTR", amt: "1.249,00 ₺", st: "SUCCESS" },
                    { id: "TRX-4502", date: "10.05.2024 13:45", name: "Global Supply Ltd.", type: "Cari Hesap", gw: "B2B System", amt: "24.500,00 ₺", st: "PENDING" },
                    { id: "TRX-4503", date: "10.05.2024 12:10", name: "Mehmet Demir", type: "Havale/EFT", gw: "Ziraat Bankası", amt: "450,00 ₺", st: "FAILED" }
                  ].map((trx, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-8 py-6">
                          <p className="font-bold text-sm leading-tight">{trx.id}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{trx.date}</p>
                       </td>
                       <td className="px-8 py-6">
                          <p className="font-bold text-sm">{trx.name}</p>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-sm font-bold text-slate-700">{trx.type}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{trx.gw}</p>
                       </td>
                       <td className="px-8 py-6">
                          <p className="font-black text-sm">{trx.amt}</p>
                       </td>
                       <td className="px-8 py-6">
                          {trx.st === "SUCCESS" && (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                                <CheckCircle2 className="w-3 h-3" /> Başarılı
                             </span>
                          )}
                          {trx.st === "PENDING" && (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                                <Clock className="w-3 h-3" /> Bekliyor
                             </span>
                          )}
                          {trx.st === "FAILED" && (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                                <XCircle className="w-3 h-3" /> Hatalı
                             </span>
                          )}
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
