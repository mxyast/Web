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
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface TypeCNavbarProps {
  user?: {
    name: string;
    role: string;
  } | null;
}

const NAV_LINKS = [
  { name: "Yeni Gelenler", href: "/products?sort=new" },
  { name: "Çok Satanlar", href: "/products?sort=popular" },
  { name: "Koleksiyonlar", href: "/categories" },
  { name: "Kampanyalar", href: "/deals" },
];

const ANNOUNCEMENTS = [
  "🚀  1500 TL ÜZERİ ALIŞVERİŞLERDE ÜCRETSİZ KARGO",
  "✨  İLK ALIŞVERİŞE ÖZEL %10 İNDİRİM: MIOJI10",
  "⚡  AYNI GÜN HIZLI TESLİMAT SEÇENEĞİ",
];

const POPULAR_SEARCHES = ["Powerbank", "65W GaN Adaptör", "USB-C Kablo", "Baseus GaN5"];

export const TypeCNavbar = ({ user }: TypeCNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    const interval = setInterval(
      () => setAnnouncementIndex((p) => (p + 1) % ANNOUNCEMENTS.length),
      4000
    );
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  }, [isSearchOpen]);

  // Close search on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMenuOpen(false);
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
        className={`w-full fixed top-0 left-0 right-0 z-[100] transition-[box-shadow] duration-500 ${isScrolled ? "shadow-sm shadow-black/5" : ""
          }`}
      >
        {/* Announcement Bar — Full Width */}
        <div className="bg-[#1A1A1A] text-white overflow-hidden h-9 flex items-center w-full">
          <div className="w-full px-6 md:px-10 flex items-center justify-between">
            {/* Sol hızlı linkler */}
            <div className="hidden md:flex items-center gap-5">
              <Link href="/deals" className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-white/50 hover:text-[#E31E24] transition-colors">
                <Zap className="w-3 h-3" /> Kampanyalar
              </Link>
              <Link href="/products?sort=new" className="text-[10px] font-bold tracking-widest uppercase text-white/50 hover:text-white transition-colors">Yeni Gelenler</Link>
            </div>
            {/* Orta duyuru */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={announcementIndex}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap"
                >
                  {ANNOUNCEMENTS[announcementIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            {/* Sağ linkler */}
            <div className="hidden md:flex items-center gap-5">
              <Link href="/orders" className="text-[10px] font-bold tracking-widest uppercase text-white/50 hover:text-white transition-colors">Sipariş Takip</Link>
              <Link href="/contact" className="text-[10px] font-bold tracking-widest uppercase text-white/50 hover:text-white transition-colors">İletişim</Link>
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
                TYPE-C
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#E31E24] animate-pulse" />
            </Link>

            {/* Center Nav — desktop */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || pathname.startsWith(link.href.split("?")[0] + "?");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
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
                      initial={{ width: 0, opacity: 0, x: 50 }}
                      animate={{ width: "auto", opacity: 1, x: 0 }}
                      exit={{ width: 0, opacity: 0, x: 50 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="absolute right-full h-10 flex items-center bg-gray-50 rounded-full mr-2 px-4 z-[110] min-w-[280px] md:min-w-[500px] border border-gray-100"
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
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#E31E24] text-[8px] text-white flex items-center justify-center rounded-full font-black leading-none">3</span>
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
                  <motion.span
                    key={2}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-4 h-4 bg-[#E31E24] text-[8px] text-white flex items-center justify-center rounded-full font-black leading-none"
                  >
                    2
                  </motion.span>
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
              className="fixed top-4 right-4 bottom-4 w-[90%] max-w-sm bg-white z-[120] flex flex-col rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                <span
                  className="text-xl font-black tracking-tighter text-[#E31E24]"
                  style={{ fontFamily: "var(--font-heading, Montserrat, sans-serif)" }}
                >
                  TYPEC
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
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
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
                    {user.name}
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
