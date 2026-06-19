import { prisma } from "@eticaret/database";
import { ChevronDown, Percent, Zap, Megaphone, Calendar } from "lucide-react";
import Link from "next/link";
import { ProductGridClient } from "../../components/ProductGridClient";

export default async function DealsPage() {
  const now = new Date();

  // 1. Fetch active campaigns
  const activeCampaigns = await (prisma as any).campaign.findMany({
    where: {
      platform: "TYPEC",
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now }
    },
    include: {
      products: {
        where: { isActive: true, isB2C: true },
        include: {
          brand: true,
          category: true,
          variants: {
            include: { price: true }
          }
        }
      }
    },
    orderBy: { startDate: "desc" }
  });

  // 2. Fetch all products to find generic discounted ones not in campaigns
  const allProducts = await prisma.product.findMany({
    where: { isActive: true, isB2C: true },
    include: {
      brand: true,
      category: true,
      variants: {
        include: { price: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const campaignProductIds = new Set(
    activeCampaigns.flatMap((c: any) => c.products.map((p: any) => p.id))
  );

  const discountedProducts = allProducts.filter(product => {
    // Skip if it's already in a campaign
    if (campaignProductIds.has(product.id)) return false;

    if (!product.variants || product.variants.length === 0) return false;
    const firstVariant = product.variants[0];
    if (!firstVariant?.price?.comparePrice) return false;
    
    return Number(firstVariant.price.comparePrice) > Number(firstVariant.price.retailPrice);
  });

  const formatProductForGrid = (product: any) => {
    const variant = product.variants[0];
    const retail = Number(variant?.price?.retailPrice || 0);
    const compare = Number(variant?.price?.comparePrice || 0);
    const discount = compare > 0 ? Math.round(((compare - retail) / compare) * 100) : 0;
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: { name: product.brand.name },
      price: { retailPrice: retail, comparePrice: compare > 0 ? compare : undefined },
      discount: discount > 0 ? discount : undefined,
      image: variant?.images?.[0] || undefined,
      variantId: variant?.id,
    };
  };

  return (
    <>
      <div className="bg-[#E31E24] py-16 md:py-24 pt-32 overflow-hidden relative">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <Percent className="w-6 h-6 text-[#E31E24]" />
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Fırsatlar & Kampanyalar</h1>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Anasayfa</Link>
            <ChevronDown className="w-3 h-3 -rotate-90" />
            <span className="text-white">Kampanyalar</span>
          </div>
        </div>
      </div>

      <main className="flex-1 py-16 md:py-24 space-y-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">

          {/* ACTIVE CAMPAIGNS */}
          {activeCampaigns.map((campaign: any, idx: number) => (
            <div key={campaign.id} className="mb-24 last:mb-0">
              {campaign.imageUrl ? (
                <div className="w-full h-64 md:h-96 rounded-[3rem] overflow-hidden mb-12 relative group">
                  <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 right-8 text-white">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">{campaign.title}</h2>
                    {campaign.description && <p className="text-lg text-white/80 max-w-2xl font-medium mb-4">{campaign.description}</p>}
                    <div className="flex items-center gap-2 text-sm font-bold bg-white/20 backdrop-blur-md w-fit px-4 py-2 rounded-full">
                      <Calendar className="w-4 h-4" /> Bitiş: {campaign.endDate.toLocaleDateString("tr-TR")}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-12 border-b border-gray-100 pb-8 flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                      <Megaphone className="w-8 h-8 text-[#E31E24]" /> {campaign.title}
                    </h2>
                    {campaign.description && <p className="text-base text-gray-500 mt-3 font-medium max-w-2xl">{campaign.description}</p>}
                  </div>
                  <div className="hidden md:flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Son Gün</span>
                    <span className="text-sm font-bold text-[#E31E24] bg-red-50 px-3 py-1 rounded-full">{campaign.endDate.toLocaleDateString("tr-TR")}</span>
                  </div>
                </div>
              )}

              {campaign.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  <ProductGridClient products={campaign.products.map(formatProductForGrid)} />
                </div>
              ) : (
                <p className="text-sm font-bold text-gray-400">Bu kampanyaya henüz ürün eklenmemiş.</p>
              )}
            </div>
          ))}

          {/* FLASH DISCOUNTS (General) */}
          {(discountedProducts.length > 0 || activeCampaigns.length === 0) && (
            <div className="pt-12 border-t border-dashed border-gray-200">
              <div className="mb-12 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <Zap className="w-6 h-6 text-[#E31E24]" /> Flash İndirimler
                  </h2>
                  <p className="text-sm text-gray-400 mt-2 font-medium">Seçili ürünlerde kısa süreli dev indirimleri kaçırmayın.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-50 text-[#E31E24] rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-widest">{discountedProducts.length} İNDİRİMLİ ÜRÜN</span>
                </div>
              </div>

              {discountedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  <ProductGridClient products={discountedProducts.map(formatProductForGrid)} />
                </div>
              ) : (
                <div className="text-center py-32 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                  <Percent className="w-16 h-16 text-gray-200 mx-auto mb-8" />
                  <h2 className="text-2xl font-black tracking-tight mb-3">Şu An Aktif Fırsat Yok</h2>
                  <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto">Yakında başlayacak yeni fırsatlar için beklemede kalın.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </>
  );
}
