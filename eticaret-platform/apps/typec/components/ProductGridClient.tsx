"use client";

import React from "react";
import { ProductCard } from "@repo/ui/product-card";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore, WishlistItem } from "../store/wishlistStore";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  brand: { name: string };
  price: {
    retailPrice?: number;
    comparePrice?: number;
  };
  discount?: number;
  image?: string;
  variantId?: string;
}

interface ProductGridClientProps {
  products: ProductItem[];
  platform?: "TYPEC" | "TOPTANBOX";
}

export function ProductGridClient({ products, platform = "TYPEC" }: ProductGridClientProps) {
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
      {products.map((product) => {
        const variantId = product.variantId ?? product.id;

        const handleAddToCart = () => {
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

        const handleToggleWishlist = () => {
          const wishlistItem: WishlistItem = {
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
          toggleItem(wishlistItem);
        };

        return (
          <ProductCard
            key={product.id}
            platform={platform}
            product={product}
            isWishlisted={isInWishlist(variantId)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
          />
        );
      })}
    </div>
  );
}
