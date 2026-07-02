import { prisma } from "@eticaret/database";
import { Package, Search, Monitor, Box, ShieldCheck, AlertCircle, Tag, Plus } from "lucide-react";
import { Header } from "../../components/Header";
import Link from "next/link";
import { ToastContainer } from "../../components/Toast";

type Tab = "all" | "b2c" | "b2b" | "pricing";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; tab?: Tab }>;
}) {
  const { success, tab = "all" } = await searchParams;

  const whereClause =
    tab === "b2c" ? { isB2C: true } :
    tab === "b2b" ? { isB2B: true } :
    {};

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      brand: true,
      category: true,
      variants: {
        include: {
          inventory: true,
          price: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const tabs = [
    { id: "all", label: "Tümü", icon: Package },
    { id: "b2c", label: "B2C Perakende", icon: Monitor },
    { id: "b2b", label: "B2B Toptan", icon: Box },
    { id: "pricing", label: "Fiyat Listeleri", icon: Tag },
  ];

  return (
    <>
      <Header title="Ürün Yönetimi" />

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Sub Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <Link
                  key={t.id}
                  href={`/products?tab=${t.id}`}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </Link>
              );
            })}
          </div>
          <Link
            href="/products/new"
            className="bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Yeni Ürün
          </Link>
        </div>

        {/* PRICING TAB */}
        {tab === "pricing" && (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <h2 className="text-base font-black text-slate-800">Fiyat Listeleri</h2>
              <p className="text-xs text-gray-400 font-medium mt-1">Tüm ürünlerin perakende ve toptan fiyatları</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Ürün / SKU</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Perakende (B2C)</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Liste A</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Liste B</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Liste C</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Liste D</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">KDV</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => {
                    const variant = product.variants[0];
                    const price = variant?.price;
                    const fmt = (v: any) =>
                      v != null
                        ? new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(v))
                        : "—";
                    return (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                              {variant?.images?.[0] ? (
                                <img src={variant.images[0].startsWith('/api/uploads/') || variant.images[0].startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ADMIN_URL || ''}${variant.images[0].startsWith('/uploads/') ? variant.images[0].replace('/uploads/', '/api/uploads/') : variant.images[0]}` : variant.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900 leading-tight">{product.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{variant?.sku || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right font-black text-sm text-blue-700">{fmt(price?.retailPrice)}</td>
                        <td className="px-6 py-5 text-right font-bold text-sm text-slate-700">{fmt(price?.listA)}</td>
                        <td className="px-6 py-5 text-right font-bold text-sm text-slate-700">{fmt(price?.listB)}</td>
                        <td className="px-6 py-5 text-right font-bold text-sm text-slate-700">{fmt(price?.listC)}</td>
                        <td className="px-6 py-5 text-right font-bold text-sm text-slate-700">{fmt(price?.listD)}</td>
                        <td className="px-6 py-5 text-right">
                          <span className="text-xs font-black text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">%{Number(price?.taxRate ?? 20)}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Link href={`/products/${product.id}/edit`} className="text-xs font-bold text-blue-600 hover:underline">Düzenle</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCT LIST TABS (all / b2c / b2b) */}
        {tab !== "pricing" && (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ürün veya SKU ara..."
                  className="bg-gray-100 rounded-full py-2 px-10 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <span>{products.length} ürün listeleniyor</span>
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Ürün / Marka</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Kanal</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">B2C Rezerv</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Stok</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-sm text-gray-400 font-bold">
                      Bu kanalda henüz ürün bulunmuyor.
                    </td>
                  </tr>
                )}
                {products.map((product) => {
                  const firstVariant = product.variants[0];
                  const inventory = firstVariant?.inventory;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                            {firstVariant?.images && firstVariant.images.length > 0 ? (
                              <img src={firstVariant.images[0]?.startsWith('/api/uploads/') || firstVariant.images[0]?.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ADMIN_URL || ''}${firstVariant.images[0].startsWith('/uploads/') ? firstVariant.images[0].replace('/uploads/', '/api/uploads/') : firstVariant.images[0]}` : firstVariant.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm leading-tight mb-1">{product.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase text-gray-400">{product.brand.name}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <span className="text-[10px] font-bold uppercase text-gray-400">{product.category.name}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${product.isB2C ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-gray-50 text-gray-300 border border-gray-100"}`}>
                            <Monitor className="w-3 h-3" /> B2C
                          </div>
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${product.isB2B ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-gray-50 text-gray-300 border border-gray-100"}`}>
                            <Box className="w-3 h-3" /> B2B
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex items-center gap-2">
                          <span className="text-sm font-black text-slate-700">%{inventory?.b2cReserveRatio || 0}</span>
                          <ShieldCheck className="w-4 h-4 text-gray-300" />
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-black text-slate-900">{inventory?.totalStock || 0}</span>
                          {(inventory?.totalStock || 0) < 50 && (
                            <span className="text-[9px] font-bold text-red-500 uppercase flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Kritik
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link href={`/products/${product.id}/edit`} className="text-xs font-bold text-blue-600 hover:underline">Düzenle</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <ToastContainer successParam={success} />
    </>
  );
}
