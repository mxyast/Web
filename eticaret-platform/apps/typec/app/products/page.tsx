import { prisma, searchProducts } from "@eticaret/database";
import { ProductCard } from "@repo/ui/product-card";
import { SlidersHorizontal, ChevronDown, Search, X } from "lucide-react";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { 
    q?: string; 
    cat?: string; 
    brand?: string; 
    min?: string; 
    max?: string;
  };
}) {
  const products = await searchProducts({
    query: searchParams.q,
    categoryId: searchParams.cat,
    brandId: searchParams.brand,
    minPrice: searchParams.min ? Number(searchParams.min) : undefined,
    maxPrice: searchParams.max ? Number(searchParams.max) : undefined,
    platform: "B2C",
  });

  const categories = await prisma.category.findMany();
  const brands = await prisma.brand.findMany();

  return (
    <>
      {/* Page Header */}
      <div className="bg-[#FBFBFB] py-16 md:py-24 border-b border-gray-100 pt-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black mb-4">Ürün Koleksiyonu</h1>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-black transition-colors">Anasayfa</Link>
            <ChevronDown className="w-3 h-3 -rotate-90" />
            <span className="text-black">Koleksiyon</span>
          </div>
        </div>
      </div>

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 shrink-0">
               <div className="sticky top-32 space-y-12">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-black">
                         <SlidersHorizontal className="w-4 h-4" /> Filtreler
                      </h3>
                      {(searchParams.cat || searchParams.brand || searchParams.q) && (
                        <Link href="/products" className="text-[9px] font-black uppercase tracking-widest text-mioji-red flex items-center gap-1">
                          Temizle <X className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                    
                    {/* Category Filter */}
                    <div className="mb-12">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Kategoriler</p>
                       <div className="space-y-4">
                          {categories.map((cat) => (
                             <Link 
                               key={cat.id}
                               href={`/products?cat=${cat.id}${searchParams.brand ? `&brand=${searchParams.brand}` : ""}`}
                               className={`flex items-center justify-between group cursor-pointer transition-all ${searchParams.cat === cat.id ? "text-black" : "text-gray-500 hover:text-black"}`}
                             >
                                <span className={`text-[13px] font-bold ${searchParams.cat === cat.id ? "translate-x-1" : ""} transition-transform`}>{cat.name}</span>
                                <div className={`w-1 h-1 rounded-full ${searchParams.cat === cat.id ? "bg-mioji-red" : "bg-transparent"}`} />
                             </Link>
                          ))}
                       </div>
                    </div>

                    {/* Brand Filter */}
                    <div className="mb-12">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Markalar</p>
                       <div className="space-y-4">
                          {brands.map((brand) => (
                             <Link 
                               key={brand.id}
                               href={`/products?brand=${brand.id}${searchParams.cat ? `&cat=${searchParams.cat}` : ""}`}
                               className={`flex items-center justify-between group cursor-pointer transition-all ${searchParams.brand === brand.id ? "text-black" : "text-gray-500 hover:text-black"}`}
                             >
                                <span className={`text-[13px] font-bold ${searchParams.brand === brand.id ? "translate-x-1" : ""} transition-transform`}>{brand.name}</span>
                                <div className={`w-1 h-1 rounded-full ${searchParams.brand === brand.id ? "bg-mioji-red" : "bg-transparent"}`} />
                             </Link>
                          ))}
                       </div>
                    </div>

                    {/* Price Filter */}
                    <div className="mb-12">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Fiyat Aralığı</p>
                       <div className="grid grid-cols-2 gap-4 mb-4">
                          <input type="number" placeholder="Min" className="bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-black/5 outline-none transition-all" />
                          <input type="number" placeholder="Max" className="bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-black/5 outline-none transition-all" />
                       </div>
                       <button className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/5">Uygula</button>
                    </div>
                  </div>
               </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
               <div className="flex items-center justify-between mb-12 pb-8 border-b border-gray-100">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-black text-black">
                      Koleksiyon <span className="text-gray-400 ml-1 font-medium">({products.length} Ürün)</span>
                    </p>
                    {searchParams.q && <p className="text-xs font-medium text-mioji-red">"{searchParams.q}" araması için sonuçlar</p>}
                  </div>
                  <div className="flex items-center gap-6">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sıralama:</span>
                     <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-mioji-red transition-all">
                        Öne Çıkanlar <ChevronDown className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               {products.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                    {products.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        platform="TYPEC" 
                        product={{
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          brand: { name: product.brand.name },
                          price: { retailPrice: product.variants[0]?.price?.retailPrice ? Number(product.variants[0].price.retailPrice) : 0 }
                        }}
                      />
                    ))}
                 </div>
               ) : (
                 <div className="text-center py-32 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                    <Search className="w-16 h-16 text-gray-200 mx-auto mb-8" />
                    <h2 className="text-2xl font-black tracking-tight mb-3">Aradığınızı Bulamadık</h2>
                    <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto">Seçtiğiniz filtrelere veya aramaya uygun ürün bulunmamaktadır.</p>
                    <Link href="/products" className="inline-block mt-8 text-[10px] font-black uppercase tracking-widest text-mioji-red border-b-2 border-mioji-red pb-1">Tümünü Gör</Link>
                 </div>
               )}
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
