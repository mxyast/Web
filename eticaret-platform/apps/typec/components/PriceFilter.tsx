"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [min, setMin] = useState(searchParams.get("min") || "");
  const [max, setMax] = useState(searchParams.get("max") || "");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (min) params.set("min", min);
    else params.delete("min");
    
    if (max) params.set("max", max);
    else params.delete("max");

    router.push(`/products?${params.toString()}`);
  };

  return (
    <form onSubmit={handleApply}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input 
          type="number" 
          placeholder="Min" 
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-black/5 outline-none transition-all w-full" 
        />
        <input 
          type="number" 
          placeholder="Max" 
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-black/5 outline-none transition-all w-full" 
        />
      </div>
      <button 
        type="submit" 
        className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/5"
      >
        Uygula
      </button>
    </form>
  );
}
