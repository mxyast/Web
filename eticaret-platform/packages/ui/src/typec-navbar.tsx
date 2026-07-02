"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  Search,
  ChevronRight,
  ArrowRight,
  Heart,
  Zap,
  ChevronDown,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface TypeCNavbarProps {
  user?: {
    name: string;
    role: string;
  } | null;
  cartCount?: number;
  wishlistCount?: number;
  categories?: { id: string; name: string; slug: string; }[];
}

type NavLink = {
  name: string;
  href?: string;
  isDropdown?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { name: "Yeni Gelenler", href: "/products?sort=new" },
  { name: "Çok Satanlar", href: "/products?sort=popular" },
  { name: "Kategoriler", isDropdown: true },
  { name: "Koleksiyonlar", href: "/categories" },
  { name: "Kampanyalar", href: "/deals" },
];

const ANNOUNCEMENTS = [
  "🚀  1500 TL ÜZERİ ALIŞVERİŞLERDE ÜCRETSİZ KARGO",
  "✨  İLK ALIŞVERİŞE ÖZEL %10 İNDİRİM: typec10",
  "⚡  AYNI GÜN HIZLI TESLİMAT SEÇENEĞİ",
];

const POPULAR_SEARCHES = ["Powerbank", "65W GaN Adaptör", "USB-C Kablo", "Baseus GaN5"];

export const TypeCNavbar = ({ user, cartCount = 0, wishlistCount = 0, categories = [] }: TypeCNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ id: string; name: string; slug: string; brand: { name: string } | null; variants: { images: string[] }[] }[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const suggestionDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const interval = setInterval(
      () => setAnnouncementIndex((p) => (p + 1) % ANNOUNCEMENTS.length),
      4000
    );
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
      setSuggestions([]);
    }
  }, [isSearchOpen]);

  // Debounced instant search suggestions
  useEffect(() => {
    if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current);
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    suggestionDebounceRef.current = setTimeout(async () => {
      setIsSuggestionsLoading(true);
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&p=B2C`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSuggestionsLoading(false);
      }
    }, 280);
    return () => {
      if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current);
    };
  }, [searchQuery]);

  // Close search and dropdowns on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMenuOpen(false);
    setIsCategoriesOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-[box-shadow] duration-500 ${isScrolled ? "shadow-sm shadow-black/20" : ""}`}
      >

        {/* Announcement Bar — Full Width */}
        <div className="bg-[#1A1A1A] text-white h-9 w-full relative">
          <div className="w-full h-full px-6 md:px-10 flex items-center justify-between">
            {/* Sol hızlı linkler */}
            <div className="flex md:flex items-center gap-5 relative z-10">
              <Link href="/deals" className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-white/50 hover:text-[#E31E24] transition-colors pointer-events-auto">
                <Zap className="w-3 h-3" /> Kampanyalar
              </Link>
              <Link href="/products?sort=new" className="text-[10px] font-bold tracking-widest uppercase text-white/50 hover:text-white transition-colors pointer-events-auto">Yeni Gelenler</Link>
            </div>

            {/* Orta duyuru */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={announcementIndex}
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -25, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap"
                >
                  {ANNOUNCEMENTS[announcementIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sağ linkler */}
            <div className="flex md:flex items-center gap-5 relative z-10">
              <Link href="/orders" className="text-[10px] font-bold tracking-widest uppercase text-white/50 hover:text-white transition-colors pointer-events-auto">Sipariş Takip</Link>
              <Link href="/contact" className="text-[10px] font-bold tracking-widest uppercase text-white/50 hover:text-white transition-colors pointer-events-auto">İletişim</Link>
            </div>
          </div>
        </div>

        {/* Main Bar — Full Width */}
        <div
          className={`w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 transition-[height] duration-300 ${isScrolled ? "h-14" : "h-[68px]"
            }`}
        >
          <div className="w-full px-6 md:px-10 h-full flex items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
              <span
                className="text-xl font-black tracking-tighter text-[#E31E24] leading-none group-hover:scale-105 transition-transform"
                style={{ fontFamily: "var(--font-heading, Montserrat, sans-serif)", fontSize: "2rem" }}
              >
                Type-C
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#E31E24] animate-pulse" />
            </Link>

            {/* Center Nav — desktop */}
            <nav className={`hidden lg:flex items-center gap-1 flex-1 justify-center transition-all duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
              {NAV_LINKS.map((link) => {
                if (link.isDropdown) {
                  return (
                    <div key={link.name} className="relative" ref={categoriesRef}>
                      <button
                        onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                        className={`px-4 py-1.5 text-[12px] font-bold rounded-full transition-[background-color,color] duration-200 flex items-center gap-1 ${isCategoriesOpen ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A] hover:bg-gray-100"}`}
                      >
                        {link.name}
                        <ChevronDown className={`w-3 h-3 transition-transform ${isCategoriesOpen ? "rotate-180 text-white/60" : "text-gray-400"}`} />
                      </button>
                      <AnimatePresence>
                        {isCategoriesOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[200] py-2"
                          >
                            {categories && categories.length > 0 ? (
                              categories.map(cat => (
                                <Link
                                  key={cat.id}
                                  href={`/products?cat=${cat.id}`}
                                  onClick={() => setIsCategoriesOpen(false)}
                                  className="block px-6 py-2.5 text-sm font-bold text-[#1A1A1A] hover:bg-gray-50 hover:text-[#E31E24] transition-colors"
                                >
                                  {cat.name}
                                </Link>
                              ))
                            ) : (
                              <div className="px-6 py-4 text-xs font-medium text-gray-400 text-center">
                                Kategori bulunamadı.
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                const active = link.href && (pathname === link.href || pathname.startsWith(link.href.split("?")[0] + "?"));
                return (
                  <Link
                    key={link.name}
                    href={link.href!}
                    className={`px-4 py-1.5 text-[12px] font-bold rounded-full transition-[background-color,color] duration-200 ${active
                      ? "bg-[#1A1A1A] text-white"
                      : "text-[#1A1A1A] hover:bg-gray-100"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center relative">
              {/* Search Toggle & Integrated Bar */}
              <div className="flex items-center relative">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0, x: 0 }}
                      animate={{ width: "auto", opacity: 1, x: 0 }}
                      exit={{ width: 0, opacity: 0, x: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="absolute right-full h-10 flex items-center bg-gray-200 rounded-full mr-2 px-4 z-[110] min-w-[280px] md:min-w-[500px] border border-gray-300"
                      style={{ originX: 1 }}
                    >
                      <form onSubmit={handleSearch} className="flex items-center gap-3 w-full">
                        <Search className="w-[18px] h-[18px] text-gray-400 shrink-0" aria-hidden="true" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          name="q"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Ürün, marka veya kategori ara…"
                          aria-label="Ürün Ara"
                          autoComplete="off"
                          className="flex-1 text-sm font-bold text-[#1A1A1A] placeholder:text-gray-400 bg-transparent outline-none"
                        />
                        {searchQuery && (
                          <button
                            type="submit"
                            aria-label="Ara"
                            className="p-1.5 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#E31E24] transition-colors focus-visible:ring-2 focus-visible:ring-[#E31E24] focus-visible:ring-offset-1"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </form>
                      {/* Instant suggestions dropdown */}
                      {(suggestions.length > 0 || isSuggestionsLoading) && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden z-[200]">
                          {isSuggestionsLoading ? (
                            <div className="flex items-center gap-3 px-4 py-3">
                              <div className="w-4 h-4 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                              <span className="text-xs text-gray-400 font-medium">Aranıyor...</span>
                            </div>
                          ) : (
                            suggestions.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => { router.push(`/product/${s.slug}`); setIsSearchOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left group"
                              >
                                <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                  {s.variants[0]?.images[0] ? (
                                    <img
                                      src={s.variants[0].images[0].startsWith('/api/uploads/') || s.variants[0].images[0].startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ADMIN_URL || ''}${s.variants[0].images[0].startsWith('/uploads/') ? s.variants[0].images[0].replace('/uploads/', '/api/uploads/') : s.variants[0].images[0]}` : s.variants[0].images[0]}
                                      alt={s.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                      <Search className="w-4 h-4 text-gray-300" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-[#1A1A1A] truncate group-hover:text-[#E31E24] transition-colors">{s.name}</p>
                                  {s.brand && <p className="text-[10px] text-gray-400 font-medium">{s.brand.name}</p>}
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#E31E24] group-hover:translate-x-0.5 transition-all shrink-0" />
                              </button>
                            ))
                          )}
                          {/* Quick: go to full results */}
                          {suggestions.length > 0 && (
                            <button
                              onClick={() => { router.push(`/products?q=${encodeURIComponent(searchQuery)}`); setIsSearchOpen(false); }}
                              className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center text-gray-400 hover:text-[#E31E24] border-t border-gray-50 transition-colors"
                            >
                              "{searchQuery}" için tüm sonuçları gör →
                            </button>
                          )}
                        </div>
                      )}
                      {/* Popular searches as chips */}
                      <div className="hidden lg:flex items-center gap-2 ml-4 border-l border-gray-200 pl-4">
                        {POPULAR_SEARCHES.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setSearchQuery(tag);
                              router.push(`/products?q=${encodeURIComponent(tag)}`);
                              setIsSearchOpen(false);
                            }}
                            className="whitespace-nowrap text-[10px] font-bold text-gray-500 hover:text-[#1A1A1A] transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="relative group/tip">
                  <button
                    onClick={() => setIsSearchOpen((p) => !p)}
                    aria-label={isSearchOpen ? "Aramayı Kapat" : "Arama Yap"}
                    className={`p-2.5 rounded-full transition-[background-color,color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-[#1A1A1A] ${isSearchOpen
                      ? "bg-[#1A1A1A] text-white shadow-lg shadow-black/30"
                      : "text-[#1A1A1A] hover:bg-gray-100"
                      }`}
                  >
                    {isSearchOpen ? (
                      <X className="w-[18px] h-[18px] stroke-2" />
                    ) : (
                      <Search className="w-[18px] h-[18px] stroke-2" />
                    )}
                  </button>
                  {!isSearchOpen && (
                    <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-[9px] font-black bg-[#1A1A1A] text-white px-2 py-0.5 rounded opacity-0 group-hover/tip:opacity-100 transition-opacity">
                      Ara…
                    </span>
                  )}
                </div>
              </div>

              {/* Wishlist */}
              <div className="hidden sm:block relative group/tip">
                <Link
                  href="/wishlist"
                  aria-label="Favorilerim"
                  className="flex p-2.5 text-[#1A1A1A] hover:bg-gray-100 rounded-full transition-[background-color] duration-200 relative"
                >
                  <Heart className="w-[18px] h-[18px] stroke-2" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#E31E24] text-[8px] text-white flex items-center justify-center rounded-full font-black leading-none">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-[9px] font-black bg-[#1A1A1A] text-white px-2 py-0.5 rounded opacity-0 group-hover/tip:opacity-100 transition-opacity">
                  Favoriler…
                </span>
              </div>

              {/* User */}
              <div className="hidden sm:block relative group/tip">
                <Link
                  href={user ? "/profile" : "/auth/login"}
                  aria-label={user ? "Profilim" : "Giriş Yap"}
                  className="flex items-center gap-1.5 p-2.5 text-[#1A1A1A] hover:bg-gray-100 rounded-full transition-[background-color] duration-200 relative"
                >
                  <User className="w-[18px] h-[18px] stroke-2" />
                  {user ? (
                    <>
                      <span className="hidden lg:block text-[11px] font-bold">{user.name.split(" ")[0]}</span>
                      <span className="absolute top-1.5 right-1.5 lg:hidden w-2 h-2 bg-green-500 rounded-full border border-white" />
                    </>
                  ) : (
                    <span className="hidden lg:block text-[11px] font-bold">Giriş</span>
                  )}
                </Link>
                <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-[9px] font-black bg-[#1A1A1A] text-white px-2 py-0.5 rounded opacity-0 group-hover/tip:opacity-100 transition-opacity">
                  {user ? "Hesabım…" : "Giriş Yap…"}
                </span>
              </div>

              {/* Cart */}
              <div className="relative group/tip">
                <Link
                  href="/cart"
                  aria-label="Sepetim"
                  className="flex p-2.5 text-[#1A1A1A] hover:bg-gray-100 rounded-full transition-[background-color] duration-200 relative"
                >
                  <ShoppingBag className="w-[18px] h-[18px] stroke-2" />
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-4 h-4 bg-[#E31E24] text-[8px] text-white flex items-center justify-center rounded-full font-black leading-none"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
                <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-[9px] font-black bg-[#1A1A1A] text-white px-2 py-0.5 rounded opacity-0 group-hover/tip:opacity-100 transition-opacity">
                  Sepetim…
                </span>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Menü"
                className="lg:hidden p-2.5 text-[#1A1A1A] hover:bg-gray-100 rounded-full transition-[background-color]"
              >
                <Menu className="w-5 h-5 stroke-2" />
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: 40, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 40, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-4 right-4 bottom-4 w-[90%] max-w-sm bg-white z-[120] flex flex-col rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                <span
                  className="text-xl font-black tracking-tighter text-[#E31E24]"
                  style={{ fontFamily: "var(--font-heading, Montserrat, sans-serif)" }}
                >
                  Type-C
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 px-8 py-8 space-y-1 overflow-y-auto">
                {NAV_LINKS.map((link) => {
                  if (link.isDropdown) {
                    return (
                      <div key={link.name} className="overflow-hidden">
                        <button
                          onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-colors ${isCategoriesOpen ? "bg-gray-50 text-[#E31E24]" : "hover:bg-gray-50 text-[#1A1A1A]"}`}
                        >
                          <span className="text-[15px] font-bold">{link.name}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? "rotate-180 text-[#E31E24]" : "text-gray-300"}`} />
                        </button>
                        <AnimatePresence>
                          {isCategoriesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 py-2 space-y-1"
                            >
                              {categories && categories.length > 0 ? (
                                categories.map(cat => (
                                  <Link
                                    key={cat.id}
                                    href={`/products?cat=${cat.id}`}
                                    onClick={() => { setIsCategoriesOpen(false); setIsMenuOpen(false); }}
                                    className="block px-4 py-2 text-sm font-bold text-gray-500 hover:text-[#E31E24] hover:bg-gray-50 rounded-xl transition-colors"
                                  >
                                    {cat.name}
                                  </Link>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-xs font-medium text-gray-400">
                                  Kategori bulunamadı.
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  const active = link.href && pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href!}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-[background-color,color] ${active
                        ? "bg-[#1A1A1A] text-white"
                        : "hover:bg-gray-50 text-[#1A1A1A]"
                        }`}
                    >
                      <span className="text-[15px] font-bold">{link.name}</span>
                      <ChevronRight
                        className={`w-4 h-4 ${active ? "text-white/60" : "text-gray-300"}`}
                      />
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-100 space-y-3">
                {user ? (
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-2xl font-bold text-sm transition-colors"
                  >
                    <User className="w-4 h-4" />
                    {user?.name}
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full py-3.5 bg-[#1A1A1A] text-white text-center rounded-2xl font-bold text-sm hover:bg-[#E31E24] transition-colors"
                  >
                    Giriş Yap
                  </Link>
                )}
                <div className="flex items-center justify-center gap-4 text-gray-400">
                  <Link href="/faq" className="text-xs font-bold hover:text-[#1A1A1A] transition-colors">
                    Yardım
                  </Link>
                  <div className="w-1 h-1 rounded-full bg-gray-200" />
                  <Link href="/contact" className="text-xs font-bold hover:text-[#1A1A1A] transition-colors">
                    İletişim
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
