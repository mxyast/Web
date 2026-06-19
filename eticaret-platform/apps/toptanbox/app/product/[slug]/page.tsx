import { notFound } from "next/navigation";
import { prisma } from "@eticaret/database";
import { Navbar } from "@repo/ui/navbar";
import { Footer } from "@repo/ui/footer";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { FileDown, Package, Box, Truck, CheckCircle2 } from "lucide-react";

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

  if (!product || !product.isB2B) {
    notFound();
  }

  const defaultVariant = product.variants[0];
  const price = defaultVariant?.price;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar platform="TOPTANBOX" />

      <main className="flex-1 py-12 bg-[var(--color-toptan-bg)]">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-8">
            <Link href="/" className="hover:text-black">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-black">{product.category.name}</Link>
            <span>/</span>
            <span className="text-black font-bold">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Image & Specs (Col 7) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-3xl p-12 border border-[var(--color-toptan-border)] flex items-center justify-center min-h-[500px]">
                <img
                  src={defaultVariant?.images?.[0] || "https://placehold.co/800x800/FFFFFF/111827?text=B2B+Product"}
                  alt={product.name}
                  className="max-h-[400px] object-contain"
                />
              </div>

              <div className="bg-white rounded-3xl p-8 border border-[var(--color-toptan-border)]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[var(--color-toptan-orange)]" />
                  Teknik Özellikler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {defaultVariant?.attributes.map((attr) => (
                    <div key={attr.id} className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-500">{attr.key}</span>
                      <span className="text-sm font-bold text-slate-900">{attr.value} {attr.unit || ""}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Koli İçi Adet</span>
                    <span className="text-sm font-bold text-slate-900">50 Adet</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Pricing & Order (Col 5) */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <div className="bg-white rounded-3xl p-8 border border-[var(--color-toptan-border)] shadow-sm">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider">SKU: {defaultVariant?.sku}</span>
                    <div className="flex items-center gap-1.5 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-tight">Stokta 2.500+ Adet</span>
                    </div>
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 mb-2 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">{product.brand.name} | {product.category.name}</p>
                </div>

                {/* Tiered Pricing Table */}
                <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      <tr>
                        <th className="px-4 py-3 text-left">Miktar (Adet)</th>
                        <th className="px-4 py-3 text-right">Birim Fiyat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="bg-orange-50/30">
                        <td className="px-4 py-4 font-medium text-slate-700">1 - 49 Adet</td>
                        <td className="px-4 py-4 text-right font-black text-slate-900">
                          {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price?.listA ? Number(price.listA) : 0)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 font-medium text-slate-700">50 - 99 Adet</td>
                        <td className="px-4 py-4 text-right font-black text-slate-900">
                          {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price?.listB ? Number(price.listB) : 0)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 font-medium text-slate-700">100+ Adet</td>
                        <td className="px-4 py-4 text-right font-black text-slate-900">
                          {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price?.listC ? Number(price.listC) : 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="p-3 bg-slate-900 text-white text-[10px] font-bold text-center uppercase tracking-widest">
                    Fiyatlara KDV Dahil Değildir
                  </div>
                </div>

                {/* Order Section */}
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <Input
                        type="number"
                        label="Sipariş Adedi"
                        placeholder="Örn: 50"
                        defaultValue={price?.minB2BOrderQty || 1}
                        min={price?.minB2BOrderQty || 1}
                      />
                    </div>
                    <Button className="h-[52px] px-8 bg-[var(--color-toptan-orange)] hover:bg-[var(--color-toptan-orange-hover)] rounded-2xl flex items-center gap-2">
                      <Box className="w-5 h-5" />
                      Sepete Ekle
                    </Button>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium text-center">
                    Minimum sipariş adedi: {price?.minB2BOrderQty || 1} adettir.
                  </p>
                </div>
              </div>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-white border border-gray-200 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 transition-all group">
                  <FileDown className="w-6 h-6 text-slate-400 group-hover:text-[var(--color-toptan-orange)]" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Teknik Föy (PDF)</span>
                </button>
                <button className="bg-white border border-gray-200 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 transition-all group">
                  <Truck className="w-6 h-6 text-slate-400 group-hover:text-[var(--color-toptan-orange)]" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Kargo Hesapla</span>
                </button>
              </div>

              {/* B2B Info Box */}
              <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
                <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-toptan-orange)]" />
                  Bayi Avantajı
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Bu ürün için geçerli olan liste fiyatınız <span className="text-white font-bold">Liste B</span> olarak tanımlanmıştır. Daha yüksek alımlarınız için bölge sorumlunuzla iletişime geçebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer platform="TOPTANBOX" />
    </div>
  );
}

// Reuse some lucide icons not imported in first line
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
