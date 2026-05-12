import { BarChart3, Users, ShoppingCart, ArrowUpRight, ArrowDownRight, DollarSign, Zap, AlertCircle } from "lucide-react";
import { Header } from "../../components/Header";

export default async function ReportsPage() {
  return (
    <>
      <Header title="Satış Analitikleri" />

      <main className="flex-1 overflow-y-auto p-8">
         {/* Summary Grid */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { t: "Toplam Ciro", v: "842.500 ₺", i: <DollarSign />, g: "+12.5%", pos: true },
              { t: "Yeni Siparişler", v: "156", i: <ShoppingCart />, g: "+4.2%", pos: true },
              { t: "Aktif Bayiler", v: "42", i: <Users />, g: "+2", pos: true },
              { t: "İade Oranı", v: "%1.2", i: <ArrowDownRight />, g: "-0.4%", pos: true }
            ].map((s, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-xl">{s.i}</div>
                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tight ${s.pos ? 'text-green-600' : 'text-red-600'}`}>
                       {s.pos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                       {s.g}
                    </div>
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{s.t}</p>
                 <p className="text-2xl font-black text-slate-900">{s.v}</p>
              </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Revenue Chart Simulated */}
            <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
               <div className="flex items-center justify-between mb-12">
                  <div>
                     <h3 className="text-lg font-black tracking-tight">Platform Bazlı Gelir Dağılımı</h3>
                     <p className="text-xs text-gray-400 font-medium">Son 6 aya ait satış verileri</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-600" />
                        <span className="text-[10px] font-black uppercase text-gray-500">ToptanBox</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-200" />
                        <span className="text-[10px] font-black uppercase text-gray-500">TypeC</span>
                     </div>
                  </div>
               </div>

               <div className="h-64 flex items-end justify-between gap-4">
                  {[
                    { m: "Oca", b: 70, c: 30 },
                    { m: "Şub", b: 60, c: 40 },
                    { m: "Mar", b: 85, c: 25 },
                    { m: "Nis", b: 45, c: 55 },
                    { m: "May", b: 90, c: 35 },
                    { m: "Haz", b: 75, c: 45 }
                  ].map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                       <div className="w-full flex flex-col-reverse gap-1 h-full">
                          <div className="w-full bg-blue-200 rounded-md transition-all group-hover:bg-blue-300" style={{ height: `${d.c}%` }} />
                          <div className="w-full bg-blue-600 rounded-md transition-all group-hover:bg-blue-700" style={{ height: `${d.b}%` }} />
                       </div>
                       <span className="text-[10px] font-bold text-gray-400 uppercase">{d.m}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Top Dealers */}
            <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
               <h3 className="text-lg font-black tracking-tight mb-8">En İyi Bayiler</h3>
               <div className="space-y-6">
                  {[
                    { n: "ABC Teknoloji", v: "142.500 ₺", g: "+18%" },
                    { n: "Yılmaz Bilişim", v: "98.200 ₺", g: "+12%" },
                    { n: "Global Supply", v: "76.400 ₺", g: "+5%" },
                    { n: "E-Ticaret Deposu", v: "54.100 ₺", g: "-2%" }
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-gray-400 text-xs">{i+1}</div>
                          <div>
                             <p className="font-bold text-sm leading-tight">{d.n}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase">{d.v}</p>
                          </div>
                       </div>
                       <span className={`text-[10px] font-black ${d.g.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{d.g}</span>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
                  Tüm Bayi Raporu
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Regional Sales */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
               <h4 className="text-sm font-black uppercase tracking-widest text-white/40 mb-6">Bölgesel Dağılım</h4>
               <div className="space-y-4">
                  {[
                    { r: "İstanbul", p: 65 },
                    { r: "Ankara", p: 15 },
                    { r: "İzmir", p: 10 },
                    { r: "Diğer", p: 10 }
                  ].map((reg, i) => (
                    <div key={i} className="space-y-1.5">
                       <div className="flex justify-between text-[10px] font-black uppercase">
                          <span>{reg.r}</span>
                          <span>%{reg.p}</span>
                       </div>
                       <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${reg.p}%` }} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Conversion Metrics */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8">
               <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Dönüşüm Oranları</h4>
               <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-blue-600" strokeDasharray={364} strokeDashoffset={364 * (1 - 0.74)} strokeLinecap="round" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-900">%3.4</span>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">B2C Ortalaması</span>
                     </div>
                  </div>
                  <p className="mt-6 text-xs text-gray-400 font-medium text-center">Ziyaretçiden siparişe dönüşüm oranı sektörel ortalamanın <span className="text-green-600 font-black">+%1.2</span> üzerindedir.</p>
               </div>
            </div>

            {/* Stock Health */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 flex flex-col justify-between">
               <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Stok Sağlığı</h4>
                  <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                     <AlertCircle className="w-5 h-5 text-red-600" />
                     <div>
                        <p className="text-xs font-black text-red-900 leading-tight">12 Ürün Kritik Seviyede</p>
                        <p className="text-[10px] text-red-600 font-bold uppercase mt-1">Acil Tedarik Gerekli</p>
                     </div>
                  </div>
               </div>
               <button className="w-full mt-6 py-4 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" /> Stok Tahmini Oluştur
               </button>
            </div>
         </div>
      </main>
    </>
  );
}
