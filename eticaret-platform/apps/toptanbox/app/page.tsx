import { Package, ChevronRight } from "lucide-react";
import { prisma, getB2BAvailableStock } from "@eticaret/database";
import { ProductCard } from "@repo/ui/product-card";
import Link from "next/link";

export default async function Home() {
  const productsRaw = await prisma.product.findMany({
    where: { 
      isB2B: true,
      isActive: true 
    },
    include: {
      brand: true,
      variants: {
        include: {
          price: true
        }
      }
    },
    take: 8,
    orderBy: { createdAt: "desc" }
  });

  // Calculate B2B available stock for each product's first variant
  const products = await Promise.all(productsRaw.map(async (p: any) => {
    const firstVariantId = p.variants[0]?.id;
    const availableStock = firstVariantId ? await getB2BAvailableStock(firstVariantId) : 0;
    return { ...p, availableStock };
  }));

  return (
    <>
      {/* B2B Hero Section */}
      <section className="bg-slate-900 text-white py-20 pt-36 md:pt-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Teknoloji Toptancılığında <br/>
              <span className="text-[var(--color-toptan-orange)]">Dijital Dönüşüm.</span>
            </h1>
            <p className="text-gray-400 mb-10 text-lg leading-relaxed">
              ToptanBox B2B portalı ile stokları anlık takip edin, size özel iskonto oranlarıyla 7/24 sipariş verin.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[var(--color-toptan-orange)] hover:bg-[var(--color-toptan-orange-hover)] text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg shadow-orange-900/20">
                Hızlı Sipariş Paneli
              </button>
              <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-all">
                Fiyat Listesi (PDF)
              </button>
            </div>
          </div>

          {/* Stats / Promo Card */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            {[
              { label: "Aktif Bayi", value: "2.500+", icon: "👥" },
              { label: "Ürün Çeşidi", value: "1.200+", icon: "📦" },
              { label: "Aylık Sevkiyat", value: "15.000+", icon: "🚚" },
              { label: "Marka Sayısı", value: "45+", icon: "🏷️" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-black mb-1">{stat.value}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Tiers Section */}
      <section className="py-12 bg-white border-b border-gray-100">
         <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
               {[
                 { t: "10k TL Üstü", d: "%3 İskonto" },
                 { t: "25k TL Üstü", d: "%7 İskonto" },
                 { t: "50k TL Üstü", d: "%12 İskonto" }
               ].map((tier, i) => (
                 <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[var(--color-toptan-orange)]">
                       <Package className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{tier.t}</p>
                       <p className="text-lg font-black">{tier.d}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Toptan Ürün Kataloğu</h2>
              <p className="text-sm text-gray-500 mt-2 font-medium">Güncel stok durumları ve koli içi adetler</p>
            </div>
            <Link href="/products" className="bg-white border border-gray-200 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
              Tümünü Filtrele <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                platform="TOPTANBOX"
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  brand: { name: product.brand.name },
                  price: { retailPrice: 0 } // Prices hidden for non-logged in
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
