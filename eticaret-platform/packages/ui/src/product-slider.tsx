"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./product-card";

// These are dynamically imported to avoid coupling the UI package to app stores.
// The slider accepts optional action callbacks via props.
interface ProductSliderProps {
  products: any[];
  platform: "TYPEC" | "TOPTANBOX";
  onAddToCart?: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  wishlistedIds?: string[];
}

export const ProductSlider = ({ products, platform, onAddToCart, onToggleWishlist, wishlistedIds = [] }: ProductSliderProps) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const node = scrollRef.current;
    if (node) {
      node.addEventListener("scroll", checkScroll);
      checkScroll();
      window.addEventListener("resize", checkScroll);
      return () => {
        node.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [products]);

  // Auto-scroll effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isHovered) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          // If we reached the end (with a small buffer for precision), scroll back to start
          if (scrollLeft >= scrollWidth - clientWidth - 10) {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            scroll("right");
          }
        }
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation Buttons */}
      <div className="absolute -top-24 right-0 flex items-center gap-2">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center transition-all duration-300 ${
            canScrollLeft 
              ? "bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white shadow-sm" 
              : "bg-gray-50 text-gray-300 cursor-not-allowed"
          }`}
          aria-label="Önceki"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center transition-all duration-300 ${
            canScrollRight 
              ? "bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white shadow-sm" 
              : "bg-gray-50 text-gray-300 cursor-not-allowed"
          }`}
          aria-label="Sonraki"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 pt-4 -mx-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product, i) => (
          <div 
            key={product.id} 
            className="flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/5 px-4 snap-start"
          >
          <ProductCard
              platform={platform}
              product={product}
              isWishlisted={wishlistedIds.includes(product.variantId ?? product.id)}
              onAddToCart={onAddToCart ? () => onAddToCart(product) : undefined}
              onToggleWishlist={onToggleWishlist ? () => onToggleWishlist(product) : undefined}
            />
          </div>
        ))}
      </div>
      
      {/* Progress Bar (Subtle) */}
      <div className="mt-8 h-[2px] w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-[#1A1A1A]"
          initial={{ width: "20%" }}
          animate={{ 
            width: `${Math.min(100, (1 / (products.length / 5)) * 100)}%` 
          }}
        />
      </div>
    </div>
  );
};
