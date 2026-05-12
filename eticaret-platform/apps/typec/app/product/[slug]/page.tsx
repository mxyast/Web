import { notFound } from "next/navigation";
import { prisma } from "@eticaret/database";
import { Zap, ShieldCheck, Truck, RotateCcw, Star, ChevronRight, Share2, Heart } from "lucide-react";
import Link from "next/link";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      variants: {
        include: {
          price: true,
          inventory: true,
          attributes: true
        }
      }
    }
  });

  if (!product || !product.isB2C) {
    notFound();
  }

  const defaultVariant = product.variants[0];
  const price = defaultVariant?.price?.retailPrice ? Number(defaultVariant.price.retailPrice) : 0;

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-50 py-4 pt-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-black transition-colors">Anasayfa</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-black transition-colors">Ürünler</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black">{product.name}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-white">
        <section className="py-12 md:py-20">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
              {/* Gallery Section */}
              <div className="space-y-6">
                <div className="aspect-square rounded-[3.5rem] bg-[#F9F9F9] flex items-center justify-center overflow-hidden border border-gray-100 relative group">
                   <img 
                     src={defaultVariant?.images?.[0] || "https://images.unsplash.com/photo-1546868831-71cd00a21960?q=80&w=1964&auto=format&fit=crop"} 
                     alt={product.name}
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute top-8 right-8 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center hover:bg-black hover:text-white transition-all">
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center hover:bg-mioji-red hover:text-white transition-all">
                        <Heart className="w-5 h-5" />
                      </button>
                   </div>
                </div>
                <div className="grid grid-cols-4 gap-4 md:gap-6">
                   {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`aspect-square rounded-[2rem] bg-[#F9F9F9] border cursor-pointer transition-all overflow-hidden p-1 ${i === 1 ? "border-black" : "border-gray-100 hover:border-gray-300"}`}>
                         <img src="https://images.unsplash.com/photo-1546868831-71cd00a21960?q=80&w=1964&auto=format&fit=crop" className="w-full h-full object-cover rounded-[1.8rem]" />
                      </div>
                   ))}
                </div>
              </div>

              {/* Info Section */}
              <div className="flex flex-col">
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-black">{product.brand.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= 4 ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200"}`} />
                      ))}
                      <span className="ml-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">(12 Yorum)</span>
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tighter leading-[1.1] mb-8 text-black">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 line-through mb-1">
                        {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price * 1.2)}
                      </span>
                      <span className="text-4xl font-black tracking-tighter text-black">
                        {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price)}
                      </span>
                    </div>
                    <div className="h-12 w-px bg-gray-100 mx-2" />
                    <div className="flex flex-col gap-1">
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest text-center border border-green-100">Stokta Mevcut</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Aynı Gün Ücretsiz Kargo</span>
                    </div>
                  </div>
                </div>

                {/* Variant & Features */}
                <div className="space-y-12 mb-12">
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">Renk Seçenekleri</h4>
                    <div className="flex gap-4">
                       {["#000000", "#F8F8F8", "#2563EB"].map((color, i) => (
                         <button 
                           key={i} 
                           className={`w-12 h-12 rounded-[1.2rem] border-2 transition-all p-1 ${i === 0 ? "border-black" : "border-transparent hover:border-gray-200"}`}
                         >
                           <div className="w-full h-full rounded-[0.9rem] shadow-inner" style={{ backgroundColor: color }} />
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-gray-50 border border-gray-100 group hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all">
                       <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black shadow-sm group-hover:scale-110 transition-transform">
                         <Zap className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Teknoloji</p>
                         <p className="text-xs font-black">GaN5 Pro Hızlı Şarj</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-gray-50 border border-gray-100 group hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all">
                       <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black shadow-sm group-hover:scale-110 transition-transform">
                         <ShieldCheck className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Güvenlik</p>
                         <p className="text-xs font-black">2 Yıl Distribütör Garantili</p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="flex gap-4 p-2 bg-gray-50 rounded-[2.5rem] border border-gray-100 mb-12">
                  <button className="flex-1 bg-black text-white h-16 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
                    Sepete Ekle
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-8 py-8 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <Truck className="w-6 h-6 text-gray-300" />
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-black">Hızlı Teslimat</p>
                      <p className="text-[10px] text-gray-400 font-medium leading-tight">Yarın Kapınızda</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <RotateCcw className="w-6 h-6 text-gray-300" />
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-black">Kolay İade</p>
                      <p className="text-[10px] text-gray-400 font-medium leading-tight">14 Gün Garantili</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-center gap-12 border-b border-gray-100 mb-20 overflow-x-auto no-scrollbar">
                 {["Ürün Özellikleri", "Teknik Detaylar", "Kullanıcı Yorumları"].map((tab, i) => (
                   <button key={i} className={`pb-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${i === 0 ? "text-black" : "text-gray-400 hover:text-black"}`}>
                     {tab}
                     {i === 0 && <span className="absolute bottom-0 left-0 w-full h-1 bg-mioji-red rounded-full" />}
                   </button>
                 ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                <div className="lg:col-span-2 prose prose-lg prose-black max-w-none">
                  <h3 className="text-3xl font-black tracking-tight mb-8">Neden Mioji Tercih Etmelisiniz?</h3>
                  <p className="text-gray-500 font-medium leading-relaxed mb-8">
                    Baseus'un en yeni nesil GaN teknolojisi ile donatılan bu 100W şarj adaptörü, geleneksel şarj cihazlarına göre %30 daha küçük olmasına rağmen daha yüksek verimlilik ve daha az ısı üretimi sağlar. 
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <h4 className="font-black text-sm uppercase tracking-widest text-mioji-red">Akıllı Güç Yönetimi</h4>
                      <p className="text-sm text-gray-500 font-medium">BPS II teknolojisi ile takılı her cihaza ihtiyacı olan tam gücü iletir.</p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-black text-sm uppercase tracking-widest text-mioji-red">Premium Malzeme</h4>
                      <p className="text-sm text-gray-500 font-medium">Havacılık sınıfı polimer kaplama ile maksimum dayanıklılık sağlar.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100">
                   <h4 className="text-lg font-black tracking-tight mb-8">Teknik Veriler</h4>
                   <div className="space-y-4">
                      {defaultVariant?.attributes.map((attr) => (
                        <div key={attr.id} className="flex flex-col py-3 border-b border-gray-200/50 last:border-0">
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{attr.key}</span>
                           <span className="text-sm font-black text-black">{attr.value} {attr.unit || ""}</span>
                        </div>
                      ))}
                      {!defaultVariant?.attributes.length && (
                        <p className="text-xs text-gray-400 font-medium italic">Bu ürün için henüz teknik veri girilmemiş.</p>
                      )}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </>
  );
}
