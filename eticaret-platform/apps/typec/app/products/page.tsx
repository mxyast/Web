import { prisma, searchProducts } from "@eticaret/database";
import { SlidersHorizontal, ChevronDown, Search, X } from "lucide-react";
import Link from "next/link";
import { PriceFilter } from "@/components/PriceFilter";
import { ProductGridClient } from "../../components/ProductGridClient";

export default async function ProductsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{
    q?: string;
    cat?: string;
    brand?: string;
    min?: string;
    max?: string;
    sort?: "new" | "popular";
  }>;
}) {
  const searchParams = await searchParamsPromise;
  const { products, didYouMean, total } = await searchProducts({
    query: searchParams.q,
    categoryId: searchParams.cat,
    brandId: searchParams.brand,
    minPrice: searchParams.min ? Number(searchParams.min) : undefined,
    maxPrice: searchParams.max ? Number(searchParams.max) : undefined,
    platform: "B2C",
    sort: searchParams.sort,
  });

  const categories = await prisma.category.findMany();
  const brands = await prisma.brand.findMany();

  let pageTitle = "Ürün Koleksiyonu";
  if (searchParams.sort === "new") pageTitle = "Yeni Gelenler";
  if (searchParams.sort === "popular") pageTitle = "Çok Satanlar";

  return (
    <>
      {/* Page Header */}
      <div className="bg-[#FBFBFB] py-16 md:py-24 border-b border-gray-100 pt-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black mb-4">{pageTitle}</h1>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-black transition-colors">Anasayfa</Link>
            <ChevronDown className="w-3 h-3 -rotate-90" />
            <span className="text-black">{pageTitle}</span>
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
                    {(searchParams.cat || searchParams.brand || searchParams.q || searchParams.min || searchParams.max || searchParams.sort) && (
                      <Link href="/products" className="text-[9px] font-black uppercase tracking-widest text-typec-red flex items-center gap-1">
                        Temizle <X className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="mb-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Kategoriler</p>
                    <div className="space-y-4">
                      {categories.map((cat) => {
                        const params = new URLSearchParams();
                        Object.entries(searchParams).forEach(([k, v]) => {
                          if (typeof v === "string") params.set(k, v);
                        });

                        if (params.get("cat") === cat.id) params.delete("cat");
                        else params.set("cat", cat.id);

                        return (
                          <Link
                            key={cat.id}
                            href={`/products?${params.toString()}`}
                            className={`flex items-center justify-between group cursor-pointer transition-all ${searchParams.cat === cat.id ? "text-black" : "text-gray-500 hover:text-black"}`}
                          >
                            <span className={`text-[13px] font-bold ${searchParams.cat === cat.id ? "translate-x-1" : ""} transition-transform`}>{cat.name}</span>
                            <div className={`w-1 h-1 rounded-full ${searchParams.cat === cat.id ? "bg-typec-red" : "bg-transparent"}`} />
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div className="mb-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Markalar</p>
                    <div className="space-y-4">
                      {brands.map((brand) => {
                        const params = new URLSearchParams();
                        Object.entries(searchParams).forEach(([k, v]) => {
                          if (typeof v === "string") params.set(k, v);
                        });

                        if (params.get("brand") === brand.id) params.delete("brand");
                        else params.set("brand", brand.id);

                        return (
                          <Link
                            key={brand.id}
                            href={`/products?${params.toString()}`}
                            className={`flex items-center justify-between group cursor-pointer transition-all ${searchParams.brand === brand.id ? "text-black" : "text-gray-500 hover:text-black"}`}
                          >
                            <span className={`text-[13px] font-bold ${searchParams.brand === brand.id ? "translate-x-1" : ""} transition-transform`}>{brand.name}</span>
                            <div className={`w-1 h-1 rounded-full ${searchParams.brand === brand.id ? "bg-typec-red" : "bg-transparent"}`} />
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="mb-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Fiyat Aralığı</p>
                    <PriceFilter />
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-12 pb-8 border-b border-gray-100">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-black text-black">
                    Koleksiyon <span className="text-gray-400 ml-1 font-medium">({total} Ürün)</span>
                  </p>
                  {searchParams.q && <p className="text-xs font-medium text-typec-red">"{searchParams.q}" araması için sonuçlar</p>}
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sıralama:</span>
                  <div className="flex gap-4">
                    {(() => {
                      const newParams = new URLSearchParams();
                      Object.entries(searchParams).forEach(([k, v]) => {
                        if (typeof v === "string") newParams.set(k, v);
                      });
                      newParams.set("sort", "new");
                      const isNewActive = searchParams.sort === "new" || !searchParams.sort;
                      return (
                        <Link
                          href={`/products?${newParams.toString()}`}
                          className={`text-xs font-black uppercase tracking-widest hover:text-typec-red transition-all ${isNewActive ? "text-typec-red" : "text-gray-400"}`}
                        >
                          Yeni
                        </Link>
                      );
                    })()}
                    {(() => {
                      const popParams = new URLSearchParams();
                      Object.entries(searchParams).forEach(([k, v]) => {
                        if (typeof v === "string") popParams.set(k, v);
                      });
                      popParams.set("sort", "popular");
                      return (
                        <Link
                          href={`/products?${popParams.toString()}`}
                          className={`text-xs font-black uppercase tracking-widest hover:text-typec-red transition-all ${searchParams.sort === "popular" ? "text-typec-red" : "text-gray-400"}`}
                        >
                          Popüler
                        </Link>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {products.length > 0 ? (
                <ProductGridClient
                  products={products.map((product) => ({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    brand: { name: product.brand.name },
                    price: {
                      retailPrice: product.variants[0]?.price?.retailPrice ? Number(product.variants[0].price.retailPrice) : 0,
                      comparePrice: product.variants[0]?.price?.comparePrice ? Number(product.variants[0].price.comparePrice) : undefined,
                    },
                    image: product.variants[0]?.images?.[0] || undefined,
                    variantId: product.variants[0]?.id,
                  }))}
                />
              ) : (
                <div className="text-center py-32 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                  <Search className="w-16 h-16 text-gray-200 mx-auto mb-8" />
                  <h2 className="text-2xl font-black tracking-tight mb-3">Aradığınızı Bulamadık</h2>
                  {didYouMean ? (
                    <>
                      <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto mb-2">
                        "{searchParams.q}" için sonuç bulunamadı.
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        Bunu mu demek istediniz:{" "}
                        <Link
                          href={`/products?q=${encodeURIComponent(didYouMean)}`}
                          className="font-black text-black underline underline-offset-4 hover:text-typec-red transition-colors"
                        >
                          {didYouMean}
                        </Link>
                        ?
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto">Seçtiğiniz filtrelere veya aramaya uygun ürün bulunmamaktadır.</p>
                  )}
                  <Link href="/products" className="inline-block mt-8 text-[10px] font-black uppercase tracking-widest text-typec-red border-b-2 border-typec-red pb-1">Tümünü Gör</Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
