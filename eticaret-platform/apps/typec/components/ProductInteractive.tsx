"use client";

import React, { useState, useEffect, useRef } from "react";
import { Zap, ShieldCheck, Heart, Timer } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

interface Variant {
  id: string;
  sku: string;
  price?: { retailPrice: number | string | any };
  images: string[];
  attributes: { key: string; value: string }[];
  color?: string | null;
}

interface ProductInteractiveProps {
  productId: string;
  productName: string;
  variants: Variant[];
  brandName: string;
}

const colorMap: Record<string, string> = {
  siyah: "#1A1A1A",
  black: "#1A1A1A",
  beyaz: "#FFFFFF",
  white: "#FFFFFF",
  gumus: "#E5E7EB",
  gümüş: "#E5E7EB",
  silver: "#E5E7EB",
  gri: "#9CA3AF",
  grey: "#9CA3AF",
  gray: "#9CA3AF",
  mavi: "#2563EB",
  blue: "#2563EB",
  kirmizi: "#EF4444",
  kırmızı: "#EF4444",
  red: "#EF4444",
  yesil: "#10B981",
  yeşil: "#10B981",
  green: "#10B981",
  sari: "#F59E0B",
  sarı: "#F59E0B",
  yellow: "#F59E0B",
  turuncu: "#F97316",
  orange: "#F97316",
  pembe: "#EC4899",
  pink: "#EC4899",
  mor: "#8B5CF6",
  purple: "#8B5CF6",
  titanyum: "#78716C",
  titanium: "#78716C",
  gold: "#D4AF37",
  altin: "#D4AF37",
  altın: "#D4AF37",
};

const getColorHex = (name?: string | null) => {
  if (!name) return "#D1D5DB";
  
  // Extract hex code if inside the string
  const hexMatch = name.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/);
  if (hexMatch) {
    return hexMatch[0];
  }
  
  const normalized = name.toLowerCase().trim();
  if (colorMap[normalized]) return colorMap[normalized];
  
  for (const [key, value] of Object.entries(colorMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  return "#D1D5DB";
};

const cleanColorName = (name?: string | null) => {
  return name ? name.replace(/\s*\(#.*\)/g, "") : "Standart";
};

export function ProductInteractive({ productId, productName, variants, brandName }: ProductInteractiveProps) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [timeLeft, setTimeLeft] = useState("");
  const [isTodayShipping, setIsTodayShipping] = useState(true);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(selectedVariant?.id ?? "");

  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "";
  const displayImages = (selectedVariant?.images?.length ?? 0) > 0 
    ? selectedVariant!.images.map((img: string) => img.startsWith('/api/uploads/') || img.startsWith('/uploads/') ? `${adminUrl}${img.startsWith('/uploads/') ? img.replace('/uploads/', '/api/uploads/') : img}` : img)
    : ["https://images.unsplash.com/photo-1546868831-71cd00a21960?q=80&w=1964&auto=format&fit=crop"];

  // Countdown timer logic
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(16, 0, 0, 0); // Shipping deadline is 16:00

      const todayShipping = now.getHours() < 16;
      setIsTodayShipping(todayShipping);

      let diff = target.getTime() - now.getTime();
      if (diff < 0) {
        // Deadline passed, target is next day 16:00
        target.setDate(target.getDate() + 1);
        diff = target.getTime() - now.getTime();
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours} saat ${minutes} dk ${seconds} sn`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll listener for mobile sticky buy bar
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Show sticky bar once the main add to cart container scrolls out of view
        setShowStickyBar(rect.bottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addItem({
      id: `${productId}-${selectedVariant.id}`,
      productId: productId,
      variantId: selectedVariant.id,
      name: productName,
      price: selectedVariant.price?.retailPrice ? Number(selectedVariant.price.retailPrice) : 0,
      quantity: 1,
      image: displayImages[0] ?? "",
      variantName: cleanColorName(selectedVariant.color),
    });
    
    alert("Ürün sepete eklendi!");
  };

  return (
    <div ref={containerRef}>
      {/* Shipping Countdown Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-orange-50/60 border border-orange-100/50 flex items-center gap-3 text-orange-800">
        <Timer className="w-5 h-5 text-orange-600 animate-pulse flex-shrink-0" />
        <div className="text-xs font-bold leading-normal">
          {isTodayShipping ? "Aynı Gün Kargo Fırsatı!" : "Hızlı Kargo Fırsatı!"} <span className="text-orange-950 font-black">{timeLeft}</span> içinde sipariş verirseniz <span className="underline decoration-2 font-black">{isTodayShipping ? "bugün" : "yarın"}</span> kargoda.
        </div>
      </div>

      <div className="space-y-12 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-5">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Renk Seçeneği:</h4>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
              {cleanColorName(selectedVariant?.color)}
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            {variants.map((v) => (
              <button 
                key={v.id} 
                onClick={() => setSelectedVariant(v)}
                aria-label={`Renk seçeneği ${cleanColorName(v.color)}`}
                className={`w-12 h-12 rounded-[1.2rem] border-2 transition-all p-1 flex items-center justify-center ${selectedVariant?.id === v.id ? "border-black" : "border-transparent hover:border-gray-200"}`}
              >
                <div 
                  className="w-full h-full rounded-[0.9rem] shadow-inner border border-gray-100" 
                  style={{ backgroundColor: getColorHex(v.color) }} 
                  title={cleanColorName(v.color)}
                />
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

      <div className="flex gap-4 p-2 bg-gray-50 rounded-[2.5rem] border border-gray-100 mb-8">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-black text-white h-16 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10 animate-fade-in"
        >
          Sepete Ekle
        </button>
        <button
          onClick={() => {
            if (!selectedVariant) return;
            toggleItem({
              id: selectedVariant.id,
              productId,
              variantId: selectedVariant.id,
              name: productName,
              slug: productName.toLowerCase().replace(/\s+/g, "-"),
              price: selectedVariant.price?.retailPrice ? Number(selectedVariant.price.retailPrice) : 0,
              image: displayImages[0] ?? "",
              brand: brandName,
              variantName: cleanColorName(selectedVariant.color),
            });
          }}
          className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all ${
            isWishlisted
              ? "bg-[#E31E24] text-white shadow-lg shadow-red-500/20"
              : "bg-white border border-gray-200 text-gray-400 hover:border-[#E31E24] hover:text-[#E31E24]"
          }`}
          aria-label={isWishlisted ? "Favorilerden çıkar" : "Favorilere ekle"}
        >
          <Heart className={`w-6 h-6 transition-transform ${isWishlisted ? "fill-current scale-110" : ""}`} />
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 text-center py-6 border-t border-gray-100 mb-8">
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-1.5 filter drop-shadow">🛡️</span>
          <p className="text-[9px] font-black text-black uppercase tracking-wider mb-0.5">%100 Orijinal</p>
          <p className="text-[8px] text-gray-400 font-bold leading-tight">Distribütör Garantili</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-1.5 filter drop-shadow">💳</span>
          <p className="text-[9px] font-black text-black uppercase tracking-wider mb-0.5">Güvenli Ödeme</p>
          <p className="text-[8px] text-gray-400 font-bold leading-tight">256-Bit SSL Güvenliği</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-1.5 filter drop-shadow">📄</span>
          <p className="text-[9px] font-black text-black uppercase tracking-wider mb-0.5">Faturalı Satış</p>
          <p className="text-[8px] text-gray-400 font-bold leading-tight">Adınıza Faturalı</p>
        </div>
      </div>

      {/* Mobile Sticky Add-to-Cart Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4 transition-all duration-500 shadow-[0_-12px_40px_rgba(0,0,0,0.06)] md:hidden ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <img 
              src={displayImages[0]} 
              alt={productName} 
              className="w-12 h-12 object-cover rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <h4 className="text-[11px] font-black text-black truncate tracking-tight uppercase mb-0.5">{productName}</h4>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{cleanColorName(selectedVariant?.color)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <span className="text-sm font-black text-black leading-none block mb-0.5">
                {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
                  selectedVariant?.price?.retailPrice ? Number(selectedVariant?.price?.retailPrice) : 0
                )}
              </span>
              <span className="text-[8px] text-green-600 font-black uppercase tracking-widest block leading-none">Stokta</span>
            </div>
            <button 
              onClick={handleAddToCart}
              className="bg-black text-white px-6 py-3.5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-md shadow-black/5"
            >
              Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
