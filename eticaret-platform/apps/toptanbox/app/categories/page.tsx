import { prisma } from "@eticaret/database";
import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <>
      <main className="flex-1 py-12 md:py-24 pt-36 md:pt-40 bg-[var(--color-toptan-bg)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Tüm Kategoriler</h1>
            <p className="text-gray-500 text-lg font-medium">İhtiyacınız olan ürün grubunu seçerek hızlıca filtreleme yapabilirsiniz.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category: any) => (
              <Link 
                key={category.id} 
                href={`/products?cat=${category.id}`}
                className="group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <Package className="w-10 h-10 text-gray-300 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-8">{category._count.products} Ürün Listeleniyor</p>
                <div className="flex items-center gap-2 text-sm font-black text-orange-600 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Ürünleri Gör <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
