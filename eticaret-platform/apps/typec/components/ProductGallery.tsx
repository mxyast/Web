"use client";

import React from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "";
  const displayImages = images.length > 0
    ? images.map(img => img.startsWith('/api/uploads/') || img.startsWith('/uploads/') ? `${adminUrl}${img.startsWith('/uploads/') ? img.replace('/uploads/', '/api/uploads/') : img}` : img)
    : [
      "https://images.unsplash.com/photo-1546868831-71cd00a21960?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1964&auto=format&fit=crop"
    ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {displayImages.map((img, i) => (
        <div
          key={i}
          className={`rounded-[2rem] bg-[#F9F9F9] overflow-hidden aspect-square border border-gray-100 group relative ${displayImages.length === 1 ? "col-span-2" : ""}`}
        >
          <img
            src={img}
            alt={`${productName} - ${i + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      ))}
    </div>
  );
};
