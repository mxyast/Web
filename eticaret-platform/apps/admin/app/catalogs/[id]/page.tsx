import { prisma } from "@eticaret/database";
import { ArrowLeft, Save, Info, Settings } from "lucide-react";
import Link from "next/link";
import { updateCatalogTemplate } from "../actions";
import CatalogProductSelector from "../new/CatalogProductSelector";
import { Header } from "../../../components/Header";
import { notFound } from "next/navigation";

export default async function EditCatalogTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const template = await (prisma as any).catalogTemplate.findUnique({
    where: { id }
  });

  if (!template) {
    return notFound();
  }

  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  // Update action'ını bu spesifik ID'ye bağla
  const updateAction = updateCatalogTemplate.bind(null, id);

  return (
    <>
      <Header title="Katalog Şablonunu Düzenle" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-3xl mx-auto">
          <form action={updateAction} className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/catalogs" className="p-2 bg-white rounded-full border border-gray-100 hover:bg-gray-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Şablonu Düzenle</h1>
          </div>
          <button type="submit" className="bg-blue-600 text-white text-xs font-bold px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20">
            <Save className="w-4 h-4" /> Değişiklikleri Kaydet
          </button>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <Info className="w-5 h-5 text-gray-400" />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Temel Bilgiler</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Şablon Adı</label>
                <input required name="name" type="text" defaultValue={template.name} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Açıklama (Opsiyonel)</label>
                <textarea name="description" rows={3} defaultValue={template.description || ""} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-gray-400" />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Filtreleme & İçerik Kuralları</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Katalog Tipi</label>
                <select required name="type" defaultValue={template.type} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none">
                  <option value="Genel Katalog">Genel Katalog</option>
                  <option value="Marka Özel">Marka Özel</option>
                  <option value="Kategori Özel">Kategori Özel</option>
                  <option value="Kampanya">Kampanya / Promosyon</option>
                </select>
              </div>

              <CatalogProductSelector 
                brands={brands} 
                categories={categories} 
                initialBrandId={template.brandId || ""}
                initialCategoryId={template.categoryId || ""}
                initialIncludedProductIds={template.includedProductIds || []}
              />
              
              <p className="text-[11px] font-medium text-gray-400 px-1 mt-2">
                Marka veya kategori seçtikten sonra, kataloğa dahil etmek istediğiniz ürünleri kutucukları işaretleyerek belirleyebilirsiniz. Tümünü Seç butonuyla o filtredeki tüm ürünleri kolayca kataloğa alabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </form>
        </div>
      </main>
    </>
  );
}
