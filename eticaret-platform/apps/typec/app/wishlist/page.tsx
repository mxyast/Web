"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight, Package } from "lucide-react";
import { useWishlistStore } from "../../store/wishlistStore";
import { useCartStore } from "../../store/cartStore";

export default function WishlistPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleMoveToCart = (item: typeof items[number]) => {
    addToCart({
      id: `${item.productId}-${item.variantId}`,
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image ?? "",
      variantName: item.variantName ?? "Standart",
    });
    removeItem(item.variantId);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);

  return (
    <main className="flex-1 py-12 md:py-20 pt-32">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-[#1A1A1A]">
              Favorilerim
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-2">
              {items.length > 0
                ? `${items.length} ürün kayıtlı`
                : "Henüz favoriye eklenmemiş ürün yok"}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Tümünü Temizle
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const hasDiscount = item.comparePrice && item.comparePrice > item.price;
              const discount = hasDiscount
                ? Math.round(100 - (item.price / item.comparePrice!) * 100)
                : 0;

              return (
                <div
                  key={item.variantId}
                  className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-100 hover:border-gray-200 transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-[#F9F9F9] overflow-hidden">
                    <Link href={`/product/${item.slug}`}>
                      <img
                        src={
                          item.image?.startsWith("/uploads/")
                            ? `http://localhost:3000${item.image}`
                            : item.image ||
                              "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=600"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>

                    {/* Discount badge */}
                    {hasDiscount && (
                      <div className="absolute top-4 left-4 bg-[#E31E24] text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                        %{discount} İNDİRİM
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#E31E24] hover:text-white shadow-sm"
                      aria-label="Favorilerden Çıkar"
                    >
                      <Heart className="w-4 h-4 fill-current text-[#E31E24] hover:text-white transition-colors" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                      {item.brand}
                    </p>
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="font-black text-sm leading-tight text-[#1A1A1A] mb-3 hover:text-[#E31E24] transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-black text-lg">{formatPrice(item.price)}</span>
                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through font-medium">
                          {formatPrice(item.comparePrice!)}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#1A1A1A] text-white text-[11px] font-black uppercase tracking-widest py-3 rounded-2xl hover:bg-[#E31E24] transition-all"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Sepete Ekle
                      </button>
                      <Link
                        href={`/product/${item.slug}`}
                        aria-label="Ürün Detayına Git"
                        className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-12 h-12 text-gray-200" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#1A1A1A] mb-3">
              Favorileriniz Boş
            </h2>
            <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto mb-10">
              Beğendiğiniz ürünleri favorilere ekleyin, daha sonra kolayca bulun.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#E31E24] transition-all"
            >
              <Package className="w-4 h-4" />
              Ürünleri Keşfet
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
