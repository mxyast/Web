"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Zap } from "lucide-react";

interface ProductCardProps {
  platform: "TYPEC" | "TOPTANBOX";
  product: {
    id: string;
    name: string;
    slug: string;
    brand: { name: string };
    price: { 
      retailPrice?: number;
      wholesalePrice?: number;
      minOrder?: number;
    };
    discount?: number;
    image?: string;
  };
}

export const ProductCard = ({ platform, product }: ProductCardProps) => {
  const isTypeC = platform === "TYPEC";
  const price = isTypeC ? product.price.retailPrice : product.price.wholesalePrice;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[4/5] rounded-mioji overflow-hidden mb-6 bg-[#F8F8F8] border border-gray-50 transition-all duration-500 group-hover:shadow-mioji-hover group-hover:border-white">
        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          {product.discount ? (
            <div className="bg-[#E31E24] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl shadow-red-500/40 border border-white/10">
              %{product.discount} İNDİRİM
            </div>
          ) : <div />}
          <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-black/5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-black text-[#1A1A1A]">4.9</span>
          </div>
        </div>

        {/* Favorite Button */}
        <button className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#E31E24] hover:text-white shadow-lg translate-y-2 group-hover:translate-y-0">
          <Heart className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Image */}
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img 
            src={product.image || "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=1000&auto=format&fit=crop"} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#E31E24] uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-heading)' }}>
            {product.brand.name}
          </span>
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-bold text-[#1A1A1A] tracking-tight hover:text-[#E31E24] transition-colors line-clamp-2 uppercase leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            {product.discount && (
              <span className="text-[10px] text-gray-400 line-through font-bold">
                {(price! * 1.2).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
              </span>
            )}
            <span className="text-lg font-black text-[#1A1A1A] tracking-tight">
              {price?.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
            </span>
          </div>
          
          {!isTypeC && product.price.minOrder && (
             <div className="text-right">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Min. Adet</p>
                <p className="text-[11px] font-black text-[#1A1A1A]">{product.price.minOrder}</p>
             </div>
          )}
        </div>

        <button className="w-full py-3 bg-[#1A1A1A] text-white text-[11px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-[#E31E24] hover:shadow-lg hover:shadow-red-500/20 active:scale-95 mt-2">
          SEPETE EKLE
        </button>
      </div>
    </motion.div>
  );
};
