import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@eticaret/database";
import { Zap, ShieldCheck, Truck, RotateCcw, Star, ChevronRight, Share2, Heart } from "lucide-react";
import Link from "next/link";
import { ProductGallery } from "../../../components/ProductGallery";
import { ProductInteractive } from "../../../components/ProductInteractive";
import { ProductTabs } from "../../../components/ProductTabs";

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      variants: {
        include: { price: true },
        take: 1
      }
    }
  });

  if (!product || !product.isB2C) {
    return {
      title: "Ürün Bulunamadı"
    };
  }

  const defaultVariant = product.variants[0];
  const imageUrl = defaultVariant?.images?.[0] || "https://typec.com.tr/placeholder.png";

  return {
    title: `${product.name} - ${product.brand.name}`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.substring(0, 160),
      images: [imageUrl],
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      reviews: {
        where: { isApproved: true },
        include: { user: true },
        orderBy: { createdAt: "desc" }
      },
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
  const inStock = defaultVariant?.inventory?.totalStock && defaultVariant.inventory.totalStock > 0;

  const totalReviews = product.reviews.length;
  const averageRating = totalReviews > 0 
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews 
    : 5;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: defaultVariant?.images?.[0] || "",
    sku: defaultVariant?.sku || "",
    brand: {
      "@type": "Brand",
      name: product.brand.name,
    },
    offers: {
      "@type": "Offer",
      url: `https://typec.com.tr/product/${product.slug}`,
      priceCurrency: "TRY",
      price: price,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: totalReviews > 0 ? {
      "@type": "AggregateRating",
      ratingValue: averageRating.toFixed(1),
      reviewCount: totalReviews
    } : undefined
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32 items-start">
              {/* Gallery Section */}
              <ProductGallery 
                images={defaultVariant?.images || []} 
                productName={product.name} 
              />

              {/* Info Section */}
              <div className="flex flex-col lg:sticky lg:top-28">
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-black">{product.brand.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(averageRating) ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200"}`} />
                      ))}
                      <span className="ml-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">({totalReviews} Yorum)</span>
                    </div>
                  </div>

                  <h1 className="text-xl md:text-2xl font-black tracking-tight leading-tight mb-6 text-black">
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

                {/* Variant & Features & Add to Cart */}
                <ProductInteractive 
                  productId={product.id}
                  productName={product.name}
                  brandName={product.brand.name}
                  variants={product.variants.map((v: any) => ({
                    ...v,
                    price: v.price ? {
                      ...v.price,
                      retailPrice: Number(v.price.retailPrice || 0),
                      comparePrice: v.price.comparePrice ? Number(v.price.comparePrice) : null,
                    } : null,
                    weight: v.weight ? Number(v.weight) : null,
                  })) as any}
                />

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
              <ProductTabs 
                attributes={defaultVariant?.attributes as any || []} 
                description={product.description}
                reviews={product.reviews as any}
              />
            </div>
          </div>
        </section>
      </main>

    </>
  );
}
