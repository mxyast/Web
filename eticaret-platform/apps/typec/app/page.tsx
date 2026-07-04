import { prisma } from "@eticaret/database";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ProductSliderClient } from "../components/ProductSliderClient";

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const DEFAULT_IMAGES: Record<string, string> = {
  chargers: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop",
  audio: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop",
  smart: "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?q=80&w=1974&auto=format&fit=crop",
};

const DEFAULT_BANNER_IMAGE = "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=2070&auto=format&fit=crop";

export default async function Home() {
  const [featuredProducts, popularProducts, sections, banner, dbBrands] = await Promise.all([
    prisma.product.findMany({
      where: { isB2C: true, isActive: true },
      include: {
        brand: true,
        variants: {
          where: { isActive: true },
          include: { price: true }
        }
      },
      take: 10,
      orderBy: { createdAt: "desc" }
    }),
    prisma.product.findMany({
      where: { isB2C: true, isActive: true },
      include: {
        brand: true,
        variants: {
          where: { isActive: true },
          include: { price: true }
        }
      },
      take: 10,
      orderBy: { name: "asc" }
    }),
    prisma.homepageSection.findMany({
      where: { isActive: true, isDraft: false },
      orderBy: { sortOrder: "asc" },
      include: { category: true },
    }),
    prisma.homepageBanner.findFirst({ where: { isActive: true, isDraft: false } }),
    prisma.brand.findMany({
      take: 8,
      orderBy: { name: "asc" }
    }),
  ]);

  const displayBrands = dbBrands.length > 0
    ? dbBrands.map((b) => b.name)
    : ["BASEUS", "typec", "WUW", "ANKER", "SAMSUNG", "APPLE"];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TypeC",
    url: "https://typec.com.tr",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://typec.com.tr/products?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const chargers = sections.find(s => s.key === "chargers");
  const audio = sections.find(s => s.key === "audio");
  const smart = sections.find(s => s.key === "smart");

  const getSectionImage = (s: typeof chargers) =>
    s ? (s.imageUrl || s.defaultImageUrl || DEFAULT_IMAGES[s.key] || "") : "";

  const getSectionHref = (s: typeof chargers, key: string) => {
    if (s?.category) return `/products?cat=${s.category.id}`;
    return `/products`;
  };

  // Banner defaults
  const b = banner || {
    id: "",
    badge: "BASEUS EXCLUSIVE",
    title: "ŞARJIN GELECEĞİ",
    titleHighlight: "GAn5 PRO.",
    description: "Baseus'un en yeni nesil GaN teknolojisi ile cihazlarınızı %300 daha hızlı ve güvenli şarj edin.",
    buttonText: "LANSMAN ÜRÜNLERİ",
    buttonUrl: "/products?brand=baseus",
    imageUrl: null,
  };

  return (
    <div className="selection:bg-[#E31E24] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Category Grid - Viewport Fill Hero */}
      <section className="px-4 md:px-8 max-w-[1440px] mx-auto pt-[48px] h-auto lg:h-[90dvh]">
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

          {/* Şarj Üniteleri */}
          <Link href={getSectionHref(chargers, "chargers")} className="group relative overflow-hidden rounded-[1.5rem] min-h-[120px]">
            <img
              src={getSectionImage(chargers)}
              alt={chargers?.title || "Şarj Üniteleri"}
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-lg font-bold text-white tracking-[0.2em] uppercase mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                {chargers?.title || "ŞARJ ÜNİTELERİ"}
              </h3>
              <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">Koleksiyonu Gör</span>
            </div>
          </Link>

          {/* Ses Sistemleri */}
          <Link href={getSectionHref(audio, "audio")} className="group relative overflow-hidden rounded-[1.5rem] min-h-[120px]">
            <img
              src={getSectionImage(audio)}
              alt={audio?.title || "Ses Sistemleri"}
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-lg font-bold text-white tracking-[0.2em] uppercase mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                {audio?.title || "SES SİSTEMLERİ"}
              </h3>
              <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">Koleksiyonu Gör</span>
            </div>
          </Link>

          {/* Akıllı Yaşam */}
          <Link href={getSectionHref(smart, "smart")} className="md:col-span-2 group relative overflow-hidden rounded-[1.5rem] min-h-[120px]">
            <img
              src={getSectionImage(smart)}
              alt={smart?.title || "Akıllı Yaşam"}
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-xl font-bold text-white tracking-[0.2em] uppercase mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>
                {smart?.title || "AKILLI YAŞAM"}
              </h3>
              <p className="text-white/60 text-xs font-medium tracking-wide">Evinizi teknolojiyle dönüştürün.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Popular Brands Banner */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50 overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marqueeLtr {
            0% { transform: translate3d(-50%, 0, 0); }
            100% { transform: translate3d(0, 0, 0); }
          }
          .animate-marquee-ltr {
            display: flex;
            width: max-content;
            animation: marqueeLtr 30s linear infinite;
          }
        `}} />
        <div className="w-full overflow-hidden relative">
          <div className="animate-marquee-ltr items-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            {[...displayBrands, ...displayBrands, ...displayBrands, ...displayBrands].map((brand, idx) => (
              <span key={idx} className="text-2xl font-black tracking-tighter text-[#1A1A1A] uppercase whitespace-nowrap mx-12">
                {brand}
              </span>
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

        <div className="relative">
          <ProductSliderClient
            products={featuredProducts.map((product) => {
              const firstVariant = product.variants[0];
              const displayPrice = firstVariant?.price?.retailPrice ? Number(firstVariant.price.retailPrice) : 0;
              const comparePrice = firstVariant?.price?.comparePrice ? Number(firstVariant.price.comparePrice) : undefined;
              return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                brand: { name: product.brand?.name || "typec" },
                price: { retailPrice: displayPrice, comparePrice },
                image: firstVariant?.images?.[0] || "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=600",
                variantId: firstVariant?.id,
              };
            })}
          />
        </div>
      </section>

      {/* Popular Products */}
      <section className="pb-32 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-20 gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              POPÜLER SEÇİMLER
            </h2>
            <p className="text-gray-400 font-medium">En çok tercih edilen, en çok yorum alan popüler teknoloji aksesuarları.</p>
          </div>
          <Link href="/products?sort=popular" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#1A1A1A] hover:text-[#E31E24] transition-all">
            TÜMÜNÜ GÖR <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative">
          <ProductSliderClient
            products={popularProducts.map((product) => {
              const firstVariant = product.variants[0];
              const displayPrice = firstVariant?.price?.retailPrice ? Number(firstVariant.price.retailPrice) : 0;
              const comparePrice = firstVariant?.price?.comparePrice ? Number(firstVariant.price.comparePrice) : undefined;
              return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                brand: { name: product.brand?.name || "typec" },
                price: { retailPrice: displayPrice, comparePrice },
                image: firstVariant?.images?.[0] || "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=600",
                variantId: firstVariant?.id,
              };
            })}
          />
        </div>
      </section>

      {/* Campaign Banner — from DB */}
      <section className="px-6 md:px-12 pb-32 max-w-[1440px] mx-auto">
        <div className="bg-[#1A1A1A] rounded-[3rem] overflow-hidden flex flex-col lg:flex-row items-center group">
          <div className="flex-1 p-12 md:p-24 lg:p-32">
            <span className="text-[#E31E24] font-bold text-[10px] tracking-[0.5em] mb-8 block uppercase">{b.badge}</span>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 text-white leading-[0.95] drop-shadow-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
              {b.title} <br /> <span className="text-[#E31E24]">{b.titleHighlight}</span>
            </h3>
            <p className="text-gray-400 font-medium mb-12 max-w-md leading-relaxed text-lg">
              {b.description}
            </p>
            <Link href={b.buttonUrl} className="inline-flex items-center gap-5 bg-white text-[#1A1A1A] px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-[#E31E24] hover:text-white transition-all duration-500">
              {b.buttonText} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex-1 w-full h-[500px] lg:h-[800px] overflow-hidden relative">
            <img
              src={b.imageUrl || DEFAULT_BANNER_IMAGE}
              alt="Kampanya"
              className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#1A1A1A]/50" />
          </div>
        </div>
      </section>

      {/* Instagram/Social Grid */}
      <section className="py-32 border-t border-gray-100 bg-[#FBFBFB]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center mb-20">
          <p className="text-[#E31E24] font-bold text-[10px] tracking-[0.5em] mb-6 uppercase">INSTAGRAM'DA BİZ</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            #TYPECEXPERIENCE
          </h2>
          <p className="text-gray-400 text-sm font-medium">Binlerce mutlu teknoloji severin arasına katılın.</p>
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
