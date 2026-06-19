import { prisma } from "@eticaret/database";
import Link from "next/link";
import { ChevronDown, Layers } from "lucide-react";
import Image from "next/image";

export default async function CategoriesPage() {
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { products: { where: { isActive: true, isB2C: true } } }
      }
    }
  });

  return (
    <>
      <div className="bg-[#FBFBFB] py-16 md:py-24 border-b border-gray-100 pt-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black mb-4">Koleksiyonlar</h1>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-black transition-colors">Anasayfa</Link>
            <ChevronDown className="w-3 h-3 -rotate-90" />
            <span className="text-black">Markalar & Koleksiyonlar</span>
          </div>
        </div>
      </div>

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="mb-12">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Layers className="w-6 h-6 text-typec-red" /> Seçkin Markalarımız
            </h2>
            <p className="text-sm text-gray-400 mt-2 font-medium">Favori markanızı seçin ve onlara ait yeni sezon ürünleri keşfedin.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link
                href={`/products?brand=${brand.id}`}
                key={brand.id}
                className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-gray-100 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center text-center h-64"
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="z-10 flex flex-col items-center justify-center h-full">
                  <div className="w-20 h-20 bg-black rounded-3xl mb-6 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-black/10">
                    <span className="text-white font-black text-2xl">{brand.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight group-hover:text-typec-red transition-colors">{brand.name}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">
                    {brand._count.products} ÜRÜN
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
