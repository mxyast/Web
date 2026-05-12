"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Menu,
  X,
  Search,
  ChevronRight,
  ArrowRight,
  Package,
  FileText,
  LayoutGrid,
  Phone,
  LogOut,
  Building2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface ToptanBoxNavbarProps {
  user?: {
    name: string;
    role: string;
  } | null;
}

const NAV_LINKS = [
  { name: "Katalog", href: "/catalog", icon: LayoutGrid },
  { name: "Siparişlerim", href: "/orders", icon: Package },
  { name: "Faturalarım", href: "/invoices", icon: FileText },
  { name: "Cari Hesap", href: "/account", icon: Building2 },
];

const POPULAR_SEARCHES = ["Baseus GaN5", "Powerbank 20000mAh", "USB-C Hub", "Type-C Kablo"];

export const ToptanBoxNavbar = ({ user }: ToptanBoxNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  }, [isSearchOpen]);

  useEffect(() => {
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={`w-full  fixed top-0 left-0 right-0 z-[100] transition-[box-shadow] duration-300 ${isScrolled ? "shadow-md shadow-black/20" : ""
          }`}
      >
        {/* Top Info Bar */}
        <div className="bg-slate-950 text-white h-8  md:flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 py-2 md:px-10 flex items-center justify-between">
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-white" />
                0850 123 45 67
              </span>
              <span className="text-white">|</span>
              <span className="text-white hover:text-white transition-colors">Hafta İçi 09:00 – 18:00</span>
            </div>
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
              <Link href="/apply" className="hover:text-white transition-colors">
                Bayilik Başvurusu
              </Link>
              <Link href="/faq" className="hover:text-white transition-colors">
                S.S.S
              </Link>
            </div>
          </div>
        </div>

        {/* Main Bar */}
        <div
          className={`w-full bg-white border-b border-gray-200 transition-[height] duration-300 ${isScrolled ? "h-14" : "h-[64px]"
            }`}
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-lg font-black tracking-tight text-slate-900 leading-none group-hover:text-orange-500 transition-colors"
                style={{ fontFamily: "var(--font-heading, Montserrat, sans-serif) size-3xl", fontSize: "1.5rem" }}
              >
                TOPTANBOX
              </span>
            </Link>

            {/* Center Nav — desktop */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-bold rounded-full transition-[background-color,color] duration-200 ${active
                      ? "bg-orange-500 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Search */}
              {/* Search Toggle & Integrated Bar */}
              <div className="flex items-center relative">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0, x: 0 }}
                      animate={{ width: "auto", opacity: 1, x: 0 }}

                      exit={{ width: 0, opacity: 0, x: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="relative right-full h-10 flex items-center bg-slate-100 rounded-full mr-2 px-4 z-[110] min-w-[280px] md:min-w-[500px] border border-slate-200"
                      style={{ originX: 1 }}
                    >
                      <form onSubmit={handleSearch} className="flex items-center gap-3 w-full">
                        <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          name="q"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Ürün, SKU veya kategori ara…"
                          autoComplete="off"
                          className="flex-1 text-sm font-bold text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
                        />
                        {searchQuery && (
                          <button
                            type="submit"
                            aria-label="Ara"
                            className="p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </form>
                      {/* Popular Searches as small chips */}
                      <div className="hidden lg:flex items-center gap-2 ml-4 border-l border-slate-200 pl-4">
                        {POPULAR_SEARCHES.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              router.push(`/catalog?q=${encodeURIComponent(tag)}`);
                              setIsSearchOpen(false);
                            }}
                            className="whitespace-nowrap text-[10px] font-bold text-slate-500 hover:text-orange-500 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setIsSearchOpen((p) => !p)}
                  aria-label={isSearchOpen ? "Aramayı Kapat" : "Arama Yap"}
                  className={`p-2.5 rounded-full transition-[background-color,color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-orange-500 ${isSearchOpen
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  {isSearchOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* User / Profile */}
              {user ? (
                <Link
                  href="/profile"
                  aria-label="Profilim"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full text-xs font-bold transition-[background-color]"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full text-xs font-bold transition-[background-color]"
                >
                  <User className="w-3.5 h-3.5" />
                  Giriş Yap
                </Link>
              )}

              {/* CTA — New Order */}
              <Link
                href="/catalog"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-full text-xs font-black uppercase tracking-wider transition-[background-color]"
              >
                Sipariş Ver
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Menü"
                className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-full transition-[background-color,color]"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: 40, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 40, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-4 right-4 bottom-4 w-[90%] max-w-sm bg-slate-900 z-[120] flex flex-col rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden border border-white/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-base font-black text-white tracking-tight">
                    TOPTANBOX
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-4.5 h-4.5 text-white" />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav Links */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-[background-color,color] ${active
                        ? "bg-orange-500 text-white"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      <link.icon className="w-4.5 h-4.5 shrink-0" />
                      <span className="text-[14px] font-bold flex-1">{link.name}</span>
                      <ChevronRight className={`w-4 h-4 ${active ? "text-white/60" : "text-slate-600"}`} />
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="px-4 py-5 border-t border-white/10 space-y-2">
                <Link
                  href="/catalog"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-white rounded-2xl font-black text-sm transition-colors"
                >
                  Sipariş Ver <ArrowRight className="w-4 h-4" />
                </Link>
                {user ? (
                  <button className="flex items-center justify-center gap-2 w-full py-3 text-slate-400 hover:text-red-400 text-xs font-bold transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                    Çıkış Yap
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3 text-slate-400 hover:text-white text-xs font-bold transition-colors"
                  >
                    Giriş Yap
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
