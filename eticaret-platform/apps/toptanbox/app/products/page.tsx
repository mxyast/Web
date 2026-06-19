import { prisma, getB2BAvailableStock, searchProducts } from "@eticaret/database";
import { ProductCard } from "@repo/ui/product-card";
import { List, LayoutGrid, Filter, Search } from "lucide-react";
import Link from "next/link";

export default async function ProductsPage({ 
  searchParams: searchParamsPromise 
}: { 
  searchParams: Promise<{ 
    view?: string; 
    q?: string;
    cat?: string;
    brand?: string;
    stock?: string;
  }>
}) {
  const searchParams = await searchParamsPromise;
  const isListView = searchParams.view === "list";
  
  const { products: productsRaw, didYouMean, total } = await searchProducts({
    query: searchParams.q,
    categoryId: searchParams.cat,
    brandId: searchParams.brand,
    platform: "B2B",
  });

  const products = await Promise.all(productsRaw.map(async (p) => {
    const firstVariantId = p.variants[0]?.id;
    const availableStock = firstVariantId ? await getB2BAvailableStock(firstVariantId) : 0;
    return { ...p, availableStock };
  }));

  const categories = await prisma.category.findMany();
  const brands = await prisma.brand.findMany();

  return (
    <>
      <main className="flex-1 py-12 pt-36 md:pt-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
             <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ürün Kataloğu</h1>
                <p className="text-sm text-gray-500 font-medium">Toplam {total} ürün listeleniyor</p>
                {searchParams.q && <p className="text-xs font-medium text-orange-600 mt-1">"{searchParams.q}" araması için sonuçlar</p>}
             </div>

             <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
                <Link 
                  href={`/products?view=grid${searchParams.cat ? `&cat=${searchParams.cat}` : ''}`} 
                  className={`p-2 rounded-xl transition-all ${!isListView ? "bg-slate-900 text-white shadow-lg" : "text-gray-400 hover:text-black"}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </Link>
                <Link 
                  href={`/products?view=list${searchParams.cat ? `&cat=${searchParams.cat}` : ''}`} 
                  className={`p-2 rounded-xl transition-all ${isListView ? "bg-slate-900 text-white shadow-lg" : "text-gray-400 hover:text-black"}`}
                >
                  <List className="w-5 h-5" />
                </Link>
             </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
             {/* Sidebar Filters */}
             <aside className="w-full lg:w-64 space-y-6 shrink-0">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                   <h3 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Filter className="w-4 h-4 text-orange-600" /> Filtrele
                   </h3>
                   
                   <div className="space-y-8">
                      <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">Kategoriler</label>
                         <div className="space-y-3">
                            {categories.map(c => (
                               <Link 
                                 key={c.id} 
                                 href={`/products?cat=${c.id}${isListView ? '&view=list' : ''}`}
                                 className={`flex items-center justify-between group cursor-pointer ${searchParams.cat === c.id ? "text-orange-600" : "text-gray-500"}`}
                               >
                                  <span className="text-sm font-bold group-hover:text-black transition-colors">{c.name}</span>
                                  <div className={`w-1.5 h-1.5 rounded-full ${searchParams.cat === c.id ? "bg-orange-600" : "bg-transparent"}`} />
                               </Link>
                            ))}
                         </div>
                      </div>

                      <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">Markalar</label>
                         <div className="space-y-3">
                            {brands.map(b => (
                               <Link 
                                 key={b.id} 
                                 href={`/products?brand=${b.id}${isListView ? '&view=list' : ''}`}
                                 className={`flex items-center justify-between group cursor-pointer ${searchParams.brand === b.id ? "text-orange-600" : "text-gray-500"}`}
                               >
                                  <span className="text-sm font-bold group-hover:text-black transition-colors">{b.name}</span>
                               </Link>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </aside>

             {/* Main List */}
             <div className="flex-1">
                {isListView ? (
                   <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                         <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Ürün / SKU</th>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Stok Durumu</th>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Birim Fiyat</th>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Adet</th>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">İşlem</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-50">
                            {products.map((product) => (
                               <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-8 py-8">
                                     <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl shrink-0 flex items-center justify-center">
                                           <img src="https://placehold.co/100x100/F9F9F9/111827?text=B2B" className="w-10 h-10 object-contain" alt="" />
                                        </div>
                                        <div>
                                           <p className="font-black text-sm leading-tight text-slate-900">{product.name}</p>
                                           <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-tighter">{product.brand.name} | SKU: {product.variants[0]?.sku}</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-8 py-8 text-center">
                                     <div className="flex flex-col items-center">
                                        <span className={`text-sm font-black ${product.availableStock > 100 ? "text-green-600" : "text-orange-500"}`}>
                                           {product.availableStock} Adet
                                        </span>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Koli: 50 Ad.</span>
                                     </div>
                                  </td>
                                  <td className="px-8 py-8 text-right">
                                     <p className="text-sm font-black text-slate-900">
                                        {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(product.variants[0]?.price?.listA ? Number(product.variants[0].price.listA) : 0)}
                                     </p>
                                     <p className="text-[9px] font-black text-orange-600 uppercase tracking-tighter">Liste A</p>
                                  </td>
                                  <td className="px-8 py-8 text-center">
                                     <input type="number" defaultValue="1" className="w-20 bg-gray-100 border-none rounded-xl py-2.5 text-center text-sm font-black focus:ring-2 focus:ring-orange-500/20" />
                                  </td>
                                  <td className="px-8 py-8 text-right">
                                     <button className="bg-slate-900 text-white text-xs font-black px-6 py-2.5 rounded-2xl hover:bg-black transition-all">Ekle</button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                      {products.map((product) => (
                        <ProductCard 
                          key={product.id}
                          platform="TOPTANBOX"
                          product={{
                            id: product.id,
                            name: product.name,
                            slug: product.slug,
                            brand: { name: product.brand.name },
                            price: { retailPrice: product.variants[0]?.price?.listA ? Number(product.variants[0].price.listA) : 0 }
                          }}
                        />
                      ))}
                   </div>
                )}
                {products.length === 0 && (
                   <div className="text-center py-24 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                      <Search className="w-12 h-12 text-gray-300 mx-auto mb-6" />
                      <h2 className="text-xl font-black mb-2">Sonuç Bulunamadı</h2>
                      {didYouMean ? (
                        <>
                          <p className="text-sm text-gray-500 font-medium mb-2">"{searchParams.q}" için ürün bulunamadı.</p>
                          <p className="text-sm text-gray-700">
                            Bunu mu demek istediniz:{" "}
                            <Link
                              href={`/products?q=${encodeURIComponent(didYouMean)}`}
                              className="font-black text-orange-600 underline underline-offset-4 hover:text-orange-700 transition-colors"
                            >
                              {didYouMean}
                            </Link>
                            ?
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 font-medium">Seçilen filtrelere uygun ürün bulunmamaktadır.</p>
                      )}
                      <Link href="/products" className="inline-block mt-6 text-xs font-black text-orange-600 hover:underline">Tüm Kataloğu Gör</Link>
                   </div>
                )}
             </div>
          </div>
        </div>
      </main>
    </>
  );
}
