"use client";

import React from "react";
import { ProductSlider } from "@repo/ui/product-slider";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore, WishlistItem } from "../store/wishlistStore";

interface SliderProduct {
  id: string;
  name: string;
  slug: string;
  brand: { name: string };
  price: { retailPrice?: number; comparePrice?: number };
  image?: string;
  variantId?: string;
}

interface ProductSliderClientProps {
  products: SliderProduct[];
}

export function ProductSliderClient({ products }: ProductSliderClientProps) {
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const wishlistedIds = products
    .map((p) => p.variantId ?? p.id)
    .filter((id) => isInWishlist(id));

  const handleAddToCart = (product: SliderProduct) => {
    const variantId = product.variantId ?? product.id;
    addToCart({
      id: `${product.id}-${variantId}`,
      productId: product.id,
      variantId,
      name: product.name,
      price: product.price.retailPrice ?? 0,
      quantity: 1,
      image: product.image ?? "",
      variantName: "Standart",
    });
  };

  const handleToggleWishlist = (product: SliderProduct) => {
    const variantId = product.variantId ?? product.id;
    const item: WishlistItem = {
      id: variantId,
      productId: product.id,
      variantId,
      name: product.name,
      slug: product.slug,
      price: product.price.retailPrice ?? 0,
      comparePrice: product.price.comparePrice,
      image: product.image,
      brand: product.brand.name,
    };
    toggleItem(item);
  };

  return (
    <ProductSlider
      platform="TYPEC"
      products={products}
      wishlistedIds={wishlistedIds}
      onAddToCart={handleAddToCart}
      onToggleWishlist={handleToggleWishlist}
    />
  );
}
