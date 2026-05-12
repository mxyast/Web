import { prisma } from "@eticaret/database";
import { ProductCard } from "@repo/ui/product-card";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default async function Home() {
  const products = await prisma.product.findMany({
    where: {
      isB2C: true,
      isActive: true
    },
    include: {
      brand: true,
      variants: {
        where: { isActive: true },
        include: {
          price: true
        }
      }
    },
    take: 8,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="selection:bg-[#E31E24] selection:text-white">
      {/* Category Grid - Viewport Fill Hero */}
      <section className="px-4 md:px-8 max-w-[1440px] mx-auto pt-[48px]" style={{ height: '90dvh' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 h-full pb-3">
          {/* Main Feature */}
          <Link href="/products" className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[1.5rem] min-h-[260px]">
            <img
              src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2030&auto=format&fit=crop"
              alt="Yeni Koleksiyon"
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-10 left-10 text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">PREMIUM COLLECTION</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-[0.9]" style={{ fontFamily: 'var(--font-heading)' }}>
                TEKNOLOJİDE <br /> YENİ DÖNEM.
              </h2>
              <div className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] group-hover:gap-6 transition-all bg-white text-black px-7 py-3.5 rounded-full">
                ŞİMDİ KEŞFET <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Sub Features */}
          <Link href="/categories?c=chargers" className="group relative overflow-hidden rounded-[1.5rem] min-h-[120px]">
            <img
              src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop"
              alt="Şarj Sistemleri"
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-lg font-bold text-white tracking-[0.2em] uppercase mb-3" style={{ fontFamily: 'var(--font-heading)' }}>ŞARJ ÜNİTELERİ</h3>
              <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">Koleksiyonu Gör</span>
            </div>
          </Link>

          <Link href="/categories?c=audio" className="group relative overflow-hidden rounded-[1.5rem] min-h-[120px]">
            <img
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop"
              alt="Ses Dünyası"
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-lg font-bold text-white tracking-[0.2em] uppercase mb-3" style={{ fontFamily: 'var(--font-heading)' }}>SES SİSTEMLERİ</h3>
              <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">Koleksiyonu Gör</span>
            </div>
          </Link>

          <Link href="/categories?c=smart" className="md:col-span-2 group relative overflow-hidden rounded-[1.5rem] min-h-[120px]">
            <img
              src="https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?q=80&w=1974&auto=format&fit=crop"
              alt="Yaşam Alanı"
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-xl font-bold text-white tracking-[0.2em] uppercase mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>AKILLI YAŞAM</h3>
              <p className="text-white/60 text-xs font-medium tracking-wide">Evinizi teknolojiyle dönüştürün.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Popular Brands Banner */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-wrap items-center justify-between gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            {["BASEUS", "MIOJI", "WUW", "ANKER", "SAMSUNG", "APPLE"].map(brand => (
              <span key={brand} className="text-2xl font-black tracking-tighter text-[#1A1A1A]">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-20 gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              HAFTANIN EN İYİLERİ
            </h2>
            <p className="text-gray-400 font-medium">Trendleri takip edenlerin favori seçimleri burada.</p>
          </div>
          <Link href="/products" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#1A1A1A] hover:text-[#E31E24] transition-all">
            TÜMÜNÜ GÖR <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product, i) => {
            const firstVariant = product.variants[0];
            const displayPrice = firstVariant?.price?.retailPrice ? Number(firstVariant.price.retailPrice) : 0;

            // Diverse high-quality tech images for demonstration
            const demoImages = [
              "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=600",
              "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?q=80&w=600",
              "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600",
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600",
              "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600",
              "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600",
              "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600",
              "https://images.unsplash.com/photo-1504274066654-52ff1751d79c?q=80&w=600"
            ];

            return (
              <ProductCard
                key={product.id}
                platform="TYPEC"
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  brand: { name: product.brand?.name || "Mioji" },
                  price: { retailPrice: displayPrice },
                  image: demoImages[i % demoImages.length]
                }}
              />
            );
          })}
        </div>
      </section>

      {/* Campaign Banner - Enhanced */}
      <section className="px-6 md:px-12 pb-32 max-w-[1440px] mx-auto">
        <div className="bg-[#1A1A1A] rounded-[3rem] overflow-hidden flex flex-col lg:flex-row items-center group">
          <div className="flex-1 p-12 md:p-24 lg:p-32">
            <span className="text-[#E31E24] font-bold text-[10px] tracking-[0.5em] mb-8 block uppercase">BASEUS EXCLUSIVE</span>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 text-white leading-[0.95] drop-shadow-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
              ŞARJIN <br /> GELECEĞİ <br /> <span className="text-[#E31E24]">GAn5 PRO.</span>
            </h3>
            <p className="text-gray-400 font-medium mb-12 max-w-md leading-relaxed text-lg">
              Baseus'un en yeni nesil GaN teknolojisi ile cihazlarınızı %300 daha hızlı ve güvenli şarj edin.
            </p>
            <Link href="/products?brand=baseus" className="inline-flex items-center gap-5 bg-white text-[#1A1A1A] px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-[#E31E24] hover:text-white transition-all duration-500">
              LANSMAN ÜRÜNLERİ <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex-1 w-full h-[500px] lg:h-[800px] overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=2070&auto=format&fit=crop"
              alt="Baseus Campaign"
              className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#1A1A1A]/50" />
          </div>
        </div>
      </section>

      {/* Instagram/Social Grid - More Dynamic */}
      <section className="py-32 border-t border-gray-100 bg-[#FBFBFB]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center mb-20">
          <p className="text-[#E31E24] font-bold text-[10px] tracking-[0.5em] mb-6 uppercase">INSTAGRAM'DA BİZ</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            #MIOJIEXPERIENCE
          </h2>
          <p className="text-gray-400 text-sm font-medium">Binlerce mutlu teknoloji severin arasın katılım.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-4">
          {[
            "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?q=80&w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=400&h=400&fit=crop",
          ].map((url, i) => (
            <div key={i} className="aspect-square overflow-hidden group relative rounded-2xl">
              <img src={url} alt="Insta" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <Instagram className="text-white w-8 h-8" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
