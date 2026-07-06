import { prisma } from "@eticaret/database";
import { Header } from "../../components/Header";
import { Award, Package } from "lucide-react";
import { DeleteBrandButton } from "./DeleteBrandButton";
import { BrandForm } from "./BrandForm";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <>
      <Header title="Marka Yönetimi" />

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">{brands.length} marka tanımlı</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Sol Kolon - Marka Ekleme Formu */}
          <div className="lg:col-span-1">
            <BrandForm />
          </div>

          {/* Sağ Kolon - Marka Listesi */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-gray-400" />
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Markalar</h2>
              </div>
            </div>

            {brands.length === 0 ? (
              <div className="text-center py-16 text-sm text-gray-400 font-bold">
                Henüz marka tanımlanmamış.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center justify-between px-8 py-5 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Award className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{brand.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">/{brand.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                        <Package className="w-3.5 h-3.5" />
                        {brand._count.products} ürün
                      </div>
                      <DeleteBrandButton
                        brandId={brand.id}
                        brandName={brand.name}
                        productCount={brand._count.products}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
