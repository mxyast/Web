"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  platform: "B2C" | "B2B";
}

interface Suggestion {
  id: string;
  name: string;
  slug: string;
}

export const SearchBar = ({ platform }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const res = await fetch(`/api/search/suggestions?q=${query}&p=${platform}`);
          const data = await res.json();
          setSuggestions(data.suggestions || []);
          setIsOpen(true);
        } catch (e) {
          console.error("Suggestion error:", e);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, platform]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={platform === "B2C" ? "Arama yap..." : "SKU ara..."}
          className="w-full bg-transparent border-b border-gray-200 py-2.5 pl-8 pr-10 text-[11px] font-black uppercase tracking-widest focus:border-black focus:outline-none transition-all outline-none placeholder:text-gray-300"
        />
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <X className="w-3 h-3 text-black" />
            </motion.button>
          )}
        </AnimatePresence>
      </form>

      {/* Autocomplete Dropdown - Ultra Clean */}
      <AnimatePresence>
        {isOpen && (suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2rem] border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden z-[60] py-6"
          >
            <div className="px-8 mb-6">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300">Öneriler</span>
            </div>
            <div className="px-4">
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-typec-light transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform shadow-sm border border-gray-50">
                      <Package className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-black uppercase tracking-tight">{item.name}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-typec-red group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
            <Link
              href={`/products?q=${query}`}
              className="flex items-center justify-center gap-3 mt-6 p-6 text-[10px] font-black uppercase tracking-[0.2em] text-black hover:text-typec-red transition-all border-t border-gray-50 bg-gray-50/30"
            >
              TÜMÜNÜ GÖR <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
