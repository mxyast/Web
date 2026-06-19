import { prisma } from "@eticaret/database";
import { FileText, Plus, Download, MoreVertical, Trash2, Edit } from "lucide-react";
import { Header } from "../../components/Header";
import Link from "next/link";
import { ToastContainer } from "../../components/Toast";
import { deleteCatalogTemplate } from "./actions";

export default async function AdminCatalogsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;

  const templates = await (prisma as any).catalogTemplate.findMany({
    include: {
      brand: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header title="Katalog Motoru Yönetimi" />

      <main className="flex-1 overflow-y-auto p-8">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h2 className="text-xl font-black text-slate-900">Katalog Şablonları</h2>
               <p className="text-xs text-gray-400 font-medium mt-1">Bayiler için özelleştirilebilir PDF katalog yönetimi</p>
            </div>
            <Link href="/catalogs/new" className="bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20">
               <Plus className="w-4 h-4" /> Yeni Şablon Oluştur
            </Link>
         </div>

         {templates.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <FileText className="w-8 h-8 text-gray-400" />
             </div>
             <h3 className="text-sm font-black text-slate-800 mb-2">Henüz Katalog Şablonu Yok</h3>
             <p className="text-xs text-gray-500 max-w-sm mx-auto">Müşterilerinizin indirebileceği ilk PDF katalog şablonunu oluşturun.</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {templates.map((cat: any) => (
                <div key={cat.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 group hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                      <FileText className="w-6 h-6" />
                   </div>
                   <h3 className="font-black text-slate-900 mb-1 line-clamp-1">{cat.name}</h3>
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{cat.type}</p>
                   {cat.description && <p className="text-xs text-gray-500 mb-6 flex-1 line-clamp-2">{cat.description}</p>}
                   
                   <div className="flex flex-wrap gap-2 mb-6">
                      {cat.brand && <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md">Marka: {cat.brand.name}</span>}
                      {cat.category && <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-1 rounded-md">Kategori: {cat.category.name}</span>}
                   </div>

                   <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                      <span className="text-[10px] font-bold text-gray-400">
                        {new Date(cat.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                      <div className="flex gap-2">
                         <Link href={`/catalogs/${cat.id}`} className="p-2 hover:bg-blue-50 hover:text-blue-600 text-gray-400 rounded-lg transition-colors" title="Düzenle">
                            <Edit className="w-4 h-4" />
                         </Link>
                         <form action={async () => {
                           "use server";
                           await deleteCatalogTemplate(cat.id);
                         }}>
                           <button type="submit" className="p-2 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-lg transition-colors" title="Sil">
                              <Trash2 className="w-4 h-4" />
                           </button>
                         </form>
                      </div>
                   </div>
                </div>
              ))}
           </div>
         )}
      </main>

      <ToastContainer successParam={success} />
    </>
  );
}
